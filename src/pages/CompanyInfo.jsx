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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">회사소개</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100">메이크원 엔터테인먼트를 소개합니다</p>
        </div>
      </section>

      {/* Greeting Section */}
      <section id="greeting" className="py-12 md:py-20 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">인사말</h2>
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto"></div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl border border-blue-100">
            <div className="space-y-4 md:space-y-6 text-gray-700 leading-relaxed text-base md:text-lg">
              <p className="text-lg sm:text-xl font-semibold text-gray-900">
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
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6 rounded-xl md:rounded-2xl text-center my-6 md:my-8">
                <p className="text-lg sm:text-xl md:text-2xl font-bold">
                  "우린 함께일 때 더 특별해집니다."
                </p>
              </div>
              <p>
                메이크원 엔터테인먼트는 항상 현장에서 답을 찾으며, 고객님의 만족을 최우선으로 생각합니다.
                여러분의 소중한 순간을 작품으로 만들어 드리겠습니다.
              </p>
              <div className="text-right mt-8 md:mt-12 pt-6 md:pt-8 border-t border-blue-200">
                <p className="text-sm sm:text-base text-gray-600 mb-2">메이크원 엔터테인먼트 대표</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  박상설
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 px-2">메이크원과 함께 특별한 순간을 만들어보세요</h3>
          <p className="mb-6 md:mb-10 text-base sm:text-lg md:text-xl text-blue-100">10초만에 견적 문의하기</p>
          <a
            href="/#contact"
            className="inline-block bg-white text-blue-600 px-6 sm:px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-gray-100 transition-all hover:scale-110 shadow-2xl hover:shadow-white/50"
          >
            견적 문의하기 →
          </a>
        </div>
      </section>
    </div>
  );
}
