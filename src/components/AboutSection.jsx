import React, { useEffect, useState } from "react";
import { Users, Calendar, Clock } from "lucide-react";

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 페이지 로딩 후 애니메이션 시작
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const concerns = [
    {
      icon: Users,
      iconColor: "text-orange-500",
      iconBgColor: "bg-orange-50",
      title: "#소외되는 팀원들",
      description: "직원들 간의 소통이 부족하고\n팀워크가 형성되지 않아\n업무 효율성이 떨어진다."
    },
    {
      icon: Calendar,
      iconColor: "text-orange-500",
      iconBgColor: "bg-orange-50",
      title: "#뻔한 행사 기획",
      description: "매번 비슷한 행사로\n지겨움과 참여도가 낮고\n아이디어가 부족하다"
    },
    {
      icon: Clock,
      iconColor: "text-yellow-500",
      iconBgColor: "bg-yellow-50",
      title: "#시간과 비용 부담",
      description: "행사 준비에 많은 시간과 \n 비용이 들어가서 만족스런 \n 결과를 얻기 어렵다"
    }
  ];

  return (
    <section id="about" className="py-12 md:py-20 lg:py-32 pb-4 md:pb-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 md:mb-12 px-2">
            이런 고민, 혹시 있으신가요?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 max-w-7xl mx-auto">
            {concerns.map((concern, index) => (
              <div 
                key={index} 
                className={`concern-card bg-white rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-16 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 ${
                  isVisible ? 'animate-slide-up-fade-in' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                  animationFillMode: 'forwards',
                  minHeight: 'auto'
                }}
              >
                {/* 아이콘 */}
                <div className={`w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 ${concern.iconBgColor} rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-10 transition-transform duration-300 hover:scale-110`}>
                  <concern.icon className={`w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14 ${concern.iconColor} transition-transform duration-300 hover:rotate-12`} />
                </div>
                
                {/* 제목 */}
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-8">
                  {concern.title}
                </h3>
                
                {/* 설명 */}
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg md:text-xl">
                  {concern.description.split('\n').map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      {line}
                      {lineIndex < concern.description.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .concern-card {
          opacity: 0;
          transform: translateY(40px);
        }

        @keyframes slideUpFadeIn {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up-fade-in {
          animation: slideUpFadeIn 0.8s ease-out forwards;
        }

        /* 첫 번째 박스: 0.2초 후 시작 */
        .concern-card:nth-child(1).animate-slide-up-fade-in {
          animation-delay: 0.2s;
        }

        /* 두 번째 박스: 0.4초 후 시작 */
        .concern-card:nth-child(2).animate-slide-up-fade-in {
          animation-delay: 0.4s;
        }

        /* 세 번째 박스: 0.6초 후 시작 */
        .concern-card:nth-child(3).animate-slide-up-fade-in {
          animation-delay: 0.6s;
        }

        /* 호버 효과 개선 */
        .concern-card:hover {
          transform: translateY(-8px) scale(1.02);
        }
      `}</style>
    </section>
  );
}
