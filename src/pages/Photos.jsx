
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
// import { Photo } from '@/api/entities';
import { createPageUrl } from '@/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Camera, Tag, Calendar, X, ChevronLeft, ChevronRight, Play, PlayCircle } from 'lucide-react';
import { getClientId} from '@/lib/clientId';

const baseHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Client-Id': getClientId(),
});

const CATEGORIES = ['전체', '기업행사', '연예인행사', '팀빌딩', '체육대회', '축제', '공식행사', '영어행사'];

function useQuery() {
  const { search } = useLocation(); 
  return useMemo(() => new URLSearchParams(search), [search]);
}

//YYYY-MM-DD 표준화
const fmtDate = (v) => {
  if (!v) return '';
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    return new Date(v).toISOString().slice(0,10);
  } catch {
    return String(v).split('T')[0] || '';
  }
};

// 백엔드 응답을 프론트 포맷으로 정규화
const normalize = (row) => {
  const mediaType = row.mediaType ?? row.media_type ?? 'image';
  const imageUrls = Array.isArray(row.image_urls)
    ? row.image_urls.filter(Boolean)
    : Array.isArray(row.imageUrls)
    ? row.imageUrls.filter(Boolean)
    : [];

  return {
    id: row.id,
    title: row.title ?? '',
    description: row.description ?? '',
    category: row.category ?? '',
    eventDate: fmtDate(row.eventDate ?? row.event_date ?? ''),
    mediaType,
    imageUrls,
    mediaUrl: row.mediaUrl ?? row.media_url ?? '',
    thumbnailUrl: row.thumbnailUrl ?? imageUrls[0] ?? '',
    createdAt: row.createdAt ?? row.created_at ?? null,
    displayOrder: row.displayOrder ?? row.display_order ?? 0,
  };
};

// function MediaModal({ open, onClose, media }) {
//   // ✅ 훅은 항상 실행
//   const [idx, setIdx] = useState(0);

//   // 이미지/비디오 판별과 안전한 이미지 배열
//   const mediaType = media?.mediaType;
//   const isImage = mediaType === 'image';
//   const isVideo = mediaType === 'video';

//   const images = useMemo(() => {
//     const raw = media?.imageUrls ?? media?.image_urls ?? media?.images ?? [];
//     return Array.isArray(raw) ? raw.filter(Boolean) : [];
//   }, [media]);

//   // 열릴 때/아이템 바뀔 때 인덱스 리셋
//   useEffect(() => {
//     if (open) setIdx(0);
//   }, [open, media?.id]);

//   // 슬라이드 네비게이션
//   const prev = useCallback(() => {
//     if (images.length > 0) setIdx((i) => (i - 1 + images.length) % images.length);
//   }, [images.length]);

//   const next = useCallback(() => {
//     if (images.length > 0) setIdx((i) => (i + 1) % images.length);
//   }, [images.length]);

//   // Tiptap JSON을 HTML로 변환하는 로직 추가
//   const renderedDescription = useMemo(() => {
//     if (!media?.description) return null;

//     let contentJson = null;
//     const descriptionData = media.description;

//     try {
//       // 1. 이미 객체 형태라면 그대로 사용
//       if (typeof descriptionData === 'object' && descriptionData !== null) {
//         contentJson = descriptionData;
//       } 
//       // 2. 문자열인데 JSON 형태라면 파싱
//       else if (typeof descriptionData === 'string' && descriptionData.trim().startsWith('{')) {
//         contentJson = JSON.parse(descriptionData);
//       } 
//       // 3. 그 외(일반 텍스트 등)는 Tiptap 구조로 래핑
//       else {
//         contentJson = {
//           type: 'doc',
//           content: [{ 
//             type: 'paragraph', 
//             content: [{ type: 'text', text: String(descriptionData) }] 
//           }]
//         };
//       }

//       // HTML 변환 실행 (RENDER_EXTENSIONS는 컴포넌트 외부에서 정의된 것 사용)
//       return generateHTML(contentJson, RENDER_EXTENSIONS);

//     } catch (e) {
//       console.error("Failed to process description:", e);
//       // 에러 발생 시 사용자에게 안전한 폴백(Fallback) UI 제공
//       return `<p>${typeof descriptionData === 'string' ? descriptionData : '내용을 불러올 수 없습니다.'}</p>`;
//     }
//   }, [media?.description]);

//   // ✅ 훅 선언이 끝난 뒤에 가드
//   if (!open || !media) return null;

//   const ytId = (url = '') => {
//     const m =
//       url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/) ||
//       url.match(/[?&]v=([A-Za-z0-9_-]{6,})/) ||
//       url.match(/\/embed\/([A-Za-z0-9_-]{6,})/);
//     return m ? m[1] : null;
//   };

