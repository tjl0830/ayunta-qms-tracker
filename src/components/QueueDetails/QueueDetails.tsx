import { useState, useEffect } from "react";
import { QueueSearch } from "../../Firebase/FirebaseFunctions";
import Styles from "./QueueDetails.module.css";
import { useNavigate } from "react-router-dom";

interface QueueData {
  AssignedTrackingId: string;
  AssignedQueueNumber: string;
  CurrentQueueNumber: string;
  CounterNumber: string;
  OtherQueueNumbers: string[];
}

function QueueDetails({ transactionId }: { transactionId: string }) {
  const [queueData, setQueueData] = useState<QueueData | null>(null);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [previousCounter, setPreviousCounter] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;
    let timer: NodeJS.Timeout;
    let navigationTimer: NodeJS.Timeout;

    const handleDataUpdate = (data: QueueData | null) => {
      if (!mounted) return;

      if (data) {
        // Check if counter has changed
        if (previousCounter !== null && previousCounter !== data.CounterNumber) {
          console.log(`Counter changed from ${previousCounter} to ${data.CounterNumber}`);
          // Reset the queue data to trigger a re-render with new counter data
          setQueueData(null);
          // Update the previous counter
          setPreviousCounter(data.CounterNumber);
          // Set the new data after a brief delay to ensure UI updates
          setTimeout(() => {
            if (mounted) {
              setQueueData(data);
            }
          }, 100);
        } else {
          setQueueData(data);
          setPreviousCounter(data.CounterNumber);
        }
      } else {
        // If no data is found and timeout has been reached
        if (timeoutReached) {
          setIsCompleted(true);
          cleanup?.();
          
          navigationTimer = setTimeout(() => {
            if (mounted) {
              navigate("/");
            }
          }, 2000);
        } else {
          setQueueData(null);
        }
      }
    };

    if (transactionId?.trim()) {
      // Start the timer for initial data fetch
      timer = setTimeout(() => {
        if (mounted) {
          setTimeoutReached(true);
          if (!queueData) {
            setIsCompleted(true);
            cleanup?.();
            navigationTimer = setTimeout(() => {
              if (mounted) {
                navigate("/");
              }
            }, 2000);
          }
        }
      }, 3000);

      cleanup = QueueSearch({
        transactionId,
        onDataUpdate: handleDataUpdate
      });
    } else {
      navigate("/");
    }

    return () => {
      mounted = false;
      clearTimeout(timer);
      clearTimeout(navigationTimer);
      if (cleanup) {
        cleanup();
      }
    };
  }, [transactionId, navigate, timeoutReached, queueData, previousCounter]);

  // Show loading message during initial load or counter change
  if (!queueData && !timeoutReached) {
    return (
      <div className={Styles.LoadingMessage}>
        <h1>
          Loading queue information...<br />
          Please wait.
        </h1>
      </div>
    );
  }

  // Show completion message before redirecting
  if (isCompleted) {
    return (
      <div className={Styles.LoadingMessage}>
        <h1>
          Your transaction has been completed.<br />
          Redirecting to home page...
        </h1>
      </div>
    );
  }

  // If we have queue data, show the queue information
  if (queueData) {
    const {
      AssignedTrackingId,
      AssignedQueueNumber,
      CurrentQueueNumber,
      CounterNumber,
      OtherQueueNumbers,
    } = queueData;

    return (
      <div className={Styles.MainContainer}>
        <div className={Styles.LeftContainer}>
          <div className={Styles.Container1}>
            <p>Assigned Queue Number for {AssignedTrackingId}</p>
            <p className={Styles.AssignedQueueNumber}>{AssignedQueueNumber}</p>
          </div>

          <div
            className={`${Styles.Container2} ${
              CurrentQueueNumber === AssignedQueueNumber ? Styles.MatchedQueue : ""
            }`}
          >
            <p className={Styles.CounterNumber}>Counter {CounterNumber}</p>
            <p>Currently Serving</p>
            <p className={Styles.CurrentQueueNumber}>{CurrentQueueNumber}</p>
          </div>
        </div>

        <div className={Styles.RightContainer}>
          <div className={Styles.Container3}>
            <p className={Styles.Header}>Next in Queue</p>
            <div className={Styles.Grid}>
              {OtherQueueNumbers.map((number: string, index: number) => {
                const isAssignedQueue = number.includes(AssignedQueueNumber);
                return (
                  <div
                    key={index}
                    className={`${Styles.QueueItem} ${
                      isAssignedQueue ? Styles.AssignedQueue : ""
                    }`}
                  >
                    <p>{number}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default QueueDetails;
