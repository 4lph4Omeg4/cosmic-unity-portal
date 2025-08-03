import { supabase } from '@/integrations/supabase/client';

export interface NewsletterSubscription {
  id?: string;
  email: string;
  name?: string;
  consent: boolean;
  source: 'footer' | 'homepage' | 'popup' | 'other';
  language?: string;
  created_at?: string;
  updated_at?: string;
}

export class NewsletterService {
  /**
   * Subscribe a user to the newsletter
   */
  static async subscribe(subscription: Omit<NewsletterSubscription, 'id' | 'created_at' | 'updated_at'>): Promise<{
    success: boolean;
    data?: NewsletterSubscription;
    error?: string;
  }> {
    try {
      // For now, we'll use a simple approach - store in localStorage and console log
      // In production, you'd want to create a dedicated table or use an external service
      
      const subscriptionData = {
        ...subscription,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Store locally for demo purposes
      const existingSubscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
      
      // Check if email already exists
      const existingIndex = existingSubscriptions.findIndex((sub: NewsletterSubscription) => sub.email === subscription.email);
      
      if (existingIndex >= 0) {
        // Update existing subscription
        existingSubscriptions[existingIndex] = {
          ...existingSubscriptions[existingIndex],
          ...subscriptionData,
          updated_at: new Date().toISOString(),
        };
      } else {
        // Add new subscription
        existingSubscriptions.push(subscriptionData);
      }

      localStorage.setItem('newsletter_subscriptions', JSON.stringify(existingSubscriptions));

      // In production, you could send this to:
      // 1. A Supabase table
      // 2. Mailchimp API
      // 3. ConvertKit API
      // 4. Your own backend API

      console.log('Newsletter subscription:', subscriptionData);

      return {
        success: true,
        data: subscriptionData,
      };

    } catch (error) {
      console.error('Newsletter subscription error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get all newsletter subscriptions (for admin purposes)
   */
  static async getSubscriptions(): Promise<{
    success: boolean;
    data?: NewsletterSubscription[];
    error?: string;
  }> {
    try {
      const subscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
      
      return {
        success: true,
        data: subscriptions,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch subscriptions',
      };
    }
  }

  /**
   * Unsubscribe from newsletter
   */
  static async unsubscribe(email: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const existingSubscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
      const filteredSubscriptions = existingSubscriptions.filter((sub: NewsletterSubscription) => sub.email !== email);
      
      localStorage.setItem('newsletter_subscriptions', JSON.stringify(filteredSubscriptions));

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to unsubscribe',
      };
    }
  }

  /**
   * Integration with external services
   */
  static async integrateWithMailchimp(subscription: NewsletterSubscription, apiKey: string, listId: string): Promise<boolean> {
    try {
      // Mailchimp integration example
      const response = await fetch(`https://us1.api.mailchimp.com/3.0/lists/${listId}/members`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: subscription.email,
          status: 'subscribed',
          merge_fields: {
            FNAME: subscription.name?.split(' ')[0] || '',
            LNAME: subscription.name?.split(' ').slice(1).join(' ') || '',
          },
          tags: ['sh4m4ni4k', subscription.source],
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Mailchimp integration error:', error);
      return false;
    }
  }

  /**
   * Integration with Supabase (when table is available)
   */
  static async integrateWithSupabase(subscription: NewsletterSubscription): Promise<boolean> {
    try {
      // This would work if you have a newsletter_subscriptions table in Supabase
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .insert([
          {
            email: subscription.email,
            name: subscription.name,
            consent: subscription.consent,
            source: subscription.source,
            language: subscription.language,
          }
        ]);

      if (error) {
        console.error('Supabase newsletter error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Supabase integration error:', error);
      return false;
    }
  }
}

// Export convenience functions
export const subscribeToNewsletter = NewsletterService.subscribe;
export const getNewsletterSubscriptions = NewsletterService.getSubscriptions;
export const unsubscribeFromNewsletter = NewsletterService.unsubscribe;
