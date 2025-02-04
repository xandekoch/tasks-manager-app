import { Button } from "@/components/ui/button";
import { NetworkIcon } from "lucide-react";

interface ButtonProps {
  handleClick: () => void;
}

export const ButtonShare = ({ handleClick }: ButtonProps) => {
  return (
    <Button onClick={handleClick} size="icon">
      <NetworkIcon className="h-4 w-4" />
    </Button>
  );
};
