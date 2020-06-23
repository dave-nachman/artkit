import * as React from "react";
import ReactMarkdown from "react-markdown";
import Editor from "./InlineEditor";

const text = `

## Shapes
### Circle
\`Circle(cx: float, cy: float, r: float, stroke: Optional[str] = None, fill: Optional[str] = None, items: Optional[List[artkit.shapes.shape.Shape]] = None)\`
### Ellipse
\`Ellipse(cx: float, cy: float, rx: float, ry: float, stroke: Optional[str] = None, fill: Optional[str] = None, items: Optional[List[artkit.shapes.shape.Shape]] = None)\`
### Group
\`Group(x: float, y: float, width: float, height: float, items: Optional[List[artkit.shapes.shape.Shape]] = None)\`
### Line
\`Line(x0: float, y0: float, x1: float, y1: float, stroke: Optional[str] = None, items: Optional[List[artkit.shapes.shape.Shape]] = None)\`
### Polygon
\`Polygon(cx: float, cy: float, r: float, sides: int, stroke: Optional[str] = None, fill: Optional[str] = None, items: Optional[List[artkit.shapes.shape.Shape]] = None)\`
### Rect
\`Rect(x: float, y: float, width: float, height: float, stroke: Optional[str] = None, fill: Optional[str] = None, items: Optional[List[artkit.shapes.shape.Shape]] = None)\`
### Square
\`Square(x: float, y: float, side: float, stroke: Optional[str] = None, fill: Optional[str] = None, items: Optional[List[artkit.shapes.shape.Shape]] = None)\`

## Distributions
### NormalFloat
\`NormalFloat()\`
### NormalInt
\`NormalInt()\`
### UniformFloat
\`UniformFloat()\`
### UniformInt
\`UniformInt()\`

## Colors
### Color
\`Color()\`

`;

export default () => {
  return (
    <div style={{ margin: "24px 16px", maxWidth: 1000 }}>
      <ReactMarkdown
        source={text}
        renderers={{
          code: ({ value }) => {
            return <Editor initialValue={value} />;
          }
        }}
      ></ReactMarkdown>
    </div>
  );
};
