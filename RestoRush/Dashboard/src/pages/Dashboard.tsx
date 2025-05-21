
import React, { useState } from 'react';
import { 
  FileQuestion, 
  Users, 
  BarChart3, 
  ChevronRight,
  PlusCircle,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock stats
  const stats = {
    totalForms: 12,
    activeForms: 8,
    totalResponses: 247,
    averageCompletionRate: 78,
    totalUsers: 150,
    activeUsers: 87
  };
  
  // Mock recent forms
  const recentForms = [
    { id: '1', title: 'Customer Feedback Form', responses: 42, createdAt: new Date('2025-03-10') },
    { id: '2', title: 'Course Enrollment Survey', responses: 89, createdAt: new Date('2025-03-05') },
    { id: '3', title: 'Product Satisfaction Quiz', responses: 21, createdAt: new Date('2025-03-01') },
  ];
  
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <Button onClick={() => navigate('/forms/new')} className="login-background hover:bg-blue-700 text-white flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Create New Form
          </Button>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Form Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.totalForms}</div>
                  <p className="text-xs text-muted-foreground">Total Forms</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.activeForms}</div>
                  <p className="text-xs text-muted-foreground">Active Forms</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center">
                  <FileQuestion className="h-5 w-5 text-brand-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Response Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.totalResponses}</div>
                  <p className="text-xs text-muted-foreground">Total Responses</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.averageCompletionRate}%</div>
                  <p className="text-xs text-muted-foreground">Completion Rate</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">User Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.activeUsers}</div>
                  <p className="text-xs text-muted-foreground">Active Users</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent forms section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Forms</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/forms')} className="flex items-center">
                    View All <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Your recently created or updated forms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentForms.map(form => (
                    <div key={form.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <div className="w-10 h-10 login-background rounded text-white flex items-center justify-center mr-4">
                          <FileQuestion className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{form.title}</h3>
                          <p className="text-xs text-gray-500">Created {form.createdAt.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-right mr-4">
                          <div className="font-medium">{form.responses}</div>
                          <p className="text-xs text-gray-500 hover:text-blue-500">Responses</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/forms/${form.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => navigate('/forms/new')}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create new form
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => navigate('/forms')}
                  >
                    <FileQuestion className="h-4 w-4 mr-2" />
                    Manage existing forms
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => navigate('/templates/new')}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Templates
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;