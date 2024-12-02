import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Background from "../../assets/background.jpg"; // Import the background image in PascalCase
import Styles from "../GuestView/GuestView.module.css"; // Import CSS module in PascalCase
import QueueDetails from "../../components/QueueDetails/QueueDetails"; // The component to display below the form

const DetailedView = () => {
  const navigate = useNavigate(); // Hook to navigate to other pages
  const location = useLocation(); // Get the location object
  const { transactionId } = location.state || {}; // Extract transactionId from state

  // If transactionId is not available, you can set a fallback or show an error.
  const [transactionIdState, setTransactionIdState] = useState(
    transactionId || "No Transaction ID Found"
  );

  useEffect(() => {
    // If transactionId is found, set it to the state
    if (transactionId) {
      setTransactionIdState(transactionId);
    }
  }, [transactionId]);

  // Function to navigate back to the GuestView page
  const handleGoBack = () => {
    navigate("/"); // Navigate to GuestView page
  };

  return (
    <div className={Styles.BackgroundColor}>
      <div className={Styles.Container}>
        {/* Background image */}
        <img
          className={Styles.Background}
          src={Background}
          alt="dlsud-background"
        />

        {/* Header */}
        <header className={Styles.Header}>
          <h1>Online Ayuntamiento Queue Tracker</h1>
        </header>

        {/* Form container for the form fields */}
        <div className={Styles.FormContainer}>
          <label htmlFor="transactionId" className={Styles.Label}>
            Transaction ID:
          </label>
          <input
            type="text"
            id="transactionId"
            className={Styles.Input}
            value={transactionIdState} // Set the value from the state
            readOnly // Make the input field read-only
            placeholder="Transaction ID (Read-Only)"
          />
          <button className={Styles.TrackButton} onClick={handleGoBack}>
            <span>Go Back</span>
          </button>
        </div>

        {/* QueueDetails component placed outside the form container */}
        <div className={Styles.QueueDetailsContainer}>
          <QueueDetails />
        </div>
      </div>
    </div>
  );
};

export default DetailedView;
