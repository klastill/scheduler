import { db } from "@/lib/db";
import { schedules } from "@/lib/db/schema";
import { gte } from "drizzle-orm";
import { format } from "date-fns";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch upcoming schedules
  let upcomingSchedules: any[] = [];
  try {
    upcomingSchedules = await db
      .select()
      .from(schedules)
      .where(gte(schedules.scheduledDate, format(new Date(), "yyyy-MM-dd")))
      .orderBy(schedules.scheduledDate);
  } catch (e) {
    console.error("Database connection error or no tables yet:", e);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <section id="schedule" className="scroll-mt-32">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl lg:text-4xl">Scheduled</h2>
          <Link href="/book" className="btn-pastel">
            Contact
          </Link>
        </div>

        {upcomingSchedules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingSchedules.map((item) => (
              <div key={item.id} className="glass p-8 rounded-3xl hover-lift">
                <div className="flex items-center gap-2 text-primary font-medium mb-4">
                  <Calendar size={18} />
                  <span>{format(new Date(item.scheduledDate), "MMMM d, yyyy")}</span>
                </div>
                <h3 className="text-2xl mb-4">{item.title}</h3>
                <div className="space-y-3 text-sm text-foreground/40 pt-6 border-t border-black/5">
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{item.startTime} - {item.endTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-3xl border-dashed border-2">
            <p className="text-foreground/40 italic">No scheduled yet. Feel free to contact.</p>
          </div>
        )}
      </section>
    </div>
  );
}
