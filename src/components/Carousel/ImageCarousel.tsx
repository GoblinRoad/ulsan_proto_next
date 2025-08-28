import React, { useState, useRef, useEffect } from 'react';
import { FestivalImage } from '../../services/festivalService';
import { SpotImage } from '../../services/courseSpotService';
import ImageModal from '../Modals/ImageModal';

interface ImageCarouselProps {
  images: FestivalImage[] | SpotImage[];
  height?: string;
  simple?: boolean;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, height = "h-64", simple = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (images.length > 0) {
      setCurrentIndex(0);
    }
  }, [images]);

  // 현재 이미지가 변경될 때 썸네일을 해당 위치로 스크롤
  useEffect(() => {
    if (thumbnailContainerRef.current && images.length > 1) {
      const thumbnailWidth = 64; // w-16 = 64px
      const gap = 8; // space-x-2 = 8px
      const containerWidth = thumbnailContainerRef.current.clientWidth;
      const padding = 16; // px-4 = 16px
      
      // 현재 썸네일의 위치 계산
      const thumbnailPosition = currentIndex * (thumbnailWidth + gap);
      
      // 중앙에 오도록 스크롤 위치 계산
      const centerPosition = thumbnailPosition - (containerWidth - padding * 2) / 2 + thumbnailWidth / 2;
      
      // 첫 번째와 마지막 썸네일 고려
      let scrollPosition = centerPosition;
      
      // 첫 번째 썸네일인 경우 (왼쪽 끝)
      if (currentIndex === 0) {
        scrollPosition = 0;
      }
      
      // 마지막 썸네일인 경우 (오른쪽 끝)
      const maxScroll = (images.length - 1) * (thumbnailWidth + gap);
      if (currentIndex === images.length - 1) {
        scrollPosition = maxScroll;
      }
      
      // 스크롤 위치가 음수가 되지 않도록 제한
      scrollPosition = Math.max(0, scrollPosition);
      
      thumbnailContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, images.length]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50; // 최소 스와이프 거리

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }

    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }

    setIsDragging(false);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`${height} bg-gray-200 rounded-lg flex items-center justify-center`}>
        <p className="text-gray-500">이미지가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 메인 캐러셀 */}
      <div
        ref={carouselRef}
        className={`${height} relative overflow-hidden rounded-lg`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 이미지 */}
        <div
          className="w-full h-full transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="absolute top-0 left-0 w-full h-full"
              style={{ left: `${index * 100}%` }}
            >
              <img
                src={image.originimgurl}
                alt={image.imgname}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={handleImageClick}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.jpg';
                }}
              />
            </div>
          ))}
        </div>



        {/* 이미지 카운터 */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* 하단 인디케이터 */}
      {images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-blue-500'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* 썸네일 인디케이터 */}
      {images.length > 1 && !simple && (
        <div 
          ref={thumbnailContainerRef}
          className="flex justify-start mt-4 space-x-2 overflow-x-auto scrollbar-hide px-4 pb-2"
        >
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentIndex
                  ? 'border-blue-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <img
                src={image.smallimageurl}
                alt={image.imgname}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.jpg';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* 이미지 모달 */}
      <ImageModal
        image={images[currentIndex]}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default ImageCarousel;
