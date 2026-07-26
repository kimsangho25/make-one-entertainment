import { useEffect, useState } from "react";
import Header from "@/components/Header";
import "./CastingSystem.css";

const services = [
  {
    id: "casting",
    number: "01",
    label: "섭외",
    title: "MC · 아나운서 · 리포터",
    description: "행사의 성격과 목적에 맞는 전문 인재를 섭외합니다.",
    image: "/images/casting-system/01-casting.png",
  },
  {
    id: "performance",
    number: "02",
    label: "공연자",
    title: "마술사 · 트로트 가수 · 댄스팀 · 아카펠라 · 공연팀",
    description: "다양한 장르의 공연으로 행사를 더욱 특별하게 만듭니다.",
    image: "/images/casting-system/02-performance.png",
  },
  {
    id: "system",
    number: "03",
    label: "시스템",
    title: "음향 · 조명 · 무대 · 행사 기획",
    description: "전문 시스템과 체계적인 기획으로 완성도 높은 행사를 제공합니다.",
    image: "/images/casting-system/03-system.png",
  },
  {
    id: "sports-equipment",
    number: "04",
    label: "체육대회 장비",
    title: "에어바운스 · 기본 도구 · 에어아치",
    description: "안전하고 즐거운 체육대회를 위한 다양한 장비를 제공합니다.",
    image: "/images/casting-system/04-sports-equipment.png",
  },
  {
    id: "event-supplies",
    number: "05",
    label: "행사물품",
    title: "몽골·캐노피 천막 · 듀라테이블 · 행사의자 · 포토월",
    description: "행사에 필요한 다양한 물품을 한 곳에서 준비해드립니다.",
    image: "/images/casting-system/05-event-supplies.png",
  },
];

export default function CastingSystem() {
  const [activeService, setActiveService] = useState(services[0].id);
  const [zoomedService, setZoomedService] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll(".casting-section-card");

    if (!("IntersectionObserver" in window)) {
      cards.forEach((card) => card.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
        });
      },
      {
        threshold: 0.24,
        rootMargin: "-18% 0px -42%",
      },
    );

    const updateActiveService = () => {
      const activationLine = Math.min(window.innerHeight * 0.42, 360);
      let currentService = services[0].id;

      cards.forEach((card) => {
        if (card.getBoundingClientRect().top <= activationLine) {
          currentService = card.id;
        }
      });

      setActiveService(currentService);
    };

    cards.forEach((card) => observer.observe(card));
    updateActiveService();
    window.addEventListener("scroll", updateActiveService, { passive: true });
    window.addEventListener("resize", updateActiveService);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActiveService);
      window.removeEventListener("resize", updateActiveService);
    };
  }, []);

  useEffect(() => {
    if (!zoomedService) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event) => {
      if (event.key === "Escape") setZoomedService(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [zoomedService]);

  const moveToService = (serviceId) => {
    const target = document.getElementById(serviceId);
    if (!target) return;

    setActiveService(serviceId);
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  return (
    <div className="casting-system-page">
      <Header />

      <main className="casting-system-stage">
        <section className="casting-system-intro" aria-labelledby="casting-system-title">
          <p className="casting-system-intro__eyebrow">CASTING &amp; EVENT SYSTEM</p>
          <h1 id="casting-system-title">
            필요한 사람과 시스템을
            <br />
            <span>한눈에 확인하세요.</span>
          </h1>
          <p>
            행사의 목적에 맞는 진행자와 공연자부터 음향·조명·무대,
            <br className="casting-system-intro__desktop-break" />
            운영 장비와 행사물품까지 한 번에 준비합니다.
          </p>
        </section>

        <nav className="casting-quick-nav" aria-label="섭외 및 시스템 빠른 이동">
          <div className="casting-quick-nav__inner">
            {services.map((service) => {
              const isActive = activeService === service.id;

              return (
                <button
                  key={service.id}
                  type="button"
                  className={isActive ? "is-active" : ""}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => moveToService(service.id)}
                >
                  <span>{service.number}</span>
                  {service.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="casting-sections" aria-label="섭외 및 시스템 서비스 안내">
          {services.map((service, index) => (
            <article
              key={service.id}
              id={service.id}
              className={`casting-section-card${index === 0 ? " is-visible" : ""}`}
              style={{ "--section-delay": `${index * 70}ms` }}
            >
              <button
                type="button"
                className="casting-section-card__image-button"
                aria-label={`${service.label} 안내 이미지를 원본 크기로 보기`}
                onClick={() => setZoomedService(service)}
              >
                <img
                  src={service.image}
                  alt={`${service.number} ${service.label}: ${service.title}`}
                  loading={index === 0 ? "eager" : "lazy"}
                />
                <span className="casting-section-card__zoom-label">크게 보기</span>
              </button>

              <div className="sr-only">
                <h2>
                  {service.number}. {service.label}
                </h2>
                <p>{service.title}</p>
                <p>{service.description}</p>
              </div>
            </article>
          ))}
        </div>

        <section className="casting-system-cta" aria-labelledby="casting-cta-title">
          <p className="casting-system-cta__eyebrow">ONE BRIEFING, ONE TEAM</p>
          <h2 id="casting-cta-title">
            어떤 구성이 필요한지 몰라도
            <br />
            괜찮습니다.
          </h2>
          <p>
            행사 목적과 규모를 알려주시면 필요한 인력과 시스템부터 먼저
            정리해드립니다.
          </p>
          <div className="casting-system-cta__actions">
            <a href="tel:010-8771-8434">전화 상담 010-8771-8434</a>
            <a href="/#contact">견적 문의하기</a>
          </div>
        </section>
      </main>

      {zoomedService && (
        <div
          className="casting-image-viewer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="casting-viewer-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setZoomedService(null);
          }}
        >
          <div className="casting-image-viewer__panel">
            <div className="casting-image-viewer__header">
              <p id="casting-viewer-title">
                <span>{zoomedService.number}</span>
                {zoomedService.label} 원본 보기
              </p>
              <button type="button" onClick={() => setZoomedService(null)}>
                닫기
              </button>
            </div>
            <div className="casting-image-viewer__viewport">
              <img
                src={zoomedService.image}
                alt={`${zoomedService.number} ${zoomedService.label}: ${zoomedService.title}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
