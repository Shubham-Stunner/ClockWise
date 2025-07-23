import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js/auto';

export default function Dashboard() {
  const [summary, setSummary] = useState({ todayHours: 0, weekHours: 0 });
  const [chart, setChart] = useState(null);

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: '/api',
    headers: { Authorization: `Bearer ${token}` },
  });

  const punchIn = () => api.post('/punchin').then(fetchSummary);
  const punchOut = () => api.post('/punchout').then(fetchSummary);

  function fetchSummary() {
    api.get('/summary').then(res => setSummary(res.data));
  }

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    if (!chart) {
      const ctx = document.getElementById('hoursChart').getContext('2d');
      setChart(new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Today', 'This Week'],
          datasets: [{
            label: 'Hours Worked',
            data: [summary.todayHours, summary.weekHours],
            backgroundColor: ['#60a5fa', '#3b82f6'],
          }],
        },
        options: {
          responsive: true,
        },
      }));
    } else {
      chart.data.datasets[0].data = [summary.todayHours, summary.weekHours];
      chart.update();
    }
  }, [summary]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl mb-4">Dashboard</h1>
      <div className="mb-4">
        <button className="bg-green-500 text-white px-4 py-2 mr-2" onClick={punchIn}>Punch In</button>
        <button className="bg-red-500 text-white px-4 py-2" onClick={punchOut}>Punch Out</button>
      </div>
      <div className="mb-2">Today: {summary.todayHours.toFixed(2)} hours</div>
      <div className="mb-4">This Week: {summary.weekHours.toFixed(2)} hours</div>
      <canvas id="hoursChart" height="200"></canvas>
    </div>
  );
}
