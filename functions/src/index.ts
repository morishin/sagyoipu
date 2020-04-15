import * as Functions from "firebase-functions";
import * as Admin from "firebase-admin";
import {
  PariticapntJoinedMeetingEvent,
  ParticipantLeftMeetingEvent,
} from "./WebhookEvent";
import * as FirestoreSchema from "./FirestoreSchema";

Admin.initializeApp(Functions.config().firebase);

const meetingIDs: string[] = Functions.config().meeting_ids || [];
if (meetingIDs.length === 0) {
  console.warn("Meeting IDs are not set to functions:config.");
}

export const handleZoomWebhook = Functions.region(
  "asia-northeast1"
).https.onRequest(async (req, res) => {
  switch (req.body.event) {
    case "meeting.participant_joined":
      await handleJoined(req.body.payload);
      break;
    case "meeting.participant_left":
      await handleLeft(req.body.payload);
      break;
    default:
      throw new Error(`Unexpected event type: ${req.body.event}`);
  }
  res.sendStatus(204);
});

const handleJoined = async (
  event: PariticapntJoinedMeetingEvent["payload"]
) => {
  const meeting = event.object;
  const participant = meeting.participant;

  if (!meetingIDs.includes(meeting.id)) {
    console.log(`ℹ️ joined\n${JSON.stringify(meeting)}`);
    return;
  }

  console.log(`🍵 joined\n${JSON.stringify(meeting)}`);

  const meetingRef = Admin.firestore().collection("meetings").doc(meeting.id);
  const meetingDoc = await meetingRef.get();
  if (meetingDoc.exists) {
    const meetingData = meetingDoc.data() as FirestoreSchema.Meeting;
    const newParticipants = [
      participant,
      ...meetingData.participants.filter(
        (p) => p.user_id !== participant.user_id
      ),
    ];
    const updateFields: Partial<FirestoreSchema.Meeting> = {
      participants: newParticipants,
    };
    await meetingRef.update(updateFields);
  } else {
    const newMeeting: FirestoreSchema.Meeting = {
      ...meeting,
      participants: [participant],
    };
    await meetingRef.set(newMeeting);
  }
};

const handleLeft = async (event: ParticipantLeftMeetingEvent["payload"]) => {
  const meeting = event.object;
  const participant = event.object.participant;

  if (!meetingIDs.includes(meeting.id)) {
    console.log(`ℹ️ left\n${JSON.stringify(meeting)}`);
    return;
  }

  console.log(`👋 left\n${JSON.stringify(meeting)}`);

  const meetingRef = Admin.firestore().collection("meetings").doc(meeting.id);
  const meetingDoc = await meetingRef.get();
  if (meetingDoc.exists) {
    const meetingData = meetingDoc.data() as FirestoreSchema.Meeting;
    const newParticipants = meetingData.participants.filter(
      (p) => p.user_id !== participant.user_id
    );
    const updateFields: Partial<FirestoreSchema.Meeting> = {
      participants: newParticipants,
    };
    await meetingRef.update(updateFields);
  }
};
