import { Config } from "bili";

const config: Config = {
  input: "lib/index.ts",
  babel: {
    minimal: true,
  },
  output: {
    fileName: "bloc-state-react.[format].js",
    format: ["esm", "cjs-min"],
    sourceMap: true,
    moduleName: "bloc-state-react",
  },
  globals: {
    rxjs: "rxjs",
    "rxjs/operators": "rxjs.operators",
  },
  externals: ["rxjs", "rxjs/operators"],
};

export default config;
