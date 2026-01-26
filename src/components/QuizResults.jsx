import React from 'react';

const QuizResults = ({ score, totalQuestions, onNewQuiz }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  let message = "";
  let messageClass = "score-message";
  
  if (percentage >= 90) {
    message = "Excellent ! Vous maîtrisez parfaitement le sujet !";
    messageClass += " excellent";
  } else if (percentage >= 70) {
    message = "Très bien ! Vous avez de bonnes connaissances !";
    messageClass += " good";
  } else if (percentage >= 50) {
    message = "Pas mal ! Il y a encore de la marge pour progresser.";
    messageClass += " average";
  } else {
    message = "Ne vous découragez pas ! La pratique rend parfait !";
    messageClass += " poor";
  }
  
  return (
    <div className="quiz-end">
      <h2>Quiz terminé !</h2>
      <div className="final-score">
        <p>Votre score : {score} / {totalQuestions}</p>
        <p>Pourcentage : {percentage}%</p>
        <div className={messageClass}>
          {message}
        </div>
      </div>
      <button onClick={onNewQuiz} className="new-quiz-btn">
        Nouveau quiz
      </button>
    </div>
  );
};

export default QuizResults;