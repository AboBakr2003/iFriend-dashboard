"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ArrowDownIcon from "@/public/arrow-down-icon";
import DownloadIcon from "@/public/download-icon";
import type { KidReport } from "@/services/queries/users-management/get/get-kid-details";

interface AllReportsTableProps {
  reports: KidReport[];
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).replace(/ (\d{4})$/, ", $1");
};

export function AllReportsTable({ reports }: AllReportsTableProps) {
  return (
    <Card className="rounded-xl border shadow-sm">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-black text-lg font-medium">Child Report</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-natural border-none text-nowrap">
            <TableRow>
              <TableHead className="w-[50px] text-center font-bold">#</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Name
                  <ArrowDownIcon className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  File name
                  <ArrowDownIcon className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Date
                  <ArrowDownIcon className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-natural-text">
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report, index) => (
                <TableRow key={report.id ?? index} className="text-nowrap">
                  <TableCell className="text-center font-medium">{index + 1}</TableCell>
                  <TableCell>{report.name}</TableCell>
                  <TableCell className="text-natural-text text-sm">{report.fileName}</TableCell>
                <TableCell className="text-natural-text text-sm">{formatDate(report.date)}</TableCell>
                <TableCell className="text-right py-0">
                  <div className="flex items-center justify-end pr-8">
                    <Button variant="ghost" className="h-auto text-primary-blue hover:text-primary-blue hover:bg-primary-blue/10 gap-1">
                      <DownloadIcon className="h-5! w-5!" />
                      Download
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
