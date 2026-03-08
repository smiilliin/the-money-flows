import React, { useState } from 'react';

function Categories({ categories, setCategories }) {
  const [newCategory, setNewCategory] = useState('');

  const addCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, { name: newCategory, emoji: '📝' }]);
      setNewCategory('');
    }
  };

  const updateEmoji = (index, emoji) => {
    const updated = [...categories];
    updated[index].emoji = emoji;
    setCategories(updated);
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  return (
    <div className="categories-container">
      <h2>카테고리 관리</h2>
      <div className="add-category">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="새 카테고리 이름"
        />
        <button onClick={addCategory}>추가</button>
      </div>
      <ul className="categories-list">
        {categories.map((cat, index) => (
          <li key={index} className="category-item">
            <select
              value={cat.emoji}
              onChange={(e) => updateEmoji(index, e.target.value)}
            >
              <option value="🍽️">🍽️</option>
              <option value="🚗">🚗</option>
              <option value="🛍️">🛍️</option>
              <option value="💡">💡</option>
              <option value="📌">📌</option>
              <option value="🏠">🏠</option>
            </select>
            <span>{cat.name}</span>
            <button onClick={() => removeCategory(index)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categories;
