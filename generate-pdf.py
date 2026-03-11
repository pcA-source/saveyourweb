#!/usr/bin/env python3
"""Generate the '10 erreurs SEO' lead magnet PDF with Unicode support."""
from fpdf import FPDF
import os

FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

class SEOPdf(FPDF):
    ORANGE = (255, 106, 0)
    DARK = (30, 30, 30)
    GREY = (80, 80, 80)
    LIGHT = (120, 120, 120)

    def header(self):
        self.set_font("dejavu", "B", 14)
        self.set_text_color(*self.ORANGE)
        self.cell(0, 10, "Save Your Web", new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*self.ORANGE)
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(6)

    def footer(self):
        self.set_y(-15)
        self.set_font("dejavu", "", 8)
        self.set_text_color(*self.LIGHT)
        self.cell(0, 10, f"saveyourweb.fr  —  Page {self.page_no()}/{{nb}}", align="C")

errors = [
    {
        "title": "1. Ignorer l'intention de recherche",
        "text": "Créer du contenu sans comprendre ce que l'utilisateur cherche réellement est la première cause d'échec en SEO. Google analyse l'intention (informationnelle, transactionnelle, navigationnelle) et ne classera jamais une page produit sur une requête informationnelle.",
        "fix": "Analysez les résultats actuels de Google pour chaque mot-clé cible. Si les top résultats sont des guides, créez un guide. Si ce sont des pages produit, optimisez votre fiche produit."
    },
    {
        "title": "2. Négliger le maillage interne",
        "text": "Le maillage interne distribue l'autorité entre vos pages et guide Google dans la compréhension de votre architecture. Sans liens internes stratégiques, vos pages profondes restent orphelines et invisibles pour les moteurs.",
        "fix": "Identifiez vos pages piliers et créez des cocons sémantiques avec des liens contextuels. Chaque page importante devrait recevoir au moins 3-5 liens internes depuis des pages thématiquement proches."
    },
    {
        "title": "3. Oublier les balises title et meta descriptions",
        "text": "La balise title est le signal on-page le plus puissant pour Google. La meta description, bien que non facteur de ranking direct, influence le taux de clic (CTR) dans les résultats de recherche. Les négliger, c'est perdre du trafic gratuit.",
        "fix": "Rédigez des titles uniques de 50-60 caractères incluant votre mot-clé principal. Créez des meta descriptions engageantes de 150-160 caractères avec un appel à l'action clair."
    },
    {
        "title": "4. Ne pas optimiser pour mobile",
        "text": "Google utilise l'indexation mobile-first : c'est la version mobile de votre site qui est analysée en priorité. Un site non responsive ou lent sur mobile sera pénalisé dans les résultats, même pour les recherches desktop.",
        "fix": "Testez votre site avec Google Mobile-Friendly Test. Assurez-vous que le contenu est identique entre mobile et desktop. Optimisez la vitesse de chargement sur 3G/4G."
    },
    {
        "title": "5. Ignorer la vitesse de chargement",
        "text": "Les Core Web Vitals (LCP, FID, CLS) sont des facteurs de ranking officiels depuis 2021. Un site lent fait fuir les utilisateurs (53% abandonnent si le chargement dépasse 3 secondes) et envoie des signaux négatifs à Google.",
        "fix": "Compressez vos images (WebP), activez la mise en cache, minimisez CSS/JS, utilisez un CDN. Visez un LCP < 2.5s, un FID < 100ms et un CLS < 0.1."
    },
    {
        "title": "6. Dupliquer du contenu",
        "text": "Le contenu dupliqué (interne ou externe) dilue votre autorité et empêche Google de déterminer quelle page indexer. Cela inclut les pages avec des paramètres URL, les versions HTTP/HTTPS, ou le contenu copié d'autres sites.",
        "fix": "Utilisez des balises canonical pour indiquer la version préférée. Rédigez du contenu original et unique. Auditez votre site avec Screaming Frog pour détecter les doublons."
    },
    {
        "title": "7. Négliger les données structurées",
        "text": "Les données structurées (Schema.org) aident Google à comprendre le contenu de vos pages et peuvent générer des résultats enrichis (rich snippets) : étoiles, FAQ, prix, etc. Ces résultats captent davantage l'attention et augmentent le CTR.",
        "fix": "Implémentez les schemas pertinents : FAQ, Product, LocalBusiness, Article, Breadcrumb. Validez avec le Rich Results Test de Google. Commencez par les pages à fort trafic."
    },
    {
        "title": "8. Ne pas suivre ses positions",
        "text": "Sans suivi de positions, vous naviguez à l'aveugle. Impossible de mesurer l'impact de vos actions SEO, de détecter une perte de visibilité ou d'identifier les opportunités de progression rapide.",
        "fix": "Configurez Google Search Console et un outil de suivi de positions (SE Ranking, Semrush, Ahrefs). Suivez au minimum 50 mots-clés stratégiques. Analysez les tendances mensuellement."
    },
    {
        "title": "9. Acheter des backlinks toxiques",
        "text": "L'achat massif de liens de mauvaise qualité (PBN, annuaires spammy, fermes de liens) est une pratique à haut risque. Google détecte ces patterns et peut appliquer une pénalité manuelle qui fera disparaître votre site des résultats.",
        "fix": "Privilégiez le netlinking qualitatif : relations presse, guest posting sur des sites d'autorité, création de contenu linkable. Un seul lien d'un site DR70+ vaut plus que 100 liens DR10."
    },
    {
        "title": "10. Ne pas avoir de stratégie de contenu",
        "text": "Publier du contenu sans plan éditorial revient à tirer dans le vide. Sans recherche de mots-clés, sans analyse de la concurrence et sans calendrier de publication, vos efforts seront dispersés et peu efficaces.",
        "fix": "Créez un calendrier éditorial basé sur une recherche de mots-clés approfondie. Priorisez les sujets par volume, difficulté et intention. Visez une publication régulière (2-4 articles/mois minimum)."
    },
]

