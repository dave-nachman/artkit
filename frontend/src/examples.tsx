export default {
  "colored rectangles": `

import artkit

def draw():

  group = artkit.Group(0, 0, 100, 100, [])
  for n in range(0, 5):
    r = artkit.Rect(20, artkit.UniformFloat(10, 20), 18, 18)
    r.x = (n * 20)
    r.fill = f"hsl({n * 30}, 50%, 50%)"
    group.items.append(r)

  return group
        
          `,
  "circle in squares": `

from artkit import *

def rect_with_circle():

    rect = Rect(0, 0, 100, 100, items=[])
    rect.stroke = Color.hsla(200, 50, 50, 0.2)
    rect.fill = Color.hsla(200, 50, 50, 0.5)

    circle = Circle(50, 50, 45)
    hue = 100 + UniformFloat(-50, 50)
    circle.fill = Color.hsla(hue, 50, 50, 0.4)

    rect.add(circle)        
    return rect


def draw():

    group = Group(0, 0, 50, 50, [])

    for n in range(0, 20):
        rect = rect_with_circle()
        
        rect.x = UniformFloat(0, 80)
        rect.y = UniformFloat(0, 80)
        rect.width = 20
        rect.height = 20
        
        group.add(rect)

    return group


  `
};
