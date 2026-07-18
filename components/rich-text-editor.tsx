"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import ImageExtension from "@tiptap/extension-image";

import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconList,
  IconListNumbers,
  IconLink,
  IconUnlink,
  IconClearFormatting,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconPhoto,
  IconH1,
  IconH2,
  IconQuote,
  IconSeparator,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Underline,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-emerald-400 underline hover:text-emerald-300 cursor-pointer" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      ImageExtension.configure({ inline: false }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3 text-zinc-800 dark:text-zinc-200 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-0.5 [&_blockquote]:border-l-emerald-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-zinc-500 dark:[&_blockquote]:text-zinc-400 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-medium [&_p]:my-1.5 [&_a]:text-emerald-500 [&_a]:underline [&_img]:rounded-xl [&_img]:my-3 [&_hr]:my-4 [&_hr]:border-white/10",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      prevValueRef.current = html;
      onChange(html);
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== prevValueRef.current && value !== editor.getHTML()) {
      editor.commands.setContent(value);
      prevValueRef.current = value;
    }
  }, [value, editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Masukkan URL:", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    let finalUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      finalUrl = `https://${url}`;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: finalUrl }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Masukkan URL gambar:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!isMounted) {
    return (
      <div className="w-full rounded-xl border border-white/10 bg-zinc-950/50 overflow-hidden">
        <div className="min-h-[300px] flex items-center justify-center text-xs text-zinc-500">
          Loading editor...
        </div>
      </div>
    );
  }

  if (!editor) {
    return (
      <div className="w-full rounded-xl border border-white/10 bg-zinc-950/50 overflow-hidden">
        <div className="min-h-[300px] flex items-center justify-center text-xs text-zinc-500">
          Initializing editor...
        </div>
      </div>
    );
  }

  const ToolBtn = ({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
        active
          ? "bg-emerald-500/20 text-emerald-400"
          : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full rounded-xl border border-white/10 bg-zinc-950/50 overflow-hidden transition-colors focus-within:border-emerald-500/40">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-white/10 bg-zinc-900/60 p-1.5">
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Tebal">
          <IconBold className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Miring">
          <IconItalic className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Garis Bawah">
          <IconUnderline className="h-4 w-4" />
        </ToolBtn>

        <div className="mx-1 h-4 w-px bg-white/10" />

        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
          <IconH1 className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
          <IconH2 className="h-4 w-4" />
        </ToolBtn>

        <div className="mx-1 h-4 w-px bg-white/10" />

        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
          <IconList className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered List">
          <IconListNumbers className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Kutipan">
          <IconQuote className="h-4 w-4" />
        </ToolBtn>

        <div className="mx-1 h-4 w-px bg-white/10" />

        <ToolBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Rata Kiri">
          <IconAlignLeft className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Rata Tengah">
          <IconAlignCenter className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Rata Kanan">
          <IconAlignRight className="h-4 w-4" />
        </ToolBtn>

        <div className="mx-1 h-4 w-px bg-white/10" />

        <ToolBtn onClick={addLink} active={editor.isActive("link")} title="Tambah Link">
          <IconLink className="h-4 w-4" />
        </ToolBtn>
        {editor.isActive("link") && (
          <ToolBtn onClick={() => editor.chain().focus().unsetLink().run()} title="Hapus Link">
            <IconUnlink className="h-4 w-4" />
          </ToolBtn>
        )}
        <ToolBtn onClick={addImage} title="Tambah Gambar">
          <IconPhoto className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Garis Pemisah">
          <IconSeparator className="h-4 w-4" />
        </ToolBtn>

        <div className="mx-1 h-4 w-px bg-white/10" />

        <ToolBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Hapus Format">
          <IconClearFormatting className="h-4 w-4" />
        </ToolBtn>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
