/** @jsx jsx */
import { Global, jsx, css } from "@emotion/core";
import * as React from "react";
import * as Firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { MeetingList } from "~components/MeetingList";
import { Meeting } from "~types/Meeting";
import { colors } from "~styles/Colors";
import GitHubIcon from "../images/github.png";

const globalStyle = css`
  body {
    background-color: ${colors.backgroundWhite};
    font-size: 15px;
  }
`;

const appStyle = css`
  margin: 0 auto;
  width: 100%;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
`;

const headerStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const titleStyle = css`
  padding-left: 16px;
  padding-right: 16px;
  color: ${colors.textBlack};
`;

const descriptionStyle = css`
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 16px;
`;

const gitHubIconStyle = css`
  background-image: url(${GitHubIcon});
  background-size: contain;
  width: 36px;
  height: 36px;
  margin-right: 16px;
  opacity: 0.8;
`;

const InitializeFirebase = () => {
  // Set your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "***",
    authDomain: "***.firebaseapp.com",
    databaseURL: "https://***.firebaseio.com",
    projectId: "***",
    storageBucket: "***.appspot.com",
    messagingSenderId: "***",
    appId: "***",
  };
  Firebase.initializeApp(firebaseConfig);
};

// Set your Zoom meeting URL
const joinMeetingURL = (meetingID: string) =>
  `https://***.zoom.us/j/${meetingID}`;

export const App: React.FC = () => {
  const [meetings, setMeetings] = React.useState<Meeting[]>([]);

  React.useEffect(() => {
    if (Firebase.apps.length === 0) {
      InitializeFirebase();
    }

    const db = Firebase.firestore();

    const unsubscribe = db.collection("meetings").onSnapshot(
      snapshot => {
        const meetings = snapshot.docs.map(d => d.data() as Meeting);
        setMeetings(meetings);
      },
      error => {
        console.error(error);
      },
    );

    return unsubscribe;
  }, []);

  return (
    <section css={appStyle}>
      <Global styles={globalStyle} />
      <div css={headerStyle}>
        <h1 css={titleStyle}>さぎょイプ</h1>
        <a href="https://github.com/morishin/sagyoipu">
          <div css={gitHubIconStyle} />
        </a>
      </div>
      <div css={descriptionStyle}>
        <p>
          雑談可能な Zoom meeting に繋ぎっぱなしで作業をするところ。
          <br />
          どこに入ってもok、何も言わずに出入りok、いる人に突然話しかけてもok、何も喋らずもくもく作業しててok
        </p>
      </div>
      <div>
        <MeetingList meetings={meetings} joinMeetingURL={joinMeetingURL} />
      </div>
    </section>
  );
};
