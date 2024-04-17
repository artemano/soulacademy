"use server";
import * as z from "zod";
import { LoginSchema } from '@/schemas/index';
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from '../routes';
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";


export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validateFields = LoginSchema.safeParse(values);
    if (!validateFields.success) {
        return { error: "Error en alguno de los campos" }
    }
    const { email, password } = validateFields.data;
    try {
        const loggedIn = await signIn("credentials", {
            email, password, redirect: false
        });
        return { success: "Ingreso Exitoso" };
    } catch (error) {
        console.log(error);
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Credenciales Inválidas" };
                default:
                    return { error: "Ocurrió un error" }
            }
        }
        if (isRedirectError(error)) {
            console.log("REDIRECT ERROR");
            return { error: 'Error de redirección' };
        }
        return { error: `Error ${error}` };
    }
    //signIn()
}