import React, { useState, useEffect, useCallback } from 'react';
// import { Review } from '@/api/entities';
// import { ReviewLike } from '@/api/entities';
// import { ReviewReport } from '@/api/entities';
// import { User } from '@/api/entities';
// import { UploadFile } from '@/api/integrations';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Star, MessageSquare, Plus, Filter, Calendar, Edit2, Trash2, X, Heart, Flag, Camera, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { getClientId } from '@/lib/clientId';

const baseHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Client-Id': getClientId(),
});

// 스크롤을 페이지 최상단으로 이동시키는 함수
const scrollToTop = () => {
    // window.scrollTo(x, y)를 사용하여 (0, 0) 좌표로 이동
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // 부드럽게 이동 (선택 사항)
    });
};

// 안전하게 줄바꿈을 <br /> 태그로 변환하는 함수
const formatContentForDisplay = (text) => {
    if (!text) return null;
    
    // 텍스트를 '\n' 기준으로 분리하여 배열로 만듭니다.
    return text.split('\n').map((item, index) => (
        // 각 줄을 React Fragment로 감쌉니다.
        <React.Fragment key={index}>
            {item}
            {/* 마지막 줄이 아닌 경우에만 <br /> 태그를 추가합니다. */}
            {index < text.split('\n').length - 1 && <br />}
        </React.Fragment>
    ));
};

// UI
const StarRating = ({ rating, setRating, readOnly = false }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-5 h-5 transition-colors cursor-pointer ${
          rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
        onClick={() => !readOnly && setRating(star)}
        style={{ cursor: readOnly ? 'default' : 'pointer' }}
      />
    ))}
  </div>
);


