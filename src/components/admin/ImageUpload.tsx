'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react'

interface ImageUploadProps {
  itemId: string
  currentImageUrl: string | null
  onImageUploaded: (url: string) => void
  onImageRemoved?: () => void
}

export default function ImageUpload({ 
  itemId, 
  currentImageUrl, 
  onImageUploaded,
  onImageRemoved 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${itemId}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('inventory-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('inventory-images')
        .getPublicUrl(filePath)

      // Update the inventory item with the image URL
      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ primary_image_url: publicUrl })
        .eq('id', itemId)

      if (updateError) throw updateError

      onImageUploaded(publicUrl)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }, [itemId, supabase, onImageUploaded])

  const removeImage = async () => {
    if (!currentImageUrl) return
    
    if (!confirm('Remove this image? The item will remain but without an image.')) return
    
    setUploading(true)
    setError(null)

    try {
      // Extract file path from URL
      const filePath = currentImageUrl.split('/').pop()
      if (filePath) {
        // Delete from storage
        const { error: deleteError } = await supabase.storage
          .from('inventory-images')
          .remove([filePath])

        if (deleteError) throw deleteError
      }

      // Update the inventory item to remove image URL
      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ primary_image_url: null })
        .eq('id', itemId)

      if (updateError) throw updateError

      if (onImageRemoved) onImageRemoved()
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
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: uploading
  })

  return (
    <div className="space-y-2">
      {currentImageUrl ? (
        <div className="relative group">
          <img
            src={currentImageUrl}
            alt="Item preview"
            className="w-20 h-20 object-cover rounded border border-white/20"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded flex items-center justify-center gap-2">
            <div
              {...getRootProps()}
              className="cursor-pointer p-1 bg-white/20 rounded hover:bg-white/30 transition"
              onClick={(e) => e.stopPropagation()}
            >
              <Upload size={14} className="text-white" />
            </div>
            <button
              onClick={removeImage}
              disabled={uploading}
              className="p-1 bg-red-500/80 rounded hover:bg-red-600 transition disabled:opacity-50"
            >
              <Trash2 size={14} className="text-white" />
            </button>
          </div>
          <input {...getInputProps()} />
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`w-20 h-20 border-2 border-dashed rounded cursor-pointer transition flex flex-col items-center justify-center ${
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
              <Upload size={16} className="text-white/40" />
              <span className="text-[8px] text-white/40 mt-1">Upload</span>
            </>
          )}
        </div>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}