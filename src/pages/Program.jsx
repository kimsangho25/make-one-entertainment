import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Program() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  const getSlideImage = (program, slide) => slide.image || program.image;

  const programs = [
    {
      id: 'black-white-cook',
      title: '흑백요리사',
      description: '요리 대결을 통한 창의력과 협업 능력 향상',
      image: '/images/programs/black-white-cook.jpeg',
      slides: [
        { image: '/images/programs/bwcook-slide1.png', caption: '01. 1라운드 — 팀전 요리 골든벨' },
        { image: '/images/programs/bwcook-slide2.png', caption: '02. 1라운드 — 과자의 달인' },
        { image: '/images/programs/bwcook-slide3.png', caption: '03. 1라운드 — 커피 음료 문제' },
        { image: '/images/programs/bwcook-slide4.png', caption: '04. 2라운드 — 블라인드 마스터' },
        { image: '/images/programs/bwcook-slide5.png', caption: '05. 3라운드 — 라면 장인 데스매치' },
      ]
    },
    {
      id: 'squid-game',
      title: '오징어게임',
      description: '넷플릭스 드라마를 현실로! 팀워크와 전략이 필요한 몰입형 프로그램',
      image: '/images/programs/squid-game.jpeg',
      slides: [
        { image: '/images/programs/squid-slide1.png', caption: '01. 프로그램 세팅 — 개인전과 팀 대항전' },
        { image: '/images/programs/squid-slide2.png', caption: '02. 전체 프로그램 일정' },
        { image: '/images/programs/squid-slide3.png', caption: '03. 오징어게임 프로그램 구성' },
        { image: '/images/programs/squid-slide4.png', caption: '04. 1라운드 — 둥글게 둥글게' },
        { image: '/images/programs/squid-slide5.png', caption: '05. 2라운드 — 무궁화 꽃이 피었습니다' },
        { image: '/images/programs/squid-slide6.png', caption: '06. 3라운드 — 개인전 5개 존 자유 경쟁' },
        { image: '/images/programs/squid-slide7.png', caption: '07. 4라운드 — 팀 대항 근대 5종' },
        { image: '/images/programs/squid-slide8.png', caption: '08. 파이널 라운드 — 시상식' },
      ]
    },
    {
      id: 'money-game',
      title: '돈의게임',
      description: '경제 시뮬레이션 게임으로 의사결정 능력과 팀워크 강화',
      image: '/images/programs/money-game.jpeg',
      slides: [
        { image: '/images/programs/money-slide1.png', caption: '01. 기본 규칙 및 카드 획득 방법' },
        { image: '/images/programs/money-slide2.png', caption: '02. 게임 시나리오와 승리 조건' },
        { image: '/images/programs/money-slide3.png', caption: '03. 미션 진행 및 수식로드 완성' },
      ]
    },
    {
      id: 'workshop',
      title: '워크샵 오락실',
      description: '팀 빌딩과 업무 효율성 향상을 위한 맞춤형 워크샵',
      image: '/images/programs/workshop.jpeg',
      slides: [
        { image: '/images/programs/workshop-slide1.png', caption: '01. 딱지치기' },
        { image: '/images/programs/workshop-slide2.png', caption: '02. 텔레파시' },
        { image: '/images/programs/workshop-slide3.png', caption: '03. 신발양궁' },
        { image: '/images/programs/workshop-slide4.png', caption: '04. 꼬깔꼬깔' },
        { image: '/images/programs/workshop-slide5.png', caption: '05. 상자 속 물건 맞추기' },
        { image: '/images/programs/workshop-slide6.png', caption: '06. 초성퀴즈' },
      ]
    },
    {
      id: 'domino',
      title: '도미노',
      description: '협력과 집중력이 필요한 대규모 도미노 프로젝트',
      image: '/images/programs/domino.jpeg',
      slides: [
        { image: '/images/programs/domino-slide1.png', caption: '01. 도미노 프로그램 현장 소개' },
        { image: '/images/programs/domino-slide2.png', caption: '02. 전체 진행 타임테이블' },
        { image: '/images/programs/domino-slide3.png', caption: '03. 도미노 기본 설치 방법' },
        { image: '/images/programs/domino-slide4.png', caption: '04. 도미노 진행 방법 및 안내' },
        { image: '/images/programs/domino-slide5.png', caption: '05. 도미노 설치·진행 안전 규칙' },
      ]
    },
    {
      id: 'sports-day',
      title: '체육대회',
      description: '전통과 현대가 어우러진 신나는 체육대회',
      image: '/images/programs/sports-day.jpeg',
      slides: [
        { image: '/images/programs/sports-slide1.png', caption: '01. 행사 운영 구조 및 전문 인력' },
        { image: '/images/programs/sports-slide2.png', caption: '02. 체육대회 행사 개요' },
        { image: '/images/programs/sports-slide3.png', caption: '03. 아이스브레이킹 및 소규모 종목' },
        { image: '/images/programs/sports-slide4.png', caption: '04. 대규모 단합 프로그램' },
        { image: '/images/programs/sports-slide5.png', caption: '05. 장비·무대·시스템 제안' },
        { image: '/images/programs/sports-slide6.png', caption: '06. 실제 체육대회 고객 후기' },
      ]
    },
    {
      id: 'new-employee',
      title: '신입생',
      description: '신입사원 환영 및 조직 적응을 위한 특별 프로그램',
      image: '/images/programs/new-employee.jpeg',
      slides: [
        { image: '/images/programs/freshmen-slide1.png', caption: '01. 신입생 프로그램 행사 목적' },
        { image: '/images/programs/freshmen-slide2.png', caption: '02. 신입생이 겪는 현실적인 어려움' },
        { image: '/images/programs/freshmen-slide3.png', caption: '03. 행사 장소 구성 예시' },
        { image: '/images/programs/freshmen-slide4.png', caption: '04. 프로그램 일정 — 1부' },
        { image: '/images/programs/freshmen-slide5.png', caption: '05. 프로그램 일정 — 2부' },
        { image: '/images/programs/freshmen-slide6.png', caption: '06. 팀 소통 빙고판 만들기' },
        { image: '/images/programs/freshmen-slide7.png', caption: '07. 노래퀴즈 및 영화 명장면' },
      ]
    },
    {
      id: 'retro-games',
      title: '추억의 게임',
      description: '세대를 아우르는 추억의 게임으로 하나 되는 시간',
      image: '/images/programs/retro-games.jpeg',
      slides: [
        { image: '/images/programs/retro-slide1.png', caption: '01. 추억의 게임 전체 시간표' },
        { image: '/images/programs/retro-slide2.png', caption: '02. 전통게임 미션 — 추억 속으로' },
        { image: '/images/programs/retro-slide3.png', caption: '03. 추억의 패션쇼 — 내가 바로 패션왕' },
        { image: '/images/programs/retro-slide4.png', caption: '04. 레트로 매장 — 옛날 간식과 상품' },
        { image: '/images/programs/retro-slide5.png', caption: '05. 레트로 레크리에이션' },
        { image: '/images/programs/retro-slide6.png', caption: '06. 노래 신청곡 — 내가 바로 가수왕' },
      ]
    },
  ];

  const openSlideViewer = (program) => {
    setSelectedProgram(program);
    setCurrentSlide(0);
    document.body.style.overflow = 'hidden';
  };

  const closeSlideViewer = () => {
    setSelectedProgram(null);
    setCurrentSlide(0);
    document.body.style.overflow = '';
  };

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  }, []);

  const nextSlide = useCallback((total) => {
    setCurrentSlide(prev => Math.min(total - 1, prev + 1));
  }, []);

  useEffect(() => {
    if (!selectedProgram) return;
    const total = selectedProgram.slides.length;
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide(total);
      if (e.key === 'Escape') closeSlideViewer();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedProgram, prevSlide, nextSlide]);

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStart === null || !selectedProgram) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide(selectedProgram.slides.length);
    else if (diff < -50) prevSlide();
    setTouchStart(null);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4">프로그램</h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100">메이크원의 트렌디한 프로그램을 만나보세요</p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {programs.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer relative"
                onClick={() => program.slides && program.slides.length > 0 && openSlideViewer(program)}
              >
                {program.slides && program.slides.length > 0 && (
                  <span className="absolute top-3 left-3 z-10 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                    진행방식 보기
                  </span>
                )}
                <div className="h-48 sm:h-56 md:h-64 overflow-hidden bg-gray-100">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-contain transition-transform duration-300"
                  />
                </div>
                <div className="p-4 sm:p-5 md:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 md:mb-3">{program.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{program.description}</p>
                  {program.slides && program.slides.length > 0 && (
                    <p className="mt-3 text-green-600 text-xs font-medium">▶ 클릭하여 진행방식 확인</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 md:mb-4">프로그램에 대해 더 알고 싶으신가요?</h3>
          <p className="mb-6 md:mb-8 text-blue-100 text-sm sm:text-base">상세한 프로그램 소개와 견적을 문의해보세요</p>
          <a
            href="/#contact"
            className="inline-block bg-white text-blue-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            견적 문의하기
          </a>
        </div>
      </section>

      {selectedProgram && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={closeSlideViewer}
        >
          <div
            className="relative w-full max-w-4xl mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex items-center justify-between px-5 py-3 bg-gray-900 text-white">
              <h2 className="text-base sm:text-lg font-bold">{selectedProgram.title} — 진행방식</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-300">{currentSlide + 1} / {selectedProgram.slides.length}</span>
                <button onClick={closeSlideViewer} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
              </div>
            </div>

            <div className="relative bg-gray-100 flex items-center justify-center" style={{ minHeight: '400px' }}>
              <img
                src={getSlideImage(selectedProgram, selectedProgram.slides[currentSlide])}
                alt={selectedProgram.slides[currentSlide].caption}
                className="w-full object-contain"
                style={{ maxHeight: '60vh' }}
              />
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={"absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg " + (currentSlide === 0 ? "bg-gray-400 opacity-40 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-700")}
              >&#8249;</button>
              <button
                onClick={() => nextSlide(selectedProgram.slides.length)}
                disabled={currentSlide === selectedProgram.slides.length - 1}
                className={"absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg " + (currentSlide === selectedProgram.slides.length - 1 ? "bg-gray-400 opacity-40 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-700")}
              >&#8250;</button>
            </div>

            <div className="px-5 py-3 bg-white border-t border-gray-100">
              <p className="text-sm sm:text-base text-gray-700 font-medium text-center">{selectedProgram.slides[currentSlide].caption}</p>
            </div>

            <div className="flex justify-center gap-2 py-3 bg-white">
              {selectedProgram.slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={"w-2.5 h-2.5 rounded-full transition-all " + (idx === currentSlide ? "bg-blue-600 scale-125" : "bg-gray-300 hover:bg-gray-400")}
                />
              ))}
            </div>

            <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-gray-500">더 자세한 내용이 궁금하신가요?</p>
              <a
                href="/#contact"
                onClick={closeSlideViewer}
                className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
              >견적 문의하기</a>
            </div>
          </div>
        </div>
      )}
      </main>
      <Footer />
    </>
  );
}
