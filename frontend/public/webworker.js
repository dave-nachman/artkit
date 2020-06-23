self.languagePluginUrl = "/";
importScripts("./localforage.min.js");
importScripts("./pyodide.js");

languagePluginLoader.then(() => {
  // pyodide is now ready to use...
  console.log(self.pyodide.runPython("import sys\nsys.version"));

  const run = self.pyodide.runPython;

  run(`

import sys
sys.path.insert(0, '.')
import os
import time

def unpackage(input, prefix):
    xs = ([x.split("##!") for x in input.split("###") if len(x.split("##!")) == 2])

    for file, body in xs:
        path_segments = file.replace("./", "").split("/")

        try:
            os.mkdir(prefix + "/" + "/".join(path_segments[0:-1]))
        except FileExistsError:
            pass

        path = prefix + "/" + file.replace("./", "")
        with open(path, "w+") as f:
            f.write(body)
            print("wrote", path)

def confirm_import():
    sys.path.insert(0, '..')
    import artkit


def serialize(x):
  import artkit
  typeof = type(x).__name__

  if typeof in ["str", "float", "int", "bool"]:
      return x
  elif isinstance(x, dict):
      return {k: serialize(v) for k, v in x.items()}
  elif isinstance(x, list):
      return [serialize(y) for y in x]
  elif isinstance(x, artkit.Node):
      return x()
  elif x is None:
      return x
  else:
      return {
          "type": x.__class__.__name__.lower(),
          **serialize(x.__dict__)
      }
`);

  const sleep = ms => {
    return new Promise(resolve => {
      setInterval(() => resolve(), ms);
    });
  };

  fetch("./artkit-lib")
    .then(r => r.text())
    .then(async body => {
      self.pyodide._module.FS.writeFile("art-kit", body);
      run(`unpackage(open("art-kit").read(), "artkit")`);
      await sleep(1000);
      run(`confirm_import()`);
      console.log("WEBWORKDER: Finished unpackaging");
      self.postMessage({ ready: true });
    });
});

var onmessage = function(e) {
  // eslint-disable-line no-unused-vars
  languagePluginLoader.then(() => {
    const data = e.data;
    const keys = Object.keys(data);
    for (let key of keys) {
      if (key !== "python") {
        // Keys other than python must be arguments for the python script.
        // Set them on self, so that `from js import key` works.
        self[key] = data[key];
      }
    }

    self.pyodide
      .runPythonAsync(data.python, () => {})
      .then(results => {
        self.postMessage({ results });
      })
      .catch(err => {
        // if you prefer messages with the error
        self.postMessage({ error: err.message });
        // if you prefer onerror events
        // setTimeout(() => { throw err; });
      });
  });
};
