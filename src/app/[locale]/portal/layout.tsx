import Sidebar from "@/components/portal/Sidebar";
import { auth } from "@/auth";

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <div className="flex min-h-screen bg-zinc-950 text-zinc-200">
            <Sidebar userRole={session?.user?.role} />
            <main className="flex-1 overflow-y-auto h-screen">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
