import DOMPurify from 'dompurify';

const ALLOWED_TAGS = ['p', 'strong', 'em', 'b', 'i', 'br', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'span'];
const ALLOWED_ATTR = ['href', 'target', 'rel', 'class', 'style'];

interface RichTextProps {
  html?: string | null;
  className?: string;
  dir?: 'ltr' | 'rtl';
}

export function RichText({ html, className = '', dir = 'ltr' }: RichTextProps) {
  if (!html) return null;

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });

  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    USE_PROFILES: { html: true },
  });

  DOMPurify.removeHook('afterSanitizeAttributes');

  return (
    <div 
      className={`prose prose-sm max-w-none dark:prose-invert ${className}`}
      dir={dir}
      dangerouslySetInnerHTML={{ __html: clean }} 
    />
  );
}

export default RichText;
