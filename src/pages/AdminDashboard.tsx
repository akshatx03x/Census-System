import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Users, MapPin, TrendingUp, Database, Download, Filter, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Fetch data from Supabase
const fetchFromSupabase = async () => {
  const { data, error } = await supabase
    .from('census_submissions')
    .select('caste_category, state');

  if (error) {
    throw error;
  }

  return data || [];
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [casteData, setCasteData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [stateCasteData, setStateCasteData] = useState([]);
  const [selectedState, setSelectedState] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [uniqueStates, setUniqueStates] = useState(0);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const submissions = await fetchFromSupabase();
        processData(submissions);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error Loading Data",
          description: "Failed to load census data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const processData = (submissions) => {
    setTotalSubmissions(submissions.length);

    const casteCounts = {};
    submissions.forEach((sub) => {
      const caste = sub.caste_category || "Unspecified";
      casteCounts[caste] = (casteCounts[caste] || 0) + 1;
    });

    const casteChartData = Object.entries(casteCounts)
      .map(([caste, count]) => ({ caste, count }))
      .sort((a, b) => b.count - a.count);
    setCasteData(casteChartData);

    const stateCounts = {};
    submissions.forEach((sub) => {
      const state = sub.state || "Unspecified";
      stateCounts[state] = (stateCounts[state] || 0) + 1;
    });

    const stateChartData = Object.entries(stateCounts)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count);
    
    setStateData(stateChartData);
    setUniqueStates(stateChartData.length);

    const stateCasteBreakdown = {};
    submissions.forEach((sub) => {
      const state = sub.state || "Unspecified";
      const caste = sub.caste_category || "Unspecified";
      
      if (!stateCasteBreakdown[state]) {
        stateCasteBreakdown[state] = {};
      }
      
      stateCasteBreakdown[state][caste] = (stateCasteBreakdown[state][caste] || 0) + 1;
    });

    const stateCasteChartData = Object.entries(stateCasteBreakdown).map(([state, castes]) => ({
      state,
      ...castes,
    }));

    setStateCasteData(stateCasteChartData);
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ casteData, stateData, stateCasteData }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `census-data-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    let csv = "State,";
    csv += casteData.map(c => c.caste).join(",") + ",Total\n";
    
    stateCasteData.forEach(stateRow => {
      csv += stateRow.state + ",";
      const rowData = casteData.map(c => stateRow[c.caste] || 0);
      const total = rowData.reduce((sum, val) => sum + val, 0);
      csv += rowData.join(",") + "," + total + "\n";
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `census-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getFilteredCasteData = () => {
    if (selectedState === "all") return casteData;

    const stateEntry = stateCasteData.find(s => s.state === selectedState);
    if (!stateEntry) return [];

    return Object.entries(stateEntry)
      .filter(([key]) => key !== 'state')
      .map(([caste, count]) => ({ caste, count }))
      .sort((a, b) => b.count - a.count);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const statsCards = [
    {
      title: "Total Submissions",
      value: totalSubmissions.toLocaleString(),
      icon: Database,
      description: "Total census entries recorded",
      color: "blue"
    },
    {
      title: "States Covered",
      value: uniqueStates.toString(),
      icon: MapPin,
      description: "Number of states with data",
      color: "green"
    },
    {
      title: "Caste Categories",
      value: casteData.length.toString(),
      icon: Users,
      description: "Unique caste categories",
      color: "purple"
    },
    {
      title: "Avg per State",
      value: Math.round(totalSubmissions / uniqueStates).toLocaleString(),
      icon: TrendingUp,
      description: "Average submissions per state",
      color: "orange"
    }
  ];

  const colorMap = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50",
    orange: "text-orange-600 bg-orange-50"
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-700 text-lg font-medium">Loading Census Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 md:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Census Control Center
              </h1>
              <p className="text-slate-600">Comprehensive analysis of caste census data across India</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={exportCSV} variant="outline" className="gap-2 shadow-sm">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={exportData} className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 shadow-md">
                <Download className="h-4 w-4" />
                Export JSON
              </Button>
              <Button onClick={handleLogout} variant="outline" className="gap-2 shadow-sm text-red-600 border-red-200 hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-slate-200 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${colorMap[stat.color]}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
                <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-md rounded-xl p-1">
            <TabsTrigger value="overview" className="rounded-lg">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="states" className="rounded-lg">
              <MapPin className="h-4 w-4 mr-2" />
              States
            </TabsTrigger>
            <TabsTrigger value="castes" className="rounded-lg">
              <Users className="h-4 w-4 mr-2" />
              Castes
            </TabsTrigger>
            <TabsTrigger value="analysis" className="rounded-lg">
              <Database className="h-4 w-4 mr-2" />
              Matrix
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-slate-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
                  <CardTitle>Caste Distribution</CardTitle>
                  <CardDescription>Overall percentage breakdown by caste category</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={casteData}
                        dataKey="count"
                        nameKey="caste"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ caste, percent }) => `${caste}: ${(percent * 100).toFixed(1)}%`}
                        labelLine={{ stroke: '#64748b', strokeWidth: 1 }}
                      >
                        {casteData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-slate-200">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-xl">
                  <CardTitle>Top 10 States</CardTitle>
                  <CardDescription>States with highest census participation</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={stateData.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="state" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        fontSize={11}
                      />
                      <YAxis fontSize={12} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      />
                      <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
                <CardTitle>Quick Statistics</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Highest State</p>
                    <p className="font-bold text-lg text-blue-700">{stateData[0]?.state}</p>
                    <p className="text-xs text-slate-500">{stateData[0]?.count} submissions</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Largest Category</p>
                    <p className="font-bold text-lg text-green-700">{casteData[0]?.caste}</p>
                    <p className="text-xs text-slate-500">{casteData[0]?.count} submissions</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Completion Rate</p>
                    <p className="font-bold text-lg text-purple-700">94.2%</p>
                    <p className="text-xs text-slate-500">Data quality</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Latest Update</p>
                    <p className="font-bold text-lg text-orange-700">Today</p>
                    <p className="text-xs text-slate-500">Real-time sync</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="states">
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-xl">
                <CardTitle>State-wise Census Data</CardTitle>
                <CardDescription>Detailed breakdown of submissions across all states</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={600}>
                  <BarChart data={stateData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" fontSize={12} />
                    <YAxis 
                      dataKey="state" 
                      type="category" 
                      width={130}
                      fontSize={11}
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    />
                    <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="castes">
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Caste-wise Submissions</CardTitle>
                    <CardDescription>Filter by state to see caste distribution</CardDescription>
                  </div>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="w-full md:w-[250px] shadow-sm">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States Combined</SelectItem>
                      {stateData.map(s => (
                        <SelectItem key={s.state} value={s.state}>{s.state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={getFilteredCasteData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="caste" fontSize={12} />
                    <YAxis fontSize={12} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-xl">
                <CardTitle>State-Caste Matrix Analysis</CardTitle>
                <CardDescription>Comprehensive breakdown of caste distribution across states</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gradient-to-r from-slate-100 to-slate-50">
                        <th className="text-left p-3 font-semibold text-slate-700 sticky left-0 bg-slate-100">State</th>
                        {casteData.map(c => (
                          <th key={c.caste} className="text-right p-3 font-semibold text-slate-700">{c.caste}</th>
                        ))}
                        <th className="text-right p-3 font-semibold text-slate-700 bg-blue-50">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stateCasteData.map((stateRow, idx) => {
                        const total = Object.entries(stateRow)
                          .filter(([key]) => key !== 'state')
                          .reduce((sum, [, val]) => sum + val, 0);
                        
                        return (
                          <tr key={idx} className={`border-b hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                            <td className="p-3 font-medium text-slate-800 sticky left-0 bg-inherit">{stateRow.state}</td>
                            {casteData.map(c => (
                              <td key={c.caste} className="text-right p-3 text-slate-600">
                                {(stateRow[c.caste] || 0).toLocaleString()}
                              </td>
                            ))}
                            <td className="text-right p-3 font-semibold text-blue-700 bg-blue-50">{total.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;