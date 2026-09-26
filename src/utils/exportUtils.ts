import { PluginAssembly } from "../types/pluginAssembly";
import { PluginAssemblyStep } from "../types/pluginAssemblyStep";
import { logger } from "../services/loggerService";

type ShowNotificationFn = (
  title: string,
  body: string,
  type: "success" | "info" | "warning" | "error",
) => Promise<void>;

/**
 * Exports plugin assembly steps to a CSV file
 */
export const exportPluginAssemblyStepsToCSV = async (
  steps: PluginAssemblyStep[],
  filter: PluginAssembly | undefined,
  showNotification?: ShowNotificationFn,
): Promise<void> => {
  if (!steps || steps.length === 0) {
    logger.warning("No plugin assembly steps to export");
    return;
  }

  try {
    const csvContent = generateCSVContent(steps);
    const defaultFilename = `${filter?.name || "plugin"}_assembly_steps.csv`;

    await window.toolboxAPI.fileSystem.saveFile(defaultFilename, csvContent);

    logger.success(`Exported ${steps.length} plugin assembly steps`);
    if (showNotification) {
      await showNotification(
        "Export Successful",
        `Exported ${steps.length} plugin assembly steps to ${defaultFilename}`,
        "success",
      );
    }
  } catch (error) {
    logger.error(`Error exporting data: ${(error as Error).message}`);
    if (showNotification) {
      await showNotification(
        "Export Failed",
        `Error exporting data: ${(error as Error).message}`,
        "error",
      );
    }
  }
};

/**
 * Exports plugin assembly steps to a Markdown file
 */
export const exportPluginAssemblyStepsToMarkdown = async (
  steps: PluginAssemblyStep[],
  filter: PluginAssembly | undefined,
  showNotification?: ShowNotificationFn,
): Promise<void> => {
  if (!steps || steps.length === 0) {
    logger.warning("No plugin assembly steps to export");
    return;
  }

  try {
    const markdownContent = generateDocumentationMarkdown(steps, filter);
    const defaultFilename = `${filter?.name || "plugin"}_documentation.md`;

    await window.toolboxAPI.fileSystem.saveFile(defaultFilename, markdownContent);

    logger.success(`Exported ${steps.length} plugin assembly steps`);
    if (showNotification) {
      await showNotification(
        "Export Successful",
        `Exported ${steps.length} plugin assembly steps to ${defaultFilename}`,
        "success",
      );
    }
  } catch (error) {
    logger.error(`Error exporting data: ${(error as Error).message}`);
    if (showNotification) {
      await showNotification(
        "Export Failed",
        `Error exporting data: ${(error as Error).message}`,
        "error",
      );
    }
  }
};

/**
 * Copies plugin assembly steps to clipboard as CSV
 */
export const copyPluginAssemblyStepsAsCSV = async (
  steps: PluginAssemblyStep[],
  showNotification?: ShowNotificationFn,
): Promise<void> => {
  if (!steps || steps.length === 0) {
    logger.warning("No plugin assembly steps to copy");
    return;
  }

  try {
    const csvContent = generateCSVContent(steps);

    await window.toolboxAPI.utils.copyToClipboard(csvContent);

    logger.success(
      `Copied ${steps.length} plugin assembly steps to clipboard (CSV)`,
    );
    if (showNotification) {
      await showNotification(
        "Copy Successful",
        `Copied ${steps.length} plugin assembly steps to clipboard as CSV`,
        "success",
      );
    }
  } catch (error) {
    logger.error(`Error copying to clipboard: ${(error as Error).message}`);
    if (showNotification) {
      await showNotification(
        "Copy Failed",
        `Error copying to clipboard: ${(error as Error).message}`,
        "error",
      );
    }
  }
};

/**
 * Copies plugin assembly steps to clipboard as Markdown table
 */
