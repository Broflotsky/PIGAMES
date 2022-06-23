import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Landing from './components/Lading/Landing';
import Home from './components/Home/Home'
import GameDetail from './components/GameDetail/GameDetail';

function App() {
  return (
    <BrowserRouter>
        <div className="App">

      <Routes>
        <Route path='/' element={<Landing />}/>
        <Route path='/home' element={ <Home />}/>
        <Route path='/detail/:id/' element={<GameDetail/>}/>
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
