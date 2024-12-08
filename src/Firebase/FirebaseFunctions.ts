import { ref, onValue, off, DataSnapshot } from "firebase/database";
import { database } from "./FirebaseConfig";

// Interface for the queue item in Firebase
interface QueueItem {
  trackingId: string;
  queueNumber: string;
}

// Interface for the counter's queue structure
interface CounterQueue {
  queue: Record<string, QueueItem>;
}

// Interface for the entire counters data structure
interface CountersData {
  [key: string]: CounterQueue;
}

interface QueueData {
  AssignedTrackingId: string;
  AssignedQueueNumber: string;
  CurrentQueueNumber: string;
  CounterNumber: string;
  OtherQueueNumbers: string[];
}

interface QueueSearchProps {
  transactionId: string;
  onDataUpdate: (data: QueueData | null) => void;
}

export function QueueSearch({ transactionId, onDataUpdate }: QueueSearchProps) {
  // Validate transaction ID
  if (!transactionId?.trim()) {
    onDataUpdate(null);
    return () => {};
  }

  const trimmedUniqueId = transactionId.trim().toUpperCase();
  const queueRef = ref(database, "counters");
  let isSubscribed = true;

  // Create the listener function
  const handleDataChange = (snapshot: DataSnapshot) => {
    if (!isSubscribed) return;

    const countersData = snapshot.val() as CountersData | null;

    if (!countersData) {
      onDataUpdate(null);
      return;
    }

    let queueInfo: QueueData | null = null;

    try {
      // More efficient loop that breaks as soon as we find the match
      counterLoop: for (const counterKey in countersData) {
        const queueList = countersData[counterKey]?.queue;
        
        if (!queueList) continue;

        const queueEntries = Object.entries(queueList) as [string, QueueItem][];
        if (queueEntries.length === 0) continue;

        // Get the first queue item for current number
        const [_, firstItem] = queueEntries[0];
        const currentQueueNumber = firstItem.queueNumber;

        // Find the matching transaction
        for (const [, queueData] of queueEntries) {
          if (queueData.trackingId === trimmedUniqueId) {
            const otherQueueNumbers = queueEntries
              .map(([, data]) => data.queueNumber)
              .filter(num => num !== currentQueueNumber);

            queueInfo = {
              AssignedTrackingId: queueData.trackingId,
              AssignedQueueNumber: queueData.queueNumber,
              CurrentQueueNumber: currentQueueNumber,
              CounterNumber: counterKey,
              OtherQueueNumbers: otherQueueNumbers
            };
            
            break counterLoop;
          }
        }
      }

      if (isSubscribed) {
        onDataUpdate(queueInfo);
      }
    } catch (error) {
      console.error("Error processing queue data:", error);
      if (isSubscribed) {
        onDataUpdate(null);
      }
    }
  };

  // Attach the listener
  onValue(queueRef, handleDataChange, (error) => {
    console.error("Error fetching data:", error);
    if (isSubscribed) {
      onDataUpdate(null);
    }
  });

  // Return cleanup function
  return () => {
    isSubscribed = false;
    off(queueRef, 'value', handleDataChange);
  };
}
