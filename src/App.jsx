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

  // Affichage du quiz à venir ici
  return (
    <div>
      <h2>Préparation du quiz...</h2>
      <p>
        {quizParams.amount} questions, Catégorie {quizParams.category}, Difficulté {quizParams.difficulty}
      </p>
    </div>
  );
}

export default App;
