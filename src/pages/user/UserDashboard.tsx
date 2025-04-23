import { cn } from "@/lib/utils";
import { useSidebar } from "@/stores/useSidebar";
import { TopBar } from "@components/TopBar";
import { SideBar } from "@components/main/SideBar";
import { Outlet } from "react-router-dom";
// import ConfApp from "../../ConfApp.js"

export default function UserDashboard() {

    const sidebar = useSidebar();

    return (
        <>
            <TopBar/>  
            <div className="hidden md:block">
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid lg:grid-cols-5">
                            <SideBar isOpen={sidebar.isOpen} className="hidden lg:block" />
                            <div className={cn(sidebar.isOpen ? "col-span-3 lg:col-span-4" : "col-span-4 lg:col-span-5", "lg:border-l")}>
                                <div className="bg-offWhite overflow-y-hidden h-[90vh] px-4 py-6 lg:px-8">
                             
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}