"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import SearchIcon from "@/public/search-icon"
import EditIcon from "@/public/edit-icon"
import DeleteIcon from "@/public/delete-icon"
import PlusIcon from "@/public/plus-icon"
import { ArrowLeftIcon } from "@/public/arrow-left-icon"
import { ArrowRightIcon } from "@/public/arrow-right-icon"
import { CreateRoleCard } from "./create-role-card"
import { EditRoleDialog } from "./edit-role-card"
import { useEffect, useState } from "react"
import { AlertWindow } from "@/components/alert-window"
import { getAllRoles, RoleItemsData } from "@/services/queries/settings/role/GET/get-all-roles"
import { deleteRoles } from "@/services/queries/settings/role/DELETE/delete-roles"
import { toast } from "sonner"

export function RolesTable() {
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null)
  const [roles, setRoles] = useState<RoleItemsData[]>([])
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<RoleItemsData | null>(null)
  const [searchValue, setSearchValue] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 5

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const res = await getAllRoles()
        if (isMounted && res.success && res.data) {
          setRoles(res.data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (isMounted) {
          // no-op for now; reserved for future loading state
        }
      }
    }
    load()
    return () => { isMounted = false }
  }, [])

  const reload = async () => {
    try {
      const res = await getAllRoles()
      if (res.success && res.data) {
        setRoles(res.data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteClick = (roleId: string) => {
    setDeleteRoleId(roleId)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteRoleId) return
    try {
      const res = await deleteRoles([deleteRoleId])
      if (res.success) {
        toast(`Role deleted successfully ✅`)
        await reload()
      }
    } catch (e) {
      console.error(e)
      toast(`Failed to delete role ❌`)
    } finally {
      setDeleteRoleId(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteRoleId(null)
  }

  const handleEditClick = (role: RoleItemsData) => {
    setEditingRole(role)
    setIsEditOpen(true)
  }

  const handleEditOpenChange = (open: boolean) => {
    setIsEditOpen(open)
    if (!open) setEditingRole(null)
  }

  const roleToDelete = roles.find((r) => r.id === deleteRoleId)
  const filteredRoles = roles.filter((r) => r.name?.toLowerCase().includes(searchValue.toLowerCase()))

  // Reset to first page when filters change
  useEffect(() => { setPage(1) }, [searchValue, roles.length])

  const pageCount = Math.max(1, Math.ceil(filteredRoles.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const paginatedRoles = filteredRoles.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const selectedInView = filteredRoles.filter((r) => selectedIds.includes(r.id))
  const allSelected = filteredRoles.length > 0 && selectedInView.length === filteredRoles.length
  const someSelected = selectedInView.length > 0 && !allSelected

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return prev.includes(id) ? prev : [...prev, id]
      return prev.filter((x) => x !== id)
    })
  }

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const ids = filteredRoles.map((r) => r.id)
      setSelectedIds((prev) => Array.from(new Set([...prev, ...ids])))
    } else {
      const idsInView = new Set(filteredRoles.map((r) => r.id))
      setSelectedIds((prev) => prev.filter((id) => !idsInView.has(id)))
    }
  }

  const handleBulkDeleteOpen = () => {
    if (selectedIds.length === 0) return
    setIsBulkDeleteOpen(true)
  }

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return
    try {
      const res = await deleteRoles(selectedIds)
      if (res.success) {
        toast(`${selectedIds.length} Roles deleted successfully ✅`)
        await reload()
        setSelectedIds([])
      }
    } catch (e) {
      console.error(e)
      toast(`Failed to delete selected roles ❌`)
    } finally {
      setIsBulkDeleteOpen(false)
    }
  }

  const handleBulkDeleteCancel = () => setIsBulkDeleteOpen(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Roles</h2>
        <Button
          variant="default"
          className="bg-primary-blue hover:bg-primary-blue-hover px-4 py-5"
          onClick={() => setIsCreateRoleOpen(true)}
        >
          <PlusIcon className="h-6! w-6!" /> Create Role
        </Button>
      </div>

      <CreateRoleCard open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen} onCreated={reload} />
      <EditRoleDialog open={isEditOpen} onOpenChange={handleEditOpenChange} role={editingRole} onUpdated={reload} />

      <div className="h-[500px]">
        <Card className="mb-0">
          <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
            <div className="relative w-72 m-0">
              <SearchIcon className="absolute fill-natural-text right-2 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search by role name"
                className="pr-10 rounded-lg placeholder:text-natural-text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            {selectedIds.length > 1 && (
              <Button
                variant="default"
                className={`bg-danger/10 text-danger hover:bg-danger hover:text-white px-4 py-5`}
                onClick={handleBulkDeleteOpen}
              >
                <DeleteIcon className="h-5! w-5!" /> Delete Selected
              </Button>
            )}
          </CardHeader>

          <CardContent className="p-0">

            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50 border-none">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={allSelected ? true : someSelected ? "indeterminate" : false}
                      onCheckedChange={(checked) => toggleSelectAll(Boolean(checked))}
                    />
                  </TableHead>
                  <TableHead className="min-w-[200px]">Role name</TableHead>
                  <TableHead className="w-[500px]">Access</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRoles.map((role) => (
                  <TableRow key={role.id} className="border-b last:border-0">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(role.id)}
                        onCheckedChange={(checked) => toggleSelect(role.id, Boolean(checked))}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {(role.dashboardRolePermissions || [])
                          .map((rp) => rp.permission?.name)
                          .filter((n): n is string => Boolean(n))
                          .map((name) => (
                            <Badge key={`${role.id}-${name}`} variant="secondary" className="bg-primary-blue/10 text-primary-blue font-normal hover:bg-primary-blue/10 ">
                              {name}
                            </Badge>
                          ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-0">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" className="text-primary-blue hover:text-primary-blue hover:bg-primary-blue/10" onClick={() => handleEditClick(role)}>
                          <EditIcon className="h-5! w-5!" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-natural-text hover:text-danger hover:bg-danger/10"
                          onClick={() => handleDeleteClick(role.id)}
                        >
                          <DeleteIcon className="h-5! w-5!" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between py-4">
          <Button
            variant="outline"
            className="gap-2 group"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition" />
            Previous
          </Button>
          <div className="flex items-center gap-2 text-sm">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={currentPage === p ? "outline" : "ghost"}
                size="icon"
                className={`h-8 w-8 ${currentPage === p ? "bg-gray-50" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            className="gap-2 group"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={currentPage === pageCount}
          >
            Next
            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition" />
          </Button>
        </div>
      )}

      <AlertWindow
        open={deleteRoleId !== null}
        onOpenChange={(open) => !open && setDeleteRoleId(null)}
        title={`Delete ${roleToDelete?.name ?? "role"}`}
        description="Are you sure you want to delete this role?"
        icon={<DeleteIcon className="h-10! w-10!" />}
        variant="destructive"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <AlertWindow
        open={isBulkDeleteOpen}
        onOpenChange={setIsBulkDeleteOpen}
        title={`Delete ${selectedIds.length} selected role${selectedIds.length === 1 ? "" : "s"}`}
        description={(() => {
          const names = roles
            .filter((r) => selectedIds.includes(r.id))
            .map((r) => r.name)
            .filter(Boolean) as string[]
          const preview = names.slice(0, 3).join(", ")
          return names.length > 3 ? `${preview}, ...` : preview || "This action cannot be undone."
        })()}
        icon={<DeleteIcon className="h-10! w-10!" />}
        variant="destructive"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleBulkDeleteConfirm}
        onCancel={handleBulkDeleteCancel}
      />
    </div>
  )
}
