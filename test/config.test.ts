import { describe, expect, it } from '@jest/globals';
import type { Plugin } from 'vite';
import { defineConfig, virtualConfigModule } from '../src/config';

describe('Config Module', () => {
  describe('defineConfig', () => {
    it('should return the config object unchanged when all values provided', () => {
      const config = {
        providers: [],
        secret: 'my-secret',
        prefix: '/custom-auth',
        basePath: '/custom-auth',
      };

      const result = defineConfig(config);

      expect(result).toEqual(config);
    });

    it('should set default prefix when not provided', () => {
      const config = {
        providers: [],
        secret: 'my-secret',
      };

      const result = defineConfig(config);

      expect(result.prefix).toBe('/api/auth');
    });

    it('should set basePath to match prefix', () => {
      const config = {
        providers: [],
        secret: 'my-secret',
        prefix: '/custom-auth',
      };

      const result = defineConfig(config);

      expect(result.basePath).toBe('/custom-auth');
    });

    it('should preserve custom prefix when provided', () => {
      const config = {
        providers: [],
        secret: 'my-secret',
        prefix: '/my-auth',
      };

      const result = defineConfig(config);

      expect(result.prefix).toBe('/my-auth');
      expect(result.basePath).toBe('/my-auth');
    });

    it('should not override existing basePath with prefix', () => {
      const config = {
        providers: [],
        secret: 'my-secret',
        prefix: '/custom-auth',
      };

      const result = defineConfig(config);

      expect(result.basePath).toBe('/custom-auth');
    });
  });

  describe('virtualConfigModule', () => {
    it('should return Vite plugin object with correct structure', () => {
      const plugin = virtualConfigModule() as Plugin;

      expect(plugin).toHaveProperty('name');
      expect(plugin).toHaveProperty('resolveId');
      expect(plugin).toHaveProperty('load');
      expect(plugin.name).toBe('astro-auth-config');
    });

    it('should use default config file path when not provided', () => {
      const plugin = virtualConfigModule() as Plugin;
      const loadFn = plugin.load as (id: string) => string | undefined;

      const result = loadFn('\0auth:config');

      expect(result).toContain('./auth.config');
    });

    it('should use custom config file path when provided', () => {
      const plugin = virtualConfigModule('./custom/auth.ts') as Plugin;
      const loadFn = plugin.load as (id: string) => string | undefined;

      const result = loadFn('\0auth:config');

      expect(result).toContain('./custom/auth.ts');
    });

    it('should resolve virtual module ID correctly', () => {
      const plugin = virtualConfigModule() as Plugin;
      const resolveIdFn = plugin.resolveId as (
        id: string,
      ) => string | undefined;

      const result = resolveIdFn('auth:config');

      expect(result).toBe('\0auth:config');
    });

    it('should not resolve non-virtual module IDs', () => {
      const plugin = virtualConfigModule() as Plugin;
      const resolveIdFn = plugin.resolveId as (
        id: string,
      ) => string | undefined;

      const result = resolveIdFn('some-other-module');

      expect(result).toBeUndefined();
    });

    it('should return import statement for virtual module', () => {
      const plugin = virtualConfigModule('./my-auth.config') as Plugin;
      const loadFn = plugin.load as (id: string) => string | undefined;

      const result = loadFn('\0auth:config');

      expect(result).toBe(
        'import authConfig from "./my-auth.config"; export default authConfig',
      );
    });

    it('should not load non-virtual module IDs', () => {
      const plugin = virtualConfigModule() as Plugin;
      const loadFn = plugin.load as (id: string) => string | undefined;

      const result = loadFn('some-other-id');

      expect(result).toBeUndefined();
    });
  });
});
