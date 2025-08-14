import React from 'react';
import { ChevronRight, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { popularCourses } from '../../PopularCourses/courses';

const RecommendedCourses: React.FC = () => {
  const courses = popularCourses.slice(0, 3).map(c => ({
    id: c.id,
    name: c.name,
    description: c.items.join(' → '),
    duration: c.duration,
    spots: c.items.length,
    color: c.color
  }));

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">인기 코스</h3>
        <Link to="/popular" className="text-sm text-blue-500 font-medium hover:text-blue-600">
          전체보기 <ChevronRight className="w-4 h-4 inline-block" />
        </Link>
      </div>
      
      <div className="space-y-3 select-none">
        {courses.map((course, index) => (
          <Link
            key={course.id}
            className="rounded-lg p-4 transition-all cursor-pointer animate-slideUp bg-transparent outline-none focus:outline-none focus-visible:outline-none active:outline-none ring-0 focus:ring-0 active:ring-0 hover:shadow-none select-none"
            style={{ animationDelay: `${index * 0.15}s` }}
            to={`/popular/${course.id}`}
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
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{course.spots}곳</span>
              </div>
              <span />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedCourses;