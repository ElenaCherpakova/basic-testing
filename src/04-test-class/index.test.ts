// Uncomment the code below and write your tests
import { random } from 'lodash';
import {
  BankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from './index';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));
describe('BankAccount', () => {
  test('should create account with initial balance', async () => {
    const initialBalance = 1000;
    const account = new BankAccount(initialBalance);
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initialBalance = 1000;
    const account = new BankAccount(initialBalance);
    expect(() => account.withdraw(2000)).toThrowError(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const initialBalance = 1000;
    const account = new BankAccount(initialBalance);
    const toAccount = new BankAccount(0);
    expect(() => account.transfer(2000, toAccount)).toThrowError(
      InsufficientFundsError,
    );
    expect(account.getBalance()).toBe(1000);
    expect(toAccount.getBalance()).toBe(0);
  });

  test('should throw error when transferring to the same account', () => {
    const initialBalance = 1000;
    const account = new BankAccount(initialBalance);
    expect(() => account.transfer(1000, account)).toThrowError(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const amount = 1000;
    const account = new BankAccount(0);
    account.deposit(amount);
    expect(account.getBalance()).toBe(amount);
  });

  test('should withdraw money', () => {
    const initialBalance = 1000;
    const account = new BankAccount(initialBalance);
    const amount = 1000;
    account.withdraw(amount);
    expect(account.getBalance()).toBe(0);
    expect(() => account.withdraw(2000)).toThrowError(InsufficientFundsError);
  });

  test('should transfer money', () => {
    const initialBalance = 1000;
    const account = new BankAccount(initialBalance);
    const toAccount = new BankAccount(0);
    account.transfer(500, toAccount);
    expect(account.getBalance()).toBe(500);
    expect(toAccount.getBalance()).toBe(500);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    (random as jest.Mock).mockReturnValueOnce(50);
    (random as jest.Mock).mockReturnValueOnce(1);

    const account = new BankAccount(1000);
    const balance = await account.fetchBalance();
    expect(balance).toBe(50);
    (random as jest.Mock).mockClear();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    (random as jest.Mock).mockReturnValueOnce(50);
    (random as jest.Mock).mockReturnValueOnce(1);

    const account = new BankAccount(1000);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(50);
    (random as jest.Mock).mockClear();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    (random as jest.Mock).mockReturnValue(0);
    const account = new BankAccount(1000);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
    (random as jest.Mock).mockClear();
  });
});
