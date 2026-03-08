import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Calendar from './Calendar';
import Categories from './Categories';
import './App.css';

function NavBar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/calendar" className={`nav-item ${location.pathname === '/calendar' ? 'active' : ''}`}>
        달력
      </Link>
      <Link to="/categories" className={`nav-item ${location.pathname === '/categories' ? 'active' : ''}`}>
        카테고리
      </Link>
    </nav>
  );
}

function App() {
  const defaultCategories = [
    { name: '식비', emoji: '🍽️' },
    { name: '교통비', emoji: '🚗' },
    { name: '기타', emoji: '🛍️' }
  ];

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [actualExpenses, setActualExpenses] = useState(() => {
    const saved = localStorage.getItem('actualExpenses');
    return saved ? JSON.parse(saved) : {};
  });

  const [estimatedExpenses, setEstimatedExpenses] = useState(() => {
    const saved = localStorage.getItem('estimatedExpenses');
    return saved ? JSON.parse(saved) : {};
  });

  // localStorage에 categories 저장
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // localStorage에 actualExpenses 저장
  useEffect(() => {
    localStorage.setItem('actualExpenses', JSON.stringify(actualExpenses));
  }, [actualExpenses]);

  // localStorage에 estimatedExpenses 저장
  useEffect(() => {
    localStorage.setItem('estimatedExpenses', JSON.stringify(estimatedExpenses));
  }, [estimatedExpenses]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/calendar" element={<Calendar categories={categories} actualExpenses={actualExpenses} setActualExpenses={setActualExpenses} estimatedExpenses={estimatedExpenses} setEstimatedExpenses={setEstimatedExpenses} />} />
          <Route path="/categories" element={<Categories categories={categories} setCategories={setCategories} />} />
          <Route path="/" element={<Navigate to="/calendar" replace />} />
        </Routes>
        <NavBar />
      </div>
    </Router>
  );
}

export default App;
