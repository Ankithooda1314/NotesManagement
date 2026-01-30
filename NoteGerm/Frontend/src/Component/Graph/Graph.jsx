import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchUserStats } from "../../ReduxApi/UserStats/UserStats.js";
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as PieTooltip, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend 
} from 'recharts';

const Graph = () => {
    const dispatch = useDispatch();
    const { stats, loadingStats } = useSelector(state => state.userStats);
    
    useEffect(() => {
        dispatch(fetchUserStats());
    }, [dispatch]);
    
    if (loadingStats) {
        return (
            <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    
    const totalNotes = stats?.stats?.totalNotes || 0;
    const notesCreated = stats?.stats?.notesCreated || 0;
    const notesUpdated = stats?.stats?.notesUpdated || 0;
    const notesDeleted = stats?.stats?.notesDeleted || 0;
    
    // Data for Donut Chart
    const donutData = [
        { name: 'Total Notes', value: totalNotes, color: '#3B82F6', description: 'Currently active notes' },
        { name: 'Created', value: notesCreated, color: '#10B981', description: 'Total notes created' },
        { name: 'Updated', value: notesUpdated, color: '#F59E0B', description: 'Times notes were updated' },
        { name: 'Deleted', value: notesDeleted, color: '#EF4444', description: 'Notes deleted' },
    ];
    
    // Data for Bar Graph - Just the three categories
    const barData = [
        { name: 'Created', value: notesCreated, color: '#10B981' },
        { name: 'Updated', value: notesUpdated, color: '#F59E0B' },
        { name: 'Deleted', value: notesDeleted, color: '#EF4444' },
    ];
    
    // Custom tooltip for Donut Chart
    const DonutTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                        <div 
                            className="w-3 h-3 rounded" 
                            style={{ backgroundColor: data.color }}
                        />
                        <p className="font-bold text-gray-800">{data.name}</p>
                    </div>
                    <p className="text-2xl font-bold mb-1" style={{ color: data.color }}>
                        {data.value}
                    </p>
                    <p className="text-sm text-gray-500">{data.description}</p>
                </div>
            );
        }
        return null;
    };
    
    // Custom tooltip for Bar Chart
    const BarChartTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                        <div 
                            className="w-3 h-3 rounded" 
                            style={{ backgroundColor: data.color }}
                        />
                        <p className="font-bold text-gray-800">{data.name}</p>
                    </div>
                    <p className="text-2xl font-bold mb-1" style={{ color: data.color }}>
                        {data.value}
                    </p>
                    <p className="text-sm text-gray-500">
                        {data.name === 'Created' && 'Total notes created'}
                        {data.name === 'Updated' && 'Times notes were updated'}
                        {data.name === 'Deleted' && 'Notes deleted'}
                    </p>
                </div>
            );
        }
        return null;
    };
    
    // Calculate total actions
    const totalActions = notesCreated + notesUpdated + notesDeleted;
    
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                
                
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Donut Chart */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-1">Current Status</h2>
                            <p className="text-gray-500">Distribution of notes and actions</p>
                        </div>
                        
                        <div className="relative h-72 mb-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={donutData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="60%"
                                        outerRadius="80%"
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="#FFFFFF"
                                        strokeWidth={2}
                                    >
                                        {donutData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Pie>
                                    <PieTooltip content={<DonutTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            
                            {/* Center circle with summary */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center border-8 border-white shadow-md">
                                    <span className="text-3xl font-bold text-blue-600">{totalNotes}</span>
                                    <span className="text-sm text-gray-600 mt-1">Active Notes</span>
                                    <span className="text-xs text-gray-400 mt-1">of {notesCreated} created</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Donut chart legend */}
                        <div className="grid grid-cols-2 gap-4">
                            {donutData.map((item, index) => {
                                let percentage, description;
                                
                                if (item.name === 'Total Notes') {
                                    percentage = notesCreated > 0 ? ((totalNotes / notesCreated) * 100).toFixed(0) : 0;
                                    description = `${percentage}% active`;
                                } else {
                                    percentage = totalActions > 0 ? ((item.value / totalActions) * 100).toFixed(0) : 0;
                                    description = `${percentage}% of actions`;
                                }
                                
                                return (
                                    <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center mb-2">
                                            <div 
                                                className="w-3 h-3 rounded mr-2" 
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="font-semibold text-gray-700 text-sm">{item.name}</span>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <div className="text-xl font-bold" style={{ color: item.color }}>
                                                {item.value}
                                            </div>
                                            <div className="text-xs text-gray-500">{description}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Right Column - Bar Graph */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                       
                        
                        <div className="h-72 mb-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={barData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#666"
                                        fontSize={14}
                                        fontWeight="500"
                                    />
                                    <YAxis 
                                        stroke="#666"
                                        fontSize={12}
                                    />
                                    <BarChartTooltip content={<BarChartTooltip />} />
                                    <Legend />
                                    <Bar 
                                        dataKey="value" 
                                        fill="#8884d8"
                                        radius={[8, 8, 0, 0]}
                                        barSize={60}
                                    >
                                        {barData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        
                        {/* Bar graph stats summary */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                                <div className="text-2xl font-bold text-green-600">{notesCreated}</div>
                                <div className="text-sm font-medium text-green-700">Notes Created</div>
                                <div className="text-xs text-green-500 mt-1">
                                    {notesCreated > 0 ? ((notesCreated / totalActions) * 100).toFixed(0) : 0}% of actions
                                </div>
                            </div>
                            
                            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                <div className="text-2xl font-bold text-yellow-600">{notesUpdated}</div>
                                <div className="text-sm font-medium text-yellow-700">Notes Updated</div>
                                <div className="text-xs text-yellow-500 mt-1">
                                    {notesUpdated > 0 ? ((notesUpdated / totalActions) * 100).toFixed(0) : 0}% of actions
                                </div>
                            </div>
                            
                            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                                <div className="text-2xl font-bold text-red-600">{notesDeleted}</div>
                                <div className="text-sm font-medium text-red-700">Notes Deleted</div>
                                <div className="text-xs text-red-500 mt-1">
                                    {notesDeleted > 0 ? ((notesDeleted / totalActions) * 100).toFixed(0) : 0}% of actions
                                </div>
                            </div>
                        </div>
                        
                        {/* Action analysis */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="font-semibold text-gray-800 mb-3">Action Analysis</h4>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Total Actions</span>
                                    <span className="font-bold text-gray-800">
                                        {totalActions}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Create vs Delete Ratio</span>
                                    <span className="font-bold text-gray-800">
                                        {notesDeleted > 0 ? (notesCreated / notesDeleted).toFixed(1) : '∞'} : 1
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Update Frequency</span>
                                    <span className="font-bold text-gray-800">
                                        {totalNotes > 0 ? (notesUpdated / totalNotes).toFixed(1) : 0} per note
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Overall Summary */}
               
            </div>
        </div>
    );
};

export default Graph;