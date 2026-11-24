import { Request, Response } from 'express';
import { logger } from '../config/logger';

export const loginController = async ( req:Request, res:Response ):Promise<void> => {
    try {
        const { userName, email } = req.body

        const response = await fetch('https://appfrg.mx/api/v1/dash/getDash', {
            method: 'POST', // o 'GET'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idCliente: 3,
            }),
        });
        const data = await response.json();

        res.status(200).json({
            status: 200,
            redirectTo: '/admin/dashboard',
            data:data,
            dashboardData: { usuario: userName, correo: email, balanceFinancieroGlobal: '$1,500,000.00 MXN' }
        })
    } catch (error: any) {
        if(error.codeError === 401){
            res.status(200).json({
                status: 401,
                error: {
                    code:error.code,
                    message:error.message
                }
            })

        } 

        logger.error(`Error en loginController: ${error}`);

        res.status(200).json({ 
        status:500,
        error: {
            code:'ERROR INTERNO DEL SERVIDOR',
            message:'Ocurrió un inconveniente al validar el acceso.'
        } 
        });
    }
}