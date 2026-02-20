import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { logger } from '../../utils/logger.js';

/** Mongoose connection state: 1 = connected */
const CONNECTED_STATE = 1;

/**
 * Liveness probe - indicates the process is running.
 * Used by Kubernetes to determine if the container should be restarted.
 */
export function liveness(_req: Request, res: Response): void {
  res.status(200).json({
    success: true,
    data: {
      status: 'alive',
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Readiness probe - indicates the app can accept traffic.
 * Checks MongoDB connection. Used by load balancers/orchestrators.
 */
export async function readiness(_req: Request, res: Response): Promise<void> {
  const mongoState = mongoose.connection.readyState;
  const isReady = mongoState === CONNECTED_STATE;

  if (!isReady) {
    logger.warn({ mongoState }, 'Readiness check failed - MongoDB not connected');
    res.status(503).json({
      success: false,
      data: {
        status: 'not_ready',
        mongodb: 'disconnected',
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      status: 'ready',
      mongodb: 'connected',
      timestamp: new Date().toISOString(),
    },
  });
}
