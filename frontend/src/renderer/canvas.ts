import { Element } from "./types";

const renderElement = (element: Element, ctx: CanvasRenderingContext2D) => {
  switch (element.type) {
    case "rect": {
      fillAndStroke(element, ctx);
      ctx.fillRect(element.x, element.y, element.width, element.height);
      ctx.strokeRect(element.x, element.y, element.width, element.height);
      if (element.items) {
        element.items.forEach(item => renderElement(item, ctx));
      }
      break;
    }
    case "square": {
      fillAndStroke(element, ctx);
      ctx.fillRect(element.x, element.y, element.side, element.side);
      ctx.strokeRect(element.x, element.y, element.side, element.side);
      if (element.items) {
        element.items.forEach(item => renderElement(item, ctx));
      }
      break;
    }
    case "ellipse": {
      fillAndStroke(element, ctx);
      ctx.beginPath();
      ctx.ellipse(
        element.cx,
        element.cy,
        element.rx,
        element.ry,
        0,
        0,
        2 * Math.PI
      );
      ctx.stroke();
      ctx.fill();
      if (element.items) {
        element.items.forEach(item => renderElement(item, ctx));
      }
      break;
    }
    case "circle": {
      fillAndStroke(element, ctx);
      ctx.beginPath();
      ctx.ellipse(
        element.cx,
        element.cy,
        element.r,
        element.r,
        0,
        0,
        2 * Math.PI
      );
      ctx.stroke();
      ctx.fill();
      if (element.items) {
        element.items.forEach(item => renderElement(item, ctx));
      }

      break;
    }
    case "polygon": {
      fillAndStroke(element, ctx);
      ctx.beginPath();
      ctx.ellipse(
        element.cx,
        element.cy,
        element.r,
        element.r,
        0,
        0,
        2 * Math.PI
      );
      ctx.stroke();
      ctx.fill();
      if (element.items) {
        element.items.forEach(item => renderElement(item, ctx));
      }

      break;
    }
    case "line": {
      fillAndStroke(element, ctx);
      ctx.beginPath();
      ctx.moveTo(element.x0, element.y0);
      ctx.lineTo(element.x1, element.y1);
      ctx.stroke();
      if (element.items) {
        element.items.forEach(item => renderElement(item, ctx));
      }

      break;
    }
    case "group": {
      element.items.forEach(item => renderElement(item, ctx));
      break;
    }
  }
};

const rescale = (element: Element, scale: number): Element => {
  switch (element.type) {
    case "rect": {
      return {
        ...element,
        x: element.x * scale,
        y: element.y * scale,
        width: element.width * scale,
        height: element.height * scale,
        items: element.items
          ? element.items.map(item => rescale(item, scale))
          : undefined
      };
    }
    case "ellipse": {
      return {
        ...element,
        cx: element.cx * scale,
        cy: element.cy * scale,
        rx: element.rx * scale,
        ry: element.ry * scale,
        items: element.items
          ? element.items.map(item => rescale(item, scale))
          : undefined
      };
    }
    case "square": {
      return {
        ...element,
        x: element.x * scale,
        y: element.y * scale,
        side: element.side * scale,
        items: element.items
          ? element.items.map(item => rescale(item, scale))
          : undefined
      };
    }
    case "circle": {
      return {
        ...element,
        cx: element.cx * scale,
        cy: element.cy * scale,
        r: element.r * scale,
        items: element.items
          ? element.items.map(item => rescale(item, scale))
          : undefined
      };
    }
    case "polygon": {
      return {
        ...element,
        cx: element.cx * scale,
        cy: element.cy * scale,
        r: element.r * scale,
        items: element.items
          ? element.items.map(item => rescale(item, scale))
          : undefined
      };
    }
    case "line": {
      return {
        ...element,
        x0: element.x0 * scale,
        y0: element.y0 * scale,
        x1: element.x1 * scale,
        y1: element.y1 * scale,
        items: element.items
          ? element.items.map(item => rescale(item, scale))
          : undefined
      };
    }
    case "group": {
      return {
        ...element,
        x: element.x * scale,
        y: element.y * scale,
        width: element.width * scale,
        height: element.height * scale,
        items: element.items.map(item => rescale(item, scale))
      };
    }
  }
};

