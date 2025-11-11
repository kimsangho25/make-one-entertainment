import React, { useState, useEffect, useRef, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Image as ImageIcon, Video, Check, Trash2, Pencil, Plus, Tag, Calendar, X, Loader2, Play, Pause, Link as LinkIcon } from 'lucide-react';
import { getClientId } from '@/lib/clientId';

// 로컬/운영 전환은 VITE_BACKEND_BASE 로
const API = import.meta.env.VITE_BACKEND_BASE || 'http://1.224.178.190:5173';

const baseHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Client-Id': getClientId(),
});

const CATEGORIES = ['기업행사', '연예인행사', '팀빌딩', '체육대회', '축제', '공식행사', '영어행사'];
// 간단 스피너 (Loader2 이슈 대체)
const Spinner = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 animate-spin">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" />
    <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" fill="none" />
  </svg>
);

// YYYY-MM-DD
const fmtDate = (v) => {
  if (!v) return '';
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    return new Date(v).toISOString().slice(0, 10);
  } catch {
    return String(v).split('T')[0] || '';
  }
};

export default function AdminPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // form
  const [editing, setEditing] = useState(null); // row or null
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [mediaType, setMediaType] = useState('image'); // image | video
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);

  // 이미지형
  const [imageUrls, setImageUrls] = useState([]); // string[]
  const [imgUploading, setImgUploading] = useState(false);

  // 영상형
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoUploading, setVideoUploading] = useState(false);

  const isEdit = Boolean(editing);

  async function load() {
    setLoading(true);
    const qs = new URLSearchParams({ sort: 'display_order,-event_date,-created_at', limit: '100' });
    const res = await fetch(`${API}/api/media?${qs.toString()}`, { headers: baseHeaders() });
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];
    setList(items);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setEditing(null);
    setTitle('');
    setCategory('');
    setEventDate('');
    setMediaType('image');
    setDescription('');
    setDisplayOrder(1);
    setImageUrls([]);
    setYoutubeUrl('');
    setVideoFile(null);
  };

  const startEdit = (row) => {
    setEditing(row);
    setTitle(row.title || '');
    setCategory(row.category || '');
    // 날짜는 YYYY-MM-DD로
    const rawDate = row.eventDate ?? row.event_date ?? '';
    const fmtDate = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(v) ? v : (v ? new Date(v).toISOString().slice(0, 10) : ''));
    setEventDate(fmtDate(rawDate));

    const mt = row.mediaType || row.media_type || 'image';
    setMediaType(mt);
    setDescription(row.description || '');
    setDisplayOrder(row.displayOrder || row.display_order || 0);

    // ✅ image_urls / imageUrls 모두 대응
    const imgs = row.image_urls ?? row.imageUrls ?? [];
    setImageUrls(Array.isArray(imgs) ? imgs.filter(Boolean) : []);

    // ✅ media_url / mediaUrl 모두 대응
    setYoutubeUrl(mt === 'video' ? ((row.mediaUrl ?? row.media_url) || '') : '');
    setVideoFile(null);
  };

  const remove = async (id) => {
    if (!confirm('삭제하시겠습니까?')) return;
    const res = await fetch(`${API}/api/media/${id}`, { method: 'DELETE', headers: baseHeaders() });
    if (!res.ok) { alert('삭제 실패'); return; }
    await load();
    if (editing?.id === id) resetForm();
  };

  // 이미지 다중 업로드
  const onPickImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImgUploading(true);
    try {
      const uploaded = [];
      for (const f of files) {
        const form = new FormData();
        form.append('file', f);
        const r = await fetch(`${API}/api/uploads`, {
          method: 'POST',
          headers: { 'X-Client-Id': getClientId() },
          body: form,
        });
        if (!r.ok) throw new Error('upload_failed');
        const { file_url } = await r.json();
        if (file_url) uploaded.push(file_url);
      }
      setImageUrls((prev) => [...prev, ...uploaded].slice(0, 10));
    } catch (e) {
      console.error(e);
      alert('이미지 업로드 실패');
    } finally {
      setImgUploading(false);
      e.target.value = '';
    }
  };

  // 영상 파일 업로드(선택)
  const onPickVideo = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setVideoUploading(true);
    try {
      const form = new FormData();
      form.append('file', f);
      const r = await fetch(`${API}/api/uploads`, {
        method: 'POST',
        headers: { 'X-Client-Id': getClientId() },
        body: form,
      });
      if (!r.ok) throw new Error('upload_failed');
      const { file_url } = await r.json();
      setVideoFile({ name: f.name, url: file_url, size: f.size, type: f.type });
    } catch (e) {
      console.error(e);
      alert('영상 업로드 실패');
    } finally {
      setVideoUploading(false);
      e.target.value = '';
    }
  };

  // 저장
  const submit = async () => {
    if (!title || !category || !mediaType) { alert('필수값 누락'); return; }

    const payload = {
      title,
      category,
      eventDate: eventDate || null,
      description: description || null,
      mediaType,
      displayOrder: Number(displayOrder) || 0,
      ...(mediaType === 'image'
        ? { image_urls: imageUrls } // 서버는 image_urls 기대
        : { mediaUrl: (youtubeUrl?.trim() || videoFile?.url || '') }
      ),
    };

    if (mediaType === 'image' && (!imageUrls || imageUrls.length === 0)) {
      alert('이미지를 최소 1장 업로드하세요'); return;
    }
    if (mediaType === 'video' && !payload.mediaUrl) {
      alert('유튜브 URL 또는 영상 파일을 업로드하세요'); return;
    }

    const url = isEdit ? `${API}/api/media/${editing.id}` : `${API}/api/media`;
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, { method, headers: baseHeaders(), body: JSON.stringify(payload) });
    if (!res.ok) { alert('저장 실패'); return; }
    await load();
    resetForm();
  };

  const filtered = useMemo(() => list, [list]);

  return (
    <>
      <Header />
      <main className="pt-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-8">미디어 관리자</h1>

          {/* 목록 */}
          <div className="bg-white rounded-2xl shadow p-6 mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">목록</h2>
              <Button onClick={resetForm} variant="outline">
                <Plus className="w-4 h-4 mr-1" />새로 만들기
              </Button>
            </div>

            {loading ? (
              <div className="text-gray-500 py-10">로딩 중...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((m) => {
                  const imgs = Array.isArray(m.image_urls) ? m.image_urls : (Array.isArray(m.imageUrls) ? m.imageUrls : []);
                  const thumb = (imgs[0]) || m.thumbnailUrl || '';
                  return (
                    <div key={m.id} className="border rounded-xl overflow-hidden bg-white">
                      <div className="relative aspect-video bg-gray-100">
                        {thumb ? (
                          <img src={thumb} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full grid place-items-center text-gray-400">
                            {(m.media_type === 'video' || m.mediaType === 'video') ? <Video className="w-10 h-10" /> : <ImageIcon className="w-10 h-10" />}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="font-semibold line-clamp-1">{m.title}</div>
                        <div className="text-sm text-gray-500 flex gap-4 mt-1">
                          <span className="flex items-center gap-1"><Tag size={14} />{m.category}</span>
                          {m.event_date || m.eventDate ? (
                            <span className="flex items-center gap-1"><Calendar size={14} />{fmtDate(m.eventDate || m.event_date)}</span>
                          ) : null}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" onClick={() => startEdit(m)}>
                            <Pencil className="w-4 h-4 mr-1" />수정
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => remove(m.id)}>
                            <Trash2 className="w-4 h-4 mr-1" />삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 폼 */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{isEdit ? '수정' : '신규 등록'}</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">카테고리</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="선택하세요" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">제목</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">행사 날짜</label>
                <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">정렬 우선순위(높을수록 앞)</label>
                <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">설명(옵션)</label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="설명" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">미디어 유형</label>
                <Select value={mediaType} onValueChange={(v) => { setMediaType(v); /* 이미지/영상 값 보존 */ }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">이미지</SelectItem>
                    <SelectItem value="video">영상</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 이미지형 */}
              {mediaType === 'image' && (
                <div className="md:col-span-2 space-y-3">
                  <label className="block text-sm font-medium">이미지 업로드(여러 장 가능, 최대 10개)</label>
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 border rounded cursor-pointer hover:bg-gray-50 inline-flex items-center gap-2">
                      <Upload className="w-4 h-4" /> 파일 선택
                      <input type="file" multiple accept="image/*" onChange={onPickImages} className="hidden" />
                    </label>
                    {imgUploading && <span className="text-sm text-gray-500"><Spinner /> 업로드 중…</span>}
                  </div>
                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {imageUrls.map((u, i) => (
                        <div key={u + i} className="relative">
                          <img src={u} className="w-full h-24 object-cover rounded border" />
                          <button
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white"
                            onClick={() => setImageUrls((prev) => prev.filter((_, idx) => idx !== i))}
                          >×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 영상형 */}
              {mediaType === 'video' && (
                <div className="md:col-span-2 space-y-3">
                  <label className="block text-sm font-medium">유튜브 URL 또는 영상 파일 업로드(둘 중 하나)</label>
                  <Input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 border rounded cursor-pointer hover:bg-gray-50 inline-flex items-center gap-2">
                      <Video className="w-4 h-4" /> 영상 파일 업로드
                      <input type="file" accept="video/*" onChange={onPickVideo} className="hidden" />
                    </label>
                    {videoUploading && <span className="text-sm text-gray-500"><Spinner /> 업로드 중…</span>}
                  </div>
                  {videoFile && <div className="text-sm text-gray-600">파일: {videoFile.name}</div>}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={submit} className="bg-blue-600 hover:bg-blue-700">
                {isEdit ? '수정 저장' : '등록'}
              </Button>
              <Button onClick={resetForm} variant="outline">초기화</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}