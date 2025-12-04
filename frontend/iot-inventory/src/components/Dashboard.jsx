import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Package, AlertTriangle, Users, TrendingUp, Mail, Phone, Calendar, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

// Mock user data with detailed information
const userDetailsData, {
  name: string;
  email: string;
  phone: string;
  borrowings: {
    item: string;
    borrowedDate: string;
    dueDate: string;
    returnedDate?: string;
    status | 'returned' | 'overdue';
    itemCondition?: string;
  }[];
}> = {
  'John Doe': {
    name Doe',
    email: 'john.doe@student.edu',
    phone: '+1 (555) 123-4567',
    borrowings
      {
        item Uno R3',
        borrowedDate: '2025-11-28',
        dueDate: '2025-12-05',
        status,
      },
      {
        item: 'HC-SR04 Ultrasonic Sensor',
        borrowedDate: '2025-11-20',
        dueDate: '2025-11-27',
        returnedDate: '2025-11-26',
        status,
        itemCondition - No damage',
      },
    ],
  },
  'Jane Smith': {
    name Smith',
    email: 'jane.smith@student.edu',
    phone: '+1 (555) 234-5678',
    borrowings
      {
        item Pi 4',
        borrowedDate: '2025-11-26',
        dueDate: '2025-12-03',
        returnedDate: '2025-11-28',
        status,
        itemCondition - All components intact',
      },
      {
        item Module v2',
        borrowedDate: '2025-11-15',
        dueDate: '2025-11-22',
        returnedDate: '2025-11-21',
        status,
        itemCondition - Minor scratches on case',
      },
    ],
  },
  'Mike Johnson': {
    name Johnson',
    email: 'mike.johnson@student.edu',
    phone: '+1 (555) 345-6789',
    borrowings
      {
        item Dev Board',
        borrowedDate: '2025-11-28',
        dueDate: '2025-12-12',
        status,
      },
    ],
  },
  'Sarah Wilson': {
    name Wilson',
    email: 'sarah.wilson@student.edu',
    phone: '+1 (555) 456-7890',
    borrowings
      {
        item Sensor',
        borrowedDate: '2025-11-20',
        dueDate: '2025-11-27',
        returnedDate: '2025-11-27',
        status,
        itemCondition - Perfect condition',
      },
    ],
  },
  'Tom Brown': {
    name Brown',
    email: 'tom.brown@student.edu',
    phone: '+1 (555) 567-8901',
    borrowings
      {
        item Frame Kit',
        borrowedDate: '2025-11-27',
        dueDate: '2025-12-11',
        status,
      },
    ],
  },
  'Alex Chen': {
    name Chen',
    email: 'alex.chen@student.edu',
    phone: '+1 (555) 678-9012',
    borrowings
      {
        item Module NEO-6M',
        borrowedDate: '2025-11-20',
        dueDate: '2025-11-26',
        status,
      },
      {
        item Motor SG90',
        borrowedDate: '2025-11-10',
        dueDate: '2025-11-17',
        returnedDate: '2025-11-16',
        status,
        itemCondition - Working properly',
      },
    ],
  },
  'Emily Davis': {
    name Davis',
    email: 'emily.davis@student.edu',
    phone: '+1 (555) 789-0123',
    borrowings
      {
        item Driver L298N',
        borrowedDate: '2025-11-22',
        dueDate: '2025-11-27',
        status,
      },
    ],
  },
  'Chris Lee': {
    name Lee',
    email: 'chris.lee@student.edu',
    phone: '+1 (555) 890-1234',
    borrowings
      {
        item Module OV7670',
        borrowedDate: '2025-11-26',
        dueDate: '2025-11-28',
        status,
      },
    ],
  },
};


