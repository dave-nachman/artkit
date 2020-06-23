
"""Generate docs for the interactive website
"""
import dataclasses

import artkit


output = ""

packages = [
    ("artkit.shapes.shape", "Shapes"),
    ("artkit.numbers.distributions", "Distributions"),
    ("artkit.color", "Colors")
]

def render_field(field: dataclasses.Field):

    default_value = ""

    if hasattr(field, "default") and field.default is not dataclasses.MISSING:
        default_value = " = " + str(field.default)

    try:
        if hasattr(field, "type"):
            if hasattr(field.type, "__name__"):

                return f"{field.name}: {str(field.type.__name__)}" + default_value
            elif "typing.Union[" in str(field.type) and "NoneType]" in str(field.type):
                return f"{field.name}: {str(field.type)}".replace("typing.Union", "typing.Optional").replace(", NoneType", "").replace("typing.", "") + default_value
            else:

                return f"{field.name}: {str(field.type).replace('typing.', '')}" + default_value
        else:
            return field.name + default_value
    except Exception as e:
        print("failed on", field, e)
        return field.name + default_value

for package, header in packages:

    output += "\n## " + header + "\n"

    for key in dir(artkit):
        try:
            value = getattr(artkit, key)
            module = value.__module__
            if module == package:
                output += "### " + key + "\n"
                output += "\`" + key + "("

                for field in dataclasses.fields(value):
                    output += render_field(field) + ", "


                print(output[-2:])
                if output[-2:] == ", ":
                    output = output[:-2]  # remove trailing comma
                output += ")\`\n"

        except Exception as e:
            print("e", e)
            pass

print(output)