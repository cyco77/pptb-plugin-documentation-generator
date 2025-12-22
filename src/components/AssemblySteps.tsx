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
} from "@fluentui/react-components";
import type { DataGridProps, JSXElement } from "@fluentui/react-components";
import { PluginAssemblyStep } from "../types/pluginAssemblyStep";
import React from "react";

const useStyles = makeStyles({
  scrollWrapper: {
    height: "100%",
    overflow: "auto",
    position: "relative",
  },
  gridContainer: {
    minWidth: "max-content",
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
});

export interface IAssemblyStepsProps {
  items: PluginAssemblyStep[];
}

export const AssemblySteps = (props: IAssemblyStepsProps): JSXElement => {
  const styles = useStyles();
  const [sortState, setSortState] = React.useState<
    Parameters<NonNullable<DataGridProps["onSortChange"]>>[1]
  >({
    sortColumn: "name",
    sortDirection: "ascending",
  });

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
            {item.name}
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

      renderCell: (item: PluginAssemblyStep) => {
        return (
          <span title={item.mode} className={styles.cellStyles}>
            {item.mode}
          </span>
        );
      },
    }),

    createTableColumn<PluginAssemblyStep>({
      columnId: "stage",
      compare: (a, b) => {
        return a.stage.localeCompare(b.stage);
      },
      renderHeaderCell: () => {
        return "Stage";
      },

      renderCell: (item: PluginAssemblyStep) => {
        return (
          <span title={item.stage} className={styles.cellStyles}>
            {item.stage}
          </span>
        );
      },
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
        return a.filteringattributes.localeCompare(b.name);
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
      idealWidth: 120,
      minWidth: 80,
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
  };

  return (
    <div className={styles.scrollWrapper}>
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
    </div>
  );
};
