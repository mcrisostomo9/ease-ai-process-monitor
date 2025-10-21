import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getSubmissions,
  getLatestSubmission,
  createSubmission,
  SubmissionWithGuideline,
} from '@/lib/api/submissions';

// Mock the database
vi.mock('@/db/drizzle', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(),
        })),
        innerJoin: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(() => ({
              limit: vi.fn(() => ({
                offset: vi.fn(),
              })),
            })),
          })),
          orderBy: vi.fn(() => ({
            limit: vi.fn(() => ({
              offset: vi.fn(),
            })),
          })),
        })),
        orderBy: vi.fn(() => ({
          limit: vi.fn(),
        })),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(),
      })),
    })),
  },
}));

vi.mock('@/db/schemas/submissions', () => ({
  submissionInsertSchema: {
    parse: vi.fn(),
  },
  submissions: 'submissions',
}));

vi.mock('@/db/schemas/guidelines', () => ({
  guidelineInsertSchema: {
    parse: vi.fn(),
  },
  guidelines: 'guidelines',
}));

describe('getSubmissions API Function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return paginated submissions with default pagination', async () => {
    const { db } = await import('@/db/drizzle');

    const mockSubmissions = [
      {
        id: 1,
        action: 'Closed ticket #12345',
        guidelineId: 1,
        result: 'complies',
        confidence: '0.95',
        timestamp: new Date('2024-01-15T10:30:00Z'),
        createdAt: new Date('2024-01-15T10:30:00Z'),
        guideline: 'All tickets must be closed with confirmation',
      },
    ];

    const mockCountResult = [{ count: 25 }];

    // Mock the submissions query
    const mockOffset = vi.fn().mockResolvedValue(mockSubmissions);
    const mockLimit = vi.fn().mockReturnValue({ offset: mockOffset });
    const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
    const mockInnerJoin = vi.fn().mockReturnValue({ where: mockWhere });
    const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

    // Mock the count query
    const mockCountWhere = vi.fn().mockResolvedValue(mockCountResult);
    const mockCountFrom = vi.fn().mockReturnValue({ where: mockCountWhere });
    const mockCountSelect = vi.fn().mockReturnValue({ from: mockCountFrom });

    vi.mocked(db.select)
      .mockImplementationOnce(mockSelect)
      .mockImplementationOnce(mockCountSelect);

    const result = await getSubmissions();

    expect(result).toEqual({
      data: mockSubmissions,
      pagination: {
        page: 1,
        limit: 10,
        totalCount: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: false,
      },
    });
  });

  it('should return paginated submissions with custom pagination', async () => {
    const { db } = await import('@/db/drizzle');

    const mockSubmissions = [] as SubmissionWithGuideline[];
    const mockCountResult = [{ count: 25 }] as { count: number }[];

    const mockOffset = vi.fn().mockResolvedValue(mockSubmissions);
    const mockLimit = vi.fn().mockReturnValue({ offset: mockOffset });
    const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
    const mockInnerJoin = vi.fn().mockReturnValue({ where: mockWhere });
    const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

    const mockCountWhere = vi.fn().mockResolvedValue(mockCountResult);
    const mockCountFrom = vi.fn().mockReturnValue({ where: mockCountWhere });
    const mockCountSelect = vi.fn().mockReturnValue({ from: mockCountFrom });

    vi.mocked(db.select)
      .mockImplementationOnce(mockSelect)
      .mockImplementationOnce(mockCountSelect);

    const result = await getSubmissions({ pagination: { page: 2, limit: 5 } });

    expect(result.pagination).toEqual({
      page: 2,
      limit: 5,
      totalCount: 25,
      totalPages: 5,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });

  it('should handle empty submissions', async () => {
    const { db } = await import('@/db/drizzle');

    const mockSubmissions = [];
    const mockCountResult = [{ count: 0 }];

    const mockOffset = vi.fn().mockResolvedValue(mockSubmissions);
    const mockLimit = vi.fn().mockReturnValue({ offset: mockOffset });
    const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
    const mockInnerJoin = vi.fn().mockReturnValue({ where: mockWhere });
    const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

    const mockCountWhere = vi.fn().mockResolvedValue(mockCountResult);
    const mockCountFrom = vi.fn().mockReturnValue({ where: mockCountWhere });
    const mockCountSelect = vi.fn().mockReturnValue({ from: mockCountFrom });

    vi.mocked(db.select)
      .mockImplementationOnce(mockSelect)
      .mockImplementationOnce(mockCountSelect);

    const result = await getSubmissions();

    expect(result).toEqual({
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });

  it('should handle database errors', async () => {
    const { db } = await import('@/db/drizzle');

    const dbError = new Error('Database connection failed');

    // Mock for submissions query
    const mockOffset = vi.fn().mockRejectedValue(dbError);
    const mockLimit = vi.fn().mockReturnValue({ offset: mockOffset });
    const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
    const mockInnerJoin = vi.fn().mockReturnValue({ where: mockWhere });
    const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

    // Mock for count query
    const mockCountWhere = vi.fn().mockRejectedValue(dbError);
    const mockCountFrom = vi.fn().mockReturnValue({ where: mockCountWhere });
    const mockCountSelect = vi.fn().mockReturnValue({ from: mockCountFrom });

    vi.mocked(db.select)
      .mockImplementationOnce(mockSelect)
      .mockImplementationOnce(mockCountSelect);

    await expect(getSubmissions()).rejects.toThrow(
      'Database connection failed',
    );
  });
});

describe('getLatestSubmission API Function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the latest submission', async () => {
    const { db } = await import('@/db/drizzle');

    const mockSubmission = {
      id: 1,
      action: 'Latest submission action',
      guidelineId: 1,
      result: 'complies',
      confidence: '0.95',
      timestamp: new Date('2024-01-15T10:30:00Z'),
      createdAt: new Date('2024-01-15T10:30:00Z'),
      guideline: 'Latest guideline',
    };

    const mockLimit = vi.fn().mockResolvedValue([mockSubmission]);
    const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockInnerJoin = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
    const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    vi.mocked(db.select).mockImplementation(mockSelect);

    const result = await getLatestSubmission();

    expect(result).toEqual(mockSubmission);
  });

  it('should return null when no submissions exist', async () => {
    const { db } = await import('@/db/drizzle');

    const mockLimit = vi.fn().mockResolvedValue([]);
    const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockInnerJoin = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
    const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    vi.mocked(db.select).mockImplementation(mockSelect);

    const result = await getLatestSubmission();

    expect(result).toBeNull();
  });

  it('should handle database errors', async () => {
    const { db } = await import('@/db/drizzle');

    const dbError = new Error('Database connection failed');
    const mockLimit = vi.fn().mockRejectedValue(dbError);
    const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockInnerJoin = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
    const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    vi.mocked(db.select).mockImplementation(mockSelect);

    await expect(getLatestSubmission()).rejects.toThrow(
      'Database connection failed',
    );
  });

  it('should return submission with all required fields', async () => {
    const { db } = await import('@/db/drizzle');

    const mockSubmission = {
      id: 1,
      action: 'Test action',
      guidelineId: 1,
      result: 'complies',
      confidence: '0.95',
      timestamp: new Date('2024-01-15T10:30:00Z'),
      createdAt: new Date('2024-01-15T10:30:00Z'),
      guideline: 'Test guideline',
    };

    const mockLimit = vi.fn().mockResolvedValue([mockSubmission]);
    const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockInnerJoin = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
    const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    vi.mocked(db.select).mockImplementation(mockSelect);

    const result = await getLatestSubmission();

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('action');
    expect(result).toHaveProperty('guidelineId');
    expect(result).toHaveProperty('result');
    expect(result).toHaveProperty('confidence');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('guideline');
  });
});

