import { PluginAssembly } from "../types/pluginAssembly";
import { PluginAssemblyStep } from "../types/pluginAssemblyStep";
import { logger } from "../services/loggerService";

type ShowNotificationFn = (
  title: string,
  body: string,
  type: "success" | "info" | "warning" | "error"
) => Promise<void>;

/**
 * Exports plugin assembly steps to a CSV file
 */
export const exportPluginAssemblyStepsToCSV = async (
  steps: PluginAssemblyStep[],
  filter: PluginAssembly | undefined,
  showNotification?: ShowNotificationFn
): Promise<void> => {
  if (!steps || steps.length === 0) {
    logger.warning("No plugin assembly steps to export");
    return;
  }

  try {
    const csvContent = generateCSVContent(steps);
    const defaultFilename = `${filter?.name || "plugin"}_assembly_steps.csv`;

    await window.toolboxAPI.utils.saveFile(defaultFilename, csvContent);

    logger.success(`Exported ${steps.length} plugin assembly steps`);
    if (showNotification) {
      await showNotification(
        "Export Successful",
        `Exported ${steps.length} plugin assembly steps to ${defaultFilename}`,
        "success"
      );
    }
  } catch (error) {
    logger.error(`Error exporting data: ${(error as Error).message}`);
    if (showNotification) {
      await showNotification(
        "Export Failed",
        `Error exporting data: ${(error as Error).message}`,
        "error"
      );
    }
  }
};

/**
 * Copies plugin assembly steps to clipboard as CSV
 */
export const copyPluginAssemblyStepsAsCSV = async (
  steps: PluginAssemblyStep[],
  showNotification?: ShowNotificationFn
): Promise<void> => {
  if (!steps || steps.length === 0) {
    logger.warning("No plugin assembly steps to copy");
    return;
  }

  try {
    const csvContent = generateCSVContent(steps);

    await window.toolboxAPI.utils.copyToClipboard(csvContent);

    logger.success(
      `Copied ${steps.length} plugin assembly steps to clipboard (CSV)`
    );
    if (showNotification) {
      await showNotification(
        "Copy Successful",
        `Copied ${steps.length} plugin assembly steps to clipboard as CSV`,
        "success"
      );
    }
  } catch (error) {
    logger.error(`Error copying to clipboard: ${(error as Error).message}`);
    if (showNotification) {
      await showNotification(
        "Copy Failed",
        `Error copying to clipboard: ${(error as Error).message}`,
        "error"
      );
    }
  }
};

/**
 * Copies plugin assembly steps to clipboard as Markdown table
 */
export const copyPluginAssemblyStepsAsMarkdown = async (
  steps: PluginAssemblyStep[],
  showNotification?: ShowNotificationFn
): Promise<void> => {
  if (!steps || steps.length === 0) {
    logger.warning("No plugin assembly steps to copy");
    return;
  }

  try {
    const markdownContent = generateMarkdownContent(steps);

    await window.toolboxAPI.utils.copyToClipboard(markdownContent);

    logger.success(
      `Copied ${steps.length} plugin assembly steps to clipboard (Markdown)`
    );
    if (showNotification) {
      await showNotification(
        "Copy Successful",
        `Copied ${steps.length} plugin assembly steps to clipboard as Markdown`,
        "success"
      );
    }
  } catch (error) {
    logger.error(`Error copying to clipboard: ${(error as Error).message}`);
    if (showNotification) {
      await showNotification(
        "Copy Failed",
        `Error copying to clipboard: ${(error as Error).message}`,
        "error"
      );
    }
  }
};

/**
 * Generates CSV content from plugin assembly steps
 */
function generateCSVContent(steps: PluginAssemblyStep[]): string {
  const headers = [
    "Name",
    "Event Handler",
    "SDK Message",
    "Object Type Code",
    "Mode",
    "Stage",
    "Rank",
    "Filtering Attributes",
  ];
  const csvRows = [headers.join(",")];

  steps.forEach((step) => {
    const row = [
      `"${step.name.replace(/"/g, '""')}"`,
      `"${step.eventHandler.replace(/"/g, '""')}"`,
      `"${step.sdkMessage.replace(/"/g, '""')}"`,
      `"${step.primaryobjecttypecode.replace(/"/g, '""')}"`,
      `"${step.mode.replace(/"/g, '""')}"`,
      `"${step.stage.replace(/"/g, '""')}"`,
      `"${step.rank}"`,
      `"${step.filteringattributes.replace(/"/g, '""')}"`,
    ];
    csvRows.push(row.join(","));
  });

  return csvRows.join("\n");
}

/**
 * Generates Markdown table content from plugin assembly steps
 */
function generateMarkdownContent(steps: PluginAssemblyStep[]): string {
  const headers = [
    "Name",
    "Event Handler",
    "SDK Message",
    "Object Type Code",
    "Mode",
    "Stage",
    "Rank",
    "Filtering Attributes",
  ];

  // Create header row
  let markdown = `| ${headers.join(" | ")} |\n`;
  // Create separator row
  markdown += `| ${headers.map(() => "---").join(" | ")} |\n`;

  // Add data rows
  steps.forEach((step) => {
    const row = [
      step.name.replace(/\|/g, "\\|"),
      step.eventHandler.replace(/\|/g, "\\|"),
      step.sdkMessage.replace(/\|/g, "\\|"),
      step.primaryobjecttypecode.replace(/\|/g, "\\|"),
      step.mode.replace(/\|/g, "\\|"),
      step.stage.replace(/\|/g, "\\|"),
      step.rank.toString(),
      step.filteringattributes.replace(/\|/g, "\\|"),
    ];
    markdown += `| ${row.join(" | ")} |\n`;
  });

  return markdown;
}
