import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { CheckCircle, XCircle, Trash2, User, Calendar, FileText, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';





export function BorrowRequests({ adminUsername }) {
  const [requests, setRequests] = useState([
    {
      id: 'REQ-001',
      userName: 'John Doe',
      userEmail: 'john.doe@student.edu',
      items: [
        {
          component: {
            id: 'COMP-001',
            name: 'Arduino Uno R3',
            category: 'Microcontroller',
            quantity: 5,
            available: 3,
          },
          quantity: 1
        },
        {
          component: {
            id: 'COMP-002',
            name: 'LIDAR Sensor TFMini Plus',
            category: 'Sensor',
            quantity: 2,
            available: 1,
          },
          quantity: 1
        }
      ],
      purpose: 'Building an autonomous robot for final year project',
      expectedReturn: '2025-12-15',
      submittedAt: '2025-11-28T10:30:00',
      status: 'pending'
    },
    {
      id: 'REQ-002',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@student.edu',
      items: [
        {
          component: {
            id: 'COMP-003',
            name: 'STM32 DevKit V1',
            category: 'Development Board',
            quantity: 3,
            available: 2,
          },
          quantity: 1
        },
        {
          component: {
            id: 'COMP-004',
            name: 'MPU6050 IMU',
            category: 'Sensor',
            quantity: 10,
            available: 8,
          },
          quantity: 2
        }
      ],
      purpose: 'Smart home automation project',
      expectedReturn: '2025-12-20',
      submittedAt: '2025-11-29T14:15:00',
      status: 'pending'
    },
    {
      id: 'REQ-003',
      userName: 'Mike Johnson',
      userEmail: 'mike.johnson@student.edu',
      items: [
        {
          component: {
            id: 'COMP-005',
            name: 'Raspberry Pi 4 Model B (4GB)',
            category: 'Single Board Computer',
            quantity: 4,
            available: 2,
          },
          quantity: 1
        }
      ],
      purpose: 'Machine learning research project',
      expectedReturn: '2025-12-10',
      submittedAt: '2025-11-27T09:00:00',
      status: 'approved',
      approvedBy: 'Dr. Smith',
      approvedAt: '2025-11-27T10:00:00'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editedItems, setEditedItems] = useState([]);
  const [declineReason, setDeclineReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const openRequestDetails = (request) => {
    setSelectedRequest(request);
    setEditedItems([...request.items]);
    setDeclineReason('');
    setIsDetailDialogOpen(true);
  };

  const removeItemFromRequest = (componentId) => {
    setEditedItems(prev => prev.filter(item => item.component.id !== componentId));
  };

  const updateItemQuantity = (componentId, newQuantity) => {
    if (newQuantity < 1) {
      removeItemFromRequest(componentId);
      return;
    }
    const item = editedItems.find(item => item.component.id === componentId);
    if (item && newQuantity > item.component.available) {
      return;
    }
    setEditedItems(prev => prev.map(item =>
      item.component.id === componentId ? { ...item, quantity }
    ));
  };

  const approveRequest = () => {
    if (!selectedRequest) return;
    if (editedItems.length === 0) {
      alert('Cannot approve request with no items');
      return;
    }

    setRequests(prev => prev.map(req =>
      req.id === selectedRequest.id
        ? {
            ...req,
            items,
            status,
            approvedBy,
            approvedAt Date().toISOString()
          }
    ));
    setIsDetailDialogOpen(false);
  };

  const declineRequest = () => {
    if (!selectedRequest) return;
    if (!declineReason.trim()) {
      alert('Please provide a reason for declining');
      return;
    }

    setRequests(prev => prev.map(req =>
      req.id === selectedRequest.id
        ? {
            ...req,
            status,
            declinedBy,
            declinedAt Date().toISOString(),
            declineReason
          }
    ));
    setIsDetailDialogOpen(false);
  };

  const filteredRequests = requests.filter(req => 
    filterStatus === 'all' ? true : req.status === filterStatus
  );

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900 mb-2">Borrow Requests</h2>
            <p className="text-gray-600">Review and manage student borrow requests</p>
          </div>
          {pendingCount > 0 && (
            <Badge variant="default" className="bg-orange-500">
              {pendingCount} Pending Request{pendingCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3">
          <Label>Filter by Status:</Label>
          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Requests Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Components</TableHead>
                <TableHead className="w-[130px]">Expected Return</TableHead>
                <TableHead className="w-[110px]">Submitted</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id} className="cursor-pointer hover:bg-gray-50" onClick={() => openRequestDetails(request)}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.userName}</p>
                      <p className="text-sm text-gray-500">{request.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="space-y-0.5">
                        {request.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="font-medium">
                            {item.component.name}
                          </div>
                        ))}
                        {request.items.length > 2 && (
                          <p className="font-medium">+{request.items.length - 2} more component{request.items.length - 2 !== 1 ? 's' : ''}</p>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{request.purpose}</p>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(request.expectedReturn).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(request.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {request.status === 'pending' && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                    {request.status === 'approved' && (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approved
                      </Badge>
                    )}
                    {request.status === 'declined' && (
                      <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        Declined
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openRequestDetails(request)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredRequests.length === 0 && (
        <Card className="mt-4">
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No {filterStatus !== 'all' ? filterStatus : ''} requests found</p>
          </CardContent>
        </Card>
      )}

      {/* Request Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Borrow Request Details - {selectedRequest?.id}</DialogTitle>
            <DialogDescription>
              Review and manage this borrow request
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              {/* Student Info */}
              <div>
                <div className="mb-3">
                  <Label className="text-sm">Student Name</Label>
                  <p className="mt-1 font-medium">{selectedRequest.userName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Email</Label>
                    <p className="mt-1 font-medium break-words">{selectedRequest.userEmail}</p>
                  </div>
                  <div>
                    <Label className="text-sm">Submitted On</Label>
                    <p className="mt-1 font-medium">{new Date(selectedRequest.submittedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <Label className="text-sm">Purpose of Borrowing</Label>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg text-sm break-words">{selectedRequest.purpose}</p>
              </div>

              {/* Expected Return */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Expected Return Date</Label>
                  <p className="mt-1 font-medium">{new Date(selectedRequest.expectedReturn).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm">Status</Label>
                  <div className="mt-1">
                    {selectedRequest.status === 'pending' && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                    {selectedRequest.status === 'approved' && (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approved
                      </Badge>
                    )}
                    {selectedRequest.status === 'declined' && (
                      <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        Declined
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Info */}
              {selectedRequest.status === 'approved' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    Approved by <span className="font-medium">{selectedRequest.approvedBy}</span> on {new Date(selectedRequest.approvedAt!).toLocaleString()}
                  </p>
                </div>
              )}

              {selectedRequest.status === 'declined' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    Declined by <span className="font-medium">{selectedRequest.declinedBy}</span> on {new Date(selectedRequest.declinedAt!).toLocaleString()}
                  </p>
                  <p className="text-sm text-red-700 mt-2">
                    <span className="font-medium">Reason:</span> {selectedRequest.declineReason}
                  </p>
                </div>
              )}

              {/* Components List */}
              <div>
                <Label className="text-sm mb-3 block">
                  Requested Components
                  {selectedRequest.status === 'pending' && <span className="text-gray-500 ml-1">(You can modify before approving)</span>}
                </Label>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Component Name</TableHead>
                        <TableHead className="w-[120px] text-center">Available</TableHead>
                        <TableHead className="w-[120px] text-center">Quantity</TableHead>
                        {selectedRequest.status === 'pending' && (
                          <TableHead className="w-[80px] text-center">Action</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(selectedRequest.status === 'pending' ? editedItems : selectedRequest.items).map((item) => (
                        <TableRow key={item.component.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.component.name}</p>
                              <Badge variant="secondary" className="mt-1">{item.component.category}</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={item.component.available < item.quantity ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                              {item.component.available}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {selectedRequest.status === 'pending' ? (
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItemQuantity(item.component.id, parseInt(e.target.value) || 1)}
                                className="w-16 text-center mx-auto"
                                min="1"
                                max={item.component.available}
                              />
                            ) : (
                              <span className="font-medium">{item.quantity}</span>
                            )}
                          </TableCell>
                          {selectedRequest.status === 'pending' && (
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItemFromRequest(item.component.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Decline Reason (for pending requests) */}
              {selectedRequest.status === 'pending' && (
                <div>
                  <Label htmlFor="declineReason" className="text-sm">Decline Reason (if declining)</Label>
                  <Textarea
                    id="declineReason"
                    placeholder="Enter reason for declining this request..."
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    rows={3}
                    className="mt-1"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  Cancel
                </Button>
                {selectedRequest.status === 'pending' && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={declineRequest}
                    >
                      Decline Request
                    </Button>
                    <Button
                      onClick={approveRequest}
                      disabled={editedItems.length === 0}
                    >
                      Approve Request
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}