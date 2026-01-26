import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import QuizStart from './components/QuizStart';
import QuizQuestion from './components/QuizQuestion';
import QuizResults from './components/QuizResults';
import { LoadingState, ErrorState, PreparationState } from './components/QuizStates';
import { useTimer } from './hooks/useTimer';

function App() {
  const [categories, setCategories] = useState([]);
  const [quizSettings, setQuizSettings] = useState({
    amount: 5,
    category: '',
    difficulty: 'easy'
  });
  const [loading, setLoading] = useState(true);
 
  const [quiz, setQuiz] = useState({
    params: null,
    questions: null,
    loading: false,
    error: null,
    currentQuestion: 0,
    selectedAnswer: null,
    score: 0
  });
  
  const { timeLeft, startTimer, stopTimer, resetTimer } = useTimer(15);

  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then(res => res.json())
      .then(data => {
        setCategories(data.trivia_categories);
        setLoading(false);
      });
  }, []);

  const updateQuiz = (updates) => {
    setQuiz(prev => ({ ...prev, ...updates }));
  };

  const resetQuiz = useCallback(() => {
    updateQuiz({
      currentQuestion: 0,
      selectedAnswer: null,
      score: 0
    });
    stopTimer();
    resetTimer();
  }, [resetTimer, stopTimer]);

  useEffect(() => {
    if (!quiz.params) {
      resetQuiz();
    }
  }, [quiz.params, resetQuiz]);

  const handleTimeUp = useCallback(() => {
    updateQuiz({ currentQuestion: quiz.currentQuestion + 1 });
  }, [quiz.currentQuestion]);

  useEffect(() => {
    const { questions, currentQuestion, selectedAnswer } = quiz;
    if (questions && currentQuestion < questions.length && selectedAnswer === null) {
      startTimer(handleTimeUp);
    }
  }, [quiz.currentQuestion, quiz.questions, startTimer, handleTimeUp, quiz.selectedAnswer]);

  useEffect(() => {
    const { questions, currentQuestion } = quiz;
    if (questions && currentQuestion < questions.length) {
      updateQuiz({ selectedAnswer: null });
    }
  }, [quiz.currentQuestion, quiz.questions]);

  useEffect(() => {
    if (!quiz.params) return;
    
    updateQuiz({ loading: true, error: null, questions: null });
    
    const { amount, difficulty, category } = quiz.params;
    let url = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`;
    if (category) url += `&category=${category}`;
    
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
      })
      .then(data => {
        if (data.response_code !== 0) throw new Error('Aucune question trouvée pour ces paramètres');
        updateQuiz({ questions: data.results, loading: false });
      })
      .catch(err => {
        updateQuiz({ error: err.message, loading: false });
      });
  }, [quiz.params]);

  const handleStartQuiz = (params) => {
    updateQuiz({ params });
  };

  const updateQuizSetting = (key, value) => {
    setQuizSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAnswerSelect = (answer) => {
    if (quiz.selectedAnswer !== null) return;
    updateQuiz({ selectedAnswer: answer });
    stopTimer();
  };

  const handleNextQuestion = useCallback(() => {
    const { selectedAnswer, questions, currentQuestion, score } = quiz;
    if (selectedAnswer === questions[currentQuestion].correct_answer) {
      updateQuiz({ score: score + 1 });
    }
    updateQuiz({ currentQuestion: currentQuestion + 1 });
  }, [quiz]);

  const handleNewQuiz = () => {
    updateQuiz({ params: null });
  };

  if (!quiz.params) {
    return (
      <QuizStart
        categories={categories}
        settings={quizSettings}
        onUpdateSetting={updateQuizSetting}
        onStartQuiz={handleStartQuiz}
        loading={loading}
      />
    );
  }

  if (quiz.loading) {
    return (
      <LoadingState
        message="Chargement des questions..."
        onCancel={() => updateQuiz({ params: null })}
      />
    );
  }

  if (quiz.error) {
    return (
      <ErrorState
        message={quiz.error}
        onRetry={() => updateQuiz({ params: null })}
      />
    );
  }

  if (!quiz.questions) {
    return (
      <PreparationState
        quizParams={quiz.params}
        categories={categories}
        onCancel={() => updateQuiz({ params: null })}
      />
    );
  }

  if (quiz.currentQuestion >= quiz.questions.length) {
    return (
      <QuizResults
        score={quiz.score}
        totalQuestions={quiz.questions.length}
        onNewQuiz={handleNewQuiz}
      />
    );
  }

  return (
    <QuizQuestion
      question={quiz.questions[quiz.currentQuestion]}
      currentQuestionIndex={quiz.currentQuestion}
      totalQuestions={quiz.questions.length}
      score={quiz.score}
      timeLeft={timeLeft}
      onAnswerSelect={handleAnswerSelect}
      onNextQuestion={handleNextQuestion}
      selectedAnswer={quiz.selectedAnswer}
    />
  );
}

export default App;