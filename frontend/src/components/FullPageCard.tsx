import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface FullPageCardProps {
  title: string;
  description?: string;
  classNames?: {
    card?: string;
    header?: string;
    title?: string;
    description?: string;
    content?: string;
  };
  children: React.ReactNode;
  customComponent?: React.ReactElement;
}

function FullPageCard({
  title,
  description,
  classNames = { title: "text-2xl" },
  children,
  customComponent,
}: FullPageCardProps) {
  return (
    <Card className={cn("my-8", classNames.card)}>
      <CardHeader className={classNames.header}>
        <div className="flex gap-4 flex-wrap md:justify-between items-center">
          <div>
            <CardTitle className={classNames.title}>{title}</CardTitle>
            <CardDescription className={classNames.description}>
              {description}
            </CardDescription>
          </div>
          {customComponent && <div>{customComponent}</div>}
        </div>
      </CardHeader>
      <CardContent className={classNames.content}>{children}</CardContent>
    </Card>
  );
}
export default FullPageCard;
