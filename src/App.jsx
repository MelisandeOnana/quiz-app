import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
  // State pour l'écran d'accueil
  const [categories, setCategories] = useState([]);
  const [amount, setAmount] = useState(5);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [loading, setLoading] = useState(true);
  const [quizParams, setQuizParams] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState(null);

  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then(res => res.json())
      .then(data => {
        setCategories(data.trivia_categories);
        setCategory(data.trivia_categories[0]?.id || '');
        setLoading(false);
      });
  }, []);

  if (!quizParams) {
    if (loading) return <div>Chargement des catégories...</div>;
    return (
      <div className="start-screen">
        <h1>Quiz React</h1>
        <div>
          <label>Nombre de questions : </label>
          <select value={amount} onChange={e => setAmount(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
        <div>
          <label>Catégorie : </label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Difficulté : </label>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option value="easy">Facile</option>
            <option value="medium">Moyen</option>
            <option value="hard">Difficile</option>
          </select>
        </div>
        <button onClick={() => setQuizParams({ amount, category, difficulty })}>
          Commencer le quiz
        </button>
      </div>
    );
  }

  // Récupération des questions au lancement du quiz (toujours appelé, mais ne fait rien si quizParams est null)
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
        if (data.response_code !== 0) throw new Error('Aucune question trouvée');
        setQuestions(data.results);
        setQuizLoading(false);
      })
      .catch(err => {
        setQuizError(err.message);
        setQuizLoading(false);
      });
  }, [quizParams]);

  let quizContent = null;
  if (quizLoading) {
    quizContent = <div>Chargement des questions...</div>;
  } else if (quizError) {
    quizContent = <div>Erreur lors de la récupération des questions : {quizError}</div>;
  } else if (!questions) {
    quizContent = (
      <div>
        <h2>Préparation du quiz...</h2>
        <p>
          {quizParams.amount} questions, Catégorie {quizParams.category}, Difficulté {quizParams.difficulty}
        </p>
      </div>
    );
  } else {
    quizContent = (
      <div>
        <h2>Quiz prêt !</h2>
        <p>{questions.length} questions chargées.</p>
        {/* Affichage des questions à implémenter */}
      </div>
    );
  }

  return quizContent;
}

export default App;
