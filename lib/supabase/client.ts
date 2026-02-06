import { createBrowserClient } from '@supabase/ssr'

// Check if we're in development without Supabase configured
const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo.supabase.co')

export function createClient() {
  if (isMockMode) {
    // Return a mock client for development
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: { id: 'test-user-id', email: 'test@chadao.com' } }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: { id: 'test-user-id', email: 'test@chadao.com' } }, error: null }),
        signUp: () => Promise.resolve({ data: { user: { id: 'test-user-id', email: 'test@chadao.com' } }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        exchangeCodeForSession: () => Promise.resolve({ data: { user: { id: 'test-user-id', email: 'test@chadao.com' } }, error: null })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
            then: () => Promise.resolve({ data: [], error: null })
          }),
          single: () => Promise.resolve({ data: null, error: null }),
          then: () => Promise.resolve({ data: [], error: null }),
          order: () => ({
            then: () => Promise.resolve({ data: [], error: null })
          })
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: null })
          })
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: null })
            })
          })
        }),
        delete: () => ({
          eq: () => Promise.resolve({ error: null })
        })
      })
    } as any
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
