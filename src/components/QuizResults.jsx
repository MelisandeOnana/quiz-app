import React from 'react';

const getScoreMessage = (percentage) => {
  const messages = {
    excellent: { text: "Excellent ! Vous maîtrisez parfaitement le sujet !", class: "excellent", min: 90 },
    good: { text: "Très bien ! Vous avez de bonnes connaissances !", class: "good", min: 70 },
    average: { text: "Pas mal ! Il y a encore de la marge pour progresser.", class: "average", min: 50 },
    poor: { text: "Ne vous découragez pas ! La pratique rend parfait !", class: "poor", min: 0 }
  };
  
  const result = Object.values(messages).find(msg => percentage >= msg.min);
  return result || messages.poor;
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