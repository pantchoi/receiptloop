import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../supabase"

export default function CheckIn() {
  const { campaignId } = useParams()
  const [campaign, setCampaign] = useState(null)
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null) // null | "progress" | "redeemed"
  const [visitCount, setVisitCount] = useState(0)

  // Busca os dados da campanha pelo ID da URL
  useEffect(() => {
    async function fetchCampaign() {
      const { data } = await supabase
        .from("campaigns")
        .select("*, establishments(name)")
        .eq("id", campaignId)
        .single()
      setCampaign(data)
      setLoading(false)
    }
    fetchCampaign()
  }, [campaignId])

  async function handleCheckIn() {
    if (!phone) {
      return
    }
    setSubmitting(true)

    // Verifica se o cliente já tem visitas nessa campanha
    const { data: existing } = await supabase
      .from("customer_visits")
      .select("*")
      .eq("campaign_id", campaignId)
      .eq("customer_phone", phone)
      .single()

    if (existing) {
      // Cliente já existe — incrementa visita
      const newCount = existing.visit_count + 1
      const shouldRedeem = newCount >= campaign.visits_required && !existing.redeemed

      await supabase
        .from("customer_visits")
        .update({
          visit_count: newCount,
          redeemed: shouldRedeem ? true : existing.redeemed
        })
        .eq("id", existing.id)

      setVisitCount(newCount)
      setResult(shouldRedeem ? "redeemed" : "progress")
    } else {
      // Primeira visita do cliente
      await supabase
        .from("customer_visits")
        .insert([{
          campaign_id: campaignId,
          customer_phone: phone,
          visit_count: 1
        }])

      setVisitCount(1)
      setResult("progress")
    }

    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-red-400">Campanha não encontrada.</p>
      </div>
    )
  }

  // Tela de resultado após check-in
  if (result === "redeemed") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-sm text-center shadow-xl">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Parabéns!</h2>
          <p className="text-gray-300 mb-4">Você completou <span className="text-white font-bold">{campaign.visits_required} visitas</span> e ganhou:</p>
          <div className="bg-green-500 text-black font-bold rounded-xl py-4 px-6 text-lg mb-6">
            🎁 {campaign.reward_description}
          </div>
          <p className="text-gray-500 text-sm">Mostre essa tela no caixa para resgatar.</p>
        </div>
      </div>
    )
  }

  if (result === "progress") {
    const remaining = campaign.visits_required - visitCount
    const progress = (visitCount / campaign.visits_required) * 100

    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-sm text-center shadow-xl">
          <div className="text-5xl mb-4">⭐</div>
          <h2 className="text-2xl font-bold text-white mb-1">Visita registrada!</h2>
          <p className="text-gray-400 mb-6">{campaign.establishments.name}</p>

          {/* Barra de progresso */}
          <div className="bg-gray-800 rounded-full h-4 mb-3 overflow-hidden">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm mb-6">
            {visitCount} de {campaign.visits_required} visitas
            {remaining > 0 && ` — faltam ${remaining}`}
          </p>

          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-xs mb-1">Sua recompensa</p>
            <p className="text-green-400 font-semibold">🎁 {campaign.reward_description}</p>
          </div>
        </div>
      </div>
    )
  }

  // Tela inicial — cliente digita o WhatsApp
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-sm shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-green-400">{campaign.establishments?.name}</h1>
          <p className="text-white font-semibold mt-2">{campaign.name}</p>
          <p className="text-gray-400 text-sm mt-1">🎁 {campaign.reward_description}</p>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="tel"
            placeholder="Seu WhatsApp (ex: 11999999999)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400 text-center text-lg"
          />
          <button
            onClick={handleCheckIn}
            disabled={submitting || !phone}
            className="bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl transition-colors disabled:opacity-50 text-lg"
          >
            {submitting ? "Registrando..." : "Registrar Visita ✓"}
          </button>
        </div>

        <p className="text-gray-600 text-xs text-center mt-4">
          Seu número é usado apenas para rastrear seus pontos.
        </p>
      </div>
    </div>
  )
}