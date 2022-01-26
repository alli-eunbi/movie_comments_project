import './App.css';
import { 
  BrowserRouter as Router,
  Routes,
  Route } from 'react-router-dom';
import MainPage from './Pages/MainPage/MainPage';
import Movies from './Components/Movie/Movies';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
            <Route exact path="/" element={<MainPage/>}/>
            <Route exact path="movies" element={<Movies/>}/>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
