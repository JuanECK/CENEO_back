import mssql from 'mssql';
import { env } from './env';
import { logger } from './logger';

const sqlConfig: mssql.config = {
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  server: env.DB_SERVER,
  database: env.DB_NAME,
  port: env.DB_PORT,
  options: {
    encrypt: true, // 🛡️ FUERZA EL CIFRADO SSL/TLS EN TRÁNSITO
    trustServerCertificate: env.NODE_ENV === 'development', // true solo para desarrollo local
    enableArithAbort: true,
  },
  pool: {
    max: 10, // Máximo de conexiones simultáneas en el pool
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Instanciamos el pool global
export const dbPool = new mssql.ConnectionPool(sqlConfig);

export const connectDB = async (): Promise<void> => {
  try {
    await dbPool.connect();
    logger.info('💾 Conexión segura a SQL Server establecida con éxito.');
  } catch (error) {
    logger.error(`❌ Error crítico al conectar a SQL Server: ${error}`);
    process.exit(1);
  }
};