#!/usr/bin/env python3
"""Generate the '10 erreurs SEO' lead magnet PDF for Save Your Web."""

from fpdf import FPDF
import os

FONTS_DIR = "/home/linuxbrew/.linuxbrew/lib/python3.14/site-packages/matplotlib/mpl-data/fonts/ttf"
OUT = "/data/.openclaw/workspace/projects/saveyourweb/public/ressources/10-erreurs-seo-save-your-web.pdf"

ORANGE = (255, 106, 0)
BLACK = (26, 26, 26)
GRAY = (51, 51, 51)
LIGHT_GRAY = (120, 120, 120)
TIP_BG = (255, 245, 235)
WHITE = (255, 255, 255)

ERRORS = [
    {
        "num": "01",
        "title": "Ignorer l'intention de recherche",
        "problem": (
            "C'est l'erreur n\u00b01 que je vois chez mes clients. Vous ciblez un mot-cl\u00e9, vous cr\u00e9ez du contenu... "
            "mais Google ne vous positionne pas. Pourquoi ? Parce que votre page ne r\u00e9pond pas \u00e0 ce que l'internaute cherche vraiment.\n\n"
            "L'intention de recherche, c'est le \u00ab pourquoi \u00bb derri\u00e8re une requ\u00eate. Quelqu'un qui tape "
            "\u00ab meilleur CRM \u00bb veut un comparatif, pas une page produit. Quelqu'un qui tape \u00ab acheter iPhone 16 \u00bb "
            "veut une page e-commerce, pas un article de blog.\n\n"
            "Google l'a compris depuis BERT (2019) et le confirme avec chaque mise \u00e0 jour. Si votre contenu ne correspond pas "
            "\u00e0 l'intent, vous ne rankerez jamais, peu importe la qualit\u00e9 de votre SEO technique."
        ),
        "impact": (
            "Selon une \u00e9tude Semrush (2024), 72% des pages qui n'atteignent pas le top 10 ont un probl\u00e8me "
            "d'ad\u00e9quation avec l'intention de recherche. Une \u00e9tude Backlinko montre que les pages en position 1 "
            "ont un CTR moyen de 27.6% \u2014 mais seulement si elles correspondent \u00e0 l'intent."
        ),
        "steps": [
            "Tapez votre mot-cl\u00e9 cible dans Google et analysez les 5 premiers r\u00e9sultats",
            "Identifiez le type de contenu dominant (article, comparatif, page produit, vid\u00e9o)",
            "Adaptez votre format : si les top r\u00e9sultats sont des guides, faites un guide",
            "V\u00e9rifiez les People Also Ask pour comprendre les questions associ\u00e9es",
            "Cr\u00e9ez du contenu qui r\u00e9pond MIEUX que les pages existantes (10x content)"
        ],
        "tool": "Google Search Console (Performance > Queries) pour identifier les requ\u00eates o\u00f9 vous avez des impressions mais peu de clics \u2014 signe d'un mismatch d'intention.",
        "tip": "Avant de r\u00e9diger, je fais toujours une recherche incognito et je note le format des 5 premiers r\u00e9sultats. Si 4/5 sont des listes, je fais une liste. Si 4/5 sont des guides longs, je fais un guide long. Simple mais redoutablement efficace."
    },
    {
        "num": "02",
        "title": "N\u00e9gliger le maillage interne",
        "problem": (
            "Le maillage interne, c'est le syst\u00e8me nerveux de votre site. Sans lui, Google ne comprend pas "
            "la hi\u00e9rarchie de vos pages, ne distribue pas le PageRank correctement, et vos pages importantes "
            "restent invisibles.\n\n"
            "Je vois r\u00e9guli\u00e8rement des sites avec des pages orphelines (aucun lien interne pointant vers elles), "
            "des silos cass\u00e9s, ou pire : un footer avec 200 liens qui diluent tout le jus SEO.\n\n"
            "Le maillage interne est le levier le plus sous-estim\u00e9 du SEO. C'est gratuit, c'est rapide \u00e0 mettre en place, "
            "et les r\u00e9sultats sont souvent visibles en quelques semaines."
        ),
        "impact": (
            "Une \u00e9tude Ahrefs (2023) montre que les pages avec 5+ liens internes re\u00e7oivent en moyenne "
            "3.5x plus de trafic organique que les pages avec 0-1 lien interne. Chez un de mes clients (JD2M), "
            "la restructuration du maillage interne a g\u00e9n\u00e9r\u00e9 +22% de trafic en 6 semaines."
        ),
        "steps": [
            "Auditez vos pages orphelines avec Screaming Frog (Crawl > Orphan Pages)",
            "Cr\u00e9ez des cocons s\u00e9mantiques : page pilier + pages satellites li\u00e9es entre elles",
            "Ajoutez 3-5 liens internes contextuels par article (pas juste dans le footer)",
            "Utilisez des ancres descriptives (pas 'cliquez ici' mais 'guide du maillage interne')",
            "Priorisez les liens VERS vos pages money (services, produits, landing pages)"
        ],
        "tool": "Screaming Frog (gratuit jusqu'\u00e0 500 URLs) pour visualiser la structure de liens internes et identifier les pages orphelines.",
        "tip": "Ma r\u00e8gle : chaque nouvel article publi\u00e9 doit contenir au moins 3 liens internes vers des pages existantes, et je mets \u00e0 jour 2-3 anciens articles pour pointer vers le nouveau. \u00c7a prend 10 minutes et \u00e7a change tout."
    },
    {
        "num": "03",
        "title": "Oublier les balises title et meta descriptions",
        "problem": (
            "La balise title est le facteur on-page le plus important pour le ranking. La meta description "
            "n'est pas un facteur de ranking direct, mais elle influence le CTR \u2014 et le CTR influence le ranking.\n\n"
            "Pourtant, je vois encore des sites avec des titles g\u00e9n\u00e9riques ('Accueil - Mon Site'), des titles "
            "trop longs (tronqu\u00e9s dans les SERP), des meta descriptions vides ou dupliqu\u00e9es sur toutes les pages.\n\n"
            "C'est du SEO basique, mais 60% des sites que j'audite ont des probl\u00e8mes de titles."
        ),
        "impact": (
            "Selon une \u00e9tude Moz, une am\u00e9lioration du title tag peut g\u00e9n\u00e9rer +20% de CTR en moyenne. "
            "Backlinko a montr\u00e9 que les titles contenant le mot-cl\u00e9 exact ont un taux de clic sup\u00e9rieur de 35% "
            "vs les titles qui ne le contiennent pas. Sur un site \u00e0 100K impressions/mois, +5% de CTR = +5000 clics gratuits."
        ),
        "steps": [
            "Gardez vos titles entre 50-60 caract\u00e8res (affichage complet dans Google)",
            "Placez le mot-cl\u00e9 principal au d\u00e9but du title",
            "Utilisez des power words : 'Guide', 'Complet', '2026', chiffres, '|' comme s\u00e9parateur",
            "R\u00e9digez des meta descriptions de 120-155 caract\u00e8res avec un CTA clair",
            "Chaque page doit avoir un title et une meta description UNIQUES"
        ],
        "tool": "Google Search Console (Performance) pour identifier les pages avec beaucoup d'impressions mais un CTR faible \u2014 ce sont vos cibles prioritaires.",
        "tip": "Ma formule title qui marche : [Mot-cl\u00e9 principal] : [B\u00e9n\u00e9fice/Nombre] | [Marque]. Exemple : 'Audit SEO Gratuit : +40% de Trafic en 12 Mois | Save Your Web'. Direct, clair, diff\u00e9renciant."
    },
    {
        "num": "04",
        "title": "Ne pas optimiser pour mobile",
        "problem": (
            "Depuis mars 2021, Google utilise exclusivement le mobile-first indexing. Cela signifie que Google "
            "crawle et indexe la version mobile de votre site, pas la version desktop.\n\n"
            "Si votre site n'est pas responsive, si les boutons sont trop petits, si le texte est illisible "
            "sans zoomer, ou si des contenus sont masqu\u00e9s sur mobile \u2014 Google ne les voit tout simplement pas.\n\n"
            "En 2026, 65% du trafic web mondial vient du mobile. Ne pas optimiser pour mobile, c'est ignorer "
            "les 2/3 de votre audience."
        ),
        "impact": (
            "Google rapporte que 53% des visiteurs mobiles quittent un site qui met plus de 3 secondes \u00e0 charger. "
            "Selon Statista (2025), le trafic mobile repr\u00e9sente 65% du trafic web mondial. "
            "Les sites non mobile-friendly perdent en moyenne 50% de leur trafic organique apr\u00e8s une core update."
        ),
        "steps": [
            "Testez votre site avec le Mobile-Friendly Test de Google",
            "V\u00e9rifiez que tous les contenus sont identiques sur mobile et desktop",
            "Cibles touch minimales de 48x48px pour les boutons (recommandation Google)",
            "Taille de police minimum 16px pour le corps de texte",
            "Testez sur de vrais appareils, pas seulement le mode responsive du navigateur"
        ],
        "tool": "Google PageSpeed Insights (onglet Mobile) pour un audit complet de l'exp\u00e9rience mobile + Core Web Vitals.",
        "tip": "Je commence TOUJOURS par le mobile quand je fais un audit. Si \u00e7a marche bien sur un \u00e9cran de 375px, \u00e7a marchera partout. L'inverse n'est pas vrai."
    },
    {
        "num": "05",
        "title": "Ignorer la vitesse de chargement",
        "problem": (
            "Les Core Web Vitals (LCP, INP, CLS) sont des facteurs de ranking confirm\u00e9s depuis 2021. "
            "Google mesure l'exp\u00e9rience utilisateur r\u00e9elle de votre site via les donn\u00e9es Chrome User Experience (CrUX).\n\n"
            "LCP (Largest Contentful Paint) : le plus gros \u00e9l\u00e9ment visible doit s'afficher en moins de 2.5s. "
            "INP (Interaction to Next Paint) : la r\u00e9activit\u00e9 aux clics doit \u00eatre inf\u00e9rieure \u00e0 200ms. "
            "CLS (Cumulative Layout Shift) : les \u00e9l\u00e9ments ne doivent pas 'sauter' pendant le chargement.\n\n"
            "Un site lent = des visiteurs qui partent = un signal n\u00e9gatif pour Google."
        ),
        "impact": (
            "Google a confirm\u00e9 que les Core Web Vitals sont un facteur de ranking. Vodafone a constat\u00e9 +8% de ventes "
            "en am\u00e9liorant son LCP de 31%. Amazon estime que chaque 100ms de latence suppl\u00e9mentaire co\u00fbte 1% de ventes. "
            "Une \u00e9tude Portent (2023) montre que les sites chargeant en 1s convertissent 3x plus que ceux chargeant en 5s."
        ),
        "steps": [
            "Mesurez vos Core Web Vitals avec PageSpeed Insights (donn\u00e9es r\u00e9elles CrUX)",
            "Compressez et redimensionnez toutes les images (WebP, 80% qualit\u00e9 max)",
            "Ajoutez loading='lazy' sur les images sous la ligne de flottaison",
            "Activez la mise en cache navigateur et la compression GZIP/Brotli",
            "Retardez le chargement des scripts tiers non essentiels (defer/async)"
        ],
        "tool": "Google PageSpeed Insights + Web Vitals Chrome Extension pour un monitoring en temps r\u00e9el de vos Core Web Vitals.",
        "tip": "Les quick wins qui marchent \u00e0 chaque fois : convertir les images en WebP (-60% de poids), activer le lazy loading, et self-hoster les fonts au lieu de les charger depuis Google Fonts (-200ms facile)."
    },
    {
        "num": "06",
        "title": "Dupliquer du contenu",
        "problem": (
            "Le contenu dupliqu\u00e9, c'est quand plusieurs URLs de votre site affichent un contenu identique "
            "ou tr\u00e8s similaire. Google ne p\u00e9nalise pas directement le duplicate content, mais il CHOISIT quelle "
            "version indexer \u2014 et ce n'est pas toujours celle que vous voulez.\n\n"
            "Les sources courantes : pages avec/sans www, avec/sans trailing slash, pages de pagination, "
            "filtres e-commerce (couleur, taille, prix), versions HTTP/HTTPS, param\u00e8tres UTM.\n\n"
            "Le near-duplicate est encore pire : des pages avec 80% de contenu identique et 20% de variation "
            "(typique des pages villes en SEO local)."
        ),
        "impact": (
            "Selon Raven Tools, 29% des sites audit\u00e9s ont des probl\u00e8mes de contenu dupliqu\u00e9. "
            "Le duplicate content dilue le PageRank entre les versions, r\u00e9duit le crawl budget, "
            "et peut entra\u00eener la d\u00e9sindexation de vos pages importantes. "
            "Sur un site e-commerce avec 10 000 produits et des filtres mal g\u00e9r\u00e9s, on peut facilement g\u00e9n\u00e9rer "
            "100 000+ URLs dupliqu\u00e9es qui gaspillent le crawl budget."
        ),
        "steps": [
            "Impl\u00e9mentez les balises canonical sur toutes les pages (self-referencing canonical)",
            "G\u00e9rez les filtres e-commerce avec des canonical vers la page cat\u00e9gorie principale",
            "Redirigez les versions HTTP, www, et trailing slash vers une seule version",
            "Utilisez le robots.txt ou noindex pour les pages de pagination apr\u00e8s la page 2",
            "Faites du content pruning : supprimez ou fusionnez les pages \u00e0 faible valeur"
        ],
        "tool": "Screaming Frog (onglet Canonicals + Duplicates) pour d\u00e9tecter toutes les formes de duplication sur votre site.",
        "tip": "Le content pruning est mon arme secr\u00e8te. Chez L-Expert-Comptable.com, la suppression de 2000 pages thin content a boost\u00e9 le trafic global de +15%. Moins de pages = plus de puissance par page."
    },
    {
        "num": "07",
        "title": "N\u00e9gliger les donn\u00e9es structur\u00e9es",
        "problem": (
            "Les donn\u00e9es structur\u00e9es (Schema.org) permettent \u00e0 Google de mieux comprendre votre contenu "
            "et d'afficher des rich snippets dans les r\u00e9sultats : \u00e9toiles, FAQ, prix, images, breadcrumbs...\n\n"
            "Les rich snippets augmentent drastiquement le CTR en rendant votre r\u00e9sultat plus visible et "
            "plus attractif. Pourtant, seulement 33% des sites utilisent des donn\u00e9es structur\u00e9es.\n\n"
            "Avec l'arriv\u00e9e de la Search Generative Experience (SGE) et des AI Overviews, les donn\u00e9es "
            "structur\u00e9es deviennent encore plus cruciales pour \u00eatre cit\u00e9 par les r\u00e9ponses IA de Google."
        ),
        "impact": (
            "Selon une \u00e9tude Milestone Research, les rich results g\u00e9n\u00e8rent un CTR 58% sup\u00e9rieur aux r\u00e9sultats classiques. "
            "Les FAQ rich snippets peuvent doubler la surface occup\u00e9e dans les SERP. "
            "Search Engine Land rapporte que les pages avec des donn\u00e9es structur\u00e9es re\u00e7oivent en moyenne 30% de clics en plus."
        ),
        "steps": [
            "Ajoutez le schema Organization/LocalBusiness sur votre page d'accueil",
            "Ajoutez le schema FAQPage sur vos pages qui contiennent des FAQ",
            "Ajoutez le schema Product avec prix/avis sur vos pages produits (e-commerce)",
            "Ajoutez le schema BreadcrumbList pour afficher le fil d'Ariane dans Google",
            "Impl\u00e9mentez en JSON-LD (format recommand\u00e9 par Google, le plus simple)"
        ],
        "tool": "Rich Results Test de Google (search.google.com/test/rich-results) pour valider vos donn\u00e9es structur\u00e9es et pr\u00e9visualiser les rich snippets.",
        "tip": "Le FAQ schema est le plus facile \u00e0 impl\u00e9menter et le plus impactant. Sur mes clients, j'ajoute syst\u00e9matiquement 3-5 questions FAQ sur chaque page service. R\u00e9sultat : +40% de surface SERP en moyenne."
    },
    {
        "num": "08",
        "title": "Ne pas suivre ses positions",
        "problem": (
            "Vous ne pouvez pas am\u00e9liorer ce que vous ne mesurez pas. Pourtant, beaucoup d'entreprises "
            "font du SEO 'au feeling' sans tracker leurs positions, leur trafic organique, ou leurs conversions.\n\n"
            "Sans suivi, vous ne savez pas si vos efforts portent leurs fruits, quelles pages performent, "
            "quelles requ\u00eates vous gagnez ou perdez. Vous volez \u00e0 l'aveugle.\n\n"
            "Le SEO est un marathon, pas un sprint. Les r\u00e9sultats se mesurent sur 3-6 mois. "
            "Sans tracking, vous risquez d'abandonner trop t\u00f4t ou de continuer une strat\u00e9gie inefficace."
        ),
        "impact": (
            "Les entreprises qui suivent leurs KPIs SEO mensuellement ont un trafic organique 2.5x sup\u00e9rieur "
            "\u00e0 celles qui ne le font pas (HubSpot, 2024). Google Search Console est gratuit et vous donne "
            "les donn\u00e9es exactes de Google : impressions, clics, CTR, position moyenne par requ\u00eate."
        ),
        "steps": [
            "Configurez Google Search Console et Google Analytics 4 (gratuits)",
            "Cr\u00e9ez un dashboard avec vos 20-30 mots-cl\u00e9s prioritaires",
            "Suivez mensuellement : trafic organique, positions, CTR, conversions",
            "Analysez les tendances : quelles pages montent/descendent et pourquoi",
            "Comparez vos performances YoY (ann\u00e9e sur ann\u00e9e) pour neutraliser la saisonnalit\u00e9"
        ],
        "tool": "Google Search Console (gratuit, indispensable) + un outil de suivi de positions comme SE Ranking ou Semrush pour le suivi quotidien de vos mots-cl\u00e9s strat\u00e9giques.",
        "tip": "Chaque lundi matin, je consulte GSC pour tous mes clients. Je regarde 3 choses : les requ\u00eates en forte hausse (opportunit\u00e9s), les pages en baisse (alerte), et les nouvelles requ\u00eates qui apparaissent (quick wins)."
    },
    {
        "num": "09",
        "title": "Acheter des backlinks toxiques",
        "problem": (
            "Les backlinks restent un des top 3 facteurs de ranking Google. Mais la tentation d'acheter "
            "des liens pas chers sur Fiverr ou des PBN (Private Blog Networks) est une bombe \u00e0 retardement.\n\n"
            "Google Penguin (int\u00e9gr\u00e9 \u00e0 l'algo depuis 2016) d\u00e9tecte et d\u00e9value les liens artificiels en temps r\u00e9el. "
            "Les cons\u00e9quences vont de la perte de positions \u00e0 la p\u00e9nalit\u00e9 manuelle (d\u00e9sindexation).\n\n"
            "Le netlinking de qualit\u00e9 prend du temps et co\u00fbte plus cher, mais c'est le seul qui dure."
        ),
        "impact": (
            "Une \u00e9tude Ahrefs (2024) montre que 66% des pages sur le web n'ont aucun backlink. "
            "Les pages avec des backlinks de qualit\u00e9 (DR 50+) ont 5x plus de chances d'atteindre le top 3. "
            "En revanche, un profil de liens toxique peut faire chuter un site de 50+ positions en quelques jours "
            "lors d'un Spam Update."
        ),
        "steps": [
            "Auditez votre profil de liens avec Ahrefs ou Semrush (spam score, diversit\u00e9 des domaines)",
            "D\u00e9savouez les liens toxiques via Google Search Console (Disavow Tool)",
            "Privil\u00e9giez le Digital PR : cr\u00e9ez du contenu qui m\u00e9rite d'\u00eatre cit\u00e9 (stats, \u00e9tudes, infographies)",
            "Faites du guest posting sur des sites l\u00e9gitimes de votre secteur (pas des fermes \u00e0 liens)",
            "Construisez des relations avec des journalistes et blogueurs (HARO, Connectively)"
        ],
        "tool": "Ahrefs (Backlink Checker gratuit : ahrefs.com/backlink-checker) pour analyser la qualit\u00e9 de votre profil de liens et d\u00e9tecter les liens toxiques.",
        "tip": "Mon approche : 80% de liens gagn\u00e9s naturellement (contenu de qualit\u00e9 + PR), 20% de liens construits (guest posts cibl\u00e9s). Un seul lien depuis Le Monde ou Les Echos vaut plus que 100 liens de PBN."
    },
    {
        "num": "10",
        "title": "Ne pas avoir de strat\u00e9gie de contenu",
        "problem": (
            "Publier des articles au hasard, sans plan, sans recherche de mots-cl\u00e9s, sans calendrier \u00e9ditorial "
            "\u2014 c'est comme jeter des fl\u00e9chettes les yeux band\u00e9s. Vous toucherez peut-\u00eatre quelque chose, mais par pur hasard.\n\n"
            "Une strat\u00e9gie de contenu SEO, c'est : savoir quoi \u00e9crire (mots-cl\u00e9s), pour qui (\u00e0 quelle \u00e9tape du funnel), "
            "quand (fr\u00e9quence), et comment (format, longueur, angle).\n\n"
            "En 2026, avec l'explosion de l'IA g\u00e9n\u00e9rative, le contenu g\u00e9n\u00e9rique ne suffit plus. "
            "Google valorise l'E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness). "
            "Votre contenu doit d\u00e9montrer une expertise r\u00e9elle."
        ),
        "impact": (
            "Les entreprises qui publient 16+ articles/mois g\u00e9n\u00e8rent 3.5x plus de trafic que celles qui publient 0-4 (HubSpot). "
            "Mais la quantit\u00e9 sans qualit\u00e9 ne sert \u00e0 rien : une \u00e9tude Orbit Media (2024) montre que les articles de "
            "1500+ mots g\u00e9n\u00e8rent 2x plus de partages et 3x plus de backlinks que les articles courts."
        ),
        "steps": [
            "Faites une recherche de mots-cl\u00e9s compl\u00e8te (volume, difficult\u00e9, intention) avant de r\u00e9diger",
            "Organisez vos contenus en topic clusters : 1 page pilier + 5-10 pages satellites",
            "Cr\u00e9ez un calendrier \u00e9ditorial r\u00e9aliste (r\u00e9gularit\u00e9 > quantit\u00e9)",
            "Analysez le content gap : quels sujets vos concurrents couvrent-ils que vous ne couvrez pas ?",
            "Mettez \u00e0 jour vos anciens contenus (content refresh) \u2014 souvent plus rentable que cr\u00e9er du neuf"
        ],
        "tool": "Semrush Content Gap ou Ahrefs Content Explorer pour identifier les opportunit\u00e9s de contenu inexploit\u00e9es face \u00e0 vos concurrents.",
        "tip": "Mon processus chez mes clients : 1) Keyword research, 2) Prioriser par ROI potentiel (volume x intent commercial), 3) Briefer les r\u00e9dacteurs avec structure pr\u00e9cise, 4) Optimiser apr\u00e8s publication via GSC. Et surtout : mettre \u00e0 jour les articles existants chaque trimestre. C'est l\u00e0 que se cache le vrai ROI."
    },
]


