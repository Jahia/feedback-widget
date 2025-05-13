import {
  AddResources,
  buildModuleFileUrl,
  jahiaComponent,
  RenderInBrowser,
} from "@jahia/javascript-modules-library";
import Widget from "./Wigdet.client.jsx";

jahiaComponent(
  {
    nodeType: "feedbackWidget:widget",
    componentType: "view",
  },
  () => (
    <>
      <RenderInBrowser child={Widget} />
      <AddResources type="css" resources={buildModuleFileUrl("dist/server/style.css")} />
    </>
  ),
);
