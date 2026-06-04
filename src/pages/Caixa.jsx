import { useState, useEffect } from "react"
import { supabase } from "../supabase"
import { QRCodeSVG as QRCode } from "qrcode.react"

export default function Caixa({ establishment, campaigns, onBack }) {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({})
  const [selectedCampaign, setSelectedCampaign] = useState("")
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [currentQR, setCurrentQR] = useState(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
    if (campaigns.length > 0) setSelectedCampaign(campaigns[0].id)
  }, [])

  async function fetchProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("establishment_id", establishment.id)
      .eq("active", true)
    setProducts(data || [])
  }

  const categories = ["Todos", ...new Set(products.map(p => p.category))]
  const filtered = activeCategory === "Todos" ? products : products.filter(p => p.category === activeCategory)

  function addToCart(product) {
    setCart(prev => ({
      ...prev,
      [product.id]: {
        ...product,
        qty: (prev[product.id]?.qty || 0) + 1
      }
    }))
  }

  function changeQty(id, delta) {
    setCart(prev => {
      const current = prev[id]
      if (!current) return prev
      const newQty = current.qty + delta
      if (newQty <= 0) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: { ...current, qty: newQty } }
    })
  }

  function clearCart() {
    setCart({})
    setCurrentQR(null)
    setMessage("")
  }

  const cartItems = Object.values(cart)
  const total = cartItems.reduce((sum, i) => sum + parseFloat(i.price) * i.qty, 0)

  async function handleGenerateQR() {
    if (cartItems.length === 0) { setMessage("Adicione pelo menos 1 produto."); return }
    if (!selectedCampaign) { setMessage("Selecione uma campanha."); return }
    setLoading(true)

    const items = cartItems.map(i => ({ name: i.name, qty: i.qty, price: parseFloat(i.price), image_url: i.image_url }))

    const { data, error } = await supabase
      .from("sales")
      .insert([{
        establishment_id: establishment.id,
        campaign_id: selectedCampaign,
        items,
        total
      }])
      .select().single()

    if (error) {
      setMessage("Erro: " + error.message)
    } else {
      setCurrentQR(`https://receiptloop.vercel.app/nota/${data.id}`)
    }
    setLoading(false)
  }

  return (
    <div style={{ fontFamily: "sans-serif", height: "100vh", display: "flex", flexDirection: "column", background: "#f0f2f5" }}>

      {/* Topbar */}
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", color: "#555" }}>← Voltar</button>
          <span style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a" }}>{establishment.name}</span>
        </div>
        <select value={selectedCampaign} onChange={(e) => setSelectedCampaign(e.target.value)}
          style={{ padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", color: "#1a1a1a", background: "white" }}>
          {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 320px", overflow: "hidden" }}>

        {/* Produtos */}
        <div style={{ padding: "16px", overflowY: "auto" }}>
          {/* Categorias */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{ padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "500", background: activeCategory === cat ? "#1a73e8" : "white", color: activeCategory === cat ? "white" : "#555", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de produtos */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px" }}>
            {filtered.map(p => (
              <button key={p.id} onClick={() => addToCart(p)}
                style={{ background: "white", border: cart[p.id] ? "2px solid #1a73e8" : "1px solid #e5e7eb", borderRadius: "12px", padding: "12px 8px", cursor: "pointer", textAlign: "center", transition: "all 0.1s", position: "relative" }}>
                {cart[p.id] && (
                  <div style={{ position: "absolute", top: "6px", right: "6px", background: "#1a73e8", color: "white", borderRadius: "50%", width: "20px", height: "20px", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {cart[p.id].qty}
                  </div>
                )}
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} style={{ width: "72px", height: "72px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} />
                  : <div style={{ width: "72px", height: "72px", background: "#f3f4f6", borderRadius: "8px", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>🛍</div>
                }
                <p style={{ fontSize: "12px", fontWeight: "500", color: "#1a1a1a", margin: "0 0 2px" }}>{p.name}</p>
                <p style={{ fontSize: "12px", color: "#1a73e8", margin: 0 }}>R$ {parseFloat(p.price).toFixed(2)}</p>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", color: "#aaa", fontSize: "14px", padding: "48px 0" }}>
              Nenhum produto cadastrado. Vá em Gerenciar Produtos para adicionar.
            </div>
          )}
        </div>

        {/* Carrinho */}
        <div style={{ background: "white", borderLeft: "1px solid #e5e7eb", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px", borderBottom: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>Pedido atual</h3>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
            {cartItems.length === 0 ? (
              <p style={{ textAlign: "center", color: "#aaa", fontSize: "13px", padding: "32px 0" }}>Toque num produto para adicionar</p>
            ) : cartItems.map(item => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                {item.image_url
                  ? <img src={item.image_url} alt={item.name} style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "6px" }} />
                  : <div style={{ width: "36px", height: "36px", background: "#f3f4f6", borderRadius: "6px" }} />
                }
                <span style={{ flex: 1, fontSize: "13px", color: "#1a1a1a" }}>{item.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <button onClick={() => changeQty(item.id, -1)} style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                  <span style={{ fontSize: "13px", fontWeight: "500", width: "20px", textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => changeQty(item.id, 1)} style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                </div>
                <span style={{ fontSize: "13px", fontWeight: "500", color: "#1a1a1a", minWidth: "52px", textAlign: "right" }}>R$ {(parseFloat(item.price) * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: "14px 16px", borderTop: "1px solid #e5e7eb" }}>
            {/* Barra fidelidade */}
            <div style={{ background: "#e8f5e9", borderRadius: "8px", padding: "8px 12px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "13px" }}>★</span>
              <span style={{ fontSize: "12px", color: "#2e7d32" }}>Cliente acumula ponto ao escanear o QR</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", color: "#888" }}>Total</span>
              <span style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a" }}>R$ {total.toFixed(2)}</span>
            </div>

            {currentQR ? (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "13px", color: "#555", marginBottom: "10px" }}>Mostre pro cliente escanear</p>
                <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px", display: "inline-block", marginBottom: "10px" }}>
                  <QRCode value={currentQR} size={160} />
                </div>
                <br />
                <button onClick={clearCart} style={{ width: "100%", padding: "10px", background: "none", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", color: "#555", cursor: "pointer" }}>
                  Nova venda
                </button>
              </div>
            ) : (
              <>
                <button onClick={handleGenerateQR} disabled={loading || cartItems.length === 0}
                  style={{ width: "100%", padding: "13px", background: cartItems.length === 0 ? "#f3f4f6" : "#1a73e8", color: cartItems.length === 0 ? "#aaa" : "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: cartItems.length === 0 ? "not-allowed" : "pointer" }}>
                  {loading ? "Gerando..." : "Gerar QR da Nota"}
                </button>
                <button onClick={clearCart} style={{ width: "100%", padding: "8px", background: "none", border: "none", fontSize: "12px", color: "#aaa", cursor: "pointer", marginTop: "6px" }}>
                  Limpar pedido
                </button>
              </>
            )}
            {message && <p style={{ fontSize: "12px", color: "#e24b4a", marginTop: "8px", textAlign: "center" }}>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}