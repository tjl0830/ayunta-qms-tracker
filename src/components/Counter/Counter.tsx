import React from "react";
import styles from "./Counter.module.css";

interface CounterProps {
  CounterNumber: number;
  CounterTitle: string;
  CounterPurpose: string;
  QueueNumber: number;
}

const Counter: React.FC<CounterProps> = ({
  CounterNumber,
  CounterTitle,
  CounterPurpose,
  QueueNumber,
}) => {
  // Split CounterPurpose by newline character '\n' and render with <br />
  const formattedPurpose = CounterPurpose.split("\n").map((part, index) => (
    <React.Fragment key={index}>
      {part}
      {index < CounterPurpose.split("\n").length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <div
      className={styles.Counter}
      aria-labelledby={`counter-${CounterNumber}`}
    >
      <div className={styles.CounterName}>
        <h2 id={`counter-${CounterNumber}`} className={styles.CounterTitle}>
          {CounterTitle}
        </h2>
        <p className={styles.CounterPurpose}>{formattedPurpose}</p>{" "}
        {/* Render formatted purpose */}
      </div>
      <div className={styles.QueueNumber}>
        <p>{QueueNumber}</p>
      </div>
    </div>
  );
};

export default Counter;
