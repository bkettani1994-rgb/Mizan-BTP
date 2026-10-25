"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/components/navigation/nav-items";
import { LanguageToggle } from "@/components/navigation/language-toggle";
import { LogoutButton } from "@/components/navigation/logout-button";
import { useLocale } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <aside className="bg-hero-navy fixed inset-y-0 start-0 z-30 hidden w-64 flex-col md:flex">
      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <Image
          src="/mizan-logo-white.png"
          alt="Mizan BTP"
          width={160}
          height={53}
          priority
          className="h-9 w-auto"
        />
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl py-3 ps-4 pe-3.5 text-[15px] font-medium transition-all duration-150",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              <span
                className={cn(
                  "absolute inset-y-1.5 start-0 w-1 rounded-full bg-terracotta transition-transform duration-200",
                  isActive ? "scale-y-100" : "scale-y-0",
                )}
                aria-hidden
              />
              <Icon
                className={cn(
                  "size-5 shrink-0 transition-colors",
                  isActive ? "text-terracotta-light" : "group-hover:text-white",
                )}
              />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-5">
        <LanguageToggle variant="dark" />
        <LogoutButton variant="dark" />
        <p className="text-xs font-medium text-white/40">{t("brand.tagline")}</p>
      </div>
    </aside>
  );
}
