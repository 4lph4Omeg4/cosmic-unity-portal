/**
 * Utility functions for handling and serializing errors
 */

export interface SerializedError {
  message: string;
  name?: string;
  stack?: string;
  code?: string;
  details?: any;
}

/**
 * Safely serializes an error object to a readable string
 */
export function serializeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (typeof error === 'object' && error !== null) {
    try {
      // Try to extract common error properties
      const errorObj = error as any;
      
      if (errorObj.message) {
        return errorObj.message;
      }
      
      if (errorObj.error && typeof errorObj.error === 'string') {
        return errorObj.error;
      }
      
      if (errorObj.details && typeof errorObj.details === 'string') {
        return errorObj.details;
      }
      
      // For Supabase errors
      if (errorObj.hint || errorObj.details || errorObj.code) {
        const parts = [];
        if (errorObj.message) parts.push(errorObj.message);
        if (errorObj.hint) parts.push(`Hint: ${errorObj.hint}`);
        if (errorObj.details) parts.push(`Details: ${errorObj.details}`);
        if (errorObj.code) parts.push(`Code: ${errorObj.code}`);
        return parts.join(' | ');
      }
      
      // Last resort: stringify
      return JSON.stringify(error);
    } catch (stringifyError) {
      return 'An unknown error occurred';
    }
  }
  
  return 'An unknown error occurred';
}

/**
 * Safely logs an error with proper serialization
 */
export function logError(context: string, error: unknown): void {
  const serialized = serializeError(error);
  console.error(`${context}:`, serialized);
  
  // Also log the original error for debugging
  if (error instanceof Error) {
    console.error('Original error object:', error);
  } else if (typeof error === 'object') {
    console.error('Original error object:', error);
  }
}

/**
 * Creates a user-friendly error message from any error
 */
export function getUserFriendlyError(error: unknown, fallback: string = 'Something went wrong'): string {
  const serialized = serializeError(error);
  
  // Common error patterns and their user-friendly versions
  const errorMappings: Record<string, string> = {
    'fetch_failed': 'Network connection failed. Please check your internet connection.',
    'unauthorized': 'You are not authorized to perform this action.',
    'forbidden': 'Access denied.',
    'not_found': 'The requested resource was not found.',
    'timeout': 'The request timed out. Please try again.',
    'network_error': 'Network error. Please check your connection.',
    'server_error': 'Server error. Please try again later.',
  };
  
  // Check for common patterns
  for (const [pattern, message] of Object.entries(errorMappings)) {
    if (serialized.toLowerCase().includes(pattern)) {
      return message;
    }
  }
  
  // Return the serialized error if it's readable, otherwise the fallback
  if (serialized && serialized !== 'An unknown error occurred' && !serialized.includes('[object Object]')) {
    return serialized;
  }
  
  return fallback;
}
