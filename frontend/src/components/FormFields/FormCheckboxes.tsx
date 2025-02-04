import { FC } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface CheckboxOption {
  id: string;
  label: string;
}

interface FormCheckboxesProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  description?: string;
  options: CheckboxOption[];
  defaultValues?: string[];
  fieldProps?: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;
  className?: string;
}

const FormCheckboxes: FC<FormCheckboxesProps> = ({
  form,
  name,
  label,
  description,
  options,
  fieldProps = {},
  className,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className={cn("flex flex-col flex-grow mb-5", className)}>
          <div>
            <FormLabel>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <div className="flex flex-col md:flex-row justify-between">
            {options.map((option) => (
              <FormField
                key={option.id}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, option.id])
                            : field.onChange(
                                field.value?.filter(
                                  (value: any) => value !== option.id
                                )
                              );
                        }}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      {option.label}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormCheckboxes;
