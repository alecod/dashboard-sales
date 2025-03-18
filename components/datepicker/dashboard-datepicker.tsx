"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { useFilterDashboardHook } from "@/hooks/dashboard-filter-hook";
import { ptBR } from "date-fns/locale";

export function DatePickerWithRange({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const { dateRange, setDateRange } = useFilterDashboardHook();

  return (
    <div className={cn("grid w-full gap-2", className)} {...rest}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal w-72",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd LLL y", { locale: ptBR })} -{" "}
                  {format(dateRange.to, "dd LLL y", { locale: ptBR })}
                </>
              ) : (
                format(dateRange.from, "dd LLL y", { locale: ptBR })
              )
            ) : (
              <span>Selecione a data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            locale={ptBR}
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
