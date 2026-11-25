import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { loginSchema } from '../schemas/schemas';
import { validateLogin } from '../middelware/validate.middelware';
import { authMeController, loginController } from '../controllers/auth.controller';
import { verifyJWT } from '../middelware/auth.middelware';


const router = Router();

// Define el maximo de peticiones de una misma IP en determinado tiempo
const apiLimter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 200, // maximo de peticiones
    message: { error:'Demasiadas peticiones desde esta IP, intente más tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
})

// =================================================================================================
// =================================================================================================

// ---------- FLUJO DE APP WEB----------

// =================================================================================================
// =================================================================================================
// =================================================================================================
// 1. (("TEST")) - FLUJO DE AUTENTICACIÓN (LOGIN - Protegidas por Rate Limiter y Firma HMAC obligatoria) 
// =================================================================================================
router.post('/login',
    apiLimter,                  // Valida que nadie alterara los montos del JSON en tránsito
    validateLogin(loginSchema), // Valida la estructura del JSON con Zod
    loginController             // Ejecuta la acción en el controlador
)
router.get('/auth/me',
  apiLimter,
  verifyJWT,
  authMeController,
)
export default router;