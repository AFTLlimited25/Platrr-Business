import React, { useState } from "react";
import {
  DollarSign,
  BarChart3,
  Users,
  Package,
  Download,
  TrendingUp,
  Target,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [selectedReport, setSelectedReport] = useState("overview");

  const periods = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "3months", label: "Last 3 Months" },
    { value: "1year", label: "Last Year" },
  ];

  const reportTypes = [
    { value: "overview", label: "Overview" },
    { value: "revenue", label: "Revenue" },
    { value: "staff", label: "Staff Performance" },
    { value: "inventory", label: "Inventory" },
  ];

  const revenueData = [
    { day: "Mon", revenue: 1247, orders: 45 },
    { day: "Tue", revenue: 1456, orders: 52 },
    { day: "Wed", revenue: 1123, orders: 38 },
    { day: "Thu", revenue: 1678, orders: 61 },
    { day: "Fri", revenue: 2134, orders: 78 },
    { day: "Sat", revenue: 2456, orders: 89 },
    { day: "Sun", revenue: 1987, orders: 72 },
  ];

  const staffPerformance = [
    { name: "John Doe", efficiency: 95, rating: 4.8 },
    { name: "Sarah Adams", efficiency: 88, rating: 4.6 },
    { name: "Mike Johnson", efficiency: 92, rating: 4.7 },
    { name: "Emma Wilson", efficiency: 85, rating: 4.5 },
  ];

  const inventoryTurnover = [
    { item: "Tomatoes", turnover: 75 },
    { item: "Chicken Breast", turnover: 53 },
    { item: "Pasta", turnover: 56 },
    { item: "Fresh Basil", turnover: 60 },
  ];

  const COLORS = ["#f97316", "#3b82f6", "#10b981", "#facc15"];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Track performance and analyze business metrics
          </p>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => {
          const metric = [
            {
              title: "Total Revenue",
              value: "£12,081",
              icon: DollarSign,
              color: "bg-green-100",
              stroke: "#16a34a",
              dataKey: "revenue",
            },
            {
              title: "Total Orders",
              value: "435",
              icon: BarChart3,
              color: "bg-blue-100",
              stroke: "#2563eb",
              dataKey: "orders",
            },
            {
              title: "Avg Order Value",
              value: "£27.78",
              icon: Target,
              color: "bg-purple-100",
              stroke: "#7c3aed",
              dataKey: "revenue",
            },
            {
              title: "Staff Hours",
              value: "155",
              icon: Clock,
              color: "bg-orange-100",
              stroke: "#ea580c",
              dataKey: "orders",
            },
          ][i];

          return (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {metric.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center`}
                >
                  <metric.icon className="h-6 w-6 text-gray-700" />
                </div>
              </div>
              <div className="h-16 mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <Line
                      type="monotone"
                      dataKey={metric.dataKey}
                      stroke={metric.stroke}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Daily Revenue & Orders
            </h2>
          </div>
          <div className="p-4 sm:p-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#f97316" name="Revenue (£)" />
                <Bar dataKey="orders" fill="#60a5fa" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Staff Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Staff Performance
            </h2>
          </div>
          <div className="p-4 sm:p-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={staffPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#3b82f6"
                  name="Efficiency (%)"
                />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#facc15"
                  name="Rating"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Inventory Turnover */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Inventory Turnover
          </h2>
        </div>
        <div className="p-4 sm:p-6 h-80 flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={inventoryTurnover}
                dataKey="turnover"
                nameKey="item"
                outerRadius={120}
                label
              >
                {inventoryTurnover.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
