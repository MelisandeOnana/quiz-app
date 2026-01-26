import React from 'react';

const LoadingState = ({ message, onCancel }) => (
  <div>
    <div>{message}</div>
    <button onClick={onCancel} className="new-quiz-btn">
      Annuler
    </button>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div>
    <div>Erreur lors de la récupération des questions : {message}</div>
    <button onClick={onRetry} className="new-quiz-btn">
      Retour à l'écran d'accueil
    </button>
  </div>
);

const PreparationState = ({ quizParams, onCancel }) => (
  <div>
    <h2>Préparation du quiz...</h2>
    <p>
      {quizParams.amount} questions, Catégorie {quizParams.category}, Difficulté {quizParams.difficulty}
    </p>
    <button onClick={onCancel} className="new-quiz-btn">
      Annuler
    </button>
  </div>
);

export { LoadingState, ErrorState, PreparationState };