// Uncomment the code below and write your tests
import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    const value = [1];
    const expectedLinkedList = {
      value: 1,
      next: {
        value: null,
        next: null,
      },
    };
    expect(generateLinkedList(value)).toStrictEqual(expectedLinkedList);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    const values = [true, 2, 'string', {}];
    expect(generateLinkedList(values)).toMatchSnapshot();
  });
});
