import type { Request, Response } from 'express';
import type { ApiSuccessResponse } from '../../common/types/api-response';
import {
  getLiveness,
  getReadiness,
  type LivenessPayload,
  type ReadinessPayload,
} from './health.service';

export const getLivenessHandler = (
  _req: Request,
  res: Response<ApiSuccessResponse<LivenessPayload>>,
): void => {
  res.status(200).json({
    success: true,
    data: getLiveness(),
  });
};

export const getReadinessHandler = (
  _req: Request,
  res: Response<ApiSuccessResponse<ReadinessPayload>>,
): void => {
  const data = getReadiness();
  const statusCode = data.status === 'ready' ? 200 : 503;

  res.status(statusCode).json({
    success: true,
    data,
  });
};
