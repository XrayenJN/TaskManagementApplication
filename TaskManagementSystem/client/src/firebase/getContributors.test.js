import { getContributors } from "./firebase";
import { getDoc, doc } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(),
  doc: jest.fn(),
}));

describe('getContributors', () => {
  const projectId = 'testProjectId';

  it('should return contributors when the project exists', async () => {
    // Mock the data returned from getDoc for the project
    const userRefs = [{ id: 'user1' }, { id: 'user2' }]; // Mock user document references
    const projectSnapshot = {
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({ contributors: userRefs }),
    };

    const userSnapshots = [
      { data: jest.fn().mockReturnValue({ name: 'User 1', email: 'user1@example.com' }) },
      { data: jest.fn().mockReturnValue({ name: 'User 2', email: 'user2@example.com' }) },
    ];

    getDoc
      .mockResolvedValueOnce(projectSnapshot) // First call returns the project snapshot
      .mockResolvedValueOnce(userSnapshots[0]) // Second call returns first user snapshot
      .mockResolvedValueOnce(userSnapshots[1]); // Third call returns second user snapshot

    const result = await getContributors(projectId);

    expect(result).toEqual([
      { name: 'User 1', email: 'user1@example.com' },
      { name: 'User 2', email: 'user2@example.com' },
    ]);

    expect(getDoc).toHaveBeenCalledTimes(3);
  });

  it('should return an empty array when the project does not exist', async () => {
    const projectSnapshot = {
      exists: jest.fn().mockReturnValue(false),
    };

    getDoc.mockResolvedValueOnce(projectSnapshot);

    const result = await getContributors(projectId);

    expect(result).toEqual([]);
    expect(getDoc).toHaveBeenCalledTimes(4);
  });
});