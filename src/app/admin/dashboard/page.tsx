import { db } from "@/lib/db";
import { bookingRequests, schedules } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { format } from "date-fns";
import { Check, X, Calendar as CalendarIcon, Clock, MapPin, RotateCcw, Trash2 } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { manageRequest, deleteScheduleItem, deleteRequest, revertRequest } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    // Simple auth check (checking for a cookie)
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session")?.value === "true";

    if (!isAdmin) {
        redirect("/admin/login");
    }

    let pendingRequests: any[] = [];
    let approvedRequests: any[] = [];
    let rejectedRequests: any[] = [];
    let currentSchedules: any[] = [];

    try {
        pendingRequests = await db
            .select()
            .from(bookingRequests)
            .where(eq(bookingRequests.status, "pending"))
            .orderBy(desc(bookingRequests.createdAt));

        approvedRequests = await db
            .select()
            .from(bookingRequests)
            .where(eq(bookingRequests.status, "approved"))
            .orderBy(desc(bookingRequests.createdAt));

        rejectedRequests = await db
            .select()
            .from(bookingRequests)
            .where(eq(bookingRequests.status, "rejected"))
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
                    <span className="bg-primary/40 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                        {pendingRequests.length} Pending
                    </span>
                    <span className="bg-accent/40 text-green-600/50 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                        {approvedRequests.length} Approved
                    </span>
                    <span className="bg-secondary/40 text-red-600/50 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                        {rejectedRequests.length} Rejected
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Pending Requests */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Pending Requests */}
                    <section className="space-y-8">
                        <h2 className="text-2xl mb-6">Pending Requests</h2>
                        {pendingRequests.length > 0 ? (
                            <div className="space-y-6">
                                {pendingRequests.map((request) => (
                                    <div key={request.id} className="glass p-8 rounded-3xl">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-xl mb-1">{request.name}</h3>
                                            </div>
                                            <div className="bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                                                Pending
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 mb-4">
                                            <div className="flex items-center gap-2 text-primary text-sm font-medium">
                                                <CalendarIcon size={14} />
                                                <span>Requested for: {format(new Date(request.preferredDate), "MMMM d, yyyy")}</span>
                                            </div>
                                            {(request.startTime || request.endTime) && (
                                                <div className="flex items-center gap-2 text-primary/80 text-xs font-medium">
                                                    <Clock size={12} />
                                                    <span>Requested Time: {request.startTime || "00:00"} - {request.endTime || "00:00"}</span>
                                                </div>
                                            )}
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
                    </section>

                    {/* Approved & Rejected History */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="space-y-6">
                            <h3 className="text-xl opacity-60">Approved History</h3>
                            <div className="space-y-4">
                                {approvedRequests.map((request) => (
                                    <div key={request.id} className="p-6 bg-accent/40 rounded-2xl border border-accent/10 group relative">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-sm">{request.name}</h4>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <form action={revertRequest}>
                                                    <input type="hidden" name="requestId" value={request.id} />
                                                    <button type="submit" className="text-foreground/40 hover:text-primary transition-colors cursor-pointer" title="Revert to Pending">
                                                        <RotateCcw size={14} />
                                                    </button>
                                                </form>
                                                <form action={deleteRequest}>
                                                    <input type="hidden" name="requestId" value={request.id} />
                                                    <button type="submit" className="text-foreground/40 hover:text-red-500 transition-colors cursor-pointer" title="Delete Permanent">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-foreground/40 uppercase mb-3">
                                            {format(new Date(request.preferredDate), "MMM d, yyyy")}
                                        </p>
                                        <p className="text-xs text-foreground/60 line-clamp-2 italic">"{request.description}"</p>
                                    </div>
                                ))}
                                {approvedRequests.length === 0 && <p className="text-sm text-foreground/20 italic">No history.</p>}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-xl opacity-60">Rejected History</h3>
                            <div className="space-y-4">
                                {rejectedRequests.map((request) => (
                                    <div key={request.id} className="p-6 bg-secondary/40 rounded-2xl border border-secondary/10 group relative">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-sm">{request.name}</h4>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <form action={revertRequest}>
                                                    <input type="hidden" name="requestId" value={request.id} />
                                                    <button type="submit" className="text-foreground/40 hover:text-primary transition-colors cursor-pointer" title="Revert to Pending">
                                                        <RotateCcw size={14} />
                                                    </button>
                                                </form>
                                                <form action={deleteRequest}>
                                                    <input type="hidden" name="requestId" value={request.id} />
                                                    <button type="submit" className="text-foreground/40 hover:text-red-500 transition-colors cursor-pointer" title="Delete Permanent">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-foreground/40 uppercase mb-3">
                                            {format(new Date(request.preferredDate), "MMM d, yyyy")}
                                        </p>
                                        <p className="text-xs text-foreground/60 line-clamp-2 italic">"{request.description}"</p>
                                    </div>
                                ))}
                                {rejectedRequests.length === 0 && <p className="text-sm text-foreground/20 italic">No history.</p>}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Schedule Overview */}
                <div className="space-y-8">
                    <h2 className="text-2xl mb-6">Active Schedule</h2>
                    <div className="space-y-4">
                        {currentSchedules.map((item) => (
                            <div key={item.id} className="p-6 border-b border-black/5 last:border-0 hover:bg-black/5 transition-colors rounded-2xl group">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-primary uppercase">{format(new Date(item.scheduledDate), "MMM d")}</span>
                                    <form action={deleteScheduleItem}>
                                        <input type="hidden" name="id" value={item.id} />
                                        <button className="text-foreground/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                                            <X size={14} />
                                        </button>
                                    </form>
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
