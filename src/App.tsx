import React from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TypingFieldMultiplayer from './components/TypingFieldMultiplayer';
import TypingField from './components/TypingField';
import { QueryClient, QueryClientProvider, } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'


function App() {
  return (
    <Routes>
      <Route path='/Login' element={<Login />} />
      <Route path='/type-multiplayer' element={<TypingFieldMultiplayer />} />
      <Route path='' element={<TypingField />} />
    </Routes>
  );
}

export default App;
