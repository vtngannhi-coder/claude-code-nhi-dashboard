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

const customerFormSchema = z.object({
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

type CustomerFormData = z.infer<typeof customerFormSchema>

interface AddCustomerModalProps {
  onAddCustomer?: (customer: Customer) => void | Promise<void>
  trigger?: React.ReactNode
}

const initialFormData: CustomerFormData = {
  name: "",
  category: "education",
  email: "",
  phone: "",
  gender: "male",
  address: "",
  notes: "",
}

export function AddCustomerModal({
  onAddCustomer,
  trigger,
}: AddCustomerModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<CustomerFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const generateCustomerId = () => `CUS-${Date.now()}`

  const resetForm = () => {
    setFormData(initialFormData)
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const parsed = customerFormSchema.safeParse(formData)
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
        id: generateCustomerId(),
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
            Add Customer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Thêm khách hàng mới vào hệ thống. Các trường có dấu * là bắt buộc.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.root ? (
            <p className="text-sm text-destructive">{errors.root}</p>
          ) : null}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên khách hàng <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name}</p>
            ) : null}
          </div>

          {/* Category + Email */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">
                Danh mục <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: value as CustomerFormData["category"],
                  }))
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
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
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
          </div>

          {/* Phone + Gender */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                placeholder="0901234567"
                value={formData.phone ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính</Label>
              <Select
                value={formData.gender ?? "male"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    gender: value as CustomerFormData["gender"],
                  }))
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
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              placeholder="123 Lê Lợi, Quận 1, TP.HCM"
              value={formData.address ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              placeholder="Thông tin thêm về khách hàng..."
              value={formData.notes ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
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
              <Plus className="w-4 h-4 mr-2" />
              {isSubmitting ? "Đang tạo..." : "Thêm khách hàng"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}