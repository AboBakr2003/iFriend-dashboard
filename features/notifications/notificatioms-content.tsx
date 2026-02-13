"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeftIcon } from "@/public/arrow-left-icon"
import { ArrowRightIcon } from "@/public/arrow-right-icon"
import ArrowDownIcon from "@/public/arrow-down-icon"
import SearchIcon from "@/public/search-icon"
import FilterIcon from "@/public/filter-icon"
import PlusIcon from "@/public/plus-icon"
import SendOutlineIcon from "@/public/send-outline-icon"
import VisibleIcon from "@/public/visible-icon"
import EditIcon from "@/public/edit-icon"
import DeleteIcon from "@/public/delete-icon"
import NotificationsIcon from "@/public/notifications-icon"

import { mockNotifications } from "./mock-notifications"
import { TickCircleOutlineIcon } from "@/public/tick-circle-outline-icon"

const notifications = mockNotifications


export default function NotificationsContent() {
  const [selectedRows, setSelectedRows] = React.useState<number[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 10

  const totalPages = Math.ceil(notifications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentNotifications = notifications.slice(startIndex, endIndex)

  const toggleSelectAll = () => {
    if (selectedRows.length === notifications.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(notifications.map(n => n.id))
    }
  }

  const toggleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-end mb-4">
        <Button className="bg-primary-blue hover:bg-primary-blue/90 text-white gap-2 rounded-lg">
          <PlusIcon className="w-6! h-6!" />
          Create Template
        </Button>
      </div>

      <Card className="mb-0">
        <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
          <div className="flex gap-4 w-full">
            <div className="relative w-72">
              <SearchIcon className="absolute fill-natural-text right-2 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search"
                className="pr-10 rounded-lg placeholder:text-natural-text"
              />
            </div>
            <Button variant="default" className="bg-primary-blue hover:bg-primary-blue-hover p-5 gap-2">
              <FilterIcon className="w-5.5! h-5.5! fill-white" />
              Filter
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-light-natural">
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={selectedRows.length === notifications.length && notifications.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Title
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Description
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Type
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Action
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentNotifications.map((notification) => (
                <TableRow key={notification.id} className="hover:bg-gray-50/50 group">
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(notification.id)}
                      onCheckedChange={() => toggleSelectRow(notification.id)}
                    />
                  </TableCell>
                  <TableCell className="max-w-[220px] font-medium text-gray-900">
                    <div className="w-full text-natural-text overflow-hidden transition-all duration-500 ease-in-out max-h-6 group-hover:max-h-40 cursor-default"> 
                      <p className="whitespace-normal leading-6">
                        {notification.title}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md transition-all duration-300" title={notification.description}>
                    <div className="w-full text-natural-text overflow-hidden transition-all duration-500 ease-in-out max-h-6 group-hover:max-h-40 cursor-default group-hover:overflow-y-auto">
                      <p className="leading-6">
                        {notification.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-500 text-sm font-medium">
                      <TickCircleOutlineIcon className="h-3.5 w-3.5" />
                      {notification.type}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-500 text-sm font-medium">
                      <NotificationsIcon className="h-3.5 w-3.5" />
                      {notification.action}
                    </div>
                  </TableCell>
                  <TableCell className="py-0">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:text-success hover:bg-success/10">
                        <SendOutlineIcon className="h-5! w-5!" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-blue hover:text-primary-blue hover:bg-primary-blue/10">
                        <EditIcon className="h-5! w-5!" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-danger hover:text-danger hover:bg-danger/10">
                        <DeleteIcon className="h-5! w-5!" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between py-4">
          <Button
            variant="outline"
            className="gap-2 group"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition" />
            Previous
          </Button>

          <div className="flex items-center gap-2 text-sm">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "outline" : "ghost"}
                size="icon"
                className={`h-8 w-8 ${currentPage === page ? "bg-gray-50" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            className="gap-2 group"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition" />
          </Button>
        </div>
      )}
    </div>
  )
}
