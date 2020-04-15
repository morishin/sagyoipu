import { Meeting } from "./Meeting";
import { Participant } from "./Participant";

export interface PariticapntJoinedMeetingEvent {
  event: "meeting.participant_joined";
  payload: {
    account_id: string;
    object: Meeting & {
      participant: Participant;
    };
  };
}

export interface ParticipantLeftMeetingEvent {
  event: "meeting.participant_left";
  payload: {
    account_id: string;
    object: Meeting & {
      participant: Participant;
    };
  };
}
