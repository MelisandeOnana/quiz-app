import React from 'react';

const LoadingState = ({ message, onCancel }) => (
  <div className="loading-state">
    <h2>Chargement...</h2>
    <p>{message}</p>
    <button onClick={onCancel} className="new-quiz-btn">
      Annuler
    </button>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="error-state">
    <h2>Erreur</h2>
    <p>Erreur lors de la récupération des questions : {message}</p>
    <button onClick={onRetry} className="new-quiz-btn">
      Retour à l'écran d'accueil
    </button>
  </div>
);

const PreparationState = ({ quizParams, onCancel, categories }) => {
  const categoryName = quizParams.category 
    ? categories?.find(cat => cat.id == quizParams.category)?.name || 'Catégorie inconnue'
    : 'Toutes catégories';
  
  const difficultyName = {
    'easy': 'Facile',
    'medium': 'Moyen', 
    'hard': 'Difficile'
  }[quizParams.difficulty] || quizParams.difficulty;

  return (
    <div className="preparation-state">
      <h2>Préparation du quiz...</h2>
      <p>
        <strong>{quizParams.amount}</strong> questions<br/>
        <strong>{categoryName}</strong><br/>
        Difficulté: <strong>{difficultyName}</strong>
      </p>
      <button onClick={onCancel} className="new-quiz-btn">
        Annuler
      </button>
    </div>
  );
};

export { LoadingState, ErrorState, PreparationState };