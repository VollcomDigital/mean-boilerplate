import mongoose from 'mongoose';
import { isDatabaseReady } from '../../config/db';

export interface LivenessPayload {
  status: 'ok';
  uptimeSeconds: number;
  timestamp: string;
}

export interface ReadinessPayload {
  status: 'ready' | 'not_ready';
  checks: {
    database: {
      ready: boolean;
      state: string;
    };
  };
}

const connectionStateMap: Record<number, string> = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
  99: 'uninitialized',
};

export const getLiveness = (): LivenessPayload => ({
  status: 'ok',
  uptimeSeconds: Number(process.uptime().toFixed(2)),
  timestamp: new Date().toISOString(),
});

export const getReadiness = (): ReadinessPayload => {
  const stateCode = mongoose.connection.readyState;
  const state = connectionStateMap[stateCode] ?? 'unknown';
  const ready = isDatabaseReady();

  return {
    status: ready ? 'ready' : 'not_ready',
    checks: {
      database: {
        ready,
        state,
      },
    },
  };
};
