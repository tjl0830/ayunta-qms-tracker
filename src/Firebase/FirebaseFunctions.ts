// Import necessary Firebase functions
import { ref, get } from "firebase/database";
import { database } from "./FirebaseConfig"; // Firebase config import

interface QueueSearchProps {
  transactionId: string;
}

export async function QueueSearch({ transactionId }: QueueSearchProps) {
  // Trim and format the transactionId for consistency
  const trimmedUniqueId = transactionId.trim().toUpperCase();

  // Input validation: Ensure transactionId is provided
  if (!trimmedUniqueId) {
    alert("Please enter your unique identifier.");
    return;
  }

  // Reference to the counters node in the Firebase database
  const queueRef = ref(database, "counters");

  try {
    // Fetch data from Firebase once
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
    let CounterNumber: string = "";
    let OtherQueueNumbers: string = "";

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

            // Prepare the result string with found data
            found = true;

            // Loop through the queueList and append all other queue positions
            for (const otherQueueId in queueList) {
              const otherQueueData = queueList[otherQueueId];

              if (otherQueueId === firstKey) continue; // Skip the first item

              if (otherQueueId === queueId) {
                // Add the found queue position with trackingId
                AssignedTrackingId = queueData.trackingId;
                AssignedQueueNumber = queueData.queueNumber;
                OtherQueueNumbers += `${AssignedQueueNumber}(${AssignedTrackingId})\n`;
              } else {
                // Add other queue positions
                let QueueNumberData = otherQueueData.queueNumber;
                OtherQueueNumbers += `${QueueNumberData}\n`;
              }
            }
            CounterNumber = counterKey; // Store the counter where the trackingId was found
            result += `Assigned Tracking ID: ${AssignedTrackingId}\n`;
            result += `Assigned Queue Number: ${AssignedQueueNumber}\n`;
            result += `Counter ${counterKey}:\n`;
            result += `Currently Serving: ${CurrentQueueNumber}:\n`;
            result += `\nQueue Numbers:\n${OtherQueueNumbers}`;
            break; // Stop checking other counters once the ID is found
          }
        }
      }

      if (found) {
        break; // Exit the loop once the ID is found
      }
    }

    // Log the result to console or show a message if not found
    if (found) {
      console.log(result);
    } else {
      console.log("Your unique identifier was not found in any queue.");
    }
  } catch (error) {
    // Handle errors with the database call
    console.error("Error fetching data from Firebase:", error);
  }
}
