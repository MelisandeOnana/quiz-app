import React from 'react';

const getScoreMessage = (percentage) => {
  if (percentage >= 90) return { text: "Excellent ! 🎉", class: "excellent" };
  if (percentage >= 70) return { text: "Très bien ! 👍", class: "good" };
  if (percentage >= 50) return { text: "Pas mal ! 👌", class: "average" };
  return { text: "Continuez à vous entraîner ! 💪", class: "poor" };
};

const QuizResults = ({ score, totalQuestions, onNewQuiz }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const scoreMessage = getScoreMessage(percentage);
  
  return (
    <div className="quiz-end">
      <h2>Quiz terminé !</h2>
      <div className="final-score">
        <p><strong>Votre score : {score} / {totalQuestions}</strong></p>
        <p>Pourcentage : <strong>{percentage}%</strong></p>
        <div className={`score-message ${scoreMessage.class}`}>
          {scoreMessage.text}
        </div>
      </div>
      <button onClick={onNewQuiz} className="new-quiz-btn">
        Nouveau quiz
      </button>
    </div>
  );
};

export default QuizResults;