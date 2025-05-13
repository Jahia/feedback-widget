import { useCallback, useState } from "react";
import classes from "./component.module.css";
import { useTranslation as useT } from "react-i18next"; // Make the vscode extension happy

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

export default function Widget() {
  const [happy, setHappy] = useState<boolean>();
  const [state, setState] = useState<"sending" | "sent">();

  const { t } = useT("feedback-widget");

  const handler = (happy: boolean) =>
    useCallback(() => {
      const source = wem.buildSourcePage();
      const target = wem.buildTarget("click", "feedback", { happy });
      wem.collectEvents({ events: [wem.buildEvent("click", target, source)] });
      setHappy(happy);
    }, []);

  return (
    <aside className={classes.card}>
      <div inert={happy !== undefined} className={classes.buttons}>
        {t("e8YBCRcMqxPeIzrSCE2SZ")}
        <button type="button" className={classes.input} onClick={handler(true)}>
          {t("sXVG2hExuwfFlejOPijT0")}
        </button>
        <button type="button" className={classes.input} onClick={handler(false)}>
          {t("YRkfbP0aWFxjLZZyV5V8Q")}
        </button>
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
            setState("sending");
            wem.collectEvents({ events: [wem.buildEvent("click", target, source)] }, () => {
              setState("sent");
            });
          }}
        >
          <label className={classes.label}>
            {happy ? t("fnJQRxmjVi1lk7KCH9CMW") : t("Mp-3D66q_s9pYf6vEvSi_")}
            <textarea
              name="comment"
              readOnly={state !== undefined}
              className={classes.input}
              style={{ width: "100%" }}
            />
          </label>
          <div className={classes.submit}>
            <button type="submit" className={classes.input} disabled={state !== undefined}>
              {t("zS9_INlrschFjnnywiIrI")}
            </button>
            {state === "sending" && (
              <span aria-label={t("WJL_PlnllYZoK4DY72LCA")} className={classes.spinner}></span>
            )}
            {state === "sent" && <span>{t("WvOu13wykUW2XlplY4nwZ")}</span>}
          </div>
        </form>
      )}
    </aside>
  );
}