class GuidePDF(FPDF):
    def __init__(self):
        super().__init__()
        self.add_font("DejaVu", "", os.path.join(FONTS_DIR, "DejaVuSans.ttf"))
        self.add_font("DejaVu", "B", os.path.join(FONTS_DIR, "DejaVuSans-Bold.ttf"))
        self.add_font("DejaVu", "I", os.path.join(FONTS_DIR, "DejaVuSans-Oblique.ttf"))
        self.add_font("DejaVu", "BI", os.path.join(FONTS_DIR, "DejaVuSans-BoldOblique.ttf"))
        self.set_auto_page_break(auto=True, margin=25)

    def header(self):
        if self.page_no() <= 1:
            return
        self.set_font("DejaVu", "", 8)
        self.set_text_color(*LIGHT_GRAY)
        self.cell(0, 6, "Save Your Web", align="L")
        self.cell(0, 6, f"Page {self.page_no()}", align="R", new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*ORANGE)
        self.set_line_width(0.5)
        self.line(20, 14, self.w - 20, 14)
        self.ln(4)

    def footer(self):
        if self.page_no() <= 1:
            return
        self.set_y(-15)
        self.set_font("DejaVu", "", 7)
        self.set_text_color(*LIGHT_GRAY)
        self.cell(0, 10, "saveyourweb.fr", align="C")

    def cover_page(self):
        self.add_page()
        # Orange bar top
        self.set_fill_color(*ORANGE)
        self.rect(0, 0, self.w, 8, "F")
        # Title
        self.ln(50)
        self.set_font("DejaVu", "B", 32)
        self.set_text_color(*BLACK)
        self.multi_cell(0, 14, "10 erreurs SEO\nqui tuent votre trafic", align="C")
        self.ln(6)
        self.set_font("DejaVu", "", 16)
        self.set_text_color(*ORANGE)
        self.cell(0, 10, "(et comment les corriger)", align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(15)
        self.set_font("DejaVu", "", 12)
        self.set_text_color(*GRAY)
        self.cell(0, 8, "Guide pratique \u2014 \u00c9dition 2026", align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(30)
        # Logo text
        self.set_font("DejaVu", "B", 22)
        self.set_text_color(*BLACK)
        x = (self.w - self.get_string_width("Save Your Web.")) / 2
        self.set_x(x)
        self.cell(self.get_string_width("Save Your Web"), 10, "Save Your Web")
        self.set_text_color(*ORANGE)
        self.cell(0, 10, ".")
        self.ln(12)
        self.set_font("DejaVu", "", 10)
        self.set_text_color(*LIGHT_GRAY)
        self.cell(0, 8, "saveyourweb.fr", align="C", new_x="LMARGIN", new_y="NEXT")
        # Orange bar bottom
        self.set_fill_color(*ORANGE)
        self.rect(0, self.h - 8, self.w, 8, "F")

    def toc_page(self):
        self.add_page()
        self.set_font("DejaVu", "B", 24)
        self.set_text_color(*BLACK)
        self.cell(0, 12, "Sommaire", new_x="LMARGIN", new_y="NEXT")
        self.ln(8)
        for e in ERRORS:
            self.set_font("DejaVu", "B", 12)
            self.set_text_color(*ORANGE)
            self.cell(12, 8, e["num"])
            self.set_text_color(*BLACK)
            self.cell(0, 8, e["title"], new_x="LMARGIN", new_y="NEXT")
            self.ln(2)
        self.ln(10)
        self.set_font("DejaVu", "", 10)
        self.set_text_color(*GRAY)
        self.multi_cell(0, 6, "Checklist r\u00e9capitulative ............................................. p.fin\n\u00c0 propos de Save Your Web ....................................... p.fin")

    def intro_page(self):
        self.add_page()
        self.set_font("DejaVu", "B", 22)
        self.set_text_color(*BLACK)
        self.cell(0, 12, "Introduction", new_x="LMARGIN", new_y="NEXT")
        self.ln(6)
        self.set_font("DejaVu", "", 11)
        self.set_text_color(*GRAY)
        intro = (
            "Apr\u00e8s 9 ans dans le SEO \u2014 en agence (Primelis), en grand groupe m\u00e9dia (NRJ Group), "
            "en scale-up (L-Expert-Comptable.com, JD2M) et aujourd'hui en freelance \u2014 j'ai audit\u00e9 "
            "des centaines de sites web.\n\n"
            "Et je retrouve toujours les m\u00eames erreurs. Des erreurs qui co\u00fbtent des milliers d'euros en trafic perdu, "
            "en leads non g\u00e9n\u00e9r\u00e9s, en chiffre d'affaires laiss\u00e9 sur la table.\n\n"
            "Ce guide n'est pas un cours th\u00e9orique. C'est un condensé de ce que je vois sur le terrain, "
            "chaque semaine, chez des PME, des e-commerces, des SaaS.\n\n"
            "Pour chaque erreur, vous trouverez :\n"
            "\u2022 Le probl\u00e8me expliqu\u00e9 simplement\n"
            "\u2022 L'impact chiffr\u00e9 sur votre trafic et votre business\n"
            "\u2022 Les \u00e9tapes concr\u00e8tes pour corriger\n"
            "\u2022 Un outil recommand\u00e9 (souvent gratuit)\n"
            "\u2022 Un conseil de terrain, issu de mon exp\u00e9rience\n\n"
            "L'objectif : que vous puissiez appliquer ces corrections vous-m\u00eame, "
            "d\u00e8s aujourd'hui, quel que soit votre CMS ou votre niveau technique.\n\n"
            "Bonne lecture,\n"
            "Pierre-Charles Relange\n"
            "Fondateur, Save Your Web"
        )
        self.multi_cell(0, 6.5, intro)

    def error_pages(self, e):
        self.add_page()
        # Error number + title
        self.set_font("DejaVu", "B", 40)
        self.set_text_color(*ORANGE)
        self.cell(25, 16, e["num"])
        self.set_font("DejaVu", "B", 20)
        self.set_text_color(*BLACK)
        self.multi_cell(0, 9, e["title"])
        self.ln(4)

        # Orange separator
        self.set_draw_color(*ORANGE)
        self.set_line_width(1)
        self.line(20, self.get_y(), 80, self.get_y())
        self.ln(6)

        # Problem
        self.set_font("DejaVu", "B", 13)
        self.set_text_color(*BLACK)
        self.cell(0, 8, ">> Le probl\u00e8me", new_x="LMARGIN", new_y="NEXT")
        self.ln(2)
        self.set_font("DejaVu", "", 11)
        self.set_text_color(*GRAY)
        self.multi_cell(0, 7, e["problem"])
        self.ln(8)

        # Impact
        self.set_font("DejaVu", "B", 13)
        self.set_text_color(*BLACK)
        self.cell(0, 8, "IMPACT CHIFFRE", new_x="LMARGIN", new_y="NEXT")
        self.ln(3)
        self.set_font("DejaVu", "", 11)
        self.set_text_color(*GRAY)
        self.multi_cell(0, 7, e["impact"])
        self.ln(8)

        # How to fix - always new page for readability
        self.add_page()

        # Re-show error title on continuation page
        self.set_font("DejaVu", "B", 16)
        self.set_text_color(*ORANGE)
        self.cell(0, 10, f"Erreur {e['num']} \u2014 {e['title']} (suite)", new_x="LMARGIN", new_y="NEXT")
        self.ln(6)

        self.set_font("DejaVu", "B", 13)
        self.set_text_color(*BLACK)
        self.cell(0, 8, "COMMENT CORRIGER", new_x="LMARGIN", new_y="NEXT")
        self.ln(3)
        self.set_font("DejaVu", "", 11)
        self.set_text_color(*GRAY)
        for i, step in enumerate(e["steps"], 1):
            self.multi_cell(0, 7, f"  {i}. {step}")
            self.ln(3)
        self.ln(4)

        # Tool
        if self.get_y() > 210:
            self.add_page()
        self.set_font("DejaVu", "B", 13)
        self.set_text_color(*BLACK)
        self.cell(0, 8, "OUTIL RECOMMANDE", new_x="LMARGIN", new_y="NEXT")
        self.ln(3)
        self.set_font("DejaVu", "", 11)
        self.set_text_color(*GRAY)
        self.multi_cell(0, 7, e["tool"])
        self.ln(6)

        # Pro tip box
        if self.get_y() > 230:
            self.add_page()
        y_start = self.get_y()
        self.set_fill_color(*TIP_BG)
        # Calculate height first
        self.set_font("DejaVu", "BI", 10)
        tip_text = f">  Pro tip de Pierre-Charles :\n{e['tip']}"
        # Draw background
        self.set_x(22)
        # Save position, write to get height
        y0 = self.get_y()
        self.set_font("DejaVu", "B", 10.5)
        self.set_text_color(*ORANGE)
        self.cell(0, 7, ">  Pro tip de Pierre-Charles", new_x="LMARGIN", new_y="NEXT")
        self.set_font("DejaVu", "I", 10)
        self.set_text_color(*GRAY)
        self.multi_cell(self.w - 48, 5.5, e["tip"])
        y1 = self.get_y()
        # Draw background behind
        self.set_fill_color(*TIP_BG)
        self.rect(20, y0 - 3, self.w - 40, y1 - y0 + 6, "F")
        # Draw orange left border
        self.set_draw_color(*ORANGE)
        self.set_line_width(2)
        self.line(20, y0 - 3, 20, y1 + 3)
        # Rewrite text on top
        self.set_y(y0)
        self.set_x(25)
        self.set_font("DejaVu", "B", 10.5)
        self.set_text_color(*ORANGE)
        self.cell(0, 7, ">  Pro tip de Pierre-Charles", new_x="LMARGIN", new_y="NEXT")
        self.set_x(25)
        self.set_font("DejaVu", "I", 10)
        self.set_text_color(*GRAY)
        self.multi_cell(self.w - 50, 5.5, e["tip"])

    def checklist_page(self):
        self.add_page()
        self.set_font("DejaVu", "B", 22)
        self.set_text_color(*BLACK)
        self.cell(0, 12, "Checklist r\u00e9capitulative", new_x="LMARGIN", new_y="NEXT")
        self.ln(6)
        self.set_font("DejaVu", "", 10)
        self.set_text_color(*GRAY)
        self.multi_cell(0, 6, "Cochez chaque \u00e9l\u00e9ment une fois corrig\u00e9 sur votre site :")
        self.ln(6)
        for e in ERRORS:
            self.set_font("DejaVu", "", 12)
            self.set_text_color(*ORANGE)
            self.cell(10, 8, "\u25a1")
            self.set_text_color(*BLACK)
            self.set_font("DejaVu", "B", 11)
            self.cell(12, 8, e["num"])
            self.set_font("DejaVu", "", 11)
            self.cell(0, 8, e["title"], new_x="LMARGIN", new_y="NEXT")
            self.ln(2)

    def about_page(self):
        self.add_page()
        self.set_font("DejaVu", "B", 22)
        self.set_text_color(*BLACK)
        self.cell(0, 12, "\u00c0 propos de Save Your Web", new_x="LMARGIN", new_y="NEXT")
        self.ln(6)
        self.set_font("DejaVu", "", 11)
        self.set_text_color(*GRAY)
        about = (
            "Save Your Web est une agence SEO & Google Ads fond\u00e9e par Pierre-Charles Relange, "
            "consultant SEO avec 9 ans d'exp\u00e9rience.\n\n"
            "Parcours :\n"
            "\u2022 Primelis (agence SEO top 10 France)\n"
            "\u2022 NRJ Group (+40% de trafic hors-marque sur 4 sites radio)\n"
            "\u2022 L-Expert-Comptable.com (1,2M visites SEO/mois, 60+ r\u00e9dacteurs)\n"
            "\u2022 JD2M \u2014 jedeclaremonmeuble.com (+52% de trafic organique)\n"
            "\u2022 +50 clients accompagn\u00e9s en freelance\n\n"
            "Nos services :\n"
            "\u2022 Audit SEO technique et s\u00e9mantique\n"
            "\u2022 Accompagnement SEO mensuel\n"
            "\u2022 Google Ads (Search, Shopping, Performance Max)\n"
            "\u2022 Strat\u00e9gie de contenu et netlinking\n\n"
            "Nos clients : NRJ, Edenred, IZAC, Zama, Replayce, Freelance Republik..."
        )
        self.multi_cell(0, 6.5, about)
        self.ln(10)

        # CTA box
        self.set_fill_color(*ORANGE)
        y0 = self.get_y()
        self.rect(20, y0, self.w - 40, 40, "F")
        self.set_y(y0 + 8)
        self.set_font("DejaVu", "B", 16)
        self.set_text_color(*WHITE)
        self.cell(0, 10, "Vous voulez un audit SEO gratuit ?", align="C", new_x="LMARGIN", new_y="NEXT")
        self.set_font("DejaVu", "", 12)
        self.cell(0, 10, "saveyourweb.fr/contact", align="C", new_x="LMARGIN", new_y="NEXT")


pdf = GuidePDF()
pdf.set_title("10 erreurs SEO qui tuent votre trafic - Save Your Web")
pdf.set_author("Pierre-Charles Relange - Save Your Web")

pdf.cover_page()
pdf.toc_page()
pdf.intro_page()
for error in ERRORS:
    pdf.error_pages(error)
pdf.checklist_page()
pdf.about_page()

pdf.output(OUT)

import os
size_kb = os.path.getsize(OUT) / 1024
print(f"PDF generated: {OUT}")
print(f"Pages: {pdf.page_no()}")
print(f"Size: {size_kb:.0f} KB")
