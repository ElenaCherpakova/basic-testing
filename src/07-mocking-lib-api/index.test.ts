// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';
jest.mock('axios', () => ({
  create: jest.fn(),
}));

describe('throttledGetDataFromApi', () => {
  let mockGet: jest.Mock;
  beforeEach(() => {
    jest.useFakeTimers();
    mockGet = jest.fn().mockResolvedValue({ data: 'response' });
    (axios.create as jest.Mock).mockReturnValue({
      get: mockGet,
    });
  });
  afterEach(() => {
    jest.runOnlyPendingTimers(); // finish all active timers
    jest.useRealTimers(); // return real timers
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi('/users');
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi('/users');
    jest.advanceTimersByTime(5000);
    expect(mockGet).toHaveBeenCalledWith('/users');
  });

  test('should return response data', async () => {
    const data = await throttledGetDataFromApi('/users');
    expect(data).toBe('response');
  });
});
