import { counterSelector } from '../../../store/counter/selectors';

describe('counter selectors', () => {
  it('gets counter', () => {
    expect(counterSelector(42)).toBe(42);
  });

  it('properly memoize', () => {
    expect(counterSelector(42)).toBe(42);
    expect(counterSelector(42)).toBe(42);
    expect(counterSelector.recomputations()).toBe(1);
    expect(counterSelector(43)).toBe(43);
    expect(counterSelector.recomputations()).toBe(2);
  });
});
