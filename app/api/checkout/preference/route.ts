import { ZodError, z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/options";
// Agrega credenciales
const accessToken = process.env.MP_ACCESS_TOKEN;
const backLinks = process.env.MP_BACK_LINKS;
const notificationsEndPoint = `${process.env.NEXT_PUBLIC_API!}notifications`;

const client = new MercadoPagoConfig({ accessToken: accessToken! });

const PreferenceSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  quantity: z.number().positive(),
  price: z.number().positive(),
  currency_id: z.string().length(3),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { id, title, category, quantity, price, currency_id } =
      PreferenceSchema.parse(await req.json());
    //console.log(
    //  "CHECKOUT",
    //  "------------------------------------------------------------"
    //);
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.redirect("/api/auth/signin");
    const user = session.user;
    const body = {
      items: [
        {
          id,
          title,
          category_id: category,
          quantity: Number(quantity),
          unit_price: Number(price),
          currency_id,
        },
      ],
      payer: {
        name: user.name!,
        surname: user.lastname!,
        email: user.username!,
      },
      back_urls: {
        success: `${backLinks}feedback/success`,
        failure: `${backLinks}feedback/failure`,
        pending: `${backLinks}feedback/pending`,
      },
      external_reference: user.username!,
      auto_return: "approved",
      notification_url: notificationsEndPoint,
    };
    const preference = new Preference(client);
    const responsePreference = await preference.create({ body });
    //console.log(responsePreference.id);
    if (responsePreference.id) {
      return NextResponse.json({ id: responsePreference.id }, { status: 201 });
    }
    return NextResponse.json(
      { message: "Error al crear la preferencia" },
      { status: 500 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error al crear la preferencia" },
      { status: 400 }
    );
  }
}
