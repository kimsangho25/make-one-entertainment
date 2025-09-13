
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_yun@1.0/YunGothic.woff') format('woff');
        
        @font-face {
          font-family: 'YunGothic';
          src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_yun@1.0/YunGothic.woff') format('woff');
          font-weight: normal;
          font-style: normal;
        }
        
        :root {
          --color-primary: #1d1d1f;
          --color-secondary: #86868b;
          --color-accent: #007aff;
          --color-accent-hover: #1a87ff;
          --color-surface: #ffffff;
          --color-surface-elevated: #f5f5f7;
          --font-display: 'YunGothic', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
          --font-text: 'YunGothic', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
          --transition-medium: 250ms ease-out;
          --radius-lg: 12px;
          --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.15);
        }
        
        * {
          box-sizing: border-box;
          font-family: 'YunGothic', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }
        
        html {
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        body {
          font-family: 'YunGothic', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif !important;
          font-size: 17px;
          line-height: 1.47059;
          font-weight: 400;
          color: var(--color-primary);
          background-color: var(--color-surface);
          overflow-x: hidden;
          margin: 0;
          padding: 0;
        }

        /* 모든 텍스트 요소에 윤고딕체 적용 */
        h1, h2, h3, h4, h5, h6,
        p, span, div, a, button,
        input, textarea, select, option,
        label, li, td, th {
          font-family: 'YunGothic', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }

        /* 버튼 요소 */
        .btn, button[class*="btn"], 
        button[class*="Button"],
        [role="button"] {
          font-family: 'YunGothic', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }

        /* 폼 요소 */
        input[type="text"], input[type="email"], 
        input[type="tel"], input[type="number"],
        textarea, select {
          font-family: 'YunGothic', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }

        /* 플레이스홀더 텍스트 */
        ::placeholder {
          font-family: 'YunGothic', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }

        /* 메뉴 및 네비게이션 */
        nav, nav a, nav button {
          font-family: 'YunGothic', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }
      `}</style>
      {children}
    </div>
  );
}
