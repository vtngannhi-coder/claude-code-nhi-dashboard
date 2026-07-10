"use client"

import * as React from "react"
import { useState } from "react"
import { Plus } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { serviceOptions } from "@/modules/customers/services/customer-mock-data"
import type { Customer } from "@/modules/customers/services/types/customer-types"

const addFormSchema = z.object({
  fullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  email: z.email("Email không hợp lệ"),
  phoneNumber: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 ký tự")
    .max(20, "Số điện thoại không được vượt quá 20 ký tự"),
  serviceName: z.string().min(1, "Vui lòng chọn dịch vụ"),
})

type AddFormData = z.infer<typeof addFormSchema>

interface AddCustomerModalProps {
  onAddCustomer?: (customer: Customer) => void | Promise<void>
  trigger?: React.ReactNode
}

const initialFormData: AddFormData = {
  fullName: "",
  email: "",
  phoneNumber: "",
  serviceName: "",
}

export function AddCustomerModal({
  onAddCustomer,
  trigger,
}: AddCustomerModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<AddFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setFormData(initialFormData)
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const parsed = addFormSchema.safeParse(formData)
      if (!parsed.success) {
        const newErrors: Record<string, string> = {}
        parsed.error.issues.forEach((issue) => {
          const key = issue.path[0] as string
          newErrors[key] = issue.message
        })
        setErrors(newErrors)
        return
      }

      const newCustomer: Customer = {
        id: `CUS-${Date.now()}`,
        ...parsed.data,
      }

      await onAddCustomer?.(newCustomer)
      resetForm()
      setOpen(false)
    } catch (error) {
      setErrors({
        root: error instanceof Error ? error.message : "Failed to create customer",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    resetForm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            type="button"
            variant="default"
            size="sm"
            className="cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Thêm khách hàng</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-full h-full max-h-screen rounded-none p-5 sm:max-w-[600px] sm:max-h-[90vh] sm:rounded-lg sm:p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm khách hàng mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin khách hàng mới. Các trường có dấu * là bắt buộc.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.root ? (
            <p className="text-sm text-destructive">{errors.root}</p>
          ) : null}

          {/* Họ và tên */}
          <div className="space-y-2">
            <Label htmlFor="add-fullName">
              Họ và tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="add-fullName"
              placeholder="Ngân Nhi"
              value={formData.fullName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fullName: e.target.value }))
              }
              className={errors.fullName ? "border-destructive" : ""}
            />
            {errors.fullName ? (
              <p className="text-sm text-destructive">{errors.fullName}</p>
            ) : null}
          </div>

          {/* Email + SĐT */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="add-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="add-email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email ? (
                <p className="text-sm text-destructive">{errors.email}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-phoneNumber">
                Số điện thoại <span className="text-destructive">*</span>
              </Label>
              <Input
                id="add-phoneNumber"
                placeholder="0901234567"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))
                }
                className={errors.phoneNumber ? "border-destructive" : ""}
              />
              {errors.phoneNumber ? (
                <p className="text-sm text-destructive">{errors.phoneNumber}</p>
              ) : null}
            </div>
          </div>

          {/* Dịch vụ */}
          <div className="space-y-2">
            <Label htmlFor="add-serviceName">
              Dịch vụ quan tâm <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.serviceName}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, serviceName: value }))
              }
            >
              <SelectTrigger
                id="add-serviceName"
                className={`w-full ${errors.serviceName ? "border-destructive" : ""}`}
              >
                <SelectValue placeholder="Chọn dịch vụ" />
              </SelectTrigger>
              <SelectContent>
                {serviceOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.serviceName ? (
              <p className="text-sm text-destructive">{errors.serviceName}</p>
            ) : null}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="cursor-pointer"
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isSubmitting}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isSubmitting ? "Đang thêm..." : "Thêm khách hàng"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
