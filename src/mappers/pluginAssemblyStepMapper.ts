import { PluginAssemblyStep } from "../types/pluginAssemblyStep";

export const mapPluginAssemblySteps = (
  rawData: Record<string, unknown>[]
): PluginAssemblyStep[] => {
  const results: PluginAssemblyStep[] = [];
  rawData.forEach((item) => {
    const name = item["name"] as string;
    const id = item["sdkmessageprocessingstepid"] as string;
    const mode = item["mode"] as number;
    const rank = item["rank"] as number;
    const stage = item["stage"] as number;
    const filteringattributes = (item["filteringattributes"] as string) || "";
    const sdkMessage = item["sdkmessageid"] as Record<string, unknown> | null;
    const eventHandler = item["eventhandler_plugintype"] as Record<
      string,
      unknown
    > | null;

    results.push({
      id: id,
      name: name,
      mode: mapMode(mode),
      rank: rank,
      stage: mapState(stage),
      filteringattributes: filteringattributes,
      sdkMessage: sdkMessage ? (sdkMessage["name"] as string) : "",
      eventHandler: eventHandler ? (eventHandler["name"] as string) : "",
    });
  });

  return results;
};

const mapMode = (modeValue: number): string => {
  switch (modeValue) {
    case 0:
      return "Synchronous";
    case 1:
      return "Asynchronous";
    default:
      return "Unknown";
  }
};

const mapState = (stateValue: number): string => {
  switch (stateValue) {
    case 10:
      return "Pre-validation";
    case 15:
      return "Internal Pre-validation";
    case 20:
      return "Pre-operation";
    case 25:
      return "Internal Pre-operation";
    case 30:
      return " Pre-operation";
    case 35:
      return "Internal Post-operation";
    case 40:
      return "Post-operation";
    default:
      return stateValue.toString();
  }
};
