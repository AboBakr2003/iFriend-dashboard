"use client"

import { RolesTable } from "./components/roles/roles-table/roles-table"
import { UserAccessTable } from "./components/users-access/users-access-table/users-access-table"

export default function SettingsContent() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <RolesTable />
      <hr />
      <UserAccessTable />
    </div>
  )
}
