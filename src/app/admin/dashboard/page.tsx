import { db } from "@/lib/db";
import { bookingRequests, schedules } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { format } from "date-fns";
import { Check, X, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { manageRequest } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    // Simple auth check (checking for a cookie)
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session")?.value === "true";

    if (!isAdmin) {
        redirect("/admin/login");
    }

    let requests: any[] = [];
    let currentSchedules: any[] = [];

    try {
        requests = await db
            .select()
            .from(bookingRequests)
            .where(eq(bookingRequests.status, "pending"))
            .orderBy(desc(bookingRequests.createdAt));

        currentSchedules = await db
            .select()
            .from(schedules)
            .orderBy(desc(schedules.scheduledDate));
    } catch (e) {
        console.error("Database connection error or no tables yet:", e);
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-12">
                <h1 className="text-4xl">Admin Dashboard</h1>
                <div className="flex gap-4">
                    <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                        {requests.length} Pending Requests
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Pending Requests */}
                <div className="lg:col-span-2 space-y-8">
                    <h2 className="text-2xl mb-6">Pending Requests</h2>
                    {requests.length > 0 ? (
                        <div className="space-y-6">
                            {requests.map((request) => (
                                <div key={request.id} className="glass p-8 rounded-3xl">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-xl mb-1">{request.name}</h3>
                                            <p className="text-sm text-foreground/40">{request.email} • {request.phone}</p>
                                        </div>
                                        <div className="bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                                            Pending
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-primary text-sm font-medium mb-4">
                                        <CalendarIcon size={14} />
                                        <span>Requested for: {format(new Date(request.preferredDate), "MMMM d, yyyy")}</span>
                                    </div>

                                    <p className="text-foreground/70 text-sm mb-8 bg-black/5 p-4 rounded-xl italic">
                                        "{request.description || "No details provided."}"
                                    </p>

                                    <div className="flex gap-4">
                                        <form action={manageRequest} className="flex-1">
                                            <input type="hidden" name="action" value="approve" />
                                            <input type="hidden" name="requestId" value={request.id} />
                                            <button className="btn-pastel w-full text-xs py-3 uppercase tracking-widest">
                                                <Check size={14} /> Approve
                                            </button>
                                        </form>
                                        <form action={manageRequest}>
                                            <input type="hidden" name="action" value="reject" />
                                            <input type="hidden" name="requestId" value={request.id} />
                                            <button className="px-6 py-3 rounded-xl border border-black/10 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-50 transition-colors">
                                                <X size={14} />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center glass rounded-3xl border-dashed border-2">
                            <p className="text-foreground/40 italic">No pending requests at the moment.</p>
                        </div>
                    )}
                </div>

                {/* Schedule Overview */}
                <div className="space-y-8">
                    <h2 className="text-2xl mb-6">Active Schedule</h2>
                    <div className="space-y-4">
                        {currentSchedules.map((item) => (
                            <div key={item.id} className="p-6 border-b border-black/5 last:border-0 hover:bg-black/5 transition-colors rounded-2xl group">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-primary uppercase">{format(new Date(item.scheduledDate), "MMM d")}</span>
                                    <button className="text-foreground/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                        <X size={14} />
                                    </button>
                                </div>
                                <h4 className="font-serif text-lg mb-1">{item.title}</h4>
                                <div className="flex items-center gap-2 text-[10px] text-foreground/40 uppercase tracking-tight">
                                    <Clock size={10} /> {item.startTime} • <MapPin size={10} /> {item.location}
                                </div>
                            </div>
                        ))}
                        {currentSchedules.length === 0 && (
                            <p className="text-sm text-foreground/40 italic px-4">No scheduled sessions yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
