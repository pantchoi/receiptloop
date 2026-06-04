import { useState, useEffect } from "react"
import { supabase } from "../supabase"
import { QRCodeSVG as QRCode } from "qrcode.react"

export default function Home() {
  const [session, setSession] = useState(null)
  const [page, setPage] = useState("login")
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
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [items, setItems] = useState([{ name: "", qty: 1, price: "" }])
  const [currentQR, setCurrentQR] = useState(null)

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

  async function handleLogin() {
    if (!email || !password) { setMessage("Preencha email e senha."); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage("Erro: " + error.message)
    setLoading(false)
  }

  async function handleSignUp() {
    if (!email || !password) { setMessage("Preencha email e senha."); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage("Erro: " + error.message)
    else setMessage("Conta criada! Verifique seu email.")
    setLoading(false)
  }

  async function handleRegister() {
    if (!name) { setMessage("Digite o nome."); return }
    setLoading(true)
    const { data, error } = await supabase
      .from("establishments")
      .insert([{ name, user_id: session.user.id, email: session.user.email }])
      .select().single()
    if (error) setMessage("Erro: " + error.message)
    else { setEstablishment(data); fetchCampaigns(data.id); setPage("dashboard") }
    setLoading(false)
  }

  async function handleCreateCampaign() {
    if (!campName || !campReward) { setMessage("Preencha todos os campos."); return }
    const { error } = await supabase.from("campaigns").insert([{
      establishment_id: establishment.id,
      name: campName,
      reward_description: campReward,
      visits_required: campVisits
    }])
    if (error) setMessage("Erro: " + error.message)
    else { setMessage(""); setCampName(""); setCampReward(""); setCampVisits(5); fetchCampaigns(establishment.id) }
  }

  // Registra a venda e gera QR único pra essa compra
  async function handleRegisterSale() {
    const validItems = items.filter(i => i.name && i.price)
    if (!selectedCampaign || validItems.length === 0) {
      setMessage("Selecione uma campanha e adicione pelo menos 1 item.")
      return
    }
    const total = validItems.reduce((sum, i) => sum + (parseFloat(i.price) * i.qty), 0)
    const { data, error } = await supabase
      .from("sales")
      .insert([{
        establishment_id: establishment.id,
        campaign_id: selectedCampaign,
        items: validItems,
        total
      }])
      .select().single()

    if (error) setMessage("Erro: " + error.message)
    else {
      setCurrentQR(`https://receiptloop.vercel.app/nota/${data.id}`)
      setItems([{ name: "", qty: 1, price: "" }])
      setMessage("")
    }
  }

  function addItem() {
    setItems([...items, { name: "", qty: 1, price: "" }])
  }

  function updateItem(index, field, value) {
    const updated = [...items]
    updated[index][field] = value
    setItems(updated)
  }

  function removeItem(index) {
    setItems(items.filter((_, i) => i !== index))
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setSession(null); setEstablishment(null); setCampaigns([]); setPage("login")
  }

  // Tela de login
  if (!session || page === "login") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-xl">
          <h1 className="text-3xl font-bold text-green-400 mb-2">ReceiptLoop</h1>
          <p className="text-gray-400 mb-8">Entre na sua conta</p>
          <div className="flex flex-col gap-4">
            <input type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400" />
            <input type="password" placeholder="Senha" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400" />
            <button onClick={handleLogin} disabled={loading}
              className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <button onClick={handleSignUp} disabled={loading}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors">
              Criar conta
            </button>
            {message && <p className="text-center text-sm text-yellow-400">{message}</p>}
          </div>
        </div>
      </div>
    )
  }

  // Tela de cadastro
  if (page === "register") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-xl">
          <h1 className="text-3xl font-bold text-green-400 mb-2">Quase lá!</h1>
          <p className="text-gray-400 mb-8">Como se chama seu estabelecimento?</p>
          <div className="flex flex-col gap-4">
            <input type="text" placeholder="Nome do estabelecimento" value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400" />
            <button onClick={handleRegister} disabled={loading}
              className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
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

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-400">ReceiptLoop</h1>
            <p className="text-gray-400">Olá, <span className="text-white font-semibold">{establishment?.name}</span></p>
          </div>
          <button onClick={handleLogout} className="text-gray-500 hover:text-white text-sm">Sair</button>
        </div>

        {/* Registrar venda */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🧾 Registrar Venda</h2>

          <label className="text-gray-400 text-sm mb-2 block">Campanha</label>
          <select value={selectedCampaign || ""} onChange={(e) => setSelectedCampaign(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-full mb-4 focus:outline-none focus:border-green-400">
            <option value="">Selecione uma campanha</option>
            {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <label className="text-gray-400 text-sm mb-2 block">Itens da compra</label>
          <div className="flex flex-col gap-2 mb-3">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input type="text" placeholder="Produto" value={item.name}
                  onChange={(e) => updateItem(i, "name", e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white placeholder-gray-500 flex-1 focus:outline-none focus:border-green-400" />
                <input type="number" placeholder="Qtd" value={item.qty}
                  onChange={(e) => updateItem(i, "qty", parseInt(e.target.value))}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white w-16 focus:outline-none focus:border-green-400" />
                <input type="number" placeholder="R$" value={item.price}
                  onChange={(e) => updateItem(i, "price", e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white w-24 focus:outline-none focus:border-green-400" />
                {items.length > 1 && (
                  <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-300 text-xl">×</button>
                )}
              </div>
            ))}
          </div>

          <button onClick={addItem} className="text-green-400 text-sm hover:text-green-300 mb-4">+ Adicionar item</button>

          <button onClick={handleRegisterSale}
            className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition-colors w-full">
            Gerar QR da Nota
          </button>
          {message && <p className="text-sm text-red-400 mt-2">{message}</p>}
        </div>

        {/* QR gerado */}
        {currentQR && (
          <div className="bg-gray-900 rounded-2xl p-6 mb-6 flex flex-col items-center gap-4">
            <h2 className="text-xl font-bold text-green-400">QR Code da Venda</h2>
            <p className="text-gray-400 text-sm text-center">Mostre ou imprima esse QR pro cliente escanear</p>
            <div className="bg-white p-4 rounded-xl">
              <QRCodeSVG value={currentQR} size={180} />
            </div>
            <p className="text-gray-600 text-xs text-center break-all">{currentQR}</p>
            <button onClick={() => setCurrentQR(null)}
              className="text-gray-500 hover:text-white text-sm">
              Limpar e registrar nova venda
            </button>
          </div>
        )}

        {/* Criar campanha */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Nova Campanha</h2>
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="Nome da campanha" value={campName}
              onChange={(e) => setCampName(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400" />
            <input type="text" placeholder="Recompensa (ex: 1 doce grátis)" value={campReward}
              onChange={(e) => setCampReward(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400" />
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">Visitas necessárias:</span>
              <input type="number" value={campVisits}
                onChange={(e) => setCampVisits(Number(e.target.value))}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-24 focus:outline-none focus:border-green-400" />
            </div>
            <button onClick={handleCreateCampaign}
              className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition-colors">
              Criar Campanha
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}