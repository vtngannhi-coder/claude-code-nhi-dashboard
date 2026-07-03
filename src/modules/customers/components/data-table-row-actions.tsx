"use client"

import * as React from "react"
import type { Row } from "@tanstack/react-table"
import {
  Check,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  customerSchema,
  type Customer,
} from "@/modules/customers/services/types/customer-types"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  isEditing: boolean
  isSaving: boolean
  onStartEdit?: () => void
  onCancelEdit?: () => void
  onSaveEdit?: () => void | Promise<void>
  onDeleteCustomer?: (customerId: string) => void | Promise<void>
}

export function DataTableRowActions<TData>({
  row,
  isEditing,
  isSaving,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDeleteCustomer,
}: DataTableRowActionsProps<TData>) {
  const parsed = customerSchema.safeParse(row.original)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [confirmText, setConfirmText] = React.useState("")
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [deleteError, setDeleteError] = React.useState<string | null>(null)

  if (!parsed.success) {
    return null
  }

  const customer = parsed.data

  function resetDeleteState() {
    setConfirmText("")
    setDeleteError(null)
    setIsDeleting(false)
  }

  async function handleConfirmDelete() {
    if (confirmText !== customer.name) return

    try {
      setIsDeleting(true)
      setDeleteError(null)
      await onDeleteCustomer?.(customer.id)
      setDeleteOpen(false)
      resetDeleteState()
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Failed to delete customer"
      )
    } finally {
      setIsDeleting(false)
    }
  }

  // Inline edit mode: show save / cancel buttons instead of the dropdown
  if (isEditing) {
    return (
      <div className="flex items-center justify-end gap-1">
        <Button
          size="sm"
          variant="default"
          className="h-8 cursor-pointer"
          onClick={() => onSaveEdit?.()}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          <span className="sr-only">Save</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 cursor-pointer"
          onClick={() => onCancelEdit?.()}
          disabled={isSaving}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Cancel</span>
        </Button>
      </div>
    )
  }

  return (
    <AlertDialog
      open={deleteOpen}
      onOpenChange={(open) => {
        setDeleteOpen(open)
        if (!open) resetDeleteState()
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted cursor-pointer"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onStartEdit?.()}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onSelect={(event) => {
              event.preventDefault()
              setDeleteOpen(true)
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent size="default">
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa khách hàng?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Hành động này không thể hoàn tác. Khách hàng sẽ bị xóa vĩnh viễn
                khỏi hệ thống.
              </p>
              <p className="text-sm text-muted-foreground">
                Nhập{" "}
                <strong className="text-foreground">{customer.name}</strong>{" "}
                để xác nhận:
              </p>
              <Input
                autoFocus
                placeholder={customer.name}
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                disabled={isDeleting}
              />
              {deleteError ? (
                <p className="text-sm text-destructive">{deleteError}</p>
              ) : null}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            type="button"
            disabled={isDeleting}
            onClick={resetDeleteState}
            className="cursor-pointer"
          >
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              handleConfirmDelete()
            }}
            disabled={isDeleting || confirmText !== customer.name}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
          >
            {isDeleting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}