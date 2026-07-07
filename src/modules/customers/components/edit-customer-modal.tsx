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
import { Textarea } from "@/components/ui/textarea"
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

const editFormSchema = z.object({
  name: z.string().min(1, "Tên khách hàng là bắt buộc"),
  category: z.enum(["education", "sales", "marketing", "worker", "other"], {
    message: "Vui lòng chọn danh mục",
  }),
  email: z.email("Email không hợp lệ"),
  phone: z.string().optional().default(""),
  gender: z.enum(["male", "female"]).optional().default("male"),
  address: z.string().optional().default(""),
  notes: z.string().optional().default(""),
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
    name: customer.name,
    category: customer.category,
    email: customer.email,
    phone: customer.phone ?? "",
    gender: customer.gender ?? "male",
    address: customer.address ?? "",
    notes: customer.notes ?? "",
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

  // Re-sync form whenever a different customer is passed in.
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

  if (!customer || !formData) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full h-full max-h-screen rounded-none p-5 sm:max-w-[600px] sm:max-h-[90vh] sm:rounded-lg sm:p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Edit Customer
          </DialogTitle>
          <DialogDescription>
            Cập nhật thông tin khách hàng. Các trường có dấu * là bắt buộc.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.root ? (
            <p className="text-sm text-destructive">{errors.root}</p>
          ) : null}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name">
              Tên khách hàng <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-name"
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => (prev ? { ...prev, name: e.target.value } : prev))
              }
              className={errors.name ? "border-destructive" : ""}
              autoFocus
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name}</p>
            ) : null}
          </div>

          {/* Category + Email */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-category">
                Danh mục <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) =>
                    prev
                      ? { ...prev, category: value as EditFormData["category"] }
                      : prev
                  )
                }
              >
                <SelectTrigger
                  className={`w-full ${errors.category ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <div className="flex items-center">
                        {c.icon && (
                          <c.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        )}
                        {c.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category ? (
                <p className="text-sm text-destructive">{errors.category}</p>
              ) : null}
            </div>

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
          </div>

          {/* Phone + Gender */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Số điện thoại</Label>
              <Input
                id="edit-phone"
                placeholder="0901234567"
                value={formData.phone ?? ""}
                onChange={(e) =>
                  setFormData((prev) =>
                    prev ? { ...prev, phone: e.target.value } : prev
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-gender">Giới tính</Label>
              <Select
                value={formData.gender ?? "male"}
                onValueChange={(value) =>
                  setFormData((prev) =>
                    prev
                      ? { ...prev, gender: value as EditFormData["gender"] }
                      : prev
                  )
                }
              >
                <SelectTrigger className="w-full">
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
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="edit-address">Địa chỉ</Label>
            <Input
              id="edit-address"
              placeholder="123 Lê Lợi, Quận 1, TP.HCM"
              value={formData.address ?? ""}
              onChange={(e) =>
                setFormData((prev) =>
                  prev ? { ...prev, address: e.target.value } : prev
                )
              }
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Ghi chú</Label>
            <Textarea
              id="edit-notes"
              placeholder="Thông tin thêm về khách hàng..."
              value={formData.notes ?? ""}
              onChange={(e) =>
                setFormData((prev) =>
                  prev ? { ...prev, notes: e.target.value } : prev
                )
              }
              rows={3}
            />
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