import React from "react";
import { ArrowRight, Calendar, Users, MapPin, Play, ExternalLink } from "lucide-react";

export default function PortfolioSection() {
  const projects = [
    {
      id: 1,
      title: "Corporate Innovation Summit 2024",
      thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop",
      date: "2024.03.15",
      participants: "500+",
      location: "서울 코엑스",
      description: "글로벌 기업의 혁신 전략을 공유하는 대규모 컨퍼런스",
      category: "컨퍼런스"
    },
    {
      id: 2,
      title: "Digital Workplace Seminar",
      thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&h=300&fit=crop",
      date: "2024.02.28",
      participants: "200+",
      location: "강남 세미나실",
      description: "디지털 워크플레이스 구축을 위한 실무 세미나",
      category: "세미나"
    },
    {
      id: 3,
      title: "New Year Celebration Gala",
      thumbnail: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&h=300&fit=crop",
      date: "2024.01.20",
      participants: "300+",
      location: "롯데호텔 서울",
      description: "신년 맞이 기업 갈라 디너 및 네트워킹 이벤트",
      category: "이벤트"
    },
    {
      id: 4,
      title: "Leadership Excellence Awards",
      thumbnail: "https://images.unsplash.com/photo-1515187029135-18ee286d815c?w=500&h=300&fit=crop",
      date: "2023.12.10",
      participants: "400+",
      location: "잠실 전문기획",
      description: "리더십 우수성을 인정하는 시상식 기획 및 진행",
      category: "시상식"
    },
    {
      id: 5,
      title: "Team Building Workshop",
      thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=300&fit=crop",
      date: "2024.04.10",
      participants: "150+",
      location: "강남 스튜디오",
      description: "창의적 팀빌딩과 협업을 위한 특별한 워크샵",
      category: "팀빌딩"
    },
    {
      id: 6,
      title: "Cultural Festival 2024",
      thumbnail: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&h=300&fit=crop",
      date: "2024.05.20",
      participants: "800+",
      location: "한강공원",
      description: "다채로운 문화 공연과 함께하는 대규모 축제",
      category: "축제"
    }
  ];

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4">
            PORTFOLIO
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
            성공적인 프로젝트 사례
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            메이크원이 기획하고 진행한 다양한 이벤트와 행사의 성공 사례를 확인해보세요.
          </p>
        </div>

        {/* 3x2 프로젝트 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* 썸네일 영역 */}
              <div className="relative aspect-video overflow-hidden bg-gray-300">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* 재생 버튼 오버레이 */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                    <Play className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* 카테고리 뱃지 */}
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {project.category}
                  </span>
                </div>
              </div>
              
              {/* 콘텐츠 영역 */}
              <div className="p-6">
                <h3 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {project.title}
                </h3>
                
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {project.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {project.participants}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {project.location}
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 포트폴리오 더보기 버튼 */}
        <div className="text-center">
          <a
            href="https://www.youtube.com/@MCpss0616/featured"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-2xl"
          >
            <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            포트폴리오 더보기
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
}