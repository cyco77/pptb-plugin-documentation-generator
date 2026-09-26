import type {
  JSXElement,
  OptionOnSelectData,
  SelectionEvents,
} from "@fluentui/react-components";
import {
  Dropdown,
  makeStyles,
  Option,
  useId,
  SearchBox,
  SearchBoxChangeEvent,
  Button,
} from "@fluentui/react-components";
import {
  ArrowCollapseAll24Regular,
  ArrowExpandAll24Regular,
  ListBarTree20Regular,
  Table24Regular,
} from "@fluentui/react-icons";
import { PluginAssembly } from "../types/pluginAssembly";

export interface IFilterProps {
  pluginAssemblies: PluginAssembly[];
  onFilterChanged: (pluginassembly: string | undefined) => void;
  onTextFilterChanged: (searchText: string) => void;
  view: "list" | "tree";
  onViewChange: (view: "list" | "tree") => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export const Filter = (props: IFilterProps): JSXElement => {
  const dropdownId = useId("dropdown");
  const searchInputId = useId("search-input");

  const { pluginAssemblies } = props;

  const onOptionSelect = (
    _event: SelectionEvents,
    data: OptionOnSelectData
  ) => {
    props.onFilterChanged(data.optionValue ?? undefined);
  };

  const onTextFilterChange = (
    _event: SearchBoxChangeEvent,
    data: { value: string }
  ) => {
    props.onTextFilterChanged(data.value);
  };

  const sortedAssemblies = [...pluginAssemblies].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const useStyles = makeStyles({
    root: {
      display: "flex",
      gap: "20px",
      alignItems: "flex-end",
    },
    field: {
      display: "grid",
      justifyItems: "start",
      gap: "2px",
    },
    dropdown: {
      minWidth: "450px",
    },
    searchInput: {
      minWidth: "250px",
    },
    viewButton: {
      flexShrink: 0,
    },
    treeActionGroup: {
      display: "flex",
      gap: "4px",
      alignSelf: "flex-end",
    },
    option: {
      whiteSpace: "nowrap",
    },
  });

  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.field}>
        <label htmlFor={`${dropdownId}-plugin-assembly`}>Plugin Assembly</label>
        <Dropdown
          id={dropdownId}
          placeholder="Select an plugin assembly"
          onOptionSelect={onOptionSelect}
          className={styles.dropdown}
        >
          {sortedAssemblies.map((option) => (
            <Option
              key={option.pluginassemblyid}
              value={option.pluginassemblyid}
              className={styles.option}
            >{`${option.name} (${option.version})`}</Option>
          ))}
        </Dropdown>
      </div>
      <div className={styles.field}>
        <label htmlFor={searchInputId}>Filter Steps</label>
        <SearchBox
          id={searchInputId}
          placeholder="Search assembly steps..."
          onChange={onTextFilterChange}
          className={styles.searchInput}
        />
      </div>
      <Button
        className={styles.viewButton}
        appearance="secondary"
        icon={
          props.view === "list" ? (
            <ListBarTree20Regular />
          ) : (
            <Table24Regular />
          )
        }
        aria-label={
          props.view === "list" ? "Switch to tree view" : "Switch to list view"
        }
        title={
          props.view === "list" ? "Switch to tree view" : "Switch to list view"
        }
        onClick={() => props.onViewChange(props.view === "list" ? "tree" : "list")}
      />
      {props.view === "tree" && (
        <div className={styles.treeActionGroup}>
          <Button
            appearance="secondary"
            icon={<ArrowExpandAll24Regular />}
            aria-label="Expand all tree nodes"
            title="Expand all"
            onClick={props.onExpandAll}
          />
          <Button
            appearance="secondary"
            icon={<ArrowCollapseAll24Regular />}
            aria-label="Collapse all tree nodes"
            title="Collapse all"
            onClick={props.onCollapseAll}
          />
        </div>
      )}
    </div>
  );
};
