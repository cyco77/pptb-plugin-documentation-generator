import {
  DataGridBody,
  DataGridRow,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  TableColumnDefinition,
  createTableColumn,
  makeStyles,
  tokens,
  Tooltip,
  Badge,
} from "@fluentui/react-components";
import type { DataGridProps, JSXElement } from "@fluentui/react-components";
import { PluginAssemblyStep } from "../types/pluginAssemblyStep";
import React from "react";

const useStyles = makeStyles({
  scrollWrapper: {
    flex: 1,
    minHeight: 0,
    minWidth: 0,
    overflow: "auto",
    overscrollBehavior: "contain",
    position: "relative",
  },
  gridContainer: {
    minWidth: "max-content",
    minHeight: "100%",
  },
  stickyHeader: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  cellStyles: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  },
  tree: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
  },
  entityNode: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  entitySummary: {
    cursor: "pointer",
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    fontWeight: tokens.fontWeightSemibold,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  stepName: {
    fontWeight: tokens.fontWeightSemibold,
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  stepTableWrapper: {
    width: "100%",
  },
  stepTable: {
    width: "100%",
    minWidth: "960px",
    tableLayout: "fixed",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: tokens.fontSizeBase200,
  },
  imageTable: {
    marginTop: tokens.spacingVerticalS,
  },
  imageIndent: {
    display: "block",
    marginLeft: tokens.spacingHorizontalL,
    paddingLeft: tokens.spacingHorizontalM,
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  firstColumn: {
    width: "22%",
  },
  secondColumn: {
    width: "11%",
  },
  thirdColumn: {
    width: "10%",
  },
  fourthColumn: {
    width: "9%",
  },
  fifthColumn: {
    width: "26%",
  },
  configColumn: {
    width: "11%",
    textAlign: "center",
  },
  configTag: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "88px",
    height: "24px",
    cursor: "help",
    fontWeight: tokens.fontWeightSemibold,
    whiteSpace: "nowrap",
  },
  configCell: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "88px",
    height: "24px",
  },
  configEmpty: {
    color: tokens.colorNeutralForeground3,
  },
  stepTableHeader: {
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightSemibold,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    whiteSpace: "nowrap",
  },
  stepTableCell: {
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    color: tokens.colorNeutralForeground2,
    verticalAlign: "middle",
    overflowWrap: "anywhere",
  },
  treeStepRow: {
    height: "44px",
  },
  treeStepCell: {
    height: "44px",
    padding: `0 ${tokens.spacingHorizontalS}`,
    verticalAlign: "middle",
  },
  treeStepCellContent: {
    display: "flex",
    alignItems: "center",
    minWidth: 0,
    height: "44px",
  },
  imageList: {
    width: "100%",
  },
  stepNode: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM} 0`,
  },
  imageTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: tokens.spacingHorizontalXS,
  },
  imageTag: {
    cursor: "help",
  },
  badgeBase: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "24px",
    minHeight: "24px",
    boxSizing: "border-box",
  },
  enumTag: {
    display: "inline-flex",
    alignItems: "center",
    minWidth: 0,
    maxWidth: "100%",
    width: "fit-content",
    justifyContent: "center",
    fontWeight: tokens.fontWeightSemibold,
    flexShrink: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  enumTooltipTrigger: {
    display: "inline-flex",
    minWidth: 0,
    maxWidth: "100%",
    verticalAlign: "middle",
  },
  enumTagText: {
    display: "block",
    minWidth: 0,
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  methodNode: {
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    marginLeft: tokens.spacingHorizontalL,
  },
  methodSummary: {
    cursor: "pointer",
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    color: tokens.colorNeutralForeground2,
    fontWeight: tokens.fontWeightSemibold,
    borderLeft: `2px solid ${tokens.colorBrandStroke1}`,
  },
  secureTooltip: {
    maxWidth: "360px",
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
  },
});

export interface IAssemblyStepsProps {
  items: PluginAssemblyStep[];
  view: "list" | "tree";
  expandAllRequest: number;
  collapseAllRequest: number;
}

const getTreeNodeIds = (items: PluginAssemblyStep[]) => {
  const nodeIds = new Set<string>();

  items.forEach((item) => {
    const entityName =
      item.primaryobjecttypecodeDisplayname || item.primaryobjecttypecode || "";
    const normalizedEntity = entityName.trim().toLowerCase();
    const entity =
      normalizedEntity === "none" || normalizedEntity === "no entity"
        ? ""
        : entityName;
    const method = item.sdkMessage || "No method";

    nodeIds.add(JSON.stringify([entity]));
    nodeIds.add(JSON.stringify([entity, method]));
  });

  return nodeIds;
};

export const AssemblySteps = (props: IAssemblyStepsProps): JSXElement => {
  const styles = useStyles();
  const [openTreeNodes, setOpenTreeNodes] = React.useState<Set<string>>(
    () => new Set()
  );
  const [sortState, setSortState] = React.useState<
    Parameters<NonNullable<DataGridProps["onSortChange"]>>[1]
  >({
    sortColumn: "name",
    sortDirection: "ascending",
  });

  React.useEffect(() => {
    if (props.expandAllRequest > 0) {
      setOpenTreeNodes(getTreeNodeIds(props.items));
    }
  }, [props.expandAllRequest]);

  React.useEffect(() => {
    if (props.collapseAllRequest > 0) {
      setOpenTreeNodes(new Set());
    }
  }, [props.collapseAllRequest]);

  function syncTreeNode(nodeId: string, isOpen: boolean) {
    setOpenTreeNodes((current) => {
      if (current.has(nodeId) === isOpen) {
        return current;
      }

      const next = new Set(current);
      if (isOpen) {
        next.add(nodeId);
      } else {
        next.delete(nodeId);
      }
      return next;
    });
  }

  function renderSecureConfig(item: PluginAssemblyStep) {
    return renderConfigTooltip("Secure", "Secure configuration", item.secureConfig, "informative");
  }

  function renderUnsecureConfig(item: PluginAssemblyStep) {
    return renderConfigTooltip("Unsecure", "Unsecure configuration", item.unsecureConfig, "warning");
  }

  function renderConfigTooltip(
    tag: string,
    label: string,
    content: string,
    color: "informative" | "warning"
  ) {
    if (!content) {
      return (
        <span className={`${styles.configCell} ${styles.configEmpty}`}>
          -
        </span>
      );
    }

    return (
      <Tooltip
        content={<div className={styles.secureTooltip}>{content}</div>}
        relationship="label"
        positioning="above"
        withArrow
      >
        <span className={styles.configCell} tabIndex={0} aria-label={`${label} available`}>
          <Badge
            size="medium"
            appearance="filled"
            color={color}
            className={`${styles.badgeBase} ${styles.configTag}`}
          >
            {tag}
          </Badge>
        </span>
      </Tooltip>
    );
  }

  function renderEnumTag(
    value: string,
    kind: "stage" | "mode" | "imageType"
  ) {
    if (!value) {
      return <span>-</span>;
    }

    const normalized = value.toLowerCase();
    const color =
      kind === "stage"
        ? normalized.includes("pre")
          ? "informative"
          : normalized.includes("post")
            ? "success"
            : "important"
        : kind === "mode"
          ? normalized.includes("async")
            ? "warning"
            : "brand"
          : normalized.includes("pre")
            ? "informative"
            : normalized.includes("post")
              ? "success"
              : "important";

    return (
      <Tooltip
        content={value}
        relationship="label"
        positioning="above"
        withArrow
      >
        <span className={styles.enumTooltipTrigger} tabIndex={0}>
          <Badge
            size="medium"
            appearance="tint"
            color={color}
            className={`${styles.badgeBase} ${styles.enumTag}`}
          >
            <span className={styles.enumTagText}>{value}</span>
          </Badge>
        </span>
      </Tooltip>
    );
  }

  function renderImages(item: PluginAssemblyStep) {
    if (item.images.length === 0) {
      return null;
    }

    return (
      <table className={`${styles.stepTable} ${styles.imageTable}`}>
        <colgroup>
          <col className={styles.firstColumn} />
          <col className={styles.secondColumn} />
          <col className={styles.thirdColumn} />
          <col className={styles.fourthColumn} />
          <col className={styles.fifthColumn} />
          <col className={styles.configColumn} />
          <col className={styles.configColumn} />
        </colgroup>
        <thead>
          <tr>
            <th className={styles.stepTableHeader}>
              <span className={styles.imageIndent}>Image</span>
            </th>
            <th className={styles.stepTableHeader}>Type</th>
            <th className={styles.stepTableHeader}>Entity Alias</th>
            <th className={styles.stepTableHeader}>Message Property</th>
            <th className={styles.stepTableHeader}>Attributes</th>
            <th className={styles.stepTableHeader} />
            <th className={styles.stepTableHeader} />
          </tr>
        </thead>
        <tbody>
          {item.images.map((image) => (
            <tr key={image.id}>
              <td className={styles.stepTableCell}>
                <span className={styles.imageIndent}>{image.name || "-"}</span>
              </td>
              <td className={styles.stepTableCell}>
                {renderEnumTag(image.imageType, "imageType")}
              </td>
              <td className={styles.stepTableCell}>{image.entityAlias || "-"}</td>
              <td className={styles.stepTableCell}>
                {image.messagePropertyName || "-"}
              </td>
              <td className={styles.stepTableCell}>
                {image.attributes || "All attributes"}
              </td>
              <td className={styles.stepTableCell} />
              <td className={styles.stepTableCell} />
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function renderImageTags(item: PluginAssemblyStep) {
    if (item.images.length === 0) {
      return <span>-</span>;
    }

    const imageTypes = [...new Set(item.images.map((image) => image.imageType))];
    const tags = imageTypes.length > 0 ? imageTypes : ["Image"];
    const tooltip = item.images
      .map((image) =>
        [
          image.name || image.entityAlias || "Image",
          image.imageType,
          image.entityAlias && `Alias: ${image.entityAlias}`,
          image.messagePropertyName && `Property: ${image.messagePropertyName}`,
          `Attributes: ${image.attributes || "All attributes"}`,
        ]
          .filter(Boolean)
          .join("\n")
      )
      .join("\n\n");

    return (
      <Tooltip
        content={<div className={styles.secureTooltip}>{tooltip}</div>}
        relationship="label"
        positioning="above"
        withArrow
      >
        <span className={styles.imageTags} tabIndex={0} aria-label={tooltip}>
          {tags.map((type) => (
            <Badge
              key={type}
              size="medium"
              appearance="tint"
              color={type.toLowerCase().includes("pre") ? "informative" : "success"}
              className={`${styles.badgeBase} ${styles.imageTag}`}
            >
              {type.toLowerCase().includes("pre")
                ? "Pre"
                : type.toLowerCase().includes("post")
                  ? "Post"
                  : type || "Image"}
            </Badge>
          ))}
        </span>
      </Tooltip>
    );
  }

  const columns: TableColumnDefinition<PluginAssemblyStep>[] = [
    createTableColumn<PluginAssemblyStep>({
      columnId: "name",
      compare: (a, b) => {
        return a.name.localeCompare(b.name);
      },
      renderHeaderCell: () => {
        return "Name";
      },

      renderCell: (item: PluginAssemblyStep) => {
        return (
          <span title={item.name} className={styles.cellStyles}>
            {item.name} {item.secureConfig && renderSecureConfig(item)}
          </span>
        );
      },
    }),

    createTableColumn<PluginAssemblyStep>({
      columnId: "eventHandler",
      compare: (a, b) => {
        return a.eventHandler.localeCompare(b.eventHandler);
      },
      renderHeaderCell: () => {
        return "EventHandler";
      },

      renderCell: (item: PluginAssemblyStep) => {
        return (
          <span title={item.eventHandler} className={styles.cellStyles}>
            {item.eventHandler}
          </span>
        );
      },
    }),

    createTableColumn<PluginAssemblyStep>({
      columnId: "sdkMessage",
      compare: (a, b) => {
        return a.sdkMessage.localeCompare(b.sdkMessage);
      },
      renderHeaderCell: () => {
        return "SDK Message";
      },

      renderCell: (item: PluginAssemblyStep) => {
        return (
          <span title={item.sdkMessage} className={styles.cellStyles}>
            {item.sdkMessage}
          </span>
        );
      },
    }),

    createTableColumn<PluginAssemblyStep>({
      columnId: "primaryobjecttypecode",
      compare: (a, b) => {
        return a.primaryobjecttypecode.localeCompare(b.primaryobjecttypecode);
      },
      renderHeaderCell: () => {
        return "Object Type Code";
      },

      renderCell: (item: PluginAssemblyStep) => {
        return (
          <span
            title={item.primaryobjecttypecode}
            className={styles.cellStyles}
          >
            {item.primaryobjecttypecodeDisplayname
              ? `${item.primaryobjecttypecodeDisplayname} (${item.primaryobjecttypecode})`
              : "-"}
          </span>
        );
      },
    }),

    createTableColumn<PluginAssemblyStep>({
      columnId: "mode",
      compare: (a, b) => {
        return a.mode.localeCompare(b.mode);
      },
      renderHeaderCell: () => {
        return "Mode";
      },

      renderCell: (item: PluginAssemblyStep) => renderEnumTag(item.mode, "mode"),
    }),

    createTableColumn<PluginAssemblyStep>({
      columnId: "stage",
      compare: (a, b) => {
        return a.stage.localeCompare(b.stage);
      },
      renderHeaderCell: () => {
        return "Stage";
      },

      renderCell: (item: PluginAssemblyStep) => renderEnumTag(item.stage, "stage"),
    }),

    createTableColumn<PluginAssemblyStep>({
      columnId: "rank",
      compare: (a, b) => {
        return a.rank - b.rank;
      },
      renderHeaderCell: () => {
        return "Execution Order";
      },

      renderCell: (item: PluginAssemblyStep) => {
        return (
          <span title={item.rank.toString()} className={styles.cellStyles}>
            {item.rank}
          </span>
        );
      },
    }),

    createTableColumn<PluginAssemblyStep>({
      columnId: "filteringattributes",
      compare: (a, b) => {
        return a.filteringattributes.localeCompare(b.filteringattributes);
      },
      renderHeaderCell: () => {
        return "Filtering attributes";
      },

      renderCell: (item: PluginAssemblyStep) => {
        return (
          <span title={item.filteringattributes} className={styles.cellStyles}>
            {item.filteringattributes}
          </span>
        );
      },
    }),

    createTableColumn<PluginAssemblyStep>({
      columnId: "images",
      compare: (a, b) => a.images.length - b.images.length,
      renderHeaderCell: () => "Image",
      renderCell: (item) => renderImageTags(item),
    }),

    createTableColumn<PluginAssemblyStep>({
      columnId: "unsecureConfig",
      compare: (a, b) => a.unsecureConfig.localeCompare(b.unsecureConfig),
      renderHeaderCell: () => "Unsecure Config",
      renderCell: (item) => renderUnsecureConfig(item),
    }),

    createTableColumn<PluginAssemblyStep>({
      columnId: "secureConfig",
      compare: (a, b) => a.secureConfig.localeCompare(b.secureConfig),
      renderHeaderCell: () => "Secure Config",
      renderCell: (item) => renderSecureConfig(item),
    }),

  ];

  const onSortChange: DataGridProps["onSortChange"] = (_e, nextSortState) => {
    setSortState(nextSortState);
  };

  if (props.items.length === 0) {
    return <p>No assembly steps found.</p>;
  }

  const sortedItems = [...props.items].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const entityGroups = sortedItems.reduce<
    Record<string, Record<string, PluginAssemblyStep[]>>
  >((groups, item) => {
      const entityName =
        item.primaryobjecttypecodeDisplayname ||
        item.primaryobjecttypecode ||
        "";
      const normalizedEntity = entityName.trim().toLowerCase();
      const entity =
        normalizedEntity === "none" || normalizedEntity === "no entity"
          ? ""
          : entityName;
      const method = item.sdkMessage || "No method";
      const methods = (groups[entity] ||= {});
      (methods[method] ||= []).push(item);
      return groups;
    }, {});
  Object.values(entityGroups).forEach((methods) => {
    Object.values(methods).forEach((steps) => {
      steps.sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));
    });
  });
  const orderedEntityGroups = Object.entries(entityGroups).sort(([a], [b]) => {
    if (!a) return -1;
    if (!b) return 1;
    return a.localeCompare(b);
  });

  const columnSizingOptions = {
    name: {
      idealWidth: 400,
      minWidth: 150,
    },
    eventHandler: {
      idealWidth: 350,
      minWidth: 150,
    },
    sdkMessage: {
      idealWidth: 150,
      minWidth: 100,
    },
    primaryobjecttypecode: {
      idealWidth: 350,
      minWidth: 250,
    },
    mode: {
      idealWidth: 160,
      minWidth: 145,
      maxWidth: 190,
    },
    stage: {
      idealWidth: 200,
      minWidth: 150,
    },
    rank: {
      idealWidth: 150,
      minWidth: 100,
    },

    filteringattributes: {
      idealWidth: 300,
      minWidth: 150,
    },
    images: {
      idealWidth: 140,
      minWidth: 100,
    },
    secureConfig: {
      idealWidth: 150,
      minWidth: 120,
    },
    unsecureConfig: {
      idealWidth: 160,
      minWidth: 130,
    },
  };

  return (
    <div className={styles.scrollWrapper}>
      {props.view === "tree" ? (
        <div className={styles.tree}>
          {orderedEntityGroups.map(([entity, methods]) => (
            <details
              key={entity}
              className={styles.entityNode}
              open={openTreeNodes.has(JSON.stringify([entity]))}
              onToggle={(event) =>
                syncTreeNode(JSON.stringify([entity]), event.currentTarget.open)
              }
            >
              <summary className={styles.entitySummary}>
                {entity || "No entity"}
              </summary>
              {Object.entries(methods).map(([method, methodSteps]) => (
                <details
                  key={method}
                  className={styles.methodNode}
                  open={openTreeNodes.has(JSON.stringify([entity, method]))}
                  onToggle={(event) =>
                    syncTreeNode(
                      JSON.stringify([entity, method]),
                      event.currentTarget.open
                    )
                  }
                >
                  <summary className={styles.methodSummary}>
                    {method}
                  </summary>
                  {methodSteps.map((item) => (
                    <div key={item.id} className={styles.stepNode}>
                      <div className={styles.stepTableWrapper}>
                        <table className={styles.stepTable}>
                          <colgroup>
                            <col className={styles.firstColumn} />
                            <col className={styles.secondColumn} />
                          <col className={styles.thirdColumn} />
                          <col className={styles.fourthColumn} />
                          <col className={styles.fifthColumn} />
                          <col className={styles.configColumn} />
                          <col className={styles.configColumn} />
                          </colgroup>
                          <thead>
                            <tr>
                              <th className={styles.stepTableHeader}>Step</th>
                              <th className={styles.stepTableHeader}>Stage</th>
                              <th className={styles.stepTableHeader}>Mode</th>
                              <th className={styles.stepTableHeader}>Order</th>
                              <th className={styles.stepTableHeader}>Filtering Attributes</th>
                              <th className={styles.stepTableHeader}>Unsecure Config</th>
                              <th className={styles.stepTableHeader}>Secure Config</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className={styles.treeStepRow}>
                              <td className={styles.treeStepCell}>
                                <div className={styles.treeStepCellContent}>
                                  <span className={styles.stepName} title={item.name}>
                                    {item.name}
                                  </span>
                                </div>
                              </td>
                              <td className={styles.treeStepCell}>
                                <div className={styles.treeStepCellContent}>
                                  {renderEnumTag(item.stage, "stage")}
                                </div>
                              </td>
                              <td className={styles.treeStepCell}>
                                <div className={styles.treeStepCellContent}>
                                  {renderEnumTag(item.mode, "mode")}
                                </div>
                              </td>
                              <td className={styles.treeStepCell}>
                                <div className={styles.treeStepCellContent}>
                                  {item.rank}
                                </div>
                              </td>
                              <td className={styles.treeStepCell}>
                                <div className={styles.treeStepCellContent}>
                                  {item.filteringattributes || "-"}
                                </div>
                              </td>
                              <td className={styles.treeStepCell}>
                                <div className={styles.treeStepCellContent}>
                                  {renderUnsecureConfig(item)}
                                </div>
                              </td>
                              <td className={styles.treeStepCell}>
                                <div className={styles.treeStepCellContent}>
                                  {renderSecureConfig(item)}
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {item.images.length > 0 && (
                        <div className={styles.imageList}>{renderImages(item)}</div>
                      )}
                    </div>
                  ))}
                </details>
              ))}
            </details>
          ))}
        </div>
      ) : (
      <div className={styles.gridContainer}>
        <DataGrid
          items={sortedItems}
          columns={columns}
          sortable
          sortState={sortState}
          onSortChange={onSortChange}
          getRowId={(item: PluginAssemblyStep) => item.id}
          resizableColumns={true}
          columnSizingOptions={columnSizingOptions}
        >
          <DataGridHeader className={styles.stickyHeader}>
            <DataGridRow>
              {({ renderHeaderCell }) => (
                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody<PluginAssemblyStep>>
            {({ item, rowId }) => (
              <DataGridRow<PluginAssemblyStep> key={rowId}>
                {({ renderCell }) => (
                  <DataGridCell>{renderCell(item)}</DataGridCell>
                )}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      </div>
      )}
    </div>
  );
};
