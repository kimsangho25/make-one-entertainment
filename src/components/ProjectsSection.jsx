import React from "react";
import { ArrowRight, Calendar, Users, MapPin, Play, ExternalLink } from "lucide-react";

export default function ProjectsSection() {
  // Google Drive 링크를 iframe embed 가능한 형태로 변환
  const videos = [
    {
      id: 1,
      title: "Corporate Innovation Summit 2024",
      embedUrl: "https://drive.google.com/file/d/1_NXoC18XeBFB4X58QJiCQcdDEODTsBRN/preview",
      date: "2024.03.15",
      participants: "500+",
      location: "서울 코엑스",
      description: "글로벌 기업의 혁신 전략을 공유하는 대규모 컨퍼런스",
      category: "컨퍼런스"
    },
    {
      id: 2,
      title: "Digital Workplace Seminar",
      embedUrl: "https://drive.google.com/file/d/1BWiNQHAhTNT_01fbmdV0D1ugTBUZLrpm/preview",
      date: "2024.02.28",
      participants: "200+",
      location: "강남 세미나실",
      description: "디지털 워크플레이스 구축을 위한 실무 세미나",
      category: "세미나"
    },
    {
      id: 3,
      title: "New Year Celebration Gala",
      embedUrl: "https://drive.google.com/file/d/1Afk8qC-Y_0p-cmdIl6kwCg64HTOsNzjX/preview",
      date: "2024.01.20",
      participants: "300+",
      location: "롯데호텔 서울",
      description: "신년 맞이 기업 갈라 디너 및 네트워킹 이벤트",
      category: "이벤트"
    },
    {
      id: 4,
      title: "Leadership Excellence Awards",
      embedUrl: "https://drive.google.com/file/d/1Ls-9ljAL6tj3fX1pyVTWN0U-OTv9K69e/preview",
      date: "2023.12.10",
      participants: "400+",
      location: "잠실 전문기획",
      description: "리더십 우수성을 인정하는 시상식 기획 및 진행",
      category: "시상식"
    },
    {
      id: 5,
      title: "Team Building Workshop",
      embedUrl: "https://drive.google.com/file/d/1qmM_c0Q-Apjp4qniESatoXK-lP5CMbLh/preview",
      date: "2024.04.10",
      participants: "150+",
      location: "강남 스튜디오",
      description: "창의적 팀빌딩과 협업을 위한 특별한 워크샵",
      category: "팀빌딩"
    },
    {
      id: 6,
      title: "Cultural Festival 2024",
      embedUrl: "https://drive.google.com/file/d/1tExhweRmLiaHHTYxOLpRbiC9veJHlaMx/preview",
      date: "2024.05.20",
      participants: "800+",
      location: "한강공원",
      description: "다채로운 문화 공연과 함께하는 대규모 축제",
      category: "축제"
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
            MaKe One 하이라이트 영상
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