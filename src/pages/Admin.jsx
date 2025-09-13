import React, { useState } from 'react';
import { Media } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Image as ImageIcon, Video, Check, X, Loader2, Play, Pause } from 'lucide-react';

export default function AdminPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState('');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const categories = ['운동회', '레크레이션', '축제', '기타행사'];

  const getFileType = (file) => {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const videoTypes = ['video/mp4', 'video/mov', 'video/webm', 'video/avi', 'video/quicktime'];
    
    if (imageTypes.includes(file.type)) {
      return 'image';
    } else if (videoTypes.includes(file.type)) {
      return 'video';
    }
    return null;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const detectedFileType = getFileType(file);
      
      if (!detectedFileType) {
        alert('지원하지 않는 파일 형식입니다. 이미지(JPG, PNG, GIF) 또는 영상(MP4, MOV, WEBM) 파일을 선택해주세요.');
        return;
      }

      setSelectedFile(file);
      setFileType(detectedFileType);
      
      // 미리보기 URL 생성
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // 기본 제목 설정
      if (!title) {
        setTitle(file.name.split('.')[0]);
      }
    }
  };

  const handleVideoToggle = () => {
    const video = document.getElementById('preview-video');
    if (video) {
      if (isVideoPlaying) {
        video.pause();
        setIsVideoPlaying(false);
      } else {
        video.play();
        setIsVideoPlaying(true);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !category || !title) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setIsUploading(true);

    try {
      // 파일 업로드
      const { file_url } = await UploadFile({ file: selectedFile });
      
      // Media 엔티티에 저장
      const mediaData = {
        title: title,
        fileUrl: file_url,
        fileType: fileType,
        mimeType: selectedFile.type,
        category: category,
        eventDate: eventDate || new Date().toISOString().split('T')[0],
        fileSize: selectedFile.size
      };

      // 영상의 경우 duration 추가 (실제로는 파일 메타데이터에서 가져와야 하지만 여기서는 간단히 처리)
      if (fileType === 'video') {
        mediaData.duration = 0; // 추후 영상 길이 측정 로직 추가 가능
      }

      await Media.create(mediaData);

      setIsCompleted(true);
      
      // 3초 후 폼 리셋
      setTimeout(() => {
        resetForm();
      }, 3000);

    } catch (error) {
      console.error('업로드 실패:', error);
      alert('업로드에 실패했습니다. 다시 시도해주세요.');
    }

    setIsUploading(false);
  };

  const resetForm = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileType('');
    setCategory('');
    setTitle('');
    setEventDate('');
    setIsCompleted(false);
    setIsVideoPlaying(false);
    
    // 파일 입력 필드 리셋
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const cancelUpload = () => {
    resetForm();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <Header />
      <main className="pt-20 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">미디어 관리자</h1>
            <p className="text-lg text-gray-600">이미지와 영상을 업로드하고 포트폴리오에 추가하세요</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {isCompleted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">업로드 완료!</h2>
                <p className="text-gray-600 mb-6">
                  {fileType === 'image' ? '이미지' : '영상'}가 성공적으로 포트폴리오에 추가되었습니다.
                </p>
                <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
                  새 파일 업로드
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* 카테고리 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">카테고리 선택</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 제목 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {fileType === 'video' ? '영상' : '미디어'} 제목
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                    className="w-full"
                  />
                </div>

                {/* 행사 날짜 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">행사 날짜</label>
                  <Input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* 파일 업로드 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">파일 선택</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">클릭하여 파일 업로드</span> 또는 드래그 앤 드롭
                        </p>
                        <p className="text-xs text-gray-500">
                          이미지: JPG, PNG, GIF | 영상: MP4, MOV, WEBM (최대 100MB)
                        </p>
                      </div>
                      <input
                        id="file-input"
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* 미리보기 영역 */}
                {previewUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      미리보기 {fileType === 'video' && '(클릭해서 재생/정지)'}
                    </label>
                    <div className="relative bg-gray-100 rounded-lg p-4">
                      {fileType === 'image' ? (
                        <img
                          src={previewUrl}
                          alt="미리보기"
                          className="max-w-full max-h-96 mx-auto rounded-lg shadow-md object-contain"
                        />
                      ) : (
                        <div className="relative max-w-full max-h-96 mx-auto">
                          <video
                            id="preview-video"
                            src={previewUrl}
                            className="max-w-full max-h-96 mx-auto rounded-lg shadow-md object-contain"
                            controls={false}
                            onEnded={() => setIsVideoPlaying(false)}
                          />
                          <button
                            onClick={handleVideoToggle}
                            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors rounded-lg"
                          >
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                              {isVideoPlaying ? (
                                <Pause className="w-6 h-6 text-gray-800" />
                              ) : (
                                <Play className="w-6 h-6 text-gray-800 ml-1" />
                              )}
                            </div>
                          </button>
                        </div>
                      )}
                      
                      <button
                        onClick={cancelUpload}
                        className="absolute top-6 right-6 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {selectedFile && (
                      <div className="mt-2 text-sm text-gray-500 space-y-1">
                        <p>파일명: {selectedFile.name}</p>
                        <p>크기: {formatFileSize(selectedFile.size)}</p>
                        <p>유형: {fileType === 'image' ? '이미지' : '영상'} ({selectedFile.type})</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 업로드 버튼 */}
                <div className="flex gap-4 pt-6">
                  <Button
                    onClick={cancelUpload}
                    variant="outline"
                    className="flex-1"
                    disabled={!selectedFile || isUploading}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleUpload}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedFile || !category || !title || isUploading}
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        업로드 중...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {fileType === 'video' ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <ImageIcon className="w-4 h-4" />
                        )}
                        최종 업로드
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}