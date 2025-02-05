import path from "path";
import * as fs from "fs";

export interface PoolConfig {
  RPCProviderUrl: string;
}

export function loadConfig(file?: string): PoolConfig {
  let customJson = {};
  const configFile = file || path.join(process.cwd(), "Pool.config.js");
  try {
    customJson = require(configFile);
  } catch (e) {
    if (fs.existsSync(configFile)) {
      throw new Error(`Cannot read Pool JSON: ${configFile}: ${e}`);
    }
  }
  const defaultJson = require(path.join(
    __dirname,
    "..",
    "..",
    "Pool.config.js"
  ));
  const merged = mergeDeep(defaultJson, customJson);

  return {
    ...merged,
  };
}

export function mergeDeep(target: any, source: any) {
  const isObject = (obj: any) => obj && typeof obj === "object";

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = sourceValue; // Always use source key, if given
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });

  return target;
}
