import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { Copy, Check, Terminal, Code2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface MarkdownMessageProps {
  content: string;
}

export const MarkdownMessage = ({ content }: MarkdownMessageProps) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="grok-markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            const isInline = !match;
            const language = match ? match[1] : 'text';

            if (isInline) {
              return (
                <code 
                  className="inline-code px-1.5 py-0.5 mx-0.5 bg-muted/80 text-foreground rounded-md text-sm font-mono border border-border/50" 
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="grok-code-block group my-6 rounded-xl overflow-hidden border border-border/30 bg-gradient-to-br from-muted/40 to-muted/20 shadow-lg">
                {/* Code block header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-muted/80 to-muted/60 border-b border-border/30 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      {language === 'bash' || language === 'sh' || language === 'shell' ? (
                        <Terminal className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Code2 className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium text-foreground/80 capitalize">
                        {language}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 opacity-70 hover:opacity-100 transition-all duration-200 text-xs"
                    onClick={() => copyCode(codeString)}
                  >
                    {copiedCode === codeString ? (
                      <>
                        <Check className="w-3 h-3 mr-1.5 text-green-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1.5" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>

                {/* Code content */}
                <div className="relative">
                  <pre className="overflow-x-auto p-4 m-0 bg-gradient-to-br from-muted/20 to-transparent text-sm leading-relaxed max-w-full">
                    <code 
                      className={`${className} block w-full whitespace-pre font-mono text-foreground/90`}
                      style={{ 
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        maxWidth: '100%',
                        background: 'transparent'
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  </pre>
                  
                  {/* Gradient overlay for scroll indication */}
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-muted/40 to-transparent pointer-events-none"></div>
                </div>
              </div>
            );
          },
          p({ children }) {
            return <p className="mb-4 last:mb-0 leading-7 text-foreground/90 text-base">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc list-inside mb-4 space-y-2 text-foreground/90 ml-4">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground/90 ml-4">{children}</ol>;
          },
          li({ children }) {
            return <li className="leading-7">{children}</li>;
          },
          h1({ children }) {
            return <h1 className="text-3xl font-bold mb-6 mt-8 text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-2xl font-bold mb-4 mt-6 text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-xl font-bold mb-3 mt-5 text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">{children}</h3>;
          },
          h4({ children }) {
            return <h4 className="text-lg font-semibold mb-2 mt-4 text-foreground/90">{children}</h4>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary/50 bg-muted/30 pl-4 py-2 italic my-4 rounded-r-lg">
                <div className="text-foreground/80">{children}</div>
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-border/50 rounded-lg overflow-hidden">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-muted/50">{children}</thead>;
          },
          tbody({ children }) {
            return <tbody className="divide-y divide-border/30">{children}</tbody>;
          },
          tr({ children }) {
            return <tr className="hover:bg-muted/20 transition-colors">{children}</tr>;
          },
          th({ children }) {
            return <th className="px-4 py-2 text-left font-semibold text-foreground/90 border-b border-border/30">{children}</th>;
          },
          td({ children }) {
            return <td className="px-4 py-2 text-foreground/80">{children}</td>;
          },
          strong({ children }) {
            return <strong className="font-semibold text-foreground">{children}</strong>;
          },
          em({ children }) {
            return <em className="italic text-foreground/90">{children}</em>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
