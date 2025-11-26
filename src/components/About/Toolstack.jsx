import React, { useCallback, useMemo } from "react";
import IconGrid from "../common/IconGrid";
import { TOOL_STACK_ITEMS } from "../../constants";

/**
 * @component
 * @description Renders a grid of tool icons that represent the software and platforms
 * the user is proficient with. This component uses the generic `IconGrid` to display
 * the items, sourcing its data from the `TOOL_STACK_ITEMS` constant. Each item in the
 * grid consists of an icon and a corresponding label.
 * @returns {JSX.Element} The rendered grid of tool icons.
 */
function Toolstack() {
  const items = useMemo(() => TOOL_STACK_ITEMS, []);
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

export default Toolstack;
