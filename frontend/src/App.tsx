import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Pharmacies from './pages/Pharmacies';
import PharmacyDetail from './pages/PharmacyDetail';
import Medicines from './pages/Medicines';
import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/pharmacies" element={<Pharmacies />} />
        <Route path="/pharmacies/:id" element={<PharmacyDetail />} />
        <Route path="/medicines" element={<Medicines />} />
      </Route>
    </Routes>
  );
}

export default App;