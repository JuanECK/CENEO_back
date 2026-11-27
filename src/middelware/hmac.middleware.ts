import { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import { logger } from '../config/logger';
import { env } from '../config/env';

const HMAC_SECRET = env.HMAC_SECRET;

export const verifyHMAC = ( req:Request, res:Response, next:NextFunction ):void => {

    const clientSignature = req.headers[ 'x-signature' ] as string;

    if (!clientSignature) {
    logger.warning(`Intento de petición sin firma HMAC desde IP: ${req.ip}`);
    res.status(401).json({ error: 'Falta la firma digital de la petición' });
    return;
  }

    const message = JSON.stringify( req.body );

    const computedStringify = crypto
    .createHmac( 'sha256', HMAC_SECRET )
    .update(message)
    .digest('hex');

    if( clientSignature !== computedStringify ){
        logger.error( `Firma HMAC inválida. IP: ${req.ip}` );
        res.status(403).json({ error: 'Firma digital inválida o datos alterados' });
        return;
    }

    next();
}