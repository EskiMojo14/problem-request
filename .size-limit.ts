import type { Check, SizeLimitConfig } from "size-limit";

const path = "dist/index.mjs";
const standardPath = "dist/standard.mjs";

const [fpd, fpdStandard] = await Promise.all([import(`./${path}`), import(`./${standardPath}`)]);

const checks: Array<Check> = [
  {
    name: "Full bundle",
    path,
    import: "*",
  },
  ...Object.entries(fpd).map(([name]) => ({
    name,
    path,
    import: `{ ${name} }`,
  })),
  {
    name: "Standard bundle",
    path: standardPath,
    import: "*",
  },
  ...Object.entries(fpdStandard).map(([name]) => ({
    name: `standardSchema.${name}`,
    path: standardPath,
    import: `{ ${name} }`,
  })),
];

export default checks satisfies SizeLimitConfig;
