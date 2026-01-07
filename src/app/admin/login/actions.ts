"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLogin(formData: FormData) {
    const password = formData.get("password") as string;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (password === adminPassword) {
        const cookieStore = await cookies();
        cookieStore.set("admin_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
        });
        redirect("/admin/dashboard");
    } else {
        return { error: "Invalid password" };
    }
}

export async function adminLogout() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    redirect("/admin/login");
}
