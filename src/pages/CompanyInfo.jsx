import { useEffect } from 'react';
import { ArrowDown, ArrowUpRight, Check, Quote } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './CompanyInfo.css';

const companyImages = '/images/company';

// eslint-disable-next-line react/prop-types
const PromiseArticle = ({ number, eyebrow, title, image, imageAlt, theme = 'light', children }) => (
  <article className={`company-promise company-promise--${theme}`}>
    <div className="company-promise__visual">
      <img src={`${companyImages}/${image}`} alt={imageAlt} loading="lazy" />
      <span className="company-promise__number" aria-hidden="true">{number}</span>
    </div>
    <div className="company-promise__copy">
      <p className="company-kicker">{eyebrow}</p>
      <h3>{title}</h3>
      <div className="company-rich-copy">{children}</div>
    </div>
  </article>
);

const CompanyInfo = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      window.setTimeout(() => {
        document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
      return;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location]);

  return (
    <div className="company-page">
      <Header />

      <main>
        <section className="company-hero" aria-labelledby="company-hero-title">
          <img
            className="company-hero__image"
            src={`${companyImages}/hero-stage.jpg`}
            alt="많은 참가자 앞에서 행사를 진행하는 메이크원 사회자"
          />
          <div className="company-hero__shade" />
          <div className="company-shell company-hero__content">
            <p className="company-kicker company-kicker--inverse">MAKE ONE ENTERTAINMENT</p>
            <h1 id="company-hero-title">
              <span className="company-hero__title-line">맡기신 순간부터,</span>
              <br />
              <span>끝까지.</span>
            </h1>
            <p className="company-hero__lead">
              완벽한 행사는 보이지 않는 준비에서 시작됩니다.
              <br />
              메이크원은 처음 상담부터 마지막 인사까지, 모든 순간을 책임집니다.
            </p>
            <a className="company-hero__link" href="#promise">
              메이크원의 약속 보기 <ArrowDown size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="company-hero__index" aria-hidden="true">01 / MAKE ONE</div>
        </section>

        <section className="company-intro" id="promise" aria-labelledby="promise-title">
          <div className="company-shell company-intro__grid">
            <div>
              <p className="company-kicker">OUR PROMISE</p>
              <h2 id="promise-title">메이크원은 세 가지를<br />약속드립니다.</h2>
            </div>
            <p className="company-intro__statement">
              행사의 크기보다 <strong>맡겨주신 신뢰의 무게</strong>를 먼저 생각합니다.
              보이지 않는 준비, 현장의 책임, 그리고 결과까지 세 가지 원칙으로 증명하겠습니다.
            </p>
          </div>
        </section>

        <PromiseArticle
          number="01"
          eyebrow="PREPARATION"
          title="준비보다 더 철저한 준비를 약속드립니다."
          image="preparation-enhanced.jpg"
          imageAlt="행사 순서를 세심하게 확인하며 진행을 준비하는 사회자"
        >
          <p className="company-rich-copy__lead">좋은 행사는 행사 당일 만들어지지 않습니다.</p>
          <p>
            행사의 완성도는 현장에서 결정되는 것처럼 보이지만,<br />
            실제로는 보이지 않는 준비 과정에서 이미 결정됩니다.
          </p>
          <p>
            행사의 목적을 이해하는 것부터, 참여자의 특성을 분석하고,
            동선과 시간, 프로그램의 흐름, 돌발 상황까지.
          </p>
          <p>메이크원은 작은 부분 하나도 당연하게 생각하지 않습니다.</p>
          <p>
            행사가 시작되기 전까지 수없이 점검하고, 수없이 고민하며,
            현장에서 가장 자연스럽게 흘러갈 수 있도록 준비합니다.
          </p>
          <blockquote>우리는 준비가 철저할수록<br />행사는 더 편안하게 진행된다고 믿습니다.</blockquote>
        </PromiseArticle>

        <PromiseArticle
          number="02"
          eyebrow="RESPONSIBILITY"
          title="행사의 모든 순간을 끝까지 책임지겠습니다."
          image="field-leadership.jpg"
          imageAlt="야외 체육대회 현장에서 참가자들과 호흡하며 행사를 이끄는 사회자"
          theme="dark"
        >
          <p className="company-rich-copy__lead">행사는 예상대로만 흘러가지 않습니다.</p>
          <p>
            일정이 지연될 수도 있고, 참여자의 반응이 예상과 다를 수도 있으며,
            갑작스러운 변수는 언제든 발생할 수 있습니다.
          </p>
          <p>
            하지만 중요한 것은 변수가 생기지 않는 것이 아니라,
            변수가 생겼을 때 어떻게 대응하느냐입니다.
          </p>
          <p>
            메이크원은 수많은 현장을 경험하며 순간의 판단과 유연한 운영이
            행사의 완성도를 결정한다는 것을 배웠습니다.
          </p>
          <p>행사가 시작되는 순간부터 마지막 마무리까지.</p>
          <blockquote>고객이 신경 쓰기 전에 먼저 움직이고,<br />고객이 걱정하기 전에 먼저 해결하는 것.</blockquote>
          <p>그것이 메이크원이 생각하는 책임입니다.</p>
        </PromiseArticle>

        <PromiseArticle
          number="03"
          eyebrow="TRUST & RESULT"
          title="맡겨주신 신뢰를 결과로 증명하겠습니다."
          image="team-result.jpg"
          imageAlt="메이크원이 진행한 대규모 기업 체육대회를 마친 참가자들의 단체 사진"
        >
          <p className="company-rich-copy__lead">
            행사를 맡긴다는 것은 프로그램 하나를 의뢰하는 것이 아닙니다.
          </p>
          <p>
            기업의 이름을 걸고 진행되는 중요한 순간을 메이크원에게 맡겨주시는 것입니다.
            그 신뢰의 무게를 알기에 저희는 단 한 번의 행사도 가볍게 생각하지 않습니다.
          </p>
          <p>
            행사가 끝난 뒤 참여자는 즐거운 기억을 남기고, 기업은 전달하고자 했던 가치를
            자연스럽게 전하며, 행사를 준비한 담당자는 이렇게 말할 수 있어야 합니다.
          </p>
          <blockquote>“메이크원과 함께해서 정말 다행이었다.”</blockquote>
          <p>
            저희가 추구하는 완벽한 행사는 무대가 화려한 행사가 아닙니다.
            고객이 안심하고 맡길 수 있는 행사. 그리고 다음 행사도 가장 먼저 메이크원을
            떠올릴 수 있는 행사.
          </p>
          <p>그것이 메이크원이 끝까지 만들어가고 싶은 결과입니다.</p>
        </PromiseArticle>

        <section className="company-proof company-proof--gallery-only" aria-label="메이크원 현장 사진">
          <div className="company-shell">
            <div className="company-proof__gallery">
              <figure className="company-proof__item company-proof__item--wide">
                <img
                  src={`${companyImages}/corporate-event.jpg`}
                  alt="기업 행사장에서 메시지를 전달하는 메이크원 사회자"
                  loading="lazy"
                />
                <figcaption><span>01</span> 기업의 메시지를 자연스럽게 전하는 행사</figcaption>
              </figure>
              <figure className="company-proof__item">
                <img
                  src={`${companyImages}/fan-meeting.jpg`}
                  alt="팬미팅 무대와 관객이 함께 호응하는 현장"
                  loading="lazy"
                />
                <figcaption><span>02</span> 관객과 무대가 함께 호흡하는 순간</figcaption>
              </figure>
              <figure className="company-proof__item">
                <img
                  src={`${companyImages}/family-festival.jpg`}
                  alt="야외 행사장에서 참가자들이 함께 즐기는 현장"
                  loading="lazy"
                />
                <figcaption><span>03</span> 모두가 안심하고 즐기는 현장</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="company-philosophy" id="philosophy" aria-labelledby="philosophy-title">
          <div className="company-shell company-philosophy__header">
            <p className="company-kicker">FOUNDER’S PHILOSOPHY</p>
            <h2 id="philosophy-title">완벽한 행사는<br />우연히 만들어지지 않습니다.</h2>
          </div>

          <div className="company-philosophy__portrait">
            <img
              src={`${companyImages}/representative-action.jpg`}
              alt="행사 현장에서 참가자와 소통하며 진행하는 박상설 대표"
              loading="lazy"
            />
            <div className="company-philosophy__portrait-caption">
              <span>MAKE ONE ENTERTAINMENT</span>
              <strong>대표 박상설</strong>
            </div>
          </div>

          <div className="company-shell company-philosophy__body">
            <aside className="company-philosophy__quote">
              <Quote size={32} strokeWidth={1.6} aria-hidden="true" />
              <p>행사는 프로그램을 운영하는 일이 아니라,<br /><strong>고객의 신뢰를 완성하는 일</strong>입니다.</p>
            </aside>

            <div className="company-philosophy__letter">
              <p>안녕하세요.</p>
              <p className="company-philosophy__greeting">메이크원 엔터테인먼트 대표 박상설입니다.</p>
              <p>
                메이크원은 사회자를 연결하는 회사가 아닙니다.<br />
                행사를 기획하는 회사만도 아닙니다.<br />
                우리는 행사의 목적을 이해하고, 현장의 흐름을 설계하며, 고객이 가장 걱정하는 순간까지
                책임지는 행사 전문 파트너입니다.
              </p>
              <p>
                저는 행사의 규모보다 완성도를 먼저 생각합니다. 화려한 연출보다 참여자의 만족을 먼저
                생각합니다.<br />
                그리고 무엇보다 고객이 안심할 수 있는 현장을 가장 중요하게 생각합니다.
              </p>
              <p>
                행사가 성공했다는 것은 단순히 일정이 끝났다는 의미가 아닙니다. 참여자는 즐거운 경험을
                기억하고, 기업은 전달하고자 했던 메시지를 자연스럽게 전하며, 행사를 준비한 담당자는
                안도의 미소를 지을 수 있어야 합니다.
              </p>
              <p>
                그때 비로소 좋은 행사라고 말할 수 있다고<br />
                믿습니다.
              </p>
              <p>
                메이크원은 매 행사마다 같은 마음으로 준비합니다. 처음 상담을 시작하는 순간부터 행사
                종료 후 마지막 인사까지. 단 한 순간도 가볍게 생각하지 않습니다.
              </p>
              <p>
                귀사가 메이크원을 선택했다는 것은 단순히 행사를 맡겨주신 것이 아니라, 소중한 시간과
                기업의 이름, 그리고 신뢰를 맡겨주신 것이라고 생각합니다.
              </p>
              <p>
                지난 10년이 넘는 시간 동안 기업행사, 체육대회, 학교행사, 축제, 팬미팅 등 2,000회가
                넘는 다양한 현장에서 노하우와 책임감으로 행사에 임하겠습니다.
              </p>
              <p>
                예상치 못한 변수에 고민하고,<br />
                참여자들이 만족할 수 있고,<br />
                우리 회사의 분위기를 잘 담을 수 있도록<br />
                준비하겠습니다.
              </p>
              <p className="company-philosophy__emphasis">
                믿고 맡겨주신다면, 최고의 결과로 보답하겠습니다.
              </p>
            </div>
          </div>
        </section>

        <section className="company-cta" aria-labelledby="company-cta-title">
          <img src={`${companyImages}/final-stage.jpg`} alt="행사 무대에서 관객을 향해 진행하는 메이크원 대표" loading="lazy" />
          <div className="company-cta__shade" />
          <div className="company-shell company-cta__content">
            <div>
              <p className="company-kicker company-kicker--inverse">YOUR EVENT, OUR RESPONSIBILITY</p>
              <h2 id="company-cta-title">다음 행사의 시작을<br />메이크원과 함께하세요.</h2>
            </div>
            <div className="company-cta__action">
              <p><Check size={19} aria-hidden="true" /> 상담부터 종료 후 마지막 인사까지 함께합니다.</p>
              <a href={`${import.meta.env.BASE_URL}#contact`}>행사 문의하기 <ArrowUpRight size={20} aria-hidden="true" /></a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyInfo;
