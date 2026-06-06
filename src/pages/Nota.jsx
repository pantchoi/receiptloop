import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../supabase"

function BrigadeiroPiece({ piece, size = 200 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <clipPath id={`clip-nota-${piece}`}>
          {piece === 1 && <rect x="0" y="0" width="50" height="50" />}
          {piece === 2 && <rect x="50" y="0" width="50" height="50" />}
          {piece === 3 && <rect x="0" y="50" width="50" height="50" />}
          {piece === 4 && <rect x="50" y="50" width="50" height="50" />}
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-nota-${piece})`}>
        <circle cx="50" cy="55" r="28" fill="#5c3317" />
        <ellipse cx="50" cy="52" rx="26" ry="24" fill="#7a4520" />
        <ellipse cx="50" cy="50" rx="24" ry="22" fill="#8B4513" />
        <ellipse cx="44" cy="44" rx="8" ry="5" fill="#a0522d" opacity="0.5" />
        <ellipse cx="50" cy="78" rx="22" ry="6" fill="#3d1f08" opacity="0.6" />
        <rect x="43" y="28" width="4" height="14" rx="2" fill="#c0c0c0" />
        <circle cx="45" cy="26" r="5" fill="#e8e8e8" />
        <circle cx="45" cy="26" r="3" fill="#ff6b6b" />
        {[[35,55],[42,60],[50,58],[58,55],[63,60],[40,50],[55,48],[48,65],[60,65],[38,63]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="2" fill="#3d1f08" opacity="0.7" />
        ))}
      </g>
    </svg>
  )
}

export default function Nota() {
  const { saleId } = useParams()
  const [sale, setSale] = useState(null)
  const [campaign, setCampaign] = useState(null)
  const [establishment, setEstablishment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [phone, setPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [piece, setPiece] = useState(null)
  const [collectedPieces, setCollectedPieces] = useState([])
  const [completed, setCompleted] = useState(false)
  const pieceRef = useRef(null)

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

    const { data: allVisits } = await supabase
      .from("customer_visits")
      .select("*")
      .eq("campaign_id", campaign.id)
      .eq("customer_phone", phone)

    const visits = allVisits || []
    const piecesAlreadyHave = visits.map(v => v.piece_number).filter(Boolean)
    const missingPieces = [1, 2, 3, 4].filter(p => !piecesAlreadyHave.includes(p))
    const pool = missingPieces.length > 0 ? missingPieces : [1, 2, 3, 4]
    const newPiece = pool[Math.floor(Math.random() * pool.length)]

    await supabase.from("customer_visits").insert([{
      campaign_id: campaign.id,
      customer_phone: phone,
      visit_count: 1,
      piece_number: newPiece
    }])

    const allPieces = [...piecesAlreadyHave, newPiece]
    const uniquePieces = [...new Set(allPieces)]
    const hasAll = uniquePieces.length === 4

    if (hasAll) {
      await supabase.from("customer_visits")
        .update({ redeemed: true })
        .eq("campaign_id", campaign.id)
        .eq("customer_phone", phone)
    }

    setPiece(newPiece)
    setCollectedPieces(uniquePieces)
    setCompleted(hasAll)
    setResult("progress")
    setSubmitting(false)
  }

  async function handleSavePiece() {
    try {
      const svg = pieceRef.current?.querySelector("svg")
      if (!svg) return
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement("canvas")
      canvas.width = 400
      canvas.height = 400
      const ctx = canvas.getContext("2d")
      const img = new Image()
      img.onload = () => {
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, 400, 400)
        ctx.drawImage(img, 0, 0, 400, 400)
        const link = document.createElement("a")
        link.download = `receiptloop-peca-${piece}.png`
        link.href = canvas.toDataURL("image/png")
        link.click()
      }
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
    } catch (e) {
      if (navigator.share) {
        navigator.share({ title: `Peça ${piece} — ReceiptLoop`, text: `Coletei a peça ${piece}! Faltam ${4 - collectedPieces.length} pra ganhar.` })
      }
    }
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#fffef5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>
      <p style={{ color: "#aaa" }}>Carregando...</p>
    </div>
  )

  if (!sale) return (
    <div style={{ minHeight: "100vh", background: "#fffef5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>
      <p style={{ color: "#e24b4a" }}>Nota não encontrada.</p>
    </div>
  )

  const now = new Date(sale.created_at)
  const dateStr = now.toLocaleDateString("pt-BR")
  const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  const mono = { fontFamily: "'Courier New', monospace" }

  return (
    <div style={{ minHeight: "100vh", background: "#f0ede6", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 12px 40px" }}>
      <div style={{ width: "100%", maxWidth: "340px" }}>
        <div style={{ ...mono, background: "#fffef5", padding: "20px 16px", boxShadow: "2px 4px 24px rgba(0,0,0,0.12)" }}>

          {/* Cabeçalho */}
          <div style={{ textAlign: "center", marginBottom: "12px" }}>
            <div style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase" }}>{establishment?.name}</div>
            <div style={{ fontSize: "10px", color: "#888", marginTop: "2px" }}>CNPJ: 00.000.000/0001-00</div>
            <div style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}>{dateStr} às {timeStr}</div>
          </div>

          <div style={{ fontSize: "10px", color: "#ccc", textAlign: "center", marginBottom: "8px" }}>--------------------------------</div>
          <div style={{ fontSize: "10px", textAlign: "center", marginBottom: "8px", letterSpacing: "1px" }}>CUPOM FISCAL ELETRÔNICO</div>
          <div style={{ fontSize: "10px", color: "#ccc", textAlign: "center", marginBottom: "12px" }}>--------------------------------</div>

          {/* Itens */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#aaa", marginBottom: "8px" }}>
              <span>ITEM / DESCRIÇÃO</span>
              <span>VL TOTAL</span>
            </div>
            {sale.items.map((item, i) => (
              <div key={i} style={{ marginBottom: "8px" }}>
                <div style={{ fontSize: "10px", color: "#333" }}>{String(i + 1).padStart(2, "0")} {item.name.toUpperCase()}</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#666" }}>
                  <span>{item.qty} UN x R$ {parseFloat(item.price).toFixed(2)}</span>
                  <span>R$ {(item.qty * parseFloat(item.price)).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: "10px", color: "#ccc", textAlign: "center", marginBottom: "8px" }}>--------------------------------</div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "700", marginBottom: "4px" }}>
            <span>TOTAL</span>
            <span>R$ {parseFloat(sale.total).toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#888", marginBottom: "16px" }}>
            <span>CARTÃO CRÉDITO</span>
            <span>R$ {parseFloat(sale.total).toFixed(2)}</span>
          </div>

          <div style={{ fontSize: "10px", color: "#ccc", textAlign: "center", marginBottom: "12px" }}>--------------------------------</div>

          {/* Seção fidelidade */}
          {completed ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>🎉</div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#10B981", marginBottom: "4px" }}>QUEBRA-CABEÇA COMPLETO!</div>
              <div style={{ fontSize: "11px", color: "#065F46", marginBottom: "12px" }}>Você coletou as 4 peças do brigadeiro!</div>
              <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "8px", padding: "10px", fontSize: "11px", color: "#065F46", marginBottom: "12px" }}>
                🎁 Mostre essa tela no caixa e ganhe:<br />
                <strong>{campaign?.reward_description}</strong>
              </div>
              <button onClick={() => window.location.href = `/perfil/${phone}`}
                style={{ ...mono, width: "100%", padding: "10px", background: "transparent", color: "#4F46E5", border: "1px solid #4F46E5", borderRadius: "8px", fontSize: "11px", fontWeight: "700", cursor: "pointer", letterSpacing: "0.5px" }}>
                VER MEU PERFIL COMPLETO →
              </button>
            </div>
          ) : result === "progress" ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "1px", marginBottom: "12px" }}>★ SUA PEÇA DO QUEBRA-CABEÇA ★</div>

              <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }} ref={pieceRef}>
                <div style={{ border: "2px dashed #10B981", padding: "8px", background: "white", borderRadius: "4px" }}>
                  <BrigadeiroPiece piece={piece} size={160} />
                </div>
              </div>

              <div style={{ fontSize: "10px", color: "#555", marginBottom: "12px" }}>
                VOCÊ GANHOU A PEÇA {piece} DE 4
              </div>

              <div style={{ marginBottom: "6px" }}>
                <div style={{ fontSize: "9px", color: "#aaa", marginBottom: "6px" }}>SUAS PEÇAS COLETADAS:</div>
                <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "4px" }}>
                  {[1, 2, 3, 4].map(p => (
                    <div key={p} style={{
                      width: "32px", height: "32px", borderRadius: "6px",
                      background: collectedPieces.includes(p) ? "#4F46E5" : "#f0f0f0",
                      border: collectedPieces.includes(p) ? "none" : "1px dashed #ccc",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: collectedPieces.includes(p) ? "14px" : "10px",
                      color: collectedPieces.includes(p) ? "white" : "#bbb",
                      fontWeight: "700", transition: "all 0.3s"
                    }}>
                      {collectedPieces.includes(p) ? "🧩" : p}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: "9px", color: "#888", marginBottom: "16px" }}>
                {4 - collectedPieces.length > 0
                  ? `Faltam ${4 - collectedPieces.length} peça${4 - collectedPieces.length > 1 ? "s" : ""} pra completar e ganhar: ${campaign?.reward_description}`
                  : "Você completou! Mostre no caixa."}
              </div>

              <button onClick={handleSavePiece}
                style={{ ...mono, width: "100%", padding: "12px", background: "#4F46E5", color: "white", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", letterSpacing: "0.5px", marginBottom: "8px" }}>
                ↓ SALVAR MINHA PEÇA
              </button>

              <button onClick={() => window.location.href = `/perfil/${phone}`}
                style={{ ...mono, width: "100%", padding: "10px", background: "transparent", color: "#4F46E5", border: "1px solid #4F46E5", borderRadius: "8px", fontSize: "11px", fontWeight: "700", cursor: "pointer", letterSpacing: "0.5px" }}>
                VER MEU PERFIL COMPLETO →
              </button>
            </div>
          ) : (
            <div>
              <div style={{ textAlign: "center", marginBottom: "12px" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "1px", marginBottom: "4px" }}>★ PROGRAMA FIDELIDADE ★</div>
                <div style={{ fontSize: "9px", color: "#555", marginBottom: "2px" }}>{campaign?.name}</div>
                <div style={{ fontSize: "10px", fontWeight: "700", color: "#333", marginBottom: "8px" }}>🎁 {campaign?.reward_description}</div>
                <div style={{ fontSize: "9px", color: "#888" }}>Digite seu WhatsApp pra revelar sua peça do quebra-cabeça!</div>
              </div>
              <input
                type="tel"
                placeholder="Seu WhatsApp (ex: 11999999999)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ ...mono, width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "12px", textAlign: "center", marginBottom: "8px", background: "white" }}
              />
              <button onClick={handleCheckIn} disabled={submitting || !phone}
                style={{ ...mono, width: "100%", padding: "12px", background: submitting || !phone ? "#e0e0e0" : "#4F46E5", color: submitting || !phone ? "#aaa" : "white", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: submitting || !phone ? "not-allowed" : "pointer", letterSpacing: "0.5px" }}>
                {submitting ? "REGISTRANDO..." : "REVELAR MINHA PEÇA ★"}
              </button>
            </div>
          )}

          <div style={{ fontSize: "10px", color: "#ccc", textAlign: "center", margin: "12px 0" }}>--------------------------------</div>

          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <div style={{ fontSize: "9px", color: "#888" }}>♻️ Após escanear, descarte este cupom</div>
            <div style={{ fontSize: "9px", color: "#888" }}>no lixo <strong>reciclável</strong>. Obrigado!</div>
          </div>

          <div style={{ fontSize: "10px", color: "#ccc", textAlign: "center", marginBottom: "8px" }}>--------------------------------</div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "8px", color: "#bbb" }}>Powered by ReceiptLoop</div>
            <div style={{ fontSize: "8px", color: "#bbb" }}>receiptloop.vercel.app</div>
          </div>
        </div>

        <div style={{ width: "100%", height: "12px", background: "#fffef5", clipPath: "polygon(0 0, 3% 100%, 6% 0, 9% 100%, 12% 0, 15% 100%, 18% 0, 21% 100%, 24% 0, 27% 100%, 30% 0, 33% 100%, 36% 0, 39% 100%, 42% 0, 45% 100%, 48% 0, 51% 100%, 54% 0, 57% 100%, 60% 0, 63% 100%, 66% 0, 69% 100%, 72% 0, 75% 100%, 78% 0, 81% 100%, 84% 0, 87% 100%, 90% 0, 93% 100%, 96% 0, 100% 100%, 100% 0)" }} />
      </div>
    </div>
  )
}