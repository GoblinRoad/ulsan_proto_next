import React from 'react';
import { useApp } from '../../contexts/AppContext';
import StatsOverview from './components/StatsOverview';
import RecommendedCourses from './components/RecommendedCourses';
import WeatherWhale from './components/WeatherWhale';

const Home: React.FC = () => {
    const { state } = useApp();

  return (
    <div className="max-w-md mx-auto px-4 space-y-6 animate-slideUp">
        <WeatherWhale />
      <StatsOverview 
        visitedSpots={state.user.visitedSpots}
        totalSpots={state.touristSpots.length}
      />
      <RecommendedCourses />
    </div>
  );
};

export default Home;