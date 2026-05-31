import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/axios_functions";
import { DashboardContext } from "@/context/DashboardContext";




export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: user, isLoading, error } = useUser();

  // console.log(user, "User loading...");

  // useEffect(() => {
  //   setInterval(() => {
  //     console.log("loading...");
  //   }, 3000);
  // }, [])

  return (
    <DashboardContext.Provider value={{ user: user }}>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div
          className={cn(
            "transition-all duration-300",
            "ml-64", // Adjust based on sidebar state
          )}
        >
          <TopBar sidebarCollapsed={sidebarCollapsed} />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
