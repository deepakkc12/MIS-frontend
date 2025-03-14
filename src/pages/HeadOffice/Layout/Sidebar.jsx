import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  ChevronDown, 
  UtensilsCrossed, 
  Users, 
  ClipboardList, 
  Calendar,
  BookOpen,
  DollarSign,
  Settings,
  ShoppingBag,
  Building2,
  Building,
  LayoutDashboardIcon,
  ChartColumn,
  ChartAreaIcon,
  ChartBar,
  ChartBarBigIcon,
  AlertCircle,
  Shield,
  PersonStanding,
  Package,
  LayoutDashboard
} from "lucide-react";
import { cn } from "../../../utils/helper";


// Sidebar Item Component
const SidebarItem = ({ icon, text, path, collapsed, active, children }) => {
  const [subMenuOpen, setSubMenuOpen] = useState(active);

  const handleClick = (e) => {
    if (children) {
      e.preventDefault();
      setSubMenuOpen(!subMenuOpen);
    }
  };

  const itemContent = (
    <>
      <div
        className={cn(
          "p-2 rounded-full transition-colors duration-200",
          active ? "bg-indigo-500 text-white" : "bg-indigo-500/10"
        )}
      >
        {icon}
      </div>
      {!collapsed && (
        <>
          <span
            className={cn(
              "ml-2 flex-grow font-semibold",
              active ? "text-indigo-500" : "text-neutral-600"
            )}
          >
            {text}
          </span>
          {children && (
            <ChevronDown
              size={16}
              className={cn(
                "transform transition-transform duration-200",
                subMenuOpen ? "rotate-180" : ""
              )}
            />
          )}
        </>
      )}
    </>
  );

  return (
    <div
      className={cn(
        "rounded-xl",
        active ? "bg-indigo-500/10" : "",
        "hover:bg-indigo-500/5 cursor-pointer"
      )}
    >
      {path ? (
        <Link
          to={path}
          className={cn(
            "flex items-center px-4 py-2",
            collapsed ? "justify-center" : ""
          )}
        >
          {itemContent}
        </Link>
      ) : (
        <div
          className={cn(
            "flex items-center px-4 py-2",
            collapsed ? "justify-center" : ""
          )}
          onClick={handleClick}
        >
          {itemContent}
        </div>
      )}
      {!collapsed && children && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            subMenuOpen ? "max-h-96" : "max-h-0"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Sidebar SubItem Component
const SidebarSubItem = ({ text, path, active }) => {
  return (
    <Link
      to={path}
      className={cn(
        "block pl-16 py-2 transition-colors duration-200 ease-in-out border-b",
        active
          ? "text-indigo-500 font-semibold"
          : "text-neutral-600 hover:text-indigo-500"
      )}
    >
      <span className={cn("text-sm", active ? "font-semibold" : "font-medium")}>
        {text}
      </span>
    </Link>
  );
};

// Main Sidebar Component
const Sidebar = ({ open, collapsed, toggleSidebar }) => {
  const [hovering, setHovering] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      text: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <Users size={20} />, // Represents CRM better
      text: "CRM",
      path: "/crm",
    },
    {
      icon: <Package size={20} />,
      text: "Inventory",
      path: "/inventory",
    },
    {
      icon: <DollarSign size={20} />, // Represents Financials clearly
      text: "Financials",
      path: "/financials",
    },
    {
      icon: <Shield size={20} />,
      text: "MIS Analatycs",
      path: "/mis-reports",
    },
    {
      icon: <ChartColumn size={20} />,
      text: "Daily Reports",
      path: "/daily-reports",
    },
    {
      icon: <ChartAreaIcon size={20} />,
      text: "Day wise Reports",
      path: "/day-wise-reports",
    }, 
    {
      icon: <ChartBar size={20} />,
      text: "Day wise summery",
      path: "/day-wise-summery",
    },
    {
      icon: <ChartBarBigIcon size={20} />,
      text: "Pivot Report",
      path: "/ho/branch/list",
    },
    {
      icon: <AlertCircle size={20} />,
      text: "Alerts",
      path: "/alerts",
    }
  ];

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 bg-white shadow-lg lg:relative lg:transform-none transition-all duration-300 ease-in-out flex flex-col",
          open ? "transform translate-x-0" : "transform -translate-x-full",
          collapsed ? (hovering ? "w-64" : "w-16") : "w-64"
        )}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div 
            className={cn(
              "text-center overflow-hidden border-b",
              !collapsed || hovering ? "p-4" : "p-3"
            )}
          >
            <div className="text-2xl font-bold text-indigo-500">
              {!collapsed || hovering ? "HO" : "HO"}
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="flex-grow mt-2 space-y-1 px-2 overflow-y-auto">
            {menuItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                text={item.text}
                path={item.path}
                collapsed={collapsed && !hovering}
                active={
                  item.path
                    ? location.pathname === item.path || item.path.includes(location.pathname.split('/')[1])
                    : item.submenu?.some(
                        (subItem) => location.pathname === subItem.path
                      )
                }
              >
                {item.submenu?.map((subItem, subIndex) => (
                  <SidebarSubItem
                    key={subIndex}
                    text={subItem.text}
                    path={subItem.path}
                    active={location.pathname === subItem.path}
                  />
                ))}
              </SidebarItem>
            ))}
          </nav>

          {/* Footer with Orivios Logo */}
          <div className={cn(
            "mt-auto border-t p-4 flex items-center justify-center",
            collapsed && !hovering ? "p-2" : "p-4"
          )}>
            <img 
              src="/orivios.png" alt="Orivios Logo"
              className={cn(
                "transition-all duration-300",
                collapsed && !hovering ? "h-8" : "h-10"
              )} 
            />
          </div>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;