export const copyPluginAssemblyStepsAsMarkdown = async (
  steps: PluginAssemblyStep[],
  showNotification?: ShowNotificationFn,
): Promise<void> => {
  if (!steps || steps.length === 0) {
    logger.warning("No plugin assembly steps to copy");
    return;
  }

  try {
    const markdownContent = generateMarkdownContent(steps);

    await window.toolboxAPI.utils.copyToClipboard(markdownContent);

    logger.success(
      `Copied ${steps.length} plugin assembly steps to clipboard (Markdown)`,
    );
    if (showNotification) {
      await showNotification(
        "Copy Successful",
        `Copied ${steps.length} plugin assembly steps to clipboard as Markdown`,
        "success",
      );
    }
  } catch (error) {
    logger.error(`Error copying to clipboard: ${(error as Error).message}`);
    if (showNotification) {
      await showNotification(
        "Copy Failed",
        `Error copying to clipboard: ${(error as Error).message}`,
        "error",
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
    "Unsecure Config",
    "Secure Config",
    "Images",
    "Image Types",
    "Image Entity Aliases",
    "Image Message Properties",
    "Image Attributes",
  ];
  const csvRows = [headers.join(",")];

  steps.forEach((step) => {
    const images = step.images || [];
    const row = [
      step.name,
      step.eventHandler,
      step.sdkMessage,
      step.primaryobjecttypecodeDisplayname
        ? `${step.primaryobjecttypecodeDisplayname} (${step.primaryobjecttypecode})`
        : step.primaryobjecttypecode,
      step.mode,
      step.stage,
      step.rank,
      step.filteringattributes,
      step.unsecureConfig,
      step.secureConfig,
      images.map((image) => image.name).join("\n"),
      images.map((image) => image.imageType).join("\n"),
      images.map((image) => image.entityAlias).join("\n"),
      images.map((image) => image.messagePropertyName).join("\n"),
      images.map((image) => image.attributes || "All attributes").join("; "),
    ].map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`);
    csvRows.push(row.join(","));
  });

  return csvRows.join("\n");
}

/**
 * Generates Markdown table content for clipboard copy
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
    "Unsecure Config",
    "Secure Config",
    "Images",
    "Image Types",
    "Image Entity Aliases",
    "Image Message Properties",
    "Image Attributes",
  ];

  // Create header row
  let markdown = `| ${headers.join(" | ")} |\n`;
  // Create separator row
  markdown += `| ${headers.map(() => "---").join(" | ")} |\n`;

  // Add data rows
  steps.forEach((step) => {
    const images = step.images || [];
    const row = [
      step.name,
      step.eventHandler,
      step.sdkMessage,
      step.primaryobjecttypecodeDisplayname
        ? `${step.primaryobjecttypecodeDisplayname} (${step.primaryobjecttypecode})`
        : step.primaryobjecttypecode,
      step.mode,
      step.stage,
      step.rank.toString(),
      step.filteringattributes,
      step.unsecureConfig,
      step.secureConfig,
      images.map((image) => image.name).join("\n"),
      images.map((image) => image.imageType).join("\n"),
      images.map((image) => image.entityAlias).join("\n"),
      images.map((image) => image.messagePropertyName).join("\n"),
      images.map((image) => image.attributes || "All attributes").join("; "),
    ];
    const escapedRow = row.map((cell) =>
      String(cell ?? "")
        .replace(/\|/g, "\\|")
        .replace(/\r?\n/g, "<br>")
    );
    markdown += `| ${escapedRow.join(" | ")} |\n`;
  });

  return markdown;
}

function generateDocumentationMarkdown(
  steps: PluginAssemblyStep[],
  assembly: PluginAssembly | undefined
): string {
  const lines = [
    `# ${assembly?.name || "Plugin Assembly"}`,
    "",
    `Version: ${assembly?.version || "Unknown"}`,
    "",
    `Plugin steps: ${steps.length}`,
    "",
  ];

  const entityGroups = new Map<string, Map<string, PluginAssemblyStep[]>>();
  steps.forEach((step) => {
    const entity =
      step.primaryobjecttypecodeDisplayname ||
      step.primaryobjecttypecode ||
      "No entity";
    const method = step.sdkMessage || "No method";
    const methods = entityGroups.get(entity) || new Map<string, PluginAssemblyStep[]>();
    const methodSteps = methods.get(method) || [];
    methodSteps.push(step);
    methods.set(method, methodSteps);
    entityGroups.set(entity, methods);
  });

  [...entityGroups.entries()]
    .sort(([left], [right]) => {
      if (left === "No entity") return -1;
      if (right === "No entity") return 1;
      return left.localeCompare(right);
    })
    .forEach(([entity, methods]) => {
      lines.push(`## ${escapeMarkdown(entity)}`, "");

      [...methods.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .forEach(([method, methodSteps]) => {
          lines.push(`### ${escapeMarkdown(method)}`, "");
          methodSteps
            .sort((left, right) => left.rank - right.rank || left.name.localeCompare(right.name))
            .forEach((step) => {
              lines.push(`#### ${escapeMarkdown(step.name)}`, "");
              lines.push(
                "| Property | Value |",
                "| --- | --- |",
                `| Event Handler | ${escapeMarkdown(step.eventHandler || "-")} |`,
                `| Stage | ${escapeMarkdown(step.stage || "-")} |`,
                `| Mode | ${escapeMarkdown(step.mode || "-")} |`,
                `| Execution Order | ${step.rank} |`,
                `| Filtering Attributes | ${escapeMarkdown(step.filteringattributes || "-")} |`,
                ""
              );

              if (step.unsecureConfig) {
                lines.push("**Unsecure Configuration**", "", "```text", step.unsecureConfig, "```", "");
              }
              if (step.secureConfig) {
                lines.push("**Secure Configuration**", "", "```text", step.secureConfig, "```", "");
              }

              if (step.images.length > 0) {
                lines.push(
                  "##### Images",
                  "",
                  "| Name | Type | Entity Alias | Message Property | Attributes |",
                  "| --- | --- | --- | --- | --- |"
                );
                step.images.forEach((image) => {
                  lines.push(
                    `| ${escapeMarkdown(image.name || "-")} | ${escapeMarkdown(image.imageType || "-")} | ${escapeMarkdown(image.entityAlias || "-")} | ${escapeMarkdown(image.messagePropertyName || "-")} | ${escapeMarkdown(image.attributes || "All attributes")} |`
                  );
                });
                lines.push("");
              }
            });
        });
    });

  return lines.join("\n");
}

function escapeMarkdown(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>");
}
