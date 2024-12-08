import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../../assets/background.jpg"; // Import the background image in PascalCase
import Styles from "./GuestView.module.css"; // Import CSS module in PascalCase
import Counter from "../../components/Counter/Counter"; // Import the reusable Counter component
import { QueueSearch } from "../../Firebase/FirebaseFunctions"; // Import QueueSearch function

const GuestView = () => {
  const [transactionId, setTransactionId] = useState(""); // State to hold transaction ID
  const navigate = useNavigate(); // Hook to navigate to other pages

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

  // Function to handle the tracking action
  const handleTrack = () => {
    if (transactionId) {
      // Define the onDataUpdate callback
      const onDataUpdate = (data: any) => {
        if (data) {
          // If data is found, navigate to the DetailedView page with the transactionId
          navigate("/DetailedView", { state: { transactionId } });
        } else {
          // Handle case where no data is found (e.g., show an alert or message)
          alert("No data found for this transaction ID.");
        }
      };

      // Call the QueueSearch function and pass the transactionId and onDataUpdate callback
      QueueSearch({ transactionId, onDataUpdate });
    } else {
      alert("Please enter a valid Transaction ID");
    }
  };

  return (
    <div className={Styles.BackgroundColor}>
      <div className={Styles.Container}>
        {/* Background image */}
        <img className={Styles.Background} src={Background} alt="dlsud-background" />

        {/* Header */}
        <header className={Styles.Header}>
          <h1>Online Ayuntamiento Queue Tracker</h1>
        </header>

        {/* Main content container */}
        <div className={Styles.FormContainer}>
          <label htmlFor="transactionId" className={Styles.Label}>
            Transaction ID:
          </label>
          <input
            type="text"
            id="transactionId"
            className={Styles.Input}
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value.toUpperCase())} // Ensure text is uppercase
            placeholder="Enter Transaction ID"
          />
          <button className={Styles.TrackButton} onClick={handleTrack}>
            <span>Track</span>
          </button>
        </div>

        {/* Counter Information */}
        <div className={Styles.CounterContainer}>
          {counters.map((counter) => (
            <Counter
              key={counter.number}
              CounterNumber={counter.number}
              CounterTitle={counter.title}
              CounterPurpose={counter.purpose}
              QueueNumber={0} // Default queue number
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuestView;
