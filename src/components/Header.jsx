import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate  } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X, Phone, ChevronDown } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpenMenu, setMobileOpenMenu] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMobileOpenMenu(null);
  }, [location]);

  const handlePortfolioClick = (e) => {
    if (e.shiftKey && e.altKey) {
      e.preventDefault();
      navigate('/Admin');
    }
  };

  const menuItems = [
    {
      id: 'company',
      label: '회사소개',
      link: createPageUrl("CompanyInfo"),
      subItems: [
        { label: '인사말', link: createPageUrl("CompanyInfo") + '#greeting' },
        { label: '연혁', link: createPageUrl("CompanyInfo") + '#history' }
      ]
    },
    {
      id: 'program',
      label: '프로그램',
      link: createPageUrl("Program"),
      subItems: []
    },
    {
      id: 'portfolio',
      label: '포트폴리오',
      link: createPageUrl("Photos"),
      subItems: []
    },
    {
      id: 'system',
      label: '시스템',
      link: createPageUrl("System"),
      subItems: [
        { label: '음향', link: createPageUrl("System") + '#audio' },
        { label: '조명', link: createPageUrl("System") + '#lighting' },
        { label: '무대', link: createPageUrl("System") + '#stage' },
        { label: '행사용품', link: createPageUrl("System") + '#equipment' },
        { label: '출장뷔폐', link: createPageUrl("System") + '#catering' }
      ]
    },
    {
      id: 'casting',
      label: '캐스팅',
      link: createPageUrl("Casting"),
      subItems: [
        { label: 'MC', link: createPageUrl("Casting") + '#mc' },
        { label: '트로트 가수', link: createPageUrl("Casting") + '#trot' },
        { label: '공연팀', link: createPageUrl("Casting") + '#performance' },
        { label: '마술팀', link: createPageUrl("Casting") + '#magic' }
      ]
    },
    {
      id: 'review',
      label: '고객리뷰',
      link: createPageUrl("Review"),
      subItems: []
    }
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white border-b border-gray-200 shadow-sm`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link to={createPageUrl("Home")} className="flex items-center text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            MAKE ONE
          </Link>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => item.subItems.length > 0 && setOpenDropdown(item.id)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={item.link}
                  onClick={item.id === 'portfolio' ? handlePortfolioClick : undefined}
                  className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium py-2"
                >
                  {item.label}
                  {item.subItems.length > 0 && (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Link>
                
                {item.subItems.length > 0 && openDropdown === item.id && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[160px]">
                    {item.subItems.map((subItem, idx) => (
                      <Link
                        key={idx}
                        to={subItem.link}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <nav className="flex flex-col space-y-1 px-6 py-6">
              {menuItems.map((item) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between">
                    <Link
                      to={item.link}
                      onClick={item.id === 'portfolio' ? handlePortfolioClick : undefined}
                      className="flex-1 text-gray-700 hover:text-gray-900 font-medium py-3 text-lg"
                    >
                      {item.label}
                    </Link>
                    {item.subItems.length > 0 && (
                      <button
                        onClick={() => setMobileOpenMenu(mobileOpenMenu === item.id ? null : item.id)}
                        className="p-2"
                      >
                        <ChevronDown className={`w-5 h-5 transition-transform ${mobileOpenMenu === item.id ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                  
                  {item.subItems.length > 0 && mobileOpenMenu === item.id && (
                    <div className="pl-4 space-y-1">
                      {item.subItems.map((subItem, idx) => (
                        <Link
                          key={idx}
                          to={subItem.link}
                          className="block py-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
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
