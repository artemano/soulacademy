"use client";
import { useForm } from "react-hook-form";
import { startTransition, useEffect, useState, useTransition } from "react";
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

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/AppIcons";
import { RegisterFormSchema } from "@/schemas";
import { register } from "@/actions/register";
import CardWrarpper from "@/components/auth/card-wrapper";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";

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
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [redirect, setRedirect] = useState("");

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      password: "",
      accept: false,
    },
    mode: "onChange",
  });

  /* const loginUser = async (email: string, password: string) => {
     setisPending(true);
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
     setisPending(false);
   }; */
  const registerUser = async (
    name: string,
    lastname: string,
    email: string,
    password: string,
    accept: boolean
  ) => {
    try {
      const endPoint = `${apiEndpoint}user`;
      console.log(endPoint);
      const data = JSON.stringify({ name, lastname, password, email, accept });
      console.log(data);
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
        //console.log(email, password);
        return createUser.user;
      } else {
        return createUser.message;
      }
    } catch (error) {
      toast.error(`Error de registro: ${error} `);
      console.log(error);
      setError(error as string);
      return Promise.reject(error);
    }
  };

  const onSubmit = async (values: z.infer<typeof RegisterFormSchema>) => {
    const validateFields = RegisterFormSchema.safeParse(values);
    console.log(validateFields, "PASSED");
    if (!validateFields.success) {
      return { error: validateFields.error.message }
    }
    const { name, lastname, email, password, accept } = validateFields.data;
    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      }).catch((error) => console.log(error))
    })

  };

  useEffect(() => {
    //console.log("Callback URL", callbackUrl);
    setRedirect(callbackUrl ?? "/");
  }, []);

  return (
    <CardWrarpper headerLabel="Bienvenido, crea tu cuenta" backButtonLabel="Ya tienes cuenta?" backButtonHref="/login" showSocial >
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          className=" space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="p.e: Juan Manuel"
                      disabled={isPending}
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
                      disabled={isPending}
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
                      disabled={isPending}
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
                      disabled={isPending}
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
          <div className="mt-2">
            <FormField
              control={form.control}
              name="accept"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox
                        className=" bg-slate-300"
                        disabled={isPending}
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
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button variant="default" disabled={isPending} type="submit" className="w-full">
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Registrarme!
          </Button>
        </form>
      </Form>
    </CardWrarpper>
  );
};
