import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X, Phone } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 페이지 이동 시 모바일 메뉴 닫기
    setIsMobileMenuOpen(false);
  }, [location]);

  const handlePortfolioClick = (e) => {
    if (e.shiftKey && e.altKey) {
      e.preventDefault();
      navigate('/Admin');
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-5 xl:px-6">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link to={createPageUrl("Home")} className="flex items-center text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            MAKE ONE
          </Link>
          
          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-2.5 text-[13px] xl:gap-7 xl:text-base">
            <Link to={createPageUrl("CompanyInfo")} className="text-gray-700 hover:text-gray-900 font-medium">
              회사소개
            </Link>
            <Link to={createPageUrl("Program")} className="text-gray-700 hover:text-gray-900 font-medium">
              프로그램
            </Link>
            <Link to={createPageUrl("CastingSystem")} className="text-gray-700 hover:text-gray-900 font-medium whitespace-nowrap">
              섭외&amp;시스템
            </Link>
            <Link to={createPageUrl("Photos")} onClick={handlePortfolioClick} className="text-gray-700 hover:text-gray-900 font-medium">
              포트폴리오
            </Link>
            <Link to={createPageUrl("Review")} className="text-gray-700 hover:text-gray-900 font-medium">
              고객리뷰
            </Link>
            
            <a 
              href="tel:010-8771-8434"
              className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 font-medium whitespace-nowrap xl:gap-2"
            >
              <Phone className="w-4 h-4" />
              010-8771-8434
            </a>
            
            <Link to="/#contact" className="bg-blue-600 text-white px-3.5 py-2 rounded-full font-medium whitespace-nowrap hover:bg-blue-700 transition-all hover:scale-105 shadow-lg xl:px-6">
              견적 문의하기
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <nav className="flex flex-col space-y-2 px-6 py-6">
              <Link to={createPageUrl("CompanyInfo")} className="text-gray-700 hover:text-gray-900 font-medium py-3 text-lg">
                회사소개
              </Link>
              <Link to={createPageUrl("Program")} className="text-gray-700 hover:text-gray-900 font-medium py-3 text-lg">
                프로그램
              </Link>
              <Link to={createPageUrl("CastingSystem")} className="text-gray-700 hover:text-gray-900 font-medium py-3 text-lg">
                섭외&amp;시스템
              </Link>
              <Link to={createPageUrl("Photos")} onClick={handlePortfolioClick} className="text-gray-700 hover:text-gray-900 font-medium py-3 text-lg">
                포트폴리오
              </Link>
              <Link to={createPageUrl("Review")} className="text-gray-700 hover:text-gray-900 font-medium py-3 text-lg">
                고객리뷰
              </Link>
              
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