describe('createSubmission API Function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a new submission with existing guideline', async () => {
    const { db } = await import('@/db/drizzle');
    const { submissionInsertSchema } = await import('@/db/schemas/submissions');

    const mockLimit = vi
      .fn()
      .mockResolvedValue([{ id: 1, text: 'Test guideline' }]);
    const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    vi.mocked(db.select).mockImplementation(mockSelect);

    const mockReturning = vi.fn().mockResolvedValue([{ id: 1 }]);
    const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
    const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
    vi.mocked(db.insert).mockImplementation(mockInsert);

    vi.mocked(submissionInsertSchema.parse).mockReturnValue({
      action: 'Test action',
      guidelineId: 1,
      result: 'complies',
      confidence: '0.95',
    });

    const result = await createSubmission({
      action: 'Test action',
      guideline: 'Test guideline',
      result: 'complies',
      confidence: 0.95,
    });

    expect(result).toEqual({ id: 1 });
    expect(submissionInsertSchema.parse).toHaveBeenCalledWith({
      action: 'Test action',
      guidelineId: 1,
      result: 'complies',
      confidence: '0.95',
    });
  });

  it('should create a new submission with new guideline', async () => {
    const { db } = await import('@/db/drizzle');
    const { guidelineInsertSchema } = await import('@/db/schemas/guidelines');
    const { submissionInsertSchema } = await import('@/db/schemas/submissions');

    const mockLimit = vi.fn().mockResolvedValue([]);
    const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    vi.mocked(db.select).mockImplementation(mockSelect);

    const mockReturning = vi.fn().mockResolvedValue([{ id: 1 }]);
    const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
    const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
    vi.mocked(db.insert).mockImplementation(mockInsert);

    vi.mocked(guidelineInsertSchema.parse).mockReturnValue({
      name: 'Test guideline',
      text: 'Test guideline',
    });
    vi.mocked(submissionInsertSchema.parse).mockReturnValue({
      action: 'Test action',
      guidelineId: 1,
      result: 'complies',
      confidence: '0.95',
    });

    const result = await createSubmission({
      action: 'Test action',
      guideline: 'Test guideline',
      result: 'complies',
      confidence: 0.95,
    });

    expect(result).toEqual({ id: 1 });
    expect(db.insert).toHaveBeenCalledTimes(2);
  });

  it('should handle database errors', async () => {
    const { db } = await import('@/db/drizzle');

    const dbError = new Error('Database connection failed');
    const mockLimit = vi.fn().mockRejectedValue(dbError);
    const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    vi.mocked(db.select).mockImplementation(mockSelect);

    await expect(
      createSubmission({
        action: 'Test action',
        guideline: 'Test guideline',
        result: 'complies',
        confidence: 0.95,
      }),
    ).rejects.toThrow('Database connection failed');
  });

  it('should convert confidence number to string', async () => {
    const { db } = await import('@/db/drizzle');
    const { submissionInsertSchema } = await import('@/db/schemas/submissions');

    const mockLimit = vi
      .fn()
      .mockResolvedValue([{ id: 1, text: 'Test guideline' }]);
    const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    vi.mocked(db.select).mockImplementation(mockSelect);

    const mockReturning = vi.fn().mockResolvedValue([{ id: 1 }]);
    const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
    const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
    vi.mocked(db.insert).mockImplementation(mockInsert);

    vi.mocked(submissionInsertSchema.parse).mockReturnValue({
      action: 'Test action',
      guidelineId: 1,
      result: 'complies',
      confidence: '0.75',
    });

    await createSubmission({
      action: 'Test action',
      guideline: 'Test guideline',
      result: 'complies',
      confidence: 0.75,
    });

    expect(submissionInsertSchema.parse).toHaveBeenCalledWith({
      action: 'Test action',
      guidelineId: 1,
      result: 'complies',
      confidence: '0.75',
    });
  });

  it('should truncate guideline name to 255 characters', async () => {
    const { db } = await import('@/db/drizzle');
    const { guidelineInsertSchema } = await import('@/db/schemas/guidelines');

    const longGuideline = 'A'.repeat(300);
    const mockLimit = vi.fn().mockResolvedValue([]);
    const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    vi.mocked(db.select).mockImplementation(mockSelect);

    const mockReturning = vi.fn().mockResolvedValue([{ id: 1 }]);
    const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
    const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
    vi.mocked(db.insert).mockImplementation(mockInsert);

    vi.mocked(guidelineInsertSchema.parse).mockReturnValue({
      name: 'A'.repeat(255),
      text: longGuideline,
    });

    await createSubmission({
      action: 'Test action',
      guideline: longGuideline,
      result: 'complies',
      confidence: 0.95,
    });

    expect(guidelineInsertSchema.parse).toHaveBeenCalledWith({
      name: 'A'.repeat(255),
      text: longGuideline,
    });
  });
});
