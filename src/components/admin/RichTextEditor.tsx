'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Undo, Redo, Heading1, Heading2, Quote } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Ensure component is mounted before creating editor (SSR fix)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-400 underline',
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-4 bg-white/5 border border-white/20 rounded-lg text-white',
      },
    },
    immediatelyRender: false, // This fixes the SSR error
  })

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  if (!isMounted || !editor) {
    return (
      <div className="min-h-[400px] p-4 bg-white/5 border border-white/20 rounded-lg text-white/40 flex items-center justify-center">
        Loading editor...
      </div>
    )
  }

  const addLocalImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e: any) => {
      const file = e.target.files[0]
      if (!file) return

      // Show loading indicator
      editor.chain().focus().setImage({ src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"%3E%3Ccircle cx="12" cy="12" r="10" fill="%23cccccc" /%3E%3C/svg%3E' }).run()
      
      try {
        // Upload to Supabase
        const supabase = createClient()
        const fileExt = file.name.split('.').pop()
        const fileName = `blog-content/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('inventory-images')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('inventory-images')
          .getPublicUrl(fileName)

        // Update the image with the actual URL
        editor.chain().focus().setImage({ src: publicUrl }).run()
      } catch (err) {
        console.error('Upload error:', err)
        alert('Failed to upload image')
        // Remove the loading image
        editor.chain().focus().undo().run()
      }
    }
    input.click()
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-black border border-white/20 rounded-lg">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded transition ${
            editor.isActive('bold') ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          title="Bold"
          type="button"
        >
          <Bold size={16} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded transition ${
            editor.isActive('italic') ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          title="Italic"
          type="button"
        >
          <Italic size={16} />
        </button>
        
        <div className="w-px h-6 bg-white/20 mx-1" />
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded transition ${
            editor.isActive('heading', { level: 1 }) ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          title="Heading 1"
          type="button"
        >
          <Heading1 size={16} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded transition ${
            editor.isActive('heading', { level: 2 }) ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          title="Heading 2"
          type="button"
        >
          <Heading2 size={16} />
        </button>
        
        <div className="w-px h-6 bg-white/20 mx-1" />
        
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded transition ${
            editor.isActive('bulletList') ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          title="Bullet List"
          type="button"
        >
          <List size={16} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded transition ${
            editor.isActive('orderedList') ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          title="Numbered List"
          type="button"
        >
          <ListOrdered size={16} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded transition ${
            editor.isActive('blockquote') ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          title="Quote"
          type="button"
        >
          <Quote size={16} />
        </button>
        
        <div className="w-px h-6 bg-white/20 mx-1" />
        
        <button
          onClick={addLink}
          className="p-2 rounded transition text-white/60 hover:text-white hover:bg-white/10"
          title="Add Link"
          type="button"
        >
          <LinkIcon size={16} />
        </button>
        
        <button
          onClick={addLocalImage}
          className="p-2 rounded transition text-white/60 hover:text-white hover:bg-white/10"
          title="Upload Image from Computer"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        
        <div className="w-px h-6 bg-white/20 mx-1" />
        
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded transition text-white/60 hover:text-white hover:bg-white/10"
          title="Undo"
          type="button"
        >
          <Undo size={16} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded transition text-white/60 hover:text-white hover:bg-white/10"
          title="Redo"
          type="button"
        >
          <Redo size={16} />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
      
      <p className="text-[10px] text-white/40 mt-2">
        Tip: You can paste images directly into the editor, or use the upload button to add images from your computer
      </p>
    </div>
  )
}