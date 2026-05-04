"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PaywallProps {
  savingsFound?: number;
  onProceed?: () => void;
}

export function Paywall({ savingsFound = 127, onProceed }: PaywallProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      // Fallback for demo: go straight to dashboard
      if (onProceed) onProceed();
      else router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const annualSavings = savingsFound * 12;

  return (
    <div className="paywall-card">
      <div style={{ fontSize: 14, color: "var(--text-dim)" }}>💸 Argent perdu détecté</div>
      <div className="paywall-amount">-{savingsFound}€</div>
      <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 24 }}>
        3 abonnements inutiles · 2 factures suspectes · chaque mois
      </div>

      <div style={{ background: "var(--surface2)", borderRadius: "var(--radius)", padding: "16px 20px", marginBottom: 24, border: "1px solid var(--border)" }}>
        <div style={{ fontSize: 13, marginBottom: 8, textAlign: "left" }}>Détails masqués :</div>
        {[
          "Adobe CC — 59,99€/mois — inutilisé",
          "LinkedIn Premium — 39,99€/mois — inutilisé",
          "Double facturation Amazon — 89,99€",
        ].map((item) => (
          <div
            key={item}
            style={{ fontSize: 12, color: "var(--text-muted)", padding: "6px 0", borderTop: "1px solid var(--border)", filter: "blur(4px)", fontFamily: "var(--font-mono)" }}
          >
            {item}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 8, fontSize: 13, color: "var(--text-dim)" }}>Débloquer pour seulement</div>
      <div className="paywall-price">9€ <span>/mois</span></div>

      <ul className="feature-list">
        <li><span className="feature-check">✓</span> Accès complet au dashboard</li>
        <li><span className="feature-check">✓</span> Alertes temps réel</li>
        <li><span className="feature-check">✓</span> Analyses illimitées</li>
        <li><span className="feature-check">✓</span> Guides d'annulation</li>
        <li><span className="feature-check">✓</span> ROI moyen x{Math.round(annualSavings / 108)}x votre investissement</li>
      </ul>

      <button
        className="btn btn-primary"
        style={{ width: "100%", justifyContent: "center", padding: 16, fontSize: 15 }}
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? "Redirection…" : `Récupérer mes ${savingsFound}€ →`}
      </button>

      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 12, fontFamily: "var(--font-mono)" }}>
        Paiement sécurisé via Stripe · annulable à tout moment
      </div>
    </div>
  );
}
