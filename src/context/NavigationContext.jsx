import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [activePage, setActivePage] = useState("feed");

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState !== null) {
      setIsSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem(
      "sidebarCollapsed",
      JSON.stringify(isSidebarCollapsed)
    );
  }, [isSidebarCollapsed]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const openMobileDrawer = () => {
    setIsMobileDrawerOpen(true);
  };

  const closeMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
  };

  const setPage = (page) => {
    setActivePage(page);
  };

  const value = {
    isSidebarCollapsed,
    isMobileDrawerOpen,
    activePage,
    toggleSidebar,
    openMobileDrawer,
    closeMobileDrawer,
    setPage,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

NavigationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NavigationContext;
