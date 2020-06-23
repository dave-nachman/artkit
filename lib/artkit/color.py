
from dataclasses import dataclass

from artkit.numbers import Node


def serialize_value(value):
    if isinstance(value, Node):
        return value()
    else:
        return value


@dataclass
class Color:
    @classmethod
    def hsla(cls, hue, sat, lum, alpha):
        return HSLA(hue, sat, lum, alpha)

    @classmethod
    def rgba(cls, red, green, blue, alpha):
        return RGBA(red, green, blue, alpha)

    def serialize(self):
        pass


@dataclass
class HSLA(Color):
    hue: int
    sat: int
    lum: int
    alpha: int

    def serialize(self):
        return f"hsla({serialize_value(self.hue)}, {serialize_value(self.sat)}%, {serialize_value(self.lum)}%, {serialize_value(self.alpha)})"

@dataclass
class RGBA(Color):
    red: int
    green: int
    blue: int
    alpha: int

    def serialize(self):
        return f"hsla({serialize_value(self.red)}, {serialize_value(self.green)}, {serialize_value(self.blue)}, {serialize_value(self.alpha)})"
