import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ArrowLeft, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface PreviewBannerProps {
  ticker: string;
  language: 'en' | 'ar';
  isPreview?: boolean;
}

export function PreviewBanner({ ticker, language, isPreview = true }: PreviewBannerProps) {
  const [copied, setCopied] = useState(false);
  const isRTL = language === 'ar';

  if (!isPreview) return null;

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const labels = {
    en: {
      preview: 'Preview Mode',
      draft: 'Viewing draft content',
      backToEditor: 'Back to Editor',
      copyLink: 'Copy preview link',
      copied: 'Copied!',
    },
    ar: {
      preview: 'وضع المعاينة',
      draft: 'عرض محتوى المسودة',
      backToEditor: 'العودة للمحرر',
      copyLink: 'نسخ رابط المعاينة',
      copied: 'تم النسخ!',
    },
  };
  
  const t = labels[language];

  return (
    <div 
      className="bg-amber-500 dark:bg-amber-600 text-amber-950 py-2 px-4"
      data-testid="preview-banner"
    >
      <div className={`container mx-auto flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Eye className="h-4 w-4" />
            <span className="font-semibold text-sm">{t.preview}</span>
          </div>
          <Badge variant="outline" className="text-xs border-amber-800 text-amber-900">
            {language.toUpperCase()}
          </Badge>
          <span className="text-xs opacity-75 hidden sm:inline">{t.draft}</span>
        </div>
        
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-amber-900 hover:bg-amber-400"
            onClick={handleCopyLink}
            data-testid="button-copy-preview-link"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                {t.copied}
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                {t.copyLink}
              </>
            )}
          </Button>
          <Link href={`/editor/${ticker}`}>
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              data-testid="button-back-to-editor"
            >
              <ArrowLeft className={`h-3 w-3 mr-1 ${isRTL ? 'rotate-180' : ''}`} />
              {t.backToEditor}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
