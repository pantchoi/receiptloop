import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../supabase"

export default function Nota() {
  const { saleId } = useParams()
  const [sale, setSale] = useState(null)
  const [campaign, setCampaign] = useState(null)
  const [establishment, setEstablishment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [phone, setPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [visitCount, setVisitCount] = useState(0)

  useEffect(() => {
    async function fetchSale() {
      const { data } = await supabase
        .from("sales")
        .select("*, campaigns(*), establishments(*)")
        .eq("id", saleId)
        .single()
      if (data) {
        setSale(data)
        setCampaign(data.campaigns)
        setEstablishment(data.establishments)
      }
      setLoading(false)
    }
    fetchSale()
  }, [saleId])

  async function handleCheckIn() {
    if (!phone) return
    setSubmitting(true)

    const { data: existing } = await supabase
      .from("customer_visits")
      .select("*")
      .eq("campaign_id", campaign.id)
      .eq("customer_phone", phone)
      .maybeSingle()

    if (existing) {
      const newCount = existing.visit_count + 1
      const shouldRedeem = newCount >= campaign.visits_required && !existing.redeemed
      await supabase.from("customer_visits").update({
        visit_count: newCount,
        redeemed: shouldRedeem ? true : existing.redeemed
      }).eq("id", existing.id)
      setVisitCount(newCount)
      setResult(shouldRedeem ? "redeemed" : "progress")
    } else {
      await supabase.from("customer_visits").insert([{
        campaign_id: campaign.id,
        customer_phone: phone,
        visit_count: 1
      }])
      setVisitCount(1)
      setResult("progress")
    }
    setSubmitting(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <p className="text-gray-400">Carregando...</p>
    </div>
  )

  if (!sale) return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <p className="text-red-400">Nota não encontrada.</p>
    </div>
  )

  const now = new Date(sale.created_at)
  const dateStr = now.toLocaleDateString("pt-BR")
  const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Nota fiscal */}
        <div className="bg-white shadow-2xl font-mono text-sm"
          style={{ borderRadius: "4px 4px 0 0" }}>

          {/* Cabeçalho */}
          <div className="text-center p-6 border-b border-dashed border-gray-300">
            <div className="text-2xl font-bold text-gray-800 tracking-widest uppercase">
              {establishment?.name}
            </div>
            <div className="text-gray-400 text-xs mt-1">CUPOM FISCAL DIGITAL</div>
            <div className="text-gray-400 text-xs mt-1">{dateStr} às {timeStr}</div>
          </div>

          {/* Itens */}
          <div className="p-4">
            <div className="flex justify-between text-gray-400 text-xs mb-2 uppercase">
              <span>Produto</span>
              <span>Qtd x Preço</span>
              <span>Total</span>
            </div>
            <div className="border-t border-dashed border-gray-200 pt-2">
              {sale.items.map((item, i) => (
                <div key={i} className="flex justify-between text-gray-700 py-1">
                  <span className="flex-1">{item.name}</span>
                  <span className="text-gray-400 mx-2">{item.qty}x{parseFloat(item.price).toFixed(2)}</span>
                  <span className="font-semibold">R${(item.qty * parseFloat(item.price)).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed border-gray-300 mt-3 pt-3 flex justify-between font-bold text-gray-800 text-base">
              <span>TOTAL</span>
              <span>R${parseFloat(sale.total).toFixed(2)}</span>
            </div>
          </div>

          {/* Seção fidelidade */}
          <div className="bg-green-50 border-t border-dashed border-gray-300 p-4">
            <div className="text-center text-green-700 font-bold text-xs uppercase tracking-widest mb-2">
              ★ Programa de Fidelidade ★
            </div>
            <div className="text-center text-gray-600 text-xs mb-3">
              {campaign?.name}
            </div>
            <div className="text-center text-green-600 text-xs font-semibold mb-4">
              🎁 {campaign?.reward_description}
            </div>

            {result === "redeemed" ? (
              <div className="text-center">
                <div className="text-4xl mb-2">🎉</div>
                <div className="text-green-700 font-bold">Parabéns! Você ganhou!</div>
                <div className="text-green-600 text-sm mt-1">{campaign?.reward_description}</div>
                <div className="text-gray-400 text-xs mt-2">Mostre essa tela no caixa</div>
              </div>
            ) : result === "progress" ? (
              <div>
                <div className="flex justify-center gap-1 mb-2">
                  {Array.from({ length: campaign?.visits_required }).map((_, i) => (
                    <span key={i} className={`text-xl ${i < visitCount ? "text-green-500" : "text-gray-300"}`}>★</span>
                  ))}
                </div>
                <div className="text-center text-gray-500 text-xs">
                  {visitCount} de {campaign?.visits_required} visitas
                  {campaign?.visits_required - visitCount > 0 && ` — faltam ${campaign?.visits_required - visitCount}`}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  type="tel"
                  placeholder="Seu WhatsApp pra acumular pontos"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-center text-gray-700 text-sm focus:outline-none focus:border-green-400 w-full"
                />
                <button
                  onClick={handleCheckIn}
                  disabled={submitting || !phone}
                  className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 rounded transition-colors disabled:opacity-50 text-sm">
                  {submitting ? "Registrando..." : "Acumular Ponto ★"}
                </button>
              </div>
            )}
          </div>

          {/* Rodapé */}
          <div className="text-center p-4 border-t border-dashed border-gray-300">
            <div className="text-gray-400 text-xs">Obrigado pela visita! Volte sempre 🙂</div>
            <div className="text-gray-300 text-xs mt-1">ReceiptLoop • receiptloop.vercel.app</div>
          </div>

        </div>

        {/* Efeito de papel rasgado embaixo */}
        <div className="w-full h-4 bg-white"
          style={{
            clipPath: "polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)"
          }} />
      </div>
    </div>
  )
}