import  jwt  from "jsonwebtoken";
import { CustomError } from "../middelware/customError";
import { AuthRepository } from "../repository/auth.repository";
import bcrypt from 'bcrypt';
import { env } from "../config/env";

const authRepository = new AuthRepository();

export class AuthService {

    async verificCredentials ( emailPlain: string, passwordPlain: string ): Promise<{token:string, user:any}> {

        const active = 1;
        const credentials = await authRepository.findByEmail( emailPlain );
        
        if( !credentials?.correo ) throw new CustomError( credentials!.codigo, '401-1', credentials!.mensaje );

        const validaPassword = await bcrypt.compare(passwordPlain, credentials.contrasenia);
        if (!validaPassword) throw new CustomError(404,'401-2','Contraseña incorrecta');
        
        const {idPerfil, centroId, idUsuario, correo, nombreCompleto } = credentials

        const logout = await authRepository.logOut( idUsuario, active );
        const { codigo, mensaje } = logout
        if(codigo === 409)throw new CustomError(codigo, 'ERROR INTERNO', mensaje)

        const token = jwt.sign(
            { centroId:centroId, id:idUsuario, role:idPerfil, nombreCompleto:nombreCompleto },
            env.JWT_SECRET,
            // { expiresIn: '1h' }
        )

        return { 
            token,
            user:{centroId:centroId, idPerfil:idPerfil, idUsuario:idUsuario, email:correo, nombreCompleto:nombreCompleto},
            // data: credentials.data
        }
    }

    async logOutService ( idUsuario: number, active: number ): Promise<any> {

        const logout = await authRepository.logOut( idUsuario, active );
        const { codigo, mensaje } = logout
        if(codigo === 409)throw new CustomError(codigo, 'ERROR INTERNO', mensaje)

        return {mensaje}

    }

    async newUserService ( data:any ): Promise<any> {

        console.log(data.email)
        const {email,password,nombre_admin,tarjeta_eje,clabe_eje,identificador,nombre_cn, cn } = data

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash( password, saltRounds );

        const register = await authRepository.registerUser(email,passwordHash,nombre_admin,tarjeta_eje,clabe_eje,identificador,nombre_cn, cn);
         const { codigo, mensaje } = register
            if(codigo === 409)throw new CustomError(codigo, 'ERROR DE COINCIDENCIA', mensaje)

        return {mensaje}

    }
    async resetPasswordService ( data:any ): Promise<any> {

      
        const { re_password, tarjeta_eje, cn } = data

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash( re_password, saltRounds );

        const register = await authRepository.resetPassword(passwordHash, tarjeta_eje, cn);
         const { codigo, mensaje } = register
            if(codigo === 409)throw new CustomError(codigo, 'ERROR INTERNO', mensaje)

        return {mensaje}

    }
    async createCustomerService ( data:any ): Promise<any> {

      
        const { clabe_cliente, tarjeta_cliente, nombre_cliente, cn } = data

        const register = await authRepository.createCustomer(clabe_cliente, tarjeta_cliente, nombre_cliente, cn);
         const { codigo, mensaje } = register
            if(codigo === 409)throw new CustomError(codigo, 'ERROR INTERNO', mensaje)

        return {mensaje}

    }
    async deleteCustomerService ( data:any ): Promise<any> {

      
        const { tarjeta_cliente, cn } = data

        const register = await authRepository.deleteCustomer( tarjeta_cliente, cn);
         const { codigo, mensaje } = register
            if(codigo === 409)throw new CustomError(codigo, 'ERROR INTERNO', mensaje)

        return {mensaje}

    }
    async getCardsService( idCentroNegocio:number, pagina:number, registrosPorPagina:number): Promise<any> {

        const register = await authRepository.getCards( idCentroNegocio, pagina, registrosPorPagina );
         const { codigo, mensaje } = register
            if(codigo === 404)throw new CustomError(codigo, 'ERROR INTERNO', mensaje)

        return {mensaje}

    }

}
