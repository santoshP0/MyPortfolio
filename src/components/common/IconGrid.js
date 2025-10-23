import React, { useMemo } from "react";
import { Row, Col } from "react-bootstrap";

const DEFAULT_ROW_STYLE = Object.freeze({
  justifyContent: "center",
  paddingBottom: "50px",
});

const DEFAULT_COL_PROPS = Object.freeze({ xs: 4, md: 2 });

function IconGrid({
  items,
  renderItem,
  rowStyle,
  colProps = DEFAULT_COL_PROPS,
  colClassName = "tech-icons",
}) {
  const gridItems = useMemo(() => items ?? [], [items]);
  const mergedRowStyle = useMemo(
    () => (rowStyle ? { ...DEFAULT_ROW_STYLE, ...rowStyle } : DEFAULT_ROW_STYLE),
    [rowStyle]
  );

  return (
    <Row style={mergedRowStyle}>
      {gridItems.map((item) => (
        <Col
          key={item.id ?? item.label}
          {...colProps}
          className={colClassName}
        >
          {renderItem ? renderItem(item) : null}
        </Col>
      ))}
    </Row>
  );
}

export default IconGrid;
