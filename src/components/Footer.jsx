import React from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
  { label: "회사소개", href: "#about" },
  { label: "포트폴리오", href: "#portfolio" },
  { label: "프로젝트", href: "#projects" },
  { label: "문의하기", href: "#contact" }];


  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">MAKE ONE ENTERTAINMENT</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              혁신적이고 창의적인 이벤트와 엔터테인먼트로<br />
              잊을 수 없는 경험을 선사하는 전문 기획사입니다.
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="">make1ent@nate.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>010-8771-8434</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="">서울 강서구 금낭화로 49-3 1층 상가</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">빠른 링크</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) =>
              <li key={index}>
                  <a
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors">

                    {link.label}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-center md:text-left">
            <p>© {currentYear} Make One Entertainment. All rights reserved.</p>
            <p className="text-sm mt-1">Created with passion for exceptional events</p>
          </div>
          
          <div className="flex gap-6 mt-4 md:mt-0 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-white transition-colors">이용약관</a>
            <a href="#" className="hover:text-white transition-colors">사이트맵</a>
          </div>
        </div>
      </div>
    </footer>);

}