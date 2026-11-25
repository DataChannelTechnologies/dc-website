"use client";

import * as React from "react";
import { ArrowRight, Menu, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SmartLink } from "@/components/smart-link";
import type { SiteContent } from "@/lib/content";
import { cn } from "@/lib/utils";

export function SiteHeader({ site }: { site: SiteContent }) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {site.announcement.enabled && (
        <div className="bg-ink text-white">
          <div className="container-page flex h-10 items-center justify-center gap-2 text-center text-xs sm:text-sm">
            <Sparkles className="size-4 shrink-0 text-brand-orange" aria-hidden />
            <span className="truncate text-white/80">{site.announcement.text}</span>
            <SmartLink
              href={site.announcement.link.href}
              className="inline-flex shrink-0 items-center gap-1 font-semibold text-white hover:underline"
            >
              {site.announcement.link.label} <ArrowRight className="size-3.5" aria-hidden />
            </SmartLink>
          </div>
        </div>
      )}
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled ? "border-b bg-white/80 shadow-sm backdrop-blur-xl" : "bg-transparent"
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <SmartLink href="/" className="flex shrink-0 items-center" aria-label={`${site.name} home`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.logo} alt={site.name} className="h-8 w-auto lg:h-9" />
          </SmartLink>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {site.nav.map((item) =>
                item.items.length > 0 ? (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[560px] grid-cols-2 gap-1 p-2">
                        {item.items.map((sub) => (
                          <li key={sub.label}>
                            <NavigationMenuLink asChild>
                              <SmartLink href={sub.href}>
                                <span className="font-semibold text-ink">{sub.label}</span>
                                <span className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                  {sub.description}
                                </span>
                              </SmartLink>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <SmartLink href={item.href || "#"}>{item.label}</SmartLink>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden items-center gap-2 lg:flex">
            <Button asChild variant="ghost" size="sm">
              <SmartLink href={site.headerCtas.signIn.href}>{site.headerCtas.signIn.label}</SmartLink>
            </Button>
            <Button asChild size="sm">
              <SmartLink href={site.headerCtas.signUp.href}>
                {site.headerCtas.signUp.label} <ArrowRight />
              </SmartLink>
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={site.logo} alt={site.name} className="h-7 w-auto" />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-6 px-4 pb-6">
                {site.nav.map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    {item.items.length > 0 ? (
                      <>
                        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                          {item.label}
                        </p>
                        {item.items.map((sub) => (
                          <SheetClose asChild key={sub.label}>
                            <SmartLink
                              href={sub.href}
                              className="rounded-lg px-2 py-1.5 text-sm font-medium text-ink hover:bg-accent"
                            >
                              {sub.label}
                            </SmartLink>
                          </SheetClose>
                        ))}
                      </>
                    ) : (
                      <SheetClose asChild>
                        <SmartLink href={item.href || "#"} className="text-sm font-semibold text-ink">
                          {item.label}
                        </SmartLink>
                      </SheetClose>
                    )}
                  </div>
                ))}
                <div className="flex flex-col gap-2 border-t pt-6">
                  <Button asChild variant="outline">
                    <SmartLink href={site.headerCtas.signIn.href}>{site.headerCtas.signIn.label}</SmartLink>
                  </Button>
                  <Button asChild>
                    <SmartLink href={site.headerCtas.signUp.href}>{site.headerCtas.signUp.label}</SmartLink>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}
