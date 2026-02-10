import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Casting() {
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
      id: 'mc',
      title: 'MC',
      description: '행사의 분위기를 이끄는 전문 MC',
      items: [
        '기업행사 전문 MC',
        '축제 및 공연 MC',
        '영어 진행 MC',
        '개그맨 MC',
        '아나운서 출신 MC'
      ]
    },
    {
      id: 'trot',
      title: '트로트 가수',
      description: '세대를 아우르는 트로트 공연',
      items: [
        'TV 방송 출연 가수',
        '지역 축제 전문 가수',
        '트로트 메들리 공연',
        '관객 참여형 공연',
        '맞춤형 세트 리스트'
      ]
    },
    {
      id: 'performance',
      title: '공연팀',
      description: '다양한 장르의 전문 공연팀',
      items: [
        '댄스팀 (K-POP, 힙합, 비보이)',
        '밴드 (라이브 밴드, 재즈 밴드)',
        '퓨전 국악 공연',
        '아카펠라 그룹',
        '버스킹 공연'
      ]
    },
    {
      id: 'magic',
      title: '마술팀',
      description: '관객을 사로잡는 마술 공연',
      items: [
        '무대 마술 (스테이지 매직)',
        '근접 마술 (클로즈업 매직)',
        '코미디 마술',
        '관객 참여형 마술',
        '맞춤형 마술 연출'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">캐스팅</h1>
          <p className="text-xl text-blue-100">검증된 아티스트와 함께하는 특별한 무대</p>
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
          <h3 className="text-2xl font-bold mb-4">캐스팅에 대해 더 알고 싶으신가요?</h3>
          <p className="mb-8 text-blue-100">아티스트 프로필과 견적을 문의해보세요</p>
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
