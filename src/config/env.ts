import  dotenv from 'dotenv';
import path from 'node:path';
import { z } from 'zod';
import { logger } from './logger';

dotenv.config({path: path.resolve(process.cwd(), '.env')});

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform((val) => Number.parseInt(val, 10)).default(3000),
    COOKIE_SECRET: z.string({
        error: 'La variable COOKIE_SECRET es obligatoria para firmar las cookies.',
    }).min(14, 'COOKIE_SECRET debe tener al menos 32 caracteres por seguridad.'),
    JWT_SECRET: z.string({
        error: 'La variable JWT_SECRET es obligatoria para firmar los tokens.',
    }).min(14, 'JWT_SECRET debe tener al menos 32 caracteres por seguridad.'),
    HMAC_SECRET: z.string({
        error: 'La variable HMAC_SECRET es obligatoria para validar la integridad de las peticiones.',
    }).min(14, 'HMAC_SECRET debe tener al menos 32 caracteres por seguridad.'),
    ALLOWED_ORIGIN: z.url('ALLOWED_ORIGIN debe ser una URL válida (ej: http://localhost:5173).'),

    // 🔄 NUEVA VARIABLE: Dominio base en producción (ej: '.appfrg.mx')
    // En desarrollo puede ser un string vacío o 'localhost'
    COOKIE_DOMAIN: z.string().default(''), 
})

// intenta parsear y validar process.env
const parseEnv = () => {
    const result = envSchema.safeParse(process.env);

    if( !result.success ){
        logger.error('ERROR CRITICO Configuracion de entorno invalida:');

        //muestra detalladamente que variable farro y porque
        result.error.issues.forEach((err) => {
            logger.error(`   Variable [${err.path.join('.')}]: ${err.message}`);
        });

        // Detiene el servidor de inmediato para evitar fallos catastróficos en producción
        process.exit(1);
    }
    return result.data;
}

// Exportamos el objeto ya validado y tipado de forma estricta
export const env = parseEnv();