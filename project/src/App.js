import './App.css';
import { BrowserRouter,Route,Routes} from 'react-router-dom';
import Project from '../src/Components/Project';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/'  element={<Project/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
