
import React, { useState } from "react";
//import { Contact } from "@/api/entities";
import { CheckCircle, Phone, Mail, Instagram, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    company: "",
    contactName: "",
    eventName: "",
    phone: "",
    eventDate: "",
    expectedParticipants: "",
    budgetRange: "",
    requirements: "",
    agreeToPrivacy: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeToPrivacy) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // await Contact.create({
      //   name: formData.contactName,
      //   company: formData.company,
      //   phone: formData.phone,
      //   event_type: "기타행사",
      //   participants: parseInt(formData.expectedParticipants) || 0,
      //   budget: formData.budgetRange,
      //   message: `행사명: ${formData.eventName}\n날짜: ${formData.eventDate}\n예상 인원: ${formData.expectedParticipants}\n예산 범위: ${formData.budgetRange}\n요청사항: ${formData.requirements}`
      // });
      const res = await fetch("/api/contact", {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify({
          company: formData.company,
          contactName: formData.contactName,
          eventName: formData.eventName,
          phone: formData.phone,
          eventDate: formData.eventDate,
          expectedParticipants: formData.expectedParticipants,
          budgetRange: formData.budgetRange,
          requirements: formData.requirements
        })
      });
      if(!res.ok){
        const txt = await res.text().catch(()=> '');
        throw new Error(`contact api failed: ${res.status} ${txt}`);
      }
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      alert("문의 접수에 실패했습니다. 다시 시도해주세요.");
    }
    
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 md:py-32 bg-slate-800">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center bg-slate-700 rounded-3xl p-12 text-white">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">문의가 성공적으로 접수되었습니다</h2>
            <p className="text-gray-300 text-2xl mb-10 leading-relaxed">
              빠른 시일 내에 담당자가 연락드리겠습니다.<br />
              소중한 시간 내주셔서 감사합니다.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-lg font-medium transition-all duration-300 text-xl"
            >
              새로운 문의하기
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-12 md:py-20 lg:py-32 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* 상단 제목 */}
        <div className="text-center mb-10 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-4 md:mb-6 leading-tight">
            <span className="animate-pulse-subtle text-orange-400">10초만에</span>
            <br />
            <span className="relative">
              견적 문의하기
              <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-cyan-400 opacity-30 rounded-full"></div>
            </span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl lg:text-2xl px-2">
            문의를 남겨주시면 빠르고 친절하게 답변 드리겠습니다.
          </p>
        </div>

        {/* 메인 콘텐츠 - 2단 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">
          {/* 왼쪽 - 연락처 정보 */}
          <div className="lg:col-span-1">
            <div className="bg-slate-700 rounded-2xl p-6 md:p-8 lg:p-10">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 md:mb-12">연락처 정보</h3>
              
              <div className="space-y-6 md:space-y-10">
                {/* 전화번호 */}
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 md:w-7 md:h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm md:text-xl">전화번호</p>
                    <a href="tel:010-8771-8434" className="text-white font-medium hover:text-red-400 transition-colors text-base md:text-xl lg:text-2xl break-all">
                      010-8771-8434
                    </a>
                  </div>
                </div>

                {/* 이메일 */}
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 md:w-7 md:h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm md:text-xl">이메일</p>
                    <a href="mailto:make1ent@nate.com" className="text-white font-medium hover:text-red-400 transition-colors text-base md:text-xl lg:text-2xl break-all">
                      make1ent@nate.com
                    </a>
                  </div>
                </div>

                {/* 인스타그램 */}
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-5 h-5 md:w-7 md:h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm md:text-xl">인스타그램</p>
                    <a 
                      href="https://www.instagram.com/mc_sangseol/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-medium hover:text-red-400 transition-colors text-base md:text-xl lg:text-2xl break-all"
                    >
                      @mc_sangseol
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 - 입력 폼 */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
              {/* 첫 번째 행 - 단체명, 담당자명 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div>
                  <label className="block text-white text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-2 md:mb-4">
                    단체명 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    required
                    className="w-full px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm md:text-base lg:text-xl"
                    placeholder="단체명을 입력해주세요"
                  />
                </div>
                <div>
                  <label className="block text-white text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-2 md:mb-4">
                    담당자명 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.contactName}
                    onChange={(e) => handleChange("contactName", e.target.value)}
                    required
                    className="w-full px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm md:text-base lg:text-xl"
                    placeholder="담당자명을 입력해주세요"
                  />
                </div>
              </div>

              {/* 두 번째 행 - 행사명, 연락처 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div>
                  <label className="block text-white text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-2 md:mb-4">
                    행사명 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.eventName}
                    onChange={(e) => handleChange("eventName", e.target.value)}
                    required
                    className="w-full px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm md:text-base lg:text-xl"
                    placeholder="행사명을 입력해주세요"
                  />
                </div>
                <div>
                  <label className="block text-white text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-2 md:mb-4">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                    className="w-full px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm md:text-base lg:text-xl"
                    placeholder="연락처를 입력해주세요"
                  />
                </div>
              </div>

              {/* 세 번째 행 - 행사 날짜, 예상 인원 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div>
                  <label className="block text-white text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-2 md:mb-4">
                    행사 날짜
                  </label>
                  <Input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => handleChange("eventDate", e.target.value)}
                    className="w-full px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm md:text-base lg:text-xl"
                  />
                </div>
                <div>
                  <label className="block text-white text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-2 md:mb-4">
                    예상 인원
                  </label>
                  <Input
                    value={formData.expectedParticipants}
                    onChange={(e) => handleChange("expectedParticipants", e.target.value)}
                    className="w-full px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm md:text-base lg:text-xl"
                    placeholder="예상 인원을 입력해주세요"
                  />
                </div>
              </div>

              {/* 예산 범위 */}
              <div>
                <label className="block text-white text-2xl font-medium mb-4">
                  예산 범위
                </label>
                <Input
                  value={formData.budgetRange}
                  onChange={(e) => handleChange("budgetRange", e.target.value)}
                  className="w-full px-8 py-5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-xl"
                  placeholder="예산 범위를 선택해주세요"
                />
              </div>

              {/* 요청사항 */}
              <div>
                <label className="block text-white text-2xl font-medium mb-4">
                  요청사항
                </label>
                <Textarea
                  value={formData.requirements}
                  onChange={(e) => handleChange("requirements", e.target.value)}
                  className="w-full px-8 py-5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 min-h-[160px] resize-none text-xl"
                  placeholder="요청사항을 입력해주세요"
                />
              </div>

              {/* 개인정보 동의 체크박스 */}
              <div className="flex items-start gap-5">
                <input
                  type="checkbox"
                  id="privacy-agree"
                  checked={formData.agreeToPrivacy}
                  onChange={(e) => handleChange("agreeToPrivacy", e.target.checked)}
                  className="mt-2 w-6 h-6 text-red-600 bg-slate-700 border-slate-600 rounded focus:ring-red-500"
                />
                <label htmlFor="privacy-agree" className="text-white text-xl">
                  개인정보 수집 및 이용에 동의합니다. <span className="text-red-500">*</span>
                </label>
              </div>

              {/* 제출 버튼 */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-7 rounded-lg font-semibold text-2xl transition-all duration-300 flex items-center justify-center gap-4 mt-12"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-7 h-7 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    전송 중...
                  </div>
                ) : (
                  <>
                    프로젝트 문의하기
                    <ArrowRight className="w-7 h-7" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        <style jsx>{`
          @keyframes pulse-subtle {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.05);
            }
          }

          .animate-pulse-subtle {
            animation: pulse-subtle 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    </section>
  );
}
