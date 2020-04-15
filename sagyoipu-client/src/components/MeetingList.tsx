import * as React from "react";
import { Meeting } from "~types/Meeting";
import { MeetingCell } from "./MeetingCell";
import { css } from "@emotion/core";

export interface MeetingListProps {
  meetings: Meeting[];
  joinMeetingURL: (meetingID: string) => string;
}

const containerStyle = css`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, 438px);
  justify-content: center;
`;

export const MeetingList: React.FC<MeetingListProps> = ({
  meetings,
  joinMeetingURL,
}) => {
  return (
    <div className={containerStyle}>
      {meetings.map(meeting => (
        <MeetingCell
          key={meeting.id}
          meeting={meeting}
          joinMeetingURL={joinMeetingURL(meeting.id)}
        />
      ))}
    </div>
  );
};
