import { useState, useEffect } from "react";
import { QueueSearch } from "../../Firebase/FirebaseFunctions"; // Import the QueueSearch function
import Styles from "./QueueDetails.module.css";
import { useNavigate } from "react-router-dom";

function QueueDetails({ transactionId }: { transactionId: string }) {
  const [queueData, setQueueData] = useState<any>(null);
  const [timeoutReached, setTimeoutReached] = useState(false); // To track if timeout has been reached
  const navigate = useNavigate(); // Hook to navigate to other pages

  // Update the queue data when the database updates
  const handleDataUpdate = (data: any) => {
    setQueueData(data);
  };

  useEffect(() => {
    // Fetch the queue details when the component mounts or the transactionId changes
    if (transactionId) {
      QueueSearch({ transactionId, onDataUpdate: handleDataUpdate });
    }

    // Set a timeout to navigate after 3 seconds if no data is found
    const timer = setTimeout(() => {
      setTimeoutReached(true); // Mark that timeout has occurred
      if (!queueData) {
        navigate("/"); // Navigate to GuestView page
      }
    }, 3000); // Adjust the timeout duration as necessary

    // Clean up the timeout when the component unmounts or data is fetched
    return () => clearTimeout(timer);
  }, [transactionId, queueData, navigate]); // Add queueData in dependencies to reset timeout when data arrives

  // Prevent rendering before data is fetched
  if (queueData === null && !timeoutReached) {
    return (
      <div className={Styles.LoadingMessage}>
        <h1>
          Your transaction has been successfully completed.<br />
          Thank you for your business.
        </h1>
      </div>
    ); // Optionally, show a loading spinner or message
  }

  // If queueData is empty or invalid, redirect
  if (!queueData && timeoutReached) {
    return null; // Optionally, you can show a message or loading state before redirecting
  }

  // Destructure the fetched data safely after queueData is confirmed
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
            CurrentQueueNumber === AssignedQueueNumber
              ? Styles.MatchedQueue
              : ""
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
              const isAssignedQueue = number.includes(AssignedQueueNumber); // Check if this number is the assigned one

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

export default QueueDetails;
