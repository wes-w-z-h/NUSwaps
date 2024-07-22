import Card from '@mui/material/Card';
import { Swap } from '../../types/Swap';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { UserDetail } from '../../types/User';

type TabPanelProps = {
  index: number;
  active: number;
  swap: Swap;
  userDetail: UserDetail;
};

const TabPanel: React.FC<TabPanelProps> = ({
  index,
  active,
  swap,
  userDetail,
}) => {
  return (
    <Card
      style={{ flexGrow: 1 }}
      role="tabpanel"
      hidden={active !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
    >
      {active === index && (
        <>
          <CardMedia
            component="img"
            src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
            alt="Yosemite National Park"
          />
          <br />
          <Box textAlign={'left'}>
            <Typography id="courseId" variant="body1" paddingLeft={1}>
              Course: {swap.courseId}
            </Typography>
            <br />
            <Typography
              id="status"
              variant="body1"
              paddingLeft={1}
              color={swap.status === 'MATCHED' ? 'orange' : 'seagreen'}
            >
              Status: {swap.status}
            </Typography>
            <br />
            <Typography id="lessonType" variant="body1" paddingLeft={1}>
              Lesson type: {swap.lessonType}
            </Typography>
            <br />
            <Typography id="current" variant="body1" paddingLeft={1}>
              Current slot: {swap.current}
            </Typography>
            <br />
            <Typography id="request" variant="body1" paddingLeft={1}>
              Request slot: {swap.request}
            </Typography>
            <br />
            <Typography id="email" variant="body1" paddingLeft={1}>
              Email: {userDetail.email}
            </Typography>
            <br />
            {userDetail.telegramHandle && (
              <Typography id="teleHandle" variant="body1" paddingLeft={1}>
                Telegram Handle: {userDetail.telegramHandle}
              </Typography>
            )}
          </Box>
        </>
      )}
    </Card>
  );
};

export default TabPanel;
