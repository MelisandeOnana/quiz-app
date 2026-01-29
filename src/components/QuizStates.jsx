import React from 'react';

const ErrorState = ({ message, onRetry }) => (
  <div className="error-state">
    <h2>Erreur</h2>
    <p>Erreur : {message}</p>
    <button onClick={onRetry} className="new-quiz-btn">
      Retour à l'accueil
    </button>
  </div>
);

export { ErrorState };