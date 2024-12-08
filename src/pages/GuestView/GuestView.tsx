import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../../assets/background.jpg";
import Styles from "./GuestView.module.css";
import Counter from "../../components/Counter/Counter";
import { QueueSearch } from "../../Firebase/FirebaseFunctions";
import { ref, onValue } from "firebase/database";
import { database } from "../../Firebase/FirebaseConfig";


const GuestView = () => {
  const [transactionId, setTransactionId] = useState("");
  const [queueCounts, setQueueCounts] = useState<{ [key: number]: number }>({});
  const navigate = useNavigate();

  // Array containing counter data
  const counters = [
    { number: 1, title: "COUNTER 1", purpose: "Requesting and \n Claiming of Documents" },
    { number: 2, title: "COUNTER 2", purpose: "Submission of Records" },
    { number: 3, title: "COUNTER 3", purpose: "Evaluation \n (Graduate Studies, BTM, BHM, MKA, MMA)" },
    { number: 4, title: "COUNTER 4", purpose: "Evaluation \n (COed, CCJE, CLAC, CSCS)" },
    { number: 5, title: "COUNTER 5", purpose: "Evaluation \n (CEAT Programs)" },
    { number: 6, title: "COUNTER 6", purpose: "Registration" },
    { number: 7, title: "COUNTER 7", purpose: "ID Card Application" },
    { number: 8, title: "COUNTER 8", purpose: "Submitting of Payables \n (Payable Section)" },
    { number: 9, title: "COUNTER 9", purpose: "Submitting of Payables \n (Payable Section)" },
    { number: 10, title: "COUNTER 10", purpose: "Student Clearance and \n Unholding of Student Portal" },
    { number: 11, title: "COUNTER 11", purpose: "Releasing of Checks" },
    { number: 12, title: "COUNTER 12", purpose: "Assessment and Invoice" },
    { number: 14, title: "COUNTER 14", purpose: "Cashier" },
    { number: 15, title: "COUNTER 15", purpose: "Cashier" },
    { number: 16, title: "COUNTER 16", purpose: "Cashier" },
  ];

  useEffect(() => {
    // Set up listeners for all counters
    const unsubscribes = counters.map(counter => {
      const queueRef = ref(database, `counters/${counter.number}/queue`);
      
      return onValue(queueRef, (snapshot) => {
        const queueData = snapshot.val();
        const count = queueData ? Object.keys(queueData).length : 0;
        
        setQueueCounts(prevCounts => ({
          ...prevCounts,
          [counter.number]: count
        }));
      });
    });

    // Cleanup function to remove all listeners
    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to handle the tracking action
  const handleTrack = () => {
    if (transactionId) {
      const onDataUpdate = (data: any) => {
        if (data) {
          navigate("/DetailedView", { state: { transactionId } });
        } else {
          alert("No data found for this transaction ID.");
        }
      };

      QueueSearch({ transactionId, onDataUpdate });
    } else {
      alert("Please enter a valid Transaction ID");
    }
  };

  return (
    <div className={Styles.BackgroundColor}>
      <div className={Styles.Container}>
        <img className={Styles.Background} src={Background} alt="dlsud-background" />

        <header className={Styles.Header}>
          <h1>Online Ayuntamiento Queue Tracker</h1>
        </header>

        <div className={Styles.FormContainer}>
          <label htmlFor="transactionId" className={Styles.Label}>
            Transaction ID:
          </label>
          <input
            type="text"
            id="transactionId"
            className={Styles.Input}
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
            placeholder="Enter Transaction ID"
          />
          <button className={Styles.TrackButton} onClick={handleTrack}>
            <span>Track</span>
          </button>
        </div>

        <div className={Styles.CounterContainer}>
          {counters.map((counter) => (
            <Counter
              key={counter.number}
              CounterNumber={counter.number}
              CounterTitle={counter.title}
              CounterPurpose={counter.purpose}
              QueueNumber={queueCounts[counter.number] || 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuestView;
