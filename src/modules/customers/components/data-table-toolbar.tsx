"use client"

import type { Table } from "@tanstack/react-table"
import { Database, Plus, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { DataTableViewOptions } from "./data-table-view-options"
import { AddCustomerModal } from "./add-customer-modal"
import type { Customer } from "@/modules/customers/services/types/customer-types"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onSeedCustomers?: () => void | Promise<void>
  isSeedingCustomers?: boolean
  onAddCustomer?: (customer: import("@/modules/customers/services/types/customer-types").Customer) => void | Promise<void>
}

export function DataTableToolbar<TData>({
  table,
  onSeedCustomers,
  isSeedingCustomers,
  onAddCustomer,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const handleCategoryChange = (value: string) => {
    const column = table.getColumn("category")
    if (value === "all") {
      column?.setFilterValue(undefined)
    } else {
      column?.setFilterValue(value)
    }
  }

  const handleGenderChange = (value: string) => {
    const column = table.getColumn("gender")
    if (value === "all") {
      column?.setFilterValue(undefined)
    } else {
      column?.setFilterValue(value)
    }
  }

  const categoryFilter = table.getColumn("category")?.getFilterValue() as
    | string
    | undefined
  const genderFilter = table.getColumn("gender")?.getFilterValue() as
    | string
    | undefined

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Category Filter */}
          <Select
            value={categoryFilter || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                All Categories
              </SelectItem>
              {categories.map((category) => (
                <SelectItem
                  key={category.value}
                  value={category.value}
                  className="cursor-pointer"
                >
                  <div className="flex items-center">
                    {category.icon && (
                      <category.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    {category.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Gender Filter */}
          <Select
            value={genderFilter || "all"}
            onValueChange={handleGenderChange}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                All Genders
              </SelectItem>
              {genders.map((gender) => (
                <SelectItem
                  key={gender.value}
                  value={gender.value}
                  className="cursor-pointer"
                >
                  <div className="flex items-center">
                    {gender.icon && (
                      <gender.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    {gender.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search and Actions Section */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Search by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="w-[200px] lg:w-[300px] cursor-text"
          />
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className="px-3 cursor-pointer"
            disabled={!isFiltered}
          >
            <RefreshCcw className="h-4 w-4" />
            <span className="hidden lg:block">Reset Filters</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={onSeedCustomers}
            disabled={!onSeedCustomers || isSeedingCustomers}
          >
            <Database className="h-4 w-4" />
            <span className="hidden lg:block">
              {isSeedingCustomers ? "Seeding..." : "Seed Data"}
            </span>
          </Button>
          <DataTableViewOptions table={table} />
          <AddCustomerModal onAddCustomer={onAddCustomer} />
        </div>
      </div>
    </div>
  )
}