export function Dashboard({ onNavigate } = {}) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleUserClick = (userName) => {
    setSelectedUser(userName);
    setDialogOpen(true);
  };

  const scrollToLowStock = () => {
    const element = document.getElementById('low-stock-section');
    if (element) {
      element.scrollIntoView({ behavior, block });
    }
  };

  const navigateToBorrowing = () => {
    if (onNavigate) {
      onNavigate('borrowing');
    }
  };

  const navigateToComponents = () => {
    if (onNavigate) {
      onNavigate('components');
    }
  };

  const navigateToRequests = () => {
    if (onNavigate) {
      onNavigate('requests');
    }
  };

  const selectedUserDetails = selectedUser ? userDetailsData[selectedUser] : null;

  const stats = [
    {
      title Components',
      value,
      change: '+12 this month',
      icon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title Requests',
      value,
      change pending approval',
      icon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title Stock Items',
      value,
      change attention',
      icon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title Borrowings',
      value,
      change overdue',
      icon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const recentActivity = [
    { user Doe', action, item Uno R3', time hours ago' },
    { user Smith', action, item Pi 4', time hours ago' },
    { user Johnson', action, item Dev Board', time hours ago' },
    { user Wilson', action, item Sensor', time day ago' },
    { user Brown', action, item Frame Kit', time day ago' },
  ];

  const lowStockItems = [
    { name Nano', current, threshold, category },
    { name Sensor HC-SR04', current, threshold, category },
    { name Motor SG90', current, threshold, category },
    { name 830 Points', current, threshold, category },
    { name Wires (Pack)', current, threshold, category },
  ];

  const overdueItems = [
    { user Chen', item Module NEO-6M', dueDate days ago', duration days' },
    { user Davis', item Driver L298N', dueDate day ago', duration day' },
    { user Lee', item Module OV7670', dueDate hours ago', duration hours' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Monitor your IoT lab inventory at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isClickable = stat.title === 'Low Stock Items' || stat.title === 'Active Borrowings' || stat.title === 'Total Components' || stat.title === 'Borrow Requests';
          const handleClick = () => {
            if (stat.title === 'Total Components') {
              navigateToComponents();
            } else if (stat.title === 'Low Stock Items') {
              scrollToLowStock();
            } else if (stat.title === 'Active Borrowings') {
              navigateToBorrowing();
            } else if (stat.title === 'Borrow Requests') {
              navigateToRequests();
            }
          };
          
          return (
            <Card 
              key={index}
              className={isClickable ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}
              onClick={isClickable ? handleClick : undefined}
            >
              <CardContent className="p-6 bg-[rgba(0,0,0,0)]">
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
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <button
                  key={index}
                  onClick={() => handleUserClick(activity.user)}
                  className="w-full flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-blue-50 transition-colors rounded px-2 -mx-2 text-left"
                >
                  <div className="flex-1">
                    <div className="text-sm text-gray-900 inline-flex items-center gap-1">
                      {activity.user}
                      <Users className="w-3 h-3" />
                    </div>
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
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overdue Items */}
        <Card>
          <CardHeader>
            <CardTitle>Overdue Items</CardTitle>
            <CardDescription>Components that need to be returned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overdueItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleUserClick(item.user)}
                  className="w-full flex items-start justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-blue-50 transition-colors rounded px-2 -mx-2 text-left"
                >
                  <div className="flex-1">
                    <div className="text-sm text-gray-900 inline-flex items-center gap-1">
                      {item.user}
                      <Users className="w-3 h-3" />
                    </div>
                    <p className="text-sm text-gray-600">{item.item}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">Overdue</Badge>
                    <p className="text-xs text-gray-500 mt-1">{item.dueDate}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Items */}
      <Card id="low-stock-section">
        <CardHeader>
          <CardTitle>Low Stock Alert</CardTitle>
          <CardDescription>Components below minimum threshold</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lowStockItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-900">Current: {item.current}</p>
                    <p className="text-sm text-gray-500">Min: {item.threshold}</p>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        (item.current / item.threshold) * 100 < 30
                          ? 'bg-red-500'
                          : (item.current / item.threshold) * 100 < 50
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((item.current / item.threshold) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Complete borrowing history and contact information</DialogDescription>
          </DialogHeader>
          
          {selectedUserDetails && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h3 className="text-gray-900">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-900">{selectedUserDetails.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{selectedUserDetails.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{selectedUserDetails.phone}</span>
                  </div>
                </div>
              </div>

              {/* Borrowing History */}
              <div>
                <h3 className="text-gray-900 mb-4">Borrowing History</h3>
                <div className="space-y-4">
                  {selectedUserDetails.borrowings.map((borrowing, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-gray-900">{borrowing.item}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {borrowing.status === 'active' && (
                                  <Badge variant="default">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Active
                                  </Badge>
                                )}
                                {borrowing.status === 'returned' && (
                                  <Badge variant="secondary">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Returned
                                  </Badge>
                                )}
                                {borrowing.status === 'overdue' && (
                                  <Badge variant="destructive">
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Overdue
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Borrowed Date</p>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <p className="text-sm text-gray-900">{borrowing.borrowedDate}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Due Date</p>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <p className="text-sm text-gray-900">{borrowing.dueDate}</p>
                              </div>
                            </div>
                          </div>

                          {borrowing.returnedDate && (
                            <div className="pt-3 border-t border-gray-100">
                              <div className="mb-2">
                                <p className="text-xs text-gray-500 mb-1">Returned Date</p>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-3 h-3 text-gray-400" />
                                  <p className="text-sm text-gray-900">{borrowing.returnedDate}</p>
                                </div>
                              </div>
                              {borrowing.itemCondition && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-500 mb-1">Item Condition</p>
                                  <div className="bg-green-50 border border-green-200 rounded-md p-2">
                                    <p className="text-sm text-green-700">{borrowing.itemCondition}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Borrowings</p>
                    <p className="text-xl text-gray-900">{selectedUserDetails.borrowings.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active</p>
                    <p className="text-xl text-blue-600">
                      {selectedUserDetails.borrowings.filter(b => b.status === 'active').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Overdue</p>
                    <p className="text-xl text-red-600">
                      {selectedUserDetails.borrowings.filter(b => b.status === 'overdue').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}