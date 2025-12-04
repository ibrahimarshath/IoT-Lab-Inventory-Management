import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, Package, ArrowLeftRight, ShoppingCart, Lightbulb, UserPlus, Settings, AlertCircle, Mail } from 'lucide-react';
export function ActivityLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const handleUserClick = userName => {
    setSelectedUser(userName);
    setUserDialogOpen(true);
  };
  const activityLogs = [{
    id: '1',
    timestamp: '2024-11-27 14:35:22',
    user: 'Admin',
    action: 'Component Added',
    category: 'component',
    details: 'Added new component: Arduino Mega 2560 (Qty: 10)',
    severity: 'success'
  }, {
    id: '2',
    timestamp: '2024-11-27 14:20:15',
    user: 'John Doe',
    action: 'Borrowed Component',
    category: 'borrowing',
    details: 'Borrowed Arduino Uno R3 (Qty: 2) - Due: 2024-11-27',
    severity: 'info'
  }, {
    id: '3',
    timestamp: '2024-11-27 13:45:30',
    user: 'Admin',
    action: 'Smart Device Toggled',
    category: 'smartlab',
    details: 'Turned OFF Main Lab Lights',
    severity: 'info'
  }, {
    id: '4',
    timestamp: '2024-11-27 12:30:00',
    user: 'System',
    action: 'Low Stock Alert',
    category: 'system',
    details: 'Arduino Nano stock below threshold (Current: 3, Min: 10)',
    severity: 'warning'
  }, {
    id: '5',
    timestamp: '2024-11-27 11:15:45',
    user: 'Admin',
    action: 'Procurement Approved',
    category: 'procurement',
    details: 'Approved procurement request for Ultrasonic Sensor HC-SR04 (Qty: 20)',
    severity: 'success'
  }, {
    id: '6',
    timestamp: '2024-11-27 10:50:12',
    user: 'Jane Smith',
    action: 'Returned Component',
    category: 'borrowing',
    details: 'Returned Raspberry Pi 4 Model B (Qty: 1)',
    severity: 'success'
  }, {
    id: '8',
    timestamp: '2024-11-27 09:45:22',
    user: 'Admin',
    action: 'Component Updated',
    category: 'component',
    details: 'Updated ESP32 DevKit V1 quantity: 30 → 33',
    severity: 'info'
  }, {
    id: '9',
    timestamp: '2024-11-27 09:20:00',
    user: 'Admin',
    action: 'Smart Device Toggled',
    category: 'smartlab',
    details: 'Turned ON Ceiling Fan 1 at 60% speed',
    severity: 'info'
  }, {
    id: '10',
    timestamp: '2024-11-27 08:55:30',
    user: 'Mike Johnson',
    action: 'Borrowed Component',
    category: 'borrowing',
    details: 'Borrowed ESP32 DevKit V1 (Qty: 3) - Due: 2024-11-29',
    severity: 'info'
  }, {
    id: '11',
    timestamp: '2024-11-27 08:30:00',
    user: 'Admin',
    action: 'Smart Device Toggled',
    category: 'smartlab',
    details: 'Turned ON Main Lab Lights at 80% brightness',
    severity: 'info'
  }, {
    id: '12',
    timestamp: '2024-11-26 18:00:00',
    user: 'System',
    action: 'Auto Shutoff',
    category: 'system',
    details: 'Automatically turned off all smart devices at scheduled time',
    severity: 'info'
  }, {
    id: '13',
    timestamp: '2024-11-26 17:30:45',
    user: 'Admin',
    action: 'Component Deleted',
    category: 'component',
    details: 'Removed obsolete component: Old Bluetooth Module HC-05',
    severity: 'warning'
  }, {
    id: '14',
    timestamp: '2024-11-26 16:20:15',
    user: 'System',
    action: 'Procurement Reminder',
    category: 'system',
    details: 'Reminder: 3 procurement items pending approval',
    severity: 'info'
  }, {
    id: '15',
    timestamp: '2024-11-26 15:40:00',
    user: 'Sarah Wilson',
    action: 'Returned Component',
    category: 'borrowing',
    details: 'Returned LIDAR Sensor TFMini Plus (Qty: 1) - 1 day late',
    severity: 'warning'
  }];
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
    return <Badge className={`${colors[category] || 'bg-gray-100 text-gray-700'} gap-1`} variant="outline">
      {getCategoryIcon(category)}
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </Badge>;
  };
  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) || log.action.toLowerCase().includes(searchQuery.toLowerCase()) || log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    return matchesSearch && matchesCategory && matchesSeverity;
  });
  const stats = {
    total: activityLogs.length,
    today: activityLogs.filter(log => log.timestamp.startsWith('2024-11-27')).length,
    warnings: activityLogs.filter(log => log.severity === 'warning').length,
    errors: activityLogs.filter(log => log.severity === 'error').length
  };
  return <div className="p-8">
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
            {filteredLogs.map(log => <TableRow key={log.id}>
              <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                {log.timestamp}
              </TableCell>
              <TableCell>
                <button onClick={() => handleUserClick(log.user)} className="text-sm text-gray-900 hover:text-blue-600 hover:bg-blue-50 p-2 -m-2 rounded transition-colors">
                  {log.user}
                </button>
              </TableCell>
              <TableCell className="text-sm text-gray-900 whitespace-nowrap">{log.action}</TableCell>
              <TableCell>{getCategoryBadge(log.category)}</TableCell>
              <TableCell className="text-sm text-gray-600 break-words">{log.details}</TableCell>
              <TableCell>{getSeverityBadge(log.severity)}</TableCell>
            </TableRow>)}
            {filteredLogs.length === 0 && <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                No activity logs found
              </TableCell>
            </TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    {/* User Details Dialog */}
    <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Contact information for {selectedUser}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center">
              {selectedUser?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-gray-900">{selectedUser}</p>
              <p className="text-sm text-gray-500">{selectedUser?.toLowerCase().replace(' ', '.')}@{selectedUser === 'System' ? 'iotlab.edu' : 'student.edu'}</p>
            </div>
          </div>
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Email:</span>
              <span className="text-gray-900">{selectedUser?.toLowerCase().replace(' ', '.')}@{selectedUser === 'System' ? 'iotlab.edu' : 'student.edu'}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>;
}