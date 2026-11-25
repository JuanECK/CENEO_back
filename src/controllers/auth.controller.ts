import { Request, Response } from 'express';
import { logger } from '../config/logger';
import { AuthService } from '../services/auth.service';
import { getSecureCookieOptions } from '../config/configSecureCookie';

const authService = new AuthService();

export const loginController = async ( req:Request, res:Response ):Promise<void> => {
    try {
        res.clearCookie('access_token'); // se limpia el token, para insertar el nuevo

        const { email, password } = req.body

        const { token, user, data } = await authService.verificCredentials( email, password )

        res.cookie('access_token', token,
            getSecureCookieOptions()
        );

        logger.info(`🔑 Login exitoso. Usuario: ${user.id}`);

        res.status(200).json({
            status: 200,
            redirectTo: '/admin/dashboard',
            data:data,
            user: user,
            dashboardData: { balanceFinancieroGlobal: '$1,500,000.00 MXN' }
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

export const authMeController = async ( req:Request, res:Response ):Promise<void> =>{

// Como verifyJWT ya decodificó el token y guardó los datos en req.user,
// simplemente los enviamos de regreso al Frontend.

const idPerfil = Number.parseInt(req.user.role, 10);

res.status(200).json({
status:200,
idUsuario:req.user.id,
nombreCompleto: req.user.nombreCompleto || 'Usuario Autenticado',
idPerfil: idPerfil // Enviamos el idPerfil real que guardamos en el JWT
})
}