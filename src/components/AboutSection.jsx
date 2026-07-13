import React, { useCallback, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Handshake,
  MessagesSquare,
} from "lucide-react";

const reviewCards = [
  {
    id: 1,
    image: "/images/reviews/review-01.png",
    alt: "기업 행사 고객 리뷰",
    background: "#aec5d6",
    width: 1335,
    height: 1178,
    fit: "width",
  },
  {
    id: 2,
    image: "/images/reviews/review-02.png",
    alt: "팀빌딩 행사 고객 리뷰",
    background: "#aec5d6",
    width: 1032,
    height: 1524,
    fit: "width",
  },
  {
    id: 3,
    image: "/images/reviews/review-03.jpg",
    alt: "체육대회 고객 리뷰",
    background: "#aec5d6",
    width: 1080,
    height: 1564,
    fit: "width",
  },
  {
    id: 4,
    image: "/images/reviews/review-04.jpg",
    alt: "돌잔치 행사 고객 리뷰",
    background: "#f7f7f7",
    width: 1080,
    height: 2340,
    fit: "height",
  },
  {
    id: 5,
    image: "/images/reviews/review-05.png",
    alt: "기업 행사 고객 리뷰",
    background: "#f7f7f7",
    width: 852,
    height: 1846,
    fit: "height",
  },
  {
    id: 6,
    image: "/images/reviews/review-06.png",
    alt: "연말 행사 고객 리뷰",
    background: "#abc3d4",
    width: 852,
    height: 1846,
    fit: "height",
  },
  {
    id: 7,
    image: "/images/reviews/review-07.png",
    alt: "기업 행사 고객 리뷰",
    background: "#abc3d4",
    width: 852,
    height: 1846,
    fit: "height",
  },
  {
    id: 8,
    image: "/images/reviews/review-08.png",
    alt: "세무법인 행사 고객 리뷰",
    background: "#f7f7f7",
    width: 853,
    height: 1844,
    fit: "height",
  },
];

const reviewBenefits = [
  { icon: Handshake, label: "신뢰할 수 있는", value: "진짜 현장 후기" },
  { icon: CalendarCheck, label: "행사가 끝난 뒤", value: "고객이 남긴 기록" },
  { icon: MessagesSquare, label: "문장 하나까지", value: "솔직한 리뷰" },
];

