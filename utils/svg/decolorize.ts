import { optimize } from "svgo";

export const decolorize = (content: string) =>
  optimize(content, {
    plugins: [
      {
        name: "removeAttrs",
        params: {
          attrs: ["fill"],
        },
      },
    ],
  }).data;
