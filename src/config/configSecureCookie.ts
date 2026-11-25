import { CookieOptions } from 'express';


// ===================== CONFIGURACION MAESTRA DE COOKIS PARA PRODUCCION / DESARROLLO ========================
export const getSecureCookieOptions = (): CookieOptions => {
  const isProd = process.env.NODE_ENV;
  console.log(isProd)
  return {
    httpOnly: true, // 🧼 Evita secuestros de sesión por XSS en el Front
    secure: true, // 🔒 Producction  y Development
    
    // 🔄 REGLA DE PRODUCCIÓN MEJORADA:
    // En desarrollo local usamos 'lax' o 'none' según ocupes, pero en producción 
    // 'lax' es el estándar bancario seguro para subdominios.
    // sameSite:'lax', // 🔒 Producction
    // sameSite:'none', // 🔒 Development
    sameSite: isProd === 'development' ? 'none':'lax',
    
    // Asigna el dominio base de tu empresa en AWS si estamos en producción
    // domain: '.appfrg.mx', // 🔒 Producction
    // domain: undefined, // 🔒 Development
    domain: isProd === 'development' ? undefined : '.appfrg.mx', // 🔒 Development
    
    signed: true, // Integridad HMAC nativa de cookie-parser
    // maxAge: 60 * 60 * 1000 // Duración controlada (1 H)
    maxAge: 30 * 24 * 60 * 60 * 1000 // Duración controlada (ej: 30 días)
  };
};
// ===========================================================================================================