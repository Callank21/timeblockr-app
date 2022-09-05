import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import HomePage from './components/HomePage';
import Calendar from './components/Calendar';
import Footer from './components/Footer';
import Header from './components/Header';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import Projects from './components/pages/Projects';
import Project from './components/pages/Project';

import './App.css';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div id="container">
        <Router>
          <Header />
          <div id="main">
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/projects/:id" element={<Projects />}/>
            <Route path="/project/:id" element={<Project />}/>
            <Route path="/calendar" element={<Calendar/>} />
            </Routes>
          </div>
        </Router>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
