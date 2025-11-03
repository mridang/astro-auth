/**
 * Auth.js integration for Astro.
 *
 * Provides authentication capabilities using Auth.js (formerly NextAuth.js)
 * with support for OAuth providers, credentials, magic links, and more.
 *
 * @packageDocumentation
 *
 * @example Basic Usage
 * ```js
 * // astro.config.mjs
 * import { defineConfig } from 'astro/config'
 * import authAstro from 'astro-auth'
 *
 * export default defineConfig({
 *   output: 'server',
 *   integrations: [authAstro()]
 * })
 * ```
 *
 * @example With Configuration
 * ```js
 * // astro.config.mjs
 * import authAstro from 'astro-auth'
 *
 * export default defineConfig({
 *   integrations: [
 *     authAstro({
 *       prefix: '/auth',
 *       configFile: './config/auth.ts'
 *     })
 *   ]
 * })
 * ```
 *
 * @example Creating Auth Configuration
 * ```ts
 * // auth.config.ts
 * import { defineConfig } from 'astro-auth'
 * import GitHub from '@auth/core/providers/github'
 *
 * export default defineConfig({
 *   providers: [
 *     GitHub({
 *       clientId: process.env.GITHUB_ID,
 *       clientSecret: process.env.GITHUB_SECRET
 *     })
 *   ],
 *   secret: process.env.AUTH_SECRET
 * })
 * ```
 *
 * @example Using Components
 * ```astro
 * ---
 * import { SignIn, SignOut, Auth } from 'astro-auth'
 * ---
 *
 * <Auth>
 *   {session => (
 *     session ? (
 *       <SignOut>Sign out</SignOut>
 *     ) : (
 *       <SignIn provider="github">Sign in with GitHub</SignIn>
 *     )
 *   )}
 * </Auth>
 * ```
 *
 * @public
 */

export { default } from './integration';
export { defineConfig } from './config';

// Component exports are consumed by end users importing from the package.
// IDEs cannot detect usage across package boundaries, resulting in false
// positive unused export warnings.
// noinspection JSUnusedGlobalSymbols
export { default as Auth } from './components/Auth.astro';
// noinspection JSUnusedGlobalSymbols
export { default as SignIn } from './components/SignIn.astro';
// noinspection JSUnusedGlobalSymbols
export { default as SignOut } from './components/SignOut.astro';
