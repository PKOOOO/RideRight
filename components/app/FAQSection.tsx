"use client";

import { useState } from "react";
import { ChevronDown, ShieldCheck, Truck, CreditCard, PenTool, Calendar, Star, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const faqs = [
    {
        question: "How does the vehicle importation process work?",
        answer: "We handle the entire process from vehicle sourcing and inspection, shipping, customs clearance, registration, to delivery at your doorstep.",
        icon: Truck,
    },
    {
        question: "Which countries do you import vehicles from?",
        answer: "We import vehicles from Japan, the UK, Australia, Thailand, and Dubai.",
        icon: Globe,
    },
    {
        question: "How long does it take to import a vehicle?",
        answer: "Importation typically takes 6–10 weeks, depending on the source country, shipping schedules, and clearance timelines.",
        icon: Calendar,
    },
    {
        question: "Are your prices all-inclusive?",
        answer: "Yes. Our pricing is transparent and clearly itemized upfront, with no hidden charges.",
        icon: CreditCard,
    },
    {
        question: "Do you inspect vehicles before purchase?",
        answer: "Yes. All vehicles undergo thorough pre-purchase inspection and verification, both locally and overseas.",
        icon: ShieldCheck,
    },
    {
        question: "Do you assist with vehicle financing and trade-ins?",
        answer: "Yes. We facilitate access to vehicle financing through partner institutions and also accept trade-ins for upgrades or purchases.",
        icon: CreditCard,
    },
    {
        question: "Do you handle customs clearance, registration, and logbooks?",
        answer: "Yes. We manage customs clearance, KEBS compliance, registration, and logbook processing to ensure the vehicle is road-ready.",
        icon: PenTool,
    },
    {
        question: "Do you deliver vehicles outside Nairobi?",
        answer: "Yes. We offer countrywide delivery, straight to your preferred location.",
        icon: Truck,
    },
    {
        question: "Can I visit your showroom or buy from ready stock?",
        answer: "Absolutely. We have ready stock vehicles at our showroom, and clients are welcome to visit, inspect, and choose a vehicle on-site.",
        icon: Calendar,
    },
    {
        question: "What makes RideRight Autos Ltd different?",
        answer: "With over a decade of experience, we prioritize integrity, transparency, and end-to-end service—making vehicle ownership simple and hustle-free.",
        icon: Star,
    },
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [showAll, setShowAll] = useState(false);

    const visibleFaqs = showAll ? faqs : faqs.slice(0, 5);

    return (
        <section id="faq" className="scroll-mt-20 py-12 sm:py-16 lg:py-20 bg-zinc-50 dark:bg-zinc-950">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 sm:mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                        Everything you need to know about buying your dream car with RideRight.
                    </p>
                </div>

                <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-xl shadow-zinc-200/50 dark:shadow-none rounded-2xl">
                    <div className="p-2 sm:p-4">
                        {visibleFaqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            const Icon = faq.icon;

                            return (
                                <Collapsible
                                    key={index}
                                    open={isOpen}
                                    onOpenChange={() => setOpenIndex(isOpen ? null : index)}
                                    className={cn(
                                        "mb-2 rounded-xl transition-all duration-200",
                                        isOpen
                                            ? "bg-zinc-50 dark:bg-zinc-800/50"
                                            : "hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                                    )}
                                >
                                    <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                                                isOpen
                                                    ? "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400"
                                                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                                            )}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100 sm:text-lg">
                                                {faq.question}
                                            </span>
                                        </div>
                                        <ChevronDown
                                            className={cn(
                                                "h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-200",
                                                isOpen && "rotate-180 text-red-600 dark:text-red-400"
                                            )}
                                        />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className="px-4 pb-5 pl-[4.5rem] pr-4 sm:pr-10 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                                            {faq.answer}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            );
                        })}
                    </div>

                    {/* Show more/less button */}
                    {faqs.length > 5 && (
                        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
                            <Button
                                variant="ghost"
                                onClick={() => setShowAll(!showAll)}
                                className="w-full text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                            >
                                {showAll ? "Show Less" : `Show ${faqs.length - 5} More Questions`}
                                <ChevronDown
                                    className={cn(
                                        "ml-2 h-4 w-4 transition-transform",
                                        showAll && "rotate-180"
                                    )}
                                />
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </section>
    );
}
