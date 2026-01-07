"use server";

import { db } from "@/lib/db";
import { bookingRequests, schedules } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function manageRequest(formData: FormData) {
    const action = formData.get("action") as string;
    const requestId = parseInt(formData.get("requestId") as string);

    if (!requestId) return;

    if (action === "approve") {
        // Get request details
        const [request] = await db
            .select()
            .from(bookingRequests)
            .where(eq(bookingRequests.id, requestId));

        if (request) {
            // 1. Mark request as approved
            await db
                .update(bookingRequests)
                .set({ status: "approved" })
                .where(eq(bookingRequests.id, requestId));

            // 2. Add to schedule
            await db.insert(schedules).values({
                title: `Shot: ${request.name}`,
                scheduledDate: request.preferredDate,
                startTime: "2027-01-01 00:00:00",
                endTime: "2027-01-01 00:00:00",
            });
        }
    } else if (action === "reject") {
        await db
            .update(bookingRequests)
            .set({ status: "rejected" })
            .where(eq(bookingRequests.id, requestId));
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    redirect("/admin/dashboard");
}
