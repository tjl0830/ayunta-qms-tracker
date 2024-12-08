import { ref, onValue } from "firebase/database";
import { database } from "./FirebaseConfig"; // Firebase config import

interface QueueSearchProps {
  transactionId: string;
  onDataUpdate: (data: any) => void; // Callback to notify when data is updated
}

export function QueueSearch({ transactionId, onDataUpdate }: QueueSearchProps) {
  const trimmedUniqueId = transactionId.trim().toUpperCase();

  if (!trimmedUniqueId) {
    alert("Please enter your unique identifier.");
    return;
  }

  const queueRef = ref(database, "counters");

  // Listen for data changes in real time
  onValue(
    queueRef,
    (snapshot) => {
      const countersData = snapshot.val();

      if (!countersData) {
        alert("No counters found.");
        return;
      }

      let found = false;
      let AssignedTrackingId: string = "";
      let AssignedQueueNumber: string = "";
      let CurrentQueueNumber: string = "";
      let CounterNumber: string = "";
      let OtherQueueNumbers: string[] = [];

      // Loop through the counters data to find matching transaction ID
      for (const counterKey in countersData) {
        const queueList = countersData[counterKey]?.queue;

        if (queueList) {
          for (const queueId in queueList) {
            const queueData = queueList[queueId];

            if (queueData.trackingId === trimmedUniqueId) {
              const firstKey = Object.keys(queueList)[0];
              const firstItem = queueList[firstKey];
              CurrentQueueNumber = firstItem.queueNumber;

              found = true;

              // Collect data for other queue numbers
              for (const otherQueueId in queueList) {
                const otherQueueData = queueList[otherQueueId];

                if (otherQueueId === firstKey) {
                  AssignedTrackingId = queueData.trackingId;
                  AssignedQueueNumber = queueData.queueNumber;
                  continue;
                }

                if (otherQueueId === queueId) {
                  AssignedTrackingId = queueData.trackingId;
                  AssignedQueueNumber = queueData.queueNumber;
                  OtherQueueNumbers.push(`${AssignedQueueNumber}`);
                } else {
                  let QueueNumberData = otherQueueData.queueNumber;
                  OtherQueueNumbers.push(QueueNumberData);
                }
              }

              CounterNumber = counterKey;
              break;
            }
          }
        }

        if (found) {
          break;
        }
      }

      if (found) {
        // Update state in the parent component via the callback
        onDataUpdate({
          AssignedTrackingId,
          AssignedQueueNumber,
          CurrentQueueNumber,
          CounterNumber,
          OtherQueueNumbers,
        });
      } else {
        console.log("Your unique identifier was not found in any queue.");
        onDataUpdate(null);
      }
    },
    (error) => {
      console.error("Error fetching data from Firebase:", error);
    }
  );

  // The function doesn't need to return anything as onValue handles the real-time updates
}
