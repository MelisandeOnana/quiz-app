import React from 'react';

const QuizStart = ({ 
  categories, 
  amount, 
  setAmount, 
  category, 
  setCategory, 
  difficulty, 
  setDifficulty, 
  onStartQuiz, 
  loading 
}) => {
  if (loading) {
    return <div>Chargement des catégories...</div>;
  }

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
      <button 
        onClick={() => onStartQuiz({ amount, category, difficulty })} 
        className="new-quiz-btn"
      >
        Commencer le quiz
      </button>
    </div>
  );
};

export default QuizStart;