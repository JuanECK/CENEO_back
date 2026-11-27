import { Request, Response } from 'express';
import { logger } from '../config/logger';
import { AuthService } from '../services/auth.service';
import { getSecureCookieOptions } from '../config/configSecureCookie';

const authService = new AuthService();

export const loginController = async ( req:Request, res:Response ):Promise<void> => {
    try {
        res.clearCookie('access_token'); // se limpia el token, para insertar el nuevo

        const { email, password, active } = req.body
        
        const { token, user } = await authService.verificCredentials( email, password )
        console.log(user)

        res.cookie('access_token', token,
            getSecureCookieOptions()
        );

        logger.info(`🔑 Login exitoso. Usuario: ${user.idPerfil}`);

        res.status(200).json({
            status: 200,
            redirectTo: '/admin/dashboard',
            user: user,
            dashboardData: { balanceFinancieroGlobal: '$1,500,000.00 MXN' }
        })

    } catch (error: any) {
        if(error.codeError >= 400 && error.codeError <= 409){
            res.status(200).json({
                status: error.codeError,
                error: {
                    code:error.code,
                    message:error.message
                }
            })
            return
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

export const authMeController = ( req:Request, res:Response ) =>{

// Como verifyJWT ya decodificó el token y guardó los datos en req.user,
// simplemente los enviamos de regreso al Frontend.

const idPerfil = Number.parseInt(req.user.role, 10);
console.log({dataaaaa:req.user})

res.status(200).json({
    status:200,
    centroId:req.user?.centroId,
    idUsuario:req.user.id,
    nombreCompleto: req.user.nombreCompleto || 'Usuario Autenticado',
    idPerfil: idPerfil // Enviamos el idPerfil real que guardamos en el JWT
})
}

export const logoutController = async (req: Request, res: Response) => {
    try {
        
        const {idUsuario, active} = req.body.data

        console.log(idUsuario, active)
    
        const logOut = await authService.logOutService( idUsuario, active )
    
        res.clearCookie('access_token');
        logger.info('Sesión cerrada y cookie eliminada de forma segura.');
        res.status(200).json({ 
            status: 200,
            data:{
                logOut
            } 
        })
        
    } catch (error:any) {
        logger.error(`Error: ${error.message}`);
        res.status(200).json({
            status:error.codeError,
            error:{
                code:error.code,
                message:error.message
            }
        })
    }
};

export const newUserController = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = req.body.data[0]
        const register = await authService.newUserService(data)

        res.status(200).json({
            status:200,
            data:{
                register
            }
        })

    } catch (error:any) {
        logger.error(`Error: ${error.message}`);
        res.status(200).json({
            status:error.codeError,
            error:{
                code:error.code,
                message:error.message
            }
        })
    }
}
export const resetPasswordController = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = req.body.data[0]
        const register = await authService.resetPasswordService(data)

        res.status(200).json({
            status:200,
            data:{
                register
            }
        })

    } catch (error:any) {
        logger.error(`Error: ${error.message}`);
        res.status(200).json({
            status:error.codeError,
            error:{
                code:error.code,
                message:error.message
            }
        })
    }
}
export const createCustomerController = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = req.body.data[0]
        const register = await authService.createCustomerService(data)

        res.status(200).json({
            status:200,
            data:{
                register
            }
        })

    } catch (error:any) {
        logger.error(`Error: ${error.message}`);
        res.status(200).json({
            status:error.codeError,
            error:{
                code:error.code,
                message:error.message
            }
        })
    }
}
export const deleteCustomerController = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = req.body.data[0]
        const register = await authService.deleteCustomerService(data)

        res.status(200).json({
            status:200,
            data:{
                register
            }
        })

    } catch (error:any) {
        logger.error(`Error: ${error.message}`);
        res.status(200).json({
            status:error.codeError,
            error:{
                code:error.code,
                message:error.message
            }
        })
    }
}
export const getCardsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const idCentroNegocio:number = Number.parseInt(req.query.idCentroN as string, 10);
        const pagina = Number.parseInt(req.query.page as string, 10);
        const registrosPorPagina = Number.parseInt(req.query.limit as string, 10);

        const register = await authService.getCardsService(idCentroNegocio, pagina, registrosPorPagina)

        res.status(200).json({
            status:200,
            data:{
                register
            }
        })

    } catch (error:any) {
        logger.error(`Error: ${error.message}`);
        res.status(200).json({
            status:error.codeError,
            error:{
                code:error.code,
                message:error.message
            }
        })
    }
}


