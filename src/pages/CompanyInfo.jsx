import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { clients } from '../data/clients';

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

  const historyData = [
    {
      year: '2015',
      title: '메이크원 엔터테인먼트 설립',
      description: '기업행사 전문 이벤트 기획사로 첫 발을 내딛다',
      icon: '🚀'
    },
    {
      year: '2016',
      title: '주요 대기업 파트너십 체결',
      description: '삼성, LG, 현대 등 주요 대기업과 협력 관계 구축',
      icon: '🤝'
    },
    {
      year: '2018',
      title: '누적 행사 500건 돌파',
      description: '다양한 분야의 행사 경험 축적',
      icon: '📊'
    },
    {
      year: '2020',
      title: '온라인 하이브리드 행사 시스템 도입',
      description: '코로나19 시대에 맞는 새로운 행사 형태 개발',
      icon: '💻'
    },
    {
      year: '2022',
      title: '누적 행사 1500건 돌파',
      description: '업계 최고 수준의 실적 달성',
      icon: '🏆'
    },
    {
      year: '2024',
      title: 'T1 팬미팅 등 대형 행사 성공',
      description: 'e-스포츠 및 엔터테인먼트 분야로 사업 확장',
      icon: '🎮'
    },
    {
      year: '2025',
      title: '누적 행사 2000건 돌파',
      description: '10년 경력의 기업행사 전문업체로 자리매김',
      icon: '⭐'
    }
  ];

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
              안녕하세요, 메이크원 엔터테인먼트 대표 박상설입니다.
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
              <span className="text-2xl font-bold text-blue-600">박상설</span>
            </p>
          </div>
        </div>
      </section>

      {/* Clients Section - 새로 추가 */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">MakeOne 고객사</h2>
            <p className="text-xl text-gray-300">대한민국을 대표하는 기관과 기업들이 메이크원을 선택했습니다</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {clients.map((client, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-4 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-h-[80px]"
              >
                <span className="text-xs md:text-sm text-center font-medium text-gray-700 leading-tight">
                  {client.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-300 text-lg">
              그 외 <strong className="text-white text-2xl">2,000+</strong> 개 기관 및 기업과 함께했습니다
            </p>
          </div>
        </div>
      </section>

      {/* History Section - 타임라인 스타일로 재디자인 */}
      <section id="history" className="py-20 bg-gradient-to-br from-blue-900 to-blue-700 relative overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">연혁</h2>
            <p className="text-xl text-blue-100">메이크원의 성장 스토리</p>
          </div>

          {/* 타임라인 컨테이너 */}
          <div className="relative">
            {/* 중앙 타임라인 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-300 via-white to-blue-300 hidden md:block"></div>

            {/* 타임라인 아이템들 */}
            <div className="space-y-12">
              {historyData.map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-col`}
                >
                  {/* 왼쪽/오른쪽 컨텐츠 */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center`}>
                    <div 
                      className="bg-white rounded-2xl p-6 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-2 inline-block w-full md:w-auto"
                      style={{
                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <div className="text-5xl mb-3">{item.icon}</div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">{item.year}</div>
                      <div className="text-xl font-bold text-gray-900 mb-2">{item.title}</div>
                      <div className="text-gray-600">{item.description}</div>
                    </div>
                  </div>

                  {/* 중앙 포인트 */}
                  <div className="relative flex-shrink-0 hidden md:block">
                    <div className="w-6 h-6 bg-white rounded-full border-4 border-blue-400 shadow-lg shadow-blue-500/50 relative z-10">
                      <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                    </div>
                  </div>

                  {/* 오른쪽/왼쪽 여백 */}
                  <div className="flex-1 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 통계 */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-bold text-white mb-2">10+</div>
              <div className="text-blue-100 text-lg">년의 경험</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-bold text-white mb-2">2000+</div>
              <div className="text-blue-100 text-lg">누적 행사</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-bold text-white mb-2">100%</div>
              <div className="text-blue-100 text-lg">고객 만족</div>
            </div>
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

      {/* 애니메이션 스타일 추가 */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
