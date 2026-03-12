import { describe, it, expect, vi } from 'vitest';
import client from './client';

describe('API Client', () => {
  it('should have the correct base URL', () => {
    expect(client.defaults.baseURL).toEqual(import.meta.env.VITE_API_BASEURL);
  });
});
