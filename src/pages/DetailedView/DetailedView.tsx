import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Background from "../../assets/background.jpg";
import Styles from "../GuestView/GuestView.module.css";
import QueueDetails from "../../components/QueueDetails/QueueDetails";

const DetailedView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { transactionId } = location.state || {};
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    console.log("test");
    // If no transactionId is provided, redirect to home
    if (!transactionId) {
      navigate("/");
      return;
    }

    setMounted(true);

    // Cleanup when component unmounts
    return () => {
      setMounted(false);
    };
  }, [transactionId, navigate]);

  const handleGoBack = () => {
    setMounted(false); // Unmount QueueDetails before navigation
    navigate("/");
  };

  // If not mounted or no transactionId, don't render anything
  if (!mounted || !transactionId) {
    return null;
  }

  return (
    <div className={Styles.BackgroundColor}>
      <div className={Styles.Container}>
        <img
          className={Styles.Background}
          src={Background}
          alt="dlsud-background"
        />

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
            readOnly
            placeholder="Transaction ID (Read-Only)"
          />
          <button className={Styles.TrackButton} onClick={handleGoBack}>
            <span>Go Back</span>
          </button>
        </div>

        {mounted && (
          <div className={Styles.QueueDetailsContainer}>
            <QueueDetails transactionId={transactionId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedView;
