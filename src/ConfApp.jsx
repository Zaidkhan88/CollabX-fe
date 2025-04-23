import React, { useState, useEffect, lazy, Suspense, startTransition } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";

// const MeetingAppProvider = lazy(() => import("./MeetingAppContextDef"));
// const MeetingContainer = lazy(() => import("./meetingMeeting/MeetingContainer"));
// const LeaveScreen = lazy(() => import("./meetingComp/screens/LeaveScreen"));
// const JoiningScreen = lazy(() => import("./meetingComp/screens/JoiningScreen"));

import { MeetingAppContext, MeetingAppProvider} from "./MeetingAppContextDef.jsx";
import MeetingContainer from "./meetingMeeting/MeetingContainer.jsx";
import LeaveScreen from "./meetingComp/screens/LeaveScreen.jsx";
import JoiningScreen from "./meetingComp/screens/JoiningScreen";
function ConfApp() {
  const [token, setToken] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [micOn, setMicOn] = useState(false);
  const [webcamOn, setWebcamOn] = useState(false);
  const [customAudioStream, setCustomAudioStream] = useState(null);
  const [customVideoStream, setCustomVideoStream] = useState(null);
  const [isMeetingStarted, setMeetingStarted] = useState(false);
  const [isMeetingLeft, setIsMeetingLeft] = useState(false);
  const isMobile = window.matchMedia("only screen and (max-width: 768px)").matches;

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };
    }
  }, [isMobile]);

  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/good-morning`, {
          method: "GET"
        });
        console.log(`Server response: ${await res.text()}`);
      } catch (error) {
        console.error("Error waking up the server:", error);
      }
    };

    wakeUpServer();
  }, []);

  return (
    <>
      <MeetingAppProvider>
        <Suspense fallback={<div>Loading...</div>}>
          {isMeetingStarted ? (
            <MeetingProvider
              config={{
                meetingId,
                micEnabled: micOn,
                webcamEnabled: webcamOn,
                name: participantName ? participantName : "TestUser",
                multiStream: true,
                customCameraVideoTrack: customVideoStream,
                customMicrophoneAudioTrack: customAudioStream
              }}
              token={token}
              reinitialiseMeetingOnConfigChange={true}
              joinWithoutUserInteraction={true}
            >
              <MeetingContainer
                onMeetingLeave={() => {
                  setToken("");
                  setMeetingId("");
                  setParticipantName("");
                  setWebcamOn(false);
                  setMicOn(false);
                  setMeetingStarted(false);
                }}
                setIsMeetingLeft={setIsMeetingLeft}
              />
            </MeetingProvider>
          ) : isMeetingLeft ? (
            <LeaveScreen setIsMeetingLeft={setIsMeetingLeft} />
          ) : (
            <JoiningScreen
              participantName={participantName}
              setParticipantName={setParticipantName}
              setMeetingId={setMeetingId}
              setToken={setToken}
              micOn={micOn}
              setMicOn={setMicOn}
              webcamOn={webcamOn}
              setWebcamOn={setWebcamOn}
              customAudioStream={customAudioStream}
              setCustomAudioStream={setCustomAudioStream}
              customVideoStream={customVideoStream}
              setCustomVideoStream={setCustomVideoStream}
             onClickStartMeeting={() => {
    startTransition(() => {
      setMeetingStarted(true);
    });
  }}
              startMeeting={isMeetingStarted}
              setIsMeetingLeft={setIsMeetingLeft}
            />
          )}
        </Suspense>
      </MeetingAppProvider>
    </>
  );
}

export default ConfApp;
