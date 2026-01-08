"use client";

import { useState } from "react";
import { adminLogin } from "./actions";
import { Lock, Loader2 } from "lucide-react";


export default function AdminLoginPage() {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        setError(null);
        try {
            const result = await adminLogin(formData);
            if (result?.error) {
                setError(result.error);
            }
        } catch (e) {
            if ((e as any).digest?.startsWith('NEXT_REDIRECT')) {
                throw e; // Re-throw it so Next.js can perform the navigation
            }
            console.log(e)
            // setError("Login failed. Check your password.");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="max-w-md mx-auto px-6 py-24 lg:py-48">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-foreground text-background rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Lock size={32} />
                </div>
                <h1 className="text-3xl font-serif mb-2">Admin Portal</h1>
                <p className="text-foreground/40">Secure access for photography management.</p>
            </div>

            <form action={handleSubmit} className="glass p-8 rounded-3xl space-y-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold opacity-40">Password</label>
                    <input
                        name="password"
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full bg-transparent border-b border-black/10 py-3 px-0 focus:outline-none focus:border-primary transition-colors"
                    />
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button
                    disabled={isPending}
                    className="btn-pastel w-full"
                >
                    {isPending ? <Loader2 className="animate-spin" size={20} /> : "Unlock Dashboard"}
                </button>
            </form>
        </div>
    );
}
