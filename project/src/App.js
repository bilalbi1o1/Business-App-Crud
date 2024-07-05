import './App.css';
import { BrowserRouter,Route,Routes} from 'react-router-dom';
import Project from '../src/Components/Project';
import AddRecordForm from './Components/addRecordForm';
import LoginPage from './Components/login';
import Error from './Components/error';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login'  element={<LoginPage/>}></Route>
      <Route path='/'  element={<Project/>}></Route>
      <Route path='/addRecord'  element={<AddRecordForm/>}></Route>
      <Route path='/error'  element={<Error/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
