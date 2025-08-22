import React from 'react';
import { useApp } from '../../contexts/AppContext';
import WelcomeBanner from './components/WelcomeBanner';
import StatsOverview from './components/StatsOverview';
import RecommendedCourses from './components/RecommendedCourses';
import FestivalList from './components/FestivalList';

const Home: React.FC = () => {
  const { state } = useApp();

  return (
    <div className="max-w-md mx-auto px-4 space-y-6 animate-slideUp">
      <WelcomeBanner user={state.user} />
      <StatsOverview 
        visitedSpots={state.user.visitedSpots}
        totalSpots={state.touristSpots.length}
      />
      <RecommendedCourses />
      <FestivalList />
    </div>
  );
};

export default Home;