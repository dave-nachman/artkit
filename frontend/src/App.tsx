import { ControlledEditor } from "@monaco-editor/react";
import useComponentSize, { ComponentSize } from "@rehooks/component-size";
import LZString from "lz-string";
import React, { useRef, useState } from "react";
import {
  Container,
  Dropdown,
  DropdownItem,
  Grid,
  GridColumn,
  GridRow,
  Icon,
  Input,
  Label,
  Loader,
  Menu
} from "semantic-ui-react";
import { useDebounce } from "use-debounce";
import useUndo from "use-undo";
import useInterval from "@use-it/interval";
import Guide from "./Guide";
import "./editorSetup";
import evaluator from "./evaluator";
import examples from "./examples";
import { render } from "./renderer/canvas";
import Reference from "./Reference";
import Motivation from "./Motivation";
import once from "lodash/once";

const defaultValue = Object.values(examples)[0];

const valueKey = "art_kit_editor_value";

const getCanvasSize = (size: ComponentSize) => {
  const width = size.width / 2 - 100;
  const height = size.height - 240;

  return Math.min(width, height);
};

enum Tab {
  Playground = "Playground",
  Guide = "Guide",
  Reference = "Reference",
  Motivation = "Motivation and design"
}

const App = () => {
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  const appEl = useRef<HTMLDivElement | null>(null);
  const appSize = useComponentSize(appEl);
  const canvasSize = getCanvasSize(appSize);

  const [drawing, setDrawing] = useState<any>(getInitialDrawing());
  const [isLoading, setIsLoading] = useState(true);
  const [rawValue, setValue] = React.useState(getInitialValue());
  const [debouncedValue] = useDebounce(rawValue, 300);
  const [history, { set: setHistory, undo, redo, canUndo, canRedo }] = useUndo(
    getInitialValue()
  );
  const value = history.present;
  const [error, setError] = React.useState<string | null>(null);
  const [seed, setSeed] = React.useState(1);

  const [tab, setTab] = React.useState(Tab.Playground);

  const [tick, setTick] = React.useState(0);

  const framesPerSecond = 5;

  useInterval(() => {
    // only set tick if the current code is using tick - this is a rough way of telling
    if (value.includes("tick")) {
      setTick(tick + 1);
    }
  }, 1000 / framesPerSecond);

  React.useEffect(() => {
    setHistory(debouncedValue);
  }, [debouncedValue]);

  const handleShowValue = () => {
    (async () => {
      try {
        const compiled = await evaluator.evaluate(value, seed, tick);
        try {
          window.history.pushState(
            null,
            "",
            window.location.origin +
              "/temp/" +
              LZString.compressToEncodedURIComponent(
                JSON.stringify({ source: value, compiled })
              )
          );
          localStorage.setItem(
            valueKey,
            JSON.stringify({
              source: value,
              compiled
            })
          );
        } catch (e) {}
        setDrawing(compiled);
        setError(null);
      } catch (e) {
        const error = String(e);
        if (!error.includes("ModuleNotFoundError: No module named 'artkit'")) {
          setError(String(e));
        }
      }
    })();
  };

  React.useEffect(() => {
    try {
      localStorage.setItem(
        valueKey,
        JSON.stringify({
          source: value
        })
      );

      window.history.pushState(
        null,
        "",
        window.location.origin +
          "/temp/" +
          LZString.compressToEncodedURIComponent(
            JSON.stringify({ source: value })
          )
      );
      handleShowValue();
    } catch (e) {}
  }, [value, canvasSize, seed, tab, tick, isLoading]);

  React.useEffect(() => {
    if (canvasEl && drawing) {
      const ctx = canvasEl!.current?.getContext("2d");
      try {
        render(drawing, ctx!, canvasSize / 100);
        setError(null);
      } catch (e) {
        setError(e);
      }
    }
  }, [drawing, canvasEl.current, tab]);

  React.useEffect(() => {
    if (!isLoading) {
      handleShowValue();
    }
  }, [isLoading]);

  React.useEffect(() => {
    evaluator.onReady(() => {
      setIsLoading(false);
    });
  }, []);

  const downloadImage = () => {
    const asDataUrl = canvasEl.current?.toDataURL("image/png")!;
    const link = document.createElement("a");
    link.setAttribute(
      "href",
      asDataUrl.replace("image/png", "image/octet-stream")
    );
    link.download = "artkit.png";
    link.click();
  };

  const downloadCode = () => {
    const link = document.createElement("a");
    link.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(value)
    );

    link.download = "artkit.py";
    link.click();
  };

  const playground = () => (
    <>
      <Menu
        style={{
          backgroundColor: "#a5e2da",
          borderRadius: 0,
          marginTop: 0
        }}
      >
        <Menu.Item
          as="a"
          style={{
            fontFamily: "'Roboto Mono', monospace",
            color: "rgba(0, 0, 0, 0.5)"
          }}
        >
          <Input
            style={{ opacity: 0.5, background: "none" }}
            placeholder="title"
          />
        </Menu.Item>

        <Menu.Item
          as="a"
          style={{
            fontFamily: "'Roboto Mono', monospace",
            color: "rgba(0, 0, 0, 0.5)"
          }}
        >
          <Dropdown text="examples">
            <Dropdown.Menu>
              {Object.entries(examples).map(([key, value]) => (
                <DropdownItem text={key} onClick={() => setValue(value)} />
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
        <Menu.Item
          as="a"
          onClick={downloadCode}
          style={{
            fontFamily: "'Roboto Mono', monospace",
            color: "rgba(0, 0, 0, 0.5)"
          }}
        >
          <Icon style={{ marginRight: 4 }} name="download" />
          code
        </Menu.Item>
        <Menu.Item
          as="a"
          onClick={downloadImage}
          style={{
            fontFamily: "'Roboto Mono', monospace",
            color: "rgba(0, 0, 0, 0.5)"
          }}
        >
          <Icon style={{ marginRight: 4 }} name="download" />
          image
        </Menu.Item>
        <Menu.Item
          as="a"
          disabled={!canUndo}
          onClick={undo}
          style={{
            fontFamily: "'Roboto Mono', monospace",
            color: "rgba(0, 0, 0, 0.5)"
          }}
        >
          <Icon name="undo" />
        </Menu.Item>
        <Menu.Item
          as="a"
          disabled={!canRedo}
          onClick={redo}
          style={{
            fontFamily: "'Roboto Mono', monospace",
            color: "rgba(0, 0, 0, 0.5)"
          }}
        >
          <Icon name="redo" />
        </Menu.Item>

        <Menu.Item
          as="a"
          style={{
            fontFamily: "'Roboto Mono', monospace",
            color: "rgba(0, 0, 0, 0.5)"
          }}
        >
          seed
          <Input
            style={{
              marginLeft: 8,
              background: "none",
              opacity: 0.5,
              width: 64
            }}
            placeholder="seed"
            value={seed}
            type="number"
            onChange={e => setSeed(Number(e.currentTarget.value))}
          />
          <Icon
            style={{ marginLeft: 8 }}
            onClick={() => setSeed(Math.floor(Math.random() * 100))}
            name="refresh"
          />
        </Menu.Item>
      </Menu>
      <Container fluid>
        <Grid columns={2}>
          <GridRow>
            <GridColumn>
              <ControlledEditor
                height="90vh"
                language="art_kit"
                theme="artkit"
                onChange={(ev, v) => setValue(v!)}
                value={value}
                options={{ minimap: { enabled: false } }}
              />
            </GridColumn>
            <GridColumn>
              <div
                style={{
                  position: "absolute"
                }}
              >
                {error && (
                  <div>
                    <Label color="red">Error</Label>
                  </div>
                )}
                {error
                  ? typeof error === "string"
                    ? error
                    : JSON.stringify(error)
                  : ""}
              </div>

              {isLoading && !drawing ? (
                <Loader active size="large">
                  Loading WebAssembly
                </Loader>
              ) : (
                <canvas
                  style={{
                    border: "1px solid #ccc",
                    opacity: error ? 0.25 : 1
                  }}
                  height={canvasSize}
                  width={canvasSize}
                  ref={canvasEl}
                />
              )}
            </GridColumn>
          </GridRow>
        </Grid>
      </Container>
    </>
  );

  return (
    <div ref={appEl} style={{ fontFamily: "'Roboto Mono', monospace" }}>
      <div>
        <Menu
          style={{
            backgroundColor: "#a5e2da",
            borderRadius: 0,
            marginBottom: 0
          }}
        >
          <Menu.Item
            as="a"
            header
            style={{
              fontFamily: "'Bungee Shade', cursive",
              fontSize: 36,
              color: "rgba(0, 0, 0, 0.5)",
              padding: "18px 36px",
              letterSpacing: 1
            }}
          >
            ArtKit
          </Menu.Item>

          <Menu.Item
            style={{ flex: 1, fontFamily: "'Roboto Mono', monospace" }}
          >
            A toolkit for creating generative visual art
          </Menu.Item>
        </Menu>
        <Menu
          style={{
            backgroundColor: "#a5e2da",
            borderRadius: 0,
            marginBottom: 0,
            marginTop: 0
          }}
        >
          {Object.values(Tab).map((tabValue, index) => (
            <Menu.Item
              key={tabValue}
              style={{
                flex: 1,
                fontFamily: "'Roboto Mono', monospace",
                color: "rgba(0,) 0, 0, 0.5)",
                paddingLeft: index === 0 ? 40 : 16 // align with Artkit logo
              }}
              active={tab === tabValue}
              onClick={() => setTab(tabValue)}
            >
              {tabValue.toLowerCase()}
            </Menu.Item>
          ))}
        </Menu>
        {tab === Tab.Guide ? (
          <Guide />
        ) : tab === Tab.Reference ? (
          <Reference />
        ) : tab === Tab.Motivation ? (
          <Motivation />
        ) : (
          playground()
        )}
      </div>
    </div>
  );
};

function getInitialValue(): string {
  if (window.location.href.includes("/temp/")) {
    const fromUrl = LZString.decompressFromEncodedURIComponent(
      window.location.href.split("/temp/")[1]
    );
    try {
      return JSON.parse(fromUrl).source;
    } catch (e) {}
  }
  try {
    const fromLocalStorage = localStorage.getItem(valueKey);
    if (fromLocalStorage) {
      return JSON.parse(fromLocalStorage).source;
    } else {
      return defaultValue;
    }
  } catch (e) {
    return defaultValue;
  }
}

const getInitialDrawing = once(() => {
  if (window.location.href.includes("/temp/")) {
    const fromUrl = LZString.decompressFromEncodedURIComponent(
      window.location.href.split("/temp/")[1]
    );
    try {
      return JSON.parse(fromUrl).compiled;
    } catch (e) {}
  }
  try {
    const fromLocalStorage = localStorage.getItem(valueKey);
    if (fromLocalStorage) {
      return JSON.parse(fromLocalStorage).compiled;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
});

export default App;
