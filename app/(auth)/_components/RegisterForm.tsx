"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { SignInOptions, signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";;

import { RegisterFormSchema as registerFormSchema } from "../../utils/schemas";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/AppIcons";

const apiEndpoint = process.env.NEXT_PUBLIC_API;

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {
  callbackUrl?: string | undefined;
  error?: string | undefined;
}

export const RegisterForm = ({
  className,
  callbackUrl,
  ...props
}: RegisterFormProps) => {
  const [error, setError] = useState(props.error ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [redirect, setRedirect] = useState("");

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      password: "",
      accept: false,
    },
    mode: "onChange",
  });

  const loginUser = async (email: string, password: string) => {
    setIsLoading(true);
    const options: SignInOptions = {
      email,
      password,
      redirect: false,
    };
    const result: any = await signIn("credentials", options);
    if (result.ok) {
      toast.success("Registro y Autenticación exitosa!")
      setTimeout(() => {
        location.assign(redirect ? redirect : "/");
      }, 500);
    } else {
      toast.error(`Error de autenticación: ${result.error} `);
      setError(result.error);
    }
    setIsLoading(false);
  };
  const registerUser = async (
    name: string,
    lastname: string,
    email: string,
    password: string,
    accept: boolean
  ) => {
    try {
      const endPoint = `${apiEndpoint}user`;
      //console.log(endPoint);
      const response = await fetch(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, lastname, password, email, accept }),
      });
      const createUser = await response.json();
      if (createUser?.success) {
        //console.log(email, password);
        return createUser.user;
      } else {
        return createUser.message;
      }
    } catch (error) {
      toast.error(`Error de registro: ${error} `);
      console.error(error);
      setError(error as string);
      return Promise.reject(error);
    }
    return true;
  };

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    const newUser = await registerUser(
      values.name,
      values.lastname,
      values.email,
      values.password,
      values.accept
    );
    if (newUser.user) {
      await loginUser(values.email, values.password);
      //console.log(newUser);
    } else {
      console.error(newUser);
      toast.error(`Error de registro: ${newUser.message} `);
    }
  };

  useEffect(() => {
    //console.log("Callback URL", callbackUrl);
    setRedirect(callbackUrl ?? "/");
  }, []);

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          className=" border-1 shadow-2xl p-10 rounded-xl"
        >
          <h1 className="text-2xl font-bold mb-2 text-purple-700">
            Soul Academy
          </h1>
          <hr />
          <h3 className="text-sm font-semibold mb-7 mt-3">
            Bienvenido, por favor ingresa tus datos de registro.
          </h3>
          <div className="grid gap-2 bg-slate-100 p-4 rounded-xl">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="p.e: Juan Manuel"
                        {...field}
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormDescription>
                      <span className="text-[10px]">Tu nombre</span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="p.e: Rodriguez"
                        {...field}
                        autoComplete="lastname"
                      />
                    </FormControl>
                    <FormDescription>
                      <span className="text-[10px]">Ingresa tu apellido</span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="p.e: john@doe.com"
                        {...field}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormDescription>
                      <span className="text-[10px]">
                        Ingresa el correo electrónico de la cuenta
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
                        placeholder="**********"
                        type="password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      <span className="text-[10px]">Ingresa tu contraseña</span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-2 w-full">
              <FormField
                control={form.control}
                name="accept"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <Checkbox
                          className=" bg-slate-300"
                          checked={field.value}
                          onCheckedChange={field.onChange as () => void}
                        />
                        { }
                      </FormControl>
                      <div className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-90">
                        <FormLabel>
                          <span className=" text-slate-400">
                            Declaro que hé leido y acepto los{" "}
                            <Link href="#" target="_blank">
                              Términos de servicio
                            </Link>
                          </span>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="mt-4 w-full flex items-center justify-center">
              <Button variant="default" disabled={isLoading} type="submit">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Registrarme!
              </Button>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            Ya tengo mi cuenta, quiero{" "}
            <Link className="text-blue-500 hover:underline" href="/login">
              ingresar
            </Link>
          </p>
          <p className="text-center text-sm text-gray-600 mt-4">
            Olvidé mi password, quiero{" "}
            <Link className="text-blue-500 hover:underline" href="/recover">
              recuperar
            </Link>{" "}
            mi cuenta
          </p>
        </form>
      </Form>
    </div>
  );
};
