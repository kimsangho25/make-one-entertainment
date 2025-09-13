import React from 'react';
import { User } from '@/api/entities';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';

export default function AuthPage() {
  const handleLogin = async () => {
    try {
      await User.login();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-20 bg-gray-50 flex items-center justify-center" style={{minHeight: 'calc(100vh - 80px)'}}>
        <div className="max-w-md w-full mx-auto px-6 py-16">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">로그인 / 회원가입</h1>
            <p className="text-gray-600 mb-8">
              메이크원 엔터테인먼트에 오신 것을 환영합니다.
              구글 계정으로 간편하게 시작해보세요.
            </p>
            <Button 
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
            >
              <Chrome className="w-5 h-5 mr-3" />
              Google 계정으로 로그인
            </Button>
            <p className="text-xs text-gray-400 mt-6">
              로그인은 개인정보처리방침 및 이용약관에 동의하는 것으로 간주됩니다.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}