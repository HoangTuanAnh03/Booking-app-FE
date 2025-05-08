"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Bank {
  id: string
  name: string
  code: string
  bin: string
  shortName: string
  logo: string
  transferSupported: number
  lookupSupported: number
  short_name: string
  support: number
  isTransfer: number
  swift_code: string
}

interface BankSelectorProps {
  value: string
  onChange: (value: string) => void
  error?: string
  className?: string
}

export function BankSelector({ value, onChange, error, className }: BankSelectorProps) {
  const [banks, setBanks] = useState<Bank[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://api.vietqr.io/v2/banks")
        const data = await response.json()

        if (data.code === "00" && Array.isArray(data.data)) {
          // Sort banks alphabetically by name
          const sortedBanks = data.data.sort((a: Bank, b: Bank) => a.name.localeCompare(b.name))
          setBanks(sortedBanks)
        } else {
          console.error("Failed to fetch banks:", data)
        }
      } catch (error) {
        console.error("Error fetching banks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBanks()
  }, [])

  // Find the selected bank by name
  const selectedBank = banks.find((bank) => bank.name === value)

  return (
    <Select value={value} onValueChange={onChange} disabled={loading}>
      <SelectTrigger className={cn(error ? "border-destructive" : "", className)}>
        <SelectValue placeholder={loading ? "Loading banks..." : "Select bank"}>
          {selectedBank && (
            <div className="flex items-center">
              {selectedBank.logo && (
                <img
                  src={selectedBank.logo || "/placeholder.svg"}
                  alt={selectedBank.name}
                  className="h-4 w-auto mr-2"
                />
              )}
              {selectedBank.name}
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Banks</SelectLabel>
          {banks.map((bank) => (
            <SelectItem key={bank.bin} value={bank.name}>
              <div className="flex items-center">
                {bank.logo && <img src={bank.logo || "/placeholder.svg"} alt={bank.name} className="h-4 w-auto mr-2" />}
                {bank.name}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
