interface Rect {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  stroke?: string;
  fill?: string;
  items?: Element[];
}

interface Ellipse {
  type: "ellipse";
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  stroke?: string;
  fill?: string;
  items?: Element[];
}

interface Square {
  type: "square";
  x: number;
  y: number;
  side: number;
  stroke?: string;
  fill?: string;
  items?: Element[];
}

interface Circle {
  type: "circle";
  cx: number;
  cy: number;
  r: number;
  stroke?: string;
  fill?: string;
  items?: Element[];
}

interface Polygon {
  type: "polygon";
  cx: number;
  cy: number;
  r: number;
  sides: number;
  stroke?: string;
  fill?: string;
  items?: Element[];
}

interface Line {
  type: "line";
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  stroke?: string;
  items?: Element[];
}

interface Group {
  type: "group";
  x: number;
  y: number;
  width: number;
  height: number;
  items: Element[];
}

export type Element = Rect | Ellipse | Square | Circle | Polygon | Line | Group;
