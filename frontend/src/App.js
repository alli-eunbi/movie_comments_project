import './App.css';
import { 
  BrowserRouter as Router,
  Routes,
  Route } from 'react-router-dom';
import MainPage from './Pages/MainPage/MainPage';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
            <Route exact path="/" element={<MainPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
