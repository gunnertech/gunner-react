import React, { useState } from 'react';
import LayoutComponent from '../Components/Layout'

const Layout = React.createContext({
  showNav: () => null,
  hideNav: () => null
});

const LayoutProvider = ({
  children, 
  LayoutComponent = LayoutComponent, 
  MainNavigation
}) => {
  const [showNav, setShowNav] = useState(true);

  return (
    <Layout.Provider
      value={{
        showNav: () => setShowNav(true),
        hideNav: () => setShowNav(false)
      }}
    >
      <LayoutComponent showNav={showNav} MainNavigation={MainNavigation}>
        {children}
      </LayoutComponent>
    </Layout.Provider>
  );
}

const LayoutConsumer = Layout.Consumer;

export { LayoutProvider, LayoutConsumer, Layout as LayoutContext };