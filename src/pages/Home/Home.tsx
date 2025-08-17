// src/pages/Home/Home.tsx
import React from 'react';
import { useApp } from '../../contexts/AppContext';
import StatsOverview from './components/StatsOverview';
import RecommendedCourses from './components/RecommendedCourses';
import QuickActions from './components/QuickActions';
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
            <QuickActions />
            <RecommendedCourses touristSpots={state.touristSpots} />
        </div>
    );
};

export default Home;