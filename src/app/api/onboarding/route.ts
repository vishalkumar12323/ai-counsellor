import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        // Check if user has a profile
        const existingProfile = await db.profile.findUnique({
            where: { userId: session.id },
        });

        if (existingProfile) {
            await db.profile.update({
                where: { id: existingProfile.id },
                data: {
                    ...data,
                    isComplete: true,
                },
            });
        } else {
            await db.profile.create({
                data: {
                    userId: session.id,
                    ...data,
                    isComplete: true,
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
