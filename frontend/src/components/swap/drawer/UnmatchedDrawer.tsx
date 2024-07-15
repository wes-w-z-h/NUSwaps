import { Button, Collapse, Grid, TableCell, TableRow } from '@mui/material';

type UnmatchedDrawerProps = {
  openDrawer: boolean;
  setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDelModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const UnmatchedDrawer: React.FC<UnmatchedDrawerProps> = ({
  openDrawer,
  setOpenEditModal,
  setOpenDelModal,
}) => {
  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
        <Collapse in={openDrawer} timeout="auto" unmountOnExit>
          <Grid container sx={{ margin: 2 }}>
            <Grid item style={{ textAlign: 'center' }} xs>
              <Button onClick={() => setOpenEditModal(true)}>edit</Button>
            </Grid>
            <Grid item style={{ textAlign: 'center' }} xs>
              <Button color="warning" onClick={() => setOpenDelModal(true)}>
                delete
              </Button>
            </Grid>
          </Grid>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

export default UnmatchedDrawer;
