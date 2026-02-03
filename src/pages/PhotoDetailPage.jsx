import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Tag, Calendar, ChevronLeft, ChevronRight, List } from 'lucide-react';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
//import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';

const RENDER_EXTENSIONS = [
  StarterKit.configure(),
  TextStyle.configure(),
  Color.configure({ types: [ 'textStyle' ] }),
];

// 1. 날짜 포맷 함수 (Photos.jsx와 동일하게 유지)
const fmtDate = (v) => {
  if (!v) return '';
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    return new Date(v).toISOString().slice(0,10);
  } catch {
    return String(v).split('T')[0] || '';
  }
};

// 2. 유튜브 ID 추출 함수 추가
const getYoutubeId = (url = '') => {
  const m = url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/) ||
            url.match(/[?&]v=([A-Za-z0-9_-]{6,})/) ||
            url.match(/\/embed\/([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
};

export default function PhotoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);
  const [prevPost, setPrevPost] = useState(null); // 이전글 상태
  const [nextPost, setNextPost] = useState(null); // 다음글 상태
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 상세 데이터를 가져오는 API 호출 (기존 API 주소에 맞춰 수정 필요)
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/media/${id}`);
        const data = await res.json();
        setMedia(data.item || data); // 상세 데이터
        setPrevPost(data.prev);       // 이전글 (id, title 포함)
        setNextPost(data.next);       // 다음글 (id, title 포함)

        window.scrollTo(0, 0); // 페이지 이동 시 최상단으로
      } catch (err) {
        console.error("데이터 로드 실패", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]); // id가 바뀔 때마다 다시 호출

  const renderedDescription = useMemo(() => {
    if (!media?.description) return null;
    const descriptionData = media.description;
    try {
      let contentJson = (typeof descriptionData === 'object') ? descriptionData : JSON.parse(descriptionData);
      return generateHTML(contentJson, RENDER_EXTENSIONS);
    } catch (e) {
      return `<p>${descriptionData}</p>`;
    }
  }, [media?.description]);

  if (loading) return <div className="pt-40 text-center">로딩 중...</div>;
  if (!media) return <div className="pt-40 text-center">데이터를 찾을 수 없습니다.</div>;

  const images = Array.isArray(media.imageUrls) ? media.imageUrls : [];
  const eventDate = media.eventDate || media.event_date;
  const videoUrl = media.mediaUrl || media.media_url;

  return (
    <>
      <Header />
      <main className="pt-28 pb-20 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <button 
            onClick={() => navigate('/Photos')} 
            className="flex items-center text-gray-500 hover:text-black mb-8 transition-all hover:-translate-x-1"
          >
            <ChevronLeft size={20} /> <span>목록으로 돌아가기</span>
          </button>

          <header className="border-b pb-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{media.title}</h1>
            <div className="flex gap-4 text-gray-500 text-sm">
              <span className="flex items-center gap-1"><Tag size={16} /> {media.category}</span>
              {/* fmtDate 적용 */}
              {eventDate && <span className="flex items-center gap-1"><Calendar size={16} /> {fmtDate(eventDate)}</span>}
            </div>
          </header>

          {renderedDescription && (
            <article className="prose max-w-full mb-12 text-lg leading-relaxed text-gray-800">
               <div dangerouslySetInnerHTML={{ __html: renderedDescription }} />
            </article>
          )}

          <div className="space-y-8">
            {/* 비디오 처리 (getYoutubeId 적용) */}
            {(media.mediaType === 'video' || media.media_type === 'video') && videoUrl && (
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                 {getYoutubeId(videoUrl) ? (
                   <iframe 
                     className="w-full h-full" 
                     src={`https://www.youtube.com/embed/${getYoutubeId(videoUrl)}`} 
                     allowFullScreen 
                   />
                 ) : (
                   <video src={videoUrl} controls className="w-full" />
                 )}
              </div>
            )}

            {/* 이미지 나열 */}
            {images.map((url, index) => {
                // url 앞에 /가 없다면 붙여주고, 이미 있다면 그대로 둠
                const imageUrl = url.startsWith('/') ? url : `/${url}`;
                
                return (
                    <img 
                    key={index} 
                    src={imageUrl} 
                    alt={`${media.title}-${index}`} 
                    className="w-full rounded-xl shadow-sm"
                    />
                );
            })}
          </div>
          {/* 하단 버튼 영역 */}
            <div className="mt-16 border-t border-gray-900 pt-8 flex flex-wrap justify-between items-center gap-4">
            
            {/* 좌측: 이전글 / 다음글 묶음 */}
            <div className="flex gap-2">
                {/* 이전글 (목록상 아래) */}
                <button
                onClick={() => prevPost && navigate(`/Photos/${prevPost.id}`)}
                disabled={!prevPost}
                className={`px-6 py-2.5 text-sm font-medium transition-all ${
                    prevPost 
                    ? 'bg-black text-white hover:bg-gray-800 active:scale-95' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                >
                이전글
                </button>

                {/* 다음글 (목록상 위) */}
                <button
                onClick={() => nextPost && navigate(`/Photos/${nextPost.id}`)}
                disabled={!nextPost}
                className={`px-6 py-2.5 text-sm font-medium transition-all ${
                    nextPost 
                    ? 'bg-black text-white hover:bg-gray-800 active:scale-95' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                >
                다음글
                </button>
            </div>

            {/* 우측: 목록 버튼 */}
            <button
                onClick={() => navigate('/Photos')}
                className="px-8 py-2.5 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-all active:scale-95"
            >
                목록
            </button>
            </div>
        </div>
      </main>
      <Footer />
    </>
  );
}