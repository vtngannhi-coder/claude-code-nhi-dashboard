"use client"

import {
  Briefcase,
  GraduationCap,
  HardHat,
  Megaphone,
  Users,
} from "lucide-react"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

interface CustomerStatCardsProps {
  total: number
  education: number
  sales: number
  marketing: number
}

export function CustomerStatCards({
  total,
  education,
  sales,
  marketing,
}: CustomerStatCardsProps) {
  const getPercent = (value: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{total}</span>
                <span className="text-sm text-muted-foreground">khách hàng</span>
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <Users className="size-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Education</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{education}</span>
                <span className="text-sm text-muted-foreground">
                  {getPercent(education)}%
                </span>
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <GraduationCap className="size-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Sales</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{sales}</span>
                <span className="text-sm text-muted-foreground">
                  {getPercent(sales)}%
                </span>
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <Briefcase className="size-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Marketing</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{marketing}</span>
                <span className="text-sm text-muted-foreground">
                  {getPercent(marketing)}%
                </span>
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <Megaphone className="size-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}