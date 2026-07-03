"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getCustomerColumns } from "@/modules/customers/components/columns"
import { CustomerStatCards } from "@/modules/customers/components/customer-stat-cards"
import { DataTable } from "@/modules/customers/components/data-table"
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  getCustomerStats,
  seedCustomersWithClient,
  updateCustomer,
} from "@/modules/customers/services/customer-services"
import type { Customer } from "@/modules/customers/services/types/customer-types"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [isSeedingCustomers, setIsSeedingCustomers] = useState(false)

  // Inline edit state
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<Customer | null>(null)
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  const refreshCustomers = useCallback(async () => {
    const customerList = await getCustomers()
    setCustomers(customerList)
  }, [])

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        await refreshCustomers()
      } catch (error) {
        console.error("Failed to load customers:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCustomers()
  }, [refreshCustomers])

  const handleAddCustomer = useCallback(
    async (newCustomer: Customer) => {
      await createCustomer(newCustomer)
      await refreshCustomers()
    },
    [refreshCustomers]
  )

  const handleUpdateCustomer = useCallback(async (customer: Customer) => {
    await updateCustomer(customer)
    setCustomers((prev) =>
      prev.map((item) => (item.id === customer.id ? customer : item))
    )
  }, [])

  const handleDeleteCustomer = useCallback(async (customerId: string) => {
    await deleteCustomer(customerId)
    setCustomers((prev) => prev.filter((c) => c.id !== customerId))
  }, [])

  const handleSeedCustomers = useCallback(async () => {
    try {
      setIsSeedingCustomers(true)
      const seededCustomers = await seedCustomersWithClient()
      setCustomers(seededCustomers)
    } catch (error) {
      console.error("Failed to seed customers:", error)
    } finally {
      setIsSeedingCustomers(false)
    }
  }, [])

  const handleEditDraftChange = useCallback((partial: Partial<Customer>) => {
    setEditDraft((prev) => (prev ? { ...prev, ...partial } : null))
  }, [])

  const handleStartEdit = useCallback((customer: Customer) => {
    setEditingCustomerId(customer.id)
    setEditDraft(customer)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingCustomerId(null)
    setEditDraft(null)
  }, [])

  const handleSaveEdit = useCallback(async () => {
    if (!editDraft) return

    try {
      setIsSavingEdit(true)
      await handleUpdateCustomer(editDraft)
      setEditingCustomerId(null)
      setEditDraft(null)
    } catch (error) {
      console.error("Failed to save edit:", error)
    } finally {
      setIsSavingEdit(false)
    }
  }, [editDraft, handleUpdateCustomer])

  const meta = useMemo(
    () => ({
      editingCustomerId,
      editDraft,
      onEditDraftChange: handleEditDraftChange,
      onStartEdit: handleStartEdit,
      onCancelEdit: handleCancelEdit,
      onSaveEdit: handleSaveEdit,
      isSavingEdit,
    }),
    [
      editingCustomerId,
      editDraft,
      handleEditDraftChange,
      handleStartEdit,
      handleCancelEdit,
      handleSaveEdit,
      isSavingEdit,
    ]
  )

  const customerColumns = useMemo(
    () => getCustomerColumns({ onDeleteCustomer: handleDeleteCustomer }),
    [handleDeleteCustomer]
  )

  const stats = getCustomerStats(customers)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading customers...</div>
      </div>
    )
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-2 px-4 md:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">
          Quản lý danh sách khách hàng. Sắp xếp, chỉnh sửa, thêm mới và xóa.
        </p>
      </div>

      {/* Mobile view placeholder */}
      <div className="md:hidden px-4 md:px-6">
        <div className="flex items-center justify-center h-96 border rounded-lg bg-muted/20">
          <div className="text-center p-8">
            <h3 className="text-lg font-semibold mb-2">Customers Dashboard</h3>
            <p className="text-muted-foreground">
              Please use a larger screen to view the full customers interface.
            </p>
          </div>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden h-full flex-1 flex-col space-y-6 px-4 md:px-6 md:flex">
        <CustomerStatCards
          total={stats.total}
          education={stats.education}
          sales={stats.sales}
          marketing={stats.marketing}
        />

        <Card>
          <CardHeader>
            <CardTitle>Customer Management</CardTitle>
            <CardDescription>
              Click a column header to sort (asc → desc → none). Inline edit by
              clicking Edit in the actions menu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={customers}
              columns={customerColumns}
              meta={meta}
              onSeedCustomers={handleSeedCustomers}
              isSeedingCustomers={isSeedingCustomers}
              onAddCustomer={handleAddCustomer}
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
}