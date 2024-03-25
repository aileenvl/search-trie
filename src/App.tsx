import { useState, useEffect, useRef } from 'react';
import "tailwindcss/tailwind.css";
import './App.css';
import { Trie } from './trie/index';

function App() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const trieRef = useRef(null);

  const promptKeywords = ['for', 'to', 'with'];

  if (!trieRef.current) {
    trieRef.current = new Trie();
    const keywords = ["red shoes", "blue jeans", "red dress", "dress", "shoes", "jeans"];
    keywords.forEach(keyword => trieRef.current.insert(keyword));
  }

  useEffect(() => {
    if (input.length > 1) {
      const words = trieRef.current.getAllWords(input);
      setSuggestions(words);
    } else {
      setSuggestions([]);
    }
  }, [input]);

  const handleChange = (event) => {
    const trimmedInput = event.target.value.trim(); 
    setInput(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const matchingWords = trieRef.current.getAllWords(input);
    if (matchingWords.length > 0) {
      const isPrompt = matchingWords.some(({isPrompt}) => isPrompt);
      if (isPrompt) {
        console.log("Special action for:", input);
      } else {
        console.log("General search for:", input);
      }
    } else {
      console.log("No matches found for:", input);
      const isPrompt = promptKeywords.some(keyword => input.includes(keyword));
      if (isPrompt) {
        console.log("Handling prompt:", input);
      } else {
        console.log("Invalid search term:", input);
      }
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col">
        <header className="mx-auto w-full max-w-7xl px-6 pt-6 lg:px-8">
          <nav className="flex items-center justify-between" aria-label="Global">
            <div className="flex lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img className="h-8" src="https://docs.oramasearch.com/logo-orama-dark.svg" alt="" />
              </a>
            </div>
          </nav>
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center px-6 py-24 sm:py-64 lg:px-8">
          <div>
          <label htmlFor="search" className="block text-sm font-medium leading-6">
            Search
          </label>
          <div className="relative mt-2 flex items-center">
            <input
              type="text"
              name="search"
              id="search"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="suggestions">
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map(({ word, isPrompt }, index) => (
                  <li key={index}>{word}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        </main>
      </div>
   
      
    </>
  );
}

export default App;
