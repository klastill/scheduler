"use server";

import { db } from "@/lib/db";
import { bookingRequests } from "@/lib/db/schema";

export async function submitBookingRequest(formData: FormData) {
    const name = formData.get("name") as string;
    const preferredDate = formData.get("preferredDate") as string;
    let startTime = formData.get("startTime") as string;
    let endTime = formData.get("endTime") as string;
    const description = formData.get("description") as string;

    if (!name || !preferredDate) {
        return { error: "Missing required fields" };
    }

    // Format hours as HH:00
    if (startTime) startTime = `${parseInt(startTime) < 10 ? '0' : ''}${startTime}:00`;
    if (endTime) endTime = `${parseInt(endTime) < 10 ? '0' : ''}${endTime}:00`;

    try {
        await db.insert(bookingRequests).values({
            name,
            preferredDate,
            startTime,
            endTime,
            description,
        });
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to submit request." };
    }
}
