import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, FileText } from 'lucide-react';
import type { AdminContentDoc } from '../../api/admin';

interface ContentBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string, value: string) => Promise<void>;
  initialData?: AdminContentDoc | null;
}

const COMMON_KEYS = [
  'home.status_pill',
  'home.hero.headline',
  'home.hero.subheadline',
  'home.right_now.building',
  'home.right_now.reading',
  'home.right_now.learning',
  'resume.bio',
];

export const ContentBlockModal: React.FC<ContentBlockModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setKey(initialData.key);
      setValue(initialData.value || '');
    } else {
      setKey('');
      setValue('');
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) {
      setError('Content key is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave(key.trim(), value);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to save content block.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#121216] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2 text-[#10B981]">
            <FileText className="size-5" />
            <h2 className="text-base font-bold text-[#FAFAFA]">
              {initialData ? 'Edit Content Block' : 'Create Content Block'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-[#FAFAFA] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Key (dot notation)
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              disabled={Boolean(initialData)}
              placeholder="e.g. home.hero.headline"
              required
              className="w-full px-3.5 py-2 bg-[#18181B] border border-white/10 rounded-lg text-sm text-[#FAFAFA] placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#10B981]/50 font-mono disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {!initialData && (
              <div className="mt-1.5 flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] text-muted-foreground">Quick suggestions:</span>
                {COMMON_KEYS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setKey(suggestion)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-[#FAFAFA] border border-white/5 transition-colors cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-muted-foreground">Value</label>
              <span className="text-[11px] text-muted-foreground">
                {value.length} characters
              </span>
            </div>
            <textarea
              rows={5}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter text or markdown content..."
              className="w-full px-3.5 py-2.5 bg-[#18181B] border border-white/10 rounded-lg text-sm text-[#FAFAFA] placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#10B981]/50 transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-[#FAFAFA] hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !key.trim()}
              className="px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0C] font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  <span>Save Block</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentBlockModal;
