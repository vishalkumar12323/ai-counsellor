import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const unis = await db.savedUniversity.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ universities: unis });
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, location, website } = await req.json();

    const uni = await db.savedUniversity.create({
        data: {
            userId: session.id,
            name,
            location,
            website,
            category: "Target", // Default
            matchScore: 0
        }
    });

    return NextResponse.json({ university: uni });
}

export async function PATCH(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, isLocked } = await req.json();

    if (isLocked) {
        await db.savedUniversity.updateMany({
            where: { userId: session.id },
            data: { isLocked: false }
        });
    }

    const updated = await db.savedUniversity.update({
        where: { id, userId: session.id },
        data: { isLocked }
    });

    // Update Tasks maybe? (Application Guidance)
    if (isLocked) {
        await db.task.createMany({
            data: [
                { userId: session.id, title: `Submit Application for ${updated.name}`, status: "PENDING" },
                { userId: session.id, title: `Upload SOP for ${updated.name}`, status: "PENDING" },
                { userId: session.id, title: `Request Transcripts for ${updated.name}`, status: "PENDING" },
            ]
        });
    }

    return NextResponse.json({ university: updated });
}
