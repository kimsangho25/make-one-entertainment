
import React from "react";
import { useNavigate  } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ImageCarousel from "./ImageCarousel";

export default function HeroSection() {

  const navigate = useNavigate();

  const scrollToContact = (e) => {
    e.preventDefault();
    navigate('/Review');
  };

  // 실제 메이크원 행사 사진들로 업데이트
  const carouselImages = [
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/3347a93f5_IMG_35541.jpg",
    alt: "Corporate Event",
    description: "기업 컨퍼런스 및 세미나",
    subtitle: "전문적인 기업 행사 기획 및 진행"
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/bc9e05c09_KakaoTalk_20241227_084803387.jpg",
    alt: "T1 Fan Meeting",
    description: "T1 팬미팅 이벤트",
    subtitle: "e-스포츠 및 게임 관련 행사"
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/79c96522b_1735406414535-4.jpg",
    alt: "Group Celebration",
    description: "청년 네트워킹 파티",
    subtitle: "즐거운 소통과 만남의 시간"
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/d467460cf_IMG_20230106_174919_051.jpg",
    alt: "Music Show Stage",
    description: "음악 방송 및 가요쇼",
    subtitle: "화려한 무대와 퍼포먼스"
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8458f325e_2025-08-31150510.png",
    alt: "V-UP Networking Dinner",
    description: "제51기 벤처투자 전문인력 양성 네트워킹 디너",
    subtitle: "전문가들과 함께하는 특별한 네트워킹 시간"
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/5541808ea_20231027_112614.jpg",
    alt: "Workshop Seminar",
    description: "창의적 워크샵 및 세미나",
    subtitle: "함께 배우고 성장하는 공간"
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/df02207a8_MC25.jpg",
    alt: "Concert Performance",
    description: "라이브 콘서트 및 음악 공연",
    subtitle: "감동과 열정이 가득한 무대"
  }];


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 이미지 캐러셀 배경 */}
      <div className="absolute inset-0">
        <ImageCarousel
          images={carouselImages}
          autoPlayInterval={5000}
          className="w-full h-full" />

      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Main Headline */}
        <h1 className="font-bold text-white mb-8 leading-tight tracking-tight">
          <span className="text-5xl mb-4 text-lg font-black block sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tighter leading-[0.85]">MAKE ONE<br />ENTERTAINMENT
          </span>
          <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-normal text-gray-200 leading-relaxed px-4 sm:px-6 md:px-0">
            모두가 하나 되는 순간, 메이크원이 만듭니다
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed px-4">
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
          <button
            onClick={scrollToContact}
            className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-xl flex items-center gap-3">
            리뷰하기
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          h1 span:first-child {
            font-size: 2.5rem !important;
            line-height: 0.9 !important;
            letter-spacing: -1px !important;
            /* whitespace-nowrap was removed to allow line break */
            /* min-w-max was removed */
          }
          h1 span:last-child {
            font-size: 1rem !important;
            line-height: 1.4 !important;
          }
        }
        
        @media (min-width: 641px) and (max-width: 768px) {
          h1 span:first-child {
            font-size: 3.5rem !important;
            line-height: 0.85 !important;
            letter-spacing: -1.5px !important;
            /* whitespace-nowrap was removed to allow line break */
            /* min-w-max was removed */
          }
          h1 span:last-child {
            font-size: 1.25rem !important;
            line-height: 1.4 !important;
          }
        }
      `}</style>
    </section>);

}
