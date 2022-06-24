import React from 'react';
import './App.css';
import Editor from './components/Editor';
import ResponsiveAppBar from './components/ResponsiveAppBar';

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar />
      <Editor />
    </div>
  );
}

export default App;
