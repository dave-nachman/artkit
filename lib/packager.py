"""
Package Artkit into a single file for consumption
by the interactive website, which will use it
via WebAssembly
"""

import os

def package(path):
    output = ""
    files = ([os.path.join(dp, f) for dp, dn, fn in os.walk(os.path.expanduser(path)) for f in fn])

    for file in files:
        if file.endswith(".py"):

            output += "###" + file + "##!"
            output += open(file).read()

    return output


def unpackage(input, prefix):
    xs = ([x.split("##!") for x in input.split("###") if len(x.split("##!")) == 2])

    for file, body in xs:
        path_segments = file.replace("./", "").split("/")

        print(file)
        try:
            os.mkdir(prefix + "/" + "/".join(path_segments[0:-1]))
        except FileExistsError:
            pass

        with open(prefix + "/" + file.replace("./", ""), "w+") as f:
            f.write(body)


def serialize(x):
    typeof = type(x).__name__

    if typeof in ["str", "float", "int", "bool"]:
        return x
    elif typeof == dict:
        return {k: serialize(v) for k, v in x.items()}
    elif typeof == "list":
        return [serialize(y) for y in x]
    else:
        return {
            "type": x.__class__.__name__,
            **serialize(x.__dict__)
        }



if __name__ == "__main__":
    open("artkit-lib", "w+").write(package("."))