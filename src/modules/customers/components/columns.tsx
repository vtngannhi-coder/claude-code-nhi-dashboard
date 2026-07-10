"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { Customer } from "@/modules/customers/services/types/customer-types"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

interface CustomerColumnActions {
  onDeleteCustomer?: (customerId: string) => void | Promise<void>
  onEditCustomer?: (customer: Customer) => void
}

const serviceBadgeColors: Record<string, string> = {
  "Bánh Kem Sinh Nhật":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Bánh Cưới / Sự Kiện":
    "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "Bánh Quà Tặng":
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Teabreak Doanh Nghiệp":
    "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "Bánh Thủ Công Khác":
    "bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300",
}

export function getCustomerColumns({
  onDeleteCustomer,
  onEditCustomer,
}: CustomerColumnActions = {}): ColumnDef<Customer>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px] cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px] cursor-pointer"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Họ và Tên" />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <span className="max-w-[180px] md:max-w-[280px] truncate font-medium">
            {row.getValue("fullName")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "serviceName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dịch Vụ" />
      ),
      cell: ({ row }) => {
        const serviceName = row.getValue("serviceName") as string
        const color = serviceBadgeColors[serviceName] ?? "bg-slate-100 text-slate-600"

        return (
          <div className="flex w-[160px] items-center">
            <Badge className={color} variant="secondary">
              {serviceName}
            </Badge>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => {
        const email = row.getValue("email") as string
        return (
          <a
            href={`mailto:${email}`}
            className="max-w-[200px] md:max-w-[280px] truncate block font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {email}
          </a>
        )
      },
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="SĐT" />
      ),
      cell: ({ row }) => {
        const phone = row.getValue("phoneNumber") as string | undefined
        return (
          <span className="text-muted-foreground text-sm">
            {phone || "—"}
          </span>
        )
      },
      enableSorting: false,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onEditCustomer={onEditCustomer}
          onDeleteCustomer={onDeleteCustomer}
        />
      ),
    },
  ]
}

export const columns = getCustomerColumns()
