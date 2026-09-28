import { $ } from "bun";

const rootDir = new URL("..", import.meta.url).pathname;
const distDir = `${rootDir}dist`;

const rootPackageJson = await Bun.file(`${rootDir}package.json`).json();

await $`rm -rf ${distDir}`;

const result = await Bun.build({
  entrypoints: [`${rootDir}src/index.ts`],
  outdir: distDir,
  target: "node",
  format: "esm",
  sourcemap: "external",
  external: [
    ...Object.keys(rootPackageJson.peerDependencies ?? {}),
    ...Object.keys(rootPackageJson.dependencies ?? {}),
  ],
});

if (!result.success) {
  for (const message of result.logs) console.error(message);
  throw new Error("bun build failed");
}

await $`bunx tsc -p tsconfig.build.json`.cwd(rootDir);

const distPackageJson = {
  name: rootPackageJson.name,
  version: rootPackageJson.version,
  description: rootPackageJson.description,
  license: rootPackageJson.license,
  author: rootPackageJson.author,
  repository: rootPackageJson.repository,
  keywords: rootPackageJson.keywords,
  type: rootPackageJson.type,
  main: "index.js",
  module: "index.js",
  types: "index.d.ts",
  exports: {
    ".": {
      types: "./index.d.ts",
      import: "./index.js",
    },
  },
  dependencies: rootPackageJson.dependencies,
  peerDependencies: rootPackageJson.peerDependencies,
  peerDependenciesMeta: rootPackageJson.peerDependenciesMeta,
  engines: rootPackageJson.engines,
};

for (const key of Object.keys(distPackageJson)) {
  if (distPackageJson[key as keyof typeof distPackageJson] === undefined) {
    delete distPackageJson[key as keyof typeof distPackageJson];
  }
}

await Bun.write(`${distDir}/package.json`, `${JSON.stringify(distPackageJson, null, 2)}\n`);

console.log(`built dist/ for ${distPackageJson.name}@${distPackageJson.version ?? "0.0.0"}`);
