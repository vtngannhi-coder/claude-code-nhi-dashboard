"use client"

import type { Table } from "@tanstack/react-table"
import { Database, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { serviceOptions } from "@/modules/customers/services/customer-mock-data"
import { DataTableViewOptions } from "./data-table-view-options"
import { AddCustomerModal } from "./add-customer-modal"
import type { Customer } from "@/modules/customers/services/types/customer-types"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onSeedCustomers?: () => void | Promise<void>
  isSeedingCustomers?: boolean
  onAddCustomer?: (customer: Customer) => void | Promise<void>
}

export function DataTableToolbar<TData>({
  table,
  onSeedCustomers,
  isSeedingCustomers,
  onAddCustomer,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const handleServiceChange = (value: string) => {
    const column = table.getColumn("serviceName")
    if (value === "all") {
      column?.setFilterValue(undefined)
    } else {
      column?.setFilterValue(value)
    }
  }

  const serviceFilter = table.getColumn("serviceName")?.getFilterValue() as
    | string
    | undefined

  return (
    <div className="space-y-4 px-4 md:px-0">
      {/* Filter Section */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Service Filter */}
          <Select
            value={serviceFilter || "all"}
            onValueChange={handleServiceChange}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Dịch vụ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                Tất cả dịch vụ
              </SelectItem>
              {serviceOptions.map((service) => (
                <SelectItem
                  key={service.value}
                  value={service.value}
                  className="cursor-pointer"
                >
                  {service.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search-by-fullName Filter */}
          <Input
            placeholder="Tìm theo tên khách hàng..."
            value={
              (table.getColumn("fullName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("fullName")?.setFilterValue(event.target.value)
            }
            className="w-full cursor-text"
          />
        </div>
      </div>

      {/* Search and Actions Section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className="px-3 cursor-pointer shrink-0"
            disabled={!isFiltered}
          >
            <RefreshCcw className="h-4 w-4" />
            <span className="hidden lg:inline ml-1">Đặt lại bộ lọc</span>
          </Button>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={onSeedCustomers}
            disabled={!onSeedCustomers || isSeedingCustomers}
          >
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">
              {isSeedingCustomers ? "Đang seed..." : "Seed dữ liệu"}
            </span>
          </Button>
          <DataTableViewOptions table={table} />
          <AddCustomerModal onAddCustomer={onAddCustomer} />
        </div>
      </div>
    </div>
  )
}
