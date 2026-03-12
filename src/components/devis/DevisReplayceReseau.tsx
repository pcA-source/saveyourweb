import { useState } from "react";

// ─── Tokens (same as DevisReplayce.tsx) ──────────────────────────────────────
const ACCENT  = "hsl(25 100% 50%)";
const A10     = "hsl(25 100% 50% / 0.10)";
const A20     = "hsl(25 100% 50% / 0.20)";
const A30     = "hsl(25 100% 50% / 0.30)";
const WHITE5  = "rgba(255,255,255,0.05)";
const WHITE8  = "rgba(255,255,255,0.08)";
const WHITE10 = "rgba(255,255,255,0.10)";
const WHITE15 = "rgba(255,255,255,0.15)";
const WHITE20 = "rgba(255,255,255,0.20)";
const WHITE50 = "rgba(255,255,255,0.50)";
const WHITE60 = "rgba(255,255,255,0.60)";
const WHITE70 = "rgba(255,255,255,0.70)";
const WHITE80 = "rgba(255,255,255,0.80)";
const PRIMARY = "#f2f2f2";

// ─── Shared Components ───────────────────────────────────────────────────────

function Tag({ label }: { label: string }) {
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

function Dot() {
  return (
    <div style={{
      width: 8, height: 8, borderRadius: "50%",
      background: ACCENT, flexShrink: 0, marginTop: 6,
      boxShadow: `0 0 8px ${ACCENT}`,
    }} />
  );
}

function SectionLabel({ label }: { label: string }) {
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

function SubtotalBar({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div style={{
      background: WHITE5, border: `1px solid ${WHITE10}`, borderRadius: 12,
      padding: "14px 20px", marginTop: 10,
      display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
    }}>
      <span style={{ color: WHITE50, fontSize: 13, fontFamily: "Inter, sans-serif" }}>{label}</span>
      <div style={{ textAlign: "right" }}>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600, color: ACCENT, fontSize: 18, letterSpacing: "-0.02em",
        }}>{value}</div>
        {sub && <div style={{ color: WHITE50, fontSize: 11, fontFamily: "Inter, sans-serif" }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── Pricing tier helper ─────────────────────────────────────────────────────

interface Tier { max: number; price: number }

function calcTiered(n: number, tiers: Tier[]): number {
  let total = 0;
  let remaining = n;
  for (let i = 0; i < tiers.length; i++) {
    const prevMax = i === 0 ? 0 : tiers[i - 1].max;
    const count = Math.min(remaining, tiers[i].max - prevMax);
    total += count * tiers[i].price;
    remaining -= count;
    if (remaining <= 0) break;
  }
  return total;
}

const GOOGLE_TIERS: Tier[] = [
  { max: 10, price: 150 },
  { max: 25, price: 100 },
  { max: 50, price: 75 },
];

const META_TIERS: Tier[] = [
  { max: 10, price: 80 },
  { max: 25, price: 60 },
  { max: 50, price: 50 },
];

function fmt(n: number): string {
  return n.toLocaleString("fr-FR");
}

// ─── Section Card ────────────────────────────────────────────────────────────

function SectionCard({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: WHITE5,
      border: `1px solid ${WHITE10}`,
      borderRadius: 16,
      padding: "24px 26px",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Tier Table ──────────────────────────────────────────────────────────────

function TierTable({ tiers, unit }: { tiers: { label: string; price: string }[]; unit: string }) {
  return (
    <div style={{ margin: "16px 0", borderRadius: 12, overflow: "hidden", border: `1px solid ${WHITE10}` }}>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        background: WHITE8, padding: "8px 16px",
        fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
        textTransform: "uppercase", color: WHITE50,
        fontFamily: "Inter, sans-serif",
      }}>
        <span>Palier</span>
        <span style={{ textAlign: "right" }}>{unit}</span>
      </div>
      {tiers.map((t, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          padding: "10px 16px",
          borderTop: `1px solid ${WHITE10}`,
          fontSize: 14, fontFamily: "Inter, sans-serif",
        }}>
          <span style={{ color: WHITE70 }}>{t.label}</span>
          <span style={{
            textAlign: "right",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600, color: ACCENT,
          }}>{t.price}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Detail List ─────────────────────────────────────────────────────────────

function DetailList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "14px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((d, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <Dot />
          <span style={{ color: WHITE80, fontSize: 13, fontFamily: "Inter, sans-serif", lineHeight: 1.5, fontWeight: 500 }}>{d}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Planning Bar ────────────────────────────────────────────────────────────

function PlanningBar({ phases }: { phases: { label: string; desc: string }[] }) {
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
      {phases.map((p, i) => (
        <div key={i} style={{
          flex: 1, minWidth: 140,
          background: WHITE8, borderRadius: 8, padding: "10px 14px",
          borderTop: `2px solid ${ACCENT}`,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: ACCENT, fontFamily: "Inter, sans-serif", marginBottom: 4 }}>{p.label}</div>
          <div style={{ fontSize: 12, color: WHITE60, fontFamily: "Inter, sans-serif", lineHeight: 1.4 }}>{p.desc}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Sub-card for tête de réseau ─────────────────────────────────────────────

function SubCard({ title, price, items, budget }: { title: string; price: string; items: string[]; budget?: string }) {
  return (
    <div style={{
      background: WHITE8, border: `1px solid ${WHITE10}`,
      borderRadius: 12, padding: "18px 20px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600, color: PRIMARY, fontSize: 15,
        }}>{title}</span>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600, color: ACCENT, fontSize: 15,
        }}>{price}</span>
      </div>
      <DetailList items={items} />
      {budget && (
        <div style={{
          marginTop: 12, padding: "8px 12px",
          background: A10, borderRadius: 8,
          fontSize: 12, color: WHITE70, fontFamily: "Inter, sans-serif",
        }}>
          💰 Budget média : {budget}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function DevisReplayceReseau() {
  const [shopCount, setShopCount] = useState(20);
  const [metaAds, setMetaAds] = useState(false);
  const [premiumCount, setPremiumCount] = useState(0);

  // Calculations
  const setupBoutiques = shopCount * 550;
  const googleMonthly = calcTiered(shopCount, GOOGLE_TIERS);
  const metaMonthly = metaAds ? calcTiered(shopCount, META_TIERS) : 0;
  const premiumMonthly = premiumCount * 250;
  const teteSetup = 850;
  const teteMonthly = 1600;
  const totalSetup = setupBoutiques + teteSetup;
  const totalMonthly = googleMonthly + metaMonthly + premiumMonthly + teteMonthly;
  const coutParBoutiqueSansTete = shopCount > 0 ? (googleMonthly + metaMonthly + premiumMonthly) / shopCount : 0;
  const coutParBoutiqueTotal = shopCount > 0 ? totalMonthly / shopCount : 0;
  const annualTotal = totalSetup + totalMonthly * 12;
  const ancienModele = shopCount * 900;
  const savings = ancienModele - totalMonthly;

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: PRIMARY, paddingBottom: 80 }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* ── BACKGROUND GLOW ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 500, height: 500, background: "hsl(25 100% 50% / 0.07)", borderRadius: "50%", filter: "blur(120px)" }} />
        <div style={{ position: "absolute", bottom: "15%", left: "2%", width: 300, height: 300, background: "hsl(25 100% 50% / 0.04)", borderRadius: "50%", filter: "blur(100px)" }} />
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
                  <span style={{ color: WHITE50 }}>Stratégie d'acquisition réseau.</span>
                </h1>
              </div>
              <div style={{ textAlign: "right" }}>
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
                  À l'attention de <strong style={{ color: PRIMARY }}>Steven</strong> — Replayce
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
              Suite à nos échanges, voici une stratégie d'acquisition locale industrialisée pour le réseau Replayce — de{" "}
              <strong style={{ color: PRIMARY, fontWeight: 500 }}>20 boutiques aujourd'hui à 50+ d'ici 2030</strong>.{" "}
              Un système uniformisé, scalable, et rentable dès les premiers mois.
            </p>
          </div>

          {/* ── SECTION 1: Package Boutique ── */}
          <div style={{ marginTop: 52 }}>
            <SectionLabel label="Offre réseau" />
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 500, fontSize: 36,
              letterSpacing: "-0.03em", color: PRIMARY,
              margin: "0 0 6px", lineHeight: 1.1,
            }}>
              🏪 Package Boutique — Setup initial
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "12px 0 8px", flexWrap: "wrap" }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600, fontSize: 28, color: ACCENT,
                letterSpacing: "-0.02em",
              }}>550€ HT</span>
              <span style={{ color: WHITE50, fontFamily: "Inter, sans-serif", fontSize: 14 }}>— UNIQUE</span>
              <Tag label="Onboarding obligatoire" />
            </div>
            <p style={{ color: WHITE60, fontFamily: "Inter, sans-serif", fontSize: 14, margin: "8px 0 20px", lineHeight: 1.6 }}>
              Package obligatoire pour chaque nouveau franchisé à l'onboarding. Également proposé à la carte aux boutiques existantes.
            </p>
            <SectionCard>
              <DetailList items={[
                "Audit concurrentiel de la zone de chalandise (mapping concurrents, parts de voix, gaps)",
                "Création / reprise complète de la fiche Google Business Profile optimisée",
                "Rattachement URL myreplayce.fr/ateliers/[ville] + balisage schema LocalBusiness",
                "Rédaction SEO description + services + FAQ locale",
                "Paramétrage avancé : catégories, attributs, produits, menus services",
                "Upload & optimisation visuels (geotagging, nommage SEO)",
                "3 Google Posts stratégiques de lancement",
                "Stratégie de collecte d'avis (process + templates réponses)",
                "Audit & soumission citations locales (Pages Jaunes, annuaires, Apple Maps, Waze)",
              ]} />
            </SectionCard>
          </div>

          {/* ── SECTION 2: Google Ads Local ── */}
          <div style={{ marginTop: 52 }}>
            <SectionLabel label="Pilotage réseau" />
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
              <h2 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 500, fontSize: 36,
                letterSpacing: "-0.03em", color: PRIMARY,
                margin: 0, lineHeight: 1.1,
              }}>
                ⚡ Google Ads Local
              </h2>
              <Tag label="Cœur du dispositif" />
            </div>
            <p style={{ color: WHITE60, fontFamily: "Inter, sans-serif", fontSize: 14, margin: "8px 0 16px", lineHeight: 1.6 }}>
              Campagnes Search + Performance Max Local — système uniformisé copier-coller par ville
            </p>
            <TierTable
              tiers={[
                { label: "1-10 boutiques", price: "150€ HT" },
                { label: "11-25 boutiques", price: "100€ HT" },
                { label: "26-50 boutiques", price: "75€ HT" },
              ]}
              unit="Par boutique/mois"
            />
            <div style={{
              padding: "10px 14px", background: A10, borderRadius: 8,
              fontSize: 13, color: WHITE70, fontFamily: "Inter, sans-serif", margin: "12px 0 16px",
            }}>
              💰 Budget média minimum : 200€/mois par boutique (reco : 500-800€)
            </div>
            <SectionCard>
              <DetailList items={[
                "Architecture de compte optimisée (MCC mutualisé Replayce)",
                "Déblocage & mise en conformité campagnes (Third-party tech support policy)",
                "Campagnes Search haute intention : réparation smartphone/iPhone/Samsung + ville",
                "Campagnes Performance Max Local pour le pack Maps",
                "Stratégie d'enchères automatisées (tROAS / tCPA)",
                "Système de campagnes duplicable par ville (même structure, même mots-clés)",
                "Optimisation mensuelle en batch (toutes les boutiques)",
                "Rapport mensuel par boutique avec ROI",
              ]} />
            </SectionCard>
          </div>

          {/* ── SECTION 3: Meta Ads Local ── */}
          <div style={{ marginTop: 52 }}>
            <SectionLabel label="Add-on" />
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
              <h2 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 500, fontSize: 36,
                letterSpacing: "-0.03em", color: PRIMARY,
                margin: 0, lineHeight: 1.1,
              }}>
                📱 Meta Ads Local
              </h2>
              <Tag label="Booster optionnel" />
            </div>
            <p style={{ color: WHITE60, fontFamily: "Inter, sans-serif", fontSize: 14, margin: "8px 0 16px", lineHeight: 1.6 }}>
              Facebook & Instagram — notoriété locale et trafic boutique
            </p>
            <TierTable
              tiers={[
                { label: "1-10 boutiques", price: "80€ HT" },
                { label: "11-25 boutiques", price: "60€ HT" },
                { label: "26-50 boutiques", price: "50€ HT" },
              ]}
              unit="Par boutique/mois"
            />
            <div style={{
              padding: "10px 14px", background: A10, borderRadius: 8,
              fontSize: 13, color: WHITE70, fontFamily: "Inter, sans-serif", margin: "12px 0 16px",
            }}>
              💰 Budget média : 200-400€/mois par boutique
            </div>
            <SectionCard>
              <DetailList items={[
                "Stratégie d'audiences locales (géo + comportementales + intérêts tech)",
                "Campagnes multi-objectifs : notoriété locale, trafic boutique, conversions",
                "Création templates visuels & copies (Story, Carrousel, Reels)",
                "Retargeting visiteurs myreplayce.fr + Dynamic Ads promos",
                "A/B testing systématique + optimisation continue",
                "Reporting mensuel intégré",
              ]} />
            </SectionCard>
          </div>

          {/* ── SECTION 4: Tier Premium ── */}
          <div style={{ marginTop: 52 }}>
            <SectionLabel label="Accélération" />
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
              <h2 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 500, fontSize: 36,
                letterSpacing: "-0.03em", color: PRIMARY,
                margin: 0, lineHeight: 1.1,
              }}>
                🚀 Tier Premium
              </h2>
              <Tag label="Pour les ambitieux" />
            </div>
            <p style={{ color: WHITE60, fontFamily: "Inter, sans-serif", fontSize: 14, margin: "8px 0 16px", lineHeight: 1.6 }}>
              Pour les boutiques à 30K+ CA/mois qui veulent passer le cap
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "0 0 16px" }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600, fontSize: 28, color: ACCENT,
                letterSpacing: "-0.02em",
              }}>+250€ HT</span>
              <span style={{ color: WHITE50, fontFamily: "Inter, sans-serif", fontSize: 14 }}>/boutique/mois (en plus du standard)</span>
            </div>
            <SectionCard>
              <DetailList items={[
                "Calls bi-mensuels dédiés avec le franchisé",
                "Tracking avancé : attribution multi-canal, scoring source",
                "Stratégie personnalisée hors template",
                "Recommandations CRO landing page dédiée",
                "Objectif : passer de 30K à 40-50K CA/mois",
              ]} />
            </SectionCard>
          </div>

          {/* ── SECTION 5: Tête de réseau ── */}
          <div style={{ marginTop: 52 }}>
            <SectionLabel label="Prestations centrales" />
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 500, fontSize: 36,
              letterSpacing: "-0.03em", color: PRIMARY,
              margin: "0 0 24px", lineHeight: 1.1,
            }}>
              🎯 Tête de réseau
            </h2>

            {/* A. Merchant Center */}
            <div style={{
              background: WHITE5, border: `1px solid ${WHITE10}`,
              borderRadius: 16, padding: "24px 26px", marginBottom: 16,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: ACCENT,
              }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600, fontSize: 20, color: PRIMARY, margin: 0,
                }}>
                  A. Merchant Center — Intervention prioritaire
                </h3>
                <Tag label="CRITIQUE — Priorité J1" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "12px 0 16px" }}>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600, fontSize: 24, color: ACCENT,
                }}>850€ HT</span>
                <span style={{ color: WHITE50, fontFamily: "Inter, sans-serif", fontSize: 14 }}>— ONE-SHOT</span>
              </div>
              <p style={{ color: WHITE60, fontFamily: "Inter, sans-serif", fontSize: 14, margin: "0 0 16px", lineHeight: 1.6, fontWeight: 300 }}>
                <strong style={{ color: "#ef4444", fontWeight: 600 }}>CRITIQUE</strong> — Shopping Ads & Free Listings actuellement bloqués (site non revendiqué, 0 produit diffusé)
              </p>
              <DetailList items={[
                "Revendication & vérification du site lapommediscount.com",
                "Diagnostic complet de l'architecture de feeds (3 feeds dont 2 doublons)",
                "Nettoyage des feeds dupliqués + validation feed Store Factory",
                "Forçage du fetch initial + monitoring indexation (24-48h)",
                "Audit qualité flux produits (titres, descriptions, images, GTIN, catégories, prix)",
                "Optimisation attributs pour maximiser la visibilité Shopping",
                "Configuration Free Listings (surfaces across Google)",
                "Rapport de performance initial + recommandations",
              ]} />
              <PlanningBar phases={[
                { label: "Urgent (J1)", desc: "Claim site, nettoyage feeds" },
                { label: "Audit (J3-J5)", desc: "Audit qualité flux" },
                { label: "Optim (S2)", desc: "Enrichissement, Free Listings" },
              ]} />
            </div>

            {/* B. Pilotage mensuel */}
            <div style={{
              background: WHITE5, border: `1px solid ${WHITE10}`,
              borderRadius: 16, padding: "24px 26px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600, fontSize: 20, color: PRIMARY, margin: 0,
                }}>
                  B. Pilotage mensuel tête de réseau
                </h3>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600, fontSize: 22, color: ACCENT,
                }}>1 600€ HT/mois</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <SubCard
                  title="Merchant Center & Shopping"
                  price="400€/mois"
                  items={[
                    "Monitoring erreurs & avertissements",
                    "Optimisation continue titres/descriptions (A/B testing Shopping)",
                    "Gestion campagnes Shopping / PMax e-commerce",
                    "Ajustement enchères par catégorie et marge",
                    "Free Listings + veille concurrentielle prix",
                    "Rapport mensuel : impressions, clics, ROAS, top produits",
                  ]}
                  budget="500-1 500€/mois"
                />
                <SubCard
                  title="Recrutement franchisés — Google Ads"
                  price="600€/mois"
                  items={[
                    "Stratégie mots-clés full-funnel (intentionnistes + reconversion)",
                    "Campagnes Search + Demand Gen / Display",
                    "Audit & optimisation CRO landing pages myreplayce.fr",
                    "Audiences avancées (in-market, custom intent, similar)",
                    "Tracking tunnel complet + scoring leads par source",
                    "Reporting bi-mensuel avec coût par lead",
                  ]}
                  budget="1 500-2 500€/mois"
                />
                <SubCard
                  title="Recrutement franchisés — Meta Ads"
                  price="600€/mois"
                  items={[
                    "Audiences : reconversion pro, passionnés tech, entrepreneurs",
                    "Campagnes Lead Ads, Trafic, Conversion, Formulaire instantané",
                    "Contenus premium (témoignages franchisés, behind-the-scenes)",
                    "Retargeting multi-étape + Lookalike audiences",
                    "Intégration CRM + A/B testing créatif systématique",
                    "Reporting bi-mensuel avec CPL et qualité leads",
                  ]}
                  budget="1 500-2 500€/mois"
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 6: Simulateur ── */}
          <div style={{
            marginTop: 52,
            background: WHITE5,
            border: `1px solid ${WHITE10}`,
            borderRadius: 24,
            padding: "36px 36px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: 300, height: 300,
              background: "hsl(25 100% 50% / 0.06)",
              borderRadius: "50%", filter: "blur(80px)",
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <SectionLabel label="Simulateur" />
              <h2 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 500, fontSize: 36,
                letterSpacing: "-0.03em", color: PRIMARY,
                margin: "0 0 6px", lineHeight: 1.1,
              }}>
                📊 Simulez votre investissement.
              </h2>
              <p style={{ color: WHITE60, fontFamily: "Inter, sans-serif", fontSize: 14, margin: "8px 0 28px" }}>
                Ajustez le nombre de boutiques et les options pour voir le budget réel.
              </p>

              {/* Controls */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 32 }}>

                {/* Slider: Nombre de boutiques */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <label style={{ color: WHITE70, fontSize: 13, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                      Nombre de boutiques actives
                    </label>
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 600, fontSize: 18, color: ACCENT,
                    }}>{shopCount}</span>
                  </div>
                  <input
                    type="range" min={1} max={50} value={shopCount}
                    onChange={e => {
                      const v = Number(e.target.value);
                      setShopCount(v);
                      if (premiumCount > v) setPremiumCount(v);
                    }}
                    style={{ width: "100%", accentColor: ACCENT }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ color: WHITE50, fontSize: 11, fontFamily: "Inter, sans-serif" }}>1</span>
                    <span style={{ color: WHITE50, fontSize: 11, fontFamily: "Inter, sans-serif" }}>50</span>
                  </div>
                </div>

                {/* Checkbox: Meta Ads */}
                <div
                  onClick={() => setMetaAds(v => !v)}
                  style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    border: metaAds ? "none" : `1.5px solid ${WHITE20}`,
                    background: metaAds ? ACCENT : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.18s",
                  }}>
                    {metaAds && (
                      <svg width="12" height="10" viewBox="0 0 11 9" fill="none">
                        <path d="M1 4.5L4 7.5L10 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span style={{ color: WHITE70, fontSize: 14, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                    Activer Meta Ads (Facebook & Instagram)
                  </span>
                </div>

                {/* Number input: Boutiques Premium */}
                <div>
                  <label style={{ color: WHITE70, fontSize: 13, fontFamily: "Inter, sans-serif", fontWeight: 500, display: "block", marginBottom: 8 }}>
                    Boutiques Premium (+250€/mois chacune)
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button
                      onClick={() => setPremiumCount(c => Math.max(0, c - 1))}
                      style={{
                        width: 36, height: 36, borderRadius: 8,
                        background: WHITE8, border: `1px solid ${WHITE10}`,
                        color: PRIMARY, fontSize: 18, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >−</button>
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 600, fontSize: 20, color: ACCENT,
                      minWidth: 32, textAlign: "center",
                    }}>{premiumCount}</span>
                    <button
                      onClick={() => setPremiumCount(c => Math.min(shopCount, c + 1))}
                      style={{
                        width: 36, height: 36, borderRadius: 8,
                        background: WHITE8, border: `1px solid ${WHITE10}`,
                        color: PRIMARY, fontSize: 18, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >+</button>
                    <span style={{ color: WHITE50, fontSize: 12, fontFamily: "Inter, sans-serif" }}>
                      / {shopCount} boutiques
                    </span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div style={{ height: 1, background: WHITE10, margin: "0 0 24px" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {/* Setup */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 0", borderBottom: `1px solid ${WHITE10}`,
                }}>
                  <span style={{ color: WHITE60, fontSize: 13, fontFamily: "Inter, sans-serif" }}>Setup boutiques ({shopCount} × 550€)</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: WHITE80, fontSize: 15 }}>{fmt(setupBoutiques)}€</span>
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 0", borderBottom: `1px solid ${WHITE10}`,
                }}>
                  <span style={{ color: WHITE60, fontSize: 13, fontFamily: "Inter, sans-serif" }}>Google Ads /mois</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: ACCENT, fontSize: 15 }}>{fmt(googleMonthly)}€</span>
                </div>
                {metaAds && (
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 0", borderBottom: `1px solid ${WHITE10}`,
                  }}>
                    <span style={{ color: WHITE60, fontSize: 13, fontFamily: "Inter, sans-serif" }}>Meta Ads /mois</span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: ACCENT, fontSize: 15 }}>{fmt(metaMonthly)}€</span>
                  </div>
                )}
                {premiumCount > 0 && (
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 0", borderBottom: `1px solid ${WHITE10}`,
                  }}>
                    <span style={{ color: WHITE60, fontSize: 13, fontFamily: "Inter, sans-serif" }}>Premium /mois ({premiumCount} × 250€)</span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: ACCENT, fontSize: 15 }}>{fmt(premiumMonthly)}€</span>
                  </div>
                )}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 0", borderBottom: `1px solid ${WHITE10}`,
                }}>
                  <span style={{ color: WHITE60, fontSize: 13, fontFamily: "Inter, sans-serif" }}>Tête de réseau setup</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: WHITE80, fontSize: 15 }}>850€</span>
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 0", borderBottom: `1px solid ${WHITE10}`,
                }}>
                  <span style={{ color: WHITE60, fontSize: 13, fontFamily: "Inter, sans-serif" }}>Tête de réseau /mois</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: ACCENT, fontSize: 15 }}>1 600€</span>
                </div>
              </div>

              {/* Totals */}
              <div style={{
                marginTop: 20, padding: "20px",
                background: WHITE8, borderRadius: 16,
                border: `1px solid ${A20}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
                  <div>
                    <div style={{ color: WHITE50, fontSize: 10, letterSpacing: "0.1em", fontFamily: "Inter, sans-serif", textTransform: "uppercase", marginBottom: 6 }}>Total setup</div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 500, fontSize: 32, color: PRIMARY, letterSpacing: "-0.03em",
                    }}>{fmt(totalSetup)}<span style={{ fontSize: 14, fontWeight: 400, color: WHITE50 }}> € HT</span></div>
                  </div>
                  <div>
                    <div style={{ color: WHITE50, fontSize: 10, letterSpacing: "0.1em", fontFamily: "Inter, sans-serif", textTransform: "uppercase", marginBottom: 6 }}>Total mensuel</div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 500, fontSize: 32, color: ACCENT, letterSpacing: "-0.03em",
                    }}>{fmt(totalMonthly)}<span style={{ fontSize: 14, fontWeight: 400, color: WHITE50 }}> € HT/mois</span></div>
                  </div>
                </div>

                <div style={{ height: 1, background: WHITE10, margin: "16px 0" }} />

                <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
                  <div>
                    <div style={{ color: WHITE50, fontSize: 10, letterSpacing: "0.1em", fontFamily: "Inter, sans-serif", textTransform: "uppercase", marginBottom: 4 }}>Coût /boutique (hors tête réseau)</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 18, color: WHITE80 }}>
                      {fmt(Math.round(coutParBoutiqueSansTete))}€/mois
                    </div>
                  </div>
                  <div>
                    <div style={{ color: WHITE50, fontSize: 10, letterSpacing: "0.1em", fontFamily: "Inter, sans-serif", textTransform: "uppercase", marginBottom: 4 }}>Coût effectif /boutique (tout inclus)</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 18, color: ACCENT }}>
                      {fmt(Math.round(coutParBoutiqueTotal))}€/mois
                    </div>
                  </div>
                  <div>
                    <div style={{ color: WHITE50, fontSize: 10, letterSpacing: "0.1em", fontFamily: "Inter, sans-serif", textTransform: "uppercase", marginBottom: 4 }}>Investissement annuel total</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 18, color: WHITE80 }}>
                      {fmt(annualTotal)}€ HT
                    </div>
                  </div>
                </div>

                {/* Comparison line */}
                {savings > 0 && (
                  <div style={{
                    marginTop: 16, padding: "10px 14px",
                    background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: 8, display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <span style={{ fontSize: 16 }}>💰</span>
                    <span style={{ color: "#22c55e", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500 }}>
                      vs ancien modèle à 900€/boutique : vous économisez {fmt(savings)}€/mois ({fmt(savings * 12)}€/an)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── SECTION 7: Roadmap ── */}
          <div style={{ marginTop: 52 }}>
            <SectionLabel label="Déploiement" />
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 500, fontSize: 36,
              letterSpacing: "-0.03em", color: PRIMARY,
              margin: "0 0 24px", lineHeight: 1.1,
            }}>
              📍 Roadmap déploiement
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { phase: "Immédiat", title: "Déblocage Merchant Center", desc: "Revendication site, nettoyage feeds, activation Shopping Ads & Free Listings — intervention sous 48h", color: "#ef4444" },
                { phase: "Phase 1", title: "Nouveaux franchisés", desc: "Package complet obligatoire intégré dès l'onboarding — chaque boutique démarre avec une stratégie d'acquisition activée", color: ACCENT },
                { phase: "Phase 2", title: "Boutiques existantes volontaires", desc: "Test 1 mois à la carte — montée en charge progressive", color: "#f59e0b" },
                { phase: "Phase 3", title: "Généralisation réseau", desc: "Résultats confirmés → passage en dépense de communication obligatoire pour l'ensemble du réseau", color: "#22c55e" },
              ].map((p, i) => (
                <div key={i} style={{
                  display: "flex", gap: 16, alignItems: "flex-start",
                  background: WHITE5, border: `1px solid ${WHITE10}`,
                  borderRadius: 12, padding: "18px 20px",
                  borderLeft: `3px solid ${p.color}`,
                }}>
                  <div style={{
                    background: p.color + "20", color: p.color,
                    borderRadius: 8, padding: "4px 10px",
                    fontSize: 11, fontWeight: 600, fontFamily: "Inter, sans-serif",
                    textTransform: "uppercase", letterSpacing: "0.08em",
                    whiteSpace: "nowrap", flexShrink: 0,
                  }}>{p.phase}</div>
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, color: PRIMARY, marginBottom: 4 }}>{p.title}</div>
                    <div style={{ color: WHITE60, fontSize: 13, fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 8: Engagements ── */}
          <div style={{
            background: WHITE5, border: `1px solid ${WHITE10}`,
            borderRadius: 24, padding: "32px 36px", marginTop: 52,
          }}>
            <SectionLabel label="Nos engagements" />
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 500, fontSize: 22,
              letterSpacing: "-0.02em", color: PRIMARY, margin: "0 0 24px",
            }}>Notre promesse d'excellence</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {[
                { icon: "👤", title: "Interlocuteur unique & dédié", desc: "Un seul point de contact pour l'ensemble du réseau — réactivité garantie" },
                { icon: "✅", title: "Conformité Google Ads garantie", desc: "Expertise spécifique sur les policies réparation — fini les campagnes bloquées" },
                { icon: "📊", title: "Reporting ROI transparent", desc: "Dashboard temps réel + rapport mensuel avec CA attribué par campagne" },
                { icon: "📈", title: "Scalabilité réseau", desc: "Process industrialisé via MCC mutualisé — de 20 à 50 boutiques sans perte de qualité" },
              ].map((e, i) => (
                <div key={i} style={{
                  background: WHITE8, borderRadius: 12, padding: "18px 20px",
                  border: `1px solid ${WHITE10}`,
                }}>
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{e.icon}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, color: PRIMARY, marginBottom: 6 }}>{e.title}</div>
                  <div style={{ color: WHITE60, fontSize: 13, fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>{e.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 9: Conditions ── */}
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
                "Sans engagement — résiliable avec 30 jours de préavis",
                "Reporting mensuel transparent — accès à tous vos dashboards",
                "Vos comptes, vos données — vous restez propriétaire de tout",
                "Interlocuteur unique et senior — pas de junior",
              ].map((c, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span style={{ color: WHITE80, fontSize: 15, fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>{c}</span>
                </li>
              ))}
            </ul>
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
