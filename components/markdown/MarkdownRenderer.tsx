import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  markdown: string;
  className?: string;
}

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), "input"],
  attributes: {
    ...(defaultSchema.attributes || {}),
    a: [
      ...((defaultSchema.attributes?.a as unknown[]) || []),
      "target",
      "rel",
    ],
    code: [
      ...((defaultSchema.attributes?.code as unknown[]) || []),
      ["className", /^language-[a-z0-9-]+$/i],
    ],
    img: [
      ...((defaultSchema.attributes?.img as unknown[]) || []),
      "loading",
      "decoding",
    ],
    input: [
      ["type", "checkbox"],
      ["checked", true],
      ["disabled", true],
    ],
    td: [
      ...((defaultSchema.attributes?.td as unknown[]) || []),
      ["align", /^(left|center|right)$/],
    ],
    th: [
      ...((defaultSchema.attributes?.th as unknown[]) || []),
      ["align", /^(left|center|right)$/],
    ],
  },
} as const;

export function MarkdownRenderer({ markdown, className }: MarkdownRendererProps) {
  const wrapperClassName = className
    ? `markdown-body ${className}`
    : "markdown-body";

  return (
    <div className={wrapperClassName}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
        components={{
          a: ({ node: _node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
          img: ({ node: _node, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img {...props} alt={props.alt || ""} loading="lazy" />
          ),
          input: ({ node: _node, ...props }) => {
            if (props.type === "checkbox") {
              return <input {...props} disabled readOnly />;
            }
            return <input {...props} />;
          },
        }}
      >
        {markdown || ""}
      </ReactMarkdown>
    </div>
  );
}
