"use client";

import { CheckCircle2, Globe, Shield, Star, Award, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

const coreServices = [
    "End-to-end vehicle import services",
    "Sales and purchase of motor vehicles",
    "Vehicle trade-ins and upgrade solutions",
    "Support in accessing vehicle financing",
    "Expert motor vehicle consultation services",
];

const otherServices = [
    "Pre-purchase vehicle inspection & verification (local and overseas)",
    "Vehicle valuation services (for resale, insurance, or trade-ins)",
    "Fleet sourcing and management solutions for businesses and NGOs",
    "Assistance with insurance and registration",
    "Logbook processing and ownership transfer",
    "After-sales support and advisory",
    "Sourcing of spare parts and accessories on request",
    "Vehicle customization facilitation (Riveting, tinting, accessories)",
    "Import advisory for first-time buyers",
];

export function AboutSection() {
    return (
        <section id="about" className="scroll-mt-20 bg-white py-16 dark:bg-zinc-900 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* About Us Header */}
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-red-600 dark:text-red-500">
                        About RideRight Autos Ltd
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                        Where buying a car is simple, transparent, and hassle-free.
                    </p>
                    <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                        For over a decade, we have helped individuals and businesses get behind the wheel of quality vehicles with confidence, honesty, and zero stress.
                    </p>
                </div>

                {/* Introduction Text Grid */}
                <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
                    <div className="rounded-2xl bg-zinc-50 p-8 dark:bg-zinc-800/50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
                            <Globe className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">Global Sourcing</h3>
                        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                            We import vehicles from Japan, the UK, Australia, Thailand, and Dubai, handling everything from sourcing to shipping and customs.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-zinc-50 p-8 dark:bg-zinc-800/50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
                            <Star className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">Ready Stock</h3>
                        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                            Not into waiting? We have a range of ready-stock vehicles available at our showroom. Inspect and drive away today.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-zinc-50 p-8 dark:bg-zinc-800/50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
                            <HeartHandshake className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">Peace of Mind</h3>
                        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                            It’s not just about selling cars. It’s about great advice, smooth processes, and peace of mind from start to finish.
                        </p>
                    </div>
                </div>

                {/* Services Section */}
                <div id="services" className="mt-20 scroll-mt-20 sm:mt-24">
                    <div className="mx-auto max-w-2xl sm:text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">Our Services</h2>
                        <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                            From end-to-end importation to customization and after-sales support, we cover every aspect of your vehicle ownership journey.
                        </p>
                    </div>
                </div>

                <div className="mx-auto mt-16 max-w-7xl px-0 lg:px-8">
                    <div className="grid grid-cols-1 gap-y-16 gap-x-8 lg:grid-cols-2">
                        {/* Core Services */}
                        <div>
                            <div className="flex items-center gap-x-3 border-b border-zinc-200 pb-4 dark:border-zinc-700">
                                <Award className="h-6 w-6 text-red-600" />
                                <h3 className="text-xl font-semibold leading-8 text-zinc-900 dark:text-white">Core Services</h3>
                            </div>
                            <ul role="list" className="mt-8 space-y-4">
                                {coreServices.map((service, index) => (
                                    <li key={index} className="flex gap-x-3">
                                        <CheckCircle2 className="mt-1 h-5 w-5 flex-none text-emerald-600 dark:text-emerald-500" aria-hidden="true" />
                                        <span className="text-base leading-7 text-zinc-600 dark:text-zinc-300">{service}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Other Services */}
                        <div>
                            <div className="flex items-center gap-x-3 border-b border-zinc-200 pb-4 dark:border-zinc-700">
                                <Shield className="h-6 w-6 text-red-600" />
                                <h3 className="text-xl font-semibold leading-8 text-zinc-900 dark:text-white">Other Services</h3>
                            </div>
                            <ul role="list" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {otherServices.map((service, index) => (
                                    <li key={index} className="flex gap-x-3">
                                        <CheckCircle2 className="mt-1 h-5 w-5 flex-none text-zinc-400 dark:text-zinc-500" aria-hidden="true" />
                                        <span className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">{service}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
