/**
 * Zoom の Webhook イベントに含まれる Meeting オブジェクトの型
 * @see {@link https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/participant-joined-meeting}
 */

type MeetingType = 1 | 2 | 3 | 8;

export interface Meeting {
  uuid: string;
  id: string;
  host_id: string;
  topic: string;
  type: MeetingType;
  start_time: string;
  duration: number;
  timezone: string;
  participants: Participant[];
}

export interface Participant {
  user_id: string;
  user_name: string;
  id: string;
  join_time: string;
}
