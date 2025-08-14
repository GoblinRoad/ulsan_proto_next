import React from 'react';
import { ChevronRight, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecommendedCourses: React.FC = () => {
  const courses = [
    {
      id: 1,
      name: '선사와 명주 여행',
      description: '반구대암각화 → 천전리각석 → 트레비어 → 유진목장 → 언양시장 → 복순도가 → 석남사',
      duration: '전일',
      spots: 7,
      color: 'from-blue-400 to-cyan-400'
    },
    {
      id: 2,
      name: '웰니스&웰빙여행',
      description: '태화강국가정원 → 간절곶 → Fe01 → 진하해수욕장(명선도) → 남창시장 → 외고산옹기마을 → 대운산 치유의 숲',
      duration: '전일',
      spots: 7,
      color: 'from-green-400 to-emerald-400'
    },
    {
      id: 3,
      name: '자연과 예술여행',
      description: '장생포고래문화특구 → 태화강국가정원 → 태화루 → 중구 문화의 거리 → 울산시립미술관',
      duration: '반일',
      spots: 5,
      color: 'from-purple-400 to-pink-400'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">인기 코스</h3>
        <Link to="/popular" className="text-sm text-blue-500 font-medium hover:text-blue-600">
          전체보기 <ChevronRight className="w-4 h-4 inline-block" />
        </Link>
      </div>
      
      <div className="space-y-3">
        {courses.map((course, index) => (
          <div
            key={course.id}
            className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer animate-slideUp"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">{course.name}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${course.color} rounded-lg flex items-center justify-center ml-3`}>
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{course.spots}곳</span>
                </div>
              </div>
              <span />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedCourses;