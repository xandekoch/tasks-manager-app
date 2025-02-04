import { FC } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea component
import { UseFormReturn } from "react-hook-form";

interface FormTextareaProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  fieldProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  className?: string;
}

const FormTextarea: FC<FormTextareaProps> = ({
  form,
  name,
  label,
  placeholder,
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
            <Textarea
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

export default FormTextarea;
