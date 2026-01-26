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
    <p>Erreur : {message}</p>
    <button onClick={onRetry} className="new-quiz-btn">
      Retour à l'accueil
    </button>
  </div>
);

const PreparationState = ({ quizParams, onCancel, categories }) => {
  const categoryName = categories?.find(cat => cat.id == quizParams.category)?.name || 'Toutes catégories';
  const difficulties = { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' };

  return (
    <div className="preparation-state">
      <h2>Préparation du quiz...</h2>
      <p>
        <strong>{quizParams.amount}</strong> questions<br/>
        <strong>{categoryName}</strong><br/>
        Difficulté: <strong>{difficulties[quizParams.difficulty] || quizParams.difficulty}</strong>
      </p>
      <button onClick={onCancel} className="new-quiz-btn">
        Annuler
      </button>
    </div>
  );
};

export { LoadingState, ErrorState, PreparationState };