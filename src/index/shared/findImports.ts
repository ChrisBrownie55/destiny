import fs from "fs";

/** Find all imports for file path. */
export function findImports(filePath: string) {
  // match es5 & es6 imports
  const _reImport = `(?:(?:import|from)\\s+|(?:import|require)\\s*\\()['"]((?:\\.{1,2})(?:\\/.+)?)['"]`;
  const reImport = new RegExp(_reImport, "gm");
  // match one & multi line(s) comments
  const reComment = /\/\*[\s\S]*?\*\/|\/\/.*/gm;
  // match string which contain an import https://github.com/benawad/destiny/issues/111
  const reOneLineString = new RegExp(`["'].*(${_reImport}).*["']`, "g");
  // match multi lines string which contain an import https://github.com/benawad/destiny/issues/111
  const reMultiLinesString = new RegExp(`\`[^]*(${_reImport})[^]*\``, "gm");

  const importPaths: string[] = [];
  const fileContent = fs
    .readFileSync(filePath, { encoding: "utf8" })
    .replace(reComment, "")
    .replace(reOneLineString, "")
    .replace(reMultiLinesString, "");

  let matches;
  while ((matches = reImport.exec(fileContent)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches.
    if (matches.index === reImport.lastIndex) {
      reImport.lastIndex++;
    }
    importPaths.push(matches[1]);
  }

  return importPaths;
}
