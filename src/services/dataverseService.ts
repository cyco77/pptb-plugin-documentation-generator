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
  let url = `sdkmessageprocessingsteps?$select=filteringattributes,mode,name,rank,stage&$expand=eventhandler_plugintype($select=name,typename),sdkmessageid($select=name)&$filter=(eventhandler_plugintype/_pluginassemblyid_value eq ${pluginAssemblyId}) and (sdkmessageid/sdkmessageid ne null)`;

  const allRecords = await loadAllData(url);

  return mapPluginAssemblySteps(allRecords);
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
