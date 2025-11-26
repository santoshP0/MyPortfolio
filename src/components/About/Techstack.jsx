import React, { useCallback, useMemo } from "react";
import IconGrid from "../common/IconGrid";
import { TECH_STACK_ITEMS } from "../../constants";

/**
 * @component
 * @description Renders a grid of technology icons that represent the user's technical stack.
 * This component utilizes the generic `IconGrid` component to display the items,
 * and the data for the grid is sourced from the `TECH_STACK_ITEMS` constant.
 * Each item in the grid is rendered with its corresponding icon and a label.
 * @returns {JSX.Element} The rendered grid of technology icons.
 */
function Techstack() {
  const items = useMemo(() => TECH_STACK_ITEMS, []);
  const labelStyle = useMemo(() => ({ fontSize: 20 }), []);

  const renderItem = useCallback(
    ({ Icon, label }) => (
      <>
        <Icon size={80} />
        <div style={labelStyle}>{label}</div>
      </>
    ),
    [labelStyle]
  );

  return (
    <IconGrid
      items={items}
      renderItem={renderItem}
      colClassName="tech-icons text-center tech-icons-cardable"
    />
  );
}

export default Techstack;
