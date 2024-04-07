"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/AppIcons";
import toast from "react-hot-toast";

const formSchema = z.object({
    currentPassword: z.string(),
    password: z.string(),
    passwordConfirmation: z.string(),
});

interface ChangeFormProps extends React.HTMLAttributes<HTMLDivElement> {
    callbackUrl?: string | undefined;
    error?: string | undefined;
}
const apiEndpoint = process.env.NEXT_PUBLIC_API;
const DefaultValues = {
    currentPassword: "",
    password: "",
    passwordConfirmation: ""
}

export const ChangeForm = ({
    className,
    callbackUrl,
    ...props
}: ChangeFormProps) => {
    const [error, setError] = useState(props.error ?? null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [redirect, setRedirect] = useState("");

    useEffect(() => {
        //console.log("Callback URL", callbackUrl);
        setRedirect(callbackUrl ?? "/");
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: DefaultValues,
        mode: "onChange",
    });
    const handleOnCancel = () => {
        //console.log("CANCEL!!!");
        form.reset(DefaultValues);
        setTimeout(() => {
            location.assign(redirect ? redirect : "/");
        }, 500);
    }
    const resetPasswordHandler = async (currentPassword: string, password: string, passwordConfirmation: string) => {
        setIsLoading(true);
        const change = await resetPassword(
            currentPassword,
            password,
            passwordConfirmation
        );
        if (change.success) {
            toast.success(`Contraseña actualizada.`);

            setTimeout(() => {
                location.assign(redirect ? redirect : "/");
            }, 500);
        } else {
            console.error(change);
            toast.error(`Error de recuperación: ${change} `);
        }
        setIsLoading(false);
    };

    const resetPassword = async (
        currentPassword: string, password: string, passwordConfirmation: string
    ) => {
        try {
            //console.log(currentPassword, password, passwordConfirmation);
            const endPoint = `${apiEndpoint}password/change-password`;
            const response = await fetch(endPoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ currentPassword, password, passwordConfirmation }),
            });
            const reset = await response.json();
            //console.log(reset);
            if (reset?.success) {
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
        await resetPasswordHandler(values.currentPassword, values.password, values.passwordConfirmation);
    };


    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form
                    method="POST"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=" border-1 shadow-2xl p-10 rounded-xl"
                >
                    <h1 className="text-2xl font-bold text-teal-500 mb-2">
                        Soul Academy
                    </h1>
                    <hr />
                    <h3 className="text-md font-semibold mb-7 mt-3">
                        Cambiar contraseña
                    </h3>
                    <div className="grid gap-2 bg-slate-100 p-4 rounded-xl">
                        <div className="grid gap-3">
                            <FormField
                                control={form.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contraseña actual</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="p.e: xasjdASD-as"
                                                {...field}
                                                autoComplete="currentPassword"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            <span className="text-[10px]">
                                                Ingresa tu actual contraseña
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
                                        <FormLabel>Nueva Contraseña</FormLabel>
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
                        <div className="mt-4 w-full flex items-center justify-evenly ">
                            <Button variant="default" disabled={isLoading} type="submit">
                                {isLoading && (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Enviar
                            </Button>
                            <Button variant="destructive" type="button" onClick={handleOnCancel}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
};
