const OverviewCard = () => {
  // test data
  const gameTitle = "Testnet Demo Competition";
  const rewardPool = "1.21";
  const txCount = 86;
  const userCount = 35;
  const endsIn = "15:43:28";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "white",
        color: "black",
        padding: "2rem",
        flexDirection: "column",
				borderRadius: "10px",
      }}
    >
      <span style={{ fontSize: "2rem", fontWeight: 700 }}>{gameTitle}</span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "2rem 0",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: ".8rem 2rem",
            backgroundColor: "#E2E2E2",
            borderRadius: "10px",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <img
              src="https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png"
              style={{ height: "30px" }}
            />
            <span style={{ fontSize: "2rem", fontWeight: 700 }}>
              {rewardPool}
            </span>
          </div>
          <span style={{ fontSize: "1.1rem" }}>reward pool</span>
        </div>
        <div
          style={{
            display: "flex",
            padding: ".8rem 2rem",
            backgroundColor: "#E2E2E2",
            borderRadius: "10px",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "2rem", fontWeight: 700 }}>{txCount}</span>
          <span style={{ fontSize: "1.1rem" }}>transactions</span>
        </div>
        <div
          style={{
            display: "flex",
            padding: ".8rem 2rem",
            backgroundColor: "#E2E2E2",
            borderRadius: "10px",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "2rem", fontWeight: 700 }}>{userCount}</span>
          <span style={{ fontSize: "1.1rem" }}>participants</span>
        </div>
      </div>
      <span style={{ fontSize: "1.3rem" }}>
        Ends in <span style={{ fontWeight: 700 }}>{endsIn}</span>
      </span>
    </div>
  );
};

export default OverviewCard;
