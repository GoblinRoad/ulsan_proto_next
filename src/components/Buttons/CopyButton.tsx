import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // 모던 브라우저의 Clipboard API 사용
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // fallback: 구형 브라우저나 모바일을 위한 방법
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('복사 실패:', err);
          // 사용자에게 수동 복사 안내
          alert('복사할 내용: ' + text);
        }
        
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('복사 실패:', err);
      // 최종 fallback: 사용자에게 수동 복사 안내
      alert('복사할 내용: ' + text);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`ml-2 p-1 rounded-md transition-colors ${
        copied 
          ? 'bg-green-100 text-green-600' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
      } ${className}`}
      title="복사하기"
    >
      {copied ? (
        <Check className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
};

export default CopyButton;
