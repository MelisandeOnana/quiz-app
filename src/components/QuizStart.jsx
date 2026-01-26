import React from 'react';

const QuizStart = ({ 
  categories, 
  settings, 
  onUpdateSetting, 
  onStartQuiz, 
  loading 
}) => {
  if (loading) {
    return <div>Chargement des catégories...</div>;
  }

  const handleStartClick = () => {
    onStartQuiz(settings);
  };

  return (
    <div className="start-screen">
      <h1>Quiz React</h1>
      
      <div>
        <label>Nombre de questions : </label>
        <select 
          value={settings.amount} 
          onChange={e => onUpdateSetting('amount', Number(e.target.value))}
        >
          <option value={5}>5 questions</option>
          <option value={10}>10 questions</option>
          <option value={15}>15 questions</option>
        </select>
      </div>
      
      <div>
        <label>Difficulté : </label>
        <select 
          value={settings.difficulty} 
          onChange={e => onUpdateSetting('difficulty', e.target.value)}
        >
          <option value="easy">Facile</option>
          <option value="medium">Moyen</option>
          <option value="hard">Difficile</option>
        </select>
      </div>
      
      <div>
        <label>Catégorie : </label>
        <select 
          value={settings.category} 
          onChange={e => onUpdateSetting('category', e.target.value)}
        >
          <option value="">Toutes catégories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      
      <button onClick={handleStartClick} className="new-quiz-btn">
        Commencer le quiz
      </button>
    </div>
  );
};

export default QuizStart;