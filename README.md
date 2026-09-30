# Portfolio de Julien Pires

Site personnel en une page, publié avec GitHub Pages :
https://likooo2.github.io/julien-portfolio/

HTML, CSS et JavaScript, sans bibliothèque externe ni appel à un service tiers.

## Structure

- `index.html` : tout le contenu, dans l'ordre de la page (accueil, puis sections 01 à 07)
- `css/styles.css` : le design ; couleurs, typographie et espacements sont réglés dans les variables en haut du fichier
- `js/script.js` : écran d'accueil, menu mobile, section active, apparitions au défilement, copie de l'email, formulaire
- `fonts/` : Fraunces (titres) et Inter (texte), hébergées sur le site
- `images/` : photo en WebP (480, 720 et 900 px) avec le PNG d'origine en secours, image de partage `og-image.jpg` (1200 x 630), favicons

## Modifier un texte

Ouvrir `index.html` et chercher la phrase : chaque section est repérée par un commentaire (`01 À PROPOS`, `02 FORMATION`, etc.).

## Formulaire de contact

Le site est statique : le formulaire ne s'envoie pas sur un serveur, il ouvre la messagerie du visiteur avec le message déjà rédigé, adressé à jpires@etik.com.
