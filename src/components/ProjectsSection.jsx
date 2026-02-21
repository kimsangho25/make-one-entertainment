import React from "react";
import { ArrowRight, Calendar, Users, MapPin, Play, ExternalLink } from "lucide-react";

export default function ProjectsSection() {
  // YouTube 링크를 iframe embed 가능한 형태로 변환
  const videos = [
    {
      id: 1,
      title: "전국 TOP 10 가요쇼 소개영상",
      embedUrl: "https://www.youtube.com/embed/mDkiAmACZIw",
      date: "2024.01.15",
      participants: "1000+",
      location: "전국 방송",
      description: "전국 TOP 10 가요쇼 소개영상",
      category: "가요쇼"
    },
    {
      id: 2,
      title: "기업행사, 워크샵, 체육대회 모음집",
      embedUrl: "https://www.youtube.com/embed/PdmrTMWodHU",
      date: "2024.02.20",
      participants: "500+",
      location: "다양한 기업",
      description: "기업행사, 워크샵, 체육대회 모음집",
      category: "기업행사"
    },
    {
      id: 3,
      title: "대학생 레크레이션 현장 스케치 영상",
      embedUrl: "https://drive.google.com/file/d/1-EZKnWM6PVvRXXxPM-rPBImOQlhuVgmL/preview",
      date: "2024.03.10",
      participants: "300+",
      location: "대학교",
      description: "대학생 레크레이션 현장 스케치 영상",
      category: "레크레이션"
    },
    {
      id: 4,
      title: "영어진행 오징어게임 및 레크레이션",
      embedUrl: "https://www.youtube.com/embed/_p9dCf9XXjg",
      date: "2024.04.05",
      participants: "200+",
      location: "영어캠프",
      description: "영어진행 오징어게임 및 레크레이션",
      category: "영어프로그램"
    },
    {
      id: 5,
      title: "축제&체육대회 진행 하이라이트",
      embedUrl: "https://www.youtube.com/embed/-U0qvsXEhGE",
      date: "2024.05.12",
      participants: "400+",
      location: "청소년센터",
      description: "축제&체육대회 진행 하이라이트",
      category: "청소년행사"
    },
    {
      id: 6,
      title: "김용명 개그맨과 함께하는 유튜브 촬영",
      embedUrl: "https://www.youtube.com/embed/s8hR03Bpa3o",
      date: "2024.06.08",
      participants: "150+",
      location: "유튜브 스튜디오",
      description: "김용명 개그맨과 함께하는 유튜브 촬영",
      category: "유튜브"
    }
  ];

  return (
    <section id="projects" className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4">
            {/* PORTFOLIO 텍스트 삭제됨 */}
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
            하이라이트 영상
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            행사의 생생한 감동을 지금 만나보세요.
          </p>
        </div>

        {/* 3x2 영상 그리드 (6개로 축소) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* iframe 비디오 영역 */}
              <div className="relative aspect-video overflow-hidden bg-black">
                <iframe
                  src={video.embedUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={video.title}
                  loading="lazy"
                ></iframe>
                
                {/* 카테고리 뱃지 - iframe 위에 표시하기 위해 z-index 조정 */}
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                  <span className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {video.category}
                  </span>
                </div>
              </div>
              
              {/* 콘텐츠 영역 */}
              <div className="p-6">
                <h3 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {video.title}
                </h3>
                
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {video.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {video.participants}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {video.location}
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 영상 더보기 버튼 */}
        <div className="text-center">
          <a
            href="https://www.youtube.com/@MCpss0616/featured"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-2xl"
          >
            <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            영상 더보기
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
}