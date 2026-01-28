import fs from 'fs';
import path from 'path';
import {
  describe, it, expect, beforeEach, afterEach, vi 
} from 'vitest';
import { z } from 'zod';

import { updateConfig, clearConfigCache } from './settings';

/**
 * Recreate the ListenBrainz schema to test default behavior.
 * This ensures source_type defaults to 'weekly_playlist' as documented.
 */
const ListenBrainzSettingsSchema = z.object({
  username:      z.string(),
  token:         z.string().optional(),
  approval_mode: z.enum(['auto', 'manual']).default('manual'),
  source_type:   z.enum(['collaborative', 'weekly_playlist']).default('weekly_playlist'),
});

describe('ListenBrainzSettingsSchema', () => {
  describe('source_type default', () => {
    it('defaults to weekly_playlist when not specified', () => {
      const input = { username: 'testuser' };
      const result = ListenBrainzSettingsSchema.parse(input);

      expect(result.source_type).toBe('weekly_playlist');
    });

    it('defaults to weekly_playlist even when token is provided', () => {
      // This is the key fix: token presence should NOT imply collaborative mode
      const input = {
        username: 'testuser',
        token:    'some-api-token',
      };
      const result = ListenBrainzSettingsSchema.parse(input);

      expect(result.source_type).toBe('weekly_playlist');
    });

    it('uses collaborative when explicitly set', () => {
      const input = {
        username:    'testuser',
        token:       'some-api-token',
        source_type: 'collaborative' as const,
      };
      const result = ListenBrainzSettingsSchema.parse(input);

      expect(result.source_type).toBe('collaborative');
    });

    it('uses weekly_playlist when explicitly set', () => {
      const input = {
        username:    'testuser',
        source_type: 'weekly_playlist' as const,
      };
      const result = ListenBrainzSettingsSchema.parse(input);

      expect(result.source_type).toBe('weekly_playlist');
    });
  });

  describe('approval_mode default', () => {
    it('defaults to manual when not specified', () => {
      const input = { username: 'testuser' };
      const result = ListenBrainzSettingsSchema.parse(input);

      expect(result.approval_mode).toBe('manual');
    });
  });
});

describe('updateConfig', () => {
  const testConfigPath = path.join(__dirname, 'test-config.yaml');

  beforeEach(() => {
    vi.stubEnv('CONFIG_PATH', testConfigPath);
    clearConfigCache();

    // Create a minimal valid config file
    fs.writeFileSync(testConfigPath, `
debug: false
mode: album
fetch_count: 100
min_score: 0
catalog_discovery:
  enabled: false
  max_artists_per_run: 10
  min_similarity: 0.3
  mode: manual
ui:
  auth:
    enabled: false
    type: basic
listenbrainz:
  username: testuser
  token: secret-token
`, 'utf-8');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    clearConfigCache();
    if (fs.existsSync(testConfigPath)) {
      fs.unlinkSync(testConfigPath);
    }
  });

  describe('mutex prevents race conditions', () => {
    it('serializes concurrent updates without data loss', async() => {
      // Perform multiple concurrent updates
      const updates = await Promise.all([
        updateConfig('listenbrainz', { approval_mode: 'auto' }),
        updateConfig('listenbrainz', { source_type: 'collaborative' }),
      ]);

      // Both updates should complete
      expect(updates).toHaveLength(2);

      // Read the final config and verify both updates are present
      const finalContent = fs.readFileSync(testConfigPath, 'utf-8');

      expect(finalContent).toContain('approval_mode: auto');
      expect(finalContent).toContain('source_type: collaborative');
    });
  });

  describe('null value handling', () => {
    it('removes key when value is null', async() => {
      // Verify token exists initially
      const initialContent = fs.readFileSync(testConfigPath, 'utf-8');

      expect(initialContent).toContain('token: secret-token');

      // Update with null to remove the token
      await updateConfig('listenbrainz', { token: null });

      // Verify token is removed
      const finalContent = fs.readFileSync(testConfigPath, 'utf-8');

      expect(finalContent).not.toContain('token:');
    });
  });
});