//   return (
//     <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
//       <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
//         <div className="p-5 border-b">
//           <div className="flex items-center justify-between">
//             <h3 className="text-xl font-semibold">{media.title}</h3>
//             <button onClick={onClose} className="text-gray-500 hover:text-gray-800">닫기</button>
//           </div>
//           <div className="text-sm text-gray-500 mt-1 flex gap-4">
//             <span className="flex items-center gap-1"><Tag size={14} /> {media.category}</span>
//             {media.eventDate && (
//               <span className="flex items-center gap-1"><Calendar size={14} /> {media.eventDate}</span>
//             )}
//           </div>
//         </div>
//         <div className="p-5">
//           {renderedDescription && (
//             <div 
//               className="mb-4 p-4 bg-gray-50 rounded-lg prose max-w-full"
//               dangerouslySetInnerHTML={{ __html: renderedDescription }} 
//             />
//           )}
//         </div>
//         <div className="p-5">
//           {isImage && images.length > 0 && (
//             <>
//               <div className="relative">
//                 <img src={images[idx]} alt="" className="w-full max-h-[60vh] object-contain rounded-lg" />
//                 {images.length > 1 && (
//                   <>
//                     <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded">‹</button>
//                     <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded">›</button>
//                   </>
//                 )}
//               </div>
//               {images.length > 1 && (
//                 <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-4">
//                   {images.map((u, i) => (
//                     <button key={u + i} onClick={() => setIdx(i)} className={`border rounded overflow-hidden ${i === idx ? 'ring-2 ring-blue-500' : ''}`}>
//                       <img src={u} className="w-full h-20 object-cover" alt="" />
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </>
//           )}

//           {isVideo && (
//             <div className="w-full aspect-video">
//               {ytId(media.mediaUrl || media.media_url) ? (
//                 <iframe
//                   className="w-full h-full rounded-lg"
//                   src={`https://www.youtube.com/embed/${ytId(media.mediaUrl || media.media_url)}`}
//                   title={media.title}
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                 />
//               ) : (
//                 <video src={media.mediaUrl || media.media_url} className="w-full h-full rounded-lg" controls />
//               )}
//             </div>
//           )}

//           {!isImage && !isVideo && <div className="text-center text-gray-500 py-16">지원하지 않는 미디어입니다.</div>}
//         </div>
//       </div>
//     </div>
//   );
// }


export default function PhotosPage() {
  const query = useQuery();
  const activeCategory = query.get('category') || '전체';
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [modalOpen, setModalOpen] = useState(false);
  //const [modalItem, setModalItem] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const qs = new URLSearchParams({
        sort: 'display_order,-event_date,-created_at',
        limit: '60',
      });

      // '전체'일 때는 category 파라미터를 보내지 않음
      if (activeCategory && activeCategory !== '전체') qs.set('category', activeCategory);

      const res = await fetch(`/api/media?${qs.toString()}`, { headers: baseHeaders() });
      const data = await res.json();
      const list = Array.isArray(data.items) ? data.items.map(normalize) : [];
      setItems(list);
      setLoading(false);
    })();
  }, [activeCategory]);

  //const open = (m) => { setModalItem(m); setModalOpen(true); };
  //const close = () => { setModalOpen(false); setModalItem(null); };

  return (
    <>
      <Header />
      <main className="pt-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">활동사진</h1>
            <p className="text-lg text-gray-600">메이크원의 생생한 현장</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12 px-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={createPageUrl(`Photos?category=${encodeURIComponent(cat)}`)}
                className={`px-6 py-3 rounded-full font-medium text-sm md:text-base transition-all duration-300 shadow-sm hover:shadow-md ${
                  activeCategory === cat
                    ? 'text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
                style={{ backgroundColor: activeCategory === cat ? '#2962FF' : undefined }}
              >
                {cat}
              </Link>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-t-2xl" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((m) => (
                <button
                  key={m.id}
                  onClick={() => navigate(`/Photos/${m.id}`)}
                  className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 text-left"
                >
                  <div className="relative aspect-video overflow-hidden">
                    {m.thumbnailUrl ? (
                      <img
                        src={m.thumbnailUrl}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 grid place-items-center">
                        {m.mediaType === 'video' ? (
                          <PlayCircle className="w-12 h-12 text-gray-500" />
                        ) : (
                          <Camera className="w-7 h-7 text-gray-400" />
                        )}
                      </div>
                    )}
                    {m.mediaType === 'video' && (
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 grid place-items-center">
                        <PlayCircle className="w-14 h-14 text-white drop-shadow" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{m.title}</h3>
                    <div className="flex items-center text-gray-500 text-sm gap-4">
                      <span className="flex items-center gap-1.5"><Tag size={14} /> {m.category}</span>
                      {m.eventDate && (
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} /> {m.eventDate}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* <MediaModal open={modalOpen} onClose={close} media={modalItem} /> */}
      <Footer />
    </>
  );
}