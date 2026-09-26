import React, { useState, useCallback, useEffect } from "react";
import {
  loadPluginAssemblies,
  loadPluginSdkSteps,
} from "../services/dataverseService";
import { PluginAssembly } from "../types/pluginAssembly";
import { PluginAssemblyStep } from "../types/pluginAssemblyStep";
import { Filter } from "./Filter";
import { AssemblySteps } from "./AssemblySteps";
import {
  exportPluginAssemblyStepsToCSV,
  exportPluginAssemblyStepsToMarkdown,
  copyPluginAssemblyStepsAsCSV,
  copyPluginAssemblyStepsAsMarkdown,
} from "../utils/exportUtils";
import {
  makeStyles,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner,
} from "@fluentui/react-components";
import {
  ArrowDownload24Regular,
  Copy24Regular,
  DocumentTable24Regular,
} from "@fluentui/react-icons";
import { logger } from "../services/loggerService";

interface IOverviewProps {
  connection: ToolBoxAPI.DataverseConnection | null;
}

export const Overview: React.FC<IOverviewProps> = ({ connection }) => {
  const [pluginAssemblies, setPluginAssemblies] = useState<PluginAssembly[]>(
    []
  );
  const [pluginAssemblySteps, setPluginAssemblySteps] = useState<
    PluginAssemblyStep[]
  >([]);
  const [filter, setFilter] = useState<PluginAssembly | undefined>(undefined);
  const [textFilter, setTextFilter] = useState<string>("");
  const [stepsView, setStepsView] = useState<"list" | "tree">("list");
  const [expandAllRequest, setExpandAllRequest] = useState(0);
  const [collapseAllRequest, setCollapseAllRequest] = useState(0);
  const [isLoadingSteps, setIsLoadingSteps] = useState(false);
  const [isLoadingAssemblies, setIsLoadingAssemblies] = useState(false);

  const useStyles = makeStyles({
    overviewRoot: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      overflow: "hidden",
    },
    filterSection: {
      flexShrink: 0,
    },
    filterContainer: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: "12px",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px",
    },
    stepsSection: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      minHeight: 0,
      minWidth: 0,
    },
  });

  const styles = useStyles();

  useEffect(() => {
    const initialize = async () => {
      if (!connection) {
        return;
      }
      //querySdkSteps();
      queryPluginAssemblies();
    };

    initialize();
  }, [connection]);

  useEffect(() => {
    querySdkSteps();
  }, [filter]);

  const showNotification = useCallback(
    async (
      title: string,
      body: string,
      type: "success" | "info" | "warning" | "error"
    ) => {
      try {
        await window.toolboxAPI.utils.showNotification({
          title,
          body,
          type,
          duration: 3000,
        });
      } catch (error) {
        console.error("Error showing notification:", error);
      }
    },
    []
  );

  const querySdkSteps = useCallback(async () => {
    try {
      if (!filter) {
        setPluginAssemblySteps([]);
        setIsLoadingSteps(false);
        return;
      }
      setIsLoadingSteps(true);
      const pluginSdkSteps = await loadPluginSdkSteps(filter.pluginassemblyid);
      setPluginAssemblySteps(pluginSdkSteps);
      logger.info(`Fetched ${pluginSdkSteps.length} sdk-steps`);
    } catch (error) {
      logger.error(`Error querying sdk-steps: ${(error as Error).message}`);
    } finally {
      setIsLoadingSteps(false);
    }
  }, [connection, showNotification, filter]);

  const queryPluginAssemblies = useCallback(async () => {
    try {
      setIsLoadingAssemblies(true);
      const plugins = await loadPluginAssemblies();
      setPluginAssemblies(plugins);
      logger.info(`Fetched ${plugins.length} plugins`);
    } catch (error) {
      logger.error(`Error querying sdk-steps: ${(error as Error).message}`);
    } finally {
      setIsLoadingAssemblies(false);
    }
  }, [connection, showNotification]);

  const exportPluginAssemblySteps = useCallback(async () => {
    await exportPluginAssemblyStepsToCSV(
      pluginAssemblySteps,
      filter,
      showNotification
    );
  }, [pluginAssemblySteps, filter, showNotification]);

  const exportPluginAssemblyStepsAsMarkdown = useCallback(async () => {
    await exportPluginAssemblyStepsToMarkdown(
      pluginAssemblySteps,
      filter,
      showNotification
    );
  }, [pluginAssemblySteps, filter, showNotification]);

  const filteredPluginAssemblySteps = React.useMemo(() => {
    if (!textFilter) {
      return pluginAssemblySteps;
    }
    const searchTerm = textFilter.toLowerCase();
    return pluginAssemblySteps.filter((step) => {
      return (
        step.name?.toLowerCase().includes(searchTerm) ||
        step.sdkMessage?.toLowerCase().includes(searchTerm) ||
        step.mode?.toLowerCase().includes(searchTerm) ||
        step.stage?.toLowerCase().includes(searchTerm) ||
        step.rank?.toString().includes(searchTerm) ||
        step.eventHandler?.toLowerCase().includes(searchTerm) ||
        step.filteringattributes?.toLowerCase().includes(searchTerm) ||
        step.primaryobjecttypecodeDisplayname?.toLowerCase().includes(searchTerm) ||
        step.secureConfig?.toLowerCase().includes(searchTerm) ||
        step.unsecureConfig?.toLowerCase().includes(searchTerm) ||
        step.images?.some(
          (image) =>
            image.name.toLowerCase().includes(searchTerm) ||
            image.entityAlias.toLowerCase().includes(searchTerm) ||
            image.attributes.toLowerCase().includes(searchTerm)
        )
      );
    });
  }, [pluginAssemblySteps, textFilter]);

  const copyToClipboardAsCSV = useCallback(async () => {
    await copyPluginAssemblyStepsAsCSV(
      filteredPluginAssemblySteps,
      showNotification
    );
  }, [filteredPluginAssemblySteps, showNotification]);

  const copyToClipboardAsMarkdown = useCallback(async () => {
    await copyPluginAssemblyStepsAsMarkdown(
      filteredPluginAssemblySteps,
      showNotification
    );
  }, [filteredPluginAssemblySteps, showNotification]);

  return (
    <div className={styles.overviewRoot}>
      {isLoadingAssemblies ? (
        <div className={styles.loadingContainer}>
          <Spinner label="Loading plugin assemblies..." />
        </div>
      ) : (
        <div className={styles.filterSection}>
          <div className={styles.filterContainer}>
            <Filter
              pluginAssemblies={pluginAssemblies}
              onFilterChanged={(pluginAssemblyId: string | undefined) => {
                logger.info(`Filter changed to: ${pluginAssemblyId}`);

                const plugin = pluginAssemblies.find(
                  (pa) => pa.pluginassemblyid === pluginAssemblyId
                );

                setFilter(plugin);
              }}
              onTextFilterChanged={(searchText: string) => {
                setTextFilter(searchText);
              }}
              view={stepsView}
              onViewChange={setStepsView}
              onExpandAll={() => setExpandAllRequest((request) => request + 1)}
              onCollapseAll={() =>
                setCollapseAllRequest((request) => request + 1)
              }
            />
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <MenuButton
                  appearance="primary"
                  disabled={!filter || filteredPluginAssemblySteps.length === 0}
                  aria-label="Copy and export options"
                  menuIcon={null}
                >
                  ...
                </MenuButton>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem
                    icon={<Copy24Regular />}
                    onClick={copyToClipboardAsCSV}
                  >
                    Copy CSV
                  </MenuItem>
                  <MenuItem
                    icon={<DocumentTable24Regular />}
                    onClick={copyToClipboardAsMarkdown}
                  >
                    Copy Markdown
                  </MenuItem>
                  <MenuItem
                    icon={<ArrowDownload24Regular />}
                    disabled={pluginAssemblySteps.length === 0}
                    onClick={exportPluginAssemblySteps}
                  >
                    Export CSV
                  </MenuItem>
                  <MenuItem
                    icon={<DocumentTable24Regular />}
                    disabled={pluginAssemblySteps.length === 0}
                    onClick={exportPluginAssemblyStepsAsMarkdown}
                  >
                    Export Markdown
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        </div>
      )}

      {isLoadingSteps ? (
        <div className={styles.loadingContainer}>
          <Spinner label="Loading plugin assembly steps..." />
        </div>
      ) : (
        pluginAssemblySteps.length > 0 && (
          <div className={styles.stepsSection}>
            <AssemblySteps
              items={filteredPluginAssemblySteps}
              view={stepsView}
              expandAllRequest={expandAllRequest}
              collapseAllRequest={collapseAllRequest}
            />
          </div>
        )
      )}
    </div>
  );
};
