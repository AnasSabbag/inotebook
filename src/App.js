
import './App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import NoteState from './context/notes/NoteState';
import Signup from './components/Signup';
import Login from './components/Login';
import AlertState from './context/alerts/AlertState';



function App() {
  return (
    <>
    <AlertState>
      <NoteState >
            <Router>
                <Navbar />
                <div className="container">
                  <Routes>
                      <Route exact path="/" element = {<Login />} />
                      <Route exact path="/home" element = {<Home />} />
                      <Route exact path="/about" element = {<About />}  />
                      <Route exact path="/login" element = {<Login />} />
                      <Route exact path="/sign-up" element = {<Signup />} />
                  </Routes>
                </div>
            </Router>
      </NoteState>
      </AlertState>
    </>
  );
}

export default App;
