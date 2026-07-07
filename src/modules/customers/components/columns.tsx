"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  categories,
  genders,
} from "@/modules/customers/services/customer-mock-data"
import type { Customer } from "@/modules/customers/services/types/customer-types"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

interface CustomerColumnActions {
  onDeleteCustomer?: (customerId: string) => void | Promise<void>
  onEditCustomer?: (customer: Customer) => void
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <span className="max-w-[160px] md:max-w-[260px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => {
        const category = categories.find(
          (cat) => cat.value === row.getValue("category")
        )
        if (!category) return null

        return (
          <div className="flex w-[120px] items-center">
            <Badge className={category.color} variant="secondary">
              <category.icon className="mr-1 h-3.5 w-3.5" />
              {category.label}
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
            className="max-w-[180px] md:max-w-[260px] truncate block font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {email}
          </a>
        )
      },
    },
    {
      accessorKey: "phone",
      header: () => <span className="text-sm sr-only md:not-sr-only">Phone</span>,
      cell: ({ row }) => {
        const phone = row.getValue("phone") as string | undefined
        return (
          <span className="text-muted-foreground text-sm hidden md:inline">
            {phone || "—"}
          </span>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "gender",
      header: () => <span className="text-sm sr-only md:not-sr-only">Gender</span>,
      cell: ({ row }) => {
        const gender = genders.find((g) => g.value === row.getValue("gender"))
        if (!gender) return null
        return (
          <div className="hidden md:flex w-[90px] items-center">
            <span className="text-sm">{gender.label}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
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