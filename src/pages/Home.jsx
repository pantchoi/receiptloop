import { useState, useEffect } from "react"
import { supabase } from "../supabase"
import Produtos from "./Produtos"
import Caixa from "./Caixa"
import Simulacao from "./Simulacao"
import Analytics from "./Analytics"

const colors = {
  primary: "#4F46E5",
  primaryLight: "#EEF2FF",
  primaryDark: "#3730A3",
  danger: "#EF4444",
  dangerLight: "#FEF2F2",
  success: "#10B981",
  successLight: "#ECFDF5",
  text: "#111827",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  bg: "#F9FAFB",
  white: "#FFFFFF",
}

const styles = {
  page: { minHeight: "100vh", background: colors.bg, fontFamily: "'Google Sans', sans-serif" },
  topbar: { background: colors.white, borderBottom: `1px solid ${colors.border}`, padding: "0 28px", display: "flex", justifyContent: "space-between", alignItems: "center", height: "60px", position: "sticky", top: 0, zIndex: 10 },
  content: { maxWidth: "720px", margin: "0 auto", padding: "32px 20px" },
  card: { background: colors.white, borderRadius: "16px", border: `1px solid ${colors.border}`, padding: "24px", marginBottom: "16px" },
  label: { fontSize: "11px", fontWeight: "600", color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" },
  input: { width: "100%", padding: "11px 14px", border: `1.5px solid ${colors.border}`, borderRadius: "10px", fontSize: "14px", color: colors.text, outline: "none", transition: "border-color 0.2s", background: colors.white },
  btnPrimary: { padding: "12px 20px", background: colors.primary, color: colors.white, border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.15s", width: "100%" },
  btnDanger: { padding: "6px 14px", background: colors.dangerLight, color: colors.danger, border: `1px solid #FECACA`, borderRadius: "8px", fontSize: "12px", fontWeight: "500", cursor: "pointer", transition: "all 0.15s" },
}

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="#4F46E5" />
        <path d="M10 8h20v26l-4-3-4 3-4-3-4 3-4-3V8z" fill="white" />
        <rect x="14" y="13" width="12" height="1.5" rx="0.75" fill="#4F46E5" />
        <rect x="14" y="17" width="8" height="1.5" rx="0.75" fill="#4F46E5" />
        <rect x="14" y="21" width="10" height="1.5" rx="0.75" fill="#4F46E5" />
        <circle cx="29" cy="29" r="7" fill="#10B981" />
        <path d="M26 29l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "-0.5px", fontFamily: "'Google Sans', sans-serif" }}>
        <span style={{ color: "#4F46E5" }}>Receipt</span><span style={{ color: "#10B981" }}>Loop</span>
      </span>
    </div>
  )
}

