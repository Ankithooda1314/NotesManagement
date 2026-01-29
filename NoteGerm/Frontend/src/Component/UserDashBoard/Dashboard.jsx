// src/Components/Dashboard/Dashboard.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchUserStats } from "../../ReduxApi/UserStats/UserStats.js";
import { FileText, Sparkles, Pencil, Trash2, BarChart3 } from "lucide-react";


const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loadingStats } = useSelector(state => state.userStats);

  useEffect(() => {
    dispatch(fetchUserStats());
    console.log("stats:", stats);
  }, [dispatch]);

  if (loadingStats) return <p className="p-6 text-center text-gray-500">Loading stats...</p>;

  const cards = [
  {
    title: 'Total Notes',
    value: stats?.stats?.totalNotes || 0,
    color: 'from-blue-500 to-blue-600',
    textColor: 'text-blue-600',
    icon: <FileText size={22} />,
    bgAccent: 'bg-blue-50'
  },
  {
    title: 'Notes Created',
    value: stats?.stats?.notesCreated || 0,
    color: 'from-green-500 to-green-600',
    textColor: 'text-green-600',
    icon: <Sparkles size={22} />,
    bgAccent: 'bg-green-50'
  },
  {
    title: 'Notes Updated',
    value: stats?.stats?.notesUpdated || 0,
    color: 'from-amber-500 to-amber-600',
    textColor: 'text-amber-600',
    icon: <Pencil size={22} />,
    bgAccent: 'bg-amber-50'
  },
  {
    title: 'Notes Deleted',
    value: stats?.stats?.notesDeleted || 0,
    color: 'from-red-500 to-red-600',
    textColor: 'text-red-600',
    icon: <Trash2 size={22} />,
    bgAccent: 'bg-red-50'
  },
];


  return (
    <div className="max-h-svh bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
           <BarChart3 size={42} className="text-blue-600" />

            Notes Dashboard
          </h2>
          <p className="text-gray-600 mt-2 ml-16">Overview of your notes activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className={`h-1.5 bg-gradient-to-r ${card.color}`} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">{card.title}</h3>
                  <div className={`${card.bgAccent} p-2 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{card.icon}</span>
                  </div>
                </div>
                <p className={`text-5xl font-bold ${card.textColor} group-hover:scale-105 transition-transform duration-300`}>
                  {card.value}
                </p>
              </div>
              <div className={`absolute inset-0 ${card.bgAccent} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
