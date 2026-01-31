"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { AllUsersTable } from "./components/all-users-table"

import StatsCards from "@/components/stats-cards";

export default function UsersContent() {
  return (
    <div className="flex flex-col gap-5 w-full select-none">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-muted-foreground font-normal">Users Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Stats Cards */}
      <StatsCards includeAllUsersCard />

      {/* Users Table Section */}
      <AllUsersTable />
    </div>
  )
}


