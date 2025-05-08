import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Morphology from './pages/Morphology';
import Nutrition from './pages/Nutrition';
import Population from './pages/Population';
import Photo from './pages/Photo';
import Search from './pages/Search';
import Rehabilitation from './pages/Rehabilitation';
import { SearchProvider } from './context/SearchContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';

function App() {
  return (
    <SearchProvider>
      <Router>
        <div className="custom-green-theme d-flex flex-column vh-100">
          <Header />
          <div className="flex-grow-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/morphology" element={<Morphology />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/population" element={<Population />} />
              <Route path="/photo" element={<Photo />} />
              <Route path="/search" element={<Search />} />
              <Route path="/rehabilitation" element={<Rehabilitation />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </SearchProvider>
  );
}

export default App;