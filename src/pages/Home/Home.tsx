import React from 'react';
import { useApp } from '../../contexts/AppContext';
import WelcomeBanner from './components/WelcomeBanner';
import StatsOverview from './components/StatsOverview';
import RecommendedCourses from './components/RecommendedCourses';
import RecentActivity from './components/RecentActivity';
import QuickActions from './components/QuickActions';

const Home: React.FC = () => {
  const { state } = useApp();

  return (
    <div className="max-w-md mx-auto px-4 space-y-6 animate-slideUp">
      <WelcomeBanner user={state.user} />
      <StatsOverview 
        totalCoins={state.user.totalCoins}
        visitedSpots={state.user.visitedSpots}
        totalSpots={state.touristSpots.length}
        currentStreak={state.currentStreak}
      />
      <QuickActions />
      <RecommendedCourses touristSpots={state.touristSpots} />
      <RecentActivity touristSpots={state.touristSpots} />
    </div>
  );
};

export default Home;