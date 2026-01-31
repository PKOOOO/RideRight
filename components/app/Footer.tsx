"use client";

import { Phone, MessageCircle, Facebook } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const phoneNumber = "+254796611116";
  const whatsappNumber = "254796611116";

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Logo/Brand */}
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              RideRight
            </span>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Your Ride, Your Way
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <a
              href={`tel:${phoneNumber}`}
              className="flex items-center gap-2 text-zinc-600 transition-colors hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
            >
              <Phone className="h-4 w-4" />
              <span className="font-medium">{phoneNumber}</span>
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              © {new Date().getFullYear()} RideRight Autos Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="#faq"
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                FAQ
              </Link>
              <Link
                href="#about"
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                About
              </Link>
              <a
                href="https://www.facebook.com/share/1Hib4Rn1ft/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 transition-colors hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
