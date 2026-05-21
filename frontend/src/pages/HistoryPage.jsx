export default function HistoryPage() {
  const history = JSON.parse(
    localStorage.getItem("phish_history") || "[]"
  );

  return (
    <div style={{ padding: "30px" }}>
      <h2>📜 Scan History</h2>

      {history.length === 0 ? (
        <p>No links checked yet.</p>
      ) : (
        <table width="100%" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>URL</th>
              <th>Result</th>
              <th>Confidence</th>
              <th>Checked At</th>
            </tr>
          </thead>

          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td style={{ wordBreak: "break-all" }}>
                  {item.url}
                </td>

                <td
                  style={{
                    color:
                      item.prediction === "phishing"
                        ? "red"
                        : "green",
                    fontWeight: "bold"
                  }}
                >
                  {item.prediction}
                </td>

                <td>
                  {(item.confidence * 100).toFixed(2)}%
                </td>

                <td>
                  {new Date(item.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
