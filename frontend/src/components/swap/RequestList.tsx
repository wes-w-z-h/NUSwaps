// TODO: Move this to types
interface Swap {
  id: string;
  userId: string;
  courseId: string;
  lessonType: string;
  current: string;
  request: string;
  status: boolean;
}

interface RequestListProps {
  requests: Swap[];
}

// TODO: Display request properly
const RequestList = ({ requests }: RequestListProps) => {
  return (
    <div className="requests">
      {requests.map((request) => (
        <div className="request">Request for {request.courseId}</div>
      ))}
    </div>
  );
};

export default RequestList;
