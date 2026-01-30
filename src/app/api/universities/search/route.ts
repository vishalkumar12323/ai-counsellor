import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (!name) {
        return NextResponse.json({ error: "Name parameter is required" }, { status: 400 });
    }

    try {
        const res = await fetch(`http://universities.hipolabs.com/search?name=${encodeURIComponent(name)}`);

        if (!res.ok) {
            throw new Error(`External API responded with status: ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Proxy error:", error);
        return NextResponse.json({ error: "Failed to fetch university data" }, { status: 500 });
    }
}
