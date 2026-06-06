import { useState, useEffect } from "react"
import { supabase } from "../supabase"
import Produtos from "./Produtos"
import Caixa from "./Caixa"
import Simulacao from "./Simulacao"
import Analytics from "./Analytics"

const C = {
  primary: "#4F46E5", primaryLight: "#EEF2FF", primaryDark: "#3730A3",
  danger: "#EF4444", dangerLight: "#FEF2F2",
  success: "#10B981", successLight: "#ECFDF5",
  text: "#111827", muted: "#6B7280", border: "#E5E7EB", bg: "#F9FAFB", white: "#FFFFFF",
}

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#4F46E5" />
        <path d="M10 8h20v26l-4-3-4 3-4-3-4 3-4-3V8z" fill="white" />
        <rect x="14" y="13" width="12" height="1.5" rx="0.75" fill="#4F46E5" />
        <rect x="14" y="17" width="8" height="1.5" rx="0.75" fill="#4F46E5" />
        <rect x="14" y="21" width="10" height="1.5" rx="0.75" fill="#4F46E5" />
        <circle cx="29" cy="29" r="7" fill="#10B981" />
        <path d="M26 29l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.5px" }}>
        <span style={{ color: "#4F46E5" }}>Receipt</span><span style={{ color: "#10B981" }}>Loop</span>
      </span>
    </div>
  )
}

