import { ControlledEditor } from "@monaco-editor/react";
import React, { useRef, useState } from "react";
import {
  Container,
  Grid,
  GridColumn,
  GridRow,
  Label,
  Loader,
} from "semantic-ui-react";
import { useDebounce } from "use-debounce";
import useInterval from "@use-it/interval";
import useUndo from "use-undo";
import "./editorSetup";
import evaluator from "./evaluator";
import { render } from "./renderer/canvas";

const Editor = ({ initialValue }: { initialValue: string }) => {
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  const canvasSize = 200;

  const [drawing, setDrawing] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [rawValue, setValue] = React.useState(initialValue);
  const [debouncedValue] = useDebounce(rawValue, 300);
  const [history, { set: setHistory }] = useUndo(initialValue);
  const value = history.present;
  const [error, setError] = React.useState<string | null>(null);
  const [seed, setSeed] = React.useState(1);

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
        const result = await evaluator.evaluate(value, seed, tick);
        setDrawing(result);
        setError(null);
      } catch (e) {
        setError(String(e));
      }
    })();
  };

  React.useEffect(() => {
    try {
      handleShowValue();
    } catch (e) {}
  }, [value, canvasSize, seed]);

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
  }, [drawing, canvasEl, tick]);

  React.useEffect(() => {
    evaluator.onReady(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 5,
        marginBottom: 32,
        boxShadow: "inset 0px 0px 9px 0px rgba(217,217,217,1)",
      }}
    >
      <Container fluid>
        <Grid columns={2}>
          <GridRow>
            <GridColumn>
              <ControlledEditor
                height="200px"
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
                  position: "absolute",
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

              {isLoading ? (
                <Loader active size="large">
                  Loading WebAssembly
                </Loader>
              ) : (
                <canvas
                  style={{
                    border: "1px solid #ccc",
                    opacity: error ? 0.25 : 1,
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
    </div>
  );
};

export default Editor;
