import React from 'react';
import { MapPin, Clock, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { popularCourses } from './courses';

const PopularCourses: React.FC = () => {
  const navigate = useNavigate();
  const courses = popularCourses.map(c => ({
    id: c.id,
    name: c.name,
    description: c.items.join(' → '),
    duration: c.duration,
    spots: c.items.length,
    color: c.color
  }));

  return (
    <div className="max-w-md mx-auto px-4 space-y-6 animate-slideUp">
      <div className="flex items-center space-x-3 pt-2">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">인기 코스</h2>
      </div>
      <div className="bg-white p-4">
        <div className="flex items-center justify-start mb-4">
          <span className="text-sm text-gray-500 font-medium">총 {courses.length}개</span>
        </div>

        <div className="space-y-3 select-none">
          {courses.map((course, index) => (
            <Link
              key={course.id}
              className="rounded-lg p-4 transition-all cursor-pointer animate-slideUp bg-transparent outline-none focus:outline-none focus-visible:outline-none active:outline-none ring-0 focus:ring-0 active:ring-0 hover:shadow-none select-none"
              style={{ animationDelay: `${index * 0.1}s` }}
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
    </div>
  );
};

export default PopularCourses;


