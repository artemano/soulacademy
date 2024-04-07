"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SignInOptions, signIn } from "next-auth/react";
import { parseUrl } from "../../lib/url-utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "../../lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";
import { Icons } from "@/components/AppIcons";

const formSchema = z.object({
    code: z.string(),
    password: z.string(),
    passwordConfirmation: z.string(),
});

interface ResetFormProps extends React.HTMLAttributes<HTMLDivElement> {
    callbackUrl?: string | undefined;
    code?: string | undefined;
    error?: string | undefined;
}
const apiEndpoint = process.env.NEXT_PUBLIC_API;

export const ResetForm = ({
    className,
    callbackUrl,
    ...props
}: ResetFormProps) => {
    //console.log(props.code);
    const [error, setError] = useState(props.error ?? null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [redirect, setRedirect] = useState("");
    const [code, setCode] = useState(props.code || undefined);

    useEffect(() => {
        //console.log("Callback URL", callbackUrl);
        //console.log(code);
        setRedirect(callbackUrl ?? "/");
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: code ?? "",
            password: "",
            passwordConfirmation: ""
        },
        mode: "onChange",
    });

    const resetPasswordHandler = async (code: string, password: string, passwordConfirmation: string) => {
        setIsLoading(true);
        const recover = await resetPassword(
            code,
            password,
            passwordConfirmation
        );
        //console.log(recover);
        if (recover) {
            toast.success(`Contraseña actualizada. `);
            setTimeout(() => {
                location.assign(redirect ? redirect : "/login");
            }, 500);
        } else {
            //console.log(recover);
            toast.error(`Error de recuperación: ${recover.message} `);
        }
        setIsLoading(false);
    };

    const resetPassword = async (
        code: string, password: string, passwordConfirmation: string
    ) => {
        try {
            //console.log(code, password, passwordConfirmation);
            const endPoint = `${apiEndpoint}password/reset`;
            //console.log(endPoint);
            const response = await fetch(endPoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code, password, passwordConfirmation }),
            });
            const reset = await response.json();
            //console.log(reset);
            if (reset?.success) {
                console.log(code);
                return reset;
            } else {
                return reset.message;
            }
        } catch (error) {
            toast.error(`Error cambiando el password: ${error} `);
            console.error(error);
            setError(error as string);
            return Promise.reject(error);
        }
        return true;
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await resetPasswordHandler(values.code, values.password, values.passwordConfirmation);
    };


    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form
                    method="POST"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=" border-1 shadow-2xl p-10 rounded-xl"
                >
                    <h1 className="text-2xl font-bold text-purple-700 mb-2">
                        Soul Academy
                    </h1>
                    <hr />
                    <h3 className="text-md font-semibold mb-7 mt-3">
                        Restablecer contraseña
                    </h3>
                    <div className="grid gap-2 bg-slate-100 p-4 rounded-xl">
                        <div className="grid gap-3">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="p.e: xasjdASD-as"
                                                {...field}
                                                autoComplete="code"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            <span className="text-[10px]">
                                                Ingresa el código recibido
                                            </span>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contraseña</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="p.e: nuevo password"
                                                type="password"
                                                {...field}
                                                autoComplete="password"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            <span className="text-[10px]">Ingresa tu nueva contraseña</span>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="passwordConfirmation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmar Contraseña</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="p.e: password"
                                                type="password"
                                                {...field}
                                                autoComplete="passwordConfirmation"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            <span className="text-[10px]">Ingresa de nuevo tu contraseña</span>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                        <div className="mt-4 w-full flex items-center justify-center">
                            <Button variant="default" disabled={isLoading} type="submit">
                                {isLoading && (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Enviar
                            </Button>
                        </div>
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-4">
                        Aún no tengo cuenta, quiero{" "}
                        <Link className="text-blue-500 hover:underline" href="/register">
                            Registrame
                        </Link>
                    </p>
                    <p className="text-center text-sm text-gray-600 mt-4">
                        Ya recordé mi contraseña, quiero
                        <Link className="text-blue-500 hover:underline" href="/login">
                            ingresar
                        </Link>{" "}
                        a mi cuenta
                    </p>
                </form>
            </Form>
        </div>
    );
};
