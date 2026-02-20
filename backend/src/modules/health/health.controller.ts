import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendSuccess, sendError } from '../../utils/response.js';

/**
 * Liveness probe — confirms the process is running.
 */
export function livenessCheck(_req: Request, res: Response): void {
  sendSuccess(res, {
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}

/**
 * Readiness probe — confirms the app can serve traffic (DB is connected).
 */
export function readinessCheck(_req: Request, res: Response): void {
  const mongoState = mongoose.connection.readyState;
  const isReady = mongoState === 1;

  const MONGO_STATES: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  if (isReady) {
    sendSuccess(res, {
      status: 'ready',
      timestamp: new Date().toISOString(),
      services: {
        mongodb: MONGO_STATES[mongoState] ?? 'unknown',
      },
    });
  } else {
    sendError(res, 'Service not ready', 503, { mongodb: MONGO_STATES[mongoState] ?? 'unknown' });
  }
}
