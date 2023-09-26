import React from 'react';
import './App.css';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Thanks } from "./pages/Thanks";
import { QA } from "./pages/QA";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ResponsiveAppBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/qa" element={<QA />} />
          <Route path="/thks" element={<Thanks />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
