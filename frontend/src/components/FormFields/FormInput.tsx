import { FC } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface FormInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  fieldProps?: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
}

const FormInput: FC<FormInputProps> = ({
  form,
  name,
  label,
  placeholder,
  type = "text",
  fieldProps = {},
  className,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col flex-grow mb-5">
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              {...fieldProps}
              className={className}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
