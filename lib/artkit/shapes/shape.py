import copy

from dataclasses import dataclass
from typing import Optional, List

__all__ = ["Rect", "Square", "Ellipse", "Circle", "Polygon", "Line", "Group"]

class Shape:
    def copy(self):
        return copy.deepcopy(self)

    def add(self, item: "Shape"):

        if not hasattr(self, "items"):
            self.items = []

        return self.items.append(item)

    def rough(self):

        if not hasattr(self, "qualifiers"):
            self.qualifiers = []

        return self.qualifiers.append("rough")

    def blurry(self):

        if not hasattr(self, "qualifiers"):
            self.qualifiers = []

        return self.qualifiers.append("blurry")


    def swiggly(self):

        if not hasattr(self, "qualifiers"):
            self.qualifiers = []

        return self.qualifiers.append("swiggly")

@dataclass
class Polygon(Shape):
    cx: float
    cy: float
    r: float
    sides: int
    stroke: Optional[str] = None
    fill: Optional[str] = None
    items: Optional[List[Shape]] = None


@dataclass
class Rect(Shape):
    """A rectangle"""
    x: float
    y: float
    width: float
    height: float
    stroke: Optional[str] = None
    fill: Optional[str] = None
    items: Optional[List[Shape]] = None


@dataclass
class Ellipse(Shape):
    cx: float
    cy: float
    rx: float
    ry: float
    stroke: Optional[str] = None
    fill: Optional[str] = None
    items: Optional[List[Shape]] = None


@dataclass
class Square(Shape):
    x: float
    y: float
    side: float
    stroke: Optional[str] = None
    fill: Optional[str] = None
    items: Optional[List[Shape]] = None


@dataclass
class Circle(Shape):
    cx: float
    cy: float
    r: float
    stroke: Optional[str] = None
    fill: Optional[str] = None
    items: Optional[List[Shape]] = None


@dataclass
class Line(Shape):
    x0: float
    y0: float
    x1: float
    y1: float
    stroke: Optional[str] = None
    items: Optional[List[Shape]] = None


@dataclass
class Group(Shape):
    x: float
    y: float
    width: float
    height: float
    items: Optional[List[Shape]] = None
