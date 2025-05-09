import './App.css';
import { BrowserRouter,Route,Routes} from 'react-router-dom';
import Project from '../src/Components/Project';
import AddRecordForm from './Components/addRecordForm';
import LoginPage from './Components/login';
import Quotes from './Components/quotes';
import Error from './Components/error';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/'  element={<LoginPage/>}></Route>
      <Route path='/Records'  element={<Project/>}></Route>
      <Route path='/addRecord'  element={<AddRecordForm/>}></Route>
      <Route path='/quotes'  element={<Quotes/>}></Route>
      <Route path='/error'  element={<Error/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
