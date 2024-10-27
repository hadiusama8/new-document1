
// "use client";
// import React from "react";
// import "@univerjs/design/lib/index.css";
// import "@univerjs/ui/lib/index.css";
// import "@univerjs/docs-ui/lib/index.css";
 
// import { LocaleType, Tools, Univer, UniverInstanceType } from "@univerjs/core";
// import { defaultTheme } from "@univerjs/design";
// import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
// import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
 
// import { UniverUIPlugin } from "@univerjs/ui";
 
// import { UniverDocsPlugin } from "@univerjs/docs";
// import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
// import '@univerjs/docs-hyper-link-ui/lib/index.css';
 
// import { UniverDocsHyperLinkPlugin } from '@univerjs/docs-hyper-link';
// import { UniverDocsHyperLinkUIPlugin } from '@univerjs/docs-hyper-link-ui';
// import DesignEnUS from '@univerjs/design/locale/en-US';
// import DocsUIEnUS from '@univerjs/docs-ui/locale/en-US';
// import DrawingUIEnUS from '@univerjs/drawing-ui/locale/en-US';
// import DocsDrawingUIEnUS from '@univerjs/docs-drawing-ui/locale/en-US';
// import DocsHyperLinkUIEnUS from '@univerjs/docs-hyper-link-ui/locale/en-US';
 

// import '@univerjs/sheets-hyper-link-ui/lib/index.css';
 
// import UIEnUS from '@univerjs/ui/locale/en-US';

// import { UniverDrawingPlugin } from '@univerjs/drawing'; 
// import { UniverDrawingUIPlugin } from '@univerjs/drawing-ui'; // UI components for drawing
// import { UniverDocsDrawingPlugin } from '@univerjs/docs-drawing'; // For integrating drawing with documents
// import { UniverDocsDrawingUIPlugin } from '@univerjs/docs-drawing-ui'; // UI for drawing in documents


// const UniverEditor = () => {
//   React.useEffect(() => {
//     const univer = new Univer({
//       theme: defaultTheme,
//       locale: LocaleType.EN_US,
//       locales: {
//         [LocaleType.EN_US]: Tools.deepMerge(
//           DesignEnUS,
//           DocsUIEnUS,
//           UIEnUS,
//           DrawingUIEnUS,
//           DocsDrawingUIEnUS,
//           DocsHyperLinkUIEnUS
//         ),
//       },
//     });

//     univer.registerPlugin(UniverRenderEnginePlugin);
//     univer.registerPlugin(UniverFormulaEnginePlugin);
//     univer.registerPlugin(UniverUIPlugin, {
//       container: 'app',
//       footer: false,
//     });
//     univer.registerPlugin(UniverDocsPlugin);
//     univer.registerPlugin(UniverDocsUIPlugin, {
//       container: 'univerdoc',
//       layout: {
//         docContainerConfig: {
//          innerLeft: false,
//         },
//       },
//     });

//     univer.registerPlugin(UniverDrawingPlugin);
//  univer.registerPlugin(UniverDrawingUIPlugin);
//  univer.registerPlugin(UniverDocsDrawingPlugin);
//  univer.registerPlugin(UniverDocsDrawingUIPlugin, {
//     container: 'draw',
      
//  });
//  univer.registerPlugin(UniverDocsHyperLinkPlugin);
// univer.registerPlugin(UniverDocsHyperLinkUIPlugin);


 
//     univer.createUnit(UniverInstanceType.UNIVER_DOC, {});

//     //univer.init(); // Initialize Univer
//   }, []);

//   return (
//     <div className="w-full  flex flex-col">
//       <div id="app" className="w-full h-screen" ></div>
//       <div id="univerdoc" className="w-full h-screen "></div>
//       <div id="draw" ></div>
//     </div>
//   );
// };

// export default UniverEditor;
