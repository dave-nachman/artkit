from artkit.numbers.node import Node


class BiOperator(Node):
    pass


class Addition(Node):
    def __init__(self, a: Node, b: Node):
        self._a = a
        self._b = b

    def __call__(self, *args, **kwargs):
        return self._a() + self._b()

    def __repr__(self):
        return f"({repr(self._a)} + {repr(self._b)})"


class Subtraction(Node):
    def __init__(self, a: Node, b: Node):
        self._a = a
        self._b = b

    def __call__(self, *args, **kwargs):
        return self._a() - self._b()

    def __repr__(self):
        return f"({repr(self._a)} - {repr(self._b)})"


class Multiplication(Node):
    def __init__(self, a: Node, b: Node):
        self._a = a
        self._b = b

    def __call__(self, *args, **kwargs):
        return self._a() * self._b()

    def __repr__(self):
        return f"({repr(self._a)} * {repr(self._b)})"


class Division(Node):
    def __init__(self, a: Node, b: Node):
        self._a = a
        self._b = b

    def __call__(self, *args, **kwargs):
        return self._a() / self._b()

    def __repr__(self):
        return f"({repr(self._a)} / {repr(self._b)})"
