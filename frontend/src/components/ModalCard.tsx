import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export interface ModalClientProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

interface ModalCardProps extends ModalClientProps {
  title: string;
  children: React.ReactNode;
}

const ModalCard = ({ isOpen, onOpenChange, title, children }: ModalCardProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] h-full md:h-auto overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal text-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>
        <>{children}</>
      </DialogContent>
    </Dialog>
  );
};
export default ModalCard;
