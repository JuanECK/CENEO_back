import  jwt  from "jsonwebtoken";
import { CustomError } from "../middelware/customError";
import { AuthRepository } from "../repository/auth.repository";
import bcrypt from 'bcrypt';
import { env } from "../config/env";

const authRepository = new AuthRepository();

export class AuthService {

    async verificCredentials ( emailPlain: string, passwordPlain: string ): Promise<{token:string, data:any, user:any}> {
        const credentials = await authRepository.findByEmail( emailPlain );

        if( !credentials?.usuario ) throw new CustomError( 401, '401-1', 'No existe usuario asociado a este correo' );

        const validaPassword = await bcrypt.compare(passwordPlain, credentials.usuario.passwordHash);

        if (!validaPassword) throw new CustomError(401,'401-2','Contraseña incorrecta');

        const { id, email, nombreCompleto } = credentials.usuario
        const token = jwt.sign(
            { id:id, email:email },
            env.JWT_SECRET,
            // { expiresIn: '1h' }
        )

        return { 
            token,
            user:{id:id, email:email, nombreCompleto},
            data: credentials.data 
        }
    }

}
