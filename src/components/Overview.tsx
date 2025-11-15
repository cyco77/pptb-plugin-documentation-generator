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
  copyPluginAssemblyStepsAsCSV,
  copyPluginAssemblyStepsAsMarkdown,
} from "../utils/exportUtils";
import {
  Divider,
  Button,
  makeStyles,
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
  const [isLoadingSteps, setIsLoadingSteps] = useState(false);
  const [isLoadingAssemblies, setIsLoadingAssemblies] = useState(false);

  const useStyles = makeStyles({
    filterContainer: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: "12px",
    },
    buttonGroup: {
      display: "flex",
      gap: "8px",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px",
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
        step.filteringattributes?.toLowerCase().includes(searchTerm)
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
    <>
      {isLoadingAssemblies ? (
        <div className={styles.loadingContainer}>
          <Spinner label="Loading plugin assemblies..." />
        </div>
      ) : (
        <div className="card">
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
            />
            <div className={styles.buttonGroup}>
              <Button
                appearance="secondary"
                icon={<Copy24Regular />}
                onClick={copyToClipboardAsCSV}
                disabled={!filter || filteredPluginAssemblySteps.length === 0}
              >
                Copy CSV
              </Button>
              <Button
                appearance="secondary"
                icon={<DocumentTable24Regular />}
                onClick={copyToClipboardAsMarkdown}
                disabled={!filter || filteredPluginAssemblySteps.length === 0}
              >
                Copy Markdown
              </Button>
              <Button
                appearance="primary"
                icon={<ArrowDownload24Regular />}
                onClick={exportPluginAssemblySteps}
                disabled={!filter || pluginAssemblySteps.length === 0}
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      )}

      <Divider />
      {isLoadingSteps ? (
        <div className={styles.loadingContainer}>
          <Spinner label="Loading plugin assembly steps..." />
        </div>
      ) : (
        pluginAssemblySteps.length > 0 && (
          <div className="card">
            <AssemblySteps items={filteredPluginAssemblySteps} />
          </div>
        )
      )}
    </>
  );
};
