"use client";
import { useTransition } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { parseUrl } from "@/app/lib/url-utils";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/AppIcons";
import { LoginSchema } from "@/schemas";
import CardWrarpper from "@/components/auth/card-wrapper";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { login } from "@/actions/login";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
  callbackUrl?: string | undefined;
  error?: string | undefined;
}

export const LoginForm = ({
  className,
  callbackUrl,
  ...props
}: LoginFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    //console.log("Callback URL", callbackUrl);
    setRedirect(callbackUrl ?? "/");
  }, []);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  /*const loginUser = async (email: string, password: string) => {
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
  };*/

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    const validateFields = LoginSchema.safeParse(values);
    console.log(validateFields, "PASSED");
    if (!validateFields.success) {
      return { error: validateFields.error.message }
    }
    startTransition(() => {
      login(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        if (data.success) {
          setTimeout(() => {
            location.assign(redirect ? redirect : "/");
          }, 500);
        }
      }).catch(error => { setError(error) });
    })
  }

  return (
    <CardWrarpper
      headerLabel="Bienvenido de nuevo"
      backButtonLabel="No tienes aún tu cuenta?"
      backButtonHref="/register"
      showSocial
    >
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="p.e: pedro@example.com"
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
          <FormError message={error} />
          <FormSuccess message={success} />
          <div className="w-full">
            <Button variant="default" disabled={isPending} type="submit" className="w-full">
              {isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Ingresar
            </Button>
          </div>
        </form>
      </Form>
    </CardWrarpper>
  );
};
