"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ShoppingBag, Sparkles, User, Menu } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl">
                <SheetHeader className="text-left border-b border-zinc-200 dark:border-zinc-800 pb-4">
                  <SheetTitle className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-2">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center gap-3 rounded-lg px-3 py-3 text-lg font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                  >
                    <span className="h-2 w-2 rounded-full bg-zinc-300 transition-colors group-hover:bg-red-500 dark:bg-zinc-700" />
                    Home
                  </Link>
                  <Link
                    href="/#about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center gap-3 rounded-lg px-3 py-3 text-lg font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                  >
                    <span className="h-2 w-2 rounded-full bg-zinc-300 transition-colors group-hover:bg-red-500 dark:bg-zinc-700" />
                    About
                  </Link>
                  <Link
                    href="/#services"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center gap-3 rounded-lg px-3 py-3 text-lg font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                  >
                    <span className="h-2 w-2 rounded-full bg-zinc-300 transition-colors group-hover:bg-red-500 dark:bg-zinc-700" />
                    Services
                  </Link>
                  <Link
                    href="/#faq"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center gap-3 rounded-lg px-3 py-3 text-lg font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                  >
                    <span className="h-2 w-2 rounded-full bg-zinc-300 transition-colors group-hover:bg-red-500 dark:bg-zinc-700" />
                    FAQ
                  </Link>

                  <SignedIn>
                    <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                      <div className="px-3 mb-2 text-xs font-semibold uppercase text-zinc-400">
                        Account
                      </div>
                      <Link
                        href="/orders"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group flex items-center gap-3 rounded-lg px-3 py-3 text-lg font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                      >
                        <Package className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-red-500" />
                        My Orders
                      </Link>
                      <div className="mt-2 px-3 flex items-center gap-3">
                        <UserButton afterSwitchSessionUrl="/" />
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Manage Account</span>
                      </div>
                    </div>
                  </SignedIn>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
