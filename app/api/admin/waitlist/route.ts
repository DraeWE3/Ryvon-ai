import { addToWaitlist, getWaitlist } from "@/lib/db/queries";
import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "draewe3@gmail.com";

export async function GET() {
  const session = await auth();
  if (session?.user?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = await getWaitlist();
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { emails } = await req.json();

    if (!Array.isArray(emails)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    for (const email of emails) {
      await addToWaitlist(email);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ 
      error: String(error),
    }, { status: 500 });
  }
}
