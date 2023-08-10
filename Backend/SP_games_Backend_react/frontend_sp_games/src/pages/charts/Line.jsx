import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

const getMonthName = (monthNumber) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[monthNumber - 1]; // Adjusting for zero-based array index
};

const LineChart = () => {
  const [chartData, setChartData] = useState([]);
  const [timeSpan, setTimeSpan] = useState("months"); // Default time span is months
  const [userType, setUserType] = useState("all"); // Default user type is all
  const getTimeUnitLabel = (timeUnit, timeSpan) => {
    if (timeSpan === "weeks") {
      const weekNumber = timeUnit % 100; // Extract the week number from the timeUnit
      const year = Math.floor(timeUnit / 100); // Extract the year from the timeUnit
      return `Week ${weekNumber}, ${year}`;
    } else if (timeSpan === "years") {
      return `${timeUnit}`;
    } else {
      return getMonthName(timeUnit);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, [timeSpan, userType]);

// Inside LineChart component
const fetchData = () => {
  // Fetch data from the backend API
  axios.get("/getLinesChart", {
    params: {
      timeSpan,
      userType,
    },
  })
    .then((response) => {
      // Convert numeric x values to human-readable formats
      const chartDataWithTimeLabels = response.data.map((item) => ({
        x: getTimeUnitLabel(item.x, timeSpan),
        y: item.y,
      }));
      // Set the chart data with time labels
      setChartData(chartDataWithTimeLabels);
    })
    .catch((error) => {
      console.error("Error fetching line chart data:", error);
    });
};


  return (
    <div>
      <h2>User Registration Chart</h2>
      <div>
        <label>Time Span:</label>
        <select value={timeSpan} onChange={(e) => setTimeSpan(e.target.value)}>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
          <option value="years">Years</option>
        </select>
        <label>User Type:</label>
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="all">All</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
      </div>
      {chartData.length > 0 ? (
        <Line
          data={{
            labels: chartData.map((item) => item.x),
            datasets: [
              {
                label: "Number of Users",
                data: chartData.map((item) => item.y),
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
              },
            ],
          }}
          options={{
            scales: {
              x: {
                type: 'category',
                title: {
                  display: true,
                  text: 'Month'
                }
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Users'
                }
              }
            }
          }}
        />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default LineChart;
