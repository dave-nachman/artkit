import { monaco } from "@monaco-editor/react";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";

const completionsWorker = new Worker("../webworker.js");

monaco.init().then((monacoInstance: typeof monacoEditor) => {
  (window as any).monacoInstance = monacoInstance;

  monacoInstance.languages.register({
    id: "art_kit",
  });

  monacoInstance.editor.defineTheme(
    "artkit",
    // based on: https://raw.githubusercontent.com/brijeshb42/monaco-themes/master/themes/Xcode_default.json
    {
      base: "vs",
      inherit: true,
      rules: [
        {
          foreground: "008e00",
          token: "comment",
        },
        {
          foreground: "7d4726",
          token: "meta.preprocessor",
        },
        {
          foreground: "7d4726",
          token: "keyword.control.import",
        },
        {
          foreground: "df0002",
          token: "string",
        },
        {
          foreground: "3a00dc",
          token: "constant.numeric",
        },
        {
          foreground: "c800a4",
          token: "constant.language",
        },
        {
          foreground: "275a5e",
          token: "constant.character",
        },
        {
          foreground: "275a5e",
          token: "constant.other",
        },
        {
          foreground: "c800a4",
          token: "variable.language",
        },
        {
          foreground: "c800a4",
          token: "variable.other",
        },
        {
          foreground: "c800a4",
          token: "keyword",
        },
        {
          foreground: "c900a4",
          token: "storage",
        },
        {
          foreground: "438288",
          token: "entity.name.class",
        },
        {
          foreground: "790ead",
          token: "entity.name.tag",
        },
        {
          foreground: "450084",
          token: "entity.other.attribute-name",
        },
        {
          foreground: "450084",
          token: "support.function",
        },
        {
          foreground: "450084",
          token: "support.constant",
        },
        {
          foreground: "790ead",
          token: "support.type",
        },
        {
          foreground: "790ead",
          token: "support.class",
        },
        {
          foreground: "790ead",
          token: "support.other.variable",
        },
      ],
      colors: {
        "editor.foreground": "#000000",
        "editor.background": "#FFFFFF",
        "editor.selectionBackground": "#B5D5FF",
        "editor.lineHighlightBackground": "#00000012",
        "editorCursor.foreground": "#000000",
        "editorWhitespace.foreground": "#BFBFBF",
      },
    }
  );
  monacoInstance.languages.setMonarchTokensProvider(
    "art_kit",
    // from https://github.com/microsoft/monaco-editor/blob/master/website/monarch.html
    {
      defaultToken: "",
      tokenPostfix: ".python",
      keywords: [
        "and",
        "as",
        "assert",
        "break",
        "class",
        "continue",
        "def",
        "del",
        "elif",
        "else",
        "except",
        "exec",
        "finally",
        "for",
        "from",
        "global",
        "if",
        "import",
        "in",
        "is",
        "lambda",
        "None",
        "not",
        "or",
        "pass",
        "print",
        "raise",
        "return",
        "self",
        "try",
        "while",
        "with",
        "yield",
        "int",
        "float",
        "long",
        "complex",
        "hex",
        "abs",
        "all",
        "any",
        "apply",
        "basestring",
        "bin",
        "bool",
        "buffer",
        "bytearray",
        "callable",
        "chr",
        "classmethod",
        "cmp",
        "coerce",
        "compile",
        "complex",
        "delattr",
        "dict",
        "dir",
        "divmod",
        "enumerate",
        "eval",
        "execfile",
        "file",
        "filter",
        "format",
        "frozenset",
        "getattr",
        "globals",
        "hasattr",
        "hash",
        "help",
        "id",
        "input",
        "intern",
        "isinstance",
        "issubclass",
        "iter",
        "len",
        "locals",
        "list",
        "map",
        "max",
        "memoryview",
        "min",
        "next",
        "object",
        "oct",
        "open",
        "ord",
        "pow",
        "print",
        "property",
        "reversed",
        "range",
        "raw_input",
        "reduce",
        "reload",
        "repr",
        "reversed",
        "round",
        "set",
        "setattr",
        "slice",
        "sorted",
        "staticmethod",
        "str",
        "sum",
        "super",
        "tuple",
        "type",
        "unichr",
        "unicode",
        "vars",
        "xrange",
        "zip",
        "True",
        "False",
        "__dict__",
        "__methods__",
        "__members__",
        "__class__",
        "__bases__",
        "__name__",
        "__mro__",
        "__subclasses__",
        "__init__",
        "__import__",
      ],
      brackets: [
        { open: "{", close: "}", token: "delimiter.curly" },
        { open: "[", close: "]", token: "delimiter.bracket" },
        { open: "(", close: ")", token: "delimiter.parenthesis" },
      ],
      tokenizer: {
        root: [
          { include: "@whitespace" },
          { include: "@numbers" },
          { include: "@strings" },
          [/[,:;]/, "delimiter"],
          [/[{}\[\]()]/, "@brackets"],
          [/@[a-zA-Z]\w*/, "tag"],
          [
            /[a-zA-Z]\w*/,
            {
              cases: {
                "@keywords": "keyword",
                "@default": "identifier",
              },
            },
          ],
        ],
        // Deal with white space, including single and multi-line comments
        whitespace: [
          [/\s+/, "white"],
          [/(^#.*$)/, "comment"],
          [/('''.*''')|(""".*""")/, "string"],
          [/'''.*$/, "string", "@endDocString"],
          [/""".*$/, "string", "@endDblDocString"],
        ],
        endDocString: [
          [/\\'/, "string"],
          [/.*'''/, "string", "@popall"],
          [/.*$/, "string"],
        ],
        endDblDocString: [
          [/\\"/, "string"],
          [/.*"""/, "string", "@popall"],
          [/.*$/, "string"],
        ],
        // Recognize hex, negatives, decimals, imaginaries, longs, and scientific notation
        numbers: [
          [/-?0x([abcdef]|[ABCDEF]|\d)+[lL]?/, "number.hex"],
          [/-?(\d*\.)?\d+([eE][+\-]?\d+)?[jJ]?[lL]?/, "number"],
        ],
        // Recognize strings, including those broken across lines with \ (but not without)
        strings: [
          [/'$/, "string.escape", "@popall"],
          [/'/, "string.escape", "@stringBody"],
          [/"$/, "string.escape", "@popall"],
          [/"/, "string.escape", "@dblStringBody"],
        ],
        stringBody: [
          [/[^\\']+$/, "string", "@popall"],
          [/[^\\']+/, "string"],
          [/\\./, "string"],
          [/'/, "string.escape", "@popall"],
          [/\\$/, "string"],
        ],
        dblStringBody: [
          [/[^\\"]+$/, "string", "@popall"],
          [/[^\\"]+/, "string"],
          [/\\./, "string"],
          [/"/, "string.escape", "@popall"],
          [/\\$/, "string"],
        ],
      },
    } as any
  );

  // TODO: finish hover provider
  // monacoInstance.languages.registerHoverProvider("art_kit", {
  //   provideHover: (model, position, token) => {
  //     return {
  //       contents: [{ value: "" }],
  //     };
  //   },
  // });

  monacoInstance.languages.registerCompletionItemProvider("art_kit", {
    provideCompletionItems: (model, position, context, token) => {
      const msg = {
        X: model
          .getValue()
          .split("\n")
          .slice(0, position.lineNumber)
          .join("\n"),
        ident: Math.floor(Math.random() * 100000),
        python: `
  from js import X, ident
  import jedi
  completions = jedi.Script(X, path="example.py").completions()
  [ident, [[c.name, c.type, c.docstring()] for c in completions]]
  `,
      };

      completionsWorker.postMessage(msg);
      return new Promise((resolve) => {
        const eventListener = (e: any) => {
          const { results, error } = e.data;

          if (results && results[0] === msg.ident) {
            const completions: string[][] = results[1];
            console.log("cw completions", msg.ident, completions);

            const currentLength = model.getValue().split(/ |\./g).slice(-1)[0]
              .length;

            const typeToKind: Record<string, number> = {
              module: 8,
              class: 5,
              instance: 4,
              function: 1,
              param: 3,
              path: 4,
              keyword: 17,
            };

            const suggestions = completions.map(
              ([name, type, documentation]) => ({
                label: name,
                // TODO: make sure everything type is handled
                kind: typeToKind[type] || 10,
                insertText: name,
                documentation,
                range: {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: position.column - currentLength,
                  endColumn: position.column,
                },
              })
            );

            resolve({
              incomplete: true,
              suggestions,
            });
          }

          completionsWorker.removeEventListener("message", eventListener);
        };
        completionsWorker.addEventListener("message", eventListener);
      });
    },
  });
});
