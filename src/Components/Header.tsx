"use client"

import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { Button } from "@/Components/ui/button"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "@/redux/slice/authSlice"
import { Database, House, Loader2Icon, LogOut } from "lucide-react"
import { useLogout } from "@/hooks/userLogoutHook"
import { useNavigate } from "react-router-dom"
import { Role } from "@/utils/contants"



const Header: React.FC = () => {
    const currentUser = useSelector(selectCurrentUser)
    const { handleLogout, isLoading } = useLogout();
    const navigate = useNavigate()

    return (
        <header className="bg-gray-800 text-white px-6 py-5 flex justify-between items-center">
            <div className="font-bold text-2xl font-satoshi italic">
                <h1>INVOICE APP</h1>
            </div>

            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={currentUser?.profilePicture || ""}
                                    alt={currentUser?.name || "User avatar"}
                                />
                                <AvatarFallback className="font-satoshi text-sm font-bold text-indigo-700 bg-white">
                                    {currentUser?.name}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none font-satoshi">{currentUser?.name || "User"}</p>
                                <p className="text-xs leading-none text-muted-foreground font-satoshi">{currentUser?.email || "user@example.com"}</p>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        {currentUser?.role !== Role.USER && <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/dashboard")}>
                            <House className="mr-2 h-4 w-4" />
                            <span className="font-satoshi">Dashboard</span>
                        </DropdownMenuItem>}
                        {currentUser?.role !== Role.SUPER_ADMIN && <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/invoice")}>
                            <Database className="mr-2 h-4 w-4" />
                            <span className="font-satoshi">Invoice</span>
                        </DropdownMenuItem>}


                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className="cursor-pointer text-red-600 focus:text-red-600"
                            onClick={handleLogout}
                            disabled={isLoading}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>{isLoading ? <Loader2Icon className="animate-spin" /> : "Log out"}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}

export default Header