pdf = SEOPdf()
pdf.add_font("dejavu", "", FONT_PATH)
pdf.add_font("dejavu", "B", FONT_BOLD)
pdf.alias_nb_pages()
pdf.set_auto_page_break(auto=True, margin=20)

# Cover page
pdf.add_page()
pdf.ln(40)
pdf.set_font("dejavu", "B", 28)
pdf.set_text_color(*SEOPdf.DARK)
pdf.multi_cell(0, 14, "10 erreurs SEO\nqui tuent votre trafic", align="C")
pdf.ln(6)
pdf.set_font("dejavu", "", 16)
pdf.set_text_color(*SEOPdf.GREY)
pdf.multi_cell(0, 10, "(et comment les corriger)", align="C")
pdf.ln(20)
pdf.set_draw_color(*SEOPdf.ORANGE)
pdf.set_line_width(1)
pdf.line(80, pdf.get_y(), 130, pdf.get_y())
pdf.ln(20)
pdf.set_font("dejavu", "", 12)
pdf.set_text_color(*SEOPdf.LIGHT)
pdf.cell(0, 8, "Un guide pratique par Save Your Web", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 8, "saveyourweb.fr", align="C", new_x="LMARGIN", new_y="NEXT")

# Content pages
for err in errors:
    pdf.add_page()
    pdf.set_font("dejavu", "B", 18)
    pdf.set_text_color(*SEOPdf.ORANGE)
    pdf.multi_cell(0, 10, err["title"])
    pdf.ln(4)
    pdf.set_font("dejavu", "B", 11)
    pdf.set_text_color(*SEOPdf.DARK)
    pdf.cell(0, 8, "Le problème", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("dejavu", "", 11)
    pdf.set_text_color(*SEOPdf.GREY)
    pdf.multi_cell(0, 6, err["text"])
    pdf.ln(4)
    pdf.set_font("dejavu", "B", 11)
    pdf.set_text_color(*SEOPdf.DARK)
    pdf.cell(0, 8, "La solution", new_x="LMARGIN", new_y="NEXT")
    x, y = pdf.get_x(), pdf.get_y()
    pdf.set_font("dejavu", "", 11)
    pdf.set_text_color(*SEOPdf.GREY)
    pdf.set_x(x + 6)
    pdf.multi_cell(174, 6, err["fix"])
    end_y = pdf.get_y()
    pdf.set_draw_color(*SEOPdf.ORANGE)
    pdf.set_line_width(1)
    pdf.line(x + 2, y, x + 2, end_y)

# CTA page
pdf.add_page()
pdf.ln(50)
pdf.set_font("dejavu", "B", 24)
pdf.set_text_color(*SEOPdf.DARK)
pdf.multi_cell(0, 12, "Besoin d'un audit SEO\npersonnalisé ?", align="C")
pdf.ln(10)
pdf.set_font("dejavu", "", 14)
pdf.set_text_color(*SEOPdf.GREY)
pdf.multi_cell(0, 8, "Nous analysons votre site gratuitement et vous\nprésentons les opportunités de croissance.", align="C")
pdf.ln(16)
pdf.set_font("dejavu", "B", 16)
pdf.set_text_color(*SEOPdf.ORANGE)
pdf.cell(0, 10, "saveyourweb.fr", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("dejavu", "", 12)
pdf.set_text_color(*SEOPdf.LIGHT)
pdf.cell(0, 10, "contact@saveyourweb.fr", align="C")

pdf.output("public/ressources/10-erreurs-seo-save-your-web.pdf")
print("PDF generated!")
