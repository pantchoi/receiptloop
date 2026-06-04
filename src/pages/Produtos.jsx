import { useState, useEffect } from "react"
import { supabase } from "../supabase"

export default function Produtos({ establishment, onBack }) {
  const [products, setProducts] = useState([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Geral")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("establishment_id", establishment.id)
      .eq("active", true)
      .order("category")
    setProducts(data || [])
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleAddProduct() {
    if (!name || !price) { setMessage("Preencha nome e preço."); return }
    setLoading(true)

    let imageUrl = null

    if (imageFile) {
      const ext = imageFile.name.split(".").pop()
      const path = `${establishment.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(path, imageFile)

      if (uploadError) {
        setMessage("Erro no upload: " + uploadError.message)
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(path)
      imageUrl = urlData.publicUrl
    }

    const { error } = await supabase.from("products").insert([{
      establishment_id: establishment.id,
      name,
      price: parseFloat(price),
      category,
      image_url: imageUrl
    }])

    if (error) {
      setMessage("Erro: " + error.message)
    } else {
      setMessage("")
      setName("")
      setPrice("")
      setCategory("Geral")
      setImageFile(null)
      setImagePreview(null)
      fetchProducts()
    }
    setLoading(false)
  }

  async function handleDelete(id) {
    await supabase.from("products").update({ active: false }).eq("id", id)
    fetchProducts()
  }

  const categories = [...new Set(products.map(p => p.category))]

  return (
    <div style={{ fontFamily: "sans-serif", padding: "16px", maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid #ddd", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontSize: "13px", color: "#555" }}>
          ← Voltar
        </button>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1a1a1a" }}>Gerenciar Produtos</h2>
      </div>

      {/* Formulário */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "16px", color: "#1a1a1a" }}>Novo Produto</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>Nome</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Cookie de chocolate"
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px" }} />
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>Preço (R$)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0,00"
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px" }} />
          </div>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>Categoria</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex: Doces, Bebidas, Salgados"
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px" }} />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>Foto do produto</label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <label style={{ background: "#f3f4f6", border: "1px dashed #d1d5db", borderRadius: "8px", padding: "10px 16px", cursor: "pointer", fontSize: "13px", color: "#555" }}>
              {imageFile ? "Trocar foto" : "Escolher foto"}
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
            </label>
            {imagePreview && (
              <img src={imagePreview} alt="preview"
                style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e5e7eb" }} />
            )}
          </div>
        </div>

        <button onClick={handleAddProduct} disabled={loading}
          style={{ width: "100%", padding: "12px", background: "#1a73e8", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
          {loading ? "Salvando..." : "Adicionar Produto"}
        </button>
        {message && <p style={{ marginTop: "8px", fontSize: "13px", color: "#e24b4a" }}>{message}</p>}
      </div>

      {/* Lista de produtos */}
      {categories.map(cat => (
        <div key={cat} style={{ marginBottom: "20px" }}>
          <h4 style={{ fontSize: "13px", fontWeight: "600", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>{cat}</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {products.filter(p => p.category === cat).map(p => (
              <div key={p.id} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "8px" }} />
                  : <div style={{ width: "48px", height: "48px", background: "#f3f4f6", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🛍</div>
                }
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a", margin: 0 }}>{p.name}</p>
                  <p style={{ fontSize: "13px", color: "#1a73e8", margin: 0 }}>R$ {parseFloat(p.price).toFixed(2)}</p>
                </div>
                <button onClick={() => handleDelete(p.id)}
                  style={{ background: "#fff0f0", border: "1px solid #fecaca", color: "#e24b4a", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", cursor: "pointer" }}>
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {products.length === 0 && (
        <p style={{ textAlign: "center", color: "#aaa", fontSize: "14px", padding: "32px 0" }}>Nenhum produto cadastrado ainda.</p>
      )}
    </div>
  )
}