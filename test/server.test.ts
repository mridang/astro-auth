// test/server.test.ts

import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';
import type { APIContext } from 'astro';
import GitHub from '@auth/core/providers/github';

const originalImportMeta = import.meta;

describe('Server Module', () => {
  beforeEach(() => {
    Object.defineProperty(import.meta, 'env', {
      value: {
        AUTH_SECRET: 'test-secret-at-least-32-characters-long',
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(import.meta, 'env', {
      value: originalImportMeta.env,
      writable: true,
      configurable: true,
    });
  });

  describe('AstroAuth', () => {
    it('should return object with GET and POST methods', async () => {
      const { AstroAuth } = await import('../src/server');
      const result = AstroAuth({ providers: [] });

      expect(result).toHaveProperty('GET');
      expect(result).toHaveProperty('POST');
      expect(typeof result.GET).toBe('function');
      expect(typeof result.POST).toBe('function');
    });

    it('should use default prefix when not provided', async () => {
      const { AstroAuth } = await import('../src/server');

      const { GET } = AstroAuth({
        providers: [],
        secret: 'test-secret-at-least-32-characters-long',
        basePath: '/api/auth',
        trustHost: true,
      });
      const context = {
        request: new Request('http://localhost/api/auth/providers'),
      } as APIContext;

      const response = await GET(context);

      expect(response).toBeInstanceOf(Response);
      expect(response?.status).toBe(200);
    });

    it('should use custom prefix when provided', async () => {
      const { AstroAuth } = await import('../src/server');

      const { GET } = AstroAuth({
        providers: [],
        secret: 'test-secret-at-least-32-characters-long',
        prefix: '/custom-auth',
        basePath: '/custom-auth',
        trustHost: true,
      });
      const context = {
        request: new Request('http://localhost/custom-auth/providers'),
      } as APIContext;

      const response = await GET(context);

      expect(response).toBeInstanceOf(Response);
      expect(response?.status).toBe(200);
    });

    it('should not handle requests outside prefix', async () => {
      const { AstroAuth } = await import('../src/server');

      const { GET } = AstroAuth({
        providers: [],
        secret: 'test-secret-at-least-32-characters-long',
        prefix: '/api/auth',
        basePath: '/api/auth',
        trustHost: true,
      });
      const context = {
        request: new Request('http://localhost/other/path'),
      } as APIContext;

      const result = await GET(context);

      expect(result).toBeUndefined();
    });

    it('should handle POST requests', async () => {
      const { AstroAuth } = await import('../src/server');

      const { GET } = AstroAuth({
        providers: [],
        secret: 'test-secret-at-least-32-characters-long',
        basePath: '/api/auth',
        trustHost: true,
      });
      const context = {
        request: new Request('http://localhost/api/auth/csrf'),
      } as APIContext;

      const response = await GET(context);

      expect(response).toBeInstanceOf(Response);
      expect(response?.status).toBe(200);
    });

    it('should work with configured providers', async () => {
      const { AstroAuth } = await import('../src/server');

      const { GET } = AstroAuth({
        providers: [
          GitHub({
            clientId: 'test-client-id',
            clientSecret: 'test-client-secret',
          }),
        ],
        secret: 'test-secret-at-least-32-characters-long',
        basePath: '/api/auth',
        trustHost: true,
      });
      const context = {
        request: new Request('http://localhost/api/auth/providers'),
      } as APIContext;

      const response = await GET(context);

      expect(response).toBeInstanceOf(Response);

      // @ts-expect-error since json doesn't exit
      const data = await response!.json();

      expect(data).toHaveProperty('github');
      expect(data.github).toHaveProperty('id', 'github');
      expect(data.github).toHaveProperty('name', 'GitHub');
    });
  });

  describe('getSession', () => {
    it('should return null when no session exists', async () => {
      const { getSession } = await import('../src/server');

      const request = new Request('http://localhost');
      const config = {
        providers: [],
        secret: 'test-secret-at-least-32-characters-long',
        basePath: '/api/auth',
        trustHost: true,
      };

      const result = await getSession(request, config);

      expect(result).toBeNull();
    });

    it('should return null for request without cookies', async () => {
      const { getSession } = await import('../src/server');

      const request = new Request('http://localhost', {
        headers: {
          cookie: '',
        },
      });
      const config = {
        providers: [],
        secret: 'test-secret-at-least-32-characters-long',
        basePath: '/api/auth',
        trustHost: true,
      };

      const result = await getSession(request, config);

      expect(result).toBeNull();
    });

    it('should handle requests with cookies gracefully', async () => {
      const { getSession } = await import('../src/server');

      const request = new Request('http://localhost', {
        headers: {
          cookie: 'invalid-session-cookie=value',
        },
      });
      const config = {
        providers: [],
        secret: 'test-secret-at-least-32-characters-long',
        basePath: '/api/auth',
        trustHost: true,
      };

      const result = await getSession(request, config);

      expect(result).toBeNull();
    });
  });
});
