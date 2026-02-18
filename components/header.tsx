"use client"

import * as React from "react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import {
    IconUserCircle,
    IconSettings,
    IconLogout,
    IconChevronDown,
    IconLayoutDashboard
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { getCartCount } from "@/lib/actions/cart-actions"

export function Header() {
    const { data: session } = useSession()
    const [cartCount, setCartCount] = React.useState(0)

    React.useEffect(() => {
        const fetchCartCount = async () => {
            if ((session?.user as any)?.userType === "customer") {
                const count = await getCartCount()
                setCartCount(count)
            } else {
                setCartCount(0)
            }
        }
        fetchCartCount()
    }, [session])

    return (
        <header className=" top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-8 mx-auto">
                <div className="hidden md:flex items-center space-x-4">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link href="/products" legacyBehavior passHref>
                                    <NavigationMenuLink className=" relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100 uppercase tracking-widest ">
                                        Product
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="https://res.cloudinary.com/djxplzruy/image/upload/v1769671252/qsiqelb26rr3t9tjsrkl.png"
                            alt="Xinna Logo"
                            width={240}
                            height={40}
                            className="h-6 w-auto object-contain"
                        />
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-4">
                            <NavigationMenuItem>
                                <Link href="/cart" legacyBehavior passHref>
                                    <NavigationMenuLink className=" relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100 uppercase tracking-widest flex flex-row items-center gap-1.5 ">
                                        Cart <span className="inline-flex items-center justify-center leading-none shrink-0 font-normal">
                                            ({cartCount})
                                        </span>
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                {!session ? (
                                    <Link href="/login" legacyBehavior passHref>
                                        <NavigationMenuLink className="relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100 uppercase tracking-widest ">
                                            Login
                                        </NavigationMenuLink>
                                    </Link>
                                ) : (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100 uppercase tracking-widest flex items-center gap-1 outline-none">
                                            Account
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 shadow-xl border-slate-200">
                                            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
                                                My Account
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-slate-100" />
                                            <DropdownMenuItem asChild>
                                                <Link href="/profile" className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors">
                                                    <IconUserCircle className="size-4 text-primary" />
                                                    <span className="font-medium text-slate-700">Profil Saya</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            {(session.user as any)?.userType === "staff" && (
                                                <DropdownMenuItem asChild>
                                                    <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors">
                                                        <IconLayoutDashboard className="size-4 text-primary" />
                                                        <span className="font-medium text-slate-700">Dashboard</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem asChild>
                                                <Link href={(session.user as any)?.userType === "staff" ? "/dashboard/users" : "/profile/settings"} className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors">
                                                    <IconSettings className="size-4 text-primary" />
                                                    <span className="font-medium text-slate-700">Settings</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-slate-100" />
                                            <DropdownMenuItem
                                                onClick={() => signOut({ callbackUrl: "/" })}
                                                className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-2 text-destructive focus:text-destructive focus:bg-red-50 transition-colors"
                                            >
                                                <IconLogout className="size-4" />
                                                <span className="font-medium">Logout</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
        </header>
    )
}
