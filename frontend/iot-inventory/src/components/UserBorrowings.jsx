import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Calendar, Package, Search, CheckCircle } from 'lucide-react';
export function UserBorrowings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const borrowings = [{
    id: '1',
    component: 'Arduino Uno R3',
    quantity: 2,
    borrowDate: '2024-11-20',
    expectedReturnDate: '2024-12-05',
    status: 'active',
    daysRemaining: 7
  }, {
    id: '2',
    component: 'ESP32 DevKit V1',
    quantity: 1,
    borrowDate: '2024-11-15',
    expectedReturnDate: '2024-11-25',
    status: 'overdue',
    daysRemaining: -3
  }, {
    id: '3',
    component: 'Ultrasonic Sensor HC-SR04',
    quantity: 3,
    borrowDate: '2024-11-22',
    expectedReturnDate: '2024-12-10',
    status: 'active',
    daysRemaining: 12
  }, {
    id: '4',
    component: 'Servo Motor SG90',
    quantity: 2,
    borrowDate: '2024-11-18',
    expectedReturnDate: '2024-12-02',
    status: 'active',
    daysRemaining: 4
  }, {
    id: '5',
    component: 'Raspberry Pi 4 (4GB)',
    quantity: 1,
    borrowDate: '2024-11-10',
    expectedReturnDate: '2024-11-20',
    actualReturnDate: '2024-11-19',
    status: 'returned',
    daysRemaining: 0
  }, {
    id: '6',
    component: 'DHT22 Temperature Sensor',
    quantity: 2,
    borrowDate: '2024-11-05',
    expectedReturnDate: '2024-11-15',
    actualReturnDate: '2024-11-16',
    status: 'returned',
    daysRemaining: 0
  }];
  const filteredBorrowings = borrowings.filter(b => {
    const matchesSearch = b.component.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || b.status === filterType;
    return matchesSearch && matchesFilter;
  });
  const activeBorrowings = borrowings.filter(b => b.status === 'active');
  const overdueBorrowings = borrowings.filter(b => b.status === 'overdue');
  const returnedBorrowings = borrowings.filter(b => b.status === 'returned');
  return <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">My Borrowings</h2>
        <p className="text-gray-600">Track all your borrowed components</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input placeholder="Search borrowings..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      {/* Stats - Now Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className={`cursor-pointer transition-all hover:shadow-md ${filterType === 'all' ? 'ring-2 ring-blue-600' : ''}`} onClick={() => setFilterType('all')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Borrowings</p>
                <p className="text-3xl text-gray-900">{borrowings.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all hover:shadow-md ${filterType === 'active' ? 'ring-2 ring-green-600' : ''}`} onClick={() => setFilterType('active')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active</p>
                <p className="text-3xl text-gray-900">{activeBorrowings.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all hover:shadow-md ${filterType === 'overdue' ? 'ring-2 ring-red-600' : ''}`} onClick={() => setFilterType('overdue')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Overdue</p>
                <p className="text-3xl text-gray-900">{overdueBorrowings.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                <Package className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all hover:shadow-md ${filterType === 'returned' ? 'ring-2 ring-purple-600' : ''}`} onClick={() => setFilterType('returned')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Returned</p>
                <p className="text-3xl text-gray-900">{returnedBorrowings.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Borrowings List */}
      <div className="space-y-4">
        {filteredBorrowings.map(borrowing => <Card key={borrowing.id} className="border-l-4" style={{
        borderLeftColor: borrowing.status === 'overdue' ? '#ef4444' : borrowing.status === 'returned' ? '#a855f7' : '#3b82f6'
      }}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-900">{borrowing.component}</h3>
                    <Badge variant={borrowing.status === 'overdue' ? 'destructive' : 'default'} className={borrowing.status === 'returned' ? 'bg-purple-500' : borrowing.status === 'active' ? 'bg-green-500' : ''}>
                      {borrowing.status === 'overdue' && 'Overdue'}
                      {borrowing.status === 'active' && 'Active'}
                      {borrowing.status === 'returned' && <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Returned
                        </span>}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Quantity: {borrowing.quantity}
                  </p>
                </div>
                {borrowing.status !== 'returned' && <div className={`text-right ${borrowing.status === 'overdue' ? 'text-red-600' : 'text-blue-600'}`}>
                    <p className="text-sm">
                      {borrowing.status === 'overdue' ? `${Math.abs(borrowing.daysRemaining)} days overdue` : `${borrowing.daysRemaining} days remaining`}
                    </p>
                  </div>}
              </div>

              <div className={`grid ${borrowing.status === 'returned' ? 'grid-cols-3' : 'grid-cols-2'} gap-4 text-sm`}>
                <div>
                  <p className="text-gray-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Borrowed
                  </p>
                  <p className="text-gray-900">
                    {new Date(borrowing.borrowDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Expected Return
                  </p>
                  <p className="text-gray-900">
                    {new Date(borrowing.expectedReturnDate).toLocaleDateString()}
                  </p>
                </div>
                {borrowing.status === 'returned' && borrowing.actualReturnDate && <div>
                    <p className="text-gray-500 mb-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Actual Return
                    </p>
                    <p className="text-gray-900">
                      {new Date(borrowing.actualReturnDate).toLocaleDateString()}
                    </p>
                  </div>}
              </div>
            </CardContent>
          </Card>)}

        {filteredBorrowings.length === 0 && <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {searchQuery ? 'No borrowings found' : filterType === 'all' ? 'No borrowings yet' : `No ${filterType} borrowings`}
            </p>
          </div>}
      </div>
    </div>;
}