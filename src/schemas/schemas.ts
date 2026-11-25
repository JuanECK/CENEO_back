import { z } from 'zod';

export const loginSchema = z.object({
    body: z.object({
        email: z.email({error:'Formato de correo electrónico inválido'}),
        password: z.string({ error: 'El nombre de usuario es obligatorio' }).min(1, 'No puede estar vacío').min(3, 'Mínimo 3 caracteres'),
    }) 
})