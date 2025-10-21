import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGuidelines, getGuidelinesByIds } from '@/lib/api/guidelines';

// Mock the database
vi.mock('@/db/drizzle', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          orderBy: vi.fn(),
        })),
        orderBy: vi.fn(),
      })),
    })),
  },
}));

vi.mock('@/db/schemas', () => ({
  guidelines: 'guidelines',
}));

describe('getGuidelines API Function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return guidelines ordered by creation date descending', async () => {
    const { db } = await import('@/db/drizzle');

    const mockGuidelines = [
      {
        id: 1,
        name: 'Ticket Closure Policy',
        text: 'All tickets must be closed with confirmation email',
        createdAt: new Date('2024-01-15T10:30:00Z'),
      },
      {
        id: 2,
        name: 'Customer Data Policy',
        text: 'Customer data changes require verification',
        createdAt: new Date('2024-01-14T15:45:00Z'),
      },
    ];

    const mockOrderBy = vi.fn().mockResolvedValue(mockGuidelines);
    const mockFrom = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    vi.mocked(db.select).mockImplementation(mockSelect);

    const result = await getGuidelines();

    expect(result).toEqual(mockGuidelines);
  });

  it('should return empty array when no guidelines exist', async () => {
    const { db } = await import('@/db/drizzle');

    const mockOrderBy = vi.fn().mockResolvedValue([]);
    const mockFrom = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    vi.mocked(db.select).mockImplementation(mockSelect);

    const result = await getGuidelines();

    expect(result).toEqual([]);
  });

  it('should handle database errors', async () => {
    const { db } = await import('@/db/drizzle');

    const dbError = new Error('Database connection failed');
    const mockOrderBy = vi.fn().mockRejectedValue(dbError);
    const mockFrom = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    vi.mocked(db.select).mockImplementation(mockSelect);

    await expect(getGuidelines()).rejects.toThrow('Database connection failed');
  });

  it('should return guidelines with all required fields', async () => {
    const { db } = await import('@/db/drizzle');

    const mockGuidelines = [
      {
        id: 1,
        name: 'Test Policy',
        text: 'Test guideline text',
        createdAt: new Date('2024-01-15T10:30:00Z'),
      },
    ];

    const mockOrderBy = vi.fn().mockResolvedValue(mockGuidelines);
    const mockFrom = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    vi.mocked(db.select).mockImplementation(mockSelect);

    const result = await getGuidelines();

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('name');
    expect(result[0]).toHaveProperty('text');
    expect(result[0]).toHaveProperty('createdAt');
  });
});

describe('getGuidelinesByIds API Function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return guidelines for given IDs', async () => {
    const { db } = await import('@/db/drizzle');

    const mockGuidelines = [
      {
        id: 1,
        name: 'Ticket Closure Policy',
        text: 'All tickets must be closed with confirmation email',
        createdAt: new Date('2024-01-15T10:30:00Z'),
      },
      {
        id: 2,
        name: 'Customer Data Policy',
        text: 'Customer data changes require verification',
        createdAt: new Date('2024-01-14T15:45:00Z'),
      },
    ];

    const mockOrderBy = vi.fn().mockResolvedValue(mockGuidelines);
    const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    vi.mocked(db.select).mockImplementation(mockSelect);

    const result = await getGuidelinesByIds([1, 2]);

    expect(result).toEqual(mockGuidelines);
    expect(mockWhere).toHaveBeenCalled();
  });

  it('should return empty array when no IDs provided', async () => {
    const result = await getGuidelinesByIds([]);

    expect(result).toEqual([]);
  });

  it('should return empty array when no guidelines found for IDs', async () => {
    const { db } = await import('@/db/drizzle');

    const mockOrderBy = vi.fn().mockResolvedValue([]);
    const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    vi.mocked(db.select).mockImplementation(mockSelect);

    const result = await getGuidelinesByIds([999, 1000]);

    expect(result).toEqual([]);
  });

  it('should handle database errors', async () => {
    const { db } = await import('@/db/drizzle');

    const dbError = new Error('Database connection failed');
    const mockOrderBy = vi.fn().mockRejectedValue(dbError);
    const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    vi.mocked(db.select).mockImplementation(mockSelect);

    await expect(getGuidelinesByIds([1, 2])).rejects.toThrow(
      'Database connection failed',
    );
  });

  it('should return guidelines ordered by creation date descending', async () => {
    const { db } = await import('@/db/drizzle');

    const mockGuidelines = [
      {
        id: 2,
        name: 'Newer Policy',
        text: 'Newer guideline text',
        createdAt: new Date('2024-01-16T10:30:00Z'),
      },
      {
        id: 1,
        name: 'Older Policy',
        text: 'Older guideline text',
        createdAt: new Date('2024-01-15T10:30:00Z'),
      },
    ];

    const mockOrderBy = vi.fn().mockResolvedValue(mockGuidelines);
    const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    vi.mocked(db.select).mockImplementation(mockSelect);

    const result = await getGuidelinesByIds([1, 2]);

    expect(result).toEqual(mockGuidelines);
    expect(mockOrderBy).toHaveBeenCalled();
  });
});
