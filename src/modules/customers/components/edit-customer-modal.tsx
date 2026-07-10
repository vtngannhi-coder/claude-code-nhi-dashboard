"use client"

import * as React from "react"
import { useState } from "react"
import { Pencil } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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

const editFormSchema = z.object({
  fullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  email: z.email("Email không hợp lệ"),
  phoneNumber: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 ký tự")
    .max(20, "Số điện thoại không được vượt quá 20 ký tự"),
  serviceName: z.string().min(1, "Vui lòng chọn dịch vụ"),
})

type EditFormData = z.infer<typeof editFormSchema>

interface EditCustomerModalProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (customer: Customer) => void | Promise<void>
}

function customerToFormData(customer: Customer): EditFormData {
  return {
    fullName: customer.fullName,
    email: customer.email,
    phoneNumber: customer.phoneNumber,
    serviceName: customer.serviceName,
  }
}

export function EditCustomerModal({
  customer,
  open,
  onOpenChange,
  onSave,
}: EditCustomerModalProps) {
  const [formData, setFormData] = useState<EditFormData | null>(
    customer ? customerToFormData(customer) : null
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  React.useEffect(() => {
    if (customer) {
      setFormData(customerToFormData(customer))
      setErrors({})
    }
  }, [customer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customer || !formData) return

    setIsSubmitting(true)

    try {
      const parsed = editFormSchema.safeParse(formData)
      if (!parsed.success) {
        const newErrors: Record<string, string> = {}
        parsed.error.issues.forEach((issue) => {
          const key = issue.path[0] as string
          newErrors[key] = issue.message
        })
        setErrors(newErrors)
        return
      }

      const updated: Customer = {
        ...customer,
        ...parsed.data,
      }

      await onSave(updated)
      onOpenChange(false)
    } catch (error) {
      setErrors({
        root: error instanceof Error ? error.message : "Failed to update customer",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (customer) {
      setFormData(customerToFormData(customer))
      setErrors({})
    }
    onOpenChange(false)
  }

  if (!customer || !formData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full h-full max-h-screen rounded-none p-5 sm:max-w-[600px] sm:max-h-[90vh] sm:rounded-lg sm:p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Sửa thông tin khách hàng
          </DialogTitle>
          <DialogDescription>
            Cập nhật thông tin khách hàng. Các trường có dấu * là bắt buộc.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.root ? (
            <p className="text-sm text-destructive">{errors.root}</p>
          ) : null}

          {/* Họ và tên */}
          <div className="space-y-2">
            <Label htmlFor="edit-fullName">
              Họ và tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-fullName"
              placeholder="Ngân Nhi"
              value={formData.fullName}
              onChange={(e) =>
                setFormData((prev) =>
                  prev ? { ...prev, fullName: e.target.value } : prev
                )
              }
              className={errors.fullName ? "border-destructive" : ""}
              autoFocus
            />
            {errors.fullName ? (
              <p className="text-sm text-destructive">{errors.fullName}</p>
            ) : null}
          </div>

          {/* Email + SĐT */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) =>
                    prev ? { ...prev, email: e.target.value } : prev
                  )
                }
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email ? (
                <p className="text-sm text-destructive">{errors.email}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phoneNumber">
                Số điện thoại <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-phoneNumber"
                placeholder="0901234567"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData((prev) =>
                    prev ? { ...prev, phoneNumber: e.target.value } : prev
                  )
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
            <Label htmlFor="edit-serviceName">
              Dịch vụ quan tâm <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.serviceName}
              onValueChange={(value) =>
                setFormData((prev) =>
                  prev ? { ...prev, serviceName: value } : prev
                )
              }
            >
              <SelectTrigger
                id="edit-serviceName"
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
              <Pencil className="w-4 h-4 mr-2" />
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
