import {
  DataGridBody,
  DataGridRow,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  TableColumnDefinition,
  createTableColumn,
} from "@fluentui/react-components";
import type { DataGridProps, JSXElement } from "@fluentui/react-components";
import { PluginAssemblyStep } from "../types/pluginAssemblyStep";
import React from "react";

const cellStyles = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "100%",
};

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
        <span title={item.name} style={cellStyles}>
          {item.name}
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
        <span title={item.sdkMessage} style={cellStyles}>
          {item.sdkMessage}
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
        <span title={item.mode} style={cellStyles}>
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
        <span title={item.stage} style={cellStyles}>
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
        <span title={item.rank.toString()} style={cellStyles}>
          {item.rank}
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
        <span title={item.eventHandler} style={cellStyles}>
          {item.eventHandler}
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
        <span title={item.filteringattributes} style={cellStyles}>
          {item.filteringattributes}
        </span>
      );
    },
  }),
];

export interface IAssemblyStepsProps {
  items: PluginAssemblyStep[];
}

export const AssemblySteps = (props: IAssemblyStepsProps): JSXElement => {
  const [sortState, setSortState] = React.useState<
    Parameters<NonNullable<DataGridProps["onSortChange"]>>[1]
  >({
    sortColumn: "name",
    sortDirection: "ascending",
  });
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
    sdkMessage: {
      idealWidth: 150,
      minWidth: 100,
    },
    mode: {
      idealWidth: 120,
      minWidth: 80,
    },
    stage: {
      idealWidth: 150,
      minWidth: 100,
    },
    rank: {
      idealWidth: 120,
      minWidth: 80,
    },
    eventHandler: {
      idealWidth: 350,
      minWidth: 150,
    },
    filteringattributes: {
      idealWidth: 200,
      minWidth: 150,
    },
  };

  return (
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
      <DataGridHeader>
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
  );
};
