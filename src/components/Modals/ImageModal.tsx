import React from 'react';
import { X } from 'lucide-react';
import { FestivalImage } from '../../services/festivalService';
import { SpotImage } from '../../services/courseSpotService';

interface ImageModalProps {
  image: FestivalImage | SpotImage | null;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, isOpen, onClose }) => {
    if (!isOpen || !image) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* 모달 컨테이너 */}
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 truncate pr-4">
            {image.imgname}
          </h3>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 이미지 컨테이너 */}
        <div className="relative">
          <img
            src={image.originimgurl}
            alt={image.imgname}
            className="w-full h-auto object-contain rounded-b-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.jpg';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
