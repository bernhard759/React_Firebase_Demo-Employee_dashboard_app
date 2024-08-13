import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import colormap from "colormap";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function EmployeeCategoryChart({ emps, categories }) {
  // Generate a color palette using colormap
  const colors = colormap({
    colormap: "jet",
    nshades: Math.max(6,emps.length), // Number of colors needed
    format: "hex", // Color format
    alpha: 1, // Opacity
  });

  // Prepare data for the chart
  const chartData = {
    labels: emps.map((emp) => emp.name),
    datasets: [
      {
        label: "Number of Categories",
        data: emps.map((emp) =>
          categories[emp.id] ? Object.keys(categories[emp.id]).length : 0
        ),
        backgroundColor: colors,
        borderColor: colors.map((color) => color.replace("50%", "40%")),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="card p-4 shadow mb-5">
      <h2>Employee Categories Overview</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

export default EmployeeCategoryChart;
