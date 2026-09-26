import {
  PluginAssemblyStep,
  PluginAssemblyStepImage,
} from "../types/pluginAssemblyStep";

export const mapPluginAssemblySteps = (
  rawData: Record<string, unknown>[]
): PluginAssemblyStep[] => {
  const results: PluginAssemblyStep[] = [];
  rawData.forEach((item) => {
    const name = item["name"] as string;
    const id = item["sdkmessageprocessingstepid"] as string;
    const mode =
      (item["mode@OData.Community.Display.V1.FormattedValue"] as string) || "";
    const rank = item["rank"] as number;
    const stage =
      (item["stage@OData.Community.Display.V1.FormattedValue"] as string) || "";
    const filteringattributes = (item["filteringattributes"] as string) || "";
    const sdkMessage = item["sdkmessageid"] as Record<string, unknown> | null;
    const eventHandler = item["eventhandler_plugintype"] as Record<
      string,
      unknown
    > | null;
    const sdkmessagefilter = item["sdkmessagefilterid"] as Record<
      string,
      unknown
    > | null;
    const secureConfiguration = item[
      "sdkmessageprocessingstepsecureconfigid"
    ] as Record<string, unknown> | null;
    const images = (item["stepImages"] as PluginAssemblyStepImage[]) || [];

    results.push({
      id: id,
      name: name || "",
      mode: mode,
      rank: rank,
      stage: stage,
      filteringattributes: filteringattributes,
      sdkMessage: sdkMessage ? (sdkMessage["name"] as string) : "",
      primaryobjecttypecode: sdkmessagefilter
        ? (sdkmessagefilter["primaryobjecttypecode"] as string)
        : "",
      primaryobjecttypecodeDisplayname: sdkmessagefilter
        ? ((sdkmessagefilter[
            "primaryobjecttypecode@OData.Community.Display.V1.FormattedValue"
          ] as string) || "")
        : "",
      eventHandler: eventHandler ? (eventHandler["name"] as string) : "",
      secureConfig: secureConfiguration
        ? (secureConfiguration["secureconfig"] as string) || ""
        : "",
      unsecureConfig: (item["configuration"] as string) || "",
      images,
    });
  });

  return results;
};
