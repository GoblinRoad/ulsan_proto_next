import React from 'react';
import { MapPin, Clock } from 'lucide-react';

const PopularCourses: React.FC = () => {
  const courses = [
    {
      id: 1,
      name: '선사와 명주 여행',
      description: ['반구대암각화', '천전리각석', '트레비어', '유진목장', '언양시장', '복순도가', '석남사'].join(' → '),
      duration: '전일',
      spots: 7,
      color: 'from-blue-400 to-cyan-400'
    },
    {
      id: 2,
      name: '웰니스&웰빙여행',
      description: ['태화강국가정원', '간절곶', 'Fe01', '진하해수욕장(명선도)', '남창시장', '외고산옹기마을', '대운산 치유의 숲'].join(' → '),
      duration: '전일',
      spots: 7,
      color: 'from-green-400 to-emerald-400'
    },
    {
      id: 3,
      name: '자연과 예술여행',
      description: ['장생포고래문화특구', '태화강국가정원', '태화루', '중구 문화의 거리', '울산시립미술관'].join(' → '),
      duration: '반일',
      spots: 5,
      color: 'from-purple-400 to-pink-400'
    },
    {
      id: 4,
      name: '쪽빛바다여행',
      description: ['울산대교전망대', '대왕암공원', '출렁다리', '일산해수욕장', '주전몽돌해변'].join(' → '),
      duration: '반일',
      spots: 5,
      color: 'from-cyan-400 to-blue-500'
    },
    {
      id: 5,
      name: '독립역사여행',
      description: ['박상진의사생가', '달천철장', '강동몽돌해변', '보성학교전시관'].join(' → '),
      duration: '반일',
      spots: 4,
      color: 'from-yellow-400 to-orange-400'
    }
  ];

  return (
    <div className="max-w-md mx-auto px-4 space-y-6 animate-slideUp">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">인기 코스</h2>
          <span className="text-sm text-gray-500 font-medium">총 {courses.length}개</span>
        </div>

        <div className="space-y-3">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer animate-slideUp"
              style={{ animationDelay: `${index * 0.1}s` }}
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
    </div>
  );
};

export default PopularCourses;


