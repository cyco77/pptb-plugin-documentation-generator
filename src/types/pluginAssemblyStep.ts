export type PluginAssemblyStep = {
  id: string;
  name: string;
  mode: string;
  rank: number;
  stage: string;
  filteringattributes: string;
  sdkMessage: string;
  eventHandler: string;
  primaryobjecttypecode: string;
  primaryobjecttypecodeDisplayname: string;
  secureConfig: string;
  unsecureConfig: string;
  images: PluginAssemblyStepImage[];
};

export type PluginAssemblyStepImage = {
  id: string;
  name: string;
  entityAlias: string;
  imageType: string;
  messagePropertyName: string;
  attributes: string;
};
