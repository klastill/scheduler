"use client";

import { useState } from "react";
import { submitBookingRequest } from "./actions";
import { Calendar, User, MessageSquare, Loader2 } from "lucide-react";

export default function BookingPage() {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        setError(null);
        try {
            const result = await submitBookingRequest(formData);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess(true);
            }
        } catch (e) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsPending(false);
        }
    }

    if (success) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-24 text-center">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
                    <Calendar size={40} />
                </div>
                <h1 className="text-4xl mb-4">Request Sent!</h1>
                <p className="text-foreground/60 mb-10">
                    Thank you for reaching out. I'll review your photography request shortly.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="btn-pastel mx-auto"
                >
                    Send Another Request
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-12 lg:py-24">
            <div className="mb-12">
                <h1 className="text-4xl lg:text-5xl mb-4">Contact</h1>
            </div>

            <form action={handleSubmit} className="space-y-8 glass p-8 md:p-12 rounded-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-bold opacity-40 flex items-center gap-2">
                            <User size={14} /> Name*
                        </label>
                        <input
                            name="name"
                            type="text"
                            required
                            placeholder="Name"
                            className="w-full bg-transparent border-b border-black/10 py-3 px-0 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-bold opacity-40 flex items-center gap-2">
                            <Calendar size={14} /> Preferred Date*
                        </label>
                        <input
                            name="preferredDate"
                            type="date"
                            required
                            className="w-full bg-transparent border-b border-black/10 py-3 px-0 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold opacity-40 flex items-center gap-2">
                        <MessageSquare size={14} /> Description
                    </label>
                    <textarea
                        name="description"
                        rows={4}
                        placeholder="Social media account or link to contact, concept, studio, etc..."
                        className="w-full bg-transparent border-b border-black/10 py-3 px-0 focus:outline-none focus:border-primary transition-colors resize-none"
                    ></textarea>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    disabled={isPending}
                    className="btn-pastel w-full"
                >
                    {isPending ? <Loader2 className="animate-spin" size={20} /> : "Submit"}
                </button>
            </form>
        </div>
    );
}
