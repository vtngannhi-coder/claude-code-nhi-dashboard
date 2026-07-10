import { z } from "zod"

// Customer schema — matches the Firestore `customers` collection shape
// written by `src/app/api/contact/route.ts`.
export const customerSchema = z.object({
  id: z.string(),
  fullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  email: z.email("Email không hợp lệ"),
  phoneNumber: z.string().min(10, "Số điện thoại phải có ít nhất 10 ký tự"),
  serviceName: z.string().min(1, "Vui lòng chọn dịch vụ"),
  createdAt: z.union([z.date(), z.string(), z.number()]).optional(),
})

export type Customer = z.infer<typeof customerSchema>

// Form schema — input layer (no `id`, no `createdAt`).
export const customerFormSchema = customerSchema
  .pick({ fullName: true, email: true, phoneNumber: true, serviceName: true })

export type CustomerFormValues = z.infer<typeof customerFormSchema>
