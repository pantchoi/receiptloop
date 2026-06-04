import { useState, useEffect } from "react"
import { supabase } from "../supabase"
import Produtos from "./Produtos"
import Caixa from "./Caixa"

export default function Home() {
  const [session, setSession] = useState(null)
  const [page, setPage] = useState("login")
  const [view, setView] = useState("dashboard") // dashboard | produtos | caixa
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
    const { data } = await supabase.from("establishments").select("*").eq("user_id", userId).single()
    if (data) { setEstablishment(data); fetchCampaigns(data.id); setPage("dashboard") }
    else setPage("register")
  }

  async function fetchCampaigns(estId) {
    const { data } = await supabase.from("campaigns").select("*").eq("establishment_id", estId)
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
    else setMessage("Conta criada!")
    setLoading(false)
  }

  async function handleRegister() {
    if (!name) { setMessage("Digite o nome."); return }
    setLoading(true)
    const { data, error } = await supabase.from("establishments").insert([{ name, user_id: session.user.id, email: session.user.email }]).select().single()
    if (error) setMessage("Erro: " + error.message)
    else { setEstablishment(data); fetchCampaigns(data.id); setPage("dashboard") }
    setLoading(false)
  }

  async function handleCreateCampaign() {
    if (!campName || !campReward) { setMessage("Preencha todos os campos."); return }
    const { error } = await supabase.from("campaigns").insert([{ establishment_id: establishment.id, name: campName, reward_description: campReward, visits_required: campVisits }])
    if (error) setMessage("Erro: " + error.message)
    else { setMessage(""); setCampName(""); setCampReward(""); setCampVisits(5); fetchCampaigns(establishment.id) }
  }

  async function handleDeleteCampaign(id) {
    await supabase.from("campaigns").delete().eq("id", id)
    fetchCampaigns(establishment.id)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setSession(null); setEstablishment(null); setCampaigns([]); setPage("login")
  }

  if (view === "produtos" && establishment) return <Produtos establishment={establishment} onBack={() => setView("dashboard")} />
  if (view === "caixa" && establishment) return <Caixa establishment={establishment} campaigns={campaigns} onBack={() => setView("dashboard")} />

  if (!session || page === "login") return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", fontFamily: "sans-serif" }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "400px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1a73e8", marginBottom: "4px" }}>ReceiptLoop</h1>
        <p style={{ color: "#888", marginBottom: "24px", fontSize: "14px" }}>Entre na sua conta</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "12px 14px", border: "1px solid #e5e7eb", borderRadius: "10px", fontSize: "14px" }} />
          <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "12px 14px", border: "1px solid #e5e7eb", borderRadius: "10px", fontSize: "14px" }} />
          <button onClick={handleLogin} disabled={loading}
            style={{ padding: "12px", background: "#1a73e8", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <button onClick={handleSignUp} disabled={loading}
            style={{ padding: "12px", background: "#f3f4f6", color: "#555", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
            Criar conta
          </button>
          {message && <p style={{ textAlign: "center", fontSize: "13px", color: "#f59e0b" }}>{message}</p>}
        </div>
      </div>
    </div>
  )

  if (page === "register") return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", fontFamily: "sans-serif" }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "400px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a", marginBottom: "4px" }}>Quase lá!</h1>
        <p style={{ color: "#888", marginBottom: "24px", fontSize: "14px" }}>Como se chama seu estabelecimento?</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input type="text" placeholder="Nome do estabelecimento" value={name} onChange={(e) => setName(e.target.value)}
            style={{ padding: "12px 14px", border: "1px solid #e5e7eb", borderRadius: "10px", fontSize: "14px" }} />
          <button onClick={handleRegister} disabled={loading}
            style={{ padding: "12px", background: "#1a73e8", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
            {loading ? "Salvando..." : "Continuar"}
          </button>
          {message && <p style={{ fontSize: "13px", color: "#e24b4a" }}>{message}</p>}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", fontFamily: "sans-serif" }}>
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: "20px", fontWeight: "700", color: "#1a73e8" }}>ReceiptLoop</span>
          <span style={{ fontSize: "14px", color: "#888", marginLeft: "12px" }}>{establishment?.name}</span>
        </div>
        <button onClick={handleLogout} style={{ background: "none", border: "none", fontSize: "13px", color: "#888", cursor: "pointer" }}>Sair</button>
      </div>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "24px 16px" }}>

        {/* Ações rápidas */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "28px" }}>
          <button onClick={() => setView("caixa")}
            style={{ background: "#1a73e8", color: "white", border: "none", borderRadius: "12px", padding: "20px", cursor: "pointer", textAlign: "left" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>🧾</div>
            <div style={{ fontSize: "16px", fontWeight: "600" }}>Abrir Caixa</div>
            <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "2px" }}>Registrar vendas e gerar QR</div>
          </button>
          <button onClick={() => setView("produtos")}
            style={{ background: "white", color: "#1a1a1a", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", cursor: "pointer", textAlign: "left" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>🛍</div>
            <div style={{ fontSize: "16px", fontWeight: "600" }}>Produtos</div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>Gerenciar cardápio</div>
          </button>
        </div>

        {/* Campanhas */}
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "20px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", marginBottom: "16px" }}>Campanhas de Fidelidade</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
            {campaigns.length === 0 && <p style={{ fontSize: "13px", color: "#aaa", textAlign: "center", padding: "16px 0" }}>Nenhuma campanha ainda.</p>}
            {campaigns.map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f8fafc", borderRadius: "10px", padding: "12px 14px" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a", margin: 0 }}>{c.name}</p>
                  <p style={{ fontSize: "12px", color: "#1a73e8", margin: "2px 0 0" }}>🎁 {c.reward_description} · {c.visits_required} visitas</p>
                </div>
                <button onClick={() => handleDeleteCampaign(c.id)}
                  style={{ background: "#fff0f0", border: "1px solid #fecaca", color: "#e24b4a", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", cursor: "pointer" }}>
                  Remover
                </button>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "16px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", marginBottom: "12px" }}>Nova Campanha</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input type="text" placeholder="Nome da campanha" value={campName} onChange={(e) => setCampName(e.target.value)}
                style={{ padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px" }} />
              <input type="text" placeholder="Recompensa (ex: 1 doce grátis)" value={campReward} onChange={(e) => setCampReward(e.target.value)}
                style={{ padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "13px", color: "#888" }}>Visitas necessárias:</span>
                <input type="number" value={campVisits} onChange={(e) => setCampVisits(Number(e.target.value))}
                  style={{ width: "80px", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px" }} />
              </div>
              <button onClick={handleCreateCampaign}
                style={{ padding: "11px", background: "#1a73e8", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                Criar Campanha
              </button>
              {message && <p style={{ fontSize: "13px", color: "#e24b4a" }}>{message}</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}