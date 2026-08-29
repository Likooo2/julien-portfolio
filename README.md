# Site de Julien Pires — Guide rapide

## 1. Ta photo
✅ Déjà intégrée : `images/julien.jpg`. Rien à faire.
Pour la changer un jour : remplace ce fichier par une nouvelle image **au même nom**
(`julien.jpg`), idéalement en format portrait (ratio proche de 3:4), au moins 900px
de large, en JPG.

## 2. Ton CV (PDF) — à faire
Le bouton "Télécharger mon CV" pointe vers `cv/CV_Julien_Pires.pdf`, mais ce fichier
n'existe pas encore (je n'avais que ton CV en `.docx`, pas de PDF).

**À faire :**
1. Exporte ton CV Word en PDF (dans Word : Fichier → Enregistrer sous → format PDF).
2. Nomme le fichier exactement `CV_Julien_Pires.pdf`.
3. Place-le dans le dossier `cv/` du site, à la racine (remplace le fichier existant s'il y en a un).

Si tu changes le nom du fichier, remplace `cv/CV_Julien_Pires.pdf` par ton nouveau nom
dans `index.html` (3 occurrences, cherche `href="cv/`).

## 3. LinkedIn
✅ Déjà intégré avec ton lien : `linkedin.com/in/julien-pires-460977383`.
Pour le changer : cherche `linkedin.com/in/julien-pires` dans `index.html` (2 occurrences)
et remplace l'URL dans les attributs `href`.

## 4. Modifier un texte
Tous les textes sont directement dans `index.html`, dans du français normal — pas besoin
de savoir coder pour les repérer et les modifier avec un éditeur de texte (ou même le Bloc-notes).

## 5. Mettre le site en ligne (gratuit) — recommandé : Netlify

**Option la plus simple (glisser-déposer, aucune inscription technique) :**
1. Va sur [app.netlify.com/drop](https://app.netlify.com/drop)
2. Crée un compte gratuit (email ou GitHub)
3. Glisse le **dossier entier** `site` (celui qui contient `index.html`, `css/`, `js/`, `images/`, `cv/`) dans la zone de dépôt
4. Netlify te donne immédiatement un lien du type `https://ton-site-1234.netlify.app`
5. Tu peux renommer ce lien gratuitement dans Site settings → Change site name (ex: `julien-pires.netlify.app`)

**Nom de domaine personnel (optionnel, payant, ex: julienpires.fr) :**
Dans Netlify : Domain settings → Add a domain, puis suis les instructions pour connecter
un domaine acheté chez un registrar (OVH, Namecheap, etc.).

**Alternative : GitHub Pages** (si tu es à l'aise avec Git) — gratuit aussi, héberge
directement depuis un dépôt GitHub.

## 6. À vérifier avant d'envoyer le lien
- [ ] Le PDF du CV est bien dans `cv/CV_Julien_Pires.pdf`
- [ ] Teste le site sur ton téléphone (le lien Netlify fonctionne partout)
- [ ] Vérifie que le bouton email et le lien LinkedIn s'ouvrent bien
