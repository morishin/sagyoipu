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
}
