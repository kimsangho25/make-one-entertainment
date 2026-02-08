import React from 'react';

export default function Program() {
  const programs = [
    {
      id: 'black-white-cook',
      title: '흑백요리사',
      description: '요리 대결을 통한 창의력과 협업 능력 향상',
      image: '/images/programs/black-white-cook.jpeg'
    },
    {
      id: 'squid-game',
      title: '오징어게임',
      description: '넷플릭스 드라마를 현실로! 팀워크와 전략이 필요한 몰입형 프로그램',
      image: '/images/programs/squid-game.jpeg'
    },
    {
      id: 'money-game',
      title: '돈의게임',
      description: '경제 시뮬레이션 게임으로 의사결정 능력과 팀워크 강화',
      image: '/images/programs/money-game.jpeg'
    },
    {
      id: 'workshop',
      title: '워크샵',
      description: '팀 빌딩과 업무 효율성 향상을 위한 맞춤형 워크샵',
      image: '/images/programs/workshop.jpeg'
    },
    {
      id: 'domino',
      title: '도미노',
      description: '협력과 집중력이 필요한 대규모 도미노 프로젝트',
      image: '/images/programs/domino.jpeg'
    },
    {
      id: 'sports-day',
      title: '체육대회',
      description: '전통과 현대가 어우러진 신나는 체육대회',
      image: '/images/programs/sports-day.jpeg'
    },
    {
      id: 'new-employee',
      title: '신입사원',
      description: '신입사원 환영 및 조직 적응을 위한 특별 프로그램',
      image: '/images/programs/new-employee.jpeg'
    },
    {
      id: 'retro-games',
      title: '추억의 게임',
      description: '세대를 아우르는 추억의 게임으로 하나 되는 시간',
      image: '/images/programs/retro-games.jpeg'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">프로그램</h1>
          <p className="text-xl text-blue-100">메이크원의 트렌디한 프로그램을 만나보세요</p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program, idx) => (
              <div
                key={program.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="h-64 overflow-hidden bg-gray-100">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-contain transition-transform duration-300"
                  />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{program.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{program.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">프로그램에 대해 더 알고 싶으신가요?</h3>
          <p className="mb-8 text-blue-100">상세한 프로그램 소개와 견적을 문의해보세요</p>
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
