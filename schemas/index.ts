import * as z from "zod";


export const LoginSchema = z.object({
  email: z.string().email({
    message: "mail inválido",
  }),
  password: z.string().min(7).max(50),
});

export const RegisterFormSchema = z
  .object({
    name: z.string().min(2, "Nombre debe tener mínimo 2 caracters").max(15),
    lastname: z
      .string()
      .min(3, "Apellido debe tener mínimo 2 caracters")
      .max(15),
    email: z.string().email({
      message: "mail inválido",
    }),
    password: z
      .string()
      .min(7, "Minimo 7 caractéres, una mayúscula, un número")
      .max(50),
    accept: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.name !== "") {
        return true;
      }
      return false;
    },
    {
      message: `Nombre requerido}`,
      path: ["name"],
    }
  )
  .refine(
    (data) => {
      if (data.lastname !== "") {
        return true;
      }
      return false;
    },
    {
      message: `Apellido requerido}`,
      path: ["lastname"],
    }
  )
  .refine(
    (data) => {
      if (data.email !== "") {
        return true;
      }
      return false;
    },
    {
      message: `Email válido requerido`,
      path: ["email"],
    }
  )
  .refine(
    (data) => {
      if (data.password !== "") {
        return true;
      }
      return false;
    },
    {
      message: `Password requerido`,
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      if (data.accept) return true;
      return false;
    },
    {
      message: `Debes aceptar los términos de uso`,
      path: ["accept"],
    }
  );


