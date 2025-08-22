import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import Map from "./pages/Map/Map";
import CheckIn from "./pages/CheckIn/CheckIn";
import Rewards from "./pages/Rewards/Rewards";
import Profile from "./pages/Profile/Profile";
import PopularCourses from "./pages/PopularCourses/PopularCourses";
import PopularCourseDetail from "./pages/PopularCourses/PopularCourseDetail";
import Festivals from "./pages/Festivals/Festivals";
import FestivalDetail from "./pages/Festivals/FestivalDetail";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import AuthCallback from "./pages/Auth/AuthCallback";
import PrivacySettings from "./pages/Profile/components/PrivacySettings";
import ScrollToTop from "./components/ScrollToTop";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="App">
            <ScrollToTop />
            <Routes>
              {/* 인증 페이지들 (레이아웃 없음) */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/privacy-settings" element={<PrivacySettings />} />
              <Route path="/festival/:id" element={<FestivalDetail />} />

              {/* 메인 앱 페이지들 (레이아웃 포함) */}
              <Route
                path="/*"
                element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/map" element={<Map />} />
                      <Route path="/checkin" element={<CheckIn />} />
                      <Route path="/rewards" element={<Rewards />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/popular" element={<PopularCourses />} />
                      <Route
                        path="/popular/:id"
                        element={<PopularCourseDetail />}
                      />
                      <Route path="/festivals" element={<Festivals />} />
                    </Routes>
                  </Layout>
                }
              />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
