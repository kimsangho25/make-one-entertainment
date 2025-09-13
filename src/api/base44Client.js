// Check if we're in development mode
const isDevelopment = import.meta.env.DEV || (typeof window !== 'undefined' && window.location.hostname === 'localhost');

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
      delete: () => Promise.resolve({ id: 'mock-photo' })
    },
    Review: {
      create: () => Promise.resolve({ id: 'mock-review' }),
      findMany: () => Promise.resolve([]),
      findUnique: () => Promise.resolve(null),
      update: () => Promise.resolve({ id: 'mock-review' }),
      delete: () => Promise.resolve({ id: 'mock-review' })
    },
    ReviewLike: {
      create: () => Promise.resolve({ id: 'mock-like' }),
      findMany: () => Promise.resolve([]),
      findUnique: () => Promise.resolve(null),
      update: () => Promise.resolve({ id: 'mock-like' }),
      delete: () => Promise.resolve({ id: 'mock-like' })
    },
    ReviewReport: {
      create: () => Promise.resolve({ id: 'mock-report' }),
      findMany: () => Promise.resolve([]),
      findUnique: () => Promise.resolve(null),
      update: () => Promise.resolve({ id: 'mock-report' }),
      delete: () => Promise.resolve({ id: 'mock-report' })
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
    getCurrentUser: () => Promise.resolve({ id: 'mock-user', name: 'Mock User' })
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
