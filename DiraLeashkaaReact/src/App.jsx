import { Home } from './pages/Home';
import { Alert } from './cmps/Alert';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (     
    <section className='main-layout'>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
        </Routes>
        <Alert />
    </section>
);
}

export default App