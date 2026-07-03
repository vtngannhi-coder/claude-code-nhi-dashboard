"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  categories,
  genders,
} from "@/modules/customers/services/customer-mock-data"
import type { Customer } from "@/modules/customers/services/types/customer-types"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

// `meta` shape threaded through `useReactTable` options.meta from data-table.tsx.
// Each cell accesses it via `row.table.options.meta`.
export interface CustomerTableMeta {
  editingCustomerId: string | null
  editDraft: Customer | null
  onEditDraftChange: (partial: Partial<Customer>) => void
  onStartEdit: (customer: Customer) => void
  onCancelEdit: () => void
  onSaveEdit: () => void | Promise<void>
  isSavingEdit: boolean
}

interface CustomerColumnActions {
  onDeleteCustomer?: (customerId: string) => void | Promise<void>
}

function useCustomerMeta(
  table: { options: { meta?: unknown } }
): CustomerTableMeta | undefined {
  return table.options.meta as CustomerTableMeta | undefined
}

export function getCustomerColumns({
  onDeleteCustomer,
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
      cell: ({ row, table }) => {
        const meta = useCustomerMeta(table)
        const isEditing = meta?.editingCustomerId === row.original.id

        if (isEditing && meta?.editDraft) {
          return (
            <Input
              value={meta.editDraft.name}
              onChange={(event) =>
                meta.onEditDraftChange({ name: event.target.value })
              }
              className="h-8 max-w-[220px] cursor-text"
              autoFocus
            />
          )
        }

        return (
          <div className="flex space-x-2">
            <span className="max-w-[260px] truncate font-medium">
              {row.getValue("name")}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row, table }) => {
        const meta = useCustomerMeta(table)
        const isEditing = meta?.editingCustomerId === row.original.id

        if (isEditing && meta?.editDraft) {
          return (
            <Select
              value={meta.editDraft.category}
              onValueChange={(value) =>
                meta.onEditDraftChange({
                  category: value as Customer["category"],
                })
              }
            >
              <SelectTrigger className="h-8 w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }

        const category = categories.find(
          (cat) => cat.value === row.getValue("category")
        )
        if (!category) return null

        return (
          <div className="flex w-[120px] items-center">
            <Badge variant="outline">{category.label}</Badge>
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
      cell: ({ row, table }) => {
        const meta = useCustomerMeta(table)
        const isEditing = meta?.editingCustomerId === row.original.id

        if (isEditing && meta?.editDraft) {
          return (
            <Input
              type="email"
              value={meta.editDraft.email}
              onChange={(event) =>
                meta.onEditDraftChange({ email: event.target.value })
              }
              className="h-8 max-w-[260px] cursor-text"
            />
          )
        }

        const email = row.getValue("email") as string
        return (
          <a
            href={`mailto:${email}`}
            className="max-w-[260px] truncate font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {email}
          </a>
        )
      },
    },
    {
      accessorKey: "phone",
      header: () => <div className="text-sm">Phone</div>,
      cell: ({ row, table }) => {
        const meta = useCustomerMeta(table)
        const isEditing = meta?.editingCustomerId === row.original.id

        if (isEditing && meta?.editDraft) {
          return (
            <Input
              value={meta.editDraft.phone ?? ""}
              onChange={(event) =>
                meta.onEditDraftChange({ phone: event.target.value })
              }
              className="h-8 max-w-[180px] cursor-text"
            />
          )
        }

        const phone = row.getValue("phone") as string | undefined
        return (
          <span className="text-muted-foreground text-sm">
            {phone || "—"}
          </span>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "gender",
      header: () => <div className="text-sm">Gender</div>,
      cell: ({ row, table }) => {
        const meta = useCustomerMeta(table)
        const isEditing = meta?.editingCustomerId === row.original.id

        if (isEditing && meta?.editDraft) {
          return (
            <Select
              value={meta.editDraft.gender ?? "male"}
              onValueChange={(value) =>
                meta.onEditDraftChange({
                  gender: value as Customer["gender"],
                })
              }
            >
              <SelectTrigger className="h-8 w-[110px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {genders.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }

        const gender = genders.find((g) => g.value === row.getValue("gender"))
        if (!gender) return null
        return (
          <div className="flex w-[90px] items-center">
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
      cell: ({ row, table }) => {
        const meta = useCustomerMeta(table)
        return (
          <DataTableRowActions
            row={row}
            isEditing={meta?.editingCustomerId === row.original.id}
            isSaving={meta?.isSavingEdit ?? false}
            onStartEdit={() => meta?.onStartEdit(row.original)}
            onCancelEdit={() => meta?.onCancelEdit()}
            onSaveEdit={() => meta?.onSaveEdit()}
            onDeleteCustomer={onDeleteCustomer}
          />
        )
      },
    },
  ]
}

export const columns = getCustomerColumns()