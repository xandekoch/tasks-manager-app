import { FC } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  options: Option[];
  inputProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
}

const FormSelect: FC<FormSelectProps> = ({
  form,
  name,
  label,
  options,
  inputProps = {},
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col flex-grow mb-5">
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <FormControl>
            {/* @ts-ignore */}
            <Select
              value={field.value?.toString()}
              onValueChange={field.onChange}
              {...inputProps}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSelect;
