import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Map from './pages/Map/Map';
import CheckIn from './pages/CheckIn/CheckIn';
import Rewards from './pages/Rewards/Rewards';
import Profile from './pages/Profile/Profile';
import PopularCourses from './pages/PopularCourses/PopularCourses';
import PopularCourseDetail from './pages/PopularCourses/PopularCourseDetail';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<Map />} />
              <Route path="/checkin/:spotId" element={<CheckIn />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/popular" element={<PopularCourses />} />
              <Route path="/popular/:id" element={<PopularCourseDetail />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;