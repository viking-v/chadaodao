import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Check if we're in development without Supabase configured
const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo.supabase.co')

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  if (isMockMode) {
    // Return a mock server client for development
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

  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // The "setAll" method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )
}
