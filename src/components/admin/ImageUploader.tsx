'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2, Trash2 } from 'lucide-react'

interface ImageUploaderProps {
  currentImageUrl: string | null
  onImageUploaded: (url: string) => void
  onImageRemoved: () => void
  folder?: string
  label?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  aspectRatio?: 'square' | 'landscape' | 'portrait'
}

export default function ImageUploader({
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  folder = 'blog-posts',
  label,
  className = '',
  size = 'md',
  aspectRatio = 'square'
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  }

  const aspectRatioClasses = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]'
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('inventory-images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('inventory-images')
        .getPublicUrl(fileName)

      onImageUploaded(publicUrl)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }, [folder, supabase, onImageUploaded])

  const removeImage = async () => {
    if (!currentImageUrl) return
    
    if (!confirm('Remove this image?')) return
    
    setUploading(true)
    setError(null)

    try {
      const filePath = currentImageUrl.split('/').pop()
      if (filePath) {
        const { error: deleteError } = await supabase.storage
          .from('inventory-images')
          .remove([filePath])

        if (deleteError) throw deleteError
      }

      onImageRemoved()
    } catch (err: any) {
      console.error('Remove error:', err)
      setError(err.message || 'Failed to remove image')
    } finally {
      setUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles: 1,
    disabled: uploading
  })

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-white/60 mb-1">{label}</label>
      )}
      
      {currentImageUrl ? (
        <div className="relative group">
          <div className={`${sizeClasses[size]} ${aspectRatioClasses[aspectRatio]} rounded border border-white/20 overflow-hidden`}>
            <img
              src={currentImageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded flex items-center justify-center gap-1">
            <div
              {...getRootProps()}
              className="cursor-pointer p-1 bg-white/20 rounded hover:bg-white/30 transition"
              onClick={(e) => e.stopPropagation()}
            >
              <Upload size={12} className="text-white" />
            </div>
            <button
              onClick={removeImage}
              disabled={uploading}
              className="p-1 bg-red-500/80 rounded hover:bg-red-600 transition disabled:opacity-50"
            >
              <Trash2 size={12} className="text-white" />
            </button>
          </div>
          <input {...getInputProps()} />
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`${sizeClasses[size]} ${aspectRatioClasses[aspectRatio]} border-2 border-dashed rounded cursor-pointer transition flex flex-col items-center justify-center ${
            isDragActive
              ? 'border-white bg-white/10'
              : 'border-white/20 hover:border-white/40'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <Loader2 size={16} className="animate-spin text-white/60" />
          ) : (
            <>
              <Upload size={14} className="text-white/40" />
              <span className="text-[8px] text-white/40 mt-1">Upload</span>
            </>
          )}
        </div>
      )}
      {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
    </div>
  )
}