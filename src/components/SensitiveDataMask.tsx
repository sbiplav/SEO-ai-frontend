import { useState } from 'react';

interface MaskProps {
  text: string;
}

export const SensitiveDataMask = ({ text }: MaskProps) => {
  const [masked, setMasked] = useState(true);

  const maskPatterns = [
    { regex: /(\bname:\s*)\w+/gi, replace: '$1****' },
    { regex: /(\bemail:\s*)[^\s]+/gi, replace: '$1****@***.***' },
    { regex: /(\bage:\s*)\d+/gi, replace: '$1**' },
    { regex: /(\bphone:\s*)\d+/gi, replace: '$1********' }
  ];

  const maskText = (input: string) => {
    return maskPatterns.reduce((acc, pattern) => 
      acc.replace(pattern.regex, pattern.replace), input
    );
  };

  return (
    <button 
      className="masked-content"
      onClick={() => setMasked(!masked)}
      style={{ cursor: 'pointer', filter: masked ? 'blur(3px)' : 'none', background: 'none', border: 'none', padding: 0 }}
      aria-label="Toggle mask"
    >
      {masked ? maskText(text) : text}
    </button>
  );
};