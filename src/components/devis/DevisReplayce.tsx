import { useState } from "react";

// ─── Tokens extraits du code source saveyourweb.fr ───────────────────────────
// font-display : Space Grotesk
// font-sans    : Inter
// bg           : #000000 (black)
// text-primary : hsl(0 0% 95%)  ≈ #f2f2f2
// accent-warm  : hsl(25 100% 50%) = #ff6a00
// cards        : bg white/5, border white/10, rounded-2xl
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT  = "hsl(25 100% 50%)";   // #ff6a00
const A10     = "hsl(25 100% 50% / 0.10)";
const A20     = "hsl(25 100% 50% / 0.20)";
const A30     = "hsl(25 100% 50% / 0.30)";
const WHITE5  = "rgba(255,255,255,0.05)";
const WHITE8  = "rgba(255,255,255,0.08)";
const WHITE10 = "rgba(255,255,255,0.10)";
const WHITE20 = "rgba(255,255,255,0.20)";
const WHITE50 = "rgba(255,255,255,0.50)";
const WHITE60 = "rgba(255,255,255,0.60)";
const WHITE70 = "rgba(255,255,255,0.70)";
const WHITE80 = "rgba(255,255,255,0.80)";
const PRIMARY = "#f2f2f2";

// ─── Data ─────────────────────────────────────────────────────────────────────

const MODULES_TOURS = [
  {
    id: "sea_tours", icon: "⚡",
    label: "Google Ads Local",
    sublabel: "Campagnes Search géolocalisées — Tours & Touraine",
    setup: 600, monthly: 500,
    budgetPub: "500 – 800 €/mois conseillé (hors honoraires)",
    tag: "Impact immédiat",
    details: ["Audit compte existant + restructuration","Ciblage géolocalisé Touraine","Campagnes Search & Performance Max","Suivi conversions : appels, itinéraire, formulaire","Reporting mensuel actionnable"],
  },
  {
    id: "seo_tours", icon: "🎯",
    label: "SEO Local & Google Business Profile",
    sublabel: "Ancrage organique durable sur toute la Touraine",
    setup: 800, monthly: 600,
    budgetPub: null,
    tag: "Long terme",
    details: ["Audit SEO technique + sémantique local","Optimisation GBP (photos, attributs, Q&R, posts)","Stratégie mots-clés locaux (réparation smartphone Tours…)","Netlinking local : annuaires, presse, mairies","Rapport de positionnement mensuel"],
  },
  {
    id: "meta_tours", icon: "📱",
    label: "Meta Ads — Facebook & Instagram",
    sublabel: "Notoriété & prospection locale Tours",
    setup: 400, monthly: 400,
    budgetPub: "300 – 500 €/mois conseillé (hors honoraires)",
    tag: "Visibilité sociale",
    details: ["Stratégie créa & ciblage Touraine","Campagnes awareness + conversion locale","Setup Pixel & événements de conversion","Coordination graphiste réseau pour les assets","Optimisation & reporting bi-mensuel"],
  },
  {
    id: "tiktok_tours", icon: "🎬",
    label: "TikTok Ads",
    sublabel: "Capter les 18-35 ans sur Tours",
    setup: 400, monthly: 350,
    budgetPub: "300 – 500 €/mois conseillé (hors honoraires)",
    tag: "Nouveau levier",
    details: ["Création compte TikTok Ads Business","Campagnes In-Feed géolocalisées","Briefing créatif (vidéos fournies en interne)","Suivi performances & A/B testing","Reporting mensuel"],
  },
];

