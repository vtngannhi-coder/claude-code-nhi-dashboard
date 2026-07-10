import { customerSchema } from "./types/customer-types"

export const serviceOptions = [
  { value: "Bánh Kem Sinh Nhật", label: "Bánh Kem Sinh Nhật" },
  { value: "Bánh Cưới / Sự Kiện", label: "Bánh Cưới / Sự Kiện" },
  { value: "Bánh Quà Tặng", label: "Bánh Quà Tặng" },
  { value: "Teabreak Doanh Nghiệp", label: "Teabreak Doanh Nghiệp" },
  { value: "Bánh Thủ Công Khác", label: "Bánh Thủ Công Khác" },
]

const customersData = [
  {
    id: "CUS-1001",
    fullName: "Nguyễn Văn An",
    email: "an.nguyen@example.com",
    phoneNumber: "0901234567",
    serviceName: "Bánh Kem Sinh Nhật",
  },
  {
    id: "CUS-1002",
    fullName: "Trần Thị Bình",
    email: "binh.tran@example.com",
    phoneNumber: "0912345678",
    serviceName: "Bánh Cưới / Sự Kiện",
  },
  {
    id: "CUS-1003",
    fullName: "Lê Hoàng Dương",
    email: "duong.le@example.com",
    phoneNumber: "0923456789",
    serviceName: "Bánh Quà Tặng",
  },
  {
    id: "CUS-1004",
    fullName: "Phạm Minh Châu",
    email: "chau.pham@example.com",
    phoneNumber: "0934567890",
    serviceName: "Teabreak Doanh Nghiệp",
  },
  {
    id: "CUS-1005",
    fullName: "Hoàng Văn Em",
    email: "em.hoang@example.com",
    phoneNumber: "0945678901",
    serviceName: "Bánh Kem Sinh Nhật",
  },
  {
    id: "CUS-1006",
    fullName: "Vũ Thị Giang",
    email: "giang.vu@example.com",
    phoneNumber: "0956789012",
    serviceName: "Bánh Kem Sinh Nhật",
  },
  {
    id: "CUS-1007",
    fullName: "Đặng Phúc Hải",
    email: "hai.dang@example.com",
    phoneNumber: "0967890123",
    serviceName: "Bánh Thủ Công Khác",
  },
  {
    id: "CUS-1008",
    fullName: "Bùi Thanh Loan",
    email: "loan.bui@example.com",
    phoneNumber: "0978901234",
    serviceName: "Bánh Cưới / Sự Kiện",
  },
  {
    id: "CUS-1009",
    fullName: "Ngô Đại Nam",
    email: "nam.ngo@example.com",
    phoneNumber: "0989012345",
    serviceName: "Bánh Quà Tặng",
  },
  {
    id: "CUS-1010",
    fullName: "Mai Phương Oanh",
    email: "oanh.mai@example.com",
    phoneNumber: "0990123456",
    serviceName: "Teabreak Doanh Nghiệp",
  },
]

export const customerMockData = customerSchema.array().parse(customersData)
