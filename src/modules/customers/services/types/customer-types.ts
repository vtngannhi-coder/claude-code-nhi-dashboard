import { z } from "zod"

// Customer schema — represents the customer entity stored in Firestore.
// `name`, `category`, `email` are required; other fields are optional with defaults.
export const customerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  category: z.enum(["education", "sales", "marketing", "worker", "other"]),
  address: z.string().optional().default(""),
  email: z.email("Email không hợp lệ"),
  phone: z.string().optional().default(""),
  gender: z.enum(["male", "female"]).optional().default("male"),
  notes: z.string().optional().default(""),
})

export type Customer = z.infer<typeof customerSchema>

// Form schema — stricter rules for the input layer. Used by both
// add-customer-modal and inline-edit validation.
export const customerFormSchema = customerSchema
  .extend({
    name: z.string().min(1, "Tên khách hàng là bắt buộc"),
    category: z.enum(["education", "sales", "marketing", "worker", "other"], {
      message: "Vui lòng chọn danh mục",
    }),
    email: z.email("Email không hợp lệ"),
  })
  .omit({ id: true })

export type CustomerFormValues = z.infer<typeof customerFormSchema>