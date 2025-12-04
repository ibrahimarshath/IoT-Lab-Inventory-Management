import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Search, CheckCircle, AlertCircle, Clock, Mail, Phone, X } from 'lucide-react';




export function BorrowingManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Form states
  const [formUserName, setFormUserName] = useState('');
  const [formUserEmail, setFormUserEmail] = useState('');
  const [formUserPhone, setFormUserPhone] = useState('');
  const [formComponent, setFormComponent] = useState('');
  const [formQuantity, setFormQuantity] = useState('1');
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [formReturnDate, setFormReturnDate] = useState('');
  const [formPurpose, setFormPurpose] = useState('');

  const handleUserClick = (userName) => {
    setSelectedUser(userName);
    setUserDialogOpen(true);
  };

  const components = [
    { id: 'COMP-001', name: 'Arduino Uno R3', category: 'Microcontroller', available: 5 },
    { id: 'COMP-002', name: 'Raspberry Pi 4 Model B (4GB)', category: 'Single Board Computer', available: 3 },
    { id: 'COMP-003', name: 'STM32 DevKit V1', category: 'Development Board', available: 4 },
    { id: 'COMP-004', name: 'LIDAR Sensor TFMini Plus', category: 'Sensor', available: 2 },
    { id: 'COMP-005', name: 'Ultrasonic Sensor HC-SR04', category: 'Sensor', available: 8 },
    { id: 'COMP-006', name: 'Servo Motor SG90', category: 'Motor', available: 10 },
    { id: 'COMP-007', name: 'Motor Driver L298N', category: 'Driver', available: 6 },
    { id: 'COMP-008', name: 'GPS Module NEO-6M', category: 'Sensor', available: 3 },
  ];

  const borrowings = [
    {
      id: 'BRW-001',
      userName: 'John Doe',
      userEmail: 'john.doe@student.edu',
      userPhone: '+1 (555) 123-4567',
      componentName: 'Arduino Uno R3',
      quantity: 2,
      borrowDate: '2024-11-20',
      expectedReturnDate: '2024-11-27',
      status: 'active',
      purpose: 'Line follower robot project',
    },
    {
      id: 'BRW-002',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@student.edu',
      userPhone: '+1 (555) 234-5678',
      componentName: 'Raspberry Pi 4 Model B (4GB)',
      quantity: 1,
      borrowDate: '2024-11-15',
      expectedReturnDate: '2024-11-22',
      actualReturnDate: '2024-11-23',
      status: 'returned',
      purpose: 'Computer vision project',
    },
    {
      id: 'BRW-003',
      userName: 'Mike Johnson',
      userEmail: 'mike.j@student.edu',
      userPhone: '+1 (555) 345-6789',
      componentName: 'STM32 DevKit V1',
      quantity: 1,
      borrowDate: '2024-11-22',
      expectedReturnDate: '2024-11-29',
      status: 'active',
      purpose: 'Smart home automation',
    },
    {
      id: 'BRW-004',
      userName: 'Sarah Wilson',
      userEmail: 'sarah.w@student.edu',
      userPhone: '+1 (555) 456-7890',
      componentName: 'LIDAR Sensor TFMini Plus',
      quantity: 1,
      borrowDate: '2024-11-10',
      expectedReturnDate: '2024-11-17',
      actualReturnDate: '2024-11-18',
      status: 'overdue',
      purpose: 'Obstacle detection and navigation',
    },
    {
      id: 'BRW-005',
      userName: 'Tom Brown',
      userEmail: 'tom.brown@student.edu',
      userPhone: '+1 (555) 567-8901',
      componentName: 'Motor Driver L298N',
      quantity: 2,
      borrowDate: '2024-11-18',
      expectedReturnDate: '2024-11-25',
      status: 'active',
      purpose: 'DC motor control project',
    },
    {
      id: 'BRW-006',
      userName: 'Alex Chen',
      userEmail: 'alex.chen@student.edu',
      userPhone: '+1 (555) 678-9012',
      componentName: 'GPS Module NEO-6M',
      quantity: 1,
      borrowDate: '2024-11-12',
      expectedReturnDate: '2024-11-25',
      status: 'active',
      purpose: 'GPS tracking system',
    },
    {
      id: 'BRW-007',
      userName: 'Emily Davis',
      userEmail: 'emily.d@student.edu',
      userPhone: '+1 (555) 789-0123',
      componentName: 'Motor Driver L298N',
      quantity: 1,
      borrowDate: '2024-11-15',
      expectedReturnDate: '2024-11-26',
      status: 'active',
      purpose: 'Autonomous car project',
    },
    {
      id: 'BRW-008',
      userName: 'Chris Lee',
      userEmail: 'chris.lee@student.edu',
      userPhone: '+1 (555) 890-1234',
      componentName: 'Ultrasonic Sensor HC-SR04',
      quantity: 3,
      borrowDate: '2024-11-24',
      expectedReturnDate: '2024-11-27',
      status: 'active',
      purpose system',
    },
  ];

  const activeBorrowings = borrowings.filter(b => b.status === 'active');
  const overdueBorrowings = borrowings.filter(b => b.status === 'overdue');
  const returnedBorrowings = borrowings.filter(b => b.status === 'returned');

  const filteredBorrowings = (list) => 
    list.filter(b =>
      b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.componentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active' <Badge className="bg-blue-500"><Clock className="w-3 h-3 mr-1" />Active</Badge>;
      case 'overdue' <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Overdue</Badge>;
      case 'returned' <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Returned</Badge>;
      default null;
    }
  };

  const getDaysOverdue = (expectedReturnDate) => {
    const expected = new Date(expectedReturnDate);
    const today = new Date();
    const diffTime = today.getTime() - expected.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const resetForm = () => {
    setFormUserName('');
    setFormUserEmail('');
    setFormUserPhone('');
    setFormComponent('');
    setFormQuantity('1');
    setSelectedComponents([]);
    setFormReturnDate('');
    setFormPurpose('');
  };

  const handleDialogChange = (open) => {
    setIsAddDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleAddComponent = () => {
    if (formComponent && formQuantity && parseInt(formQuantity) > 0) {
      const component = components.find(c => c.name === formComponent);
      if (component && !selectedComponents.find(sc => sc.componentId === component.id)) {
        setSelectedComponents([
          ...selectedComponents,
          {
            componentId: component.id,
            componentName: component.name,
            quantity: parseInt(formQuantity),
          },
        ]);
        setFormComponent('');
        setFormQuantity('1');
      }
    }
  };

  const handleRemoveComponent = (componentId) => {
    setSelectedComponents(selectedComponents.filter(sc => sc.componentId !== componentId));
  };

  const BorrowingTable = ({ borrowings }: { borrowings }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[160px]">User</TableHead>
          <TableHead className="min-w-[180px]">Component</TableHead>
          <TableHead className="w-[60px]">Qty</TableHead>
          <TableHead className="w-[110px]">Borrow Date</TableHead>
          <TableHead className="w-[120px]">Return Date</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead className="w-[180px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {borrowings.map(borrowing => (
          <TableRow key={borrowing.id}>
            <TableCell>
              <button
                onClick={() => handleUserClick(borrowing.userName)}
                className="text-left hover:bg-blue-50 p-2 -m-2 rounded transition-colors w-full"
              >
                <p className="text-sm text-gray-900 break-words">{borrowing.userName}</p>
                <p className="text-xs text-gray-500 break-words">{borrowing.userEmail}</p>
              </button>
            </TableCell>
            <TableCell>
              <div>
                <p className="text-sm text-gray-900 break-words">{borrowing.componentName}</p>
                <p className="text-xs text-gray-500 break-words">{borrowing.purpose}</p>
              </div>
            </TableCell>
            <TableCell>{borrowing.quantity}</TableCell>
            <TableCell className="text-sm whitespace-nowrap">
              {new Date(borrowing.borrowDate).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-sm">
              <div>
                <p className="whitespace-nowrap">{new Date(borrowing.expectedReturnDate).toLocaleDateString()}</p>
                {borrowing.status === 'overdue' && (
                  <p className="text-xs text-red-600 whitespace-nowrap">
                    {getDaysOverdue(borrowing.expectedReturnDate)} days overdue
                  </p>
                )}
                {borrowing.actualReturnDate && (
                  <p className="text-xs text-gray-500 whitespace-nowrap">
                    Returned: {new Date(borrowing.actualReturnDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(borrowing.status)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                {borrowing.status !== 'returned' && (
                  <Button size="sm" variant="outline" className="whitespace-nowrap">
                    Mark Returned
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
        {borrowings.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-gray-500 py-8">
              No borrowings found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900 mb-2">Borrow & Return Management</h2>
            <p className="text-gray-600">Track all component borrowing activities</p>
          </div>
          <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            New Borrowing
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={handleDialogChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Record New Borrowing</DialogTitle>
                <DialogDescription>Enter the borrowing details</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="userName">Student Name</Label>
                  <Input
                    id="userName"
                    placeholder="Enter student name"
                    value={formUserName}
                    onChange={(e) => setFormUserName(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="userEmail">Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      placeholder="student@example.edu"
                      value={formUserEmail}
                      onChange={(e) => setFormUserEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="userPhone">Phone Number</Label>
                    <Input
                      id="userPhone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formUserPhone}
                      onChange={(e) => setFormUserPhone(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <Label className="mb-3 block">Components to Borrow</Label>
                  
                  {/* Add Component Section */}
                  <div className="grid grid-cols-12 gap-2 mb-3">
                    <div className="col-span-7">
                      <Select value={formComponent} onValueChange={setFormComponent}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select component" />
                        </SelectTrigger>
                        <SelectContent>
                          {components.filter(comp => !selectedComponents.find(sc => sc.componentId === comp.id)).map(comp => (
                            <SelectItem key={comp.id} value={comp.name}>
                              {comp.name} ({comp.available} available)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder="Qty" 
                        value={formQuantity} 
                        onChange={(e) => setFormQuantity(e.target.value)} 
                      />
                    </div>
                    <div className="col-span-2">
                      <Button 
                        type="button" 
                        className="w-full gap-1" 
                        size="sm"
                        onClick={handleAddComponent}
                        disabled={!formComponent || !formQuantity || parseInt(formQuantity) <= 0}
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Selected Components List */}
                  {selectedComponents.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {selectedComponents.map((sc) => (
                        <div key={sc.componentId} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">{sc.quantity}x</Badge>
                            <span className="text-sm">{sc.componentName}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveComponent(sc.componentId)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedComponents.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                      No components added yet
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="returnDate">Expected Return Date</Label>
                    <Input id="returnDate" type="date" value={formReturnDate} onChange={(e) => setFormReturnDate(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="purpose">Purpose / Project</Label>
                    <Input id="purpose" placeholder="e.g., Line follower robot" value={formPurpose} onChange={(e) => setFormPurpose(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsAddDialogOpen(false)} disabled={selectedComponents.length === 0}>
                  Record Borrowing
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by user name, email, or component..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('all')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">All Borrowings</p>
                  <p className="text-3xl text-gray-900">{borrowings.length}</p>
                </div>
                <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('active')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Borrowings</p>
                  <p className="text-3xl text-gray-900">{activeBorrowings.length}</p>
                </div>
                <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('overdue')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Overdue Items</p>
                  <p className="text-3xl text-gray-900">{overdueBorrowings.length}</p>
                </div>
                <div className="bg-red-50 text-red-600 p-3 rounded-lg">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('returned')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Returned This Month</p>
                  <p className="text-3xl text-gray-900">{returnedBorrowings.length}</p>
                </div>
                <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Borrowings</TabsTrigger>
          <TabsTrigger value="active">Active ({activeBorrowings.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueBorrowings.length})</TabsTrigger>
          <TabsTrigger value="returned">Returned ({returnedBorrowings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Borrowings</CardTitle>
            </CardHeader>
            <CardContent>
              <BorrowingTable borrowings={filteredBorrowings(borrowings)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Borrowings</CardTitle>
            </CardHeader>
            <CardContent>
              <BorrowingTable borrowings={filteredBorrowings(activeBorrowings)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Items</CardTitle>
            </CardHeader>
            <CardContent>
              <BorrowingTable borrowings={filteredBorrowings(overdueBorrowings)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returned">
          <Card>
            <CardHeader>
              <CardTitle>Return History</CardTitle>
            </CardHeader>
            <CardContent>
              <BorrowingTable borrowings={filteredBorrowings(returnedBorrowings)} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                <p className="text-sm text-gray-500">{selectedUser?.toLowerCase().replace(' ', '.')}@student.edu</p>
              </div>
            </div>
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-900">{selectedUser?.toLowerCase().replace(' ', '.')}@student.edu</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}