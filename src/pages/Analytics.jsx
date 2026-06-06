import { useState, useEffect } from "react"
import { supabase } from "../supabase"

export default function Analytics({ establishment, onBack }) {
  const [stats, setStats] = useState(null)
  const [topProducts, setTopProducts] = useState([])
  const [recentSales, setRecentSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAnalytics() }, [])

  async function fetchAnalytics() {
    const estId = establishment.id

    // Vendas
    const { data: sales } = await supabase
      .from("sales")
      .select("*")
      .eq("establishment_id", estId)
      .order("created_at", { ascending: false })

    // Visitas (clientes únicos e peças)
    const { data: visits } = await supabase
      .from("customer_visits")
      .select("*")
      .eq("campaign_id", establishment.id)

    // Todos os customer_visits da campanha do estabelecimento
    const { data: campaigns } = await supabase
      .from("campaigns")
      .select("id")
      .eq("establishment_id", estId)

    const campIds = (campaigns || []).map(c => c.id)

    const { data: allVisits } = await supabase
      .from("customer_visits")
      .select("*")
      .in("campaign_id", campIds.length > 0 ? campIds : ["none"])

    const totalSales = sales?.length || 0
    const totalRevenue = (sales || []).reduce((s, sale) => s + parseFloat(sale.total || 0), 0)
    const uniqueCustomers = new Set((allVisits || []).map(v => v.customer_phone)).size
    const completedPuzzles = (allVisits || []).filter(v => v.redeemed).length

    // Top produtos
    const productCount = {}
    ;(sales || []).forEach(sale => {
      (sale.items || []).forEach(item => {
        if (!productCount[item.name]) productCount[item.name] = { name: item.name, qty: 0, revenue: 0 }
        productCount[item.name].qty += item.qty
        productCount[item.name].revenue += item.qty * parseFloat(item.price)
      })
    })
    const sorted = Object.values(productCount).sort((a, b) => b.qty - a.qty).slice(0, 5)

    setStats({ totalSales, totalRevenue, uniqueCustomers, completedPuzzles })
    setTopProducts(sorted)
    setRecentSales((sales || []).slice(0, 8))
    setLoading(false)
  }

  const c = {
    primary: "#4F46E5", success: "#10B981", warning: "#F59E0B",
    text: "#111827", muted: "#6B7280", border: "#E5E7EB", bg: "#F9FAFB", white: "#FFFFFF"
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Google Sans', sans-serif" }}>
      <p style={{ color: c.muted }}>Carregando analytics...</p>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: c.bg, fontFamily: "'Google Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: c.white, borderBottom: `1px solid ${c.border}`, padding: "0 24px", height: "60px", display: "flex", alignItems: "center", gap: "16px", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: `1px solid ${c.border}`, borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "13px", color: c.muted }}>← Voltar</button>
        <div>
          <span style={{ fontSize: "16px", fontWeight: "600", color: c.text }}>Analytics</span>
          <span style={{ fontSize: "13px", color: c.muted, marginLeft: "8px" }}>{establishment.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "28px 20px" }}>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          {[
            { label: "Vendas realizadas", value: stats.totalSales, icon: "🧾", color: c.primary, bg: "#EEF2FF" },
            { label: "Receita total", value: `R$ ${stats.totalRevenue.toFixed(2)}`, icon: "💰", color: c.success, bg: "#ECFDF5" },
            { label: "Clientes únicos", value: stats.uniqueCustomers, icon: "👤", color: c.warning, bg: "#FFFBEB" },
            { label: "Quebra-cabeças completos", value: stats.completedPuzzles, icon: "🧩", color: "#8B5CF6", bg: "#F5F3FF" },
          ].map(kpi => (
            <div key={kpi.label} style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: "14px", padding: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{ width: "36px", height: "36px", background: kpi.bg, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{kpi.icon}</div>
                <span style={{ fontSize: "12px", color: c.muted, fontWeight: "500" }}>{kpi.label}</span>
              </div>
              <div style={{ fontSize: "26px", fontWeight: "700", color: kpi.color }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Top Produtos */}
        <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: c.text, marginBottom: "16px" }}>🏆 Produtos mais vendidos</h2>
          {topProducts.length === 0 ? (
            <p style={{ fontSize: "13px", color: c.muted, textAlign: "center", padding: "20px 0" }}>Nenhuma venda ainda.</p>
          ) : topProducts.map((p, i) => {
            const maxQty = topProducts[0].qty
            const pct = Math.round((p.qty / maxQty) * 100)
            return (
              <div key={p.name} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "500", color: c.text }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "  "} {p.name}
                  </span>
                  <span style={{ fontSize: "12px", color: c.muted }}>{p.qty} un · R$ {p.revenue.toFixed(2)}</span>
                </div>
                <div style={{ background: "#f3f4f6", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: i === 0 ? c.primary : "#C7D2FE", borderRadius: "4px", transition: "width 0.5s" }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Vendas recentes */}
        <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: "14px", padding: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: c.text, marginBottom: "16px" }}>🕐 Vendas recentes</h2>
          {recentSales.length === 0 ? (
            <p style={{ fontSize: "13px", color: c.muted, textAlign: "center", padding: "20px 0" }}>Nenhuma venda ainda.</p>
          ) : recentSales.map(sale => {
            const d = new Date(sale.created_at)
            return (
              <div key={sale.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${c.border}` }}>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: "500", color: c.text, margin: 0 }}>
                    {(sale.items || []).map(i => i.name).join(", ").slice(0, 40)}{(sale.items || []).map(i => i.name).join(", ").length > 40 ? "..." : ""}
                  </p>
                  <p style={{ fontSize: "11px", color: c.muted, margin: "2px 0 0" }}>
                    {d.toLocaleDateString("pt-BR")} às {d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <span style={{ fontSize: "14px", fontWeight: "600", color: c.success }}>R$ {parseFloat(sale.total).toFixed(2)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}