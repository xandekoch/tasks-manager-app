import { FC } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

interface FormDateTimePickerProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  disabledDates?: (date: Date) => boolean;
  description?: string;
  placeholder?: string;
  className?: string;
}

const FormDateTimePicker: FC<FormDateTimePickerProps> = ({
  form,
  name,
  label,
  disabledDates = (date) => date <= new Date(),
  description,
  placeholder = "MM/DD/YYYY hh:mm aa",
  className,
}) => {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      form.setValue(name, date);
    }
  };

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    value: string
  ) => {
    const currentDate = form.getValues(name) || new Date();
    let newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    form.setValue(name, newDate);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "MM/dd/yyyy hh:mm aa")
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <div className="sm:flex">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={handleDateSelect}
                  disabled={disabledDates}
                  initialFocus
                />
                <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex sm:flex-col p-2">
                      {Array.from({ length: 12 }, (_, i) => i + 1)
                        .reverse()
                        .map((hour) => (
                          <Button
                            key={hour}
                            size="icon"
                            variant={
                              field.value &&
                              field.value.getHours() % 12 === hour % 12
                                ? "default"
                                : "ghost"
                            }
                            className="sm:w-full shrink-0 aspect-square"
                            onClick={() =>
                              handleTimeChange("hour", hour.toString())
                            }
                          >
                            {hour}
                          </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex sm:flex-col p-2">
                      {Array.from({ length: 12 }, (_, i) => i * 5).map(
                        (minute) => (
                          <Button
                            key={minute}
                            size="icon"
                            variant={
                              field.value && field.value.getMinutes() === minute
                                ? "default"
                                : "ghost"
                            }
                            className="sm:w-full shrink-0 aspect-square"
                            onClick={() =>
                              handleTimeChange("minute", minute.toString())
                            }
                          >
                            {minute.toString().padStart(2, "0")}
                          </Button>
                        )
                      )}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>
                  <ScrollArea className="">
                    <div className="flex sm:flex-col p-2">
                      {["AM", "PM"].map((ampm) => (
                        <Button
                          key={ampm}
                          size="icon"
                          variant={
                            field.value &&
                            ((ampm === "AM" && field.value.getHours() < 12) ||
                              (ampm === "PM" && field.value.getHours() >= 12))
                              ? "default"
                              : "ghost"
                          }
                          className="sm:w-full shrink-0 aspect-square"
                          onClick={() => handleTimeChange("ampm", ampm)}
                        >
                          {ampm}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormDateTimePicker;
