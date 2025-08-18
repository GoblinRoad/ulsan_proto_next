import React, { useEffect, useState } from 'react';
import { MapPin, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { popularCourses } from './courses';
import { getCourseImagesOptimized } from '../../services/courseImageService';

const PopularCourses: React.FC = () => {
  const navigate = useNavigate();
  const [courseImages, setCourseImages] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  const courses = popularCourses.map(c => ({
    id: c.id,
    name: c.name,
    description: c.description,
    duration: c.duration,
    spots: c.items.length,
    color: c.color
  }));

  useEffect(() => {
    const loadCourseImages = async () => {
      try {
        // 최적화된 함수로 모든 코스 이미지를 한 번에 가져오기
        const allImages = await getCourseImagesOptimized();
        
        // 모든 코스 이미지 매핑
        const imageMap: Record<number, string> = {};
        courses.forEach(course => {
          if (allImages[course.name]) {
            imageMap[course.id] = allImages[course.name];
          }
        });

        setCourseImages(imageMap);
      } catch (error) {
        console.error('코스 이미지 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourseImages();
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 space-y-6 animate-slideUp">
      <div className="flex items-center space-x-3 pt-2">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">인기 코스</h2>
      </div>
      
      {loading ? (
        <div className="bg-white rounded-xl p-8">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">코스 정보 로딩 중...</h3>
            <p className="text-gray-500 text-sm">관광지 정보를 가져오고 있습니다</p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4">
          <div className="flex items-center justify-start mb-4">
            <span className="text-sm text-gray-500 font-medium">총 {courses.length}개</span>
          </div>

          <div className="space-y-4 select-none">
            {courses.map((course, index) => (
              <Link
                key={course.id}
                className="block rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg animate-slideUp bg-transparent outline-none focus:outline-none focus-visible:outline-none active:outline-none ring-0 focus:ring-0 active:ring-0 select-none"
                style={{ animationDelay: `${index * 0.1}s` }}
                to={`/popular/${course.id}`}
              >
                <div className="relative h-40 bg-gray-200">
                  {courseImages[course.id] ? (
                    <img
                      src={courseImages[course.id]}
                      alt={course.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  {/* 오버레이 그라데이션 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* 코스 정보 오버레이 */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="text-white font-bold text-lg mb-1">{course.name}</h4>
                    <p className="text-white/90 text-sm leading-relaxed mb-2">{course.description}</p>
                    <div className="flex items-center space-x-1 text-white/80 text-xs">
                      <MapPin className="w-3 h-3" />
                      <span>{course.spots}곳</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularCourses;


