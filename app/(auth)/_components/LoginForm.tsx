"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SignInOptions, signIn } from "next-auth/react";
import Link from "next/dist/client/link";
import toast from "react-hot-toast";
import { parseUrl } from "@/app/lib/url-utils";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/AppIcons";

const formSchema = z.object({
  email: z.string().email({
    message: "mail inválido",
  }),
  password: z.string().min(7).max(50),
});

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
  callbackUrl?: string | undefined;
  error?: string | undefined;
}

export const LoginForm = ({
  className,
  callbackUrl,
  ...props
}: LoginFormProps) => {
  const [error, setError] = useState(props.error ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    //console.log("Callback URL", callbackUrl);
    setRedirect(callbackUrl ?? "/");
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
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
      toast.success("Autenticación exitosa!");
      setTimeout(() => {
        location.assign(redirect ? redirect : "/");
      }, 500);
    } else {
      console.error(result);
      toast.error(`Error de autenticación. Credenciales de Accesso Inválidas. `);
      setError(result.error);
    }
    setIsLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await loginUser(values.email, values.password);
  };
  const getPathFromUrl = (url: string | undefined) => {
    if (url) {
      const parsedUrl = parseUrl(decodeURIComponent(url));
      if (parsedUrl) {
        const pathName = parsedUrl.pathname;
        const returnValue = pathName.startsWith("/")
          ? pathName.substring(1, pathName.length)
          : pathName;
        return returnValue;
      }
    }
    return "/";
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
            Bienvenido, ingresa tus datos.
          </h3>
          <div className="grid gap-2 bg-slate-100 p-4 rounded-xl">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario</FormLabel>
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
            <div className="mt-4 w-full flex items-center justify-center">
              <Button variant="default" disabled={isLoading} type="submit">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Ingresar
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
