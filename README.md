# Artkit

Artkit is a toolkit for creating generative visual art, primarily focused on 2d graphics — implemented in Python as an embedded DSL, along with an [interactive web environment](https://artkit.app).

It provides a declarative API for drawing shapes with capabilities for introducing **controlled randonness**.

## Motivation

In observing the work of artists doing generative visual art, I noticed that the artists typically built a lot of tooling for themselves,
built on top of lower-level libraries and APIs. If artists are excited about building their own tools, that's great, but for some, not having accessible high-level tools might be a barrier to exploring,
something I experienced myself.

My goal is to create an accessible, useful tookit for a particular subset of generative visual art, a subset particularly focused on 2D drawings and patterns. It provides a **declarative API** that hopefully can allow an artist to express themselves at an intent-level,
it has a good pattern for **composition and abstraction**, and it has easy-to-use capabilities around **introducing randonmess** - a key element of generative art.

### Design choices

#### **Embedded DSL** vs. Standalone DSL

A domain-specific language can be embedded inside an existing programming language (exposed as a library) or it can be a standalone separate language.

A standalone separate language can often be more expressive or fit-for-purpose than an embedded language, because a standalone language can introduce whatever syntax, semantics, and language features
make sense for the particular domain, while an embedded DSL is limited by and inherits the qualities of its host language.

An embedded DSL though has the advantage of being easy often to learn and use (use all the language features and tooling available for the host language, users can use orthogonal other libraries). It is also easier to implement and maintain (no need to write a parser and compiler).

Processing and WebGL are example of standalone DSLs for graphics, while three.js is an example of an embedded DSL in JavaScript.

For Artkit, I thought that an embedded DSL would be more accessible and easy-to-use than a stand-alone DSL.

#### **Python** vs. another programming language

Artkit is a DSL embedded in Python. When deciding which language to use as a host language I wanted a widely used, beginner friendly language that could be embedded in an interative website.
JavaScript/TypeScript was a natural choice due to being easy to build an interactive website for it. But another goal of Artkit is to have great capabilities around introducing _controlled randonmess_ - because of that, I wanted a language that had **operator overloading**
so that random number could be both composed and used as if they were regular numbers. There's no capability for operator overloading in JavaScript.

Python, then seemed like a good choice, as a language that has operator overloading and meets the other criteria. Although not at all as easy as Javascript, Python can be embedded in a website via WebAssembly. The same criteria is also true of Ruby as well, but Python tooling for WebAssembly is more mature and I personally prefer and am more familar with Python.

### Libraries & technologies used

- [Pyodide](https://github.com/iodide-project/pyodide) - Python compiled to WebAssembly
- [Jedi](https://github.com/davidhalter/jedi) - Python autocomplete code analysis library

#### Used in interactive website

- [WebAssembly](https://webassembly.org/)
- [pyodide](https://github.com/iodide-project/pyodide)
- [React](https://reactjs.org/)
- [create-react-app](https://github.com/facebook/create-react-app)
- [Monaco code editor](https://www.google.com/search?client=firefox-b-1-d&q=monaco+code+editor)
- [Semantic React UI](https://react.semantic-ui.com/)

## Current status

- Core library (Python)
  - [TODO] Add Python renderer
  - [TODO] Improve docs
  - [TODO] Improve color library
- Interactive website
  - [TODO] Make auto-complete more reliable
  - [TODO] Improve WebAssembly loading time
  - [TODO] Finish polygon renderer implementation
  - [TODO] Improve look and feel

## Quick guide

### Basic usage

In the interactive web playground, we define a function named `draw` which returns an Artkit **`Shape`**.

A shape is the basic building block of our drawings, and include `Rect`, `Circle`, `Line`, as well as `Group`.

Here's a basic example of drawing a red rectangle:

```python
import artkit

def draw():
    rect = artkit.Rect(10, 30, 50, 20, items=[], fill="red")
    return rect
```

We can add another shape to any other shape via an `add` methods or an `items` optional argument:

```python
import artkit

def draw():
    rect = artkit.Rect(10, 30, 50, 20, items=[], fill="red")

    circle = artkit.Circle(50, 50, 40, fill="yellow")
    rect.add(circle)

    return rect
```

Or form a group:

```python
import artkit

def draw():
    rect = artkit.Rect(10, 30, 50, 20, items=[], fill="red")

    circle = artkit.Circle(50, 50, 40, fill="yellow")

    return artkit.Group(0, 0, 50, 50, items=[rect, circle])
```

Shapes take in positional arguments first (e.g. `x` and `y` in the case of `Rect`) and then size-related (e.g `width` and `height`). Positions and sizes are relative to the parent on a scale of 0-100.

Because of the ability to add shapes to each other and due to their relative positioning and sizing, shapes can be used to compose more complex patterns.

### Introducing randomness

Randomness can be introduced by using a number that is sampled from a distribution. Available distributions include `UniformFloat(min, max)`, `UniformInt(min, max)`,
`NormalFloat(mean, st_dev)`, `NormalInt(mean, st_dev)`:

```python
import artkit

def draw():
    random_width = artkit.UniformFloat(10, 40)
    rect = artkit.Rect(10, 30, random_width, 20, items=[], fill="red")
    return rect
```

Here is a number of random rectangles, created using a for loop and a range:

```python
import artkit

def draw():
    group = artkit.Group(0, 0, 100, 100, items=[])

    for n in range(0, 10):
        random_width = artkit.UniformFloat(10, 40)
        rect = artkit.Rect(10, 30, random_width, 20, items=[], fill="hsl(0, 50%, 50%, 0.1")
        group.add(rect)

    return group
```

A random number in Artkit implements the standard operations that a scalar number has, so you can treat it like a normal number in terms of adding and multiplying, e.g.:

```python
import artkit

def draw():
    group = artkit.Group(0, 0, 100, 100, items=[])

    for n in range(0, 10):
        random_width = artkit.UniformFloat(10, 40)

        increased_random_width = random_width + 30

        rect = artkit.Rect(10, 30, increased_random_width, 20, items=[], fill="hsl(0, 50%, 50%, 0.1")
        group.add(rect)

    return group
```

### Abstraction

Standard Python language features, such as defining functions, can be used to factor out patterns in your drawings.

In this example, a reusable compound shape, `square_with_circle` is defined as a function:

```python
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
```

### Colors

2d shapes can take an optional `fill` and `stroke` argument, while `Line` as a 1d shape just takes in `stroke`.

Colors can be specified using any valid web color string (e.g. a named color, rgb, hsla) or an instance of `Color.hsla`:

```python

import artkit

def draw():
  square = artkit.Square(10, 10, 80)

  square.fill = artkit.Color.hsla(100, 50, 50, 1)
  square.fill = "hsla(100, 50%, 50%, 1)" # same thing

  return square
```

### Animations

Your `draw` function can optionally take a `tick` argument, whose value is an integer that increases over time.

While it is not that useful on its own to have a value that increases through the time, the tick value can be manipulated
using the modulo operator (e.g. `tick % 100`) to produce a value that ranges between 0 and n - 1. Similarly, the trigonometry
functions from Python's math library can be used to produce a smooth value that ranges between 0 and 1 (e.g. `math.sin(tick)`).

```python
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
```
