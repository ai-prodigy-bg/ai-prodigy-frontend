/**
 * Contact Form Integration Utility
 * 
 * This utility provides type-safe functions for submitting contact forms
 * and handling responses from the /api/contact endpoint.
 */

export interface ContactFormData {
  name: string
  email: string
  projectType: string
  message: string
}

export interface ContactFormResponse {
  success: boolean
  message?: string
  timestamp?: string
  error?: string
  validationErrors?: Array<{
    field: string
    message: string
  }>
  details?: string
}

export interface ContactFormOptions {
  onSuccess?: (response: ContactFormResponse) => void
  onError?: (error: ContactFormResponse) => void
  onLoading?: (isLoading: boolean) => void
}

/**
 * Submit contact form data to the API endpoint
 */
export async function submitContactForm(
  data: ContactFormData,
  options?: ContactFormOptions
): Promise<ContactFormResponse> {
  const { onSuccess, onError, onLoading } = options || {}
  
  try {
    onLoading?.(true)
    
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    const result: ContactFormResponse = await response.json()
    
    if (result.success) {
      onSuccess?.(result)
    } else {
      onError?.(result)
    }
    
    return result
    
  } catch (error) {
    const errorResponse: ContactFormResponse = {
      success: false,
      error: 'Network error. Please check your connection and try again.',
    }
    
    onError?.(errorResponse)
    return errorResponse
    
  } finally {
    onLoading?.(false)
  }
}

/**
 * React Hook for managing contact form state
 * Usage in a React component:
 * 
 * ```tsx
 * import { useContactForm } from '@/lib/contact-form'
 * 
 * export function ContactForm() {
 *   const { submitForm, isLoading, error, success } = useContactForm()
 *   
 *   const handleSubmit = async (formData: ContactFormData) => {
 *     await submitForm(formData)
 *   }
 *   
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {error && <div className="error">{error}</div>}
 *       {success && <div className="success">{success}</div>}
 *       {/* form fields */}
 *       <button type="submit" disabled={isLoading}>
 *         {isLoading ? 'Sending...' : 'Send Message'}
 *       </button>
 *     </form>
 *   )
 * }
 * ```
 */
export function useContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  
  const submitForm = async (data: ContactFormData) => {
    setError(null)
    setSuccess(null)
    setValidationErrors({})
    
    const result = await submitContactForm(data, {
      onLoading: setIsLoading,
      onSuccess: (response) => {
        setSuccess(response.message || 'Message sent successfully!')
      },
      onError: (response) => {
        setError(response.error || 'Something went wrong')
        
        // Handle validation errors
        if (response.validationErrors) {
          const errors: Record<string, string> = {}
          response.validationErrors.forEach(({ field, message }) => {
            errors[field] = message
          })
          setValidationErrors(errors)
        }
      }
    })
    
    return result
  }
  
  const clearMessages = () => {
    setError(null)
    setSuccess(null)
    setValidationErrors({})
  }
  
  return {
    submitForm,
    isLoading,
    error,
    success,
    validationErrors,
    clearMessages,
  }
}

// Note: Import useState from React if using the hook
// import { useState } from 'react'