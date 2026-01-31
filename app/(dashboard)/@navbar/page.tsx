"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";
import { menuItems } from "@/app/(dashboard)/@sidebar/page";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import SignOutIcon from "@/public/sign-out-icon";
import { getMe } from "@/services/queries/settings/user/GET/get-me";
import UserProfileOutlineIcon from "@/public/user-profile-outline-icon";


export default function Navbar() {
  const [userName, setUserName] = useState<string>("")
  const [userRole, setUserRole] = useState<string>("")
  const [userAvatar, setUserAvatar] = useState<string | null>(null)

  const pathname = usePathname();
  const pageName = menuItems.find((item) => item.href === pathname)?.name;
  const { logout } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const result = await getMe()
        const userName = result.data?.user?.name as string
        const userRole = result.data?.user?.dashboardUserRole?.name as string
        const userAvatar = result.data?.user?.avatarUrl as string | null
        setUserName(userName ?? "")
        setUserRole(userRole ?? "")
        setUserAvatar(userAvatar ?? null)
      } catch (error) {
        console.log(error)
      }
    })()
  }, []);

  return (
    <nav className="fixed top-0 right-0 left-76 h-16 bg-white flex items-center justify-between px-6 z-50">
      {/* Left Section - Page Title */}
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-900">{pageName}</h1>
      </div>

      {/* Right Section - Bell Icon and User Info */}
      <div className="flex items-center gap-4">

        {/* User Profile Section with Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="select-none flex items-center gap-3 cursor-pointer hover:bg-natural group rounded-lg px-3 py-2 transition-all">
              {/* User Avatar */}
              <div className="w-10 h-10 rounded-full  group-hover:border-white group-hover:border-4 flex items-center justify-center overflow-hidden transition-all">
                {userAvatar ? <Image
                  src={userAvatar}
                  alt={userName}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                /> : <UserProfileOutlineIcon className="w-10 h-10"/>}
              </div>

              {/* User Info */}
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs text-primary-blue">{userRole}</span>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-2 outline-none border-none rounded-xl rounded-t-none">
            <Button
              variant="ghost"
              className="w-full justify-start text-danger hover:text-danger hover:bg-danger/10 outline-none border-none"
              onClick={logout}
            >
              <SignOutIcon className="h-5! w-5!" />
              Sign Out
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}
