import './App.css';
import Dashboard from './Pages/Dashboard';
import LoginPage from './Pages/LoginPage';
import RegistrationPage from './Pages/RegistrationPage';
import {Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className="App">
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/Registration' element={<RegistrationPage />} />
          <Route path='/Dashboard' element={<Dashboard /> } />
        </Routes>
    </div>
  );
}

export default App;
