"use client";

import { Button, User, image } from "@nextui-org/react";
import { HiMenuAlt2 } from "react-icons/hi";
import { LuX } from "react-icons/lu";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { useRef } from "react";
import Logo from "../ui/logo";
import { useSession } from "next-auth/react";
import { mobileSideNavItems } from "@/lib/constants";
import Link from "next/link";
import { useIsActive } from "@/lib/hooks/useIsActive";
import { ISideBarNav, ISideBarNavItem } from "./sidebar-nav";

export default function MobileSidebar() {
  const { data } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuElement = useRef<HTMLDivElement>(null);

  function openMenu() {
    setIsMenuOpen(true);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuElement.current) {
        if (
          event.target !== menuElement.current &&
          !menuElement.current.contains(event.target as Node)
        ) {
          closeMenu();
        }
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      <Button
        variant="light"
        isIconOnly
        className="rounded-xl text-[1.3rem] hover:bg-secondary hover:text-secondary md:hidden"
        onClick={openMenu}
      >
        <HiMenuAlt2 />
      </Button>

      {/* backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[15] h-screen w-screen bg-[#292f46]/50 backdrop-blur-md 
          backdrop-opacity-30 transition-all duration-1000 ease-in-out md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* menu */}
      <aside
        ref={menuElement}
        className={cn(
          `fixed left-0 top-0 z-[20] h-screen w-[300px] border-r border-borderColor bg-background transition-all
           duration-1000 ease-in-out md:hidden`,
          {
            "transition-delay-300 translate-x-0": isMenuOpen,
            "transition-delay-300 -translate-x-full": !isMenuOpen,
          },
        )}
      >
        <div
          className=" flex h-full w-full flex-col items-start 
          justify-between p-5"
        >
          <div className="flex w-full flex-col gap-12">
            {/* upper part */}
            <div className="flex w-full items-center justify-between">
              <Logo />
              <Button
                variant="light"
                isIconOnly
                className="rounded-xl text-[1.3rem]"
                onClick={closeMenu}
              >
                <LuX />
              </Button>
            </div>

            {/* lower part */}
            <div className="w-full">
              {/* menu navs  */}
              <div className="flex flex-col gap-6">
                {mobileSideNavItems.map((nav, index) => (
                  <MobileSidebarNav
                    key={nav.title + index}
                    closeMenu={closeMenu}
                    title={nav.title}
                    items={nav.items}
                  />
                ))}
              </div>
            </div>
          </div>

          <User
            as="button"
            avatarProps={{
              src: data?.user?.image ?? "",
              size: "sm",
            }}
            description={data?.user.email}
            name={data?.user.name}
            classNames={{
              name: "text-sm",
              description: "text-xs",
            }}
          />
        </div>
      </aside>
    </>
  );
}

interface IMobileSideBarNav extends ISideBarNav {
  closeMenu: () => void;
}

function MobileSidebarNav({ title, items, closeMenu }: IMobileSideBarNav) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold">{title}</p>
      {/* nav items */}
      <ul className="flex flex-col gap-2">
        {items.map((navItem, index) => (
          <MobileSidebarNavItem
            key={index + navItem.title}
            href={navItem.href}
            title={navItem.title}
            icon={navItem.icon}
            closeMenu={closeMenu}
          />
        ))}
      </ul>
    </div>
  );
}

interface IMobileSidebarNavItem extends ISideBarNavItem {
  closeMenu: () => void;
}

function MobileSidebarNavItem({
  href,
  title,
  icon: Icon,
  closeMenu,
}: IMobileSidebarNavItem) {
  const isActive = useIsActive();

  return (
    <Link
      href={href}
      className={`flex w-full items-center gap-2 
      rounded-2xl bg-light p-2 text-xs
        font-[500] transition-all duration-1000 ease-in-out hover:bg-lightHover ${
          isActive(href)
            ? "bg-lightHover font-[600] text-activeNavTextColor"
            : "text-navTextColor"
        }`}
      onClick={closeMenu}
    >
      <p
        className={cn(
          "rounded-[.8rem] bg-background p-2 text-[1.2rem] text-secondary",
        )}
      >
        {Icon && <Icon />}
      </p>
      {title}
    </Link>
  );
}