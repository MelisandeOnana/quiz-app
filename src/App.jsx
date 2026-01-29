import React, { useState, useEffect } from 'react';
import './App.css';
import QuizStart from './components/QuizStart';
import QuizQuestion from './components/QuizQuestion';
import QuizResults from './components/QuizResults';
import { ErrorState } from './components/QuizStates';
import { useTimer } from './hooks/useTimer';

function App() {
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({
    amount: 5,
    category: '',
    difficulty: 'easy'
  });

  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [score, setScore] = useState(0);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTimeUp = () => {
    if (selectedAnswer) return;
    setIsTimeUp(true);
    setTimeout(nextQuestion, 1500);
  };

  const { timeLeft, start, stop, reset } = useTimer(15, handleTimeUp);

  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then(res => res.json())
      .then(data => {
        setCategories(data.trivia_categories);
      });
  }, []);

  useEffect(() => {
    if (questions.length && currentQuestion < questions.length && !selectedAnswer && !isTimeUp) {
      start();
    }
  }, [currentQuestion, selectedAnswer, isTimeUp, questions.length]);

  const startQuiz = (params) => {
    setQuizStarted(true);
    setError(null);
    setLoading(true);
    
    let url = `https://opentdb.com/api.php?amount=${params.amount}&difficulty=${params.difficulty}&type=multiple`;
    if (params.category) url += `&category=${params.category}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.response_code !== 0) throw new Error('Aucune question trouvée');
        setQuestions(data.results);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  const selectAnswer = (answer) => {
    if (selectedAnswer || isTimeUp) return;
    setSelectedAnswer(answer);
    stop();
  };

  const nextQuestion = () => {
    if (!isTimeUp && selectedAnswer && selectedAnswer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
    setIsTimeUp(false);
  };

  const newQuiz = () => {
    setQuizStarted(false);
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsTimeUp(false);
    setScore(0);
    setError(null);
    setLoading(false);
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
      />
    );
  }

  if (error) return <ErrorState message={error} onRetry={newQuiz} />;

  if (loading) {
    return <div>...</div>;
  }

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
      isTimeUp={isTimeUp}
    />
  );
}

export default App;