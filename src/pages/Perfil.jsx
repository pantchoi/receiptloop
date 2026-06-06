import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../supabase"

function BrigadeiroPiece({ piece, size = 100, collected = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <clipPath id={`clip-perfil-${piece}`}>
          {piece === 1 && <rect x="0" y="0" width="50" height="50" />}
          {piece === 2 && <rect x="50" y="0" width="50" height="50" />}
          {piece === 3 && <rect x="0" y="50" width="50" height="50" />}
          {piece === 4 && <rect x="50" y="50" width="50" height="50" />}
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-perfil-${piece})`} opacity={collected ? 1 : 0.15}>
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
      {!collected && (
        <text x="50" y="55" textAnchor="middle" fontSize="20" fill="#ccc">?</text>
      )}
    </svg>
  )
}

export default function Perfil() {
  const { phone } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPerfil() {
      const { data: visits } = await supabase
        .from("customer_visits")
        .select("*, campaigns(*, establishments(name))")
        .eq("customer_phone", phone)
        .order("created_at", { ascending: false })

      setData(visits || [])
      setLoading(false)
    }
    fetchPerfil()
  }, [phone])

  const c = {
    primary: "#4F46E5", success: "#10B981",
    text: "#111827", muted: "#6B7280", border: "#E5E7EB", bg: "#F9FAFB", white: "#FFFFFF"
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Google Sans', sans-serif" }}>
      <p style={{ color: c.muted }}>Carregando...</p>
    </div>
  )

  // Agrupa por campanha
  const byCampaign = {}
  ;(data || []).forEach(v => {
    const cid = v.campaign_id
    if (!byCampaign[cid]) byCampaign[cid] = { campaign: v.campaigns, pieces: [], redeemed: false }
    if (v.piece_number) byCampaign[cid].pieces.push(v.piece_number)
    if (v.redeemed) byCampaign[cid].redeemed = true
  })

  const campaigns = Object.values(byCampaign)
  const uniquePieces = [...new Set((data || []).map(v => v.piece_number).filter(Boolean))]
  const totalScans = data?.length || 0

  return (
    <div style={{ minHeight: "100vh", background: "#f0ede6", fontFamily: "'Google Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: c.primary, padding: "32px 20px 24px", textAlign: "center" }}>
        <div style={{ width: "60px", height: "60px", background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: "26px" }}>👤</div>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", marginBottom: "4px" }}>Seu perfil ReceiptLoop</p>
        <p style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>+55 {phone}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "20px" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "white", fontSize: "22px", fontWeight: "700", margin: 0 }}>{totalScans}</p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", margin: 0 }}>compras</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "white", fontSize: "22px", fontWeight: "700", margin: 0 }}>{uniquePieces.length}</p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", margin: 0 }}>peças únicas</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "white", fontSize: "22px", fontWeight: "700", margin: 0 }}>{campaigns.filter(c => c.redeemed).length}</p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", margin: 0 }}>prêmios</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px 16px" }}>
        {campaigns.length === 0 ? (
          <div style={{ background: c.white, borderRadius: "16px", padding: "32px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🧩</div>
            <p style={{ fontSize: "15px", fontWeight: "600", color: c.text }}>Nenhuma peça ainda</p>
            <p style={{ fontSize: "13px", color: c.muted, marginTop: "6px" }}>Escaneie o QR da sua próxima compra pra começar a colecionar!</p>
          </div>
        ) : campaigns.map((camp, i) => {
          const uniqueCampPieces = [...new Set(camp.pieces)]
          const completed = uniqueCampPieces.length === 4

          return (
            <div key={i} style={{ background: c.white, borderRadius: "16px", padding: "20px", marginBottom: "14px", border: completed ? `2px solid ${c.success}` : `1px solid ${c.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "600", color: c.text, margin: 0 }}>{camp.campaign?.establishments?.name}</p>
                  <p style={{ fontSize: "12px", color: c.muted, margin: "3px 0 0" }}>{camp.campaign?.name}</p>
                </div>
                {completed && (
                  <span style={{ background: "#ECFDF5", color: c.success, fontSize: "11px", fontWeight: "600", padding: "4px 10px", borderRadius: "20px", border: `1px solid #A7F3D0` }}>Completo ✓</span>
                )}
              </div>

              {/* Quebra-cabeça */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", width: "fit-content", margin: "0 auto 14px", background: "#e0e0e0", padding: "2px", borderRadius: "6px" }}>
                {[1, 2, 3, 4].map(p => (
                  <div key={p} style={{ background: uniqueCampPieces.includes(p) ? c.white : "#f5f5f5", borderRadius: "4px", overflow: "hidden", position: "relative" }}>
                    <BrigadeiroPiece piece={p} size={90} collected={uniqueCampPieces.includes(p)} />
                    {!uniqueCampPieces.includes(p) && (
                      <div style={{ position: "absolute", bottom: "4px", right: "4px", background: "rgba(0,0,0,0.15)", borderRadius: "4px", padding: "2px 5px", fontSize: "9px", color: "#888" }}>?</div>
                    )}
                  </div>
                ))}
              </div>

              <p style={{ fontSize: "12px", color: c.muted, textAlign: "center", margin: 0 }}>
                {uniqueCampPieces.length}/4 peças
                {!completed && ` — faltam ${4 - uniqueCampPieces.length}`}
              </p>

              {completed && (
                <div style={{ background: "#ECFDF5", borderRadius: "10px", padding: "12px", marginTop: "12px", textAlign: "center" }}>
                  <p style={{ fontSize: "13px", color: "#065F46", fontWeight: "600", margin: 0 }}>🎁 {camp.campaign?.reward_description}</p>
                  <p style={{ fontSize: "11px", color: "#047857", margin: "4px 0 0" }}>Mostre essa tela no caixa pra resgatar!</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}