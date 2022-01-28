import './App.css';
import { 
  BrowserRouter as Router,
  Routes,
  Route } from 'react-router-dom';
import MainPage from './Pages/MainPage/MainPage';
import RankPage from './Pages/RankPage/RankPage';
import InfoPage from './Pages/InfoPage/InfoPage';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
            <Route exact path="/" element={<MainPage/>}/>
            <Route exact path="rank" element={<RankPage/>}/>
            <Route exact path="info" element={<InfoPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
