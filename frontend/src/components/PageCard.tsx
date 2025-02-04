import { Card, CardContent } from "@/components/ui/card";

export interface PageCardProps {
  topTitle: string;
  middleTitle?: string;
  icon?: React.ReactNode;
  subTitle?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const PageCard = ({
  topTitle,
  middleTitle,
  icon,
  subTitle,
  className,
  children,
}: PageCardProps) => {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0">
          <p className="text-sm font-medium text-card-foreground">{topTitle}</p>
          {icon}
        </div>
        <div className="flex flex-col gap-1 mt-4">
          {middleTitle && (
            <h2 className="text-2xl font-bold text-card-foreground">
              {middleTitle}
            </h2>
          )}
          {subTitle && (
            <p className="text-xs text-muted-foreground">{subTitle}</p>
          )}
        </div>
        {children && <div className="py-4">{children}</div>}
      </CardContent>
    </Card>
  );
};