function OnboardingChecklist({ establishment, campaigns, products, onAction }) {
  const steps = [
    { done: !!establishment, label: "Estabelecimento cadastrado", action: null, icon: "🏪" },
    { done: products > 0, label: "Adicione seus produtos ao cardápio", action: "produtos", icon: "🛍️" },
    { done: campaigns > 0, label: "Crie uma campanha de fidelidade", action: "campanha", icon: "🎯" },
    { done: false, label: "Abra o caixa e registre sua primeira venda", action: "caixa", icon: "🧾" },
  ]
  const allDone = steps.every(s => s.done)
  if (allDone) return null

  return (
    <div style={{ background: colors.white, borderRadius: "16px", border: `1.5px solid #C7D2FE`, padding: "20px", marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <div style={{ width: "36px", height: "36px", background: colors.primaryLight, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🚀</div>
        <div>
          <p style={{ fontSize: "14px", fontWeight: "600", color: colors.text, margin: 0 }}>Configure seu ReceiptLoop</p>
          <p style={{ fontSize: "12px", color: colors.textMuted, margin: 0 }}>{steps.filter(s => s.done).length} de {steps.length} concluídos</p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {steps.map((step, i) => (
          <div key={i} onClick={() => step.action && !step.done && onAction(step.action)}
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "10px", background: step.done ? colors.successLight : colors.bg, cursor: step.action && !step.done ? "pointer" : "default", border: `1px solid ${step.done ? "#A7F3D0" : colors.border}`, transition: "all 0.2s" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: step.done ? colors.success : colors.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0 }}>
              {step.done ? "✓" : <span style={{ color: colors.textMuted }}>{i + 1}</span>}
            </div>
            <span style={{ fontSize: "13px", color: step.done ? "#065F46" : colors.text, fontWeight: step.done ? "400" : "500", flex: 1, textDecoration: step.done ? "line-through" : "none" }}>{step.icon} {step.label}</span>
            {step.action && !step.done && <span style={{ fontSize: "12px", color: colors.primary }}>→</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function AuthScreen({ onLogin, onSignUp, message, loading }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #EEF2FF 0%, #F9FAFB 50%, #F0FDF4 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <svg width="52" height="52" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="#4F46E5" />
              <path d="M10 8h20v26l-4-3-4 3-4-3-4 3-4-3V8z" fill="white" />
              <rect x="14" y="13" width="12" height="1.5" rx="0.75" fill="#4F46E5" />
              <rect x="14" y="17" width="8" height="1.5" rx="0.75" fill="#4F46E5" />
              <rect x="14" y="21" width="10" height="1.5" rx="0.75" fill="#4F46E5" />
              <circle cx="29" cy="29" r="7" fill="#10B981" />
              <path d="M26 29l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: colors.text, marginBottom: "6px", letterSpacing: "-0.5px" }}>
            <span style={{ color: "#4F46E5" }}>Receipt</span><span style={{ color: "#10B981" }}>Loop</span>
          </h1>
          <p style={{ color: colors.textMuted, fontSize: "14px" }}>Fidelização inteligente para seu negócio</p>
        </div>

        <div style={{ background: colors.white, borderRadius: "20px", padding: "32px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", border: `1px solid ${colors.border}` }}>
          <div style={{ display: "flex", background: colors.bg, borderRadius: "10px", padding: "4px", marginBottom: "24px" }}>
            {["Entrar", "Criar conta"].map((tab, i) => (
              <button key={tab} onClick={() => setIsLogin(i === 0)}
                style={{ flex: 1, padding: "8px", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: "pointer", transition: "all 0.2s", background: (i === 0) === isLogin ? colors.white : "transparent", color: (i === 0) === isLogin ? colors.text : colors.textMuted, boxShadow: (i === 0) === isLogin ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                {tab}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={styles.label}>Email</label>
              <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Senha</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
            </div>
            <button onClick={() => isLogin ? onLogin(email, password) : onSignUp(email, password)} disabled={loading}
              style={{ ...styles.btnPrimary, marginTop: "4px", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Aguarde..." : isLogin ? "Entrar" : "Criar conta"}
            </button>
            {message && <p style={{ fontSize: "13px", color: "#F59E0B", textAlign: "center", background: "#FFFBEB", padding: "10px", borderRadius: "8px" }}>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

function RegisterScreen({ onRegister, loading, message }) {
  const [name, setName] = useState("")
  return (
    <div style={{ minHeight: "100vh", background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: colors.white, borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "400px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", border: `1px solid ${colors.border}` }}>
        <div style={{ width: "44px", height: "44px", background: colors.successLight, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", fontSize: "20px" }}>🏪</div>
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: colors.text, marginBottom: "6px" }}>Quase lá!</h2>
        <p style={{ color: colors.textMuted, fontSize: "14px", marginBottom: "24px" }}>Como se chama seu estabelecimento?</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={styles.label}>Nome do estabelecimento</label>
            <input type="text" placeholder="Ex: Rick Doces" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} />
          </div>
          <button onClick={() => onRegister(name)} disabled={loading} style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Salvando..." : "Continuar →"}
          </button>
          {message && <p style={{ fontSize: "13px", color: colors.danger }}>{message}</p>}
        </div>
      </div>
    </div>
  )
}

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
    if (data) {
      setEstablishment(data)
      fetchCampaigns(data.id)
      fetchProductCount(data.id)
      setPage("dashboard")
    } else setPage("register")
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

  function handleOnboardingAction(action) {
    if (action === "produtos") setView("produtos")
    if (action === "caixa") setView("caixa")
    if (action === "campanha") setShowNewCampaign(true)
  }

  if (view === "produtos" && establishment) return <Produtos establishment={establishment} onBack={() => { setView("dashboard"); fetchProductCount(establishment.id) }} />
  if (view === "caixa" && establishment) return <Caixa establishment={establishment} campaigns={campaigns} onBack={() => setView("dashboard")} />
  if (view === "simulacao") return <Simulacao onBack={() => setView("dashboard")} />
  if (view === "analytics" && establishment) return <Analytics establishment={establishment} onBack={() => setView("dashboard")} />
  if (!session || page === "login") return <AuthScreen onLogin={handleLogin} onSignUp={handleSignUp} message={message} loading={loading} />
  if (page === "register") return <RegisterScreen onRegister={handleRegister} loading={loading} message={message} />

  return (
    <div style={styles.page}>
      {/* Topbar */}
      <div style={styles.topbar}>
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "13px", color: colors.textMuted }}>{establishment?.name}</span>
          <button onClick={handleLogout} style={{ background: "none", border: `1px solid ${colors.border}`, borderRadius: "8px", padding: "6px 14px", fontSize: "13px", color: colors.textMuted, cursor: "pointer" }}>Sair</button>
        </div>
      </div>

      <div style={styles.content}>

        {/* Onboarding */}
        <OnboardingChecklist
          establishment={establishment}
          campaigns={campaigns.length}
          products={productCount}
          onAction={handleOnboardingAction}
        />

        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          <button onClick={() => setView("caixa")}
            style={{ background: colors.primary, color: "white", border: "none", borderRadius: "16px", padding: "22px 20px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = colors.primaryDark}
            onMouseLeave={(e) => e.currentTarget.style.background = colors.primary}>
            <div style={{ fontSize: "26px", marginBottom: "10px" }}>🧾</div>
            <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "3px" }}>Abrir Caixa</div>
            <div style={{ fontSize: "12px", opacity: 0.75 }}>Registrar vendas e gerar QR</div>
          </button>

          <button onClick={() => setView("produtos")}
            style={{ background: colors.white, color: colors.text, border: `1.5px solid ${colors.border}`, borderRadius: "16px", padding: "22px 20px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.primary; e.currentTarget.style.background = colors.primaryLight }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.background = colors.white }}>
            <div style={{ fontSize: "26px", marginBottom: "10px" }}>🛍️</div>
            <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "3px" }}>Produtos</div>
            <div style={{ fontSize: "12px", color: colors.textMuted }}>Gerenciar cardápio</div>
          </button>

          <button onClick={() => setView("analytics")}
            style={{ background: colors.white, color: colors.text, border: `1.5px solid ${colors.border}`, borderRadius: "16px", padding: "22px 20px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#8B5CF6"; e.currentTarget.style.background = "#F5F3FF" }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.background = colors.white }}>
            <div style={{ fontSize: "26px", marginBottom: "10px" }}>📊</div>
            <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "3px" }}>Analytics</div>
            <div style={{ fontSize: "12px", color: colors.textMuted }}>Vendas, clientes e insights</div>
          </button>

          <button onClick={() => setView("simulacao")}
            style={{ background: colors.white, color: colors.text, border: `1.5px solid ${colors.border}`, borderRadius: "16px", padding: "22px 20px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.primary; e.currentTarget.style.background = colors.primaryLight }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.background = colors.white }}>
            <div style={{ fontSize: "26px", marginBottom: "10px" }}>🧩</div>
            <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "3px" }}>Simulação</div>
            <div style={{ fontSize: "12px", color: colors.textMuted }}>Como o cliente vive a experiência</div>
          </button>
        </div>

        {/* Campanhas */}
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: "600", color: colors.text }}>Campanhas de Fidelidade</h2>
              <p style={{ fontSize: "13px", color: colors.textMuted, marginTop: "2px" }}>{campaigns.length} campanha{campaigns.length !== 1 ? "s" : ""} ativa{campaigns.length !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={() => setShowNewCampaign(!showNewCampaign)}
              style={{ padding: "8px 16px", background: showNewCampaign ? colors.bg : colors.primary, color: showNewCampaign ? colors.textMuted : "white", border: `1px solid ${showNewCampaign ? colors.border : colors.primary}`, borderRadius: "10px", fontSize: "13px", fontWeight: "500", cursor: "pointer", transition: "all 0.2s" }}>
              {showNewCampaign ? "Cancelar" : "+ Nova campanha"}
            </button>
          </div>

          {showNewCampaign && (
            <div style={{ background: colors.primaryLight, borderRadius: "12px", padding: "18px", marginBottom: "18px", border: `1px solid #C7D2FE` }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={styles.label}>Nome da campanha</label>
                  <input type="text" placeholder="Ex: Compre 4 ganhe 1" value={campName} onChange={(e) => setCampName(e.target.value)} style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Recompensa</label>
                  <input type="text" placeholder="Ex: 1 brigadeiro grátis" value={campReward} onChange={(e) => setCampReward(e.target.value)} style={styles.input} />
                </div>
                <div style={{ background: colors.primaryLight, border: `1px solid #C7D2FE`, borderRadius: "8px", padding: "10px 12px" }}>
                  <p style={{ fontSize: "12px", color: "#4338CA", margin: 0 }}>🧩 O cliente precisa colecionar <strong>4 peças diferentes</strong> do quebra-cabeça pra ganhar a recompensa.</p>
                </div>
                <button onClick={handleCreateCampaign} style={styles.btnPrimary}>Criar Campanha</button>
                {message && <p style={{ fontSize: "13px", color: colors.danger }}>{message}</p>}
              </div>
            </div>
          )}

          {campaigns.length === 0 && !showNewCampaign && (
            <div style={{ textAlign: "center", padding: "32px 0", color: colors.textMuted }}>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>🎯</div>
              <p style={{ fontSize: "14px" }}>Nenhuma campanha ainda.</p>
              <p style={{ fontSize: "13px", marginTop: "4px" }}>Crie uma pra começar a fidelizar clientes.</p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {campaigns.map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", background: colors.bg, borderRadius: "12px", border: `1px solid ${colors.border}`, transition: "all 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#C7D2FE"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.border}>
                <div style={{ width: "40px", height: "40px", background: colors.primaryLight, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>🎁</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "14px", fontWeight: "500", color: colors.text, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</p>
                  <p style={{ fontSize: "12px", color: colors.textMuted, margin: "3px 0 0" }}>🎁 {c.reward_description} · 4 peças</p>
                </div>
                <button onClick={() => handleDeleteCampaign(c.id)} style={styles.btnDanger}
                  onMouseEnter={(e) => { e.currentTarget.style.background = colors.danger; e.currentTarget.style.color = "white" }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = colors.dangerLight; e.currentTarget.style.color = colors.danger }}>
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