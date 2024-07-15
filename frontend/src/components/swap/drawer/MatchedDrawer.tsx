import { Button, Collapse, Grid, TableCell, TableRow } from '@mui/material';
import { Swap } from '../../../types/Swap';

type MatchedDrawerProps = {
  openDrawer: boolean;
  confirmSwap: {
    confirmSwap: (id: string) => Promise<void>;
    loading: boolean;
    error: string | null;
  } | null;
  rejectSwap: {
    rejectSwap: (id: string) => Promise<void>;
    loading: boolean;
    error: string | null;
  } | null;
  row: Swap;
};

const MatchedDrawer: React.FC<MatchedDrawerProps> = ({
  openDrawer,
  confirmSwap,
  rejectSwap,
  row,
}) => {
  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
        <Collapse in={openDrawer} timeout="auto" unmountOnExit>
          <Grid container sx={{ margin: 2 }}>
            <Grid item style={{ textAlign: 'center' }} xs>
              <Button onClick={() => confirmSwap?.confirmSwap(row.id)}>
                confirm
              </Button>
            </Grid>
            <Grid item style={{ textAlign: 'center' }} xs>
              <Button
                color="warning"
                onClick={() => rejectSwap?.rejectSwap(row.id)}
              >
                reject
              </Button>
            </Grid>
          </Grid>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

export default MatchedDrawer;
