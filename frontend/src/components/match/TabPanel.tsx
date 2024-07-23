import Card from '@mui/material/Card';
import { Swap } from '../../types/Swap';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PartnerDetail } from '../../types/User';
import { Module } from '../../types/modules';
import { useModsContext } from '../../hooks/mods/useModsContext';
import { SetStateAction, useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';

type TabPanelProps = {
  index: number;
  active: number;
  swap: Swap;
  partnerDetail: PartnerDetail;
  getModsInfo: {
    error: string | null;
    getModInfo: (courseId: string) => Promise<Module | undefined>;
    loading: boolean;
  };
};

type FieldElement = {
  label: string;
  value: string | number | undefined;
};

const TabPanel: React.FC<TabPanelProps> = ({
  index,
  active,
  swap,
  partnerDetail,
  getModsInfo,
}) => {
  const { modsState } = useModsContext();
  const [currFields, setCurrFields] = useState<FieldElement[]>([]);
  const [reqFields, setReqFields] = useState<FieldElement[]>([]);

  const getClassDetails = async (
    classNo: string,
    setter: React.Dispatch<SetStateAction<FieldElement[]>>
  ) => {
    let mod = modsState.mods.find((m) => m.moduleCode === swap.courseId);
    if (!mod) {
      mod = await getModsInfo.getModInfo(swap.courseId);
    }
    if (!mod) return;
    const modDetails = mod.semesterData[0].timetable.find(
      (l) => l.lessonType === swap.lessonType && l.classNo === classNo
    );

    const fields = [
      { label: 'Day', value: modDetails?.day },
      { label: 'Start Time', value: modDetails?.startTime },
      { label: 'End Time', value: modDetails?.endTime },
      { label: 'Venue', value: modDetails?.venue },
      { label: 'Size', value: modDetails?.size },
    ];

    setter(fields);
  };

  useEffect(() => {
    if (active === index) {
      getClassDetails(swap.current, setCurrFields);
      getClassDetails(swap.request, setReqFields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, index]);

  return (
    <Card
      style={{ flexGrow: 1 }}
      role="tabpanel"
      hidden={active !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
    >
      {active === index && (
        <Box textAlign={'left'} overflow={'auto'} maxHeight={'100%'}>
          <CardMedia
            component="img"
            src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
            alt="Yosemite National Park"
          />
          <Divider sx={{ my: 2 }} />
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
          <Divider sx={{ my: 2 }} />
          {currFields.map(
            (field, index) =>
              field.value && (
                <Typography key={index} variant="body1" paddingLeft={1}>
                  <strong>{field.label}:</strong> {field.value}
                </Typography>
              )
          )}
          <Divider sx={{ my: 2 }} />
          <Typography id="request" variant="body1" paddingLeft={1}>
            Request slot: {swap.request}
          </Typography>
          <Divider sx={{ my: 2 }} />
          {reqFields.map(
            (field, index) =>
              field.value && (
                <Typography key={index} variant="body1" paddingLeft={1}>
                  <strong>{field.label}:</strong> {field.value}
                </Typography>
              )
          )}
          <Divider sx={{ my: 2 }} />
          <Typography id="email" variant="body1" paddingLeft={1}>
            Email: {partnerDetail.email}
          </Typography>
          <br />
          {partnerDetail.telegramHandle && (
            <Typography
              id="teleHandle"
              variant="body1"
              paddingLeft={1}
              gutterBottom
            >
              Telegram Handle: {partnerDetail.telegramHandle}
            </Typography>
          )}
        </Box>
      )}
    </Card>
  );
};

export default TabPanel;
