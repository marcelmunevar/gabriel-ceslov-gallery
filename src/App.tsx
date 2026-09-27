import { useEffect, useRef, useState, type FormEvent } from "react";
import { Puck, Render } from "@puckeditor/core";
import type { Data } from "@puckeditor/core";
import type { User } from "@supabase/supabase-js";
import { config, type Components } from "./puck/config";
import {
  loadOrSeedDraft,
  publishPage,
  saveDraft,
  type PuckData,
} from "./lib/content";
import { supabase } from "./lib/supabase";
import "@puckeditor/core/puck.css";
import "./App.css";

type Mode = "edit" | "preview";
type SaveStatus =
  | "idle"
  | "saving"
  | "saved"
  | "publishing"
  | "published"
  | "error";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong.";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<Data<Components> | null>(null);
  const [mode, setMode] = useState<Mode>("edit");
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (!isMounted) return;

      if (sessionError) setError(sessionError.message);
      setUser(sessionData.session?.user ?? null);
      setIsAuthLoading(false);
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      setUser(session?.user ?? null);
      if (!session) {
        setData(null);
        setMode("edit");
        setSaveStatus("idle");
      }
      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    let isCancelled = false;

    void loadOrSeedDraft()
      .then((draft) => {
        if (!isCancelled) setData(draft);
      })
      .catch((loadError: unknown) => {
        if (!isCancelled) setError(getErrorMessage(loadError));
      })
      .finally(() => {
        if (!isCancelled) setIsContentLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [user]);

  useEffect(
    () => () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    },
    [],
  );

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSigningIn(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) setError(signInError.message);
    else setPassword("");
    setIsSigningIn(false);
  };

  const handleSignOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut({
      scope: "local",
    });
    if (signOutError) setError(signOutError.message);
  };

  const handleChange = (nextData: PuckData) => {
    setData(nextData);
    setSaveStatus("saving");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      void saveDraft(nextData)
        .then(() => setSaveStatus("saved"))
        .catch((saveError: unknown) => {
          setError(getErrorMessage(saveError));
          setSaveStatus("error");
        });
    }, 700);
  };

  const handlePublish = async (nextData: PuckData) => {
    setSaveStatus("publishing");
    try {
      await publishPage(nextData);
      setData(nextData);
      setSaveStatus("published");
    } catch (publishError) {
      setError(getErrorMessage(publishError));
      setSaveStatus("error");
      throw publishError;
    }
  };

  if (isAuthLoading) {
    return <div className="app__toolbar">Loading account…</div>;
  }

  if (!user) {
    return (
      <main className="app">
        <header className="app__toolbar">
          <span className="app__title">Portfolio editor</span>
        </header>
        <form onSubmit={handleSignIn}>
          <h1>Sign in to edit</h1>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && <p role="alert">{error}</p>}
          <button type="submit" disabled={isSigningIn}>
            {isSigningIn ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </main>
    );
  }

  if (isContentLoading || !data) {
    return <div className="app__toolbar">Loading portfolio…</div>;
  }

  if (mode === "preview") {
    return (
      <div className="app">
        <header className="app__toolbar">
          <span className="app__title">Portfolio Prototype</span>
          <div>
            <button className="app__toggle" onClick={() => setMode("edit")}>
              ← Back to editing
            </button>
            <button
              className="app__toggle"
              onClick={() => void handleSignOut()}
            >
              Sign out
            </button>
          </div>
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
        onChange={handleChange}
        onPublish={handlePublish}
        overrides={{
          headerActions: ({ children }) => (
            <>
              {children}
              {saveStatus !== "idle" && <span>{saveStatus}</span>}
              <button
                className="app__toggle"
                onClick={() => setMode("preview")}
              >
                Preview page →
              </button>
              <button
                className="app__toggle"
                onClick={() => void handleSignOut()}
              >
                Sign out
              </button>
            </>
          ),
        }}
      />
    </div>
  );
}

export default App;
