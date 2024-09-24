import {isExpired} from "./dateHandler"
import 'jest';

test('Check an expired task is expired', () => {
  const input = "2024-09-01 08:00";
  const expectedOutput = true
  jest
  .useFakeTimers()
  .setSystemTime(new Date('2025-01-01'));
  expect(isExpired(input)).toBe(expectedOutput);

});

test('Check a task is not expired', () => {
  const input = "2024-09-01 08:00";
  jest
  .useFakeTimers()
  .setSystemTime(new Date('2022-01-01'));
  const expectedOutput = false;

  expect(isExpired(input)).toBe(expectedOutput);
});