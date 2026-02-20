import express from 'express';
import { errorHandlerMiddleware } from './common/middleware/error-handler.middleware';
import { notFoundMiddleware } from './common/middleware/not-found.middleware';
import { requestLogger } from './common/middleware/request-logger.middleware';
import { applySecurityMiddleware } from './common/middleware/security.middleware';
import { env } from './config/env';
import { apiRouter, publicRouter } from './routes';

const JSON_BODY_LIMIT = '1mb';

export const app = express();

app.disable('x-powered-by');
app.use(requestLogger);
applySecurityMiddleware(app);
app.use(express.json({ limit: JSON_BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: JSON_BODY_LIMIT }));

app.use(publicRouter);
app.use(env.API_PREFIX, apiRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
