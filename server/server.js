import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reviewsRouter from './routes/reviews.js';
import contactRouter from './routes/contact.js';
import uploadRouter from './routes/uploads.js';
import mediaRouter from './routes/media.js';
import filesRouter from './routes/files.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8765;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';

app.set('trust proxy', true); // x-forwarded-for 사용
app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
//업로드 파일 정적 제공
app.use('/api/uploads', express.static('uploads'));

app.get('/api/health', (_,res)=>res.json({ ok:true }));

//라우터 등록
app.use('/api/reviews', reviewsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/uploads', uploadRouter);
app.use('/api/media', mediaRouter);
app.use("/api/files", filesRouter);

// 404
app.use((_,res)=>res.status(404).json({ ok:false, error:'not_found' }));

app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));


