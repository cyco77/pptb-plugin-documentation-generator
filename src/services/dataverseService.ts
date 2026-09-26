import { mapPluginAssemblies } from "../mappers/pluginAssemblyMapper";
import { mapPluginAssemblySteps } from "../mappers/pluginAssemblyStepMapper";
import { PluginAssembly } from "../types/pluginAssembly";
import { logger } from "./loggerService";

export const loadPluginAssemblies = async (): Promise<PluginAssembly[]> => {
  let url = "/pluginassemblies?$select=name,pluginassemblyid,version";

  const allRecords = await loadAllData(url);

  return mapPluginAssemblies(allRecords);
};

export const loadPluginSdkSteps = async (pluginAssemblyId: string) => {
  const url = `sdkmessageprocessingsteps?$select=sdkmessageprocessingstepid,configuration,filteringattributes,mode,name,rank,stage&$expand=eventhandler_plugintype($select=name,typename),sdkmessageid($select=name),sdkmessagefilterid($select=name,primaryobjecttypecode),sdkmessageprocessingstepsecureconfigid($select=secureconfig)&$filter=(eventhandler_plugintype/_pluginassemblyid_value eq ${pluginAssemblyId}) and (sdkmessageid/sdkmessageid ne null)`;

  const allRecords = await loadAllData(url);
  const imagesByStep = new Map<string, Record<string, unknown>[]>();
  const stepIds = allRecords
    .map((step) => step["sdkmessageprocessingstepid"] as string)
    .filter(Boolean);

  for (let index = 0; index < stepIds.length; index += 25) {
    const stepIdBatch = stepIds.slice(index, index + 25);
    const imageFilter = stepIdBatch
      .map((id) => `_sdkmessageprocessingstepid_value eq ${id}`)
      .join(" or ");
    const imageRecords = await loadAllData(
      `sdkmessageprocessingstepimages?$select=sdkmessageprocessingstepimageid,_sdkmessageprocessingstepid_value,name,entityalias,imagetype,messagepropertyname,attributes&$filter=${imageFilter}`
    );

    imageRecords.forEach((image) => {
      const stepId = image["_sdkmessageprocessingstepid_value"] as string;
      const stepImages = imagesByStep.get(stepId) || [];
      stepImages.push(image);
      imagesByStep.set(stepId, stepImages);
    });
  }

  const recordsWithImages = allRecords.map((step) => {
    const stepId = step["sdkmessageprocessingstepid"] as string;
    const stepImages = (imagesByStep.get(stepId) || []).map((image) => ({
      id: image["sdkmessageprocessingstepimageid"] as string,
      name: (image["name"] as string) || "",
      entityAlias: (image["entityalias"] as string) || "",
      imageType:
        (image[
          "imagetype@OData.Community.Display.V1.FormattedValue"
        ] as string) || "",
      messagePropertyName: (image["messagepropertyname"] as string) || "",
      attributes: (image["attributes"] as string) || "",
    }));

    return { ...step, stepImages };
  });

  return mapPluginAssemblySteps(recordsWithImages);
};

const loadAllData = async (fullUrl: string) => {
  const allRecords = [];

  while (fullUrl) {
    logger.info(`Fetching data from URL: ${fullUrl}`);

    let relativePath = fullUrl;

    if (fullUrl.startsWith("http")) {
      const url = new URL(fullUrl);
      const apiRegex = /^\/api\/data\/v\d+\.\d+\//;
      relativePath = url.pathname.replace(apiRegex, "") + url.search;
    }

    logger.info(`Cleaned URL: ${relativePath}`);

    const response = await window.dataverseAPI.queryData(relativePath);

    // Add the current page of results
    allRecords.push(...response.value);

    // Check for paging link
    fullUrl = (response as any)["@odata.nextLink"] || null;
  }

  return allRecords;
};
