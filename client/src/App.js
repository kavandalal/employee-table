import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainTable from './components/MainTable';
import AddEditPage from './components/AddEditPage';

function App() {
	return (
		<div className='App'>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<MainTable />} />
					<Route path='/:username' element={<AddEditPage />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
