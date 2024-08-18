import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HookForm from './pages/HookForm';
import Main from './pages/Main';
import UncontrolledForm from './pages/UncontrolledForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/uncontrolled-form" element={<UncontrolledForm />} />
        <Route path="/hook-form" element={<HookForm />} />
      </Routes>
    </Router>
  );
}

export default App;
