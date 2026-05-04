"use client";

import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { StatCard } from "@/components/StatCard";
import { useSubscriptions } from "@/hooks/useSubscriptions";

const INVOICES = [
  { id: 1, merchant: "Amazon Marketplace", amount: 89.99, flag: "Double facturation suspectée", severity: "high" },
  { id: 2, merchant: "Free Mobile", amount: 29.99, flag: "Hausse tarifaire non notifiée", severity: "med" },
  { id: 3, merchant: "EDF", amount: 187.40, flag: "Montant +42% vs mois dernier", severity: "high" },
];

const CHART_DATA = [
  { month: "Nov", h: 30 },
  { month: "Déc", h: 60 },
  { month: "Jan", h: 45 },
  { month: "Fév", h: 90 },
  { month: "Mar", h: 65 },
  { month: "Avr", h: 85, hl: true },
];

export default function DashboardPage() {
  const router = useRouter();
  const { subscriptions } = useSubscriptions();
  const unusedCount = subscriptions.filter((s) => s.risk === "high").length;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main className="main">
        <div className="header">
          <div>
            <div className="page-title">Dashboard</div>
            <div className="page-sub">// analyse du 01 mai 2026 · 847 emails scannés</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div className="badge badge-red badge-pulse">3 alertes actives</div>
            <button className="btn btn-primary" onClick={() => router.push("/scans")}>
              Nouvelle analyse
            </button>
          </div>
        </div>

        <div className="alert-strip fade-up">
          <span className="alert-icon">🚨</span>
          <div className="alert-text">
            <div className="alert-title">Action requise — Abonnements inutilisés détectés</div>
            <div className="alert-desc">
              Adobe CC, LinkedIn Premium et Headspace — aucune activité depuis +30j → 112,97€/mois gaspillés
            </div>
          </div>
          <button className="btn btn-danger" onClick={() => router.push("/subscriptions")}>Gérer</button>
        </div>

        <div className="stat-grid">
          <StatCard label="Argent perdu / mois" value="-127€" sub="↑ +38€ vs mois dernier" icon="💰" color="red" progress={73} className="fade-up-1" />
          <StatCard label="Abonnements inutiles" value={String(unusedCount)} sub={`sur ${subscriptions.length} abonnements actifs`} icon="🔄" color="yellow" progress={43} className="fade-up-2" />
          <StatCard label="Économies potentielles" value="+1 524€" sub="sur les 12 prochains mois" icon="✅" color="green" progress={88} className="fade-up-3" />
        </div>

        <div className="two-col">
          <div className="card fade-up fade-up-2">
            <div className="card-header">
              <div>
                <div className="card-title">Argent perdu — Historique</div>
                <div className="card-sub">6 derniers mois</div>
              </div>
            </div>
            <div className="mini-chart">
              {CHART_DATA.map((d) => (
                <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div className={`bar ${d.hl ? "highlight" : ""}`} style={{ height: `${d.h}%`, width: "100%" }} />
                </div>
              ))}
            </div>
            <div className="chart-labels" style={{ marginTop: 6 }}>
              {CHART_DATA.map((d) => <span key={d.month}>{d.month}</span>)}
            </div>
          </div>

          <div className="card fade-up fade-up-3">
            <div className="card-header">
              <div>
                <div className="card-title">Factures suspectes</div>
                <div className="card-sub">{INVOICES.length} anomalies détectées</div>
              </div>
              <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => router.push("/invoices")}>
                Tout voir
              </button>
            </div>
            {INVOICES.map((inv) => (
              <div key={inv.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{inv.merchant}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{inv.flag}</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: inv.severity === "high" ? "var(--red)" : "var(--yellow)" }}>
                  {inv.amount}€
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
