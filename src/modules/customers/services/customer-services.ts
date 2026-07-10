import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import { customerMockData } from "./customer-mock-data"
import type { Customer } from "./types/customer-types"
import type { CustomerFormValues } from "./types/customer-types"

const CUSTOMERS_COLLECTION = "customers"

export async function getCustomers(): Promise<Customer[]> {
  const snapshot = await getDocs(collection(db, CUSTOMERS_COLLECTION))

  const result: Customer[] = snapshot.docs.map((document) => {
    const data = document.data()
    return {
      fullName: data.fullName ?? "",
      email: data.email ?? "",
      phoneNumber: data.phoneNumber ?? "",
      serviceName: data.serviceName ?? "",
      createdAt: data.createdAt,
      id: document.id,
    }
  })

  return JSON.parse(JSON.stringify(result))
}

export async function seedCustomersWithClient(): Promise<Customer[]> {
  const batch = writeBatch(db)

  customerMockData.forEach((customer) => {
    batch.set(doc(db, CUSTOMERS_COLLECTION, customer.id), customer, { merge: true })
  })

  await batch.commit()
  return getCustomers()
}

export async function createCustomer(
  values: CustomerFormValues
): Promise<Customer> {
  const id = `CUS-${Date.now()}`

  const newCustomer: Omit<Customer, "id"> = {
    fullName: values.fullName,
    email: values.email,
    phoneNumber: values.phoneNumber,
    serviceName: values.serviceName,
    createdAt: serverTimestamp() as unknown as never,
  }

  await setDoc(doc(db, CUSTOMERS_COLLECTION, id), newCustomer)

  return { id, ...newCustomer }
}

export async function updateCustomer(customer: Customer): Promise<Customer> {
  const { id, ...rest } = customer

  await updateDoc(doc(db, CUSTOMERS_COLLECTION, id), rest)

  return customer
}

export async function deleteCustomer(customerId: string): Promise<void> {
  await deleteDoc(doc(db, CUSTOMERS_COLLECTION, customerId))
}

export function getCustomerStats(customers: Customer[]) {
  const total = customers.length

  const serviceCount = customers.reduce<Record<string, number>>((acc, c) => {
    const key = c.serviceName || "Khác"
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})

  const topServices = Object.entries(serviceCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  return {
    total,
    serviceCount,
    topServices,
  }
}
