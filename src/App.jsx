import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import QuizStart from './components/QuizStart';
import QuizQuestion from './components/QuizQuestion';
import QuizResults from './components/QuizResults';
import { LoadingState, ErrorState, PreparationState } from './components/QuizStates';
import { useTimer } from './hooks/useTimer';

function App() {
  // Configuration du quiz
  const [categories, setCategories] = useState([]);
  const [amount, setAmount] = useState(5);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [loading, setLoading] = useState(true);
  
  // État du quiz
  const [quizParams, setQuizParams] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState(null);

  // État de la question actuelle
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  
  // Timer personnalisé
  const { timeLeft, startTimer, stopTimer, resetTimer } = useTimer(15);

  // Chargement des catégories
  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then(res => res.json())
      .then(data => {
        setCategories(data.trivia_categories);
        setLoading(false);
      });
  }, []);

  // Reset de l'état quand on quitte le quiz
  useEffect(() => {
    if (!quizParams) {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setScore(0);
      stopTimer();
      resetTimer();
    }
  }, [quizParams, resetTimer, stopTimer]);

  // Gestionnaire pour le temps écoulé
  const handleTimeUp = useCallback(() => {
    // Pas de réponse sélectionnée, pas de point
    setCurrentQuestion(prevCurrent => prevCurrent + 1);
  }, []);

  // Démarrage du timer pour une nouvelle question
  useEffect(() => {
    if (questions && currentQuestion < questions.length && selectedAnswer === null) {
      startTimer(() => {
        // Temps écoulé - passer à la question suivante automatiquement
        handleTimeUp();
      });
    }
  }, [currentQuestion, questions, startTimer, handleTimeUp, selectedAnswer]);

  // Reset de la réponse sélectionnée pour chaque nouvelle question
  useEffect(() => {
    if (questions && currentQuestion < questions.length) {
      setSelectedAnswer(null);
    }
  }, [currentQuestion, questions]);

  // Chargement des questions
  useEffect(() => {
    if (!quizParams) return;
    
    setQuizLoading(true);
    setQuizError(null);
    setQuestions(null);
    
    let url = `https://opentdb.com/api.php?amount=${quizParams.amount}&difficulty=${quizParams.difficulty}&type=multiple`;
    if (quizParams.category) {
      url += `&category=${quizParams.category}`;
    }
    
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
      })
      .then(data => {
        if (data.response_code !== 0) throw new Error('Aucune question trouvée pour ces paramètres');
        setQuestions(data.results);
        setQuizLoading(false);
      })
      .catch(err => {
        setQuizError(err.message);
        setQuizLoading(false);
      });
  }, [quizParams]);

  // Gestionnaires d'événements
  const handleStartQuiz = (params) => {
    setQuizParams(params);
  };

  const handleAnswerSelect = (answer) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    stopTimer();
  };

  const handleNextQuestion = useCallback(() => {
    // Mise à jour du score si la réponse est correcte
    if (selectedAnswer === questions[currentQuestion].correct_answer) {
      setScore(prevScore => prevScore + 1);
    }
    
    // Passer à la question suivante
    setCurrentQuestion(currentQuestion + 1);
  }, [selectedAnswer, questions, currentQuestion]);

  const handleNewQuiz = () => {
    setQuizParams(null);
  };

  // Rendu conditionnel selon l'état
  if (!quizParams) {
    return (
      <QuizStart
        categories={categories}
        amount={amount}
        setAmount={setAmount}
        category={category}
        setCategory={setCategory}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        onStartQuiz={handleStartQuiz}
        loading={loading}
      />
    );
  }

  if (quizLoading) {
    return (
      <LoadingState
        message="Chargement des questions..."
        onCancel={() => setQuizParams(null)}
      />
    );
  }

  if (quizError) {
    return (
      <ErrorState
        message={quizError}
        onRetry={() => setQuizParams(null)}
      />
    );
  }

  if (!questions) {
    return (
      <PreparationState
        quizParams={quizParams}
        categories={categories}
        onCancel={() => setQuizParams(null)}
      />
    );
  }

  // Quiz terminé
  if (currentQuestion >= questions.length) {
    return (
      <QuizResults
        score={score}
        totalQuestions={questions.length}
        onNewQuiz={handleNewQuiz}
      />
    );
  }

  // Question en cours
  return (
    <QuizQuestion
      question={questions[currentQuestion]}
      currentQuestionIndex={currentQuestion}
      totalQuestions={questions.length}
      score={score}
      timeLeft={timeLeft}
      onAnswerSelect={handleAnswerSelect}
      onNextQuestion={handleNextQuestion}
      selectedAnswer={selectedAnswer}
    />
  );
}

export default App;