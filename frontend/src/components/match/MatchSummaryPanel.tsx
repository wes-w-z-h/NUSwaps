import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Swap } from '../../types/Swap';
import { Match } from '../../types/Match';

type MatchSummaryPanelProps = {
  active: number;
  index: number;
  matchedSwaps: Swap[];
  match: Match;
};

const MatchSummaryPanel: React.FC<MatchSummaryPanelProps> = ({
  active,
  index,
  matchedSwaps,
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
          <br />
          <Box textAlign={'left'}>
            <Typography id="courseId" variant="body1" paddingLeft={1}>
              Course: {match.courseId}
            </Typography>
            <br />
            <Typography
              id="status"
              variant="body1"
              color={
                match.status === 'PENDING'
                  ? 'orange'
                  : match.status === 'ACCEPTED'
                    ? 'seagreen'
                    : 'red'
              }
              paddingLeft={1}
            >
              Status: {match.status}
            </Typography>
            <br />
            <Typography id="lessonType" variant="body1" paddingLeft={1}>
              Lesson type: {match.lessonType}
            </Typography>
            <br />
            <Typography id="swaps" variant="body1" paddingLeft={1}>
              Swap:{' '}
              {matchedSwaps.map(
                (s, index) =>
                  s.current +
                  `${index === matchedSwaps.length - 1 ? '' : ' <---> '}`
              )}
            </Typography>
          </Box>
        </>
      )}
    </Card>
  );
};

export default MatchSummaryPanel;
