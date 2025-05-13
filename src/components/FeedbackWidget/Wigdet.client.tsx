import { useCallback, useState } from "react";
import classes from "./component.module.css";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace wem {
  type Properties = Record<string, unknown>;

  interface Item {
    scope: string;
    itemId: string;
    itemType: string;
    properties: Properties;
  }

  interface Event {
    eventType: string;
    scope: string;
    source: Item;
    target: Item;
  }

  interface Events {
    events: Event[];
  }

  function buildSource(id: string, type: string, properties?: Properties): Item;
  function buildTarget(id: string, type: string, properties?: Properties): Item;
  function buildSourcePage(): Item;
  function buildTargetPage(): Item;
  function buildEvent(type: string, target: Item, source: Item): Event;
  function collectEvents(
    events: Events,
    successCallback?: () => void,
    errorCallback?: () => void,
  ): void;
}

export default function Widget() {
  const [happy, setHappy] = useState<boolean>();

  const handler = (value: boolean) =>
    useCallback(() => {
      if (happy === value) return;
      const source = wem.buildSourcePage();
      const target = wem.buildTarget("click", "feedback", { happy: value });
      const newEvent = wem.buildEvent("click", target, source);
      wem.collectEvents({ events: [newEvent] });
      setHappy(value);
    }, [happy]);

  return (
    <aside>
      <h3>Was this helpful?</h3>
      <button type="button" onClick={handler(true)}>
        Yes
      </button>
      <button type="button" onClick={handler(false)}>
        No
      </button>
      {happy !== undefined && (
        <div className={classes.feedback}>
          {happy ? (
            <p className={classes.happy}>Glad to hear that!</p>
          ) : (
            <p className={classes.sad}>Sorry to hear that!</p>
          )}
          <button type="button" className={classes.close} onClick={() => setHappy(undefined)}>
            Close
          </button>
        </div>
      )}
    </aside>
  );
}
