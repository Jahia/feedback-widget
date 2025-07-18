import { useState } from "react";
import classes from "./component.module.css";
import type { Props } from "./default.server.jsx";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace wem {
  interface Item {
    scope: string;
    itemId: string;
    itemType: string;
    properties: Record<string, unknown>;
  }

  interface Event {
    eventType: string;
    scope: string;
    source: Item;
    target: Item;
  }

  function buildSource(id: string, type: string, properties?: Record<string, unknown>): Item;
  function buildTarget(id: string, type: string, properties?: Record<string, unknown>): Item;
  function buildSourcePage(): Item;
  function buildTargetPage(): Item;
  function buildEvent(type: string, target: Item, source: Item): Event;
  function collectEvents(
    events: { events: Event[] },
    successCallback?: () => void,
    errorCallback?: () => void,
  ): void;
}

export default function Widget(t: Props) {
  const [happy, setHappy] = useState<boolean>();
  const [state, setState] = useState<"sending" | "sent" | "error">();

  const handler = (happy: boolean) => () => {
    const source = wem.buildSourcePage();
    const target = wem.buildTarget("click", "feedback", { happy });
    wem.collectEvents({ events: [wem.buildEvent("click", target, source)] });
    setHappy(happy);
  };

  // Hide the widget if the jExperience is not loaded
  if (!("wem" in window)) {
    console.error("window.wem is not defined. Ensure jExperience is loaded for the site.");
    return;
  }

  // Also hide if consent was not given
  // @ts-expect-error window.digitalData is not typed
  if (!("digitalData" in window) || !window.digitalData?.wemInitConfig?.activateWem) {
    console.warn("Consent not given, feedback widget will not be displayed.");
    return;
  }

  return (
    <aside className={classes.card} data-interacted={happy !== undefined}>
      <div inert={happy !== undefined} className={classes.buttons}>
        {t["jcr:title"]}
        <span style={{ display: "flex", gap: "0.25em" }}>
          <button
            type="button"
            className={classes.input}
            onClick={handler(true)}
            style={happy === false ? { opacity: 0.5 } : {}}
          >
            {t.yes}
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3C!-- Icon from Prime Icons by PrimeTek - https://github.com/primefaces/primeicons/blob/master/LICENSE --%3E%3Cpath d='M20.22 9.55c-.43-.51-1.05-.8-1.72-.8h-4.03V6c0-1.52-1.23-2.75-2.83-2.75c-.7 0-1.33.42-1.61 1.07l-2.54 5.93H5.62c-1.31 0-2.37 1.06-2.37 2.37v5.77c0 1.3 1.07 2.36 2.37 2.36h11.56c1.09 0 2.02-.78 2.21-1.86l1.32-7.5c.11-.66-.07-1.33-.5-1.84Zm-14.6 9.7c-.48 0-.87-.39-.87-.86v-5.77c0-.48.39-.87.87-.87h1.61v7.5zm12.3-.62c-.06.36-.37.62-.74.62H8.74v-8.1l2.67-6.25c.04-.09.13-.16.32-.16c.69 0 1.24.56 1.24 1.25v4.25h5.53c.23 0 .43.09.57.26s.2.39.16.62l-1.32 7.5Z'/%3E%3C/svg%3E"
              alt=""
            />
          </button>
          <button
            type="button"
            className={classes.input}
            onClick={handler(false)}
            style={happy === true ? { opacity: 0.5 } : {}}
          >
            {t.no}
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3C!-- Icon from Prime Icons by PrimeTek - https://github.com/primefaces/primeicons/blob/master/LICENSE --%3E%3Cpath d='M18.38 3.25H6.81c-1.09 0-2.02.78-2.21 1.86l-1.31 7.5c-.11.66.07 1.33.49 1.84c.43.51 1.05.8 1.72.8h4.03V18c0 1.52 1.23 2.75 2.83 2.75c.7 0 1.33-.42 1.61-1.07l2.54-5.93h1.88c1.31 0 2.37-1.06 2.37-2.37V5.61c0-1.3-1.06-2.36-2.37-2.36Zm-3.12 9.6l-2.67 6.25c-.04.09-.13.16-.32.16c-.69 0-1.24-.56-1.24-1.25v-4.25H5.5c-.23 0-.43-.09-.57-.26a.72.72 0 0 1-.16-.62l1.31-7.5c.06-.36.37-.62.74-.62h8.44zm3.99-1.47c0 .48-.39.87-.87.87h-1.61v-7.5h1.61c.48 0 .87.39.87.86z'/%3E%3C/svg%3E"
              alt=""
            />
          </button>
        </span>
      </div>
      {happy !== undefined && (
        <form
          className={classes.form}
          onSubmit={(event) => {
            if (state !== undefined) return;

            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const comment = data.get("comment");

            if (!comment) {
              setState("sent");
              return;
            }

            const source = wem.buildSourcePage();
            const target = wem.buildTarget("comment", "feedback", { happy, comment });

            // If the request takes too long, we assume an error
            const timeout = setTimeout(() => {
              setState("error");
            }, 5000);

            setState("sending");
            wem.collectEvents(
              { events: [wem.buildEvent("click", target, source)] },
              () => {
                clearTimeout(timeout);
                setState("sent");
              },
              () => {
                setState("error");
              },
            );
          }}
        >
          <label className={classes.label}>
            {happy ? t.happy : t.sad}
            <textarea
              autoFocus
              name="comment"
              readOnly={state !== undefined}
              className={classes.input}
              style={{ width: "100%" }}
            />
          </label>
          <div className={classes.submit}>
            <button type="submit" className={classes.input} disabled={state !== undefined}>
              {t.send}
            </button>
            {state === "sending" && (
              <span aria-label={t.sending} className={classes.spinner}></span>
            )}
            {state === "sent" && <span>{t.sent}</span>}
            {state === "error" && <span>{t.error}</span>}
          </div>
        </form>
      )}
    </aside>
  );
}
