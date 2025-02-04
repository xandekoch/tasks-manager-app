"use client";

import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { useAuthStore } from "@/stores/authStore";
import { NAV_LINKS } from "@/constants";
import { ToggleThemeButton } from "./buttons/ToggleThemeButton";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

export const NavHeader = () => {
  const user = useAuthStore((state) => state._user);
  const logout = useAuthStore((state) => state.logout);
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    redirect("/");
  };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 md:px-20 gap-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6">△</div>
        </div>
        {/* Desktop */}
        <nav className="hidden lg:flex items-center space-x-4 lg:space-x-6">
          <Link
            href={'/dashboard'}
            className={`text-sm font-medium transition-colors ${pathname.startsWith('/dashboard')
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
              }`}
          >
            Dashboard
          </Link>
          {user?.role === 'admin' &&
            <Link
              href={'/users'}
              className={`text-sm font-medium transition-colors ${pathname.startsWith('/users')
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
                }`}
            >
              Users
            </Link>
          }
        </nav>

        {/* Mobile */}
        <div className="ml-0 flex items-center gap-4 lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem>
                <Link
                  href={'/dashboard'}
                  className={`text-sm font-medium transition-colors ${pathname.startsWith('/dashboard')
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                    }`}
                >
                  Dashboard
                </Link>
              </DropdownMenuItem>
              {user?.role === 'admin' &&
                <DropdownMenuItem>
                  <Link
                    href={'/users'}
                    className={`text-sm font-medium transition-colors ${pathname.startsWith('/users')
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                      }`}
                  >
                    Users
                  </Link>
                </DropdownMenuItem>
              }
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <ToggleThemeButton />
            <div className="flex items-center gap-2">
              <span className="text-sm">Welcome, {user?.name}</span>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user?.image} />
                  <AvatarFallback>{user?.name?.slice(0, 2) || "Ad"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 w-full text-left cursor-pointer font-medium"
                >
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
