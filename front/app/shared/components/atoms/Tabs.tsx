import * as TabsPrimitive from "@radix-ui/react-tabs";
import React from "react";

interface TabsProps {
  defaultValue?: string;
  tabs: Array<{ value: string; label: string }>;
  children: (activeTab: string) => React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  tabs,
  children,
  className = "",
}: TabsProps) {
  return (
    <TabsPrimitive.Root
      defaultValue={defaultValue || tabs[0]?.value}
      className={className}
    >
      <div className="flex w-full">
        <TabsPrimitive.List
          className={`inline-flex w-full items-center rounded-full bg-gray-100 p-1`}
        >
          {tabs.map(tab => (
            <TabsPrimitive.Trigger
              key={tab.value}
              value={tab.value}
              className={`
                min-w-0 flex-1 rounded-full px-5 py-2 text-center text-sm font-medium transition-colors
                data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm
                data-[state=inactive]:text-gray-600 hover:text-gray-800
              `}
            >
              <span className="block truncate">{tab.label}</span>
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>
      </div>
      <div className="mt-4">
        {tabs.map(tab => (
          <TabsPrimitive.Content key={tab.value} value={tab.value}>
            {children(tab.value)}
          </TabsPrimitive.Content>
        ))}
      </div>
    </TabsPrimitive.Root>
  );
}
