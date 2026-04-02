import { clamp } from './math';

describe('clamp', () => {
  it('returns the value if it is within the bounds', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, -10, 0)).toBe(-5);
  });

  it('returns the minimum bound if the value is less than the minimum', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(5, 10, 20)).toBe(10);
  });

  it('returns the maximum bound if the value is greater than the maximum', () => {
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(25, 10, 20)).toBe(20);
  });

  it('handles minimum and maximum being the same value', () => {
    expect(clamp(5, 10, 10)).toBe(10);
    expect(clamp(15, 10, 10)).toBe(10);
  });
});