export default function AboutSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStart = useRef(null);
  const wheelLocked = useRef(false);

  const goToReview = useCallback((index) => {
    setActiveIndex(Math.max(0, Math.min(reviewCards.length - 1, index)));
  }, []);

  const handlePointerDown = (event) => {
    pointerStart.current = event.clientX;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerUp = (event) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;

    if (distance < -45) goToReview(activeIndex + 1);
    if (distance > 45) goToReview(activeIndex - 1);
  };

  const handleWheel = (event) => {
    if (wheelLocked.current || Math.abs(event.deltaX) < 20) return;
    wheelLocked.current = true;
    goToReview(activeIndex + (event.deltaX > 0 ? 1 : -1));
    window.setTimeout(() => {
      wheelLocked.current = false;
    }, 450);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") goToReview(activeIndex + 1);
    if (event.key === "ArrowLeft") goToReview(activeIndex - 1);
  };

  return (
    <section id="about" className="overflow-hidden bg-[#f4f9ff] py-16 md:py-20 lg:py-24">
      <div className="review-layout mx-auto max-w-[1440px] items-center px-5 sm:px-8 xl:px-12">
        <div className="review-copy relative z-40 text-center">
          <BadgeCheck className="mx-auto mb-5 h-6 w-6 fill-blue-600 text-white lg:mx-0" aria-hidden="true" />
          <p className="text-sm font-bold tracking-[0.12em] text-blue-600">REAL CUSTOMER REVIEW</p>
          <h2 className="mt-4 text-3xl font-extrabold leading-[1.22] tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-[2.7rem] xl:text-5xl">
            한 번 함께해보면,
            <span className="mt-1 block text-blue-600">다음 행사도 메이크원입니다.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base leading-7 text-slate-600 lg:mx-0 lg:text-lg">
            ‘한 번’은 우연일 수 있지만,<br className="hidden sm:block" />
            ‘계속 함께하는’ 이유는 후기 속에 있습니다.
          </p>

          <div className="review-benefits mt-9 grid grid-cols-3 gap-3">
            {reviewBenefits.map((benefit) => (
              <div key={benefit.value} className="text-center lg:text-left">
                <div className="benefit-icon mx-auto mb-3 flex items-center justify-center rounded-full bg-white text-blue-600 shadow-[0_8px_24px_rgba(37,99,235,0.12)] ring-1 ring-blue-100">
                  <benefit.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="hidden text-[11px] leading-4 text-slate-500 sm:block">{benefit.label}</p>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-800 sm:text-sm">{benefit.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-w-0">
          <div
            className="review-stage relative mx-auto w-full max-w-[940px] touch-pan-y select-none outline-none"
            role="region"
            aria-label="고객 리뷰 슬라이드"
            tabIndex={0}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => { pointerStart.current = null; }}
            onWheel={handleWheel}
            onKeyDown={handleKeyDown}
          >
            {reviewCards.map((review, index) => {
              const offset = index - activeIndex;
              const isActive = offset === 0;
              const isVisible = Math.abs(offset) <= 2;

              return (
                <button
                  key={review.id}
                  type="button"
                  onClick={() => goToReview(index)}
                  className={`review-device absolute left-1/2 top-5 overflow-hidden rounded-[2rem] border bg-[#dcebf5] p-2.5 text-left shadow-[0_24px_70px_rgba(51,94,133,0.22)] transition-[transform,opacity,filter] duration-500 ease-out sm:p-3 ${
                    isActive ? "border-white" : "border-blue-100"
                  }`}
                  style={{
                    transform: `translateX(calc(-50% + ${offset * 76}%)) scale(${isActive ? 1 : 0.8})`,
                    opacity: isVisible ? (isActive ? 1 : Math.abs(offset) === 1 ? 0.72 : 0) : 0,
                    filter: isActive ? "none" : "saturate(.72)",
                    pointerEvents: Math.abs(offset) <= 1 ? "auto" : "none",
                    zIndex: 30 - Math.abs(offset),
                  }}
                  aria-label={`${review.alt} 보기, ${index + 1} / ${reviewCards.length}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <div className="flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-slate-200/80">
                    <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-100 px-5 text-slate-700">
                      <span className="text-[11px] font-extrabold tracking-[0.18em] text-blue-600">MAKE ONE</span>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                        REVIEW {String(review.id).padStart(2, "0")}
                      </span>
                    </div>

                    <div
                      className="flex min-h-0 flex-1 items-center justify-center overflow-hidden"
                      style={{ backgroundColor: review.background }}
                    >
                      <div
                        className="review-image-shell relative max-h-full max-w-full overflow-hidden"
                        data-fit={review.fit}
                        style={{ aspectRatio: `${review.width} / ${review.height}` }}
                      >
                        <img
                          src={review.image}
                          alt={review.alt}
                          className="block h-full w-full object-contain"
                          draggable="false"
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => goToReview(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="absolute left-0 top-1/2 z-40 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-blue-100 bg-white text-slate-800 shadow-lg transition hover:text-blue-600 disabled:pointer-events-none disabled:opacity-25 sm:flex lg:left-2"
              aria-label="이전 리뷰"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goToReview(activeIndex + 1)}
              disabled={activeIndex === reviewCards.length - 1}
              className="absolute right-0 top-1/2 z-40 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-blue-100 bg-white text-slate-800 shadow-lg transition hover:text-blue-600 disabled:pointer-events-none disabled:opacity-25 sm:flex lg:right-2"
              aria-label="다음 리뷰"
            >
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="relative z-40 -mt-1 flex items-center justify-center gap-2" aria-label="리뷰 페이지 선택">
            {reviewCards.map((review, index) => (
              <button
                key={review.id}
                type="button"
                onClick={() => goToReview(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index ? "w-8 bg-blue-600" : "w-2.5 bg-blue-200 hover:bg-blue-300"
                }`}
                aria-label={`${index + 1}번 리뷰로 이동`}
                aria-current={activeIndex === index ? "true" : undefined}
              />
            ))}
          </div>
          <p className="relative z-40 mt-4 text-center text-xs font-semibold tracking-[0.14em] text-slate-400">
            SWIPE <span className="mx-2 text-blue-300">•</span>
            {String(activeIndex + 1).padStart(2, "0")} / {String(reviewCards.length).padStart(2, "0")}
          </p>
        </div>
      </div>

      <style>{`
        .review-device {
          width: min(79vw, 440px);
          height: 590px;
        }

        .review-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 2.5rem;
        }

        .review-stage {
          height: 610px;
        }

        .review-benefits {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .benefit-icon {
          width: 44px;
          height: 44px;
        }

        .review-image-shell {
          flex: 0 0 auto;
        }

        .review-image-shell[data-fit="width"] {
          width: 100%;
          height: auto;
        }

        .review-image-shell[data-fit="height"] {
          width: auto;
          height: 100%;
        }

        @media (min-width: 640px) {
          .review-device {
            height: 650px;
          }

          .review-stage {
            height: 670px;
          }
        }

        @media (min-width: 1024px) {
          .review-layout {
            grid-template-columns: 380px minmax(0, 1fr);
            gap: 2rem;
          }

          .review-copy {
            text-align: left;
          }

          .review-copy > svg,
          .review-copy > p,
          .review-copy > h2 {
            margin-left: 0;
            margin-right: 0;
          }

          .review-benefits {
            margin-top: 3rem;
            gap: 1rem;
          }

          .review-benefits > div,
          .review-benefits > div > div {
            text-align: left;
          }

          .benefit-icon {
            margin-left: 0;
            margin-right: 0;
          }

          .review-device {
            height: 690px;
          }

          .review-stage {
            height: 720px;
          }
        }

        @media (min-width: 1280px) {
          .review-layout {
            grid-template-columns: 430px minmax(0, 1fr);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .review-device {
            transition-duration: 0.01ms;
          }
        }
      `}</style>
    </section>
  );
}
