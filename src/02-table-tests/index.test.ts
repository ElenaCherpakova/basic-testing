// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 2, b: 1, action: Action.Subtract, expected: 1 },
  { a: 2, b: 2, action: Action.Divide, expected: 1 },
  { a: 2, b: 2, action: Action.Multiply, expected: 4 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: '1', b: 3, action: Action.Add, expected: null },
  { a: 1, b: '3', action: Action.Add, expected: null },
  { a: 1, b: 3, action: 'invalidAction', expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should perform %action correctly on %a and %b and return %expected',
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );
});
