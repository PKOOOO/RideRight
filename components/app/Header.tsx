"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ShoppingBag, Sparkles, User, Menu, Instagram, Facebook, X } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useCartActions, useTotalItems } from "@/lib/store/cart-store-provider";
import { useChatActions, useIsChatOpen } from "@/lib/store/chat-store-provider";

export function Header() {
  const { openCart } = useCartActions();
  const { openChat } = useChatActions();
  const isChatOpen = useIsChatOpen();
  const totalItems = useTotalItems();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/loggo.png"
            alt="RideRight Logo"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="/#about"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            About
          </a>
          <a
            href="/#services"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Services
          </a>
          <a
            href="/#faq"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            FAQ
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* My Orders - Only when signed in */}
          <SignedIn>
            <Button asChild>
              <Link href="/orders" className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <span className="text-sm font-medium">My Orders</span>
              </Link>
            </Button>
          </SignedIn>

          {/* AI Shopping Assistant */}
          {!isChatOpen && (
            <Button
              onClick={openChat}
              className="gap-2 bg-gradient-to-r from-red-500 to-red-500 text-white shadow-md shadow-red-200/50 transition-all hover:from-red-600 hover:to-red-600 hover:shadow-lg hover:shadow-red-300/50 dark:shadow-red-900/30 dark:hover:shadow-800/40"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Ask AI</span>
            </Button>
          )}

          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={openCart}
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
            <span className="sr-only">Open cart ({totalItems} items)</span>
          </Button>

          {/* User */}
          <SignedIn>
            <UserButton
              afterSwitchSessionUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Orders"
                  labelIcon={<Package className="h-4 w-4" />}
                  href="/orders"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                <User className="h-5 w-5" />
                <span className="sr-only">Sign in</span>
              </Button>
            </SignInButton>
          </SignedOut>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`absolute top-full left-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-xl transition-all duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-950/95 ${isMobileMenuOpen
          ? "translate-y-0 opacity-100 visible"
          : "-translate-y-4 opacity-0 invisible"
          }`}
      >
        <div className="flex flex-col p-6 space-y-6 max-h-[80vh] overflow-y-auto items-center text-center">
          <div className="flex flex-col gap-2 w-full max-w-[200px]">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="group flex items-center justify-center gap-3 rounded-lg px-4 py-3 text-lg font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              Home
            </Link>
            <Link
              href="/#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="group flex items-center justify-center gap-3 rounded-lg px-4 py-3 text-lg font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              About
            </Link>
            <Link
              href="/#services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="group flex items-center justify-center gap-3 rounded-lg px-4 py-3 text-lg font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              Services
            </Link>
            <Link
              href="/#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="group flex items-center justify-center gap-3 rounded-lg px-4 py-3 text-lg font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              FAQ
            </Link>
          </div>

          <SignedIn>
            <div className="pb-4 w-full max-w-[200px] border-b border-zinc-200 dark:border-zinc-800">
              <Link
                href="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="group flex items-center justify-center gap-3 rounded-lg px-4 py-3 text-lg font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              >
                <Package className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-red-500" />
                My Orders
              </Link>
              <div className="mt-2 flex items-center justify-center gap-3">
                <UserButton afterSwitchSessionUrl="/" />
              </div>
            </div>
          </SignedIn>

          {/* Social Icons */}
          <div className="flex items-center gap-6 pt-2">
            <a href="#" className="text-red-500 hover:text-red-600 transition-colors">
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" className="text-red-500 hover:text-red-600 transition-colors">
              <FaXTwitter className="h-6 w-6" />
              <span className="sr-only">X (Twitter)</span>
            </a>
            <a href="#" className="text-red-500 hover:text-red-600 transition-colors">
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </a>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-30 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}
