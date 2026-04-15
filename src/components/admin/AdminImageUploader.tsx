'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadImage } from '@/lib/image-upload'
import { Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface AdminImageUploaderProps {
  bucket: 'hero-images' | 'testimonials' | 'portfolio'
  folder?: string
  onUploadComplete: (url: string) => void
  existingImage?: string
}

export default function AdminImageUploader({
  bucket,
  folder,
  onUploadComplete,
  existingImage
}: AdminImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(existingImage || null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    
    setUploading(true)
    
    try {
      const { url, error } = await uploadImage(file, { bucket, folder, maxSizeMB: 5 })
      
      if (error) throw new Error(error)
      
      setPreview(url)
      onUploadComplete(url)
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }, [bucket, folder, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/avif': ['.avif']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false
  })

  const removeImage = () => {
    setPreview(null)
    onUploadComplete('')
    toast.success('Image removed')
  }

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="500px"
            />
          </div>
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20' : 'border-gray-300 dark:border-gray-700'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-amber-500'}
          `}
        >
          <input {...getInputProps()} disabled={uploading} />
          
          {uploading ? (
            <div className="space-y-3">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-amber-500" />
              <div className="text-sm text-gray-600 dark:text-gray-400">Uploading...</div>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Click or drag to upload</p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP up to 5MB</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}