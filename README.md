# Quiz App React

Une application de quiz interactif développée en React qui utilise l'API Open Trivia Database pour générer des questions dynamiques.

## Fonctionnalités

### Écran de démarrage
- Choix du nombre de questions (5, 10, ou 15)
- Sélection de catégorie (ou toutes catégories)
- Choix de difficulté (Facile, Moyen, Difficile)
- Interface intuitive avec émojis

### Récupération des questions
- Questions récupérées depuis l'API Open Trivia Database
- Indicateur de chargement pendant la récupération
- Gestion des erreurs avec messages clairs
- Support de toutes les catégories ou catégories spécifiques

### Déroulement du quiz
- Questions affichées une par une
- 4 réponses possibles (1 correcte + 3 incorrectes)
- Ordre des réponses mélangé automatiquement
- Sélection unique de réponse par question
- Feedback immédiat après chaque réponse

### Gestion du score
- Score calculé en temps réel
- Affichage de la progression (Question X / Total)
- Comparaison avec les réponses correctes de l'API

### Timer par question
- Temps limité de 15 secondes par question
- Affichage visuel du temps restant avec codes couleur :
  - 🟢 Vert : Plus de 10 secondes
  - 🟠 Orange : 5-10 secondes
  - 🔴 Rouge clignotant : Moins de 5 secondes
- Passage automatique à la question suivante quand le temps expire
- Timer correctement nettoyé pour éviter les accumulations

### Écran de fin
- Score final avec pourcentage
- Message adapté au score obtenu avec émojis :
  - 90%+ : Excellent !
  - 70-89% : Très bien !
  - 50-69% : Pas mal !
  - <50% : À améliorer !
- Bouton pour relancer un nouveau quiz

## Architecture du projet

```
src/
├── App.jsx                 # Composant principal
├── App.css                 # Styles globaux
├── main.jsx               # Point d'entrée
├── components/
│   ├── QuizStart.jsx      # Écran de démarrage
│   ├── QuizQuestion.jsx   # Affichage des questions
│   ├── QuizResults.jsx    # Écran de résultats
│   └── QuizStates.jsx     # États de chargement/erreur
├── hooks/
│   └── useTimer.js        # Hook personnalisé pour le timer
└── utils/
    └── quizUtils.js       # Utilitaires (décodage HTML, etc.)
```

## Installation et lancement

1. **Cloner le repository**
   ```bash
   git clone https://github.com/MelisandeOnana/quiz-app.git
   cd quiz-app
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer en mode développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   L'application sera accessible à `http://localhost:5173`

## Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run preview` - Prévisualise la build de production
- `npm run lint` - Vérifie le code avec ESLint

## API utilisée

L'application utilise l'[Open Trivia Database API](https://opentdb.com/) :
- API publique et gratuite
- Pas de clé d'authentification requise
- Support de multiples catégories et difficultés
- Questions au format JSON avec entités HTML décodées

Exemple d'endpoint :
```
https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple
```
---

**Développé par** : MelisandeOnana  
**Date de création** : Janvier 2026  
