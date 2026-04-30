import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './radex/Store';
import Navbar from './pages/component/Navbar';
import Footer from './pages/component/Footer';
import Login from './pages/login';
import About from './pages/About';
import Contact from './pages/Contact';
import Signup from './pages/Signup';


import UserAccount from './pages/component/UserAccount';

import AddEvaluationemaneger from './pages/AddEvaluationemaneger';

import Datamaneg from './pages/datamaneg';

import AddEmployee from './pages/AddEmployee';

import EdetAds from './pages/EdetAds';

import AddAd from './pages/addads';

import Edetevaluation from './pages/Edetevaluation';


import AddEvaluationemploy from './pages/AddEvaluationemploy';


import AddEvaluation from './pages/addEvaluation';

import EditEmployee from './pages/EditEmployee';

import Evaluation from './pages/evaluationemploy';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <React.StrictMode>
<Provider store={store}>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
                       <Routes>

              <Route path="/" element={<App />} />
               <Route path="/login" element={<Login />} />
              <Route path="/About" element={<About />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="/Signup" element={<Signup />} />
              <Route path="/addads" element={<AddAd />} />
              <Route path="/EdetAds" element={<EdetAds />} />


                            <Route path="/addEmployee" element={<AddEmployee />} />

                            <Route path="/datamaneg" element={<Datamaneg />} />

                            <Route path="/addEvaluation" element={<AddEvaluation />} />

                            <Route path="/EdetEvaluation" element={<Edetevaluation />} />

                            <Route path="/editEmployee" element={<EditEmployee />} />
                            <Route path="/evaluation" element={<Evaluation />} />
                            
                            <Route path="/addEvaluationemploy" element={<AddEvaluationemploy />} />

<Route path="/addEvaluationemaneger/:id" element={<AddEvaluationemaneger />} />

                            <Route path="/UserAccount" element={<UserAccount />} />

                          </Routes>

               </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
