import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAnalysis } from '@/lib/api/get-analysis';

// Mock fetch
global.fetch = vi.fn();

// Mock environment variables
const originalEnv = process.env;
beforeEach(() => {
  vi.resetModules();
  process.env = { ...originalEnv, HUGGING_FACE_ACCESS_TOKEN: 'test-token' };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('getAnalysis API Function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully analyze submission and return result', async () => {
    const mockResponse = {
      labels: ['complies', 'unclear', 'deviates'],
      scores: [0.95, 0.03, 0.02],
      sequence: 'Action: Test action Guideline: Test guideline',
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    } as any);

    const result = await getAnalysis('Test action', 'Test guideline');

    expect(fetch).toHaveBeenCalledWith(
      'https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli',
      {
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: 'Action: Test action, \n Guideline: Test guideline',
          parameters: {
            candidate_labels: ['complies', 'deviates', 'unclear'],
          },
        }),
      },
    );

    expect(result).toEqual({
      label: 'complies',
      score: 0.95,
      sequence: 'Action: Test action Guideline: Test guideline',
    });
  });

  it('should handle API response with different result types', async () => {
    const mockResponse = {
      labels: ['deviates', 'complies', 'unclear'],
      scores: [0.88, 0.08, 0.04],
      sequence: 'Action: Bad action Guideline: Test guideline',
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    } as any);

    const result = await getAnalysis('Bad action', 'Test guideline');

    expect(result).toEqual({
      label: 'deviates',
      score: 0.88,
      sequence: 'Action: Bad action Guideline: Test guideline',
    });
  });

  it('should handle API response with unclear result', async () => {
    const mockResponse = {
      labels: ['unclear', 'complies', 'deviates'],
      scores: [0.65, 0.2, 0.15],
      sequence: 'Action: Ambiguous action Guideline: Test guideline',
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    } as any);

    const result = await getAnalysis('Ambiguous action', 'Test guideline');

    expect(result).toEqual({
      label: 'unclear',
      score: 0.65,
      sequence: 'Action: Ambiguous action Guideline: Test guideline',
    });
  });

  it('should throw error when API request fails', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as any);

    await expect(getAnalysis('Test action', 'Test guideline')).rejects.toThrow(
      'Failed to analyze submission',
    );
  });

  it('should throw error when fetch fails', async () => {
    const networkError = new Error('Network error');
    vi.mocked(fetch).mockRejectedValue(networkError);

    await expect(getAnalysis('Test action', 'Test guideline')).rejects.toThrow(
      'Network error',
    );
  });

  it('should handle JSON parsing errors', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
    } as any);

    await expect(getAnalysis('Test action', 'Test guideline')).rejects.toThrow(
      'Invalid JSON',
    );
  });

  it('should construct correct input string', async () => {
    const mockResponse = {
      labels: ['complies'],
      scores: [0.95],
      sequence: 'Action: Close ticket Guideline: All tickets must be closed',
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    } as any);

    await getAnalysis('Close ticket', 'All tickets must be closed');

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({
          inputs:
            'Action: Close ticket, \n Guideline: All tickets must be closed',
          parameters: {
            candidate_labels: ['complies', 'deviates', 'unclear'],
          },
        }),
      }),
    );
  });

  it('should use correct API endpoint and headers', async () => {
    const mockResponse = {
      labels: ['complies'],
      scores: [0.95],
      sequence: 'Test',
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    } as any);

    await getAnalysis('Test action', 'Test guideline');

    expect(fetch).toHaveBeenCalledWith(
      'https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli',
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }),
    );
  });

  // Test Cases from EASE-AI.md Requirements
  describe('EASE-AI Test Cases', () => {
    it('should return COMPLIES for Case 1: Closed ticket with confirmation email', async () => {
      const mockResponse = {
        labels: ['complies', 'deviates', 'unclear'],
        scores: [0.94, 0.04, 0.02],
        sequence:
          'Action: Closed ticket #48219 and sent confirmation email, \n Guideline: All closed tickets must include a confirmation email',
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as any);

      const result = await getAnalysis(
        'Closed ticket #48219 and sent confirmation email',
        'All closed tickets must include a confirmation email',
      );

      expect(result).toEqual({
        label: 'complies',
        score: 0.94,
        sequence:
          'Action: Closed ticket #48219 and sent confirmation email, \n Guideline: All closed tickets must include a confirmation email',
      });
    });

    it('should return DEVIATES for Case 2: Closed ticket without confirmation email', async () => {
      const mockResponse = {
        labels: ['deviates', 'complies', 'unclear'],
        scores: [0.92, 0.06, 0.02],
        sequence:
          'Action: Closed ticket #48219 without sending confirmation email, \n Guideline: All closed tickets must include a confirmation email',
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as any);

      const result = await getAnalysis(
        'Closed ticket #48219 without sending confirmation email',
        'All closed tickets must include a confirmation email',
      );

      expect(result).toEqual({
        label: 'deviates',
        score: 0.92,
        sequence:
          'Action: Closed ticket #48219 without sending confirmation email, \n Guideline: All closed tickets must include a confirmation email',
      });
    });

    it('should return DEVIATES for Case 3: Server reboot without weekly schedule', async () => {
      const mockResponse = {
        labels: ['deviates', 'complies', 'unclear'],
        scores: [0.89, 0.08, 0.03],
        sequence:
          'Action: Rebooted the server and checked logs, \n Guideline: Servers must be rebooted weekly and logs reviewed after restart',
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as any);

      const result = await getAnalysis(
        'Rebooted the server and checked logs',
        'Servers must be rebooted weekly and logs reviewed after restart',
      );

      expect(result).toEqual({
        label: 'deviates',
        score: 0.89,
        sequence:
          'Action: Rebooted the server and checked logs, \n Guideline: Servers must be rebooted weekly and logs reviewed after restart',
      });
    });

    it('should return UNCLEAR for Case 4: Action with no relevant guidelines', async () => {
      const mockResponse = {
        labels: ['unclear', 'complies', 'deviates'],
        scores: [0.78, 0.12, 0.1],
        sequence:
          'Action: Skipped torque confirmation at Station 3, \n Guideline: No guidelines exist for this case',
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as any);

      const result = await getAnalysis(
        'Skipped torque confirmation at Station 3',
        'No guidelines exist for this case',
      );

      expect(result).toEqual({
        label: 'unclear',
        score: 0.78,
        sequence:
          'Action: Skipped torque confirmation at Station 3, \n Guideline: No guidelines exist for this case',
      });
    });
  });
});