function AuthScreen({ onLogin, onSignUp, message, loading }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #EEF2FF 0%, #F9FAFB 50%, #F0FDF4 100%)", display: "flex", fontFamily: "'Google Sans', sans-serif" }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px", background: C.primary }}>
        <Logo />
        <h2 style={{ fontSize: "36px", fontWeight: "700", color: "white", marginTop: "40px", marginBottom: "16px", lineHeight: 1.2 }}>
          Fidelização inteligente para seu negócio
        </h2>
        <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
          Transforme cada cupom fiscal em uma experiência memorável. Clientes coletam peças, completam o quebra-cabeça e ganham prêmios.
        </p>
        <div style={{ marginTop: "48px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {["🧾 Nota fiscal digital com QR code", "🧩 Quebra-cabeça colecionável", "📊 Analytics em tempo real", "♻️ Descarte responsável"].map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: "12px", color: "rgba(255,255,255,0.9)", fontSize: "16px" }}>{f}</div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: "480px", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", background: C.white }}>
        <div style={{ width: "100%" }}>
          <h3 style={{ fontSize: "28px", fontWeight: "700", color: C.text, marginBottom: "8px" }}>{isLogin ? "Bem-vindo de volta" : "Criar conta"}</h3>
          <p style={{ fontSize: "15px", color: C.muted, marginBottom: "32px" }}>{isLogin ? "Entre na sua conta pra continuar" : "Configure seu estabelecimento grátis"}</p>

          <div style={{ display: "flex", background: C.bg, borderRadius: "12px", padding: "4px", marginBottom: "28px" }}>
            {["Entrar", "Criar conta"].map((tab, i) => (
              <button key={tab} onClick={() => setIsLogin(i === 0)}
                style={{ flex: 1, padding: "12px", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "500", cursor: "pointer", transition: "all 0.2s", background: (i === 0) === isLogin ? C.white : "transparent", color: (i === 0) === isLogin ? C.text : C.muted, boxShadow: (i === 0) === isLogin ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "8px" }}>Email</label>
              <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "14px 16px", border: `1.5px solid ${C.border}`, borderRadius: "12px", fontSize: "15px", color: C.text, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "8px" }}>Senha</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "14px 16px", border: `1.5px solid ${C.border}`, borderRadius: "12px", fontSize: "15px", color: C.text, outline: "none", boxSizing: "border-box" }} />
            </div>
            <button onClick={() => isLogin ? onLogin(email, password) : onSignUp(email, password)} disabled={loading}
              style={{ padding: "16px", background: C.primary, color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "8px", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Aguarde..." : isLogin ? "Entrar" : "Criar conta grátis"}
            </button>
            {message && <p style={{ fontSize: "14px", color: "#F59E0B", textAlign: "center", background: "#FFFBEB", padding: "12px", borderRadius: "10px" }}>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

function RegisterScreen({ onRegister, loading, message }) {
  const [name, setName] = useState("")
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Google Sans', sans-serif" }}>
      <div style={{ background: C.white, borderRadius: "20px", padding: "48px", width: "100%", maxWidth: "480px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
        <div style={{ width: "52px", height: "52px", background: C.successLight, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", fontSize: "24px" }}>🏪</div>
        <h2 style={{ fontSize: "28px", fontWeight: "700", color: C.text, marginBottom: "8px" }}>Quase lá!</h2>
        <p style={{ color: C.muted, fontSize: "16px", marginBottom: "32px" }}>Como se chama seu estabelecimento?</p>
        <input type="text" placeholder="Ex: Rick Doces" value={name} onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "16px", border: `1.5px solid ${C.border}`, borderRadius: "12px", fontSize: "16px", marginBottom: "16px", boxSizing: "border-box", outline: "none" }} />
        <button onClick={() => onRegister(name)} disabled={loading}
          style={{ width: "100%", padding: "16px", background: C.primary, color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Salvando..." : "Continuar →"}
        </button>
        {message && <p style={{ fontSize: "14px", color: C.danger, marginTop: "12px" }}>{message}</p>}
      </div>
    </div>
  )
}

const NAV_ITEMS = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "caixa", icon: "🧾", label: "Caixa" },
  { id: "produtos", icon: "🛍️", label: "Produtos" },
  { id: "analytics", icon: "📊", label: "Analytics" },
  { id: "simulacao", icon: "🧩", label: "Simulação" },
]

export default function Home() {
  const [session, setSession] = useState(null)
  const [page, setPage] = useState("login")
  const [view, setView] = useState("dashboard")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [establishment, setEstablishment] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [productCount, setProductCount] = useState(0)
  const [campName, setCampName] = useState("")
  const [campReward, setCampReward] = useState("")
  const [showNewCampaign, setShowNewCampaign] = useState(false)

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
    if (data) { setEstablishment(data); fetchCampaigns(data.id); fetchProductCount(data.id); setPage("dashboard") }
    else setPage("register")
  }

  async function fetchCampaigns(estId) {
    const { data } = await supabase.from("campaigns").select("*").eq("establishment_id", estId)
    setCampaigns(data || [])
  }

  async function fetchProductCount(estId) {
    const { count } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("establishment_id", estId).eq("active", true)
    setProductCount(count || 0)
  }

  async function handleLogin(email, password) {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage("Email ou senha incorretos.")
    setLoading(false)
  }

  async function handleSignUp(email, password) {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage("Erro: " + error.message)
    else setMessage("Conta criada! Pode entrar agora.")
    setLoading(false)
  }

  async function handleRegister(name) {
    if (!name) { setMessage("Digite o nome."); return }
    setLoading(true)
    const { data, error } = await supabase.from("establishments").insert([{ name, user_id: session.user.id, email: session.user.email }]).select().single()
    if (error) setMessage("Erro: " + error.message)
    else { setEstablishment(data); fetchCampaigns(data.id); setPage("dashboard") }
    setLoading(false)
  }

  async function handleCreateCampaign() {
    if (!campName || !campReward) { setMessage("Preencha todos os campos."); return }
    const { error } = await supabase.from("campaigns").insert([{ establishment_id: establishment.id, name: campName, reward_description: campReward, visits_required: 4 }])
    if (error) { setMessage("Erro: " + error.message); return }
    setCampName(""); setCampReward(""); setMessage(""); setShowNewCampaign(false)
    fetchCampaigns(establishment.id)
  }

  async function handleDeleteCampaign(id) {
    await supabase.from("campaigns").delete().eq("id", id)
    fetchCampaigns(establishment.id)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setSession(null); setEstablishment(null); setCampaigns([]); setPage("login"); setView("dashboard")
  }

  if (view === "produtos" && establishment) return <Produtos establishment={establishment} onBack={() => { setView("dashboard"); fetchProductCount(establishment.id) }} />
  if (view === "caixa" && establishment) return <Caixa establishment={establishment} campaigns={campaigns} onBack={() => setView("dashboard")} />
  if (view === "simulacao") return <Simulacao onBack={() => setView("dashboard")} />
  if (view === "analytics" && establishment) return <Analytics establishment={establishment} onBack={() => setView("dashboard")} />
  if (!session || page === "login") return <AuthScreen onLogin={handleLogin} onSignUp={handleSignUp} message={message} loading={loading} />
  if (page === "register") return <RegisterScreen onRegister={handleRegister} loading={loading} message={message} />

  const onboardingSteps = [
    { done: true, label: "Estabelecimento cadastrado" },
    { done: productCount > 0, label: "Produtos cadastrados", action: "produtos" },
    { done: campaigns.length > 0, label: "Campanha criada", action: "campanha" },
  ]
  const onboardingDone = onboardingSteps.every(s => s.done)

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Google Sans', sans-serif", background: C.bg, overflow: "hidden" }}>

      {/* Sidebar */}
      <div style={{ width: "240px", background: C.white, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "24px 20px 20px" }}>
          <Logo />
        </div>

        <div style={{ padding: "0 12px", flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setView(item.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", border: "none", borderRadius: "10px", marginBottom: "4px", cursor: "pointer", textAlign: "left", fontSize: "15px", fontWeight: view === item.id ? "600" : "400", background: view === item.id ? C.primaryLight : "transparent", color: view === item.id ? C.primary : C.muted, transition: "all 0.15s" }}
              onMouseEnter={(e) => { if (view !== item.id) e.currentTarget.style.background = C.bg }}
              onMouseLeave={(e) => { if (view !== item.id) e.currentTarget.style.background = "transparent" }}>
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontSize: "13px", fontWeight: "600", color: C.text, margin: "0 0 2px" }}>{establishment?.name}</p>
          <p style={{ fontSize: "12px", color: C.muted, margin: "0 0 12px" }}>{session?.user?.email}</p>
          <button onClick={handleLogout}
            style={{ width: "100%", padding: "10px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: "8px", fontSize: "13px", color: C.muted, cursor: "pointer" }}>
            Sair
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto", padding: "32px" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: C.text, margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: "15px", color: C.muted, margin: "6px 0 0" }}>Bem-vindo de volta, {establishment?.name}</p>
        </div>

        {/* Onboarding */}
        {!onboardingDone && (
          <div style={{ background: C.white, borderRadius: "16px", border: `1.5px solid #C7D2FE`, padding: "24px", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
              <div style={{ width: "44px", height: "44px", background: C.primaryLight, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🚀</div>
              <div>
                <p style={{ fontSize: "16px", fontWeight: "600", color: C.text, margin: 0 }}>Configure seu ReceiptLoop</p>
                <p style={{ fontSize: "13px", color: C.muted, margin: 0 }}>{onboardingSteps.filter(s => s.done).length} de {onboardingSteps.length} concluídos</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              {onboardingSteps.map((step, i) => (
                <div key={i} onClick={() => step.action && !step.done && setView(step.action)}
                  style={{ flex: 1, padding: "16px", borderRadius: "12px", background: step.done ? C.successLight : C.bg, border: `1px solid ${step.done ? "#A7F3D0" : C.border}`, cursor: step.action && !step.done ? "pointer" : "default", transition: "all 0.2s" }}>
                  <div style={{ fontSize: "20px", marginBottom: "8px" }}>{step.done ? "✅" : ["🏪", "🛍️", "🎯"][i]}</div>
                  <p style={{ fontSize: "13px", fontWeight: "500", color: step.done ? "#065F46" : C.text, margin: 0, textDecoration: step.done ? "line-through" : "none" }}>{step.label}</p>
                  {step.action && !step.done && <p style={{ fontSize: "12px", color: C.primary, margin: "4px 0 0" }}>Configurar →</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KPIs rápidos */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Campanhas ativas", value: campaigns.length, icon: "🎯", color: C.primary, bg: C.primaryLight },
            { label: "Produtos no cardápio", value: productCount, icon: "🛍️", color: "#8B5CF6", bg: "#F5F3FF" },
            { label: "Peças do quebra-cabeça", value: 4, icon: "🧩", color: C.success, bg: C.successLight },
          ].map(kpi => (
            <div key={kpi.label} style={{ background: C.white, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "44px", height: "44px", background: kpi.bg, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>{kpi.icon}</div>
                <span style={{ fontSize: "14px", color: C.muted, fontWeight: "500" }}>{kpi.label}</span>
              </div>
              <p style={{ fontSize: "36px", fontWeight: "700", color: kpi.color, margin: 0 }}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Campanhas */}
        <div style={{ background: C.white, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "600", color: C.text, margin: 0 }}>Campanhas de Fidelidade</h2>
              <p style={{ fontSize: "14px", color: C.muted, margin: "4px 0 0" }}>{campaigns.length} campanha{campaigns.length !== 1 ? "s" : ""} ativa{campaigns.length !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={() => setShowNewCampaign(!showNewCampaign)}
              style={{ padding: "12px 20px", background: showNewCampaign ? C.bg : C.primary, color: showNewCampaign ? C.muted : "white", border: `1px solid ${showNewCampaign ? C.border : C.primary}`, borderRadius: "10px", fontSize: "14px", fontWeight: "500", cursor: "pointer", transition: "all 0.2s" }}>
              {showNewCampaign ? "Cancelar" : "+ Nova campanha"}
            </button>
          </div>

          {showNewCampaign && (
            <div style={{ background: C.primaryLight, borderRadius: "14px", padding: "20px", marginBottom: "20px", border: `1px solid #C7D2FE` }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "8px" }}>Nome da campanha</label>
                  <input type="text" placeholder="Ex: Compre 4 ganhe 1" value={campName} onChange={(e) => setCampName(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.border}`, borderRadius: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box", background: C.white }} />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "8px" }}>Recompensa</label>
                  <input type="text" placeholder="Ex: 1 brigadeiro grátis" value={campReward} onChange={(e) => setCampReward(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.border}`, borderRadius: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box", background: C.white }} />
                </div>
              </div>
              <div style={{ background: "white", border: `1px solid #C7D2FE`, borderRadius: "10px", padding: "12px 16px", marginBottom: "16px" }}>
                <p style={{ fontSize: "13px", color: "#4338CA", margin: 0 }}>🧩 O cliente precisa colecionar <strong>4 peças diferentes</strong> do quebra-cabeça pra ganhar a recompensa.</p>
              </div>
              <button onClick={handleCreateCampaign}
                style={{ padding: "12px 24px", background: C.primary, color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                Criar Campanha
              </button>
              {message && <p style={{ fontSize: "13px", color: C.danger, marginTop: "10px" }}>{message}</p>}
            </div>
          )}

          {campaigns.length === 0 && !showNewCampaign && (
            <div style={{ textAlign: "center", padding: "48px 0", color: C.muted }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎯</div>
              <p style={{ fontSize: "16px", fontWeight: "500" }}>Nenhuma campanha ainda.</p>
              <p style={{ fontSize: "14px", marginTop: "6px" }}>Crie uma pra começar a fidelizar clientes.</p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {campaigns.map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "18px 20px", background: C.bg, borderRadius: "14px", border: `1px solid ${C.border}`, transition: "all 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#C7D2FE"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = C.border}>
                <div style={{ width: "48px", height: "48px", background: C.primaryLight, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>🎁</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "16px", fontWeight: "500", color: C.text, margin: 0 }}>{c.name}</p>
                  <p style={{ fontSize: "13px", color: C.muted, margin: "4px 0 0" }}>🎁 {c.reward_description} · 4 peças pra completar</p>
                </div>
                <button onClick={() => handleDeleteCampaign(c.id)}
                  style={{ padding: "8px 16px", background: "#FEF2F2", color: C.danger, border: `1px solid #FECACA`, borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = C.danger; e.currentTarget.style.color = "white" }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.color = C.danger }}>
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}