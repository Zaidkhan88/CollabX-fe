import React from "react";
import { useMeetingAppContext } from "../MeetingAppContextDef.jsx";
import { ParticipantView } from "./ParticipantView.jsx";

const MemoizedParticipant = React.memo(
  ParticipantView,
  (prevProps, nextProps) => {
    return prevProps.participantId === nextProps.participantId;
  }
);

function ParticipantGrid({ participantIds, isPresenting }) {
  const { sideBarMode } = useMeetingAppContext();
  const isMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;

  let perRow;

  if (isMobile || isPresenting) {
    if (participantIds.length < 4) {
      perRow = 1;
    } else if (participantIds.length < 9) {
      perRow = 2;
    } else {
      perRow = 3;
    }
  } else {
    if (participantIds.length < 5) {
      perRow = 2;
    } else if (participantIds.length < 7) {
      perRow = 3;
    } else if (participantIds.length < 9) {
      perRow = 4;
    } else if (participantIds.length < 10) {
      perRow = 3;
    } else if (participantIds.length < 11) {
      perRow = 4;
    } else {
      perRow = 4;
    }
  }
  

  return (
    <div
      className={`flex flex-col md:flex-row flex-grow m-3 items-center justify-center ${
        participantIds.length < 2 && !sideBarMode && !isPresenting
          ? "md:px-16 md:py-2"
          : participantIds.length < 3 && !sideBarMode && !isPresenting
          ? "md:px-16 md:py-8"
          : participantIds.length < 4 && !sideBarMode && !isPresenting
          ? "md:px-16 md:py-4"
          : participantIds.length > 4 && !sideBarMode && !isPresenting
          ? "md:px-14"
          : "md:px-0"
      }`}
    >
      <div className="flex flex-col w-full h-full">
        {Array.from(
          { length: Math.ceil(participantIds.length / perRow) },
          (_, i) => {
            return (
              <div
                key={`participant-${i}`}
                className={`flex flex-1 ${
                  isPresenting
                    ? participantIds.length === 1
                      ? "justify-start items-start"
                      : "items-center justify-center"
                    : "items-center justify-center"
                }`}
              >
                {participantIds
                  .slice(i * perRow, (i + 1) * perRow)
                  .map((participantId) => {
                    return (
                      <div
                        key={`participant_${participantId}`}
                        className={`flex flex-1 ${
                          isPresenting
                            ? participantIds.length === 1
                              ? "md:h-48 md:w-44 xl:w-52 xl:h-48 "
                              : participantIds.length === 2
                              ? "md:w-44 xl:w-56"
                              : "md:w-44 xl:w-48"
                            : "w-full"
                        } items-center justify-center h-full ${
                          participantIds.length === 1
                            ? "md:max-w-7xl 2xl:max-w-[1480px] "
                            : "md:max-w-lg 2xl:max-w-2xl"
                        }  overflow-hidden  p-1`}
                      >
                        <MemoizedParticipant participantId={participantId} />
                      </div>
                    );
                  })}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

export const MemoizedParticipantGrid = React.memo(
  ParticipantGrid,
  (prevProps, nextProps) => {
    return (
      JSON.stringify(prevProps.participantIds) ===
        JSON.stringify(nextProps.participantIds) &&
      prevProps.isPresenting === nextProps.isPresenting
    );
  }
);
