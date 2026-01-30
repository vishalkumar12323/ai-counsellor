import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import DashboardUI from "@/components/dashboard/DashboardUI";

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) {
        redirect("/login");
    }

    const profile = await db.profile.findUnique({
        where: { userId: session.id },
        include: { user: true }
    });

    if (!profile || !profile.isComplete) {
        redirect("/onboarding");
    }

    const tasks = await db.task.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: 'desc' }
    });

    return <DashboardUI profile={profile} tasks={tasks} />;
}
