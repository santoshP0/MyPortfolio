import React, { useCallback, useMemo } from "react";
import IconGrid from "../common/IconGrid";
import { TOOL_STACK_ITEMS } from "../../constants/content";

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
      colClassName="tech-icons text-center"
    />
  );
}

export default Toolstack;
