import './App.css';
import { 
  BrowserRouter as Router,
  Routes,
  Route } from 'react-router-dom';
import MainPage from './Pages/MainPage/MainPage';
import RankPage from './Pages/RankPage/RankPage';
import InfoPage from './Pages/InfoPage/InfoPage';
import MovieInfoPage from './Pages/MovieInfoPage/MovieInfoPage';
import LoginPage from './Pages/LoginPage/LoginPage';
import RegisterPage from './Pages/RegisterPage/RegisterPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
            <Route exact path="/" element={<MainPage/>}/>
            <Route exact path="rank" element={<RankPage/>}/>
            <Route exact path="info" element={<InfoPage/>}/>
<<<<<<< HEAD
            <Route exact path="movies/:movie_id" element={<MovieInfoPage/>}/>
=======
            <Route exact path="movie/:id" element={<MovieInfoPage/>}/>
            <Route exact path="login" element={<LoginPage/>}/>
            <Route exact path="register" element={<RegisterPage/>}/>
>>>>>>> 4027ed76c91fc86fd128027a40cc435308ff06ee
        </Routes>
      </div>
    </Router>
  );
}

export default App;
