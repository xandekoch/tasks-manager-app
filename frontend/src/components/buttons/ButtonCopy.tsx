import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface ButtonProps {
  handleClick: () => void;
}

export const ButtonCopy = ({ handleClick }: ButtonProps) => {
  return (
    <Button onClick={handleClick} variant="outline" size="icon">
      <Copy className="h-4 w-4" />
    </Button>
  );
};
