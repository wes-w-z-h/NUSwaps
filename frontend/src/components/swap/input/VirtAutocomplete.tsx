import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, {
  AutocompleteChangeReason,
  autocompleteClasses,
} from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListSubheader from '@mui/material/ListSubheader';
import Popper from '@mui/material/Popper';
import { useTheme, styled } from '@mui/material/styles';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import Typography from '@mui/material/Typography';

const LISTBOX_PADDING = 8; // px

const renderRow = (props: ListChildComponentProps) => {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };

  if (Object.prototype.hasOwnProperty.call(dataSet, 'group')) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  const { key, ...restProps } = dataSet[0];

  return (
    <Typography
      component="li"
      key={key}
      {...restProps}
      noWrap
      style={inlineStyle}
    >
      {`${dataSet[1]}`}
    </Typography>
  );
};

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useResetCache = (data: any) => {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
};

// Adapter for react-window
const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData: React.ReactElement[] = [];
  (children as React.ReactElement[]).forEach(
    (item: React.ReactElement & { children?: React.ReactElement[] }) => {
      itemData.push(item);
      itemData.push(...(item.children || []));
    }
  );

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
    noSsr: true,
  });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child: React.ReactElement) => {
    if (Object.prototype.hasOwnProperty.call(child, 'group')) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
});

type VirtualizeProps = {
  id: string;
  width: string;
  options: string[];
  error: string;
  value: string;
  handleChange: (
    _event: React.SyntheticEvent<Element, Event>,
    value: string,
    reason: AutocompleteChangeReason
  ) => void;
};

// TODO: pass the changeHandler and value
const Virtualize: React.FC<VirtualizeProps> = ({
  id,
  width,
  options,
  error,
  value,
  handleChange,
}) => {
  return (
    <Autocomplete
      id={id}
      disableListWrap
      disableClearable
      disablePortal
      PopperComponent={StyledPopper}
      ListboxComponent={ListboxComponent}
      options={options}
      onChange={handleChange}
      value={value}
      groupBy={(option) => option[0]}
      renderInput={(params) => (
        <TextField
          {...params}
          required
          sx={{ width: width }}
          label="CourseId"
          margin="normal"
          size="small"
          error={error !== ' '}
          helperText={error}
        />
      )}
      renderOption={(props, option, state) =>
        [props, option, state.index] as React.ReactNode
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderGroup={(params) => params as any}
    />
  );
};

export default Virtualize;
