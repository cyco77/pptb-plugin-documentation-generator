import { PluginAssembly } from "../types/pluginAssembly";

export const mapPluginAssemblies = (
  rawData: Record<string, unknown>[]
): PluginAssembly[] => {
  const results: PluginAssembly[] = [];

  rawData.forEach((item) => {
    const id = item["pluginassemblyid"];
    const name = item["name"];
    const version = item["version"];

    // Validate and cast
    if (
      typeof id === "string" &&
      typeof name === "string" &&
      typeof version === "string"
    ) {
      results.push({ pluginassemblyid: id, name, version });
    }
  });

  return results;
};
