"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar3";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as React from "react";
import type { DateRange } from "react-day-picker";

interface DatePickerProps {
  start: Date;
  end: Date;
  onDateChange: (range: { start: Date; end: Date }) => void;
}

export function DatePicker({ start, end, onDateChange }: DatePickerProps) {
  const [selectedRange, setSelectedRange] = React.useState<DateRange>({
    from: start,
    to: end,
  });

  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setSelectedRange(range);
      onDateChange({ start: range.from, end: range.to });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-36 lg:w-[250px] font-normal text-xs lg:text-base",
            !selectedRange.from && "text-muted-foreground"
          )}
        >
          {selectedRange.from ? (
            <>
              {format(selectedRange.from, "dd LLL y", { locale: ptBR })} -{" "}
              {
                //@ts-ignore
                format(selectedRange.to, "dd LLL y", { locale: ptBR })
              }
            </>
          ) : (
            <span>Selecione a data</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          className="w-full"
          mode="range"
          selected={selectedRange}
          onSelect={handleDateChange}
          initialFocus
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}
