"use client"

import { Cake, ShoppingCart, Users, Utensils } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface CustomerStatCardsProps {
  total: number
  topServices: [string, number][]
}

export function CustomerStatCards({ total, topServices }: CustomerStatCardsProps) {
  const topStats = [
    {
      label: topServices[0]?.[0] ?? "—",
      value: topServices[0]?.[1] ?? 0,
      icon: Cake,
    },
    {
      label: topServices[1]?.[0] ?? "—",
      value: topServices[1]?.[1] ?? 0,
      icon: ShoppingCart,
    },
    {
      label: topServices[2]?.[0] ?? "—",
      value: topServices[2]?.[1] ?? 0,
      icon: Utensils,
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Tổng cộng</p>
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

      {topStats.map((stat) => (
        <Card key={stat.label}>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium truncate max-w-[120px]">
                  {stat.label}
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">
                    {total > 0 ? Math.round((stat.value / total) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <stat.icon className="size-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
