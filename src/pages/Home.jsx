import { useState } from "react"
import { supabase } from "../supabase"
import { QRCodeSVG as QRCode } from "qrcode.react"

export default function Home() {
  const [page, setPage] = useState("register")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [establishment, setEstablishment] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [campName, setCampName] = useState("")
  const [campReward, setCampReward] = useState("")
  const [campVisits, setCampVisits] = useState(5)

  async function fetchCampaigns(estId) {
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .eq("establishment_id", estId)
    setCampaigns(data || [])
  }

  async function handleRegister() {
    if (!name || !email) {
      setMessage("Preencha todos os campos.")
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from("establishments")
      .insert([{ name, email }])
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

  async function handleCreateCampaign() {
    if (!campName || !campReward) {
      setMessage("Preencha todos os campos da campanha.")
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

  function getQRUrl(campaignId) {
    return `${window.location.origin}/check-in/${campaignId}`
  }

  if (page === "register") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-xl">
          <h1 className="text-3xl font-bold text-green-400 mb-2">ReceiptLoop</h1>
          <p className="text-gray-400 mb-8">Cadastre seu estabelecimento</p>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nome do estabelecimento"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
            />
            <button
              onClick={handleRegister}
              disabled={loading}
              className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
            {message && <p className="text-center text-sm text-red-400">{message}</p>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-400">ReceiptLoop</h1>
          <p className="text-gray-400">Olá, <span className="text-white font-semibold">{establishment?.name}</span></p>
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
                <p className="text-gray-600 text-xs mt-2 break-all">{getQRUrl(camp.id)}</p>
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