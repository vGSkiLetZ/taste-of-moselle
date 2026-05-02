"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Link as LinkIcon,
  Undo,
  Redo,
  Minus,
} from "lucide-react";

interface TiptapEditorProps {
  name: string;
  value: string;
  onChange?: (html: string) => void;
}

export default function TiptapEditor({ name, value, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-moselle-green underline" },
      }),
      TiptapImage.configure({
        inline: false,
        HTMLAttributes: { class: "rounded-xl max-w-full" },
      }),
      Placeholder.configure({
        placeholder: "Commencez à écrire votre article...",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[300px] p-4 focus:outline-none text-moselle-text",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("URL du lien :");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("URL de l'image :");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const btnClass = (active: boolean) =>
    `p-2 rounded-lg transition-colors ${
      active
        ? "bg-moselle-green text-white"
        : "text-moselle-text-light hover:bg-moselle-cream"
    }`;

  return (
    <div className="border-2 border-moselle-cream-dark rounded-xl overflow-hidden bg-moselle-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-moselle-cream-dark bg-moselle-cream/30">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive("bold"))}>
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive("italic"))}>
          <Italic size={16} />
        </button>
        <div className="w-px h-6 bg-moselle-cream-dark mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive("heading", { level: 2 }))}>
          <Heading2 size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive("heading", { level: 3 }))}>
          <Heading3 size={16} />
        </button>
        <div className="w-px h-6 bg-moselle-cream-dark mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive("bulletList"))}>
          <List size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive("orderedList"))}>
          <ListOrdered size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive("blockquote"))}>
          <Quote size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnClass(false)}>
          <Minus size={16} />
        </button>
        <div className="w-px h-6 bg-moselle-cream-dark mx-1" />
        <button type="button" onClick={addLink} className={btnClass(editor.isActive("link"))}>
          <LinkIcon size={16} />
        </button>
        <button type="button" onClick={addImage} className={btnClass(false)}>
          <ImageIcon size={16} />
        </button>
        <div className="w-px h-6 bg-moselle-cream-dark mx-1" />
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)}>
          <Undo size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)}>
          <Redo size={16} />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Hidden input for form submission — controlled by parent value */}
      <input type="hidden" name={name} value={value} readOnly />
    </div>
  );
}
