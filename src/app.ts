import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan'
import { logger } from './config/logger';
import routes from './routes/api.routes';
import cookieParser from 'cookie-parser';
import { env } from './config/env'

const app = express();

app.use(express.json());
app.disable('x-powered-by');

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // Indispensable para que el Rate Limiter lea la IP real del cliente
}

// CAPAS GLOBALES DE SEGURIDAD //


// --------------------------- //

// CORS //  
app.use(cors({
// 1- Define los origenes permitidos 
origin: ['http://localhost:3000', 'http://localhost:5173'],
// 2- Permite explicitamente el intercambio de cookies HTTP-Only
credentials: true,
// 3. Define qué métodos HTTP aceptará el backend en peticiones complejas
methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
// 3. Define qué métodos HTTP aceptará el backend en peticiones complejas
allowedHeaders: ['Content-Type', 'Authorization', 'x-signature'],
}))
// --------------------------- //

//Limita de forma estricta el tamaño máximo que Express aceptará en los bodies.
app.use(express.json({ limit: '10kb' }));

const COOKIE_SECRET = env.COOKIE_SECRET;
app.use(cookieParser(COOKIE_SECRET));

// Integración de Morgan con Winston
const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream: { write: (message) => logger.http(message.trim()) } }
);
app.use(morganMiddleware);

app.use('/api', routes)

export default app;
