interface HeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const PageHeader = ({ title, description, children }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      <div className="flex gap-3">{children}</div>
    </div>
  );
};
