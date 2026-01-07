export default function TestThemePage() {
    const colors = [
        { name: "Background", variable: "var(--background)", description: "Main page background color" },
        { name: "Foreground", variable: "var(--foreground)", description: "Default text color" },
        { name: "Primary", variable: "var(--primary)", description: "Primary action/accent color (Pink/Peach)" },
        { name: "Secondary", variable: "var(--secondary)", description: "Secondary background/accent (Blue/Sage)" },
        { name: "Accent", variable: "var(--accent)", description: "Subtle highlight color" },
        { name: "Muted", variable: "var(--color-muted)", description: "Used for backgrounds of cards or containers" },
    ];

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <h1 className="text-4xl mb-8">Theme Visualization</h1>

            <section className="mb-16">
                <h2 className="text-2xl mb-6">Color Palette</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {colors.map((color) => (
                        <div key={color.name} className="glass p-6 rounded-3xl space-y-4">
                            <div
                                className="w-full h-24 rounded-2xl border border-black/5"
                                style={{ backgroundColor: color.variable }}
                            ></div>
                            <div>
                                <h3 className="text-lg font-bold">{color.name}</h3>
                                <p className="text-sm opacity-60 font-mono">{color.variable}</p>
                                <p className="text-sm mt-2 opacity-80">{color.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-16">
                <h2 className="text-2xl mb-6">Typography & Components</h2>
                <div className="space-y-12">
                    <div className="glass p-8 rounded-3xl">
                        <h1 className="text-5xl lg:text-7xl mb-4">Heading One</h1>
                        <h2 className="text-4xl lg:text-5xl mb-4">Heading Two</h2>
                        <h3 className="text-3xl lg:text-4xl mb-4">Heading Three</h3>
                        <p className="text-lg opacity-80 leading-relaxed max-w-2xl">
                            This is a standard body paragraph. It uses the Sans font (Inter) for readability.
                            The layout follows a clean, minimal, and typography-first approach.
                        </p>
                    </div>

                    <div className="glass p-8 rounded-3xl space-y-8">
                        <h3 className="text-2xl">Buttons</h3>
                        <div className="flex flex-wrap gap-4">
                            <button className="btn-pastel">Pastel Primary</button>
                            <button className="btn-pastel-secondary">Pastel Secondary</button>
                            <button className="btn-pastel-outline">Pastel Outline</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass p-8 rounded-3xl hover-lift border border-primary/20">
                            <h3 className="text-xl mb-4">Glass Card (Lift)</h3>
                            <p className="opacity-60 text-sm">Cards use glassmorphism with a subtle border colored by the primary accent.</p>
                        </div>
                        <div className="glass p-8 rounded-3xl hover-lift">
                            <h3 className="text-xl mb-4">Standard Card</h3>
                            <p className="opacity-60 text-sm">Standard glass card without the primary border accent.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
