// Uncomment the code below and write your tests
import { random } from 'lodash';
import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from './index';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

const initialBalance = 1000;

let account: BankAccount;

beforeEach(() => {
  account = getBankAccount(initialBalance);
});

describe('BankAccount', () => {
  test('should create account with initial balance', async () => {
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(initialBalance + 1000)).toThrowError(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const toAccount = new BankAccount(0);
    expect(() =>
      account.transfer(account.getBalance() + 1000, toAccount),
    ).toThrowError(InsufficientFundsError);
    expect(account.getBalance()).toBe(initialBalance);
    expect(toAccount.getBalance()).toBe(0);
  });

  test('should throw error when transferring to the same account', () => {
    expect(() =>
      account.transfer(account.getBalance() - 1000, account),
    ).toThrowError(TransferFailedError);
  });

  test('should deposit money', () => {
    const amountToDeposit = 1000;
    const currentAmount = account.getBalance();
    expect(account.deposit(amountToDeposit).getBalance()).toBe(
      currentAmount + amountToDeposit,
    );
  });

  test('should withdraw money', () => {
    const amountToWithdraw = 1000;
    const currentAmount = account.getBalance();
    expect(account.withdraw(amountToWithdraw).getBalance()).toBe(
      currentAmount - amountToWithdraw,
    );
  });

  test('should transfer money', () => {
    const toAccount = new BankAccount(0);
    const currentAmount = account.getBalance();
    const amountToTransfer = 500;
    account.transfer(amountToTransfer, toAccount);
    expect(account.getBalance()).toBe(currentAmount - amountToTransfer);
    expect(toAccount.getBalance()).toBe(amountToTransfer);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    (random as jest.Mock).mockReturnValueOnce(50);
    (random as jest.Mock).mockReturnValueOnce(1);
    const balance = await account.fetchBalance();
    expect(balance).toBe(50);
    (random as jest.Mock).mockClear();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    (random as jest.Mock).mockReturnValueOnce(50);
    (random as jest.Mock).mockReturnValueOnce(1);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(50);
    (random as jest.Mock).mockClear();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    (random as jest.Mock).mockReturnValue(0);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
    (random as jest.Mock).mockClear();
  });
});
