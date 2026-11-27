import { drainableProtocol } from "node:stream/iter";
import { logger } from "../config/logger";
import { dbPool } from "../config/database";
import mssql from "mssql";
import { CustomError } from "../middelware/customError";

const mockTablaUsuarios: any[] = [
    { idPerfil: 1, idUsuario:1, email: "j.soto@oncecapital.mx", passwordHash: "$2b$10$GO4At85YOfN2kvuezmiDgOF6xgy4sk.ktcNlxd4XSK9ws4GnnPwEi", role: "admin", nombreCompleto: 'Ramon Baldez (Don Ramon)' },
    { idPerfil: 2, idUsuario:2, email: "cliente@fincash.com", passwordHash: "$2b$10$5vGwyMnsoCpDRjxh2D2OcuR5WcaM3CUIndRDv9KlnNjH939fcY/o.", role: "user", nombreCompleto:'Edgar bibar (Señor Barriga)' }
];

interface UsuarioCredenciales {
  idUsuario: number;
  idPerfil: number;
  centroId: number;
  correo: string;
  contrasenia: string;
  nombreCompleto: string;
   codigo:number ;
    mensaje:string ;
}

interface UusuarioError {
    codigo:number;
    mensaje:string;
}

export class AuthRepository {

    async findByEmail( email:string ): Promise< UsuarioCredenciales | null > {
    // async findByEmail( email:string ): Promise< { usuario:{idUsuario:number, idPerfil:number, correo:string, contrasenia:string, nombreCompleto:string} } | null > {
        try {
        // const response = await fetch('https://appfrg.mx/api/v1/dash/getDash', {
        //     method: 'POST', // o 'GET'
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         idCliente: 3,
        //     }),
        // });
        // const data = await response.json();
        // const usuario = mockTablaUsuarios.find( u => u.email === email );

        logger.info(`[SQL SERVER] Ejecutando SP: [dbo].[sp_authenticate_user] |email: ${email}'`);
        const  request = dbPool.request();
        request.input('usuario',mssql.NVarChar(255), email)
        const usuario = await request.execute('[dbo].[sp_authenticate_user]');

        // console.log({UserAUth:usuario.recordset[0]})
        return usuario.recordset[0] ?? null
        // retur { usuario, data }

        } catch (error) {
            logger.error(`Error en UserRepository.findByEmail: ${error}`);
            throw error;
        }
    }

    async logOut( idUsuario:number, active:number ): Promise< any > {
        try {
        logger.info(`[SQL SERVER] Ejecutando SP: [dbo].[sp_update_sesion] |idUsuario: ${idUsuario}, active: ${active}`);

        const  request = dbPool.request();
        request.input('idUsuario',mssql.Int, idUsuario)
        request.input('active',mssql.Int, active)
        const usuario = await request.execute('[dbo].[sp_update_sesion]');

        return usuario.recordset[0] ?? null

        } catch (error) {
            logger.error(`Error en UserRepository.findByEmail: ${error}`);
            throw error;
        }
    }

    async registerUser( email:string,password:string,nombre_admin:string,tarjeta_eje:string,clabe_eje:string,identificador:string,nombre_cn:string,cn:string  ): Promise<any> {
        try {
            logger.info(`[SQL SERVER] Ejecutando SP: [dbo].[sp_insert_User] |email: ${email}  password: ${password}, nombre_admin: ${nombre_admin}, tarjeta_eje: ${tarjeta_eje}, clabe_eje: ${clabe_eje}, identificador: ${identificador}, nombre_cn: ${nombre_cn}, cn: ${cn}`);
            
            const  request = dbPool.request();
            request.input('email',mssql.NVarChar(200), email)
            request.input('password',mssql.NVarChar(200), password)
            request.input('nombre_admin',mssql.NVarChar(200), nombre_admin)
            request.input('tarjeta_eje',mssql.NVarChar(200), tarjeta_eje)
            request.input('clabe_eje',mssql.NVarChar(200), clabe_eje)
            request.input('identificador',mssql.NVarChar(200), identificador)
            request.input('nombre_cn',mssql.NVarChar(200), nombre_cn)
            request.input('cn',mssql.NVarChar(200), cn)

            const result = await request.execute('[dbo].[sp_insert_User]');
           
            return result.recordset[0]
        } catch (error) {
             logger.error(`Error en UserRepository.registerUser: ${error}`);
            throw error;
        }
    }

