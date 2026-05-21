fetch("http://localhost:5001/api/dashboard")
  .then(res => res.json())
  .then(data => {

    // ====== UPDATE CARDS ======
    document.getElementById("total").innerText = data.total;
    document.getElementById("phishing").innerText = data.phishing;
    document.getElementById("deepfake").innerText = data.deepfake;

    // ====== TABLE ======
    const tbody = document.getElementById("activity");
    tbody.innerHTML = "";

    data.recent.forEach(r => {
      const color = r.confidence > 70 ? "#ef4444" : "#22c55e";
      tbody.innerHTML += `
        <tr>
          <td>${r.type}</td>
          <td style="color:${color}">${r.result}</td>
          <td>${r.confidence}%</td>
          <td>${new Date(r.time).toLocaleTimeString()}</td>
        </tr>
      `;
    });

    // ====== 1️⃣ DONUT CHART ======
    new Chart(document.getElementById("threatChart"), {
      type: "doughnut",
      data: {
        labels: ["Phishing", "Deepfake"],
        datasets: [{
          data: [data.phishing, data.deepfake],
          backgroundColor: ["#ef4444", "#f59e0b"],
          borderWidth: 0
        }]
      },
      options: {
        plugins: {
          legend: { labels: { color: "#e5e7eb" } }
        }
      }
    });

    // ====== 2️⃣ TIMELINE CHART ======
    const times = data.recent
      .map(r => new Date(r.time).toLocaleTimeString())
      .reverse();

    new Chart(document.getElementById("timelineChart"), {
      type: "line",
      data: {
        labels: times,
        datasets: [{
          label: "Detections",
          data: data.recent.map(() => 1),
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.2)",
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        scales: {
          x: { ticks: { color: "#94a3b8" } },
          y: { ticks: { color: "#94a3b8" } }
        },
        plugins: {
          legend: { labels: { color: "#e5e7eb" } }
        }
      }
    });

    // ====== 3️⃣ CONFIDENCE BAR CHART ======
    new Chart(document.getElementById("confidenceChart"), {
      type: "bar",
      data: {
        labels: data.recent.map(r => r.type),
        datasets: [{
          label: "Confidence (%)",
          data: data.recent.map(r => r.confidence),
          backgroundColor: "#38bdf8"
        }]
      },
      options: {
        scales: {
          x: { ticks: { color: "#94a3b8" } },
          y: {
            ticks: { color: "#94a3b8" },
            max: 100
          }
        },
        plugins: {
          legend: { labels: { color: "#e5e7eb" } }
        }
      }
    });

  })
  .catch(err => console.error("Dashboard error:", err));
