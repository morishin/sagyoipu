/** @jsx jsx */
import * as React from "react";
import { css, jsx } from "@emotion/core";
import { Meeting, Participant } from "~types/Meeting";
import ZoomLogoImage from "../images/zoomus_logo.png";
import PersonImage from "../images/person.png";
import { Tooltip, Position } from "@blueprintjs/core";
import { format, parseISO } from "date-fns";
import { colors } from "~styles/Colors";

export interface MeetingCellProps {
  meeting: Meeting;
  joinMeetingURL: string;
}

const containerStyle = css`
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 438px;
  border: 1px solid ${colors.borderGray};
  border-radius: 8px;
  border-color: ${colors.borderGray};
  color: ${colors.textBlack};
  margin-bottom: 16px;
`;

const firstSectionStyle = css`
  padding: 10px 16px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 15px;
`;

const headerTextStyle = css`
  font-weight: 700;
`;

const headerSubTextStyle = css`
  color: ${colors.textGray};
`;

const secondSectionStyle = css`
  padding: 10px 16px;
  border-top: 1px solid ${colors.borderGray};
  border-bottom: 1px solid ${colors.borderGray};
  background-color: ${colors.backgroundGray};
  font-size: 15px;
  line-height: 1.46668;
  font-weight: 400;
  color: ${colors.textGray};
`;

const thirdSectionStyle = css`
  padding: 10px 16px;
  background-color: ${colors.backgroundGray};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const zoomLogoStyle = css`
  width: 36px;
  height: 36px;
  background-image: url(${ZoomLogoImage});
  background-size: contain;
  border-radius: 3px;
  margin-right: 8px;
`;

const personsStyle = css`
  display: flex;
  flex-direction: row;
`;

const personStyle = css`
  width: 36px;
  height: 36px;
  background-image: url(${PersonImage});
  background-size: contain;
  border-radius: 3px;
  margin-right: 8px;
`;

const personOverlayStyle = css`
  width: 36px;
  height: 36px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  color: white;
  font-weight: 700;
  font-size: 15px;
  text-align: center;
  line-height: 36px;
`;

const joinButtonStyle = css`
  font-size: 15px;
  height: 36px;
  min-width: 80px;
  padding: 0 12px 1px;
  transition: all 80ms linear;
  background: #007a5a;
  color: white;
  font-weight: 900;
  outline: none;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  text-align: center;
  line-height: 36px;
  -webkit-font-smoothing: antialiased;
  box-shadow: none;
  &:hover {
    background-color: #148567;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }
  &:active {
    background-color: #006e51;
    box-shadow: none;
  }
`;

const ZoomLogo = () => <div css={zoomLogoStyle}></div>;

const Person: React.FC<{ participant: Participant }> = props => (
  <Tooltip content={props.participant.user_name} position={Position.TOP}>
    <div css={personStyle}></div>
  </Tooltip>
);

const PersonMore: React.FC<{ participants: Participant[] }> = ({
  participants,
}) => (
  <Tooltip
    content={participants.map(p => p.user_name).join(", ")}
    position={Position.TOP}
  >
    <div css={personStyle}>
      {participants.length > 1 && (
        <div css={personOverlayStyle}>{`+${participants.length}`}</div>
      )}
    </div>
  </Tooltip>
);

const JoinButton: React.FC<{ joinMeetingURL: string }> = ({
  joinMeetingURL,
}) => (
  <a target="_blank" rel="noopener noreferrer" href={joinMeetingURL}>
    <div css={joinButtonStyle}>Join</div>
  </a>
);

export const MeetingCell: React.FC<MeetingCellProps> = ({
  meeting,
  joinMeetingURL,
}) => {
  const participants = meeting.participants;

  const firstFourParticipants = participants.slice(0, 4);
  const restParticipants = participants.slice(5);

  return (
    <div css={containerStyle}>
      <div css={firstSectionStyle}>
        <ZoomLogo />
        <div>
          <div css={headerTextStyle}>Zoom meeting</div>
          <div css={headerSubTextStyle}>
            {meeting.participants.length > 0
              ? `Last updated at ${format(
                  parseISO(meeting.participants[0].join_time),
                  "yyyy-MM-dd HH:mm",
                )}`
              : "Nobody has joined yet"}
          </div>
        </div>
      </div>
      <div css={secondSectionStyle}>
        {`Meeting ID: ${meeting.id.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3")}`}
      </div>
      <div css={thirdSectionStyle}>
        <div css={personsStyle}>
          {firstFourParticipants.map(p => (
            <Person key={p.user_id} participant={p} />
          ))}
          {restParticipants.length > 0 && (
            <PersonMore participants={restParticipants} />
          )}
        </div>
        <JoinButton joinMeetingURL={joinMeetingURL} />
      </div>
    </div>
  );
};
