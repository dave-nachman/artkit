import * as React from "react";
import ReactMarkdown from "react-markdown";
import InlineEditor from "./InlineEditor";

const text = `

Artkit is a toolkit for creating generative visual art, primarily focused on 2d graphics — implemented in Python as an embedded DSL.

It provides a declarative API for drawing with capabilities for introducing *controlled randonness*.

## Basic usage

In the interactive web playground, we define a function named \`draw\` which returns an Artkit **\`Shape\`**.

A shape is the basic building block of our drawings, and include \`Rect\`, \`Circle\`, \`Line\`, as well as \`Group\`.


Here's a basic example of drawing a red rectangle:
\`\`\`
import artkit

def draw():
    rect = artkit.Rect(10, 30, 50, 20, items=[], fill="red")
    return rect
\`\`\`


We can add another shape to any other shape via an \`add\` methods or an \`items\` optional argument:

\`\`\`
import artkit

def draw():
    rect = artkit.Rect(10, 30, 50, 20, items=[], fill="red")

    circle = artkit.Circle(50, 50, 40, fill="yellow")
    rect.add(circle)

    return rect
\`\`\`

Or form a group:

\`\`\`
import artkit

def draw():
    rect = artkit.Rect(10, 30, 50, 20, items=[], fill="red")

    circle = artkit.Circle(50, 50, 40, fill="yellow")
 
    return artkit.Group(0, 0, 50, 50, items=[rect, circle])
\`\`\`

Shapes take in positional arguments first (e.g. \`x\` and \`y\` in the case of \`Rect\`) and then size-related (e.g \`width\` and \`height\`). Positions and sizes are relative to the parent on a scale of 0-100.

Because of the ability to add shapes to each other and due to their relative positioning and sizing, shapes can be used to compose more complex patterns.

## Introducing randomness

Randomness can be introduced by using a number that is sampled from a distribution. Available distributions include \`UniformFloat(min, max)\`, \`UniformInt(min, max)\`, 
\`NormalFloat(mean, st_dev)\`, \`NormalInt(mean, st_dev)\`:
\`\`\`
import artkit

def draw():
    random_width = artkit.UniformFloat(10, 40)
    rect = artkit.Rect(10, 30, random_width, 20, items=[], fill="red")
    return rect
\`\`\`

Here is a number of random rectangles, created using a for loop and a range:
\`\`\`
import artkit

def draw():
    group = artkit.Group(0, 0, 100, 100, items=[])    

    for n in range(0, 10):
        random_width = artkit.UniformFloat(10, 40)
        rect = artkit.Rect(10, 30, random_width, 20, items=[], fill="hsl(0, 50%, 50%, 0.1")
        group.add(rect)
    
    return group
\`\`\`

A random number in Artkit implements the standard operations that a scalar number has, so you can treat it like a normal number in terms of adding and multiplying, e.g.:
\`\`\`
import artkit

def draw():
    group = artkit.Group(0, 0, 100, 100, items=[])    

    for n in range(0, 10):
        random_width = artkit.UniformFloat(10, 40)

        increased_random_width = random_width + 30

        rect = artkit.Rect(10, 30, increased_random_width, 20, items=[], fill="hsl(0, 50%, 50%, 0.1")
        group.add(rect)
    
    return group
\`\`\`

## Abstraction

Standard Python language features, such as defining functions, can be used to factor out patterns in your drawings.

In this example, a reusable compound shape, \`square_with_circle\` is defined as a function:
\`\`\`
import artkit

def square_with_circle():
  square = artkit.Square(0, 0, 100, items=[], fill="red")

  circle = artkit.Circle(50, 50, 40, fill="yellow")
  square.add(circle)

  return square

def draw():
    group = artkit.Group(0, 0, 100, 100, items=[])

    for n in range(0, 20):
      shape = square_with_circle()

      shape.side = 20
   
      shape.x = artkit.UniformFloat(20, 80)
      shape.y = artkit.UniformFloat(20, 80)

      group.add(shape)

    return group
\`\`\`

## Colors

2d shapes can take an optional \`fill\` and \`stroke\` argument, while \`Line\` as a 1d shape just takes in \`stroke\`.

Colors can be specified using any valid web color string (e.g. a named color, rgb, hsla) or an instance of \`Color.hsla\`:

\`\`\`

import artkit

def draw():
  square = artkit.Square(10, 10, 80)

  square.fill = artkit.Color.hsla(100, 50, 50, 1)
  square.fill = "hsla(100, 50%, 50%, 1)" # same thing

  return square
\`\`\`

## Animations

Your \`draw\` function can optionally take a \`tick\` argument, whose value is an integer that increases over time.

While it is not that useful on its own to have a value that increases through the time, the tick value can be manipulated
using the modulo operator (e.g. \`tick % 100\`) to produce a value that ranges between 0 and n - 1. Similarly, the trigonometry
functions from Python's math library can be used to produce a smooth value that ranges between 0 and 1 (e.g. \`math.sin(tick)\`).

\`\`\`
import artkit
import math

def draw(tick):
  
  group = artkit.Group(0, 0, 100, 100, [])
  for n in range(0, 3):
    r = artkit.Rect(20, artkit.UniformFloat(10, 20), 18, 18)
    
    r.x = (n * 20) + (tick % 40)
    hue = math.sin(tick) * 100 + (n * 20)
    r.fill = f"hsl({hue}, 50%, 50%)"
    group.items.append(r)

  return group
\`\`\`

`;

export default () => {
  return (
    <div key="guide" style={{ margin: "24px 16px", maxWidth: 1000 }}>
      <ReactMarkdown
        source={text}
        renderers={{
          inlineCode: ({ value }) => (
            <span key={value} style={{ color: "#e82446" }}>
              {value}
            </span>
          ),
          code: ({ value }) => {
            return <InlineEditor key={value} initialValue={value} />;
          }
        }}
      ></ReactMarkdown>
    </div>
  );
};
