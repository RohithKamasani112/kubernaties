import React from 'react';
import { cn } from '../../utils/cn';

interface TabButton {
  id: string;
  label: string;
  subtext: string;
  icon?: React.ReactNode;
}

interface TabButtonGroupProps {
  tabs: TabButton[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const TabButtonGroup: React.FC<TabButtonGroupProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className
}) => {
  return (
    <div className={cn("flex flex-wrap gap-3 p-1", className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              // Base styles - Very compact size with pill shape
              "relative flex flex-col items-center justify-center",
              "px-3 py-2 rounded-full transition-all duration-300 ease-out",
              "min-w-[90px] group focus:outline-none focus:ring-2 focus:ring-offset-1",
              "backdrop-blur-sm",

              // Active state - Enhanced with gradient and glow
              isActive && [
                "bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600",
                "text-white shadow-xl shadow-indigo-500/30",
                "ring-2 ring-indigo-300/50 ring-offset-2",
                "transform scale-[1.05] focus:ring-indigo-400"
              ],

              // Inactive state - Enhanced with better hover effects
              !isActive && [
                "bg-white/80 text-gray-700 shadow-md border border-gray-200/60",
                "hover:bg-gradient-to-br hover:from-gray-50 hover:to-indigo-50",
                "hover:shadow-lg hover:border-indigo-200 hover:text-indigo-700",
                "hover:transform hover:scale-105 focus:ring-indigo-300"
              ]
            )}
          >
            {/* Icon - Very compact size */}
            {tab.icon && (
              <div className={cn(
                "mb-1 transition-all duration-300 transform",
                isActive ? "text-white scale-105" : "text-gray-500 group-hover:text-indigo-600 group-hover:scale-105"
              )}>
                <div className="w-3.5 h-3.5 flex items-center justify-center">
                  {tab.icon}
                </div>
              </div>
            )}

            {/* Main label - Very compact typography */}
            <div className={cn(
              "font-medium text-xs transition-all duration-300",
              isActive ? "text-white" : "text-gray-900 group-hover:text-indigo-700"
            )}>
              {tab.label}
            </div>

            {/* Subtext - Very compact */}
            <div className={cn(
              "text-[10px] mt-0.5 transition-all duration-300 text-center leading-tight font-normal",
              isActive ? "text-indigo-100" : "text-gray-500 group-hover:text-indigo-600"
            )}>
              {tab.subtext}
            </div>

            {/* Active glow effect */}
            {isActive && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-600/20 blur-xl -z-10" />
            )}
          </button>
        );
      })}
    </div>
  );
};

// Alternative violet theme variant
export const TabButtonGroupViolet: React.FC<TabButtonGroupProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className
}) => {
  return (
    <div className={cn("flex flex-wrap gap-3 p-1", className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              // Base styles - Enhanced with pill shape and better spacing
              "relative flex flex-col items-center justify-center",
              "px-8 py-6 rounded-full transition-all duration-300 ease-out",
              "min-w-[160px] group focus:outline-none focus:ring-2 focus:ring-offset-2",
              "backdrop-blur-sm",

              // Active state - Enhanced Violet theme with gradient and glow
              isActive && [
                "bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600",
                "text-white shadow-xl shadow-violet-500/30",
                "ring-2 ring-violet-300/50 ring-offset-2",
                "transform scale-[1.05] focus:ring-violet-400"
              ],

              // Inactive state - Enhanced with better hover effects
              !isActive && [
                "bg-white/80 text-gray-700 shadow-md border border-gray-200/60",
                "hover:bg-gradient-to-br hover:from-gray-50 hover:to-violet-50",
                "hover:shadow-lg hover:border-violet-200 hover:text-violet-700",
                "hover:transform hover:scale-105 focus:ring-violet-300"
              ]
            )}
          >
            {/* Icon - Enhanced size and spacing */}
            {tab.icon && (
              <div className={cn(
                "mb-3 transition-all duration-300 transform",
                isActive ? "text-white scale-110" : "text-gray-500 group-hover:text-violet-600 group-hover:scale-105"
              )}>
                <div className="w-6 h-6 flex items-center justify-center">
                  {tab.icon}
                </div>
              </div>
            )}

            {/* Main label - Enhanced typography */}
            <div className={cn(
              "font-bold text-base transition-all duration-300",
              isActive ? "text-white" : "text-gray-900 group-hover:text-violet-700"
            )}>
              {tab.label}
            </div>

            {/* Subtext - Enhanced spacing and colors */}
            <div className={cn(
              "text-sm mt-2 transition-all duration-300 text-center leading-tight font-medium",
              isActive ? "text-violet-100" : "text-gray-500 group-hover:text-violet-600"
            )}>
              {tab.subtext}
            </div>

            {/* Active glow effect */}
            {isActive && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400/20 to-fuchsia-600/20 blur-xl -z-10" />
            )}
          </button>
        );
      })}
    </div>
  );
};

// Blue theme variant
export const TabButtonGroupBlue: React.FC<TabButtonGroupProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className
}) => {
  return (
    <div className={cn("flex flex-wrap gap-3 p-1", className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              // Base styles - Enhanced with pill shape and better spacing
              "relative flex flex-col items-center justify-center",
              "px-8 py-6 rounded-full transition-all duration-300 ease-out",
              "min-w-[160px] group focus:outline-none focus:ring-2 focus:ring-offset-2",
              "backdrop-blur-sm",

              // Active state - Enhanced Blue theme with gradient and glow
              isActive && [
                "bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600",
                "text-white shadow-xl shadow-blue-500/30",
                "ring-2 ring-blue-300/50 ring-offset-2",
                "transform scale-[1.05] focus:ring-blue-400"
              ],

              // Inactive state - Enhanced with better hover effects
              !isActive && [
                "bg-white/80 text-gray-700 shadow-md border border-gray-200/60",
                "hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50",
                "hover:shadow-lg hover:border-blue-200 hover:text-blue-700",
                "hover:transform hover:scale-105 focus:ring-blue-300"
              ]
            )}
          >
            {/* Icon - Enhanced size and spacing */}
            {tab.icon && (
              <div className={cn(
                "mb-3 transition-all duration-300 transform",
                isActive ? "text-white scale-110" : "text-gray-500 group-hover:text-blue-600 group-hover:scale-105"
              )}>
                <div className="w-6 h-6 flex items-center justify-center">
                  {tab.icon}
                </div>
              </div>
            )}

            {/* Main label - Enhanced typography */}
            <div className={cn(
              "font-bold text-base transition-all duration-300",
              isActive ? "text-white" : "text-gray-900 group-hover:text-blue-700"
            )}>
              {tab.label}
            </div>

            {/* Subtext - Enhanced spacing and colors */}
            <div className={cn(
              "text-sm mt-2 transition-all duration-300 text-center leading-tight font-medium",
              isActive ? "text-blue-100" : "text-gray-500 group-hover:text-blue-600"
            )}>
              {tab.subtext}
            </div>

            {/* Active glow effect */}
            {isActive && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-600/20 blur-xl -z-10" />
            )}
          </button>
        );
      })}
    </div>
  );
};
