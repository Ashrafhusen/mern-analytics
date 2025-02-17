import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const Dashboard = () => {
  const [revenue, setRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categorySales, setCategorySales] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/analytics/total-revenue")
      .then(res => setRevenue(res.data.totalRevenue || 0))
      .catch(err => console.error("❌ Error fetching total revenue:", err));

    axios.get("http://localhost:5000/api/analytics/monthly-revenue")
      .then(res => setMonthlyRevenue(res.data))
      .catch(err => console.error("❌ Error fetching monthly revenue:", err));

    axios.get("http://localhost:5000/api/analytics/top-products")
      .then(res => setTopProducts(res.data))
      .catch(err => console.error("❌ Error fetching top products:", err));

    axios.get("http://localhost:5000/api/analytics/sales-by-category")
      .then(res => setCategorySales(res.data))
      .catch(err => console.error("❌ Error fetching sales by category:", err));
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">📊 E-Commerce Analytics Dashboard</h1>

        {/* 📌 Total Revenue */}
        <div className="text-center bg-blue-500 text-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Total Revenue</h2>
          <p className="text-3xl font-bold">💰 ${revenue.toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* 📌 Monthly Revenue Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">📅 Monthly Revenue</h2>
            {monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" label={{ value: "Month", position: "insideBottom", dy: 10 }} />
                  <YAxis label={{ value: "Revenue ($)", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-500">No revenue data available.</p>}
          </div>

          {/* 📌 Top-Selling Products Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">🏆 Top-Selling Products</h2>
            {topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" label={{ value: "Product", position: "insideBottom", dy: 10 }} />
                  <YAxis label={{ value: "Units Sold", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Bar dataKey="totalSales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-500">No top-selling products available.</p>}
          </div>

          {/* 📌 Sales by Category Pie Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold mb-2">🛍️ Sales by Category</h2>
            {categorySales.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie data={categorySales} dataKey="totalRevenue" nameKey="_id" cx="50%" cy="50%" outerRadius={120}>
                    {categorySales.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-500">No category sales data available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
