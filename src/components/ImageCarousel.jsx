import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageCarousel({ images, autoPlayInterval = 4000, className = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // 이미지 배열 타입 안전성 확보
  const safeImages = Array.isArray(images) ? images : (images ? [images] : []);

  // 다음 슬라이드로 이동
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === safeImages.length - 1 ? 0 : prevIndex + 1
    );
  }, [safeImages.length]);

  // 이전 슬라이드로 이동
  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? safeImages.length - 1 : prevIndex - 1
    );
  }, [safeImages.length]);

  // 특정 슬라이드로 이동
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // 자동 재생
  useEffect(() => {
    if (!isAutoPlaying || safeImages.length <= 1) return;

    const intervalId = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(intervalId);
  }, [nextSlide, autoPlayInterval, isAutoPlaying, safeImages.length]);

  // 마우스 호버 시 자동 재생 일시정지
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // 터치 이벤트 처리 (모바일 스와이프)
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  if (safeImages.length === 0) return null;

  return (
    <div 
      className={`relative w-full h-full min-h-[60vh] md:min-h-[70vh] lg:min-h-screen overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 이미지 컨테이너 */}
      <div className="relative w-full h-full">
        {safeImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={typeof image === 'string' ? image : image.url}
              alt={typeof image === 'object' ? (image.alt || `Slide ${index + 1}`) : `Slide ${index + 1}`}
              className="w-full h-full object-cover object-center"
              style={{
                objectFit: 'cover',
                objectPosition: 'center center'
              }}
              loading={index === 0 ? "eager" : "lazy"}
            />
            
            {/* 오버레이 - 모바일에서 더 부드럽게 */}
            <div className="absolute inset-0 bg-black/30 md:bg-black/40"></div>
            
            {/* 이미지 설명 - 모바일 반응형 */}
            {typeof image === 'object' && image.description && (
              <div className="absolute bottom-2 md:bottom-4 lg:bottom-6 left-2 md:left-4 lg:left-6 right-2 md:right-4 lg:right-6 text-white">
                <p className="text-sm md:text-base lg:text-lg xl:text-xl font-medium leading-relaxed">
                  {image.description}
                </p>
                {image.subtitle && (
                  <p className="text-xs md:text-sm lg:text-base text-gray-200 mt-1 md:mt-2">
                    {image.subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 네비게이션 화살표 - 이미지가 2개 이상일 때만 표시 */}
      {safeImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-1 md:left-2 lg:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-1.5 md:p-2 lg:p-3 transition-all duration-200 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 lg:w-6 lg:h-6 text-white group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-1 md:right-2 lg:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-1.5 md:p-2 lg:p-3 transition-all duration-200 group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 lg:w-6 lg:h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* 도트 인디케이터 - 이미지가 2개 이상일 때만 표시 */}
      {safeImages.length > 1 && (
        <div className="absolute bottom-2 md:bottom-4 lg:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1.5 md:space-x-2 lg:space-x-3">
          {safeImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white shadow-lg scale-125'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* 슬라이드 카운터 - 이미지가 2개 이상일 때만 표시 */}
      {safeImages.length > 1 && (
        <div className="absolute top-2 md:top-4 lg:top-6 right-2 md:right-4 lg:right-6 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 text-white text-xs md:text-sm font-medium">
          {currentIndex + 1} / {safeImages.length}
        </div>
      )}

      {/* 자동재생 상태 표시 - 이미지가 2개 이상일 때만 표시 */}
      {safeImages.length > 1 && (
        <div className="absolute top-2 md:top-4 lg:top-6 left-2 md:left-4 lg:left-6">
          <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isAutoPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
        </div>
      )}
    </div>
  );
}