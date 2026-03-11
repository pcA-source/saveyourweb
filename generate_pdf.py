#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate premium SEO lead magnet PDF for Save Your Web.
"10 erreurs SEO qui tuent votre trafic (et comment les corriger)"
"""

from fpdf import FPDF
import os

# ─── Colors ───
ORANGE = (255, 106, 0)       # #FF6A00
BLACK = (26, 26, 26)         # #1A1A1A
DARK_GRAY = (51, 51, 51)     # #333333
LIGHT_GRAY = (150, 150, 150)
TIP_BG = (255, 245, 235)     # #FFF5EB
WHITE = (255, 255, 255)
CHECKLIST_GREEN = (34, 139, 34)
CHECKLIST_RED = (220, 53, 69)

OUTPUT_PATH = "/data/.openclaw/workspace/projects/saveyourweb/public/ressources/10-erreurs-seo-save-your-web.pdf"


class SEOGuidePDF(FPDF):
    def __init__(self):
        super().__init__('P', 'mm', 'A4')
        self.set_auto_page_break(auto=True, margin=25)
        self.is_cover = False

    def header(self):
        if self.is_cover or self.page_no() == 0:
            return
        # Orange line at top
        self.set_draw_color(*ORANGE)
        self.set_line_width(0.8)
        self.line(20, 10, 190, 10)
        # "Save Your Web" left
        self.set_font('Helvetica', 'B', 8)
        self.set_text_color(*DARK_GRAY)
        self.set_xy(20, 12)
        self.cell(0, 5, 'Save Your Web', ln=False)
        # Page number right
        self.set_font('Helvetica', '', 8)
        self.set_xy(170, 12)
        self.cell(20, 5, str(self.page_no()), ln=False, align='R')
        self.set_y(22)

    def footer(self):
        if self.is_cover:
            return
        self.set_y(-15)
        self.set_font('Helvetica', '', 7)
        self.set_text_color(*LIGHT_GRAY)
        self.cell(0, 10, 'saveyourweb.fr', align='C')

    def add_cover(self):
        self.is_cover = True
        self.add_page()
        # Orange accent bar at top
        self.set_fill_color(*ORANGE)
        self.rect(0, 0, 210, 8, 'F')
        # Title area
        self.set_y(60)
        self.set_font('Helvetica', 'B', 32)
        self.set_text_color(*BLACK)
        self.multi_cell(170, 14, '10 erreurs SEO\nqui tuent votre trafic', align='C')
        self.ln(3)
        self.set_font('Helvetica', '', 18)
        self.set_text_color(*DARK_GRAY)
        self.cell(0, 10, '(et comment les corriger)', align='C', ln=True)
        self.ln(15)
        # Subtitle
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(*ORANGE)
        self.cell(0, 10, 'Guide pratique \u2014 \u00c9dition 2026', align='C', ln=True)
        self.ln(30)
        # Logo text
        self.set_font('Helvetica', 'B', 22)
        self.set_text_color(*BLACK)
        w_save = self.get_string_width('Save Your Web')
        w_dot = self.get_string_width('.')
        total = w_save + w_dot
        x_start = (210 - total) / 2
        self.set_x(x_start)
        self.cell(w_save, 12, 'Save Your Web', ln=False)
        self.set_text_color(*ORANGE)
        self.cell(w_dot, 12, '.', ln=True)
        self.ln(5)
        self.set_font('Helvetica', '', 12)
        self.set_text_color(*DARK_GRAY)
        self.cell(0, 8, 'saveyourweb.fr', align='C', ln=True)
        # Bottom orange bar
        self.set_fill_color(*ORANGE)
        self.rect(0, 289, 210, 8, 'F')
        self.is_cover = False

    def add_section_title(self, number, title, subtitle=None):
        """Large numbered error title"""
        self.ln(3)
        # Number in orange
        self.set_font('Helvetica', 'B', 48)
        self.set_text_color(*ORANGE)
        num_w = self.get_string_width(f'{number:02d}') + 4
        x = self.get_x()
        self.cell(num_w, 18, f'{number:02d}', ln=False)
        # Orange vertical line
        self.set_draw_color(*ORANGE)
        self.set_line_width(1)
        line_x = x + num_w + 2
        self.line(line_x, self.get_y(), line_x, self.get_y() + 18)
        # Title
        self.set_font('Helvetica', 'B', 20)
        self.set_text_color(*BLACK)
        self.set_x(line_x + 5)
        title_w = 170 - num_w - 7
        self.multi_cell(title_w, 9, title)
        self.ln(2)
        if subtitle:
            self.set_font('Helvetica', 'I', 12)
            self.set_text_color(*DARK_GRAY)
            self.multi_cell(170, 6, subtitle)
            self.ln(2)

    def add_subsection(self, title):
        self.ln(3)
        self.set_font('Helvetica', 'B', 13)
        self.set_text_color(*ORANGE)
        # Small orange square
        y = self.get_y() + 1.5
        self.set_fill_color(*ORANGE)
        self.rect(20, y, 3, 3, 'F')
        self.set_x(26)
        self.cell(0, 6, title, ln=True)
        self.ln(1)

    def add_paragraph(self, text):
        self.set_font('Helvetica', '', 11)
        self.set_text_color(*DARK_GRAY)
        self.multi_cell(170, 5.5, text)
        self.ln(2)

    def add_bullet(self, text):
        self.set_font('Helvetica', '', 11)
        self.set_text_color(*DARK_GRAY)
        x = self.get_x()
        self.set_x(25)
        self.cell(5, 5.5, '\u2022', ln=False)
        self.multi_cell(160, 5.5, text)
        self.ln(1)

    def add_tip_box(self, text):
        self.ln(2)
        y_start = self.get_y()
        # Calculate height
        self.set_font('Helvetica', 'I', 10)
        # Save position and calculate
        lines = self.multi_cell(155, 5, text, split_only=True)
        h = len(lines) * 5 + 14

        # Check if we need a page break
        if y_start + h > 272:
            self.add_page()
            y_start = self.get_y()

        # Background
        self.set_fill_color(*TIP_BG)
        self.rect(22, y_start, 166, h, 'F')
        # Left border
        self.set_fill_color(*ORANGE)
        self.rect(22, y_start, 2.5, h, 'F')
        # Label
        self.set_xy(28, y_start + 3)
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(*ORANGE)
        self.cell(0, 5, 'PRO TIP \u2014 Pierre-Charles Relange', ln=True)
        # Text
        self.set_x(28)
        self.set_font('Helvetica', 'I', 10)
        self.set_text_color(*DARK_GRAY)
        self.multi_cell(155, 5, text)
        self.set_y(y_start + h + 3)

    def add_tool_box(self, tool_name, description):
        self.ln(1)
        y_start = self.get_y()
        self.set_font('Helvetica', '', 10)
        lines = self.multi_cell(150, 5, description, split_only=True)
        h = len(lines) * 5 + 14

        if y_start + h > 272:
            self.add_page()
            y_start = self.get_y()

        # Light gray background
        self.set_fill_color(240, 240, 240)
        self.rect(22, y_start, 166, h, 'F')
        # Label
        self.set_xy(26, y_start + 3)
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(*BLACK)
        self.cell(0, 5, f'Outil recommande : {tool_name}', ln=True)
        self.set_x(26)
        self.set_font('Helvetica', '', 10)
        self.set_text_color(*DARK_GRAY)
        self.multi_cell(150, 5, description)
        self.set_y(y_start + h + 2)

    def add_stat_highlight(self, stat):
        """Highlighted stat in orange box"""
        self.ln(1)
        y = self.get_y()
        self.set_font('Helvetica', 'B', 11)
        lines = self.multi_cell(160, 6, stat, split_only=True)
        h = len(lines) * 6 + 8

        if y + h > 272:
            self.add_page()
            y = self.get_y()

        self.set_fill_color(*ORANGE)
        self.rect(22, y, 166, h, 'F')
        self.set_xy(26, y + 4)
        self.set_text_color(*WHITE)
        self.multi_cell(158, 6, stat)
        self.set_text_color(*DARK_GRAY)
        self.set_y(y + h + 3)


def build_pdf():
    pdf = SEOGuidePDF()
    pdf.set_left_margin(20)
    pdf.set_right_margin(20)

    # ═══════════════════════════════════════════
    # PAGE 1: COVER
    # ═══════════════════════════════════════════
    pdf.add_cover()

    # ═══════════════════════════════════════════
    # PAGE 2: SOMMAIRE
    # ═══════════════════════════════════════════
    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 24)
    pdf.set_text_color(*BLACK)
    pdf.cell(0, 12, 'Sommaire', ln=True)
    pdf.ln(3)
    # Orange line
    pdf.set_draw_color(*ORANGE)
    pdf.set_line_width(1)
    pdf.line(20, pdf.get_y(), 80, pdf.get_y())
    pdf.ln(8)

    sommaire = [
        ("Introduction", "3"),
        ("Erreur #1 \u2014 Ignorer l'intention de recherche", "4"),
        ("Erreur #2 \u2014 Negliger le maillage interne", "6"),
        ("Erreur #3 \u2014 Oublier les balises title et meta descriptions", "8"),
        ("Erreur #4 \u2014 Ne pas optimiser pour mobile", "10"),
        ("Erreur #5 \u2014 Ignorer la vitesse de chargement", "12"),
        ("Erreur #6 \u2014 Dupliquer du contenu", "14"),
        ("Erreur #7 \u2014 Negliger les donnees structurees", "16"),
        ("Erreur #8 \u2014 Ne pas suivre ses positions", "18"),
        ("Erreur #9 \u2014 Acheter des backlinks toxiques", "20"),
        ("Erreur #10 \u2014 Ne pas avoir de strategie de contenu", "22"),
        ("Checklist recapitulative", "24"),
        ("A propos de Save Your Web", "25"),
    ]
    for title, page in sommaire:
        pdf.set_font('Helvetica', '', 12)
        pdf.set_text_color(*DARK_GRAY)
        title_w = pdf.get_string_width(title)
        page_w = pdf.get_string_width(page)
        dots_w = 170 - title_w - page_w - 5
        dots = '.' * int(dots_w / pdf.get_string_width('.'))
        pdf.cell(title_w + 2, 8, title, ln=False)
        pdf.set_text_color(*LIGHT_GRAY)
        pdf.cell(dots_w, 8, dots, ln=False)
        pdf.set_text_color(*ORANGE)
        pdf.set_font('Helvetica', 'B', 12)
        pdf.cell(page_w, 8, page, ln=True)

    # ═══════════════════════════════════════════
    # PAGE 3: INTRODUCTION
    # ═══════════════════════════════════════════
    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 24)
    pdf.set_text_color(*BLACK)
    pdf.cell(0, 12, 'Introduction', ln=True)
    pdf.ln(2)
    pdf.set_draw_color(*ORANGE)
    pdf.set_line_width(1)
    pdf.line(20, pdf.get_y(), 80, pdf.get_y())
    pdf.ln(6)

    pdf.add_paragraph(
        "Vous investissez du temps, de l'energie et parfois de l'argent dans votre site web. "
        "Pourtant, votre trafic organique stagne \u2014 ou pire, il baisse. Vous n'etes pas seul : "
        "selon une etude Ahrefs, 96,55% des pages web ne recoivent aucun trafic organique de Google."
    )
    pdf.add_paragraph(
        "La bonne nouvelle ? Dans la grande majorite des cas, ce n'est pas un probleme de chance ou "
        "d'algorithme imprevisible. Ce sont des erreurs techniques et strategiques identifiables et corrigeables "
        "qui freinent vos performances SEO."
    )
    pdf.add_paragraph(
        "Ce guide recense les 10 erreurs les plus frequentes que je constate apres 9 ans d'experience "
        "en SEO, sur des projets allant de la PME au grand compte (NRJ, Edenred, IZAC, JD2M, L-Expert-Comptable.com). "
        "Pour chaque erreur, vous trouverez : le probleme explique clairement, des chiffres concrets issus d'etudes "
        "recentes, un plan d'action actionnable, et un outil gratuit pour commencer tout de suite."
    )
    pdf.add_paragraph(
        "Ce guide s'adresse aux dirigeants, responsables marketing et webmasters qui veulent reprendre le controle "
        "de leur visibilite organique \u2014 sans jargon inutile, sans promesses vides."
    )
    pdf.ln(3)
    pdf.add_paragraph(
        "Bonne lecture,\nPierre-Charles Relange\nFondateur de Save Your Web"
    )

    # ═══════════════════════════════════════════
    # ERREUR 1: INTENTION DE RECHERCHE
    # ═══════════════════════════════════════════
    pdf.add_page()
    pdf.add_section_title(1, "Ignorer l'intention de recherche")

    pdf.add_subsection("Le probleme")
    pdf.add_paragraph(
        "Vous ciblez un mot-cle a fort volume, vous redigez un article de 2 000 mots, vous publiez... "
        "et rien ne se passe. Le probleme n'est pas votre contenu \u2014 c'est que vous n'avez pas "
        "compris ce que l'utilisateur cherche reellement."
    )
    pdf.add_paragraph(
        "Google classe les intentions de recherche en 4 categories : informationnelle (\"comment faire\"), "
        "navigationnelle (\"site officiel Nike\"), transactionnelle (\"acheter iPhone 16 Pro\") et "
        "investigationnelle (\"meilleur CRM 2026 comparatif\"). Si votre page e-commerce tente de se "
        "positionner sur une requete informationnelle, vous etes en decalage complet."
    )
    pdf.add_paragraph(
        "C'est l'erreur la plus repandue et la plus couteuse : vous investissez dans du contenu qui ne "
        "correspond pas a ce que Google attend pour cette requete. Et Google le sait \u2014 il analyse "
        "les signaux utilisateurs (taux de clic, pogosticking, temps passe) pour evaluer si votre page "
        "repond a l'intent."
    )

    pdf.add_subsection("L'impact en chiffres")
    pdf.add_stat_highlight(
        "Selon Backlinko, la page en position 1 capte 27,6% des clics. "
        "Une page mal alignee avec l'intent chute rapidement au-dela de la position 5, "
        "ou le CTR tombe sous les 5%."
    )
    pdf.add_paragraph(
        "Une etude Semrush de 2024 montre que 72% des pages qui ne rankent pas "
        "souffrent d'un mismatch entre le contenu et l'intention de recherche. Ce n'est pas "
        "un probleme d'autorite ou de technique \u2014 c'est un probleme de pertinence."
    )

    pdf.add_subsection("Comment corriger")
    pdf.add_bullet("Analysez la SERP avant d'ecrire : tapez votre mot-cle dans Google et regardez les 10 premiers resultats. Si ce sont des guides, ecrivez un guide. Si ce sont des pages produit, creez une page produit.")
    pdf.add_bullet("Identifiez le format attendu : liste, tutoriel step-by-step, comparatif, page categorie, video ? Google vous montre exactement ce qu'il veut.")
    pdf.add_bullet("Utilisez les \"People Also Ask\" pour enrichir votre contenu avec les sous-questions liees a l'intent principal.")
    pdf.add_bullet("Segmentez vos mots-cles par intent dans votre calendrier editorial. Un mot-cle = une intention = un type de contenu.")
    pdf.add_bullet("Revoyez vos pages existantes : si une page stagne malgre un bon contenu, verifiez l'alignement intent. Un recadrage peut suffire a debloquer le ranking.")

    pdf.add_tool_box("Google Search Console + analyse SERP manuelle",
                     "Gratuit. Regardez quels mots-cles amenent du trafic, quels CTR vous obtenez, et comparez avec ce que la SERP affiche. Si votre CTR est faible sur un mot-cle ou vous etes bien positionne, c'est probablement un probleme d'intent.")

    pdf.add_tip_box(
        "Mon reflexe avant chaque brief de contenu : je tape le mot-cle dans Google en navigation privee, "
        "je screenshot la SERP, et je note le format dominant. Si 8 resultats sur 10 sont des articles "
        "\"Top 10\" et que mon client veut une page service, je lui dis non. C'est aussi simple que ca."
    )

    # ═══════════════════════════════════════════
    # ERREUR 2: MAILLAGE INTERNE
    # ═══════════════════════════════════════════
    pdf.add_page()
    pdf.add_section_title(2, "Negliger le maillage interne")

    pdf.add_subsection("Le probleme")
    pdf.add_paragraph(
        "Le maillage interne est l'infrastructure invisible de votre SEO. C'est lui qui distribue "
        "le \"jus\" (PageRank) entre vos pages, qui aide Google a comprendre votre architecture, "
        "et qui guide les utilisateurs vers les contenus pertinents."
    )
    pdf.add_paragraph(
        "Pourtant, la plupart des sites se contentent de liens dans le menu de navigation et d'un footer generique. "
        "Resultat : des pages orphelines (sans aucun lien interne) que Google ne decouvre jamais, "
        "des pages strategiques qui ne recoivent pas assez de \"poids\", et une structure thematique "
        "incomprehensible pour les crawlers."
    )
    pdf.add_paragraph(
        "Sur les audits que je realise, je trouve en moyenne 15 a 25% de pages orphelines sur les sites "
        "de plus de 200 pages. Ces pages existent dans le sitemap mais n'ont aucun chemin d'acces interne. "
        "C'est comme avoir un rayon dans votre magasin sans aucune signaletique pour y acceder."
    )

    pdf.add_subsection("L'impact en chiffres")
    pdf.add_stat_highlight(
        "Les pages orphelines sont indexees 3 a 5 fois moins souvent que les pages bien maillees. "
        "Un maillage interne optimise peut augmenter le trafic organique de 40% "
        "sur les pages ciblees (etude Onely, 2023)."
    )
    pdf.add_paragraph(
        "Google a confirme que les liens internes sont l'un des signaux les plus importants pour "
        "comprendre la structure d'un site. John Mueller a declare : \"Les liens internes sont "
        "super critiques pour le SEO. C'est l'un des plus gros leviers que vous avez.\""
    )

    pdf.add_subsection("Comment corriger")
    pdf.add_bullet("Identifiez vos pages orphelines avec Screaming Frog : crawlez votre site et croisez avec votre sitemap. Toute URL dans le sitemap mais pas dans le crawl = page orpheline.")
    pdf.add_bullet("Construisez des silos thematiques : regroupez vos contenus par themes et liez-les entre eux. Une page pilier (pillar page) + 5-10 articles satellites avec des liens bidirectionnels.")
    pdf.add_bullet("Ajoutez des liens contextuels dans le corps de vos articles, pas uniquement dans la sidebar ou le footer. Un lien dans le texte a plus de poids qu'un lien dans un widget.")
    pdf.add_bullet("Utilisez des ancres descriptives et variees. Evitez \"cliquez ici\" : preferez \"decouvrez notre guide sur le maillage interne\" avec le mot-cle dans l'ancre.")
    pdf.add_bullet("Automatisez avec des blocs \"Articles lies\" en fin de page, mais ne les considorez pas comme suffisants. Le vrai maillage est editorial, dans le contenu.")

    pdf.add_tool_box("Screaming Frog SEO Spider (gratuit jusqu'a 500 URLs)",
                     "Crawlez votre site, allez dans Rapports > Liens > Pages orphelines. Vous verrez immediatement quelles pages n'ont aucun lien interne. Exportez la liste et corrigez page par page.")

    pdf.add_tip_box(
        "Je cree systematiquement une matrice de maillage interne dans un Google Sheets pour mes clients. "
        "Colonne A : URL source. Colonne B : URL cible. Colonne C : ancre utilisee. "
        "Ca prend 2h a construire, mais ca evite les liens au hasard et ca garantit que chaque page "
        "strategique recoit au moins 5-10 liens internes de qualite."
    )

    # ═══════════════════════════════════════════
    # ERREUR 3: BALISES TITLE ET META DESCRIPTIONS
    # ═══════════════════════════════════════════
    pdf.add_page()
    pdf.add_section_title(3, "Oublier les balises title et meta descriptions")

    pdf.add_subsection("Le probleme")
    pdf.add_paragraph(
        "La balise title et la meta description sont votre vitrine sur Google. C'est ce que l'utilisateur "
        "voit avant de decider s'il clique ou s'il passe. Pourtant, des milliers de sites laissent encore "
        "des titles generiques (\"Accueil\", \"Page produit\"), des descriptions vides, ou des textes "
        "tronques qui ne donnent aucune envie de cliquer."
    )
    pdf.add_paragraph(
        "La balise title est un facteur de ranking direct \u2014 c'est confirme par Google. La meta description "
        "n'influence pas directement le ranking, mais elle impacte massivement le CTR, qui lui-meme "
        "est un signal indirect fort. Un bon CTR = Google comprend que votre page repond a la requete."
    )

    pdf.add_subsection("L'impact en chiffres")
    pdf.add_stat_highlight(
        "Selon une etude Backlinko, les titles contenant le mot-cle exact ont un CTR 1,5x superieur. "
        "La longueur optimale du title en 2026 : 50-60 caracteres (environ 600 pixels). "
        "Au-dela, Google tronque avec \"...\"."
    )
    pdf.add_paragraph(
        "Les meta descriptions optimisees peuvent augmenter le CTR de 5,8% par rapport aux descriptions "
        "auto-generees par Google (etude Yoast). La longueur ideale : 150-155 caracteres. Google peut "
        "afficher jusqu'a 160 caracteres, mais tronque souvent au-dela de 155."
    )

    pdf.add_subsection("Comment corriger")
    pdf.add_bullet("Auditez toutes vos balises title avec Screaming Frog : identifiez les titles manquants, dupliques, trop longs ou trop courts. Priorisez les pages a fort trafic.")
    pdf.add_bullet("Formule title efficace : [Mot-cle principal] + [Benefice] + [Marque]. Exemple : \"Audit SEO Gratuit | Boostez votre trafic | Save Your Web\"")
    pdf.add_bullet("Redigez des meta descriptions qui donnent envie d'agir : incluez un benefice concret, un chiffre si possible, et un CTA implicite. Exemple : \"Decouvrez les 10 erreurs SEO qui plombent votre trafic et apprenez a les corriger en moins d'une semaine.\"")
    pdf.add_bullet("Evitez le keyword stuffing : une fois le mot-cle dans le title suffit. Google penalise les titles suroptimises depuis la Title Tag Update de 2021.")
    pdf.add_bullet("Testez vos titles avec un outil SERP preview avant de publier. Verifiez qu'ils ne sont pas tronques et qu'ils se demarquent des concurrents.")

    pdf.add_tool_box("Screaming Frog + SERP Preview tools (mangools.com/serp-simulator)",
                     "Screaming Frog audite vos titles et metas en masse. Le SERP simulator de Mangools vous montre exactement comment votre resultat apparaitra dans Google \u2014 gratuit et instantane.")

    pdf.add_tip_box(
        "Mon approche : je regarde toujours les titles de mes 3 principaux concurrents sur la requete cible. "
        "Si tout le monde ecrit \"Meilleur [produit] 2026\", je cherche l'angle differenciateur. "
        "\"Le seul guide [produit] ecrit par un expert de 9 ans\" se demarque et genere plus de clics. "
        "La SERP est un rayonnage : il faut que votre emballage sorte du lot."
    )

    # ═══════════════════════════════════════════
    # ERREUR 4: OPTIMISATION MOBILE
    # ═══════════════════════════════════════════
    pdf.add_page()
    pdf.add_section_title(4, "Ne pas optimiser pour mobile")

    pdf.add_subsection("Le probleme")
    pdf.add_paragraph(
        "Depuis 2019, Google utilise le mobile-first indexing : c'est la version mobile de votre site "
        "qui est crawlee et indexee en priorite. Si votre site mobile est lent, mal structure ou "
        "offre une experience degradee, c'est TOUTE votre visibilite qui en souffre \u2014 meme sur desktop."
    )
    pdf.add_paragraph(
        "Le probleme ne se limite pas au responsive design. Un site peut etre techniquement responsive "
        "(il s'adapte a l'ecran) tout en etant inutilisable sur mobile : textes trop petits, boutons "
        "trop proches, images non optimisees, pop-ups intrusifs, formulaires impossibles a remplir."
    )

    pdf.add_subsection("L'impact en chiffres")
    pdf.add_stat_highlight(
        "En 2025, le trafic mobile represente plus de 60% du trafic web mondial (Statista). "
        "Google penalise activement les sites non mobile-friendly depuis la mise a jour "
        "Mobile-Friendly de 2015, renforcee par le mobile-first indexing en 2019."
    )
    pdf.add_paragraph(
        "53% des visiteurs mobiles quittent un site qui met plus de 3 secondes a charger (Google). "
        "Les sites qui passent de \"mauvais\" a \"bon\" en Core Web Vitals sur mobile constatent "
        "une augmentation de 24% du nombre de pages vues par session."
    )

    pdf.add_subsection("Comment corriger")
    pdf.add_bullet("Testez votre site avec le test Mobile-Friendly de Google (search.google.com/test/mobile-friendly). C'est gratuit, instantane et vous donne un diagnostic precis.")
    pdf.add_bullet("Verifiez vos Core Web Vitals mobiles dans Google Search Console > Experience > Core Web Vitals. Concentrez-vous sur les URLs classees \"Mauvais\" ou \"A ameliorer\".")
    pdf.add_bullet("Optimisez la taille de vos touches : minimum 48x48px avec 8px d'espacement (Google Guidelines). Testez vous-meme sur votre telephone, pas juste en emulateur.")
    pdf.add_bullet("Supprimez ou adaptez les pop-ups mobiles intrusifs (Google les penalise depuis 2017). Utilisez des bannieres fines en haut de page plutot que des interstitiels plein ecran.")
    pdf.add_bullet("Compressez vos images en WebP et activez le lazy loading. Sur mobile, chaque Ko compte. Visez un poids de page total < 1,5 Mo.")

    pdf.add_tool_box("Google PageSpeed Insights (pagespeed.web.dev)",
                     "Testez n'importe quelle URL et obtenez un score mobile separe du desktop, avec les Core Web Vitals en conditions reelles (donnees CrUX) et en lab (Lighthouse). Gratuit et directement de Google.")

    pdf.add_tip_box(
        "Je teste systematiquement les sites de mes clients sur MON telephone, en 4G, "
        "pas en wifi depuis le bureau. La realite terrain est souvent bien pire que ce que montre l'emulateur. "
        "Si je dois pincer pour zoomer ou si un bouton ne repond pas au premier tap, c'est un probleme."
    )

    # ═══════════════════════════════════════════
    # ERREUR 5: VITESSE DE CHARGEMENT
    # ═══════════════════════════════════════════
    pdf.add_page()
    pdf.add_section_title(5, "Ignorer la vitesse de chargement")

    pdf.add_subsection("Le probleme")
    pdf.add_paragraph(
        "La vitesse de chargement n'est plus un \"nice to have\" \u2014 c'est un facteur de ranking officiel "
        "depuis 2021 avec les Core Web Vitals. Google mesure 3 metriques precises : LCP (Largest Contentful Paint), "
        "INP (Interaction to Next Paint, qui a remplace FID en mars 2024) et CLS (Cumulative Layout Shift)."
    )
    pdf.add_paragraph(
        "Le LCP mesure le temps d'affichage du plus grand element visible (hero image, titre principal). "
        "L'objectif : moins de 2,5 secondes. L'INP mesure la reactivite aux interactions utilisateur. "
        "Objectif : moins de 200ms. Le CLS mesure la stabilite visuelle (les elements qui \"sautent\" "
        "pendant le chargement). Objectif : moins de 0,1."
    )
    pdf.add_paragraph(
        "Beaucoup de sites e-commerce et de sites WordPress charges de plugins sont en echec sur au moins "
        "une de ces metriques. Le probleme : ces metriques sont mesurees en conditions reelles (donnees "
        "CrUX issues des navigateurs Chrome des vrais utilisateurs), pas en lab."
    )

    pdf.add_subsection("L'impact en chiffres")
    pdf.add_stat_highlight(
        "Les sites qui chargent en 1 seconde ont un taux de rebond de 7%. "
        "A 3 secondes : 11%. A 5 secondes : 38% (Pingdom). "
        "Chaque seconde supplementaire coute 4,42% de conversions en moins (Portent)."
    )
    pdf.add_paragraph(
        "63% des visiteurs quittent un site qui met plus de 4 secondes a charger (Yottaa, 2025). "
        "Sur mobile, chaque seconde de retard peut reduire les conversions de 20%. "
        "En e-commerce, Amazon a calcule qu'une seconde de latence represente 1,6 milliard de dollars de CA en moins par an."
    )

    pdf.add_subsection("Comment corriger")
    pdf.add_bullet("Images : convertissez en WebP/AVIF, redimensionnez a la taille d'affichage reelle (pas de 4000px pour un affichage 800px), activez le lazy loading avec loading=\"lazy\".")
    pdf.add_bullet("Fonts : limitez-vous a 2 polices maximum, utilisez font-display: swap pour eviter le FOIT (Flash of Invisible Text), et preloadez la police principale avec <link rel=\"preload\">.")
    pdf.add_bullet("JavaScript : identifiez et reportez les scripts non-critiques avec defer ou async. Supprimez les plugins WordPress inutiles (chaque plugin = potentiellement 50-200ms de temps de chargement).")
    pdf.add_bullet("Serveur : activez la compression Gzip/Brotli, configurez le cache navigateur avec des headers Cache-Control longs (1 an pour les assets statiques), utilisez un CDN.")
    pdf.add_bullet("CLS : definissez des dimensions explicites (width/height) sur toutes vos images et iframes. Reservez l'espace des pubs avec des conteneurs de taille fixe.")

    pdf.add_tool_box("Google PageSpeed Insights + Web Vitals extension Chrome",
                     "PSI vous donne le diagnostic complet avec des recommandations classees par impact. L'extension Web Vitals mesure les CWV en temps reel pendant que vous naviguez. Les deux sont gratuits.")

    pdf.add_tip_box(
        "Le quick win le plus sous-estime : la compression d'images. Sur 90% des audits que je fais, "
        "les images representent 60-80% du poids total de la page. Un passage en WebP avec compression "
        "a 80% de qualite peut reduire le poids de 70% sans perte visible. Sur WordPress, j'utilise "
        "ShortPixel ou Imagify \u2014 5 minutes d'installation, des secondes gagnees immediatement."
    )

    # ═══════════════════════════════════════════
    # ERREUR 6: CONTENU DUPLIQUE
    # ═══════════════════════════════════════════
    pdf.add_page()
    pdf.add_section_title(6, "Dupliquer du contenu")

    pdf.add_subsection("Le probleme")
    pdf.add_paragraph(
        "Le contenu duplique est un piege silencieux. Il ne genere pas toujours de penalite directe, "
        "mais il dilue votre autorite, cree de la confusion pour Google, et peut faire indexer la "
        "mauvaise version de vos pages."
    )
    pdf.add_paragraph(
        "Les sources de duplication les plus courantes : pages avec et sans www, HTTP et HTTPS, "
        "parametres d'URL (tri, filtres, pagination en e-commerce), versions imprimables, contenus "
        "syndiques ou copies entre sites. Sur un site e-commerce de 5 000 produits, la navigation "
        "a facettes peut generer des dizaines de milliers de pages dupliquees."
    )
    pdf.add_paragraph(
        "Le \"near-duplicate\" est encore plus pernicieux : des pages avec 80% de contenu identique "
        "et 20% de variation (descriptions produits generiques avec juste la couleur/taille qui change). "
        "Google traite ces pages comme du thin content, ce qui affecte la qualite globale du domaine."
    )

    pdf.add_subsection("L'impact en chiffres")
    pdf.add_stat_highlight(
        "Si votre page top-performing a son autorite (link equity) diluee entre 3 URLs dupliquees, "
        "chaque version ne recoit qu'un tiers de l'autorite totale. "
        "Resultat : aucune des 3 ne se classe correctement."
    )
    pdf.add_paragraph(
        "Selon Backlinko, la duplication de contenu peut dans les cas extremes mener a la desindexation "
        "complete. Bing a confirme en 2025 que le contenu duplique nuit aussi a la visibilite dans les "
        "moteurs IA. La solution est technique mais simple : les balises canonical."
    )

    pdf.add_subsection("Comment corriger")
    pdf.add_bullet("Implementez des balises canonical (rel=\"canonical\") sur chaque page pour indiquer a Google quelle version est l'originale. C'est LA solution numero 1.")
    pdf.add_bullet("E-commerce : bloquez les facettes non-strategiques au crawl via robots.txt ou meta noindex. Ne laissez indexer que les combinaisons generatrices de trafic.")
    pdf.add_bullet("Consolidez le contenu fin (thin content) : fusionnez les pages de faible valeur en une page plus complete et redirigez les anciennes URLs en 301.")
    pdf.add_bullet("Configurez les redirections 301 de HTTP vers HTTPS et de non-www vers www (ou l'inverse). Un seul protocole, un seul prefixe.")
    pdf.add_bullet("Faites un content pruning annuel : identifiez les pages avec 0 trafic, 0 backlinks et aucun lien interne. Supprimez-les ou fusionnez-les.")

    pdf.add_tool_box("Screaming Frog + Siteliner (siteliner.com)",
                     "Screaming Frog identifie les canonicals manquants ou incoherents. Siteliner scanne votre site et detecte les pourcentages de duplication interne page par page. Gratuit jusqu'a 250 pages.")

    pdf.add_tip_box(
        "Le content pruning est mon arme secrete. Sur un client e-commerce, j'ai supprime 40% des pages "
        "(produits epuises, pages filtres inutiles, articles obsoletes) et le trafic organique a augmente "
        "de 35% en 3 mois. Google prefere un site avec 500 pages de qualite plutot que 5 000 pages mediocres."
    )

    # ═══════════════════════════════════════════
    # ERREUR 7: DONNEES STRUCTUREES
    # ═══════════════════════════════════════════
    pdf.add_page()
    pdf.add_section_title(7, "Negliger les donnees structurees")

    pdf.add_subsection("Le probleme")
    pdf.add_paragraph(
        "Les donnees structurees (schema.org) sont le langage que vous utilisez pour \"parler\" directement "
        "a Google. Elles permettent d'obtenir des rich snippets \u2014 ces resultats enrichis avec des etoiles, "
        "des prix, des FAQ, des images, des avis qui occupent plus d'espace dans la SERP et attirent l'oeil."
    )
    pdf.add_paragraph(
        "Pourtant, la majorite des sites n'implementent aucun schema, ou se limitent au schema Organization "
        "de base. C'est une opportunite manquee massive, surtout dans un contexte ou la SERP est de plus "
        "en plus riche (AI Overviews, Featured Snippets, People Also Ask, Knowledge Panels)."
    )
    pdf.add_paragraph(
        "Les types de schemas les plus impactants : Product (e-commerce), FAQ (contenu editorial), "
        "Review/AggregateRating (pages avis), HowTo (tutoriels), Article (blog), LocalBusiness (SEO local), "
        "Event (evenements). Chacun active un type de rich snippet different dans la SERP."
    )

    pdf.add_subsection("L'impact en chiffres")
    pdf.add_stat_highlight(
        "Les rich snippets augmentent le CTR de 20 a 35% en moyenne (etude 2024-2025). "
        "Rotten Tomatoes a constate une hausse de 25% de CTR apres avoir ajoute "
        "des donnees structurees sur 100 000 pages."
    )
    pdf.add_paragraph(
        "Les resultats avec des etoiles (AggregateRating) ont un CTR 17% superieur aux resultats sans. "
        "Les FAQ schema permettent d'occuper 2 a 3 fois plus d'espace dans la SERP, repoussant les "
        "concurrents vers le bas. C'est du bien immobilier SERP gratuit."
    )

    pdf.add_subsection("Comment corriger")
    pdf.add_bullet("Identifiez les schemas pertinents pour votre activite : Product pour l'e-commerce, LocalBusiness pour le local, Article pour le blog, FAQ pour les pages de contenu informatif.")
    pdf.add_bullet("Utilisez le format JSON-LD (recommande par Google) plutot que Microdata ou RDFa. Integrez le code dans le <head> de chaque page.")
    pdf.add_bullet("Testez systematiquement avec le Rich Results Test de Google (search.google.com/test/rich-results) avant et apres implementation.")
    pdf.add_bullet("Surveillez les erreurs de donnees structurees dans Google Search Console > Ameliorations. Google vous signale les problemes de validation.")
    pdf.add_bullet("Automatisez : sur WordPress, utilisez Rank Math ou Yoast SEO Pro pour generer les schemas Product, Article et FAQ sans coder. Sur mesure, integrez dans votre CMS.")

    pdf.add_tool_box("Google Rich Results Test + Schema Markup Validator",
                     "Le Rich Results Test vous dit si votre page est eligible aux resultats enrichis et detecte les erreurs. Le Schema Validator (validator.schema.org) verifie la syntaxe JSON-LD. Les deux sont gratuits.")

    pdf.add_tip_box(
        "Le FAQ schema est mon favori pour les pages editoriales. Ajoutez 3-5 questions/reponses pertinentes "
        "en bas de vos articles et balisez-les en FAQ schema. Resultat : votre snippet dans Google prend "
        "3x plus de place, votre CTR explose, et vous captez des clics que vos concurrents n'ont meme pas. "
        "Attention : Google a restreint l'affichage FAQ aux sites de sante et gouvernementaux depuis 2023, "
        "mais le schema reste utile pour les AI Overviews."
    )

    # ═══════════════════════════════════════════
    # ERREUR 8: SUIVI DES POSITIONS
    # ═══════════════════════════════════════════
    pdf.add_page()
    pdf.add_section_title(8, "Ne pas suivre ses positions")

    pdf.add_subsection("Le probleme")
    pdf.add_paragraph(
        "\"On fait du SEO\" ne veut rien dire si vous ne mesurez pas les resultats. Beaucoup d'entreprises "
        "investissent dans le SEO a l'aveugle : elles publient du contenu, obtiennent des backlinks, "
        "mais ne savent pas si elles progressent, stagnent ou reculent."
    )
    pdf.add_paragraph(
        "Sans suivi de positions, vous ne pouvez pas savoir quelles actions ont fonctionne, quelles pages "
        "perdent du terrain, quels concurrents vous depassent, ou quel impact a eu la derniere mise a jour "
        "d'algorithme. Vous pilotez a l'aveugle."
    )
    pdf.add_paragraph(
        "Le pire : la majorite des sites ne suivent que le trafic global dans Google Analytics. "
        "Mais le trafic global ne vous dit pas POURQUOI il monte ou baisse. Vous avez besoin de "
        "donees granulaires : position par mot-cle, CTR par page, impressions par requete."
    )

    pdf.add_subsection("L'impact en chiffres")
    pdf.add_stat_highlight(
        "Les sites qui suivent et optimisent activement leurs positions gagnent en moyenne "
        "20-30% de trafic organique en plus par an par rapport a ceux qui \"font du SEO\" sans mesurer "
        "(etude BrightEdge)."
    )
    pdf.add_paragraph(
        "Google effectue des milliers de mises a jour d'algorithme par an. Sans tracking, vous ne "
        "detectez une chute que quand le trafic s'effondre \u2014 souvent des semaines trop tard. "
        "Un bon tracking vous alerte en 24-48h."
    )

    pdf.add_subsection("Comment corriger")
    pdf.add_bullet("Configurez Google Search Console (GSC) : c'est gratuit, officiel, et ca vous donne vos positions reelles, votre CTR, vos impressions et vos clics par requete et par page.")
    pdf.add_bullet("Definissez vos 20-50 mots-cles strategiques et suivez-les hebdomadairement. Classez-les par priorite business (mots-cles money vs informationnels).")
    pdf.add_bullet("Creez un dashboard SEO avec les KPIs essentiels : trafic organique, positions top 3/10/20, CTR moyen, pages indexees, erreurs d'indexation, Core Web Vitals.")
    pdf.add_bullet("Comparez-vous a vos concurrents : utilisez un outil de tracking pour voir si vous gagnez ou perdez des positions par rapport a eux, pas juste en absolu.")
    pdf.add_bullet("Automatisez les alertes : configurez des notifications quand un mot-cle strategique chute de plus de 5 positions ou quand le trafic baisse de plus de 15%.")

    pdf.add_tool_box("Google Search Console (gratuit) + SE Ranking / Semrush (freemium)",
                     "GSC est indispensable et gratuit. Pour le tracking de positions quotidien et le suivi concurrentiel, SE Ranking offre un plan abordable. Semrush et Ahrefs sont plus complets mais plus chers.")

    pdf.add_tip_box(
        "Je fais un rapport SEO mensuel pour tous mes clients avec un format simple : "
        "une page, 5 KPIs, la tendance sur 3 mois, et 3 actions prioritaires pour le mois suivant. "
        "Pas de rapport de 50 pages que personne ne lit. Un dashboard clair, actionnable, en 5 minutes. "
        "C'est ce qui fait la difference entre du SEO qui avance et du SEO qui tourne en rond."
    )

    # ═══════════════════════════════════════════
    # ERREUR 9: BACKLINKS TOXIQUES
    # ═══════════════════════════════════════════
    pdf.add_page()
    pdf.add_section_title(9, "Acheter des backlinks toxiques")

    pdf.add_subsection("Le probleme")
    pdf.add_paragraph(
        "Les backlinks restent l'un des 3 facteurs de ranking les plus importants. La tentation est grande "
        "d'en acheter pour accelerer les resultats. Le probleme : Google a des annees d'avance sur les "
        "vendeurs de liens. SpamBrain, son systeme d'IA anti-spam, detecte les patterns de liens artificiels "
        "avec une precision redoutable."
    )
    pdf.add_paragraph(
        "Les PBN (Private Blog Networks) \u2014 ces reseaux de sites crees uniquement pour generer des liens \u2014 "
        "sont activement cibles par Google. Les fermes de liens, les annuaires de mauvaise qualite, les "
        "commentaires de blog spam, les liens dans les footers de sites tiers : tout ca est detecte et "
        "peut entrainer une penalite manuelle ou algorithmique."
    )
    pdf.add_paragraph(
        "En aout 2025, Google a lance une mise a jour Spam specifique qui a impacte des milliers de sites "
        "ayant utilise des reseaux de liens artificiels. Certains ont perdu 80% de leur trafic du jour au lendemain. "
        "La recuperation apres une penalite de liens prend 6 a 18 mois \u2014 si elle est possible."
    )

    pdf.add_subsection("L'impact en chiffres")
    pdf.add_stat_highlight(
        "La mise a jour Spam d'aout 2025 de Google a cible les sites utilisant des PBN "
        "et des reseaux de liens artificiels. Certains sites ont perdu "
        "jusqu'a 80% de leur trafic organique en quelques jours."
    )
    pdf.add_paragraph(
        "Google traite plus de 700 000 actions manuelles par an pour violation de ses guidelines sur les liens "
        "(Google Web Spam Report 2024). SpamBrain neutralise des milliards de pages spam par an. "
        "Le risque n'est pas theorique \u2014 il est reel et mesurable."
    )

    pdf.add_subsection("Comment corriger")
    pdf.add_bullet("Auditez votre profil de backlinks avec Ahrefs ou Semrush : identifiez les liens venant de domaines suspects (DA < 10, sites en langue etrangere sans rapport, PBN evidents).")
    pdf.add_bullet("Utilisez l'outil de desaveu de liens de Google (Google Disavow Tool) pour signaler les liens toxiques que vous ne pouvez pas faire supprimer manuellement.")
    pdf.add_bullet("Construisez des liens legitimement : digital PR, guest posting de qualite, creation de contenu linkable (etudes, infographies, outils gratuits), partenariats editoriaux.")
    pdf.add_bullet("Surveillez votre profil de liens mensuellement : un afflux soudain de liens de mauvaise qualite peut indiquer une attaque de negative SEO ou un ancien prestataire douteux.")
    pdf.add_bullet("Privilegiez la qualite sur la quantite : 10 liens de sites d'autorite dans votre thematique valent plus que 1 000 liens de sites spammy.")

    pdf.add_tool_box("Google Search Console (section Liens) + Ahrefs Backlink Checker (gratuit, limite)",
                     "GSC vous montre vos backlinks vus par Google. Ahrefs Backlink Checker gratuit vous donne les 100 premiers liens et le Domain Rating. Pour un audit complet, un essai gratuit Ahrefs ou Semrush suffit.")

    pdf.add_tip_box(
        "La meilleure strategie de netlinking que j'ai vue fonctionner : creer un contenu tellement utile "
        "que les gens le citent naturellement. Un outil gratuit, une etude avec des donnees originales, "
        "un template telechargeab le. Sur L-Expert-Comptable.com, les simulateurs gratuits (impots, salaire brut/net) "
        "generaient des centaines de backlinks naturels chaque annee. Zero achat de lien."
    )

    # ═══════════════════════════════════════════
    # ERREUR 10: STRATEGIE DE CONTENU
    # ═══════════════════════════════════════════
    pdf.add_page()
    pdf.add_section_title(10, "Ne pas avoir de strategie de contenu")

    pdf.add_subsection("Le probleme")
    pdf.add_paragraph(
        "Publier des articles \"quand on a le temps\" ou \"sur les sujets qui nous inspirent\" n'est pas "
        "une strategie de contenu. Sans structure, sans planning, sans objectifs clairs, votre blog est "
        "un tiroir fourre-tout qui ne rank sur rien."
    )
    pdf.add_paragraph(
        "Une strategie de contenu SEO repose sur 3 piliers : les topic clusters (groupes thematiques), "
        "le calendrier editorial, et l'E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness). "
        "Sans topic clusters, vos articles se cannibalisent entre eux. Sans calendrier, vous publiez de "
        "facon erratique. Sans E-E-A-T, Google ne vous fait pas confiance."
    )
    pdf.add_paragraph(
        "Le modele topic cluster est simple : une page pilier complete sur un sujet large (ex: \"Guide SEO 2026\") "
        "reliee a 10-15 articles satellites ciblant des sous-sujets specifiques (\"comment optimiser ses balises title\", "
        "\"qu'est-ce que le maillage interne\", etc.). Chaque article satellite lie vers la page pilier et vice versa. "
        "Ca cree une autorite thematique que Google recompense."
    )

    pdf.add_subsection("L'impact en chiffres")
    pdf.add_stat_highlight(
        "Les sites utilisant le modele topic cluster voient en moyenne une augmentation "
        "de 60% de leur trafic organique en 12 mois par rapport a une publication "
        "d'articles isoles (etude HubSpot)."
    )
    pdf.add_paragraph(
        "Google a confirme l'importance de l'E-E-A-T dans ses Quality Rater Guidelines (mises a jour en 2024). "
        "Les sites qui demontrent une expertise reelle (auteur identifie, experience terrain, sources citees) "
        "sont privilegies, surtout dans les domaines YMYL (Your Money, Your Life)."
    )

    pdf.add_subsection("Comment corriger")
    pdf.add_bullet("Faites un content gap analysis : identifiez les sujets que vos concurrents couvrent et pas vous. Utilisez Ahrefs Content Gap ou la fonctionnalite similaire de Semrush.")
    pdf.add_bullet("Construisez 3-5 topic clusters autour de vos themes principaux. Pour chaque cluster : 1 page pilier + 8-15 articles satellites + maillage interne bidirectionnel.")
    pdf.add_bullet("Creez un calendrier editorial avec un rythme realiste et tenable : mieux vaut 2 articles de qualite par mois que 8 articles bacles.")
    pdf.add_bullet("Mettez a jour vos contenus existants : un article de 2023 mis a jour avec des donnees 2026 peut regagner ses positions perdues en quelques semaines.")
    pdf.add_bullet("Signalez votre E-E-A-T : page auteur detaillee, bio en fin d'article, sources citees, temoignages clients, cas concrets. Montrez que vous savez de quoi vous parlez.")

    pdf.add_tool_box("Google Search Console + Ahrefs Content Gap (essai gratuit) + Google Trends",
                     "GSC vous montre vos requetes actuelles. Ahrefs Content Gap compare vos mots-cles a ceux de vos concurrents pour trouver les opportunites. Google Trends vous aide a prioriser les sujets saisonniers.")

    pdf.add_tip_box(
        "Ma regle d'or : avant de publier un nouvel article, je me demande \"est-ce que cet article peut etre "
        "LE meilleur resultat de Google sur ce sujet ?\". Si la reponse est non, je ne publie pas. "
        "Je prefere 20 articles exceptionnels que 200 articles moyens. En 2026, avec l'IA generative qui "
        "inonde le web de contenu generique, la qualite et l'expertise authentique sont votre seul avantage concurrentiel."
    )

    # ═══════════════════════════════════════════
    # PAGE CHECKLIST
    # ═══════════════════════════════════════════
    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 24)
    pdf.set_text_color(*BLACK)
    pdf.cell(0, 12, 'Checklist recapitulative', ln=True)
    pdf.ln(2)
    pdf.set_draw_color(*ORANGE)
    pdf.set_line_width(1)
    pdf.line(20, pdf.get_y(), 100, pdf.get_y())
    pdf.ln(6)

    pdf.add_paragraph("Passez en revue chaque point. Cochez ce qui est en place, identifiez ce qui manque.")
    pdf.ln(3)

    checklist_items = [
        ("Intention de recherche", "Chaque page cible une intention precise (info, transac, navig) alignee avec la SERP."),
        ("Maillage interne", "Aucune page orpheline, silos thematiques en place, ancres descriptives."),
        ("Balises title & meta", "Toutes les pages ont un title unique (50-60 car.) et une meta description engageante."),
        ("Optimisation mobile", "Site mobile-friendly, CWV mobile au vert, boutons 48px min, pas de pop-up intrusif."),
        ("Vitesse de chargement", "LCP < 2,5s, INP < 200ms, CLS < 0,1. Images en WebP, JS differe."),
        ("Contenu duplique", "Canonicals en place, redirections 301 configurees, content pruning annuel fait."),
        ("Donnees structurees", "Schemas pertinents implementes (Product, FAQ, Article), testes et valides."),
        ("Suivi des positions", "Dashboard SEO actif, 20-50 mots-cles suivis, alertes configurees."),
        ("Profil de backlinks", "Audit fait, liens toxiques desavoues, strategie de liens legitimes en place."),
        ("Strategie de contenu", "Topic clusters definis, calendrier editorial actif, E-E-A-T visible."),
    ]

    for i, (title, desc) in enumerate(checklist_items, 1):
        y = pdf.get_y()
        if y > 255:
            pdf.add_page()

        # Checkbox area
        pdf.set_fill_color(240, 240, 240)
        pdf.rect(22, y, 166, 16, 'F')
        pdf.set_fill_color(*ORANGE)
        pdf.rect(22, y, 3, 16, 'F')

        # Number + title
        pdf.set_xy(28, y + 1)
        pdf.set_font('Helvetica', 'B', 11)
        pdf.set_text_color(*ORANGE)
        pdf.cell(8, 6, f'#{i}', ln=False)
        pdf.set_text_color(*BLACK)
        pdf.cell(0, 6, title, ln=True)

        # Description
        pdf.set_x(36)
        pdf.set_font('Helvetica', '', 9)
        pdf.set_text_color(*DARK_GRAY)
        pdf.cell(150, 5, desc, ln=True)
        pdf.ln(3)

    # ═══════════════════════════════════════════
    # PAGE ABOUT + CTA
    # ═══════════════════════════════════════════
    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 24)
    pdf.set_text_color(*BLACK)
    pdf.cell(0, 12, 'A propos de Save Your Web', ln=True)
    pdf.ln(2)
    pdf.set_draw_color(*ORANGE)
    pdf.set_line_width(1)
    pdf.line(20, pdf.get_y(), 100, pdf.get_y())
    pdf.ln(8)

    # Author intro
    pdf.set_font('Helvetica', 'B', 14)
    pdf.set_text_color(*BLACK)
    pdf.cell(0, 8, 'Pierre-Charles Relange', ln=True)
    pdf.set_font('Helvetica', 'I', 11)
    pdf.set_text_color(*ORANGE)
    pdf.cell(0, 6, 'Consultant SEO \u2014 9 ans d\'experience', ln=True)
    pdf.ln(5)

    pdf.add_paragraph(
        "Depuis 2017, j'accompagne des entreprises de toutes tailles dans leur strategie SEO : "
        "de la startup a 0 trafic au grand compte a plusieurs millions de visites mensuelles."
    )
    pdf.add_paragraph(
        "Mon approche : des resultats mesurables, pas du blabla. Chaque recommandation est basee "
        "sur des donnees, testee sur le terrain, et suivie dans le temps."
    )

    pdf.ln(2)
    pdf.set_font('Helvetica', 'B', 13)
    pdf.set_text_color(*BLACK)
    pdf.cell(0, 8, 'Ils m\'ont fait confiance :', ln=True)
    pdf.ln(2)

    clients = ["NRJ Group", "Edenred", "IZAC Paris", "JD2M", "L-Expert-Comptable.com", "Montale Parfums", "Mancera Paris"]
    for client in clients:
        pdf.set_font('Helvetica', '', 11)
        pdf.set_text_color(*DARK_GRAY)
        pdf.cell(5, 6, '\u2022', ln=False)
        pdf.cell(0, 6, f'  {client}', ln=True)

    pdf.ln(8)

    # CTA Box
    y_cta = pdf.get_y()
    h_cta = 50
    pdf.set_fill_color(*ORANGE)
    pdf.rect(20, y_cta, 170, h_cta, 'F')

    pdf.set_xy(30, y_cta + 8)
    pdf.set_font('Helvetica', 'B', 18)
    pdf.set_text_color(*WHITE)
    pdf.cell(150, 10, 'Vous voulez un audit SEO gratuit ?', ln=True, align='C')

    pdf.set_x(30)
    pdf.set_font('Helvetica', '', 13)
    pdf.cell(150, 8, 'Decouvrez les erreurs qui freinent votre site', ln=True, align='C')
    pdf.set_x(30)
    pdf.cell(150, 8, 'et obtenez un plan d\'action personnalise.', ln=True, align='C')

    pdf.set_xy(30, y_cta + h_cta - 14)
    pdf.set_font('Helvetica', 'B', 16)
    pdf.cell(150, 10, 'saveyourweb.fr/contact', ln=True, align='C')

    pdf.set_y(y_cta + h_cta + 10)

    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(*LIGHT_GRAY)
    pdf.cell(0, 6, 'Copyright 2026 Save Your Web. Tous droits reserves.', align='C', ln=True)
    pdf.cell(0, 6, 'Ce guide est fourni a titre informatif. Toute reproduction est interdite sans autorisation.', align='C', ln=True)

    # ═══════════════════════════════════════════
    # SAVE
    # ═══════════════════════════════════════════
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    pdf.output(OUTPUT_PATH)
    print(f"PDF saved to: {OUTPUT_PATH}")
    print(f"Pages: {pdf.page_no()}")
    print(f"Size: {os.path.getsize(OUTPUT_PATH) / 1024:.1f} KB")


if __name__ == '__main__':
    build_pdf()
