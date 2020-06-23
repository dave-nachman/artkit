import * as React from "react";
import ReactMarkdown from "react-markdown";
import InlineEditor from "./InlineEditor";

const text = `

In observing the work of artists doing generative visual art, I noticed that the artists typically built a lot of tooling for themselves,
built on top of lower-level libraries and APIs. If artists are excited about building their own tools, that's great, but for some, not having accessible high-level tools might be a barrier to exploring,
something I experienced myself.

My goal is to create an accessible, useful tookit for a particular subset of generative visual art, a subset particularly focused on 2D drawings and patterns. It provides a **declarative API** that hopefully can allow an artist to express themselves at an intent-level, 
it has a good pattern for **composition and abstraction**, and it has easy-to-use capabilities around **introducing randonmess** - a key element of generative art.

## Design choices

### **Embedded DSL** vs. Standalone DSL

A domain-specific language can be embedded inside an existing programming language (exposed as a library) or it can be a standalone separate language. 

A standalone separate language can often be more expressive or fit-for-purpose than an embedded language, because a standalone language can introduce whatever syntax, semantics, and language features 
make sense for the particular domain, while an embedded DSL is limited by and inherits the qualities of its host language. 

An embedded DSL though has the advantage of being easy often to learn and use (use all the language features and tooling available for the host language, users can use orthogonal other libraries). It is also easier to implement and maintain (no need to write a parser and compiler).

Processing and WebGL are example of standalone DSLs for graphics, while three.js is an example of an embedded DSL in JavaScript.

For Artkit, I thought that an embedded DSL would be more accessible and easy-to-use than a standalone DSL.

### **Python** vs. another programming language

Artkit is a DSL embedded in Python. When deciding which language to use as a host language I wanted a widely used, beginner friendly language that could be embedded in an interative website.
JavaScript/TypeScript was a natural choice due to being easy to build an interactive website for it. But another goal of Artkit is to have great capabilities around introducing *controlled randonmess* - because of that, I wanted a language that had **operator overloading** 
so that random number could be both composed and used as if they were regular numbers. There's no capability for operator overloading in JavaScript. 

Python, then seemed like a good choice, as a language that has operator overloading and meets the other criteria. Although not at all as easy as Javascript, Python can be embedded in a website via WebAssembly. The same criteria is also true of Ruby as well, but Python tooling for WebAssembly is more mature and I personally prefer and am more familar with Python.


## Libraries & technologies used
- [Pyodide](https://github.com/iodide-project/pyodide) - Python compiled to WebAssembly
- [Jedi](https://github.com/davidhalter/jedi) - Python autocomplete code analysis library

### Used in interactive website
- [WebAssembly](https://webassembly.org/)
- [pyodide](https://github.com/iodide-project/pyodide)
- [React](https://reactjs.org/)
- [create-react-app](https://github.com/facebook/create-react-app)
- [Monaco code editor](https://www.google.com/search?client=firefox-b-1-d&q=monaco+code+editor)
- [Semantic React UI](https://react.semantic-ui.com/)

`;

export default () => {
  return (
    <div style={{ margin: "24px 16px", maxWidth: 1000 }}>
      <ReactMarkdown
        source={text}
        renderers={{
          inlineCode: ({ value }) => (
            <span style={{ color: "#e82446" }}>{value}</span>
          ),
          code: ({ value }) => {
            return <InlineEditor initialValue={value} />;
          },
        }}
      ></ReactMarkdown>
    </div>
  );
};
