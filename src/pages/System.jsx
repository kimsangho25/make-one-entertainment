import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function System() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  const sections = [
    {
      id: 'audio',
      title: '음향',
      description: '최고급 음향 장비로 완벽한 사운드를 제공합니다',
      items: [
        '프로페셔널 스피커 시스템',
        '무선 마이크 (핸드/핀/헤드셋)',
        '믹싱 콘솔 및 앰프',
        '음향 엔지니어 현장 지원',
        '실시간 음향 모니터링'
      ]
    },
    {
      id: 'lighting',
      title: '조명',
      description: '분위기를 살리는 전문 조명 시스템',
      items: [
        '무빙 라이트 및 LED 조명',
        '핀 스팟 및 워시 라이트',
        '레이저 및 특수효과 조명',
        '조명 컨트롤 시스템',
        '조명 디자이너 현장 지원'
      ]
    },
    {
      id: 'stage',
      title: '무대',
      description: '안전하고 견고한 무대 시스템',
      items: [
        '모듈형 무대 (다양한 크기)',
        '무대 계단 및 난간',
        '무대 스커트 및 백드롭',
        '트러스 구조물',
        '안전 점검 및 설치 지원'
      ]
    },
    {
      id: 'equipment',
      title: '행사용품',
      description: '행사에 필요한 모든 용품을 제공합니다',
      items: [
        '캐노피텐트 (다양한 크기)',
        '테이블 (연회용/접이식)',
        '의자 (연회용/접이식)',
        '무전기 세트',
        'X베너 및 배너',
        '에어아치 (입구 장식)'
      ]
    },
    {
      id: 'catering',
      title: '출장뷔폐',
      description: '맛있는 음식으로 행사를 더욱 풍성하게',
      items: [
        '출장 바베큐 (BBQ 파티)',
        '케이터링 서비스 (다양한 메뉴)',
        '식사 (한식/양식/중식)',
        '음료 및 디저트',
        '식기 및 테이블 세팅'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">시스템</h1>
          <p className="text-xl text-blue-100">완벽한 행사를 위한 전문 시스템</p>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="sticky top-20 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex overflow-x-auto py-4 space-x-6">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="whitespace-nowrap text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-20">
        {sections.map((section, idx) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-32"
          >
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {idx + 1}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                  <p className="text-gray-600">{section.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">시스템에 대해 더 알고 싶으신가요?</h3>
          <p className="mb-8 text-blue-100">상세한 장비 사양과 견적을 문의해보세요</p>
          <a
            href="/#contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
          >
            견적 문의하기
          </a>
        </div>
      </section>
    </div>
  );
}
