

class Node:
    def _op(self, *args, **kwargs):
        pass

    def __call__(self, *args, **kwargs):
        if not hasattr(self, "_value"):
            self._value = self._op(*args, **kwargs)

        return self._value

    def __add__(self, other):
        from artkit.numbers.operators import Addition
        if isinstance(other, Node):
            return Addition(self, other)
        elif isinstance(other, float) or isinstance(other, int):
            return Addition(self, Scalar(other))

    def __sub__(self, other):
        from artkit.numbers.operators import Subtraction
        if isinstance(other, Node):
            return Subtraction(self, other)
        elif isinstance(other, float) or isinstance(other, int):
            return Subtraction(self, Scalar(other))

    def __mul__(self, other):
        from artkit.numbers.operators import Multiplication
        if isinstance(other, Node):
            return Multiplication(self, other)
        elif isinstance(other, float) or isinstance(other, int):
            return Multiplication(self, Scalar(other))

    def __truediv__(self, other):
        from artkit.numbers.operators import Division
        if isinstance(other, Node):
            return Division(self, other)
        elif isinstance(other, float) or isinstance(other, int):
            return Division(self, Scalar(other))

    def __radd__(self, other):
        return self.__add__(other)

    def __rsub__(self, other):
        from artkit.numbers.operators import Subtraction
        if isinstance(other, Node):
            return Subtraction(other, self)
        elif isinstance(other, float) or isinstance(other, int):
            return Subtraction(Scalar(other), self)

    def __rmul__(self, other):
        return self.__mul__(other)

    def __rdiv__(self, other):
        from artkit.numbers.operators import Division
        if isinstance(other, Node):
            return Division(other, self)
        elif isinstance(other, float) or isinstance(other, int):
            return Division(Scalar(other), self)


class Scalar(Node):
    def __init__(self, value):
        self._value = value

    def _op(self, *args, **kwargs):
        return self._value

    def __repr__(self):
        return repr(self._value)
