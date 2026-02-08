import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function CompanyInfo() {
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

  // 주요 고객사 데이터 (로고 이미지 포함)
  const majorClients = [
    { name: '서울특별시', logo: '/clients/seoul.jpg', category: 'government' },
    { name: 'KT', logo: '/clients/kt.jpg', category: 'enterprise' },
    { name: 'NIKE', logo: '/clients/nike.png', category: 'enterprise' },
    { name: 'Volkswagen', logo: '/clients/volkswagen.png', category: 'enterprise' },
  ];

  // 기타 고객사 (텍스트 기반, 브랜드 컬러 적용)
  const otherClients = [
    { name: '인천광역시', color: 'from-blue-600 to-blue-700' },
    { name: '광진구', color: 'from-green-600 to-green-700' },
    { name: '서대문구', color: 'from-purple-600 to-purple-700' },
    { name: '통계청', color: 'from-indigo-600 to-indigo-700' },
    { name: '교육부', color: 'from-blue-700 to-blue-800' },
    { name: '고용노동부', color: 'from-teal-600 to-teal-700' },
    { name: '보건복지부', color: 'from-cyan-600 to-cyan-700' },
    { name: '외교부', color: 'from-blue-800 to-blue-900' },
    { name: '해양수산부', color: 'from-sky-600 to-sky-700' },
    { name: '환경부', color: 'from-emerald-600 to-emerald-700' },
    { name: '병무청', color: 'from-slate-700 to-slate-800' },
    { name: 'UNITED NATIONS', color: 'from-blue-500 to-blue-600' },
    { name: 'INSS', color: 'from-gray-700 to-gray-800' },
    { name: '대한민국국회', color: 'from-blue-900 to-indigo-900' },
    { name: '국민건강보험', color: 'from-green-700 to-green-800' },
    { name: '한국교육개발원', color: 'from-blue-600 to-blue-700' },
    { name: 'KB금융그룹', color: 'from-yellow-600 to-yellow-700' },
    { name: 'IB SPORTS', color: 'from-red-600 to-red-700' },
    { name: 'AMNESTY', color: 'from-yellow-500 to-yellow-600' },
    { name: 'STARTRUN', color: 'from-purple-600 to-purple-700' },
  ];

  // 대학교 고객사
  const universities = [
    { name: '서울대학교', color: 'from-blue-700 to-blue-800' },
    { name: '연세대학교', color: 'from-blue-600 to-blue-700' },
    { name: '성균관대학교', color: 'from-green-700 to-green-800' },
    { name: 'POSTECH', color: 'from-red-700 to-red-800' },
    { name: '세종대학교', color: 'from-red-600 to-red-700' },
    { name: '한양대학교', color: 'from-blue-800 to-blue-900' },
    { name: '한국외국어대학교', color: 'from-indigo-600 to-indigo-700' },
    { name: '순천향대학교', color: 'from-teal-600 to-teal-700' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">회사소개</h1>
          <p className="text-2xl text-blue-100 mb-4">메이크원 엔터테인먼트를 소개합니다</p>
          <div className="flex gap-8 mt-8 text-lg">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🏆</span>
              <span>10년+ 경력</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">🎯</span>
              <span>2000+ 누적 행사</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">⭐</span>
              <span>100% 고객 만족</span>
            </div>
          </div>
        </div>
      </section>

      {/* Greeting Section */}
      <section id="greeting" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">인사말</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto"></div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-12 shadow-xl border border-blue-100">
            <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
              <p className="text-xl font-semibold text-gray-900">
                안녕하세요, 메이크원 엔터테인먼트 대표 박상설입니다.
              </p>
              <p>
                저희 메이크원 엔터테인먼트는 <strong className="text-blue-600">10년 경력에 누적 2000건이 넘는 기업행사 전문업체</strong>로,
                고객님의 특별한 순간을 더욱 의미 있고 감동적으로 만들어 드리기 위해 최선을 다하고 있습니다.
              </p>
              <p>
                우리는 단순히 행사를 진행하는 것이 아니라, <strong className="text-blue-600">하나의 작품을 만든다</strong>는 마음으로
                모든 프로젝트에 임합니다. 고객님의 비전과 저희의 전문성이 만나 하나가 되는 순간,
                그곳에서 진정한 감동이 탄생한다고 믿습니다.
              </p>
              <p>
                기업행사, 팀빌딩, 체육대회, 축제, 연예인 행사 등 다양한 분야에서 쌓아온 경험과 노하우를 바탕으로,
                고객님의 니즈에 맞는 최적의 솔루션을 제공해 드리겠습니다.
              </p>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-2xl text-center my-8">
                <p className="text-2xl font-bold">
                  "우린 함께일 때 더 특별해집니다."
                </p>
              </div>
              <p>
                메이크원 엔터테인먼트는 항상 현장에서 답을 찾으며, 고객님의 만족을 최우선으로 생각합니다.
                여러분의 소중한 순간을 작품으로 만들어 드리겠습니다.
              </p>
              <div className="text-right mt-12 pt-8 border-t border-blue-200">
                <p className="text-gray-600 mb-2">메이크원 엔터테인먼트 대표</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  박상설
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section - 대폭 개선 */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">MakeOne 고객사</h2>
            <p className="text-2xl text-gray-300 mb-4">대한민국을 대표하는 기관과 기업들이 메이크원을 선택했습니다</p>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>

          {/* 주요 고객사 - 로고 이미지 */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">주요 파트너</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {majorClients.map((client, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-8 flex items-center justify-center hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-2 min-h-[140px] group"
                >
                  <img 
                    src={client.logo} 
                    alt={client.name}
                    className="max-w-full max-h-[80px] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 정부기관 및 공공기관 */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">정부 · 공공기관</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {otherClients.map((client, index) => (
                <div 
                  key={index}
                  className={`bg-gradient-to-br ${client.color} rounded-xl p-6 flex items-center justify-center hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 min-h-[100px] group relative overflow-hidden`}
                >
                  {/* 반짝이는 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
                  
                  <span className="text-white font-bold text-center text-sm md:text-base leading-tight relative z-10">
                    {client.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 대학교 */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">주요 대학</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {universities.map((client, index) => (
                <div 
                  key={index}
                  className={`bg-gradient-to-br ${client.color} rounded-xl p-6 flex items-center justify-center hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-2 min-h-[100px] group relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
                  
                  <span className="text-white font-bold text-center text-sm md:text-base leading-tight relative z-10">
                    {client.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 통계 */}
          <div className="mt-20 text-center">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-12 py-6 shadow-2xl">
              <p className="text-white text-xl md:text-2xl">
                그 외 <strong className="text-4xl font-bold mx-2">2,000+</strong> 개 기관 및 기업과 함께했습니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">메이크원과 함께 특별한 순간을 만들어보세요</h3>
          <p className="mb-10 text-xl text-blue-100">10초만에 견적 문의하기</p>
          <a
            href="/#contact"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-110 shadow-2xl hover:shadow-white/50"
          >
            견적 문의하기 →
          </a>
        </div>
      </section>
    </div>
  );
}
