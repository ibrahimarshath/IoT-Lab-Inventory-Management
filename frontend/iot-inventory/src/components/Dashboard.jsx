import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Package, AlertTriangle, Users, FileText } from 'lucide-react';

export function Dashboard({ onNavigate } = {}) {
  const [stats, setStats] = useState({
    totalComponents: 0,
    borrowRequests: 0,
    lowStockItems: 0,
    activeBorrowings: 0,
    overdueBorrowings: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [overdueItems, setOverdueItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = sessionStorage.getItem('token');

      // Fetch components
      const componentsRes = await fetch('/api/components', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const components = await componentsRes.json();

      // Fetch borrowings
      const borrowingsRes = await fetch('/api/borrowings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const borrowings = await borrowingsRes.json();

      // Fetch borrow requests
      const requestsRes = await fetch('/api/borrow-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const requests = await requestsRes.json();
      const pendingRequests = requests.filter(r => r.status === 'pending');

      // Group pending requests to count distinct submissions
      const groupedPendingRequests = pendingRequests.reduce((groups, request) => {
        const groupKey = `${request.userEmail}-${new Date(request.requestDate).toDateString()}-${request.purpose}`;
        if (!groups[groupKey]) {
          groups[groupKey] = true;
        }
        return groups;
      }, {});

      // Calculate stats
      const activeBorrowings = borrowings.filter(b => b.status === 'active');
      const overdue = borrowings.filter(b =>
        b.status === 'active' && new Date(b.expectedReturnDate) < new Date()
      );
      const lowStock = components.filter(c => c.available <= c.threshold);

      setStats({
        totalComponents: components.length,
        borrowRequests: Object.keys(groupedPendingRequests).length,
        lowStockItems: lowStock.length,
        activeBorrowings: activeBorrowings.length,
        overdueBorrowings: overdue.length
      });

      // Get recent activity (last 5 borrowings)
      const recent = borrowings
        .sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate))
        .slice(0, 5)
        .map(b => ({
          user: b.userName,
          action: b.status === 'returned' ? 'Returned' : 'Borrowed',
          item: b.componentName,
          time: getTimeAgo(b.borrowDate)
        }));

      setRecentActivity(recent);
      setLowStockItems(lowStock.slice(0, 5));
      setOverdueItems(overdue.slice(0, 3).map(b => ({
        user: b.userName,
        item: b.componentName,
        dueDate: getTimeAgo(b.expectedReturnDate),
        duration: getDaysOverdue(b.expectedReturnDate)
      })));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const getDaysOverdue = (dueDate) => {
    const days = Math.floor((new Date() - new Date(dueDate)) / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} day${days > 1 ? 's' : ''}` : '0 days';
  };

  const scrollToLowStock = () => {
    const element = document.getElementById('low-stock-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navigateToBorrowing = () => {
    if (onNavigate) onNavigate('borrowing');
  };

  const navigateToComponents = () => {
    if (onNavigate) onNavigate('components');
  };

  const navigateToRequests = () => {
    if (onNavigate) onNavigate('requests');
  };

  const navigateToProcurement = () => {
    if (onNavigate) onNavigate('procurement');
  };

  const dashboardStats = [
    {
      title: 'Total Components',
      value: stats.totalComponents.toString(),
      change: stats.totalComponents === 0 ? 'No components yet' : `${stats.totalComponents} in inventory`,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      onClick: navigateToComponents
    },
    {
      title: 'Borrow Requests',
      value: stats.borrowRequests.toString(),
      change: stats.borrowRequests === 0 ? 'No pending requests' : `${stats.borrowRequests} pending approval`,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      onClick: navigateToRequests
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems.toString(),
      change: stats.lowStockItems === 0 ? 'All items stocked' : 'Needs attention',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      onClick: navigateToProcurement
    },
    {
      title: 'Active Borrowings',
      value: stats.activeBorrowings.toString(),
      change: stats.overdueBorrowings > 0 ? `${stats.overdueBorrowings} overdue` : 'All on time',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      onClick: navigateToBorrowing
    }
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Monitor your IoT lab inventory at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={stat.onClick}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl text-gray-900 mb-2">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.change}</p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest borrowing and return transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No activity yet</p>
                <p className="text-sm">Activity will appear here as components are borrowed and returned</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.user}</p>
                      <p className="text-sm text-gray-500">
                        {activity.action} <span className="text-gray-700">{activity.item}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={activity.action === 'Borrowed' ? 'default' : 'secondary'}>
                        {activity.action}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overdue Items */}
        <Card>
          <CardHeader>
            <CardTitle>Overdue Items</CardTitle>
            <CardDescription>Components that need to be returned</CardDescription>
          </CardHeader>
          <CardContent>
            {overdueItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No overdue items</p>
                <p className="text-sm">All borrowings are on time!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {overdueItems.map((item, index) => (
                  <div key={index} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{item.user}</p>
                      <p className="text-sm text-gray-500">
                        {item.item} <span className="text-red-500">({item.duration} overdue)</span>
                      </p>
                      <p className="text-xs text-gray-400">Due {item.dueDate}</p>
                    </div>
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Items Section */}
      <Card id="low-stock-section" className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Low Stock Items
          </CardTitle>
          <CardDescription>Components that have reached their minimum threshold</CardDescription>
        </CardHeader>
        <CardContent>
          {lowStockItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No low stock items</p>
              <p className="text-sm">All inventory levels are healthy!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Category: {item.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">
                      {item.available} / {item.quantity}
                    </p>
                    <p className="text-xs text-gray-500">
                      Threshold: {item.threshold}
                    </p>
                  </div>
                </div>
              ))}
              <div className="pt-4 text-center">
                <button
                  onClick={() => onNavigate && onNavigate('procurement')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  View Full Procurement List →
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}