import { Database } from '@/lib/supabase/types'

type Preview = Database['public']['Tables']['previews']['Row']

export interface PostResult {
  success: boolean
  postId?: string
  url?: string
  error?: string
  timestamp: string
}

export class FakePosterService {
  private static instance: FakePosterService

  static getInstance(): FakePosterService {
    if (!FakePosterService.instance) {
      FakePosterService.instance = new FakePosterService()
    }
    return FakePosterService.instance
  }

  async postToSocialMedia(preview: Preview): Promise<PostResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Simulate 95% success rate
    const success = Math.random() > 0.05

    if (success) {
      const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const platforms = ['twitter', 'linkedin', 'instagram', 'facebook']
      const platform = platforms[Math.floor(Math.random() * platforms.length)]
      
      return {
        success: true,
        postId,
        url: `https://${platform}.com/posts/${postId}`,
        timestamp: new Date().toISOString()
      }
    } else {
      const errors = [
        'Rate limit exceeded',
        'Authentication failed',
        'Content policy violation',
        'Network timeout',
        'Platform temporarily unavailable'
      ]
      
      return {
        success: false,
        error: errors[Math.floor(Math.random() * errors.length)],
        timestamp: new Date().toISOString()
      }
    }
  }

  async postMultiple(previews: Preview[]): Promise<PostResult[]> {
    const results: PostResult[] = []
    
    for (const preview of previews) {
      const result = await this.postToSocialMedia(preview)
      results.push(result)
      
      // Small delay between posts to simulate real-world behavior
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    return results
  }
}

export const fakePoster = FakePosterService.getInstance()
