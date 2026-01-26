import React, { useState, useEffect } from 'react';
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
        setCategory(data.trivia_categories[0]?.id || '');
        setLoading(false);
      });
  }, []);

  // Reset de l'état quand on quitte le quiz
  useEffect(() => {
    if (!quizParams) {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setScore(0);
      resetTimer();
    }
  }, [quizParams, resetTimer]);

  // Démarrage du timer pour une nouvelle question
  useEffect(() => {
    if (questions && currentQuestion < questions.length && selectedAnswer === null) {
      startTimer(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
        } else {
          setCurrentQuestion(prev => prev + 1);
        }
      });
    }
    
    // Reset de la réponse sélectionnée pour chaque nouvelle question
    if (currentQuestion < (questions?.length || 0)) {
      setSelectedAnswer(null);
    }
  }, [currentQuestion, questions, selectedAnswer, startTimer]);

  // Chargement des questions
  useEffect(() => {
    if (!quizParams) return;
    
    setQuizLoading(true);
    setQuizError(null);
    setQuestions(null);
    
    const url = `https://opentdb.com/api.php?amount=${quizParams.amount}&category=${quizParams.category}&difficulty=${quizParams.difficulty}&type=multiple`;
    
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

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correct_answer) {
      setScore(prevScore => prevScore + 1);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

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
        onCancel={() => setQuizParams(null)}
      />
    );
  }

  // Quiz terminé
  if (currentQuestion >= questions.length) {
    const finalScore = selectedAnswer === questions[questions.length - 1].correct_answer ? score + 1 : score;
    return (
      <QuizResults
        score={finalScore}
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