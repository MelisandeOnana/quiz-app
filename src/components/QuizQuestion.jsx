import React, { useState, useEffect } from 'react';

const shuffleAnswers = (question) => {
  const answers = [...question.incorrect_answers, question.correct_answer];
  return answers.sort(() => Math.random() - 0.5);
};

const QuizQuestion = ({ question, currentQuestionIndex, totalQuestions, score, timeLeft, onAnswerSelect, onNextQuestion, selectedAnswer, isTimeUp }) => {
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  useEffect(() => {
    if (question) {
      setShuffledAnswers(shuffleAnswers(question));
    }
  }, [question]);

  if (!question) return null;

  const isCorrect = selectedAnswer === question.correct_answer;
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;

  return (
    <div className="quiz-question">
      <h2>Question {currentQuestionIndex + 1} / {totalQuestions}</h2>
      <div className="score-display">Score : {score} / {totalQuestions}</div>
      <div className="timer-display">
        Temps restant : {timeLeft}s
      </div>
        <div className="question-text">{question.question}</div>
      
      <div className="answers">
          {shuffledAnswers.map((answer, idx) => (
            <button
              key={idx}
              className={`answer-btn${selectedAnswer === answer ? ' selected' : ''}`}
              onClick={() => onAnswerSelect(answer)}
              disabled={selectedAnswer !== null}
            >
              {answer}
            </button>
          ))}
      </div>
      
      {(selectedAnswer !== null || isTimeUp) && (
        <div>
          <div className={`answer-feedback ${isTimeUp ? '' : isCorrect ? 'answer-correct' : 'answer-incorrect'}`}>
              {isTimeUp ? (
                <span>Temps écoulé ! La bonne réponse était : <br/>
                  <strong>{question.correct_answer}</strong>
                </span>
              ) : isCorrect ? (
                <span>Bonne réponse !</span>
              ) : (
                <span>
                  Mauvaise réponse. La bonne réponse était : <br/>
                  <strong>{question.correct_answer}</strong>
                </span>
              )}
          </div>
          {!isTimeUp && (
            <button className="next-btn" onClick={onNextQuestion}>
              {isLastQuestion ? 'Voir le score final' : 'Question suivante'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;