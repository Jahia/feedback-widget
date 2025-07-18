import {
  AddResources,
  buildModuleFileUrl,
  jahiaComponent,
  RenderInBrowser,
} from "@jahia/javascript-modules-library";
import Widget from "./Wigdet.client.jsx";

export interface Props {
  "jcr:title": string;
  "yes": string;
  "no": string;
  "happy": string;
  "sad": string;
  "send": string;
  "sending": string;
  "sent": string;
  "error": string;
}

jahiaComponent(
  {
    nodeType: "feedbackWidget:widget",
    componentType: "view",
  },
  (
    { "jcr:title": title, yes, no, happy, sad, send, sending, sent, error }: Props,
    { renderContext },
  ) =>
    renderContext.isEditMode() ? (
      <div style={{ border: "1px solid #ccc", padding: ".25em", borderRadius: ".25em" }}>
        The feedback widget is not available in edit mode.
      </div>
    ) : (
      <>
        <RenderInBrowser
          child={Widget}
          props={{ "jcr:title": title, yes, no, happy, sad, send, sending, sent, error }}
        />
        <AddResources type="css" resources={buildModuleFileUrl("dist/assets/style.css")} />
      </>
    ),
);
