import fs from "fs";
import path from "path";

const getDirectories = (srcPath) =>
  fs
    .readdirSync(srcPath)
    .filter((file) => fs.statSync(path.join(srcPath, file)).isDirectory());

console.log(getDirectories("./src/pages/posts/"));
