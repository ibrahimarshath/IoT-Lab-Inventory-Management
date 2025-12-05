import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, Package, ArrowLeftRight, ShoppingCart, Lightbulb, UserPlus, Settings, AlertCircle } from 'lucide-react';

export function ActivityLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  // Empty array - will be populated from API in future
  const activityLogs = [];

  const getCategoryIcon = category => {
    switch (category) {
      case 'component':
        return <Package className="w-4 h-4" />;
      case 'borrowing':
        return <ArrowLeftRight className="w-4 h-4" />;
      case 'procurement':
        return <ShoppingCart className="w-4 h-4" />;
      case 'smartlab':
        return <Lightbulb className="w-4 h-4" />;
      case 'user':
        return <UserPlus className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getSeverityBadge = severity => {
    switch (severity) {
      case 'success':
        return <Badge className="bg-green-500">Success</Badge>;
      case 'warning':
        return <Badge className="bg-orange-500">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'info':
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const getCategoryBadge = category => {
    const colors = {
      component: 'bg-blue-100 text-blue-700',
      borrowing: 'bg-purple-100 text-purple-700',
      procurement: 'bg-green-100 text-green-700',
      smartlab: 'bg-yellow-100 text-yellow-700',
      user: 'bg-pink-100 text-pink-700',
      system: 'bg-gray-100 text-gray-700'
    };
    return (
      <Badge className={`${colors[category] || 'bg-gray-100 text-gray-700'} gap-1`} variant="outline">
        {getCategoryIcon(category)}
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const stats = {
    total: activityLogs.length,
    today: 0,
    warnings: activityLogs.filter(log => log.severity === 'warning').length,
    errors: activityLogs.filter(log => log.severity === 'error').length
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900 mb-2">Activity Logs</h2>
            <p className="text-gray-600">Track all system activities and user actions</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Logs</p>
                  <p className="text-3xl text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                  <Settings className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Today's Activity</p>
                  <p className="text-3xl text-gray-900">{stats.today}</p>
                </div>
                <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                  <Package className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Warnings</p>
                  <p className="text-3xl text-gray-900">{stats.warnings}</p>
                </div>
                <div className="bg-orange-50 text-orange-600 p-3 rounded-lg">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Errors</p>
                  <p className="text-3xl text-gray-900">{stats.errors}</p>
                </div>
                <div className="bg-red-50 text-red-600 p-3 rounded-lg">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search logs by user, action, or details..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="component">Component</SelectItem>
              <SelectItem value="borrowing">Borrowing</SelectItem>
              <SelectItem value="procurement">Procurement</SelectItem>
              <SelectItem value="smartlab">Smart Lab</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Activity Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
          <CardDescription>Chronological list of all system events and user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">Timestamp</TableHead>
                <TableHead className="w-[120px]">User</TableHead>
                <TableHead className="w-[140px]">Action</TableHead>
                <TableHead className="w-[110px]">Category</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="w-[100px]">Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                    {log.timestamp}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">{log.user}</TableCell>
                  <TableCell className="text-sm text-gray-900 whitespace-nowrap">{log.action}</TableCell>
                  <TableCell>{getCategoryBadge(log.category)}</TableCell>
                  <TableCell className="text-sm text-gray-600 break-words">{log.details}</TableCell>
                  <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Settings className="w-12 h-12 text-gray-300" />
                      <p className="text-lg font-medium">No Activity Logs Yet</p>
                      <p className="text-sm">Activity will appear here as you use the system</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}