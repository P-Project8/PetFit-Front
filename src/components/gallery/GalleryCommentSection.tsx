import { useState, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getGalleryComments, createComment, deleteComment } from '../../services/galleryApi';
import type { GalleryComment } from '../../types/gallery';

interface GalleryCommentSectionProps {
  galleryId: number;
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return '';
  const utc = iso.endsWith('Z') || iso.includes('+') ? iso : iso + 'Z';
  const d = new Date(utc);
  if (isNaN(d.getTime())) return '';
  return `${d.getMonth() + 1}.${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function GalleryCommentSection({ galleryId }: GalleryCommentSectionProps) {
  const [comments, setComments] = useState<GalleryComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getGalleryComments(galleryId);
        setComments(data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [galleryId]);

  async function handleSend() {
    if (!input.trim() || isSending) return;
    setIsSending(true);
    try {
      const newComment = await createComment(galleryId, { content: input.trim() });
      setComments((prev) => [...prev, newComment]);
      setInput('');
    } catch {
      toast.error('댓글 작성에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  }

  async function handleDelete(commentId: number) {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  }

  return (
    <div className="border-t border-gray-100">
      <p className="px-4 pt-4 pb-2 text-sm font-bold text-gray-900">
        댓글 {comments.length}
      </p>

      {/* 댓글 목록 */}
      {isLoading ? (
        <div className="flex justify-center py-6">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-[#14314F] rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-6">첫 댓글을 남겨보세요!</p>
      ) : (
        <ul className="px-4 space-y-3 pb-4">
          {comments.map((c) => (
            <li key={c.id} className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0 flex items-center justify-center text-xs font-bold text-gray-500">
                {c.userId[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-700">{c.userId}</p>
                <p className="text-sm text-gray-800 mt-0.5 break-words">{c.content}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(c.createdAt)}</p>
              </div>
              {c.userId === '나***' && (
                <button
                  onClick={() => handleDelete(c.id)}
                  className="shrink-0 p-1 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* 입력창 */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          placeholder="댓글을 입력하세요..."
          className="flex-1 text-base px-3 py-2 bg-gray-100 rounded-full outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isSending}
          className="w-8 h-8 bg-[#14314F] rounded-full flex items-center justify-center disabled:bg-gray-200 transition-colors shrink-0"
        >
          <Send className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  );
}