const ImageUpload = ({ images, setImages, uploading, setUploading }) => {
  // 이미지 배열 타입 안전성 확보 및 null 값 필터링
  const safeImages = Array.isArray(images)
    ? images.filter(img => img && typeof img === 'string')
    : (images && typeof images === 'string' ? [images] : []);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      // 최대 5장 제한
      const remain = Math.max(0, 5 - safeImages.length);
      const toUpload = files.slice(0, remain);

      const uploadedUrls = await Promise.all(
        toUpload.map(async (file) => {
          const form = new FormData();
          form.append('file', file);

          const res = await fetch(`/api/uploads`, {
            method: 'POST',
            headers: {
              'X-Client-Id': getClientId(),
            },
            body: form,
          });
          if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`upload_failed: ${res.status} ${text}`);
          }
          const data = await res.json();
          if (!data?.file_url) throw new Error('no_file_url_in_response');
          return data.file_url;
        })
      );
      
      const next = [...safeImages, ...uploadedUrls].slice(0, 5);
      setImages(next);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setUploading(false);
      // 같은 파일 다시 선택할 수 있게 input 값 초기화
      if (e?.target) e.target.value = '';
    }
  };

  const removeImage = (index) => {
    const next = safeImages.filter((_, i) => i !== index);
    setImages(next);
  };

  return (
    <div className="space-y-4">
      {/* 파일 선택 버튼 */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <Camera className="w-4 h-4" />
          <span className="text-sm">이미지 첨부</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading || safeImages.length >= 5}
          />
        </label>

        {uploading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>업로드 중...</span>
          </div>
        )}
      </div>

      {/* 업로드된 이미지 미리보기 */}
      {safeImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {safeImages.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`업로드된 이미지 ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500">
        최대 5장까지 업로드 가능합니다. (JPG, PNG, GIF) - 현재 {safeImages.length}/5
      </p>
    </div>
  );
};

const ReviewImages = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // 이미지 배열 타입 안전성 확보 및 null 값 필터링
  const safeImages = Array.isArray(images)
    ? images.filter(img => img && typeof img === 'string')
    : (images && typeof images === 'string' ? [images] : []);

  if (safeImages.length === 0) return null;

  return (
    <>
      <div className="mt-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {safeImages.map((url, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage(url)}
            >
              <img
                src={url}
                alt={`리뷰 이미지 ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 이미지 확대 모달 */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="확대된 리뷰 이미지"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason) return;
    onSubmit({ reason, details });
    setReason('');
    setDetails('');
    onClose();
  };

  

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">리뷰 신고하기</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">신고 사유</label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="신고 사유를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inappropriate">부적절한 내용</SelectItem>
                <SelectItem value="spam">스팸</SelectItem>
                <SelectItem value="false_info">거짓 정보</SelectItem>
                <SelectItem value="offensive">욕설/비방</SelectItem>
                <SelectItem value="other">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">상세 내용 (선택사항)</label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="신고 사유를 자세히 설명해주세요"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              신고하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ReviewCard = ({ review, isOwner, hasLiked, onEdit, onDelete, onLike, onReport }) => {

  const handleDelete = () => {
      onDelete(review.id);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* 상단: 유저 정보와 별점 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {(review.author || 'U').charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{review.author}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(review.created_at).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StarRating rating={review.rating} readOnly />
          <span className="text-sm font-medium text-gray-700">({review.rating}.0)</span>

          {/* 수정/삭제 버튼 - 작성자에게만 표시 */}
          {isOwner && (
            <div className="flex gap-1 ml-3">
              <button
                onClick={() => onEdit(review)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="리뷰 수정"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="리뷰 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 중간: 참여 행사 */}
      {review.eventType && (
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {review.eventType}
          </span>
        </div>
      )}

      {/* 하단: 리뷰 내용 */}
      <p className="text-gray-700 leading-relaxed text-base mb-4">
        {formatContentForDisplay(review.content)}
      </p>

      {/* 첨부된 이미지들 */}
      <ReviewImages images={review.image_urls} />

      {/* 좋아요/신고 버튼 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
        <button
          onClick={() => onLike(review.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            hasLiked ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`} 
        >
          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">
            좋아요 {review.likes_count || 0}
          </span>
        </button>

        <button
          onClick={() => onReport(review.id)}
          disabled={isOwner}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={isOwner ? '본인 리뷰는 신고할 수 없습니다' : ''}
        >
          <Flag className="w-4 h-4" />
          <span className="text-sm">신고</span>
        </button>
      </div>
    </div>
  );
};

export default function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [sortBy, setSortBy] = useState('latest');
  const [userLikes, setUserLikes] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingReviewId, setReportingReviewId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [avgRating, setAvgRating] = useState(0); // 평균 별점
  const LIMIT = 20; // 페이지당 항목 수

  const [newReview, setNewReview] = useState({
    rating: 5,
    content: '',
    eventType: '',
    author: '',
    image_urls: []
  });

  const OWNED_KEY = 'my_owned_review_ids';
  const [ownedIds, setOwnedIds] = useState(() => {
    try {
      const raw = localStorage.getItem(OWNED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const saveOwned = (ids) => {
    setOwnedIds(ids);
    try { localStorage.setItem(OWNED_KEY, JSON.stringify(ids)); } catch {}
  };

  // load 함수를 loadReviews로 변경하고 페이지네이션 로직 적용
  const loadReviews = useCallback(async (page = 1, currentSortBy) => {
    const sortParam = (currentSortBy || sortBy) === 'latest' ? '-created_at' : (currentSortBy || sortBy);
    
    // API 호출 시 페이지 및 정렬 정보 포함
    const [listRes, likeRes] = await Promise.all([
        // limit을 LIMIT(20)으로 고정, page는 인수로 받음, sort는 상태나 인수로 받음
        fetch(`/api/reviews?sort=${sortParam}&page=${page}&limit=${LIMIT}`),
        fetch(`/api/reviews/likes/me`, { headers: baseHeaders()}),
    ]);
    
    if (!listRes.ok) throw new Error("list_failed");
    if (!likeRes.ok) throw new Error("like_failed");
    
    const list = await listRes.json(); // 응답 구조: { items: [...], meta: {...} }
    const liked = await likeRes.json();
    
    // 응답 구조 변경 처리 및 상태 업데이트
    const newReviews = Array.isArray(list.items) ? list.items : [];
    const meta = list.meta || {};
    
    setReviews(newReviews);
    setUserLikes(Array.isArray(liked) ? liked : []);
    
    // 페이지네이션 및 통계 상태 업데이트
    setTotalCount(meta.total_count || 0);
    setAvgRating(parseFloat(meta.average_rating) || 0);
    setTotalPages(meta.total_pages || 1);
    setCurrentPage(meta.current_page || 1);
    
    //페이지 로딩 완료 후 스크롤 최상단으로 이동
    scrollToTop();
  }, [sortBy]); // sortBy가 변경될 때마다 함수 재생성

  useEffect(() => {
    // 마운트 시 또는 sortBy 변경 시 1페이지 로드
    loadReviews(1, sortBy).catch((e) => {
      console.error(e);
      alert('리뷰 로드 실패');
    });
  }, [loadReviews, sortBy]); // loadReviews와 sortBy에 의존

  // useEffect(() => {
  //   load().catch((e) => {
  //     console.error(e);
  //     alert('리뷰 로드 실패');
  //   });
  // }, []);

  // async function load() {
  //   const [listRes, likeRes] = await Promise.all([
  //     fetch(`/api/reviews?sort=-created_at&page=1&limit=20`),
  //     fetch(`/api/reviews/likes/me`, { headers: baseHeaders()}),
  //   ]);
  //   if (!listRes.ok) throw new Error("list_failed");
  //   if (!likeRes.ok) throw new Error("like_failed");
  //   const list = await listRes.json();
  //   const liked = await likeRes.json();
  //   setReviews(Array.isArray(list.items) ? list.items : []);
  //   setUserLikes(Array.isArray(liked) ? liked : []);
  // }

  const handleLike = async (reviewId) => {
    const already = userLikes.includes(reviewId);
    const res = await fetch(`/api/reviews/${reviewId}/likes`, {
      method: already ? 'DELETE' : 'POST',
      headers: baseHeaders(),
    });
    if (!res.ok) {
      alert('좋아요 처리 실패');
      return;
    }
    await loadReviews(currentPage); // 현재 페이지 유지
  };

  // const handleLike = async (reviewId) => {
  //   const already = userLikes.includes(reviewId);
  //   const res = await fetch(`/api/reviews/${reviewId}/likes`, {
  //     method: already ? 'DELETE' : 'POST',
  //     headers: baseHeaders(),
  //   });
  //   if (!res.ok) {
  //     alert('좋아요 처리 실패');
  //     return;
  //   }
  //   await load();
  // };

  const handleReport = (reviewId) => {
    setReportingReviewId(reviewId);
    setShowReportModal(true);
  };

  const handleSubmitReport = async ({reason, details}) => {
    if (!reportingReviewId) return;
    const res = await fetch(`/api/reviews/${reportingReviewId}/reports`, {
      method: 'POST',
      headers: baseHeaders(),
      body: JSON.stringify({ reason, details }),
    });
    if (!res.ok) {
      alert('리뷰 신고 실패');
      return;
    }
    alert('신고가 접수되었습니다.');
    setShowReportModal(false);
    setReportingReviewId(null);
    await loadReviews(currentPage); // 현재 페이지 유지
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.content || !newReview.author) return;

    try {
      // 이미지 배열 안전성 확보 및 null 값 필터링
      const safeImageUrls = Array.isArray(newReview.image_urls)
        ? newReview.image_urls.filter(url => url && typeof url === 'string')
        : [];

      console.log('submit payload', {
        ...newReview,
        images_urls: newReview.image_urls,
      });
      if (editingReview) {
        // 리뷰 수정
        const res = await fetch(`/api/reviews/${editingReview.id}`, {
          method: 'PATCH',
          headers: baseHeaders(),
          body: JSON.stringify({
            author: newReview.author,
            rating: newReview.rating,
            content: newReview.content,
            eventType: newReview.eventType,
            eventDate: new Date().toISOString().slice(0,10),
            image_urls: safeImageUrls,
          }),
        });
        if (!res.ok) {
          alert("리뷰 수정 실패");
          return;
        }
      } else {
        const res = await fetch(`/api/reviews`, {
          method: 'POST',
          headers: baseHeaders(),
          body: JSON.stringify({
            author: newReview.author,
            rating: newReview.rating,
            content: newReview.content,
            eventType: newReview.eventType,
            eventDate: new Date().toISOString().slice(0,10),
            image_urls: safeImageUrls,
          }),
        });
        if (!res.ok) {
          alert("리뷰 저장 실패");
          return;
        }
        const data = await res.json(); // {ok: true, id}
        if (data?.id) {
          const next = Array.from(new Set([...(ownedIds || []), data.id]));
          saveOwned(next);
        }
      }

      setShowForm(false);
      setEditingReview(null);
      setNewReview({ rating: 5, content: '', eventType: '', author: '', image_urls: [] });
      await loadReviews(editingReview ? currentPage : 1); // 작성은 1페이지, 수정은 현재 페이지 유지
    } catch (error) {
      console.error('리뷰 저장 실패:', error);
      alert('리뷰 저장에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleEdit = (review) => {
    if (!ownedIds.includes(review.id)) {
      alert('본인이 작성한 리뷰만 수정할 수 있습니다.');
      return;
    }
    setEditingReview(review);
    // 이미지 배열 안전성 확보 및 null 값 필터링
    const safeImageUrls = Array.isArray(review.image_urls)
      ? review.image_urls.filter(url => url && typeof url === 'string')
      : [];

    setNewReview({
      rating: review.rating,
      content: review.content,
      eventType: review.eventType || '',
      author: review.author,
      image_urls: safeImageUrls
    });
    setShowForm(true);
  };

  const handleDelete = async (reviewId) => {
    if (!ownedIds.includes(reviewId)) {
      alert('본인이 작성한 리뷰만 삭제할 수 있습니다.');
      return;
    }
    if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: baseHeaders(),
      });
      if (!res.ok) {
        alert('리뷰 삭제 실패');
        return;
      }
      const next = (ownedIds || []).filter(id => id !== reviewId);
      saveOwned(next); // 내 소유 목록 갱신
      await loadReviews(1); // 삭제 후 1페이지로 이동
    } catch (e) {
      console.error('리뷰 삭제 실패:', e);
      alert('리뷰 삭제에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingReview(null);
    setNewReview({ rating: 5, content: '', eventType: '', author:'', image_urls: [] });
  };

  // ReviewPage 컴포넌트 안에 추가
  const resetNewReview = () => {
    setNewReview({ rating: 5, content: '', eventType: '', author: '', image_urls: [] });
  };

  const handleTopButtonClick = () => {
    if (showForm) {
      // 폼 열려있으면 닫기(수정/작성 상관없이 취소)
      setShowForm(false);
      setEditingReview(null);   // 수정 상태 해제
      resetNewReview();
    } else {
      // 폼 닫혀있으면 "새 리뷰 작성" 열기
      setEditingReview(null);   // 항상 작성 모드로
      resetNewReview();
      setShowForm(true);
    }
  };

  // const sortedReviews = [...reviews].sort((a, b) => {
  //   if (sortBy === 'latest') {
  //     return new Date(b.created_at) - new Date(a.created_at);
  //   } else if (sortBy === 'rating') {
  //     return b.rating - a.rating;
  //   } else if (sortBy === 'likes') {
  //     return (b.likes_count || 0) - (a.likes_count || 0);
  //   }
  //   return 0;
  // });
  // sortBy 상태가 변경되면 useEffect가 loadReviews를 호출하여 백엔드에서 정렬된 데이터를 가져옵니다.
  const handleSortByChange = (newSortBy) => {
      setSortBy(newSortBy);
      // setSortBy가 상태를 변경하면 useEffect가 다시 호출되면서 loadReviews(1, newSortBy)가 실행됩니다.
  };

  // 페이지네이션 UI 렌더링 함수 추가
  const renderPagination = () => {
    // totalPages가 1 이하면 페이지네이션 불필요
    if (totalPages <= 1) return null; 
    
    const pageNumbers = [];
    const maxPagesToShow = 5; // 화면에 보여줄 최대 페이지 버튼 개수

    // 페이지네이션 버튼 범위 계산 로직
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // 페이지네이션 중앙 정렬 보정 (끝 부분이 꽉 차도록)
    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

  // const averageRating = reviews.length > 0
  //   ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
  //   : 0;

  return (
        <div className="flex justify-center items-center space-x-2 pt-8 border-t border-gray-100">
            
            {/* */}
            <Button 
                onClick={() => loadReviews(1)} // 1페이지 로드
                disabled={currentPage === 1}
                variant="outline"
            >
                &lt;&lt;
            </Button>
            
            {/* 이전 버튼 */}
            <Button 
                onClick={() => loadReviews(currentPage - 1)} 
                disabled={currentPage === 1}
                variant="outline"
            >
                이전
            </Button>
            
            {/* 페이지 번호 버튼들 */}
            {pageNumbers.map(number => (
                <Button
                    key={number}
                    onClick={() => loadReviews(number)}
                    variant={number === currentPage ? 'default' : 'outline'} 
                >
                    {number}
                </Button>
            ))}

            {/* 다음 버튼 */}
            <Button 
                onClick={() => loadReviews(currentPage + 1)} 
                disabled={currentPage === totalPages}
                variant="outline"
            >
                다음
            </Button>
            
            {/* */}
            <Button 
                onClick={() => loadReviews(totalPages)} // 마지막 페이지 로드
                disabled={currentPage === totalPages}
                variant="outline"
            >
                &gt;&gt;
            </Button>
        </div>
    );
};

  return (
    <>
      <Header />
      <main className="pt-20 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 상단 헤더 섹션 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">고객 리뷰</h1>
            <p className="text-lg text-gray-600 mb-8">메이크원과 함께한 고객님들의 소중한 경험을 확인해보세요</p>

            {/* 통계 정보 */}
            <div className="flex justify-center items-center gap-8 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {/* <StarRating rating={Math.round(averageRating)} readOnly /> */}
                  <StarRating rating={Math.round(avgRating)} readOnly />
                  {/* <span className="text-2xl font-bold text-gray-900">{averageRating}</span> */}
                  <span className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-500">평균 평점</p>
              </div>
              <div className="text-center">
                {/* <div className="text-2xl font-bold text-gray-900 mb-2">{reviews.length}</div> */}
                <div className="text-2xl font-bold text-gray-900 mb-2">{totalCount}</div>
                <p className="text-sm text-gray-500">총 리뷰 수</p>
              </div>
            </div>
          </div>

          {/* 상단 액션 바 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            {/* 정렬 필터 */}
            <div className="flex items-center gap-4">
              {/* <Select value={sortBy} onValueChange={setSortBy}> */}
              <Select value={sortBy} onValueChange={handleSortByChange}>
                <SelectTrigger className="w-40 bg-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">최신순</SelectItem>
                  <SelectItem value="rating">별점 높은 순</SelectItem>
                  <SelectItem value="likes">좋아요 많은 순</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 리뷰 작성 버튼 */}
            <Button
              onClick={handleTopButtonClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? (editingReview ? '수정 취소' : '작성 취소') : '리뷰 작성하기'}
            </Button>
          </div>

          {/* 리뷰 작성/수정 폼 */}
          {showForm && (
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  {editingReview ? '리뷰 수정하기' : '리뷰 작성하기'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 별점 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">평점을 매겨주세요</label>
                  <div className="flex items-center gap-4">
                    <StarRating
                      rating={newReview.rating}
                      setRating={(r) => setNewReview({...newReview, rating: r})}
                    />
                    <span className="text-sm text-gray-500">({newReview.rating}점)</span>
                  </div>
                </div>

                {/* 작성자 이름 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">작성자 이름</label>
                  <Input
                    placeholder="이름을 입력해주세요"
                    value={newReview.author}
                    onChange={(e) => setNewReview({...newReview, author: e.target.value})}
                    required
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* 참여 행사 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">참여하신 행사</label>
                  <Select onValueChange={(v) => setNewReview({...newReview, eventType: v})} value={newReview.eventType}>
                    <SelectTrigger className="rounded-lg border-gray-300">
                      <SelectValue placeholder="참여했던 행사를 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="팀빌딩">팀빌딩</SelectItem>
                      <SelectItem value="체육대회">체육대회</SelectItem>
                      <SelectItem value="축제">축제</SelectItem>
                      <SelectItem value="연예인행사">연예인행사</SelectItem>
                      <SelectItem value="기타행사">기타행사</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 리뷰 내용 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">리뷰 내용</label>
                  <Textarea
                    placeholder="메이크원과 함께한 경험을 자세히 공유해주세요. 어떤 점이 좋았는지, 아쉬웠던 점은 무엇인지 솔직한 후기를 남겨주시면 다른 고객님들에게 도움이 됩니다."
                    value={newReview.content}
                    onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                    required
                    rows={4}
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* 이미지 첨부 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">사진 첨부</label>
                  <ImageUpload
                    images={newReview.image_urls}
                    setImages={(images) => {
                      const safeImages = Array.isArray(images)
                        ? images.filter(url => url && typeof url === 'string')
                        : [];
                      setNewReview((prev) => ({...prev, image_urls: safeImages}));
                    }}
                    uploading={uploading}
                    setUploading={setUploading}
                  />
                </div>

                {/* 버튼 */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="px-6 py-2 rounded-lg"
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
                  >
                    {uploading ? '업로드 중...' : editingReview ? '리뷰 수정' : '리뷰 등록'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* 리뷰 목록 */}
          <div className="space-y-6">
            {(reviews.length === 0 && totalCount > 0) ? (
              // 데이터는 있지만 현재 페이지에 리뷰가 없는 경우 (e.g. 마지막 페이지 리뷰 삭제 후)
              <div className="text-center py-16 bg-white rounded-2xl">
                <h3 className="text-xl font-medium text-gray-500 mb-2">리뷰를 불러오는 중이거나 페이지에 리뷰가 없습니다.</h3>
              </div>
            ) : (reviews.length === 0 && totalCount === 0) ? (
              // 전체 리뷰가 없는 경우
              <div className="text-center py-16 bg-white rounded-2xl">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-500 mb-2">아직 리뷰가 없습니다</h3>
                <p className="text-gray-400">첫 번째 리뷰를 작성해보세요!</p>
              </div>
            ) : (
              reviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isOwner={ownedIds.includes(review.id)}
                  hasLiked={userLikes.includes(review.id)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onLike={handleLike}
                  onReport={handleReport}
                />
              ))
            )}
          </div>
          {/* 페이지네이션 렌더링 */}
          {renderPagination()}
        </div>
      </main>

      {/* 신고 모달 */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleSubmitReport}
      />

      <Footer />
    </>
  );
}