/**
 * Shared authentication types for auth-astro
 *
 * These types maintain backward compatibility with next-auth interfaces
 * while working with @auth/core
 */

export type { BuiltInProviders } from '@auth/core/providers'
export type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>)

export interface SignInOptions {
	callbackUrl?: string
	redirect?: boolean
}

export interface SignInAuthorizationParams {
	[key: string]: string
}

export interface AstroSignInOptions extends SignInOptions {
	prefix?: string
}

export interface SignOutParams {
	callbackUrl?: string
	redirect?: boolean
}

export interface AstroSignOutParams extends SignOutParams {
	prefix?: string
}
