import React from 'react';
import logo from './logo.svg';
import './App.css';
import Mint from './components/Mint';
import Editor from './components/Editor';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Mint />
      <Editor />
    </div>
  );
}

export default App;
