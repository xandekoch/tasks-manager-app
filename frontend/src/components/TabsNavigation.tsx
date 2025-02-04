"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Tab {
  value: string;
  label: string;
}

interface TabsNavigationProps {
  tabs: Tab[];
}

export const TabsNavigation = ({ tabs }: TabsNavigationProps) => {
  const router = useRouter();
  const pathname = usePathname().split("/");
  const lastPath = pathname[pathname.length - 1];

  const handleTabChange = (value: string) => {
    router.push(value);
  };

  return (
    <Tabs
      defaultValue={lastPath}
      className="w-full mb-8"
      onValueChange={handleTabChange}
    >
      <TabsList className="h-auto w-full justify-start p-0 bg-transparent border-b border-border">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="relative px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
