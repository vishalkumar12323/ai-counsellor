import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import db from "@/lib/db";
import { loginUser } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isValid = await compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        await loginUser({ id: user.id, email: user.email, name: user.name });

        return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
