import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Search, CheckCircle, AlertCircle, Clock, Mail, X, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { BorrowRequests } from './BorrowRequests';

export function BorrowingManagement() {
  const [borrowings, setBorrowings] = useState([]);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showBorrowRequests, setShowBorrowRequests] = useState(false);

  // Form states
  const [formUserName, setFormUserName] = useState('');
  const [formUserEmail, setFormUserEmail] = useState('');
  const [formUserPhone, setFormUserPhone] = useState('');
  const [formComponent, setFormComponent] = useState('');
  const [formQuantity, setFormQuantity] = useState('1');
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [formReturnDate, setFormReturnDate] = useState('');
  const [formPurpose, setFormPurpose] = useState('');

  const fetchBorrowings = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('/api/borrowings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch borrowings');
      const data = await response.json();
      setBorrowings(data);
    } catch (error) {
      console.error('Error fetching borrowings:', error);
      toast.error('Failed to load borrowings');
    } finally {
      setLoading(false);
    }
  };

  const fetchComponents = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('/api/components', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch components');
      const data = await response.json();
      setComponents(data);
    } catch (error) {
      console.error('Error fetching components:', error);
    }
  };

  useEffect(() => {
    fetchBorrowings();
    fetchComponents();
  }, []);

  const handleUserClick = (userName, userEmail) => {
    setSelectedUser({ name: userName, email: userEmail });
    setUserDialogOpen(true);
  };

  const activeBorrowings = borrowings.filter(b => b.status === 'active');
  const overdueBorrowings = borrowings.filter(b => b.status === 'overdue' || (b.status === 'active' && new Date(b.expectedReturnDate) < new Date()));
  const returnedBorrowings = borrowings.filter(b => b.status === 'returned');

  const filteredBorrowings = list => list.filter(b =>
    b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.componentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status, expectedReturnDate) => {
    const isOverdue = status === 'active' && new Date(expectedReturnDate) < new Date();

    if (status === 'returned') {
      return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Returned</Badge>;
    } else if (isOverdue || status === 'overdue') {
      return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Overdue</Badge>;
    } else {
      return <Badge className="bg-blue-500"><Clock className="w-3 h-3 mr-1" />Active</Badge>;
    }
  };

  const getDaysOverdue = expectedReturnDate => {
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

  const handleDialogChange = open => {
    setIsAddDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleAddComponentToSelection = () => {
    if (formComponent && formQuantity && parseInt(formQuantity) > 0) {
      const component = components.find(c => c.name === formComponent);
      if (component && !selectedComponents.find(sc => sc.componentId === component._id)) {
        setSelectedComponents([...selectedComponents, {
          componentId: component._id,
          componentName: component.name,
          quantity: parseInt(formQuantity)
        }]);
        setFormComponent('');
        setFormQuantity('1');
      }
    }
  };

  const handleRemoveComponentFromSelection = componentId => {
    setSelectedComponents(selectedComponents.filter(sc => sc.componentId !== componentId));
  };

  const handleRecordBorrowing = async () => {
    try {
      const token = sessionStorage.getItem('token');

      // We need to make a request for each selected component
      const promises = selectedComponents.map(item => {
        return fetch('/api/borrowings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userEmail: formUserEmail,
            componentId: item.componentId,
            quantity: item.quantity,
            returnDate: formReturnDate,
            purpose: formPurpose
          })
        });
      });

      const results = await Promise.all(promises);

      // Check if any failed
      const failed = results.some(r => !r.ok);
      if (failed) {
        // Try to get error message from first failure
        const failedResponse = results.find(r => !r.ok);
        const errorData = await failedResponse.json();
        throw new Error(errorData.message || 'Some items failed to record');
      }

      toast.success('Borrowing recorded successfully');
      setIsAddDialogOpen(false);
      resetForm();
      fetchBorrowings();
      fetchComponents(); // Refresh components to update availability
    } catch (error) {
      console.error('Error recording borrowing:', error);
      toast.error(error.message || 'Failed to record borrowing');
    }
  };

  const handleMarkReturned = async (id) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`/api/borrowings/${id}/return`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to mark as returned');

      toast.success('Item marked as returned');
      fetchBorrowings();
      fetchComponents(); // Refresh availability
    } catch (error) {
      console.error('Error marking returned:', error);
      toast.error('Failed to update status');
    }
  };

  const BorrowingTable = ({ borrowings }) => (
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
              <button onClick={() => handleUserClick(borrowing.userName, borrowing.userEmail)} className="text-left hover:bg-blue-50 p-2 -m-2 rounded transition-colors w-full">
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
                {borrowing.status === 'active' && new Date(borrowing.expectedReturnDate) < new Date() && (
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
            <TableCell>{getStatusBadge(borrowing.status, borrowing.expectedReturnDate)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                {borrowing.status !== 'returned' && (
                  <Button size="sm" variant="outline" className="whitespace-nowrap" onClick={() => handleMarkReturned(borrowing.id)}>
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
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setShowBorrowRequests(true)}>
              <Bell className="w-4 h-4" />
              Requests
            </Button>
            <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4" />
              New Borrowing
            </Button>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={handleDialogChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Record New Borrowing</DialogTitle>
                <DialogDescription>Enter the borrowing details</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="userName">Student Name (for reference)</Label>
                  <Input id="userName" placeholder="Enter student name" value={formUserName} onChange={e => setFormUserName(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="userEmail">Email (Must match registered user)</Label>
                    <Input id="userEmail" type="email" placeholder="student@example.edu" value={formUserEmail} onChange={e => setFormUserEmail(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="userPhone">Phone Number</Label>
                    <Input id="userPhone" type="tel" placeholder="+1 (555) 000-0000" value={formUserPhone} onChange={e => setFormUserPhone(e.target.value)} />
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
                          {components.filter(comp => !selectedComponents.find(sc => sc.componentId === comp._id)).map(comp => (
                            <SelectItem key={comp._id} value={comp.name}>
                              {comp.name} ({comp.available} available)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Input type="number" min="1" placeholder="Qty" value={formQuantity} onChange={e => setFormQuantity(e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <Button type="button" className="w-full gap-1" size="sm" onClick={handleAddComponentToSelection} disabled={!formComponent || !formQuantity || parseInt(formQuantity) <= 0}>
                        <Plus className="w-4 h-4" />
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Selected Components List */}
                  {selectedComponents.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {selectedComponents.map(sc => (
                        <div key={sc.componentId} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">{sc.quantity}x</Badge>
                            <span className="text-sm">{sc.componentName}</span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveComponentFromSelection(sc.componentId)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
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
                    <Input id="returnDate" type="date" value={formReturnDate} onChange={e => setFormReturnDate(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="purpose">Purpose / Project</Label>
                    <Input id="purpose" placeholder="e.g., Line follower robot" value={formPurpose} onChange={e => setFormPurpose(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleRecordBorrowing} disabled={selectedComponents.length === 0 || !formUserEmail || !formReturnDate}>
                  Record Borrowing
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search by user name, email, or component..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('all')}>
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
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('active')}>
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
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('overdue')}>
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
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('returned')}>
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
            <DialogDescription>Contact information for {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center">
                {selectedUser?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-gray-900">{selectedUser?.name}</p>
                <p className="text-sm text-gray-500">{selectedUser?.email}</p>
              </div>
            </div>
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-900">{selectedUser?.email}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Borrow Requests Dialog */}
      <Dialog open={showBorrowRequests} onOpenChange={setShowBorrowRequests}>
        <DialogContent className="sm:max-w-[95vw] w-[95vw] max-h-[90vh] flex flex-col p-0 bg-white gap-0 overflow-hidden">
          <BorrowRequests adminUsername={sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).name : 'Admin'} />
        </DialogContent>
      </Dialog>
    </div>
  );
}