import { version } from '../index';

describe('Stately', () => {
  it('should export version', () => {
    expect(version).toBe('0.1.0');
  });
});
