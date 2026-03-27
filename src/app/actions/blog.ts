'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface BlogPost {
  id: string
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  featured_image_url: string | null
  author: string
  read_time: string | null
  views: number
  gradient: string
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
  seo_title: string | null
  seo_description: string | null
  tags: string[]
  insights: string[]
  created_at: string
  updated_at: string
}

export interface BlogPostVersion {
  id: string
  post_id: string
  title: string
  category: string
  excerpt: string
  content: string
  featured_image_url: string | null
  gradient: string
  version_number: number
  change_note: string
  created_by: string
  created_at: string
}

// Get all published posts for frontend
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching published posts:', error)
    return []
  }
  
  return data || []
}

// Get all posts for admin (including drafts)
export async function getAllPosts(): Promise<BlogPost[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching all posts:', error)
    return []
  }
  
  return data || []
}

// Get single post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('Error fetching post:', error)
    return null
  }
  
  // Increment views
  if (data) {
    await supabase
      .from('blog_posts')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', data.id)
  }
  
  return data
}

// Get single post by ID for admin
export async function getPostById(id: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching post:', error)
    return null
  }
  
  return data
}

// Get post versions
export async function getPostVersions(postId: string): Promise<BlogPostVersion[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blog_post_versions')
    .select('*')
    .eq('post_id', postId)
    .order('version_number', { ascending: false })
  
  if (error) {
    console.error('Error fetching versions:', error)
    return []
  }
  
  return data || []
}

// Save a version of a post
async function saveVersion(
  postId: string,
  post: Partial<BlogPost>,
  changeNote: string,
  createdBy: string
): Promise<void> {
  const supabase = await createClient()
  
  try {
    // Get current highest version number
    const { data: versions } = await supabase
      .from('blog_post_versions')
      .select('version_number')
      .eq('post_id', postId)
      .order('version_number', { ascending: false })
      .limit(1)
    
    const nextVersion = (versions?.[0]?.version_number || 0) + 1
    
    const { error } = await supabase
      .from('blog_post_versions')
      .insert([{
        post_id: postId,
        title: post.title || '',
        category: post.category || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        featured_image_url: post.featured_image_url || null,
        gradient: post.gradient || 'from-amber-900/20 via-transparent to-transparent',
        version_number: nextVersion,
        change_note: changeNote,
        created_by: createdBy
      }])
    
    if (error) {
      console.error('Error saving version:', error)
    }
  } catch (error) {
    console.error('Error in saveVersion:', error)
  }
}

// Create or update blog post
export async function saveBlogPost(
  post: Partial<BlogPost>,
  versionNote?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = await createClient()
  
  try {
    // Get current user for author tracking
    const { data: { user } } = await supabase.auth.getUser()
    
    // Generate slug if not provided
    let slug = post.slug
    if (!slug && post.title) {
      slug = post.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    
    let postId: string | undefined = post.id
    
    if (post.id) {
      // Update existing post - includes insights field
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title: post.title,
          slug: slug,
          category: post.category,
          excerpt: post.excerpt,
          content: post.content,
          featured_image_url: post.featured_image_url,
          author: post.author,
          read_time: post.read_time,
          status: post.status,
          gradient: post.gradient,
          tags: post.tags,
          insights: post.insights, // Added insights field
          ...(post.status === 'published' && !post.published_at ? { published_at: new Date().toISOString() } : {})
        })
        .eq('id', post.id)
      
      if (error) throw error
      postId = post.id
      
      // Save version if change note provided
      if (versionNote && postId) {
        await saveVersion(postId, post, versionNote, user?.email || 'admin')
      }
    } else {
      // Create new post - includes insights field
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          title: post.title,
          slug: slug,
          category: post.category,
          excerpt: post.excerpt,
          content: post.content,
          featured_image_url: post.featured_image_url,
          author: post.author,
          read_time: post.read_time,
          status: post.status || 'draft',
          gradient: post.gradient || 'from-amber-900/20 via-transparent to-transparent',
          tags: post.tags || [],
          insights: post.insights || [], // Added insights field
          views: 0,
          ...(post.status === 'published' ? { published_at: new Date().toISOString() } : {})
        }])
        .select()
      
      if (error) {
        console.error('Insert error:', error)
        throw error
      }
      
      if (data && data[0]) {
        postId = data[0].id
        
        // Save initial version
        if (postId) {
          await saveVersion(postId, post, versionNote || 'Initial version', user?.email || 'admin')
        }
      } else {
        throw new Error('Failed to create post - no data returned')
      }
    }
    
    revalidatePath('/blog')
    revalidatePath('/admin/blog')
    
    return { success: true, id: postId }
  } catch (error: any) {
    console.error('Error saving post:', error)
    return { success: false, error: error.message }
  }
}

