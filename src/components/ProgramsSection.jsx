
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Search } from "lucide-react"; // Added imports for ArrowRight and Search icons
import ImageCarousel from "./ImageCarousel";

// 카테고리별 데이터 정의
const programData = {
  "팀빌딩": {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ad8266d3f7a3e6710e5720/bb693f628_image.png",
    description: "협력과 소통을 통한 창의적 문제해결과 팀워크 강화"
  },

  "체육대회": {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ad8266d3f7a3e6710e5720/0673ef6c1_image.png",
    description: "협력과 단합으로 하나가 되는 체육대회"
  },

  "축제": {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ad8266d3f7a3e6710e5720/festival.jpg",
    description: "화려한 조명과 함께하는 감동적인 축제 무대"
  },

  "연예인행사": {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ad8266d3f7a3e6710e5720/0d1bc9fec_4.jpg",
    description: "유명 연예인들과 함께하는 특별한 만남의 시간"
  },

  "기업행사": {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ad8266d3f7a3e6710e5720/6d7a29db5_image.png",
    description: "한화솔루션 임직원 부모 초청행사 - 가족과 함께하는 특별한 시간"
  },

  "영어행사": {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ad8266d3f7a3e6710e5720/a20fff31a_image.png",
    description: "KDU Global Matriculation Ceremony - 국제 학생들을 위한 입학식"
  },

  "공식행사": {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ad8266d3f7a3e6710e5720/official.jpg",
    description: "교육부 한국청년기업가정신센터 공식행사 - 전문적이고 품격있는 정부 공식 행사"
  }
};

// 요청된 순서대로 탭 배열 정의
const tabs = ["기업행사", "연예인행사", "팀빌딩", "체육대회", "축제", "공식행사", "영어행사"];

export default function ProgramsSection() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // Determine if the current active tab's data is an array or a single object
  // With the change, "영어행사" is now a single object, so isCarouselType will be false for it.
  const isCarouselType = Array.isArray(programData[activeTab]);

  return (
    <section id="programs" className="pt-4 md:pt-6 pb-20 md:pb-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 md:px-6">
        <div className="text-center mb-16">
          <div className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4">
            OUR PROGRAMS
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">우린 함께일 때 더 특별해집니다.</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">메이크원은 모두를 하나로 만드는 트렌디한 프로그램을 제공합니다.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12 px-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-full font-medium transition-all duration-300 text-sm md:text-base ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-200 shadow-sm'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Image Display - Mobile Optimized with Enhanced Hover Effects */}
        <div className="w-full aspect-[4/3] md:aspect-[16/10] lg:aspect-[2/1] rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl bg-gray-200 mx-auto">
          {!isCarouselType ? (
            // Render single image with enhanced hover effects
            <Link 
              to={createPageUrl("Photos")}
              className="block relative w-full h-full cursor-pointer group overflow-hidden"
            >
              <img
                src={programData[activeTab].url}
                alt={programData[activeTab].description}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              
              {/* Base Overlay */}
              <div className="absolute inset-0 bg-black/20 md:bg-black/30"></div>
              
              {/* Hover Overlay with smooth transition */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"></div>
              
              {/* Center Icon - appears on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform translate-y-4 group-hover:translate-y-0">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 md:p-6 group-hover:scale-110 transition-transform duration-300">
                  <Search className="w-8 h-8 md:w-12 md:h-12 text-white" />
                </div>
              </div>
              
              {/* Arrow Icon in corner */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform translate-x-4 group-hover:translate-x-0">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 md:p-3">
                  <ArrowRight className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
              </div>
              
              {/* 이미지 설명 */}
              <div className="absolute bottom-2 md:bottom-4 lg:bottom-6 left-2 md:left-4 lg:left-6 right-2 md:right-4 lg:right-6 text-white">
                <p className="text-sm md:text-base lg:text-lg xl:text-xl font-medium leading-relaxed mb-2">
                  {programData[activeTab].description}
                </p>
                <p className="text-xs md:text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform translate-y-2 group-hover:translate-y-0">
                  클릭하여 더 많은 사진 보기
                </p>
              </div>
            </Link>
          ) : (
            // Enhanced hover effects for carousel images
            <Link 
              to={createPageUrl("Photos")}
              className="block relative w-full h-full cursor-pointer group overflow-hidden"
            >
              {/* ImageCarousel is now nested inside a div to allow overlays to be siblings */}
              <div className="w-full h-full">
                <ImageCarousel
                  images={programData[activeTab]}
                  autoPlayInterval={5000}
                  className="w-full h-full"
                />
              </div>
              
              {/* Hover Overlay for carousel */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10"></div>
              
              {/* Center Icon for carousel */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform translate-y-4 group-hover:translate-y-0 z-20">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 md:p-6 group-hover:scale-110 transition-transform duration-300">
                  <Search className="w-8 h-8 md:w-12 md:h-12 text-white" />
                </div>
              </div>
              
              {/* Arrow Icon for carousel */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform translate-x-4 group-hover:translate-x-0 z-20">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 md:p-3">
                  <ArrowRight className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
              </div>
              
              {/* Guide text for carousel */}
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform translate-y-2 group-hover:translate-y-0 z-20">
                <p className="text-xs md:text-sm text-gray-200 text-center">
                  클릭하여 더 많은 사진 보기
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
