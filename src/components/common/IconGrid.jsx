import React, { useMemo } from "react";
import { Row, Col } from "react-bootstrap";

const DEFAULT_ROW_STYLE = Object.freeze({
  justifyContent: "center",
  paddingBottom: "50px",
});

const DEFAULT_COL_PROPS = Object.freeze({ xs: 4, md: 2 });

/**
 * @component
 * @description A generic, reusable component for rendering a grid of items, typically icons.
 * It uses React Bootstrap's `Row` and `Col` components to create a responsive grid layout.
 * The component is customizable through props, allowing control over the items,
 * rendering logic, and styling.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.items - An array of item objects to be displayed in the grid. Each object should have a unique `id` or `label`.
 * @param {function(object): JSX.Element} props.renderItem - A function that receives an item object and returns the JSX to be rendered for that item.
 * @param {object} [props.rowStyle] - Optional. A style object to apply to the main `Row` component.
 * @param {object} [props.colProps=DEFAULT_COL_PROPS] - Optional. Props to be passed to each `Col` component (e.g., for responsive column sizing).
 * @param {string} [props.colClassName="tech-icons"] - Optional. A CSS class name to apply to each `Col` component.
 * @returns {JSX.Element} The rendered grid of items within a React Bootstrap `Row`.
 */
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
