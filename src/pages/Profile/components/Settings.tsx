import React from 'react';
import { HelpCircle, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
    }
  };

  const menuItems = [
    { icon: HelpCircle, label: '도움말', action: () => {} },
    { icon: SettingsIcon, label: '설정', action: () => {} },
    { icon: LogOut, label: '로그아웃', action: handleLogout }
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">설정</h3>
      
      <div className="space-y-1">
        {menuItems.map(({ icon: Icon, label, action }, index) => (
          <button
            key={label}
            onClick={action}
            className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors animate-slideUp"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <Icon className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">{label}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          울산 코인투어 v1.0.0<br />
          울산광역시 관광진흥과
        </p>
      </div>
    </div>
  );
};

export default Settings;