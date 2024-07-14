import { Box, Card, CardMedia, Typography } from '@mui/material';
import { Match } from '../../types/Match';

type MatchSummaryPanelProps = {
  active: number;
  index: number;
  match: Match;
};

const MatchSummaryPanel: React.FC<MatchSummaryPanelProps> = ({
  active,
  index,
  match,
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
          <Box textAlign={'center'}>
            <Typography id="courseId-status" variant="caption">
              Course: {match.courseId} --- Status: {match.status}{' '}
            </Typography>
            <Typography id="lessonType">
              Lesson type: {match.lessonType}
            </Typography>
          </Box>
        </>
      )}
    </Card>
    // <div
    //   role="tabpanel"
    //   hidden={active !== index}
    //   id={`vertical-tabpanel-${index}`}
    //   aria-labelledby={`vertical-tab-${index}`}
    // >
    //   {active === index && (
    //     <Box sx={{ p: 3 }}>
    //       <Typography>{match.courseId}</Typography>
    //     </Box>
    //   )}
    // </div>
  );
};

export default MatchSummaryPanel;
