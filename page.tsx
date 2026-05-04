"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginWithGoogle, loginWithApple } from "@/lib/auth";
import { ScanAnimation } from "@/components/ScanAnimation";
import { Paywall } from "@/components/Paywall";

type Step = "signup" | "connect" | "scan" | "paywall";

export default function OnboardingPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState<Step>((params.get("step") as Step) ?? "signup");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanDone, setScanDone] = useState(false);

  const STEP_ORDER: Step[] = ["signup", "connect", "scan", "paywall"];
  const stepIndex = STEP_ORDER.indexOf(step);

  // Auto-start scan when arriving at scan step
  useEffect(() => {
    if (step !== "scan") return;
    setScanProgress(0);
    setScanDone(false);
    const iv = setInterval(() => {
      setScanProgress((c) => {
        if (c >= 847) {
          clearInterval(iv);
          setScanDone(true);
          return 847;
        }
        return c + Math.floor(Math.random() * 35 + 15);
      });
    }, 60);
    return () => clearInterval(iv);
  }, [step]);

  const content: Record<Step, React.ReactNode> = {
    signup: (
      <>
        <div className="onboard-step">ÉTAPE 1 / 4</div>
        <div className="onboard-title">Créer votre compte</div>
        <div className="onboard-desc">
          Rejoignez 12 000+ utilisateurs qui économisent en moyenne{" "}
          <strong style={{ color: "var(--accent)" }}>127€/mois</strong>.
        </div>
        <input
          className="input-field"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <input
          className="input-field"
          placeholder="Mot de passe"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          type="password"
        />
        <button
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center", padding: 14 }}
          onClick={() => setStep("connect")}
        >
          Créer mon compte →
        </button>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--text-muted)" }}>
          RLS Supabase · chiffrement AES-256 · aucune donnée vendue
        </div>
      </>
    ),

    connect: (
      <>
        <div className="onboard-step">ÉTAPE 2 / 4</div>
        <div className="onboard-title">Connecter Gmail</div>
        <div className="onboard-desc">
          On analyse vos emails pour détecter les prélèvements invisibles.{" "}
          Lecture seule — on ne touche à rien.
        </div>
        <button className="gmail-btn" onClick={() => { loginWithGoogle(); setStep("scan"); }}>
          <span className="gmail-logo">G</span>
          Continuer avec Google
        </button>
        <button className="apple-btn" onClick={() => { loginWithApple(); setStep("scan"); }}>
          <span style={{ fontSize: 18 }}>🍎</span>
          Continuer avec Apple
        </button>
        <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", fontFamily: "var(--font-mono)" }}>
          OAuth 2.0 sécurisé · tokens chiffrés · révocable à tout moment
        </div>
      </>
    ),

    scan: (
      <>
        <div className="onboard-step">ÉTAPE 3 / 4</div>
        <ScanAnimation progress={scanProgress} />
        {scanDone && (
          <button
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: 14, marginTop: 24 }}
            onClick={() => setStep("paywall")}
          >
            Voir les résultats →
          </button>
        )}
      </>
    ),

    paywall: (
      <>
        <div className="onboard-step">ÉTAPE 4 / 4</div>
        <Paywall savingsFound={127} onProceed={() => router.push("/dashboard")} />
      </>
    ),
  };

  return (
    <div className="onboard-wrap">
      <div className="onboard-card fade-up">
        <div className="steps-indicator">
          {STEP_ORDER.map((s, i) => (
            <div
              key={s}
              className={`step-dot ${i < stepIndex ? "done" : i === stepIndex ? "active" : ""}`}
            />
          ))}
        </div>
        {content[step]}
      </div>
    </div>
  );
}
