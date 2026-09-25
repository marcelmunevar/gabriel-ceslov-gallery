import { useState } from "react";
import { Puck, Render } from "@puckeditor/core";
import type { Data } from "@puckeditor/core";
import { config, type Components } from "./puck/config";
import { sampleData } from "./puck/sampleData";
import "@puckeditor/core/puck.css";
import "./App.css";

type Mode = "edit" | "preview";

function App() {
  const [data, setData] = useState<Data<Components>>(sampleData);
  const [mode, setMode] = useState<Mode>("edit");

  if (mode === "preview") {
    return (
      <div className="app">
        <header className="app__toolbar">
          <span className="app__title">Portfolio Prototype</span>
          <button className="app__toggle" onClick={() => setMode("edit")}>
            ← Back to editing
          </button>
        </header>
        <Render config={config} data={data} />
      </div>
    );
  }

  return (
    <div className="app app--editing">
      <Puck
        config={config}
        data={data}
        onChange={setData}
        overrides={{
          headerActions: () => (
            <button className="app__toggle" onClick={() => setMode("preview")}>
              Preview page →
            </button>
          ),
        }}
      />
    </div>
  );
}

export default App;