const MODULES_LR = [
  {
    id: "prelaunch", icon: "🚀",
    label: "Pack Pré-lancement La Rochelle",
    sublabel: "Travaux en amont — livraison clé en main à J-1",
    setup: 1200, monthly: 0,
    budgetPub: null,
    tag: "One-shot",
    details: ["Création & optimisation fiche GBP La Rochelle","Référencement annuaires & citations locales","Setup Pixel Meta + Google Tag Manager","Campagnes teasing ouverture (Meta/Google)","Livraison complète avant ouverture"],
  },
  {
    id: "sea_lr", icon: "⚡",
    label: "Google Ads Local — La Rochelle",
    sublabel: "Flux clients dès le jour J",
    setup: 500, monthly: 500,
    budgetPub: "500 – 800 €/mois conseillé (hors honoraires)",
    tag: "Impact J+1",
    details: ["Création compte & campagnes Search géolocalisées","Ciblage La Rochelle + agglomération","Annonces responsive + extensions locales","Conversion tracking complet","Reporting mensuel"],
  },
  {
    id: "seo_lr", icon: "🎯",
    label: "SEO Local — La Rochelle",
    sublabel: "Visibilité organique durable",
    setup: 600, monthly: 600,
    budgetPub: null,
    tag: "Long terme",
    details: ["Audit concurrence SEO locale","Stratégie mots-clés réparation smartphone La Rochelle","Optimisation GBP + posts réguliers","Netlinking local thématique","Rapport mensuel de positionnement"],
  },
  {
    id: "meta_lr", icon: "📱",
    label: "Meta Ads — La Rochelle",
    sublabel: "Notoriété ouverture & acquisition",
    setup: 0, monthly: 400,
    budgetPub: "300 – 500 €/mois conseillé (hors honoraires)",
    tag: "Notoriété",
    details: ["Campagnes awareness & trafic local","Offre d'ouverture (promotion lancement)","Retargeting visiteurs web","Assets fournis par la graphiste réseau","Optimisation & reporting"],
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

// Badge "tag" style site SYW : bg-accent-warm/10 border border-accent-warm/20
function Tag({ label }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      borderRadius: 9999,
      background: A10,
      border: `1px solid ${A20}`,
      padding: "2px 10px",
      fontSize: 10, fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: ACCENT,
      fontFamily: "Inter, sans-serif",
      whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

// Checkbox
function Check({ on }) {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: 5, flexShrink: 0,
      border: on ? "none" : `1.5px solid ${WHITE20}`,
      background: on ? ACCENT : "transparent",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.18s",
    }}>
      {on && (
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path d="M1 4.5L4 7.5L10 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

// Dot bullet (style SYW : w-2 h-2 rounded-full bg-accent-warm avec box-shadow glow)
function Dot() {
  return (
    <div style={{
      width: 8, height: 8, borderRadius: "50%",
      background: ACCENT, flexShrink: 0, marginTop: 6,
      boxShadow: `0 0 8px ${ACCENT}`,
    }} />
  );
}

// Section label style SYW : ligne orange + texte uppercase accent
function SectionLabel({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
      <div style={{ height: 1, width: 24, background: ACCENT }} />
      <span style={{
        fontSize: 12, fontWeight: 500, letterSpacing: "0.1em",
        textTransform: "uppercase", color: ACCENT,
        fontFamily: "Inter, sans-serif",
      }}>{label}</span>
    </div>
  );
}

function ModuleCard({ m, checked, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        background: checked ? WHITE8 : WHITE5,
        border: `1px solid ${checked ? WHITE20 : WHITE10}`,
        borderRadius: 16,
        padding: "20px 22px",
        cursor: "pointer",
        transition: "background 0.2s, border 0.2s, opacity 0.2s",
        opacity: checked ? 1 : 0.5,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* hover line top style SYW (simulate with border-top on checked) */}
      {checked && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: ACCENT,
        }} />
      )}
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <Check on={checked} />
        <div style={{ flex: 1 }}>
          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ fontSize: 16 }}>{m.icon}</span>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600, color: PRIMARY, fontSize: 15,
              letterSpacing: "-0.01em",
            }}>{m.label}</span>
            <Tag label={m.tag} />
          </div>
          <p style={{
            color: WHITE60, fontSize: 13,
            fontFamily: "Inter, sans-serif", margin: "0 0 14px", lineHeight: 1.4,
          }}>{m.sublabel}</p>

          {/* Prix */}
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {m.setup > 0 && (
              <div>
                <div style={{ color: WHITE50, fontSize: 10, letterSpacing: "0.1em", fontFamily: "Inter, sans-serif", marginBottom: 2, textTransform: "uppercase" }}>Setup</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: WHITE80, fontSize: 17, letterSpacing: "-0.02em" }}>
                  {m.setup.toLocaleString("fr-FR")} <span style={{ fontSize: 12, fontWeight: 400, color: WHITE50 }}>€ HT</span>
                </div>
              </div>
            )}
            {m.monthly > 0 && (
              <div>
                <div style={{ color: WHITE50, fontSize: 10, letterSpacing: "0.1em", fontFamily: "Inter, sans-serif", marginBottom: 2, textTransform: "uppercase" }}>Mensuel</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: ACCENT, fontSize: 17, letterSpacing: "-0.02em" }}>
                  {m.monthly.toLocaleString("fr-FR")} <span style={{ fontSize: 12, fontWeight: 400, color: WHITE50 }}>€ HT/mois</span>
                </div>
              </div>
            )}
            {m.budgetPub && (
              <div>
                <div style={{ color: WHITE50, fontSize: 10, letterSpacing: "0.1em", fontFamily: "Inter, sans-serif", marginBottom: 2, textTransform: "uppercase" }}>Budget pub conseillé</div>
                <div style={{ color: WHITE50, fontFamily: "Inter, sans-serif", fontSize: 12 }}>{m.budgetPub}</div>
              </div>
            )}
          </div>

          {/* Toggle détails */}
          <button
            onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
            style={{
              background: "none", border: "none", padding: "10px 0 0",
              color: ACCENT, cursor: "pointer", fontSize: 12,
              fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <span style={{ fontSize: 9 }}>{open ? "▲" : "▼"}</span>
            {open ? "Masquer" : "Voir"} les livrables
          </button>
          {open && (
            <ul style={{ margin: "10px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {m.details.map((d, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <Dot />
                  <span style={{ color: WHITE80, fontSize: 13, fontFamily: "Inter, sans-serif", lineHeight: 1.5, fontWeight: 500 }}>{d}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function SubtotalBar({ label, setup, monthly }) {
  return (
    <div style={{
      background: WHITE5, border: `1px solid ${WHITE10}`, borderRadius: 12,
      padding: "14px 20px", marginTop: 10,
      display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
    }}>
      <span style={{ color: WHITE50, fontSize: 13, fontFamily: "Inter, sans-serif" }}>Sous-total — {label}</span>
      <div style={{ display: "flex", gap: 32 }}>
        <div>
          <div style={{ color: WHITE50, fontSize: 10, letterSpacing: "0.1em", fontFamily: "Inter, sans-serif", textTransform: "uppercase", marginBottom: 2 }}>Setup</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: PRIMARY, fontSize: 16, letterSpacing: "-0.02em" }}>
            {setup.toLocaleString("fr-FR")} <span style={{ fontSize: 12, fontWeight: 400, color: WHITE50 }}>€ HT</span>
          </div>
        </div>
        <div>
          <div style={{ color: WHITE50, fontSize: 10, letterSpacing: "0.1em", fontFamily: "Inter, sans-serif", textTransform: "uppercase", marginBottom: 2 }}>Mensuel</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: ACCENT, fontSize: 16, letterSpacing: "-0.02em" }}>
            {monthly.toLocaleString("fr-FR")} <span style={{ fontSize: 12, fontWeight: 400, color: WHITE50 }}>€ HT/mois</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Devis() {
  const [selT, setSelT] = useState({ sea_tours: true, seo_tours: true, meta_tours: false, tiktok_tours: false });
  const [selL, setSelL] = useState({ prelaunch: true, sea_lr: true, seo_lr: false, meta_lr: false });
  const [validationState, setValidationState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleValidate = async () => {
    setValidationState('sending');
    const selectedTours = MODULES_TOURS.filter(m => selT[m.id]).map(m => `${m.icon} ${m.label} — Setup ${m.setup}€ / ${m.monthly}€/mois`);
    const selectedLR = MODULES_LR.filter(m => selL[m.id]).map(m => `${m.icon} ${m.label} — Setup ${m.setup}€ / ${m.monthly}€/mois`);
    try {
      await fetch('https://saveyourweb-contact.pc-relange.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'devis_validation',
          client: 'Giovanni — Replayce',
          devis: 'replayce-mars-2026',
          modules_tours: selectedTours,
          modules_lr: selectedLR,
          total_setup: totalSetup,
          total_monthly: totalMonthly,
        }),
      });
      setValidationState('sent');
    } catch {
      setValidationState('error');
    }
  };

  const calc = (mods, sel) => mods.reduce(
    (acc, m) => sel[m.id] ? { setup: acc.setup + m.setup, monthly: acc.monthly + m.monthly } : acc,
    { setup: 0, monthly: 0 }
  );
  const t = calc(MODULES_TOURS, selT);
  const l = calc(MODULES_LR, selL);
  const totalSetup   = t.setup + l.setup;
  const totalMonthly = t.monthly + l.monthly;
  const selected = [...Object.values(selT), ...Object.values(selL)].filter(Boolean).length;

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: PRIMARY, paddingBottom: 80 }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* ── BACKGROUND GLOW (style SYW hero) ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 500, height: 500, background: "hsl(25 100% 50% / 0.07)", borderRadius: "50%", filter: "blur(120px)" }} />
        <div style={{ position: "absolute", bottom: "15%", left: "2%", width: 300, height: 300, background: "hsl(25 100% 50% / 0.04)", borderRadius: "50%", filter: "blur(100px)" }} />
        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── HEADER ── */}
        <header style={{
          borderBottom: `1px solid ${WHITE10}`,
          padding: "32px 40px 28px",
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(20px)",
        }}>
          <div style={{ maxWidth: 840, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>

              {/* Logo style SYW exacte */}
              <div>
                <div style={{ marginBottom: 20 }}>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700, fontSize: 20,
                    letterSpacing: "-0.02em", color: PRIMARY,
                  }}>
                    Save Your Web<span style={{ color: ACCENT }}>.</span>
                  </span>
                </div>

                {/* Badge style SYW : border border-primary/20 bg-black/50 uppercase tracking-widest */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  borderRadius: 9999,
                  border: `1px solid ${WHITE20}`,
                  background: "rgba(0,0,0,0.5)",
                  padding: "6px 16px",
                  fontSize: 11, fontWeight: 500,
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  color: PRIMARY, fontFamily: "Inter, sans-serif",
                  marginBottom: 16,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                  Agence SEO & SEA
                </div>

                <h1 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 500, fontSize: 34,
                  letterSpacing: "-0.03em", lineHeight: 1.1,
                  color: PRIMARY, margin: "0 0 6px",
                }}>
                  Proposition commerciale.<br />
                  <span style={{ color: WHITE50 }}>Stratégie digitale locale.</span>
                </h1>
              </div>

              <div style={{ textAlign: "right" }}>
                {/* Badge accent style SYW */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: A10, border: `1px solid ${A20}`,
                  borderRadius: 9999, padding: "6px 16px",
                  fontSize: 12, fontWeight: 500,
                  color: ACCENT, fontFamily: "Inter, sans-serif",
                  marginBottom: 12,
                }}>
                  10 ans d'expérience · Niveau senior Paris
                </div>
                <div style={{ color: WHITE70, fontFamily: "Inter, sans-serif", fontSize: 13, marginBottom: 3 }}>
                  À l'attention de <strong style={{ color: PRIMARY }}>Giovanni</strong> — Replayce
                </div>
                <div style={{ color: WHITE50, fontFamily: "Inter, sans-serif", fontSize: 12 }}>Mars 2026</div>
              </div>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: 840, margin: "0 auto", padding: "0 40px" }}>

          {/* ── INTRO ── */}
          <div style={{
            background: WHITE5, border: `1px solid ${WHITE10}`,
            borderRadius: 16, padding: "18px 22px", marginTop: 32,
          }}>
            <p style={{
              color: WHITE70, fontFamily: "Inter, sans-serif",
              fontSize: 15, lineHeight: 1.7, margin: 0, fontWeight: 300,
            }}>
              Suite à nos échanges, voici une stratégie digitale multi-leviers pour{" "}
              <strong style={{ color: PRIMARY, fontWeight: 500 }}>booster la visibilité de Tours</strong>{" "}
              et <strong style={{ color: PRIMARY, fontWeight: 500 }}>préparer l'ouverture de La Rochelle</strong> en avril 2026.
              Chaque brique est activable indépendamment — sélectionne les modules selon tes priorités.
            </p>
          </div>

          {/* ── TOURS ── */}
          <div style={{ marginTop: 52 }}>
            <SectionLabel label="Magasin de Tours" />
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 500, fontSize: 40,
              letterSpacing: "-0.03em", color: PRIMARY,
              margin: "0 0 6px", lineHeight: 1.1,
            }}>
              Boost visibilité & acquisition.<br />
              <span style={{ color: WHITE50 }}>Démarrage immédiat.</span>
            </h2>
            <p style={{ color: WHITE60, fontFamily: "Inter, sans-serif", fontSize: 14, margin: "8px 0 24px" }}>
              Sélectionne les leviers que tu veux activer.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {MODULES_TOURS.map(m => (
                <ModuleCard key={m.id} m={m} checked={!!selT[m.id]} onChange={v => setSelT(s => ({ ...s, [m.id]: v }))} />
              ))}
            </div>
            <SubtotalBar label="Tours" setup={t.setup} monthly={t.monthly} />
          </div>

          {/* ── LA ROCHELLE ── */}
          <div style={{ marginTop: 56 }}>
            <SectionLabel label="Ouverture La Rochelle" />
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 500, fontSize: 40,
              letterSpacing: "-0.03em", color: PRIMARY,
              margin: "0 0 6px", lineHeight: 1.1,
            }}>
              Ouverture La Rochelle.<br />
              <span style={{ color: WHITE50 }}>Préparation + impact J+1.</span>
            </h2>
            <p style={{ color: WHITE60, fontFamily: "Inter, sans-serif", fontSize: 14, margin: "8px 0 24px" }}>
              Avril 2026 — travaux en amont pour être opérationnel dès le jour J.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {MODULES_LR.map(m => (
                <ModuleCard key={m.id} m={m} checked={!!selL[m.id]} onChange={v => setSelL(s => ({ ...s, [m.id]: v }))} />
              ))}
            </div>
            <SubtotalBar label="La Rochelle" setup={l.setup} monthly={l.monthly} />
          </div>

          {/* ── TOTAL — style "chart" section SYW ── */}
          <div style={{
            marginTop: 52,
            background: WHITE5,
            border: `1px solid ${WHITE10}`,
            borderRadius: 24,
            padding: "36px 36px",
            position: "relative", overflow: "hidden",
          }}>
            {/* Glow intérieur */}
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: 300, height: 300,
              background: "hsl(25 100% 50% / 0.06)",
              borderRadius: "50%", filter: "blur(80px)",
              pointerEvents: "none",
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <SectionLabel label="Récapitulatif" />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 28 }}>
                <div>
                  <h2 style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 500, fontSize: 36,
                    letterSpacing: "-0.03em", color: PRIMARY,
                    margin: "0 0 6px", lineHeight: 1.1,
                  }}>
                    Nous ne vendons pas du vent.<br />
                    <span style={{ color: WHITE50 }}>Nous vendons du ROI.</span>
                  </h2>
                  <div style={{ color: WHITE50, fontFamily: "Inter, sans-serif", fontSize: 13, marginTop: 8 }}>
                    {selected} module{selected > 1 ? "s" : ""} sélectionné{selected > 1 ? "s" : ""}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 40, flexWrap: "wrap", alignItems: "flex-end" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: WHITE50, fontSize: 10, letterSpacing: "0.1em", fontFamily: "Inter, sans-serif", textTransform: "uppercase", marginBottom: 6 }}>Investissement initial</div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 500, fontSize: 44,
                      letterSpacing: "-0.04em", color: PRIMARY, lineHeight: 1,
                    }}>
                      {totalSetup.toLocaleString("fr-FR")}
                      <span style={{ fontSize: 16, fontWeight: 400, color: WHITE50 }}> € HT</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: WHITE50, fontSize: 10, letterSpacing: "0.1em", fontFamily: "Inter, sans-serif", textTransform: "uppercase", marginBottom: 6 }}>Honoraires mensuels</div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 500, fontSize: 44,
                      letterSpacing: "-0.04em", color: ACCENT, lineHeight: 1,
                    }}>
                      {totalMonthly.toLocaleString("fr-FR")}
                      <span style={{ fontSize: 16, fontWeight: 400, color: WHITE50 }}> € HT/mois</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: WHITE10, margin: "28px 0" }} />

              {/* Note budget pub */}
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: ACCENT, fontSize: 16, marginTop: 1, flexShrink: 0 }}>ℹ</span>
                <p style={{ color: WHITE60, fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
                  <strong style={{ color: WHITE80, fontWeight: 500 }}>Budget publicitaire non inclus.</strong>{" "}
                  Les dépenses Google Ads, Meta Ads et TikTok Ads sont gérées directement sur tes comptes et ne transitent pas par moi. Mes honoraires couvrent exclusivement la stratégie, la création et la gestion des campagnes.
                </p>
              </div>
            </div>
          </div>

          {/* ── PROMESSES style "notre promesse d'excellence" SYW ── */}
          <div style={{
            background: WHITE5, border: `1px solid ${WHITE10}`,
            borderRadius: 24, padding: "32px 36px", marginTop: 24,
          }}>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 500, fontSize: 22,
              letterSpacing: "-0.02em", color: PRIMARY, margin: "0 0 24px",
            }}>Conditions d'accompagnement</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { text: "Sans engagement — résiliable avec 30 jours de préavis" },
                { text: "Reporting mensuel transparent — accès à tous vos dashboards de performance" },
                { text: "Vos comptes, vos données — vous restez propriétaire de tout" },
                { text: "Interlocuteur unique et senior — pas de junior qui apprend sur votre compte" },
              ].map((c, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span style={{ color: WHITE80, fontSize: 15, fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>{c.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── CTA VALIDATION ── */}
          <div style={{
            marginTop: 24,
            background: "linear-gradient(135deg, hsl(25 100% 50% / 0.15), hsl(25 100% 50% / 0.05))",
            border: `1px solid ${WHITE10}`,
            borderRadius: 24,
            padding: "36px",
            textAlign: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at top left, hsl(25 100% 50% / 0.10) 0%, transparent 50%)",
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              {validationState === 'sent' ? (
                <>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                  <h2 style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 500, fontSize: 28,
                    letterSpacing: "-0.02em", color: PRIMARY,
                    margin: "0 0 8px", lineHeight: 1.2,
                  }}>
                    Proposition validée !
                  </h2>
                  <p style={{ color: WHITE60, fontFamily: "Inter, sans-serif", fontSize: 15, margin: "0 0 16px", fontWeight: 300 }}>
                    Merci Giovanni ! Votre sélection a bien été envoyée.<br />
                    Je reviens vers vous sous 24h avec le devis officiel.
                  </p>
                  <a href="mailto:contact@saveyourweb.fr" style={{
                    color: ACCENT, fontFamily: "Inter, sans-serif", fontSize: 14, textDecoration: "none",
                  }}>
                    Une question ? contact@saveyourweb.fr
                  </a>
                </>
              ) : (
                <>
                  <h2 style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 500, fontSize: 28,
                    letterSpacing: "-0.02em", color: PRIMARY,
                    margin: "0 0 8px", lineHeight: 1.2,
                  }}>
                    Cette sélection vous convient ?<br />
                    <span style={{ color: WHITE70 }}>Validez pour passer à l'étape suivante.</span>
                  </h2>
                  <p style={{ color: WHITE60, fontFamily: "Inter, sans-serif", fontSize: 15, margin: "0 0 28px", fontWeight: 300 }}>
                    En validant, vous confirmez les {selected} module{selected > 1 ? 's' : ''} sélectionné{selected > 1 ? 's' : ''} pour un total de {totalSetup.toLocaleString("fr-FR")}€ HT de setup + {totalMonthly.toLocaleString("fr-FR")}€ HT/mois.
                  </p>
                  <button
                    onClick={handleValidate}
                    disabled={validationState === 'sending' || selected === 0}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 16,
                      borderRadius: 9999, paddingLeft: 28, paddingRight: 12, paddingTop: 12, paddingBottom: 12,
                      background: selected === 0 ? WHITE20 : ACCENT, color: "#000",
                      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 16,
                      border: "none", cursor: selected === 0 ? "not-allowed" : "pointer",
                      transition: "opacity 0.2s, transform 0.1s",
                      opacity: validationState === 'sending' ? 0.7 : 1,
                    }}
                  >
                    {validationState === 'sending' ? 'Envoi en cours...' : 'Valider cette proposition'}
                    <span style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: "#000", color: PRIMARY,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                  </button>
                  {validationState === 'error' && (
                    <p style={{ color: '#ef4444', fontFamily: "Inter, sans-serif", fontSize: 13, marginTop: 12 }}>
                      Erreur d'envoi. Vous pouvez répondre directement à contact@saveyourweb.fr
                    </p>
                  )}
                  <p style={{ color: WHITE50, fontFamily: "Inter, sans-serif", fontSize: 12, marginTop: 16 }}>
                    Sans engagement — cette validation n'est pas un contrat.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* ── FOOTER ── */}
          <footer style={{
            borderTop: `1px solid ${WHITE10}`,
            marginTop: 48, paddingTop: 24,
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
          }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em", color: PRIMARY }}>
              Save Your Web<span style={{ color: ACCENT }}>.</span>
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", color: WHITE50, fontSize: 12 }}>
              contact@saveyourweb.fr · Proposition valable 30 jours · Tarifs HT · TVA 20%
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", color: WHITE50, fontSize: 12 }}>
              © 2026 Save Your Web. Tous droits réservés.
            </span>
          </footer>

        </div>
      </div>
    </div>
  );
}
