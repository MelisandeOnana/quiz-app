import React, { useState, useEffect } from 'react';
import './App.css';
import QuizStart from './components/QuizStart';
import QuizQuestion from './components/QuizQuestion';
import QuizResults from './components/QuizResults';
import { LoadingState, ErrorState, PreparationState } from './components/QuizStates';
import { useTimer } from './hooks/useTimer';

function App() {
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({
    amount: 5,
    category: '',
    difficulty: 'easy'
  });
  const [loading, setLoading] = useState(true);
  
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizLoading, setQuizLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleTimeUp = () => {
    if (!selectedAnswer) {
      // Temps écoulé = réponse incorrecte
      setSelectedAnswer('__TIME_UP__'); // Valeur spéciale pour indiquer que le temps est écoulé
      // Attendre un peu pour que l'utilisateur voie le message, puis passer à la question suivante
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    }
  };

  const { timeLeft, start, stop, reset } = useTimer(15, handleTimeUp);

  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then(res => res.json())
      .then(data => {
        setCategories(data.trivia_categories);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (questions.length && currentQuestion < questions.length && !selectedAnswer) {
      start();
    }
  }, [currentQuestion, selectedAnswer, questions.length]);

  const startQuiz = (params) => {
    setQuizStarted(true);
    setQuizLoading(true);
    setError(null);
    
    let url = `https://opentdb.com/api.php?amount=${params.amount}&difficulty=${params.difficulty}&type=multiple`;
    if (params.category) url += `&category=${params.category}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.response_code !== 0) throw new Error('Aucune question trouvée');
        setQuestions(data.results);
        setQuizLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setQuizLoading(false);
      });
  };

  const selectAnswer = (answer) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    stop();
  };

  const nextQuestion = () => {
    // Ne compter comme correct que si une vraie réponse a été sélectionnée et qu'elle est correcte
    if (selectedAnswer && selectedAnswer !== '__TIME_UP__' && selectedAnswer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
  };

  const newQuiz = () => {
    setQuizStarted(false);
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setError(null);
    reset();
  };

  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  if (!quizStarted) {
    return (
      <QuizStart
        categories={categories}
        settings={settings}
        onUpdateSetting={updateSetting}
        onStartQuiz={startQuiz}
        loading={loading}
      />
    );
  }

  if (quizLoading) return <LoadingState message="Chargement des questions..." onCancel={newQuiz} />;
  if (error) return <ErrorState message={error} onRetry={newQuiz} />;
  if (!questions.length) return <PreparationState quizParams={settings} categories={categories} onCancel={newQuiz} />;

  if (currentQuestion >= questions.length) {
    return <QuizResults score={score} totalQuestions={questions.length} onNewQuiz={newQuiz} />;
  }

  return (
    <QuizQuestion
      question={questions[currentQuestion]}
      currentQuestionIndex={currentQuestion}
      totalQuestions={questions.length}
      score={score}
      timeLeft={timeLeft}
      onAnswerSelect={selectAnswer}
      onNextQuestion={nextQuestion}
      selectedAnswer={selectedAnswer}
    />
  );
}

export default App;