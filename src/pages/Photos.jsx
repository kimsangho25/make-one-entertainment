
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Photo } from '@/api/entities';
import { createPageUrl } from '@/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Camera, Tag, Calendar } from 'lucide-react';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = useQuery();
  const activeCategory = query.get('category') || '기업행사';

  const categories = ["기업행사", "연예인행사", "팀빌딩", "체육대회", "축제", "공식행사", "영어행사"];

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      const filter = { category: activeCategory };
      const fetchedPhotos = await Photo.filter(filter, '-created_date', 9);
      setPhotos(fetchedPhotos);
      setLoading(false);
    };
    fetchPhotos();
  }, [activeCategory]);

  // 더미 데이터 추가
  useEffect(() => {
    Photo.list().then(existingPhotos => {
      if (existingPhotos.length === 0) {
        const dummyPhotos = [
          { title: '열정의 순간', imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1935', category: '체육대회', eventDate: '2023-10-15' },
          { title: '함께 웃는 우리', imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070', category: '팀빌딩', eventDate: '2023-09-20' },
          { title: '화려한 무대', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974', category: '축제', eventDate: '2023-08-05' },
          { title: '따뜻한 나눔', imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070', category: '공식행사', eventDate: '2023-11-25' },
          { title: '비즈니스 미팅', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070', category: '기업행사', eventDate: '2023-05-12' },
        ];
        Photo.bulkCreate(dummyPhotos);
      }
    });
  }, []);

  return (
    <>
      <Header />
      <main className="pt-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">활동사진</h1>
            <p className="text-lg text-gray-600">메이크원의 생생한 활동 모습을 사진으로 만나보세요.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12 px-4">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={createPageUrl(`Photos?category=${cat}`)}
                className={`px-6 py-3 rounded-full font-medium text-sm md:text-base transition-all duration-300 shadow-sm hover:shadow-md ${
                  activeCategory === cat
                    ? 'text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
                style={{
                  backgroundColor: activeCategory === cat ? '#2962FF' : undefined
                }}
              >
                {cat}
              </Link>
            ))}
          </div>

          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {Array.from({ length: 6 }).map((_, i) => (
                 <div key={i} className="bg-white rounded-2xl shadow-md animate-pulse">
                   <div className="aspect-video bg-gray-200 rounded-t-2xl"></div>
                   <div className="p-6 space-y-4">
                     <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                     <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                   </div>
                 </div>
               ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {photos.map(photo => (
                <div key={photo.id} className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-video overflow-hidden">
                    <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{photo.title}</h3>
                    <div className="flex items-center text-gray-500 text-sm gap-4">
                      <span className="flex items-center gap-1.5"><Tag size={14} /> {photo.category}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={14} /> {photo.eventDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
