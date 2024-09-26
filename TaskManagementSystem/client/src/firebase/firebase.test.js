import { getUserProjectIds, createUserDocument } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Mock Firestore functions
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  collection: jest.fn()
}));

describe('createUserDocument', () => {
  const mockUid = 'test-uid';
  const mockUser = {
    email: 'test@example.com',
    displayName: 'Test User',
  };

  const mockRef = { withConverter: jest.fn().mockReturnThis() };
  const mockSnap = { exists: jest.fn() };

  beforeEach(() => {
    doc.mockReturnValue(mockRef);
    getDoc.mockResolvedValue(mockSnap);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user document if it does not exist', async () => {
    // Mock snap.exists to return false
    mockSnap.exists.mockReturnValue(false);

    await createUserDocument(mockUid, mockUser);

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', mockUid);
    expect(getDoc).toHaveBeenCalledWith(mockRef);
    expect(setDoc).toHaveBeenCalledWith(mockRef, mockUser);
  });

  it('should not create a new user document if it already exists', async () => {
    // Mock snap.exists to return true
    mockSnap.exists.mockReturnValue(true);

    await createUserDocument(mockUid, mockUser);

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', mockUid);
    expect(getDoc).toHaveBeenCalledWith(mockRef);
    expect(setDoc).not.toHaveBeenCalled();
  });
});