    async resetPassword( re_password:string, tarjeta_eje:string, cn:string  ): Promise<any> {
        try {
            logger.info(`[SQL SERVER] Ejecutando SP: [dbo].[sp_update_password] |password: ${re_password}, password: ${tarjeta_eje},  cn: ${cn}`);
            
            const  request = dbPool.request();
            request.input('re_password',mssql.NVarChar(255), re_password)
            request.input('tarjeta_eje',mssql.NVarChar(50), tarjeta_eje)
            request.input('cn',mssql.NVarChar(50), cn)

            const result = await request.execute('[dbo].[sp_update_password]');
           
            return result.recordset[0]
        } catch (error) {
             logger.error(`Error en UserRepository.registerUser: ${error}`);
            throw error;
        }
    }
    async createCustomer( clabe_cliente:string, tarjeta_cliente:string, nombre_cliente:string, cn:string  ): Promise<any> {
        try {
            logger.info(`[SQL SERVER] Ejecutando SP: [dbo].[sp_create_customer] |clabe_cliente: ${clabe_cliente}, tarjeta_cliente: ${tarjeta_cliente}, nombre_cliente: ${nombre_cliente}, cn: ${cn}`);
            
            const  request = dbPool.request();
            request.input('clabe_cliente',mssql.NVarChar(50), clabe_cliente)
            request.input('tarjeta_cliente',mssql.NVarChar(50), tarjeta_cliente)
            request.input('nombre_cliente',mssql.NVarChar(255), nombre_cliente)
            request.input('cn',mssql.NVarChar(50), cn)

            const result = await request.execute('[dbo].[sp_create_customer]');
           
            return result.recordset[0]
        } catch (error) {
             logger.error(`Error en UserRepository.registerUser: ${error}`);
            throw error;
        }
    }
    async deleteCustomer( tarjeta_cliente:string, cn:string  ): Promise<any> {
        try {
            logger.info(`[SQL SERVER] Ejecutando SP: [dbo].[sp_delete_customer] | nombre_cliente: ${tarjeta_cliente},  cn: ${cn}`);
            
            const  request = dbPool.request();
            request.input('tarjeta_cliente',mssql.NVarChar(50), tarjeta_cliente)
            request.input('cn',mssql.NVarChar(50), cn)

            const result = await request.execute('[dbo].[sp_delete_customer]');
           
            return result.recordset[0]
        } catch (error) {
             logger.error(`Error en UserRepository.registerUser: ${error}`);
            throw error;
        }
    }
    async getCards( idCentroNegocio:number, pagina:number, registrosPorPagina:number  ): Promise<any> {
        try {
            logger.info(`[SQL SERVER] Ejecutando SP: [dbo].[sp_get_cards_cn] | idCentroNegocio: ${idCentroNegocio}, pagina: ${pagina} , registrosPorPagina: ${registrosPorPagina}`);
            
            const  request = dbPool.request();
            request.input('idCentroNegocio',mssql.Int, idCentroNegocio)
            request.input('pagina',mssql.Int, pagina)
            request.input('registrosPorPagina',mssql.Int, registrosPorPagina)

            const result = await request.execute('[dbo].[sp_get_cards_cn]');

            console.log(result.recordset[0])
           
            return result.recordset[0]
        } catch (error) {
             logger.error(`Error en UserRepository.registerUser: ${error}`);
            throw error;
        }
    }

}