import PropTypes from "prop-types";

import { useSettings } from "src/hooks/use-settings";

import { useSections } from "./config";
import { HorizontalLayout } from "./horizontal-layout";
import { VerticalLayout } from "./vertical-layout";

export const MainLayout = ((props) => {
  const settings = useSettings();
  const sections = useSections();


  if (settings.layout === "horizontal") {
    return (
      <HorizontalLayout
        sections={
          sections
        }
        navColor={settings.navColor}
        {...props}
      />
    );
  }

  return (
    <VerticalLayout
      sections={
        sections
      }
      navColor={settings.navColor}
      {...props}
    />
  );
});

MainLayout.propTypes = {
  children: PropTypes.node,
};
