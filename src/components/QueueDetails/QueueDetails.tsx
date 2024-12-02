import Styles from "./QueueDetails.module.css";

function QueueDetails() {
  const IdNumber = "TRN1001";
  const QueueNumber = "C1010";  // This will have the new style
  const CounterNumber = "1";
  const CurrentNumber = "C1005";

  // Example Queue Numbers for the grid
  const queueNumbers = [
    "C1005", "C1006", "C1007", "C1008", "C1009", "C1010", "C1011", "C1012",
    "C1013", "C1014", "C1015", "C1016", "C1017", "C1018", "C1019",
  ];

  return (
    <div className={Styles.MainContainer}>
      <div className={Styles.LeftContainer}>
        <div className={Styles.Container1}>
          <p>Assigned Queue Number for {IdNumber}</p>
          <p className={Styles.QueueNumber}>{QueueNumber}</p> {/* Apply style here */}
        </div>

        <div className={Styles.Container2}>
          <p className={Styles.CounterNumber}>Counter {CounterNumber}</p>
          <p>Currently Serving</p>
          <p className={Styles.CurrentNumber}>{CurrentNumber}</p>
        </div>
      </div>

      <div className={Styles.RightContainer}>
        <div className={Styles.Container3}>
          <p className={Styles.Header}>Next in Queue</p>
          <div className={Styles.Grid}>
            {queueNumbers.map((number, index) => (
              <div key={index} className={Styles.QueueItem}>
                <p>{number}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueueDetails;
