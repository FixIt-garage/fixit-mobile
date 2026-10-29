import { afterEach, describe, expect, test } from '@jest/globals';
import { apiGet } from './client';

describe('apiGet', () => {
  afterEach(() => {
    delete process.env.EXPO_PUBLIC_API_URL;
  });

  test('throws an error when API URL is not configured', async () => {
    delete process.env.EXPO_PUBLIC_API_URL;

    await expect(apiGet('/health')).rejects.toThrow(
      'API URL is not configured',
    );
  });
});
