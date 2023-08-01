import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  MdFormatClear,
  MdOutlineCode,
  MdOutlineErrorOutline,
  MdOutlineFormatBold,
  MdOutlineFormatItalic,
  MdOutlineFormatListBulleted,
  MdOutlineFormatListNumbered,
  MdOutlineFormatQuote,
  MdOutlineStrikethroughS,
  MdOutlineTitle,
} from 'react-icons/md';

import { Button } from '@/components/Button';

interface EditorProps {
  label?: string;
  onChange: (html: string) => void;
  value: string;
  error?: string;
}

export function Editor({ label, onChange, value, error }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [3],
        },
        horizontalRule: false,
        code: false,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'outline-none ring-0',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div data-error={!!error} className="group/editor">
      {label && <label className="label-1 mb-2 block w-full text-high-contrast">{label}</label>}
      <div className="rounded-md border border-transparent bg-ui-element text-high-contrast focus-within:ring-1 focus-within:ring-accent-dark group-data-[error=true]/editor:border-[#ED6E6D]">
        {editor && (
          <div className="sticky top-20 z-10 flex w-full rounded-t-md border-b border-b-subtle bg-ui-element group-data-[error=true]/editor:border-b-[#ED6E6D]">
            <div className="flex flex-1 gap-1 divide-x divide-subtle overflow-auto px-1 py-px">
              <div className="flex">
                <Button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  variant={editor.isActive('heading', { level: 3 }) ? 'tertiary' : 'link'}
                  square
                >
                  <MdOutlineTitle size={24} />
                </Button>
                <Button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  disabled={
                    !editor.can().chain().focus().toggleBold().run() || editor.isActive('heading', { level: 3 })
                  }
                  variant={editor.isActive('bold') ? 'tertiary' : 'link'}
                  square
                >
                  <MdOutlineFormatBold size={24} />
                </Button>
                <Button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  disabled={
                    !editor.can().chain().focus().toggleItalic().run() || editor.isActive('heading', { level: 3 })
                  }
                  variant={editor.isActive('italic') ? 'tertiary' : 'link'}
                  square
                >
                  <MdOutlineFormatItalic size={24} />
                </Button>
                <Button
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  disabled={
                    !editor.can().chain().focus().toggleStrike().run() || editor.isActive('heading', { level: 3 })
                  }
                  variant={editor.isActive('strike') ? 'tertiary' : 'link'}
                  square
                >
                  <MdOutlineStrikethroughS size={24} />
                </Button>
              </div>
              <div className="flex">
                <Button
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  variant={editor.isActive('bulletList') ? 'tertiary' : 'link'}
                  square
                >
                  <MdOutlineFormatListBulleted size={24} />
                </Button>
                <Button
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  variant={editor.isActive('orderedList') ? 'tertiary' : 'link'}
                  square
                >
                  <MdOutlineFormatListNumbered size={24} />
                </Button>
                <Button
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  variant={editor.isActive('codeBlock') ? 'tertiary' : 'link'}
                  disabled={editor.isActive('blockquote')}
                  square
                >
                  <MdOutlineCode size={24} />
                </Button>

                <Button
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  variant={editor.isActive('blockquote') ? 'tertiary' : 'link'}
                  disabled={editor.isActive('codeBlock')}
                  square
                >
                  <MdOutlineFormatQuote size={24} />
                </Button>
              </div>
              <div className="flex">
                <Button
                  onClick={() => {
                    editor.chain().focus().unsetAllMarks().run();
                    editor.chain().focus().clearNodes().run();
                  }}
                  variant="link"
                  square
                >
                  <MdFormatClear size={24} />
                </Button>
              </div>
            </div>
            {error && (
              <div className="flex-none p-3 text-[#ED6E6D]">
                <MdOutlineErrorOutline size={24} />
              </div>
            )}
          </div>
        )}
        <EditorContent
          className="prose max-w-none p-4 prose-h3:title-3 prose-p:body-2 prose-h3:my-2 prose-h3:text-high-contrast prose-p:m-0 prose-p:py-1 prose-p:text-low-contrast prose-blockquote:my-4 prose-strong:text-low-contrast prose-pre:my-2 prose-pre:bg-subtle prose-pre:text-low-contrast prose-ol:my-2 prose-ul:my-2"
          editor={editor}
        />
      </div>
      {error && <span className="body-3 mt-2 block text-[#ED6E6D]">{error}</span>}
    </div>
  );
}
