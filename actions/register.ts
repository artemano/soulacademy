"use server";
import * as z from "zod";
import { RegisterFormSchema } from '@/schemas/index';
const apiEndpoint = process.env.NEXT_PUBLIC_API;


export const register = async (values: z.infer<typeof RegisterFormSchema>) => {
    try {
        const validateFields = RegisterFormSchema.safeParse(values);
        console.log(validateFields, "PASSED");
        if (!validateFields.success) {
            return { error: validateFields.error.message }
        }
        const endPoint = `${apiEndpoint}user`;
        console.log(endPoint);
        const data = JSON.stringify(validateFields.data);
        const response = await fetch(endPoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: data,
        });
        const createUser = await response.json();
        console.log(createUser);
        if (createUser?.success) {
            return { success: "Registro Exitoso", data: createUser.user };
        } else {
            return { error: createUser.message };
        }
    } catch (error) {
        console.log(error);
        return { error: error };
    }
}