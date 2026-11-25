import { logger } from "../config/logger";

const mockTablaUsuarios: any[] = [
    { id: "user_admin_01", email: "j.soto@oncecapital.mx", passwordHash: "$2b$10$GO4At85YOfN2kvuezmiDgOF6xgy4sk.ktcNlxd4XSK9ws4GnnPwEi", role: "admin", nombreCompleto: 'Ramon Baldez (Don Ramon)' },
    { id: "user_comun_02", email: "cliente@fincash.com", passwordHash: "$2b$10$5vGwyMnsoCpDRjxh2D2OcuR5WcaM3CUIndRDv9KlnNjH939fcY/o.", role: "user", nombreCompleto:'Edgar bibar (Señor Barriga)' }
];

export class AuthRepository {

    async findByEmail( email:string ): Promise< { usuario:any, data:any } | null > {
        try {
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

        const usuario = mockTablaUsuarios.find( u => u.email === email );
        return { usuario, data }

        } catch (error) {
            logger.error(`Error en UserRepository.findByEmail: ${error}`);
            throw error;
        }
    }

}