// Delete blog post
export async function deleteBlogPost(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  try {
    // First, delete all versions
    const { error: versionError } = await supabase
      .from('blog_post_versions')
      .delete()
      .eq('post_id', id)
    
    if (versionError) {
      console.error('Error deleting versions:', versionError)
    }
    
    // Then delete the post
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    revalidatePath('/blog')
    revalidatePath('/admin/blog')
    
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting post:', error)
    return { success: false, error: error.message }
  }
}

// Restore a post from a version
export async function restorePostVersion(
  postId: string,
  versionId: string,
  changeNote: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  try {
    // Get the version to restore
    const { data: version, error: versionError } = await supabase
      .from('blog_post_versions')
      .select('*')
      .eq('id', versionId)
      .single()
    
    if (versionError) throw versionError
    if (!version) throw new Error('Version not found')
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    // Update the post with version data
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({
        title: version.title,
        category: version.category,
        excerpt: version.excerpt,
        content: version.content,
        featured_image_url: version.featured_image_url,
        gradient: version.gradient
      })
      .eq('id', postId)
    
    if (updateError) throw updateError
    
    // Save a new version for the restoration
    await saveVersion(postId, {
      title: version.title,
      category: version.category,
      excerpt: version.excerpt,
      content: version.content,
      featured_image_url: version.featured_image_url,
      gradient: version.gradient
    }, changeNote, user?.email || 'admin')
    
    revalidatePath('/blog')
    revalidatePath('/admin/blog')
    
    return { success: true }
  } catch (error: any) {
    console.error('Error restoring version:', error)
    return { success: false, error: error.message }
  }
}

// Get authors
export async function getAuthors(): Promise<Array<{ name: string; bio: string; avatar_url: string; role: string }>> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blog_authors')
    .select('name, bio, avatar_url, role')
    .eq('is_active', true)
    .order('name', { ascending: true })
  
  if (error) {
    console.error('Error fetching authors:', error)
    return []
  }
  
  return data || []
}

// Get categories
export async function getBlogCategories(): Promise<Array<{ name: string; slug: string; description?: string }>> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blog_categories')
    .select('name, slug, description')
    .order('name', { ascending: true })
  
  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  
  return data || []
}

// Add new category (admin only)
export async function addBlogCategory(
  name: string,
  slug: string,
  description?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase
      .from('blog_categories')
      .insert([{ name, slug, description }])
    
    if (error) throw error
    
    revalidatePath('/admin/blog/categories')
    return { success: true }
  } catch (error: any) {
    console.error('Error adding category:', error)
    return { success: false, error: error.message }
  }
}

// Update category (admin only)
export async function updateBlogCategory(
  id: string,
  name: string,
  slug: string,
  description?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase
      .from('blog_categories')
      .update({ name, slug, description })
      .eq('id', id)
    
    if (error) throw error
    
    revalidatePath('/admin/blog/categories')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating category:', error)
    return { success: false, error: error.message }
  }
}

// Delete category (admin only)
export async function deleteBlogCategory(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase
      .from('blog_categories')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    revalidatePath('/admin/blog/categories')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting category:', error)
    return { success: false, error: error.message }
  }
}

// Add new author (admin only)
export async function addBlogAuthor(
  name: string,
  role: string,
  bio: string,
  avatar_url?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase
      .from('blog_authors')
      .insert([{ name, role, bio, avatar_url, is_active: true }])
    
    if (error) throw error
    
    revalidatePath('/admin/blog/authors')
    return { success: true }
  } catch (error: any) {
    console.error('Error adding author:', error)
    return { success: false, error: error.message }
  }
}

// Update author (admin only)
export async function updateBlogAuthor(
  id: string,
  name: string,
  role: string,
  bio: string,
  avatar_url?: string,
  is_active?: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase
      .from('blog_authors')
      .update({ 
        name, 
        role, 
        bio, 
        avatar_url, 
        is_active 
      })
      .eq('id', id)
    
    if (error) throw error
    
    revalidatePath('/admin/blog/authors')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating author:', error)
    return { success: false, error: error.message }
  }
}

// Delete author (admin only)
export async function deleteBlogAuthor(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase
      .from('blog_authors')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    revalidatePath('/admin/blog/authors')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting author:', error)
    return { success: false, error: error.message }
  }
}

// Get related posts - ADDED THIS NEW FUNCTION
export async function getRelatedPosts(currentPostId: string, category: string, limit: number = 2): Promise<BlogPost[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('category', category)
    .eq('status', 'published')
    .neq('id', currentPostId)
    .order('published_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
  
  return data || []
}