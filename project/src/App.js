import './App.css';
import { BrowserRouter,Route,Routes} from 'react-router-dom';
import Project from '../src/Components/Project';
import AddRecordForm from './Components/addRecordForm';
import LoginPage from './Components/login';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/'  element={<Project/>}></Route>
      <Route path='/login'  element={<LoginPage/>}></Route>
      <Route path='/addRecord'  element={<AddRecordForm/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
