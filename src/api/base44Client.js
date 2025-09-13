// Check if we're in development mode - 강화된 로컬 개발 환경 감지
const isDevelopment = import.meta.env.DEV || 
  (typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('localhost') ||
    window.location.port === '5173'
  ));

// Development mode: Create a mock client to avoid authentication issues
export const base44 = isDevelopment ? {
  entities: {
    Contact: {
      create: () => Promise.resolve({ id: 'mock-contact' }),
      findMany: () => Promise.resolve([]),
      findUnique: () => Promise.resolve(null),
      update: () => Promise.resolve({ id: 'mock-contact' }),
      delete: () => Promise.resolve({ id: 'mock-contact' })
    },
    Photo: {
      create: () => Promise.resolve({ id: 'mock-photo' }),
      findMany: () => Promise.resolve([]),
      findUnique: () => Promise.resolve(null),
      update: () => Promise.resolve({ id: 'mock-photo' }),
      delete: () => Promise.resolve({ id: 'mock-photo' }),
      filter: () => Promise.resolve([
        { id: 1, title: '열정의 순간', imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1935', category: '체육대회', eventDate: '2023-10-15' },
        { id: 2, title: '함께 웃는 우리', imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070', category: '팀빌딩', eventDate: '2023-09-20' },
        { id: 3, title: '화려한 무대', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974', category: '축제', eventDate: '2023-08-05' },
        { id: 4, title: '따뜻한 나눔', imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070', category: '공식행사', eventDate: '2023-11-25' },
        { id: 5, title: '비즈니스 미팅', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070', category: '기업행사', eventDate: '2023-05-12' },
        { id: 6, title: '창의적 워크샵', imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071', category: '팀빌딩', eventDate: '2023-07-18' }
      ]),
      list: () => Promise.resolve([
        { id: 1, title: '열정의 순간', imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1935', category: '체육대회', eventDate: '2023-10-15' },
        { id: 2, title: '함께 웃는 우리', imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070', category: '팀빌딩', eventDate: '2023-09-20' },
        { id: 3, title: '화려한 무대', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974', category: '축제', eventDate: '2023-08-05' },
        { id: 4, title: '따뜻한 나눔', imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070', category: '공식행사', eventDate: '2023-11-25' },
        { id: 5, title: '비즈니스 미팅', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070', category: '기업행사', eventDate: '2023-05-12' },
        { id: 6, title: '창의적 워크샵', imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071', category: '팀빌딩', eventDate: '2023-07-18' }
      ]),
      bulkCreate: () => Promise.resolve([])
    },
    Review: {
      create: () => Promise.resolve({ id: 'mock-review' }),
      findMany: () => Promise.resolve([]),
      findUnique: () => Promise.resolve(null),
      update: () => Promise.resolve({ id: 'mock-review' }),
      delete: () => Promise.resolve({ id: 'mock-review' }),
      filter: () => Promise.resolve([]),
      list: () => Promise.resolve([
        { 
          id: 1, 
          author: '박상설', 
          rating: 5, 
          content: '연예인들과 함게하는 행사가 너무 자연스럽고 즐거웠습니다.', 
          eventType: '연예인행사', 
          created_date: '2025-08-28T00:00:00Z',
          likes_count: 0,
          reports_count: 0,
          image_urls: []
        },
        { 
          id: 2, 
          author: '김상호', 
          rating: 5, 
          content: '정말 보는내내 웃음이 끊이질 않았습니당', 
          eventType: '연예인행사', 
          created_date: '2025-08-26T00:00:00Z',
          likes_count: 0,
          reports_count: 0,
          image_urls: []
        }
      ])
    },
    ReviewLike: {
      create: () => Promise.resolve({ id: 'mock-like' }),
      findMany: () => Promise.resolve([]),
      findUnique: () => Promise.resolve(null),
      update: () => Promise.resolve({ id: 'mock-like' }),
      delete: () => Promise.resolve({ id: 'mock-like' }),
      filter: () => Promise.resolve([]),
      list: () => Promise.resolve([])
    },
    ReviewReport: {
      create: () => Promise.resolve({ id: 'mock-report' }),
      findMany: () => Promise.resolve([]),
      findUnique: () => Promise.resolve(null),
      update: () => Promise.resolve({ id: 'mock-report' }),
      delete: () => Promise.resolve({ id: 'mock-report' }),
      filter: () => Promise.resolve([]),
      list: () => Promise.resolve([])
    },
    Media: {
      create: () => Promise.resolve({ id: 'mock-media' }),
      findMany: () => Promise.resolve([]),
      findUnique: () => Promise.resolve(null),
      update: () => Promise.resolve({ id: 'mock-media' }),
      delete: () => Promise.resolve({ id: 'mock-media' })
    }
  },
  auth: {
    login: () => Promise.resolve({ user: { id: 'mock-user' } }),
    logout: () => Promise.resolve(),
    getCurrentUser: () => Promise.resolve({ id: 'mock-user', name: 'Mock User' }),
    me: () => Promise.resolve({ id: 'mock-user', name: 'Mock User', email: 'mock@example.com', full_name: 'Mock User' })
  },
  integrations: {
    Core: {
      InvokeLLM: () => Promise.resolve({ response: 'Mock LLM response' }),
      SendEmail: () => Promise.resolve({ success: true }),
      UploadFile: () => Promise.resolve({ url: 'mock-url' }),
      GenerateImage: () => Promise.resolve({ url: 'mock-image-url' }),
      ExtractDataFromUploadedFile: () => Promise.resolve({ data: {} }),
      CreateFileSignedUrl: () => Promise.resolve({ url: 'mock-signed-url' }),
      UploadPrivateFile: () => Promise.resolve({ url: 'mock-private-url' })
    }
  }
} : (() => {
  // Production mode: Use real base44 SDK
  const { createClient } = require('@base44/sdk');
  return createClient({
    appId: "68ad8266d3f7a3e6710e5720", 
    requiresAuth: true
  });
})();
