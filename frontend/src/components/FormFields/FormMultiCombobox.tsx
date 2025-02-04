import { FC } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, CircleX, X } from "lucide-react";
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface CampaignOption {
  label: string;
  value: string;
}

interface FormMultiComboboxProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  options: CampaignOption[];
  placeholder?: string;
  description?: string;
  className?: string;
}

const FormMultiCombobox: FC<FormMultiComboboxProps> = ({
  form,
  name,
  label,
  options,
  placeholder = "Select options",
  description,
  className,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col flex-grow mb-5">
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("justify-between", !field.value.length && "text-muted-foreground", className)}
                >
                  {field.value.length > 0
                    ? `${field.value.length} option${field.value.length > 1 ? "s" : ""} selected`
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search..." className="h-9" />
                <CommandList className="w-full">
                  <CommandEmpty>No options found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          const updatedValues = field.value.includes(option.value)
                            ? field.value.filter((value: any) => value !== option.value)
                            : [...field.value, option.value];
                          form.setValue(name, updatedValues);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value.includes(option.value) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />

          {field.value.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {field.value.map((value: any) => (
                <Badge key={value} variant="outline" className="rounded-full flex justify-center items-center">
                  {options.find((opt) => opt.value === value)?.label}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="p-1 ml-1"
                    onClick={() => {
                      const updatedValues = field.value.filter((v: any) => v !== value);
                      form.setValue(name, updatedValues);
                    }}
                  >
                    <CircleX className="h-3 w-3 text-foreground" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </FormItem>
      )}
    />
  );
};

export default FormMultiCombobox;
