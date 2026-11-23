import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { logger } from '../config/logger';

export const validateLogin = ( schema: ZodObject ) => 
    ( req: Request, res: Response, next: NextFunction ):void => {
        try {
            //Revisa la informacion
            schema.parse({
                body:req.body,
                query:req.params,
                params:req.params
            });
            // si es correcta con el schemaLogin y machea... continua
            next();
        } catch (error) {
            // si existe un error toma del schemaLogin el error, lo imprime con logger y retorna una respuesta disfrazada con STATUS 200 (en un arreglo el verdadero error)
            if( error instanceof ZodError ){
                logger.warning(`Error de validación de datos: ${JSON.stringify(error.issues[0].message)}`);
                res.status(200).json({
                    status:400,
                    error:{
                        code:'401-2',
                        message: error.issues[0].message
                    }
                })
                return
            }
            // si nada de lo anterior fue el causante del error retorna un error interno
            res.status(200).json({
                status:500,
                error:{
                    code: 'ERROR INTERNO DEL SERVIDOR', 
                    message: 'Error de procesamiento.'
                }
            });
        }
    }