import { useState } from "react"
import { QRCodeSVG as QRCode } from "qrcode.react"

const PIECES = [
  { id: 1, label: "Peça 1", clip: "0 0 50 50" },
  { id: 2, label: "Peça 2", clip: "50 0 50 50" },
  { id: 3, label: "Peça 3", clip: "0 50 50 50" },
  { id: 4, label: "Peça 4", clip: "50 50 50 50" },
]

const FAKE_QR = "https://receiptloop.vercel.app/nota/simulacao-demo"

function ThermalReceipt({ piece, establishment, items, total, date }) {
  const mono = { fontFamily: "'Courier New', monospace" }
  const divider = "--------------------------------"

  return (
    <div style={{ ...mono, background: "#fffef5", width: "300px", padding: "20px 16px", boxShadow: "2px 4px 20px rgba(0,0,0,0.15)", position: "relative" }}>

      {/* Cabeçalho */}
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <div style={{ fontSize: "15px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase" }}>{establishment}</div>
        <div style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}>CNPJ: 00.000.000/0001-00</div>
        <div style={{ fontSize: "10px", color: "#666" }}>Hopi Hari — Vinhedo, SP</div>
        <div style={{ fontSize: "10px", color: "#444", marginTop: "4px" }}>{date}</div>
      </div>

      <div style={{ fontSize: "10px", color: "#333", marginBottom: "8px" }}>{divider}</div>
      <div style={{ fontSize: "10px", textAlign: "center", marginBottom: "8px", letterSpacing: "1px" }}>CUPOM FISCAL ELETRÔNICO</div>
      <div style={{ fontSize: "10px", color: "#333", marginBottom: "12px" }}>{divider}</div>

      {/* Itens */}
      <div style={{ marginBottom: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#888", marginBottom: "6px" }}>
          <span>ITEM / DESCRIÇÃO</span>
          <span>VL TOTAL</span>
        </div>
        {items.map((item, i) => (
          <div key={i} style={{ marginBottom: "6px" }}>
            <div style={{ fontSize: "10px", color: "#333" }}>{String(i + 1).padStart(2, "0")} {item.name.toUpperCase()}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#555" }}>
              <span>{item.qty} UN x R$ {parseFloat(item.price).toFixed(2)}</span>
              <span>R$ {(item.qty * parseFloat(item.price)).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: "10px", color: "#333", marginBottom: "8px" }}>{divider}</div>

      {/* Total */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "700", marginBottom: "4px" }}>
        <span>TOTAL</span>
        <span>R$ {parseFloat(total).toFixed(2)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#666", marginBottom: "12px" }}>
        <span>CARTÃO CRÉDITO</span>
        <span>R$ {parseFloat(total).toFixed(2)}</span>
      </div>

      <div style={{ fontSize: "10px", color: "#333", marginBottom: "12px" }}>{divider}</div>

      {/* Seção ReceiptLoop */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "1px", marginBottom: "2px" }}>★ PROGRAMA FIDELIDADE ★</div>
        <div style={{ fontSize: "9px", color: "#555" }}>Escaneie e ganhe sua peça do</div>
        <div style={{ fontSize: "10px", fontWeight: "700", color: "#333" }}>QUEBRA-CABEÇA!</div>
      </div>

      {/* QR Code */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
        <div style={{ background: "white", padding: "6px", border: "1px solid #e0e0e0" }}>
          <QRCode value={FAKE_QR} size={80} />
        </div>
      </div>

    {/* Peça do quebra-cabeça — só texto, desenho aparece ao escanear */}
    <div style={{ textAlign: "center", marginBottom: "10px" }}>
    <div style={{ fontSize: "9px", color: "#555", marginBottom: "4px" }}>SUA PEÇA #{piece} DE 4</div>
    <div style={{ border: "2px dashed #ccc", borderRadius: "4px", padding: "10px", fontSize: "9px", color: "#aaa" }}>
        Escaneie o QR acima para revelar sua peça 👆
    </div>
    <div style={{ fontSize: "8px", color: "#aaa", marginTop: "4px" }}>Complete as 4 peças e ganhe 1 brigadeiro grátis!</div>
    </div>

      <div style={{ fontSize: "10px", color: "#333", marginBottom: "8px" }}>{divider}</div>

      {/* Mensagem de descarte */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <div style={{ fontSize: "9px", color: "#555" }}>♻️ Após escanear, descarte este cupom</div>
        <div style={{ fontSize: "9px", color: "#555" }}>no lixo <strong>reciclável</strong>. Obrigado!</div>
      </div>

      <div style={{ fontSize: "10px", color: "#333", marginBottom: "8px" }}>{divider}</div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "8px", color: "#aaa" }}>Powered by ReceiptLoop</div>
        <div style={{ fontSize: "8px", color: "#aaa" }}>receiptloop.vercel.app</div>
      </div>

      {/* Efeito rasgado embaixo */}
      <div style={{ position: "absolute", bottom: "-8px", left: 0, right: 0, height: "10px", background: "#fffef5", clipPath: "polygon(0 0, 3% 100%, 6% 0, 9% 100%, 12% 0, 15% 100%, 18% 0, 21% 100%, 24% 0, 27% 100%, 30% 0, 33% 100%, 36% 0, 39% 100%, 42% 0, 45% 100%, 48% 0, 51% 100%, 54% 0, 57% 100%, 60% 0, 63% 100%, 66% 0, 69% 100%, 72% 0, 75% 100%, 78% 0, 81% 100%, 84% 0, 87% 100%, 90% 0, 93% 100%, 96% 0, 100% 100%, 100% 0)" }} />
    </div>
  )
}

function PuzzlePiece({ piece, size, collected }) {
  const half = size / 2
  const brigadeiro = (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <clipPath id={`clip-${piece}`}>
          {piece === 1 && <rect x="0" y="0" width="50" height="50" />}
          {piece === 2 && <rect x="50" y="0" width="50" height="50" />}
          {piece === 3 && <rect x="0" y="50" width="50" height="50" />}
          {piece === 4 && <rect x="50" y="50" width="50" height="50" />}
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${piece})`}>
        {/* Brigadeiro SVG */}
        <circle cx="50" cy="55" r="28" fill="#5c3317" />
        <ellipse cx="50" cy="52" rx="26" ry="24" fill="#7a4520" />
        <ellipse cx="50" cy="50" rx="24" ry="22" fill="#8B4513" />
        <ellipse cx="44" cy="44" rx="8" ry="5" fill="#a0522d" opacity="0.5" />
        <ellipse cx="50" cy="78" rx="22" ry="6" fill="#3d1f08" opacity="0.6" />
        <rect x="43" y="28" width="4" height="14" rx="2" fill="#c0c0c0" />
        <circle cx="45" cy="26" r="5" fill="#e8e8e8" />
        <circle cx="45" cy="26" r="3" fill="#ff6b6b" />
        {/* Granulado */}
        {[[35,55],[42,60],[50,58],[58,55],[63,60],[40,50],[55,48],[48,65],[60,65],[38,63]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="2" fill="#3d1f08" opacity="0.7" />
        ))}
      </g>
      {collected === false && (
        <rect x="0" y="0" width="100" height="100" fill="#e0e0e0" opacity="0.85" />
      )}
    </svg>
  )
  return brigadeiro
}

function PuzzleBoard({ collectedPieces }) {
  return (
    <div style={{ display: "inline-grid", gridTemplateColumns: "1fr 1fr", gap: "2px", background: "#ccc", padding: "2px", borderRadius: "4px" }}>
      {[1, 2, 3, 4].map(p => (
        <div key={p} style={{ background: collectedPieces.includes(p) ? "white" : "#e8e8e8", borderRadius: "2px", overflow: "hidden" }}>
          <PuzzlePiece piece={p} size={80} collected={collectedPieces.includes(p)} />
        </div>
      ))}
    </div>
  )
}

export default function Simulacao({ onBack }) {
  const [currentPiece, setCurrentPiece] = useState(1)
  const [collectedPieces, setCollectedPieces] = useState([1])
  const [view, setView] = useState("receipt") // receipt | mobile | puzzle

  const fakeItems = [
    { name: "Cookie de Chocolate", qty: 2, price: "5.00" },
    { name: "Água Mineral 500ml", qty: 1, price: "3.00" },
    { name: "Brigadeiro Gourmet", qty: 1, price: "4.50" },
  ]
  const fakeTotal = fakeItems.reduce((s, i) => s + i.qty * parseFloat(i.price), 0)
  const fakeDate = new Date().toLocaleString("pt-BR")

  function collectPiece(p) {
    if (!collectedPieces.includes(p)) setCollectedPieces([...collectedPieces, p])
    setCurrentPiece(p)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", fontFamily: "'Google Sans', sans-serif", padding: "24px 16px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
          <button onClick={onBack} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "8px 16px", cursor: "pointer", fontSize: "13px", color: "#555" }}>← Voltar</button>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111827" }}>Simulação — Como vai funcionar</h1>
            <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "2px" }}>Explore cada etapa da experiência do cliente</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
          {[
            { id: "receipt", label: "🖨️ Nota Impressa" },
            { id: "mobile", label: "📱 Tela do Cliente" },
            { id: "puzzle", label: "🧩 Quebra-Cabeça" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setView(tab.id)}
              style={{ padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "500", transition: "all 0.2s", background: view === tab.id ? "#4F46E5" : "white", color: view === tab.id ? "white" : "#555", boxShadow: view === tab.id ? "0 2px 8px rgba(79,70,229,0.3)" : "0 1px 3px rgba(0,0,0,0.08)" }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Nota Impressa */}
        {view === "receipt" && (
          <div>
            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#111827", marginBottom: "4px" }}>Cupom fiscal com QR e peça do quebra-cabeça</h2>
              <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "20px" }}>Exatamente como o cliente recebe no balcão. Simule qual peça sai em cada compra:</p>

              <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
                {[1, 2, 3, 4].map(p => (
                  <button key={p} onClick={() => setCurrentPiece(p)}
                    style={{ padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "500", background: currentPiece === p ? "#4F46E5" : "#f3f4f6", color: currentPiece === p ? "white" : "#555", transition: "all 0.15s" }}>
                    Peça {p}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "center", paddingBottom: "12px" }}>
                <ThermalReceipt
                  piece={currentPiece}
                  establishment="Rick Doces"
                  items={fakeItems}
                  total={fakeTotal}
                  date={fakeDate}
                />
              </div>
            </div>

            <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "12px", padding: "14px 18px" }}>
              <p style={{ fontSize: "13px", color: "#065F46", fontWeight: "500" }}>♻️ Impacto ambiental</p>
              <p style={{ fontSize: "13px", color: "#047857", marginTop: "4px" }}>O cliente tem um motivo pra não jogar fora na hora — ele vai querer escanear e guardar a peça. Quando descartar, a mensagem já está impressa: lixo reciclável.</p>
            </div>
          </div>
        )}

        {/* Tela do Cliente */}
        {view === "mobile" && (
          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "20px", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#111827", marginBottom: "4px" }}>O que o cliente vê ao escanear</h2>
                <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "16px" }}>A nota fiscal digital aparece no browser do celular — sem instalar app.</p>
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                  {[1, 2, 3, 4].map(p => (
                    <button key={p} onClick={() => collectPiece(p)}
                      style={{ flex: 1, padding: "8px 4px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "500", background: collectedPieces.includes(p) ? "#ECFDF5" : "#f3f4f6", color: collectedPieces.includes(p) ? "#065F46" : "#555", transition: "all 0.15s" }}>
                      {collectedPieces.includes(p) ? "✓" : ""} P{p}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: "12px", color: "#9CA3AF" }}>Clique nas peças acima pra simular o cliente coletando cada uma.</p>
              </div>

              <div style={{ background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: "12px", padding: "14px 18px" }}>
                <p style={{ fontSize: "13px", color: "#3730A3", fontWeight: "500" }}>💡 Sem app, sem cadastro complicado</p>
                <p style={{ fontSize: "13px", color: "#4338CA", marginTop: "4px" }}>O cliente só precisa do número de WhatsApp. O sistema reconhece ele automaticamente nas próximas visitas.</p>
              </div>
            </div>

            {/* Phone mockup */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: "280px", background: "#1a1a2e", borderRadius: "36px", padding: "12px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
                <div style={{ background: "#f0f0e8", borderRadius: "26px", overflow: "hidden", minHeight: "520px" }}>
                  {/* Status bar */}
                  <div style={{ background: "#1a1a2e", padding: "10px 20px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "white", fontSize: "11px" }}>9:41</span>
                    <span style={{ color: "white", fontSize: "10px" }}>●●● WiFi 🔋</span>
                  </div>

                  {/* Browser bar */}
                  <div style={{ background: "white", padding: "6px 10px", display: "flex", alignItems: "center", gap: "6px", borderBottom: "1px solid #e0e0e0" }}>
                    <div style={{ flex: 1, background: "#f3f4f6", borderRadius: "6px", padding: "4px 8px", fontSize: "9px", color: "#666" }}>receiptloop.vercel.app/nota/...</div>
                  </div>

                  {/* Nota digital */}
                  <div style={{ fontFamily: "'Courier New', monospace", background: "#fffef5", padding: "16px 12px" }}>
                    <div style={{ textAlign: "center", marginBottom: "10px" }}>
                      <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "1px" }}>RICK DOCES</div>
                      <div style={{ fontSize: "9px", color: "#888" }}>{fakeDate}</div>
                    </div>
                    <div style={{ fontSize: "9px", color: "#ccc", textAlign: "center", marginBottom: "8px" }}>- - - - - - - - - - - - -</div>

                    {fakeItems.map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", marginBottom: "4px" }}>
                        <span>{item.name}</span>
                        <span>R${(item.qty * parseFloat(item.price)).toFixed(2)}</span>
                      </div>
                    ))}

                    <div style={{ fontSize: "9px", color: "#ccc", textAlign: "center", margin: "8px 0" }}>- - - - - - - - - - - - -</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "700", marginBottom: "12px" }}>
                      <span>TOTAL</span>
                      <span>R${fakeTotal.toFixed(2)}</span>
                    </div>

                    {/* Puzzle progress */}
                    <div style={{ background: "#f0f8f0", border: "1px solid #c3e6c3", borderRadius: "8px", padding: "10px", textAlign: "center", marginBottom: "10px" }}>
                      <div style={{ fontSize: "9px", fontWeight: "700", marginBottom: "6px" }}>🧩 SEU PROGRESSO</div>
                      <div style={{ display: "flex", justifyContent: "center", gap: "3px", marginBottom: "6px" }}>
                        {[1, 2, 3, 4].map(p => (
                          <div key={p} style={{ width: "28px", height: "28px", background: collectedPieces.includes(p) ? "#10B981" : "#e0e0e0", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>
                            {collectedPieces.includes(p) ? "✓" : p}
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: "8px", color: "#555" }}>
                        {collectedPieces.length === 4 ? "🎉 Parabéns! Você ganhou!" : `${collectedPieces.length}/4 peças — faltam ${4 - collectedPieces.length}`}
                      </div>
                    </div>

                    <div style={{ fontSize: "8px", color: "#aaa", textAlign: "center" }}>♻️ Descarte no lixo reciclável</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quebra-cabeça */}
        {view === "puzzle" && (
          <div>
            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#111827", marginBottom: "4px" }}>Quebra-cabeça do Brigadeiro</h2>
              <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "20px" }}>A cada compra o cliente recebe uma peça. Ao completar as 4, ganha 1 brigadeiro grátis.</p>

              <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontSize: "12px", color: "#6B7280", marginBottom: "10px", fontWeight: "500" }}>CLIQUE PRAS PEÇAS APARECEREM:</p>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                    {[1, 2, 3, 4].map(p => (
                      <button key={p} onClick={() => collectPiece(p)}
                        style={{ padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "500", background: collectedPieces.includes(p) ? "#ECFDF5" : "#f3f4f6", color: collectedPieces.includes(p) ? "#065F46" : "#555", transition: "all 0.15s" }}>
                        {collectedPieces.includes(p) ? "✓ Peça " : "Peça "}{p}
                      </button>
                    ))}
                  </div>

                  <PuzzleBoard collectedPieces={collectedPieces} />

                  <div style={{ marginTop: "16px", background: collectedPieces.length === 4 ? "#ECFDF5" : "#F9FAFB", border: `1px solid ${collectedPieces.length === 4 ? "#A7F3D0" : "#e5e7eb"}`, borderRadius: "10px", padding: "12px 16px" }}>
                    {collectedPieces.length === 4 ? (
                      <p style={{ fontSize: "14px", color: "#065F46", fontWeight: "600" }}>🎉 Quebra-cabeça completo! Mostre pro caixa e ganhe 1 brigadeiro grátis!</p>
                    ) : (
                      <p style={{ fontSize: "13px", color: "#6B7280" }}>
                        {collectedPieces.length}/4 peças coletadas — faltam {4 - collectedPieces.length} {4 - collectedPieces.length === 1 ? "compra" : "compras"}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div style={{ background: "#EEF2FF", borderRadius: "12px", padding: "16px" }}>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: "#3730A3", marginBottom: "10px" }}>Como funciona</p>
                    {[
                      { step: "1", text: "Cliente compra e recebe a nota com a peça impressa" },
                      { step: "2", text: "Escaneia o QR antes de jogar fora" },
                      { step: "3", text: "Sistema registra a peça no perfil dele" },
                      { step: "4", text: "Com as 4 peças, mostra a tela no caixa e resgata" },
                    ].map(s => (
                      <div key={s.step} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                        <div style={{ width: "22px", height: "22px", background: "#4F46E5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "white", fontWeight: "700", flexShrink: 0 }}>{s.step}</div>
                        <p style={{ fontSize: "12px", color: "#4338CA", lineHeight: "1.5" }}>{s.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}