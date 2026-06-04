import { useState, useEffect } from "react"
import { supabase } from "../supabase"
import { QRCodeSVG as QRCode } from "qrcode.react"

export default function Home() {
  const [session, setSession] = useState(null)
  const [page, setPage] = useState("login") // login | register | dashboard
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [establishment, setEstablishment] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [campName, setCampName] = useState("")
  const [campReward, setCampReward] = useState("")
  const [campVisits, setCampVisits] = useState(5)

  // Verifica se já tem sessão ativa
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchEstablishment(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchEstablishment(session.user.id)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Busca estabelecimento do usuário logado
  async function fetchEstablishment(userId) {
    const { data } = await supabase
      .from("establishments")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (data) {
      setEstablishment(data)
      fetchCampaigns(data.id)
      setPage("dashboard")
    } else {
      setPage("register")
    }
  }

  async function fetchCampaigns(estId) {
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .eq("establishment_id", estId)
    setCampaigns(data || [])
  }

  // Login
  async function handleLogin() {
    if (!email || !password) {
      setMessage("Preencha email e senha.")
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage("Erro: " + error.message)
    setLoading(false)
  }

  // Cadastro de conta
  async function handleSignUp() {
    if (!email || !password) {
      setMessage("Preencha email e senha.")
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setMessage("Erro: " + error.message)
    } else {
      setMessage("Conta criada! Verifique seu email para confirmar.")
    }
    setLoading(false)
  }

  // Cadastro do estabelecimento
  async function handleRegister() {
    if (!name) {
      setMessage("Digite o nome do estabelecimento.")
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from("establishments")
      .insert([{ name, user_id: session.user.id, email: session.user.email }])
      .select()
      .single()

    if (error) {
      setMessage("Erro: " + error.message)
    } else {
      setEstablishment(data)
      fetchCampaigns(data.id)
      setPage("dashboard")
    }
    setLoading(false)
  }

  // Criar campanha
  async function handleCreateCampaign() {
    if (!campName || !campReward) {
      setMessage("Preencha todos os campos.")
      return
    }
    const { error } = await supabase
      .from("campaigns")
      .insert([{
        establishment_id: establishment.id,
        name: campName,
        reward_description: campReward,
        visits_required: campVisits
      }])

    if (error) {
      setMessage("Erro: " + error.message)
    } else {
      setMessage("")
      setCampName("")
      setCampReward("")
      setCampVisits(5)
      fetchCampaigns(establishment.id)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setSession(null)
    setEstablishment(null)
    setCampaigns([])
    setPage("login")
  }

  function getQRUrl(campaignId) {
    return `https://receiptloop.vercel.app/check-in/${campaignId}`
  }

  // Tela de login
  if (!session || page === "login") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-xl">
          <h1 className="text-3xl font-bold text-green-400 mb-2">ReceiptLoop</h1>
          <p className="text-gray-400 mb-8">Entre na sua conta</p>
          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
            />
            <button
              onClick={handleLogin}
              disabled={loading}
              className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              Criar conta
            </button>
            {message && <p className="text-center text-sm text-yellow-400">{message}</p>}
          </div>
        </div>
      </div>
    )
  }

  // Tela de cadastro do estabelecimento
  if (page === "register") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-xl">
          <h1 className="text-3xl font-bold text-green-400 mb-2">Quase lá!</h1>
          <p className="text-gray-400 mb-8">Como se chama seu estabelecimento?</p>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nome do estabelecimento"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
            />
            <button
              onClick={handleRegister}
              disabled={loading}
              className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Continuar"}
            </button>
            {message && <p className="text-center text-sm text-red-400">{message}</p>}
          </div>
        </div>
      </div>
    )
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-400">ReceiptLoop</h1>
            <p className="text-gray-400">Olá, <span className="text-white font-semibold">{establishment?.name}</span></p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-white text-sm transition-colors"
          >
            Sair
          </button>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Nova Campanha</h2>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nome da campanha (ex: Compre 5 ganhe 1)"
              value={campName}
              onChange={(e) => setCampName(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
            />
            <input
              type="text"
              placeholder="Recompensa (ex: 1 doce grátis)"
              value={campReward}
              onChange={(e) => setCampReward(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
            />
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">Visitas necessárias:</span>
              <input
                type="number"
                value={campVisits}
                onChange={(e) => setCampVisits(Number(e.target.value))}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-24 focus:outline-none focus:border-green-400"
              />
            </div>
            <button
              onClick={handleCreateCampaign}
              className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition-colors"
            >
              Criar Campanha
            </button>
            {message && <p className="text-sm text-red-400">{message}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {campaigns.length === 0 && (
            <p className="text-gray-500 text-center py-8">Nenhuma campanha criada ainda.</p>
          )}
          {campaigns.map((camp) => (
            <div key={camp.id} className="bg-gray-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{camp.name}</h3>
                <p className="text-green-400 text-sm mt-1">🎁 {camp.reward_description}</p>
                <p className="text-gray-500 text-sm mt-1">✅ {camp.visits_required} visitas pra resgatar</p>
              </div>
              <div className="bg-white p-3 rounded-xl">
                <QRCode value={getQRUrl(camp.id)} size={120} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}