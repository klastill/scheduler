"use server";

import { db } from "@/lib/db";
import { bookingRequests } from "@/lib/db/schema";

export async function submitBookingRequest(formData: FormData) {
    const name = formData.get("name") as string;
    const preferredDate = formData.get("preferredDate") as string;
    const description = formData.get("description") as string;

    if (!name || !preferredDate) {
        return { error: "Missing required fields" };
    }

    try {
        await db.insert(bookingRequests).values({
            name,
            preferredDate,
            description,
        });
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to submit request." };
    }
}
