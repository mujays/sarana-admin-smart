export const UnderConstruction = () => {
  return (
    <div
      style={{
        height: "calc(100dvh - 65px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <div
          style={{
            height: "80px",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "28px",
                fontWeight: 600,
                marginBottom: 0,
              }}
            >
              Oops...
            </p>
            <p
              style={{
                color: "#787878",
                fontSize: "16px",
              }}
            >
              This feature is{" "}
              <strong
                style={{
                  fontWeight: 600,
                }}
              >
                under development,
              </strong>
              <br /> and will ready soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
