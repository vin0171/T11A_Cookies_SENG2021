import React, { useEffect, useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

export const HighlightedTypewriter = ({ code, language, speed = 20 }) => {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    if (visibleChars < code.length) {
      const timeout = setTimeout(() => setVisibleChars(visibleChars + 1), speed);
      return () => clearTimeout(timeout);
    }
  }, [visibleChars, code, speed]);

  const partialCode = code.slice(0, visibleChars);

  return (
    <Highlight code={partialCode} language={language} theme={themes.github}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style, whiteSpace: 'pre-wrap', fontSize: '1.1rem', borderRadius: '12px', padding: '1.5rem', backgroundColor: '#f4f4f4' }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              <span>{i + 1} |</span>
              {line.map((token, tokenIndex) => (
                <span key={tokenIndex} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
