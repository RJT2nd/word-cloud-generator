import React from 'react';
import './App.css';
import WordCloud from './components/WordCloud';


function App() {
  return (
    <div className="App">
      <h2>Welcome to the GDIT Word Cloud Generator</h2>
      <h4>simply upload a document to get started</h4>
      <h6>.pptx, .docx, .pdf accepted</h6>
      <WordCloud/>
    </div>
  );
}

export default App;
