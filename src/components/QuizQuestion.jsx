import React, { useState, useEffect } from 'react';

const shuffleAnswers = (question) => {
  const answers = [...question.incorrect_answers, question.correct_answer];
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }
  return answers;
};

const QuizQuestion = ({ 
  question, 
  currentQuestionIndex, 
  totalQuestions, 
  score, 
  timeLeft, 
  onAnswerSelect, 
  onNextQuestion,
  selectedAnswer
}) => {
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  useEffect(() => {
    if (question) {
      setShuffledAnswers(shuffleAnswers(question));
    }
  }, [question]);

  if (!question) return null;

  return (
    <div className="quiz-question">
      <h2>Question {currentQuestionIndex + 1} / {totalQuestions}</h2>
      <div className="score-display">Score : {score} / {totalQuestions}</div>
      <div className={`timer-display ${timeLeft <= 5 ? 'time-critical' : timeLeft <= 10 ? 'time-warning' : 'time-safe'}`}>
        Temps restant : {timeLeft}s
      </div>
      <div className="question-text" dangerouslySetInnerHTML={{ __html: question.question }} />
      
      <div className="answers">
        {shuffledAnswers.map((answer, idx) => (
          <button
            key={idx}
            className={`answer-btn${selectedAnswer === answer ? ' selected' : ''}`}
            onClick={() => onAnswerSelect(answer)}
            disabled={selectedAnswer !== null}
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        ))}
      </div>
      
      {selectedAnswer !== null && (
        <div>
          <div className={`answer-feedback ${selectedAnswer === question.correct_answer ? 'answer-correct' : 'answer-incorrect'}`}>
            {selectedAnswer === question.correct_answer ? (
              <span>✅ Bonne réponse !</span>
            ) : (
              <span>
                ❌ Mauvaise réponse. La bonne réponse était : <br/>
                <strong dangerouslySetInnerHTML={{ __html: question.correct_answer }} />
              </span>
            )}
          </div>
          <button className="next-btn" onClick={onNextQuestion}>
            {currentQuestionIndex < totalQuestions - 1 ? 'Question suivante ➡️' : 'Voir le score final 🏁'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;