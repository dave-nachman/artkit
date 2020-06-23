
import random
from dataclasses import dataclass


from artkit.numbers.node import Node


class Distribution(Node):
    pass


@dataclass
class NormalFloat(Distribution):
    mean: float
    st_dev: float

    def __init__(self, mean, st_dev):
        self.mean = mean
        self.st_dev = st_dev
        self()

    def _op(self, *args, **kwargs):
        return random.gauss(self.mean, self.st_dev)

    def __repr__(self):
        return f"NormalFloat(mean={self.mean}, st_dev={self.st_dev})"


@dataclass
class UniformFloat(Distribution):
    low: float
    high: float

    def __init__(self, low, high):
        self.low = low
        self.high = high
        self()

    def _op(self, *args, **kwargs):
        return random.uniform(self.low, self.high)

    def __repr__(self):
        return f"UniformFloat(low={self.low}, high={self.high})"


@dataclass
class NormalInt(Distribution):
    mean: float
    st_dev: float

    def __init__(self, mean, st_dev):
        self.mean = mean
        self.st_dev = st_dev
        self()

    def _op(self, *args, **kwargs):
        return int(random.gauss(self.mean, self.st_dev))

    def __repr__(self):
        return f"NormalInt(mean={self.mean}, st_dev={self.st_dev})"


@dataclass
class UniformInt(Distribution):
    low: int
    high: int
    
    def __init__(self, low, high):
        self.low = low
        self.high = high
        self()

    def _op(self, *args, **kwargs):
        return int(random.uniform(self.low, self.high))

    def __repr__(self):
        return f"UniformInt(low={self.low}, high={self.high})"

__all__ = ["UniformFloat", "UniformInt", "NormalFloat", "NormalInt"]