import { Button } from "@/components/ui/button";
import { PencilLine } from "lucide-react";

interface ButtonProps {
  handleClick: () => void;
}

export const ButtonEdit = ({ handleClick }: ButtonProps) => {
  return (
    <Button onClick={handleClick} variant="outline" size="icon">
      <PencilLine className="h-4 w-4" />
    </Button>
  );
};
