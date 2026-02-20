import { sendSuccess, sendError } from '../../src/utils/response';
import type { Response } from 'express';

function createMockResponse(): Response {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

describe('sendSuccess', () => {
  it('should send a success response with default 200 status', () => {
    const res = createMockResponse();
    sendSuccess(res, { id: '1' });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { id: '1' },
    });
  });

  it('should send a success response with custom status and meta', () => {
    const res = createMockResponse();
    sendSuccess(res, { id: '1' }, 201, { total: 10 });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { id: '1' },
      meta: { total: 10 },
    });
  });
});

describe('sendError', () => {
  it('should send an error response with default 500 status', () => {
    const res = createMockResponse();
    sendError(res, 'Something went wrong');

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: { message: 'Something went wrong', details: undefined },
    });
  });

  it('should send an error response with custom status and details', () => {
    const res = createMockResponse();
    sendError(res, 'Validation failed', 422, [{ field: 'email' }]);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Validation failed',
        details: [{ field: 'email' }],
      },
    });
  });
});
