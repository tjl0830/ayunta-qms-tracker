// Import necessary Firebase functions
import { ref, get } from "firebase/database";
import { database } from "./FirebaseConfig"; // Firebase config import

interface QueueSearchProps {
  transactionId: string;
}

export async function QueueSearch({ transactionId }: QueueSearchProps) {
  // Trim and format the transactionId
  const trimmedUniqueId = transactionId.trim().toUpperCase();

  // Input validation
  if (!trimmedUniqueId) {
    alert("Please enter your unique identifier.");
    return;
  }

  // Reference to the counters node in the database
  const queueRef = ref(database, "counters");

  try {
    // Fetch the data from Firebase once
    const snapshot = await get(queueRef);
    const countersData = snapshot.val();

    // Check if counters data exists
    if (!countersData) {
      alert("No counters found.");
      return;
    }

    let found = false;
    let result: string = "Queue Data: \n";
    let AssignedTrackingId: string = "";
    let AssignedQueueNumber: string = "";
    let CurrentQueueNumber: string = "";
    let counter: string = "";

    // Iterate through all counters
    for (const counterKey in countersData) {
      const queueList = countersData[counterKey]?.queue;

      if (queueList) {
        // Iterate through the queueList to find the entry matching the trackingId
        for (const queueId in queueList) {
          const queueData = queueList[queueId]; // Contains queueNumber and trackingId

          if (queueData.trackingId === trimmedUniqueId) {
            // Get the first item in the queue
            const firstKey = Object.keys(queueList)[0];
            const firstItem = queueList[firstKey];
            CurrentQueueNumber = firstItem.queueNumber;

            // Update found status and prepare the result string
            found = true;
            result += `Counter ${counterKey}:\n`;
            result += `Currently Serving: ${CurrentQueueNumber}:\n`;

            // Loop through the queueList and append all other queue positions
            for (const otherQueueId in queueList) {
              if (otherQueueId === firstKey) continue; // Skip the first item
              const otherQueueData = queueList[otherQueueId];
              if (otherQueueId === queueId) {
                // Add the found queue position with trackingId
                AssignedTrackingId = queueData.trackingId;
                AssignedQueueNumber = queueData.queueNumber;
                result += `${queueData.queueNumber} (${queueData.trackingId})\n`;
              } else {
                result += `${otherQueueData.queueNumber}\n`; // Add other queue positions
              }
            }

            result += "\n";
            counter = counterKey; // Store the counter where the trackingId was found
            break; // Stop checking other counters once we found the ID
          }
        }
      }

      if (found) {
        break; // Exit the loop once the ID is found
      }
    }

    if (found) {
      // Log the queue data to console
      console.log(result);
      let result2 = "";
      result2 += `Assigned Tracking ID: ${AssignedTrackingId}\n`;
      result2 += `Assigned Queue Number: ${AssignedQueueNumber}\n`;
      result2 += `Counter ${counter}\n`;
      result2 += `Currently Serving: ${CurrentQueueNumber}`;
      console.log(result2); // Log additional details
    } else {
      console.log("Your unique identifier was not found in any queue.");
    }

  } catch (error) {
    // Handle errors with the database call
    console.error("Error fetching data from Firebase:", error);
  }
}
