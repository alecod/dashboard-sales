import { DatePickerWithRange } from "@/components/datepicker/dashboard-datepicker";
import { Label } from "../ui/label";

export function DashboardFilter() {
  return (
    <div className="flex w-[310px] flex-col items-start justify-start gap-3 lg:mt-5">
      <Label className="text-xs">Selecione o período:</Label>
      <DatePickerWithRange className="w-full" />
    </div>
  );
}
