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
import Link from "next/dist/client/link";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/AppIcons";

const formSchema = z.object({
  email: z.string().email({
    message: "mail inválido",
  }),
});

interface RecoverFormProps extends React.HTMLAttributes<HTMLDivElement> {
  callbackUrl?: string | undefined;
  error?: string | undefined;
}
const apiEndpoint = process.env.NEXT_PUBLIC_API;

export const RecoverForm = ({
  className,
  callbackUrl,
  ...props
}: RecoverFormProps) => {
  const [error, setError] = useState(props.error ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    //console.log("Callback URL", callbackUrl);
    setRedirect(callbackUrl ?? "/login");
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const recoverUser = async (email: string) => {
    setIsLoading(true);
    const recover = await recoverPassword(
      email,
    );
    //console.log(recover);
    if (recover) {
      toast.success(`Solicitud procesada correctamente, revisa tu mail. `);
      setTimeout(() => {
        location.assign(redirect ? redirect : "/");
      }, 500);
    } else {
      console.error(recover);
      toast.error(`Error cambiando la contraseña: ${recover.message}`);
    }
    setIsLoading(false);
  };

  const recoverPassword = async (
    email: string,
  ) => {
    try {
      const endPoint = `${apiEndpoint}password/recover`;
      //console.log(endPoint);
      const response = await fetch(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const recover = await response.json();
      console.log(recover);
      if (recover?.success) {
        //console.log(email);
        return recover;
      } else {
        return recover.message;
      }
    } catch (error) {
      toast.error(`Error de solicitud: ${error} `);
      console.error(error);
      setError(error as string);
      return Promise.reject(error);
    }
    return true;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await recoverUser(values.email);
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
            Para recuperar tu contraseña, ingresa tus datos.
          </h3>
          <div className="grid gap-2 bg-slate-100 p-4 rounded-xl">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo</FormLabel>
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
