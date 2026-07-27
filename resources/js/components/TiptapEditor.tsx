import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3, 
  Quote, 
  Undo, 
  Redo 
} from 'lucide-react';

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap focus:outline-none min-h-[250px] p-4 text-white text-base leading-relaxed',
        ...(placeholder ? { placeholder } : {}),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync content from parent if changed externally (e.g. on load / reset)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const toggleHeading = (level: 1 | 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 items-center border-b border-white/10 bg-[#0e0e11] p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-md transition hover:bg-white/10 ${
            editor.isActive('bold') ? 'bg-white/15 text-white' : 'text-pewter hover:text-white'
          }`}
          title="Bold"
        >
          <Bold size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-md transition hover:bg-white/10 ${
            editor.isActive('italic') ? 'bg-white/15 text-white' : 'text-pewter hover:text-white'
          }`}
          title="Italic"
        >
          <Italic size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded-md transition hover:bg-white/10 ${
            editor.isActive('strike') ? 'bg-white/15 text-white' : 'text-pewter hover:text-white'
          }`}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1"></div>

        <button
          type="button"
          onClick={() => toggleHeading(1)}
          className={`p-2 rounded-md transition hover:bg-white/10 ${
            editor.isActive('heading', { level: 1 }) ? 'bg-white/15 text-white' : 'text-pewter hover:text-white'
          }`}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>

        <button
          type="button"
          onClick={() => toggleHeading(2)}
          className={`p-2 rounded-md transition hover:bg-white/10 ${
            editor.isActive('heading', { level: 2 }) ? 'bg-white/15 text-white' : 'text-pewter hover:text-white'
          }`}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>

        <button
          type="button"
          onClick={() => toggleHeading(3)}
          className={`p-2 rounded-md transition hover:bg-white/10 ${
            editor.isActive('heading', { level: 3 }) ? 'bg-white/15 text-white' : 'text-pewter hover:text-white'
          }`}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-md transition hover:bg-white/10 ${
            editor.isActive('bulletList') ? 'bg-white/15 text-white' : 'text-pewter hover:text-white'
          }`}
          title="Bullet List"
        >
          <List size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-md transition hover:bg-white/10 ${
            editor.isActive('orderedList') ? 'bg-white/15 text-white' : 'text-pewter hover:text-white'
          }`}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-md transition hover:bg-white/10 ${
            editor.isActive('blockquote') ? 'bg-white/15 text-white' : 'text-pewter hover:text-white'
          }`}
          title="Blockquote"
        >
          <Quote size={16} />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded-md text-pewter hover:text-white transition hover:bg-white/10"
          title="Undo"
        >
          <Undo size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded-md text-pewter hover:text-white transition hover:bg-white/10"
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="relative">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
