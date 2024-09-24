import {extractDate} from "./dateHandler"

test('extracts date correctly from YYYY-MM-DD HH:mm format', () => {
  const input = "2024-09-28 08:00";
  const expectedOutput = "2024-09-28";
  expect(extractDate(input)).toBe(expectedOutput);
});