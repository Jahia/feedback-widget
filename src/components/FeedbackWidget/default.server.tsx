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
  ({ "jcr:title": title, yes, no, happy, sad, send, sending, sent, error }: Props) => (
    <>
      <RenderInBrowser
        child={Widget}
        props={{ "jcr:title": title, yes, no, happy, sad, send, sending, sent, error }}
      />
      <AddResources type="css" resources={buildModuleFileUrl("dist/server/style.css")} />
    </>
  ),
);
