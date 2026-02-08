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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">회사소개</h1>
          <p className="text-xl text-blue-100">메이크원 엔터테인먼트를 소개합니다</p>
        </div>
      </section>

      {/* Greeting Section */}
      <section id="greeting" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">인사말</h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg">
              안녕하세요, 메이크원 엔터테인먼트 대표 김상호입니다.
            </p>
            <p>
              저희 메이크원 엔터테인먼트는 <strong>10년 경력에 누적 2000건이 넘는 기업행사 전문업체</strong>로,
              고객님의 특별한 순간을 더욱 의미 있고 감동적으로 만들어 드리기 위해 최선을 다하고 있습니다.
            </p>
            <p>
              우리는 단순히 행사를 진행하는 것이 아니라, <strong>하나의 작품을 만든다</strong>는 마음으로
              모든 프로젝트에 임합니다. 고객님의 비전과 저희의 전문성이 만나 하나가 되는 순간,
              그곳에서 진정한 감동이 탄생한다고 믿습니다.
            </p>
            <p>
              기업행사, 팀빌딩, 체육대회, 축제, 연예인 행사 등 다양한 분야에서 쌓아온 경험과 노하우를 바탕으로,
              고객님의 니즈에 맞는 최적의 솔루션을 제공해 드리겠습니다.
            </p>
            <p className="text-lg font-semibold text-blue-600">
              "우린 함께일 때 더 특별해집니다."
            </p>
            <p>
              메이크원 엔터테인먼트는 항상 현장에서 답을 찾으며, 고객님의 만족을 최우선으로 생각합니다.
              여러분의 소중한 순간을 작품으로 만들어 드리겠습니다.
            </p>
            <p className="text-right mt-8">
              <span className="text-gray-900 font-semibold">메이크원 엔터테인먼트 대표</span><br/>
              <span className="text-2xl font-bold text-blue-600">김상호</span>
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section id="history" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">연혁</h2>
          <div className="relative border-l-4 border-blue-600 pl-8 space-y-12">
            {[
              { year: '2015', title: '메이크원 엔터테인먼트 설립', desc: '기업행사 전문 이벤트 기획사로 첫 발을 내딛다' },
              { year: '2016', title: '주요 대기업 파트너십 체결', desc: '삼성, LG, 현대 등 주요 대기업과 협력 관계 구축' },
              { year: '2018', title: '누적 행사 500건 돌파', desc: '다양한 분야의 행사 경험 축적' },
              { year: '2020', title: '온라인 하이브리드 행사 시스템 도입', desc: '코로나19 시대에 맞는 새로운 행사 형태 개발' },
              { year: '2022', title: '누적 행사 1500건 돌파', desc: '업계 최고 수준의 실적 달성' },
              { year: '2024', title: 'T1 팬미팅 등 대형 행사 성공', desc: 'e-스포츠 및 엔터테인먼트 분야로 사업 확장' },
              { year: '2025', title: '누적 행사 2000건 돌파', desc: '10년 경력의 기업행사 전문업체로 자리매김' }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[42px] w-8 h-8 bg-blue-600 rounded-full border-4 border-white"></div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{item.year}</div>
                  <div className="text-xl font-semibold text-gray-900 mb-2">{item.title}</div>
                  <div className="text-gray-600">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">메이크원과 함께 특별한 순간을 만들어보세요</h3>
          <p className="mb-8 text-blue-100">10초만에 견적 문의하기</p>
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
