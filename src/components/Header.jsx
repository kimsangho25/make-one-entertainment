import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate  } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X, Phone } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // 페이지 이동 시 모바일 메뉴 닫기
    setIsMobileMenuOpen(false);
  }, [location]);

  const handlePortfolioClick = (e) => {
    if (e.shiftKey && e.altKey) {
      e.preventDefault();            // 기본 라우팅 막기
      navigate('/Admin');      // 관리자 페이지로 이동
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled || isMobileMenuOpen
        ? 'bg-white/90 backdrop-blur-xl border-b border-gray-200/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link to={createPageUrl("Home")} className="flex items-center text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            MAKE ONE
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to={createPageUrl("Photos")} onClick={handlePortfolioClick} className="text-gray-700 hover:text-gray-900 font-medium">
              포트폴리오
            </Link>
            <Link to={createPageUrl("Review")} className="text-gray-700 hover:text-gray-900 font-medium">고객리뷰</Link>
            
            <a 
              href="tel:010-8771-8434"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              <Phone className="w-4 h-4" />
              010-8771-8434
            </a>
            
            <Link to="/#contact" className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-all hover:scale-105 shadow-lg">
              견적 문의하기
            </Link>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <nav className="flex flex-col space-y-2 px-6 py-6">
              <Link to={createPageUrl("Photos")} onClick={handlePortfolioClick} className="text-gray-700 hover:text-gray-900 font-medium py-3 text-lg">
                포트폴리오
              </Link>
              <Link to={createPageUrl("Review")} className="text-gray-700 hover:text-gray-900 font-medium py-3 text-lg">고객리뷰</Link>
              
              <a 
                href="tel:010-8771-8434"
                className="flex items-center gap-3 text-gray-700 hover:text-gray-900 font-medium py-3 text-lg"
              >
                <Phone className="w-5 h-5" />
                010-8771-8434
              </a>
              
              <Link to="/#contact" className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-full font-medium text-center">
                견적 문의하기
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}