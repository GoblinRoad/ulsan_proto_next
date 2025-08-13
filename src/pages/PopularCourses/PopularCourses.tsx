import React from 'react';
import { ChevronRight, MapPin, Clock } from 'lucide-react';

const PopularCourses: React.FC = () => {
  const courses = [
    {
      id: 1,
      name: '고래와 함께하는 울산 여행',
      description: '장생포 고래문화마을 → 고래생태체험관 → 일산해수욕장',
      duration: '4-5시간',
      spots: 3,
      difficulty: '쉬움',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      id: 2,
      name: '자연 속 힐링 코스',
      description: '태화강 국가정원 → 울산대공원 → 신불산 폭포',
      duration: '6-7시간',
      spots: 4,
      difficulty: '보통',
      color: 'from-green-400 to-emerald-400'
    },
    {
      id: 3,
      name: '숨은 보석 탐방',
      description: '영남알프스 → 울산테마식물수목원 → 간절곶',
      duration: '전일',
      spots: 5,
      difficulty: '어려움',
      color: 'from-purple-400 to-pink-400'
    }
  ];

  return (
    <div className="max-w-md mx-auto px-4 space-y-6 animate-slideUp">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">인기 코스</h2>
          <button className="text-sm text-gray-500 font-medium cursor-default" disabled>
            총 {courses.length}개
          </button>
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
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.difficulty === '쉬움' ? 'bg-green-100 text-green-600' :
                  course.difficulty === '보통' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {course.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCourses;


