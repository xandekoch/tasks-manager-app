import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ButtonProps {
  handleClick: () => void;
}

export const ButtonDelete = ({ handleClick }: ButtonProps) => {
  return (
    <Button onClick={handleClick} variant="destructive" size="icon">
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};