const absoluteSize = (
  element: Element,
  x: number,
  y: number,
  width: number,
  height: number
): Element => {
  switch (element.type) {
    case "rect": {
      return {
        ...element,
        x: element.x * width + x,
        y: element.y * height + y,
        width: element.width * width,
        height: element.height * height,
        items: element.items
          ? element.items.map(item =>
              absoluteSize(
                item,
                element.x * width + x,
                element.y * height + y,
                (element.width * width) / 100,
                (element.height * height) / 100
              )
            )
          : undefined
      };
    }
    case "ellipse": {
      return {
        ...element,
        cx: element.cx * width + x,
        cy: element.cy * height + y,
        rx: element.rx * width,
        ry: element.ry * height,
        items: element.items
          ? element.items.map(item =>
              absoluteSize(
                item,
                element.cx - element.rx * width + x,
                element.cy - element.ry * height + y,
                (element.rx * 2 * width) / 100,
                (element.ry * 2 * height) / 100
              )
            )
          : undefined
      };
    }
    case "square": {
      if (width === height) {
        return {
          ...element,
          x: element.x * width + x,
          y: element.y * height + y,
          side: element.side * width,
          items: element.items
          ? element.items.map(item =>
              absoluteSize(
                item,
                element.x * width + x,
                element.y * height + y,
                (element.side * width) / 100,
                (element.side * height) / 100
              )
            )
          : undefined
        };
      } else {
        return {
          ...element,
          type: "rect",
          x: element.x * width + x,
          y: element.y * height + y,
          width: element.side * width,
          height: element.side * height,
          items: element.items
          ? element.items.map(item =>
              absoluteSize(
                item,
                element.x * width + x,
                element.y * height + y,
                (element.side * width) / 100,
                (element.side * height) / 100
              )
            )
          : undefined
        };
      }
    }
    case "polygon": {
      // TODO: finish implementation
      return element;
    }
    case "circle": {
      if (width === height) {
        return {
          ...element,
          cx: element.cx * width + x,
          cy: element.cy * height + y,
          r: element.r * width,
          items: element.items
            ? element.items.map(item =>
                absoluteSize(
                  item,
                  element.cx - element.r * width + x,
                  element.cy - element.r * height + y,
                  (element.r * 2 * width) / 100,
                  (element.r * 2 * height) / 100
                )
              )
            : undefined
        };
      } else {
        return {
          ...element,
          type: "ellipse",
          cx: element.cx * width + x,
          cy: element.cy * height + y,
          rx: element.r * width,
          ry: element.r * height,
          items: element.items
            ? element.items.map(item =>
                absoluteSize(
                  item,
                  element.cx - element.r * width + x,
                  element.cy - element.r * height + y,
                  (element.r * 2 * width) / 100,
                  (element.r * 2 * height) / 100
                )
              )
            : undefined
        };
      }
    }
    case "line": {
      return {
        ...element,
        x0: element.x0 * width + x,
        y0: element.y0 * height + y,
        x1: element.x1 * width + x,
        y1: element.y1 * height + y,
        items: element.items
          ? element.items.map(item =>
              absoluteSize(
                item,
                element.x0 * width + x,
                element.y0 * height + y,
                ((element.x1 - element.x0) * width) / 100,
                ((element.y1 - element.y0) * height) / 100
              )
            )
          : undefined
      };
    }
    case "group": {
      return {
        ...element,
        x: element.x * width + x,
        y: element.y * height + y,
        width: element.width * width,
        height: element.height * height,
        items: element.items.map(item =>
          absoluteSize(
            item,
            element.x * width + x,
            element.y * height + y,
            (element.width * width) / 100,
            (element.height * height) / 100
          )
        )
      };
    }
  }
};

export const render = (
  element: Element,
  ctx: CanvasRenderingContext2D,
  scale: number
) => {
  ctx.clearRect(0, 0, 100 * scale * 100, 100 * scale * 100);
  renderElement(rescale(absoluteSize(element, 0, 0, 1, 1), scale), ctx);
};

function fillAndStroke(
  element: { fill?: string; stroke?: string },
  ctx: CanvasRenderingContext2D
) {
  if (element.fill) {
    ctx.fillStyle = element.fill;
  } else {
    ctx.fillStyle = "transparent";
  }
  if (element.stroke) {
    ctx.strokeStyle = element.stroke;
  } else {
    ctx.strokeStyle = "transparent";
  }
}
