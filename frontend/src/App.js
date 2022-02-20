import './App.css';
import { 
  BrowserRouter as Router,
  Routes,
  Route } from 'react-router-dom';
import MainPage from './Pages/MainPage/MainPage';
import RankPage from './Pages/RankPage/RankPage';
import InfoPage from './Pages/InfoPage/InfoPage';
import MovieInfoPage from './Pages/MovieInfoPage/MovieInfoPage';
import MovieGradePage from './Pages/MovieGradePage/MovieGradePage';
import LoginPage from './Pages/LoginPage/LoginPage';
import RegisterPage from './Pages/RegisterPage/RegisterPage';
import { RecoilRoot } from 'recoil';
import MovieSearchPage from './Pages/MovieSearchPage/MovieSearchPage';

function App() {
  return (
    <RecoilRoot>
      <Router>
        <div className="App">
          <Routes>
              <Route exact path="/" element={<MainPage/>}/>
              <Route exact path="rank" element={<RankPage/>}/>
              <Route exact path="info" element={<InfoPage/>}/>
              <Route exact path="movies/:movie_id" element={<MovieInfoPage/>}/>
              <Route exact path="movies/search" element={<MovieSearchPage/>}/>
              <Route exact path="login" element={<LoginPage/>}/>
              <Route exact path="register" element={<RegisterPage/>}/>
              <Route exact path="movies/grade" element={<MovieGradePage/>}/>
          </Routes>
        </div>
      </Router>
    </RecoilRoot>
  );
}

export default App;
