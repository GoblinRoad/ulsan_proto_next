import React from 'react';
import { useApp } from '../../contexts/AppContext';
import UserStats from './components/UserStats';
import AchievementBadges from './components/AchievementBadges';
import VisitHistory from './components/VisitHistory';
import Settings from './components/Settings';

const Profile: React.FC = () => {
  const { state } = useApp();

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4">
      <UserStats user={state.user} />
      <AchievementBadges badges={state.user.badges} visitedSpots={state.user.visitedSpots} />
      <VisitHistory touristSpots={state.touristSpots} />
      <Settings />
    </div>
  );
};

export default Profile;