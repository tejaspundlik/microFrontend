import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Book from './pages/Book';
import Ticket from './pages/Ticket';
import Train from './pages/Train';

const App = () => {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Book />} />
        <Route path="/ticket" element={<Ticket />} />
        <Route path="/train" element={<Train />} />
      </Routes>

    </Router>
  );
};

export default App;