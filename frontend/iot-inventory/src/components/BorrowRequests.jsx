import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Clock, CheckCircle, XCircle, AlertCircle, Mail, Phone, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export function BorrowRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [editedQuantities, setEditedQuantities] = useState({});
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [responseAction, setResponseAction] = useState('');
  const [adminResponse, setAdminResponse] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('/api/borrow-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load borrow requests');
    } finally {
      setLoading(false);
    }
  };

  // Group requests by requestGroupId
  // Group requests by user + date + purpose (to combine requests submitted separately)
  const groupedRequests = requests.reduce((groups, request) => {
    // Create a unique key based on user, date, and purpose
    const groupKey = `${request.userEmail}-${new Date(request.requestDate).toDateString()}-${request.purpose}`;

    if (!groups[groupKey]) {
      groups[groupKey] = {
        groupId: groupKey,
        userName: request.userName,
        userEmail: request.userEmail,
        userPhone: request.userPhone,
        requestDate: request.requestDate,
        expectedReturnDate: request.expectedReturnDate,
        purpose: request.purpose,
        status: request.status,
        components: []
      };
    }
    groups[groupKey].components.push(request);
    return groups;
  }, {});

  const groupedArray = Object.values(groupedRequests);
  const pendingGroups = groupedArray.filter(g => g.status === 'pending');
  const processedGroups = groupedArray.filter(g => g.status !== 'pending');

  const toggleGroup = (groupId) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const updateQuantity = (requestId, newQuantity) => {
    setEditedQuantities(prev => ({
      ...prev,
      [requestId]: newQuantity
    }));
  };

  const handleOpenResponseDialog = (group, action) => {
    setSelectedGroup(group);
    setResponseAction(action);
    setAdminResponse('');
    setIsResponseDialogOpen(true);
  };

  const handleSubmitResponse = async () => {
    if (responseAction === 'reject' && !adminResponse.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const endpoint = responseAction === 'approve' ? 'approve' : 'reject';

      // Process each component in the group
      const promises = selectedGroup.components.map(request => {
        const quantity = editedQuantities[request.id] || request.quantity;
        return fetch(`/api/borrow-requests/${request.id}/${endpoint}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            adminResponse,
            approvedQuantity: responseAction === 'approve' ? quantity : undefined
          })
        });
      });

      const responses = await Promise.all(promises);
      const failed = responses.some(r => !r.ok);

      if (failed) {
        const failedResponse = responses.find(r => !r.ok);
        const errorData = await failedResponse.json();
        throw new Error(errorData.message || `Failed to ${responseAction} request`);
      }

      toast.success(`Request ${responseAction}d successfully`);
      setIsResponseDialogOpen(false);
      setEditedQuantities({});
      fetchRequests();
    } catch (error) {
      console.error(`Error ${responseAction}ing request:`, error);
      toast.error(error.message || `Failed to ${responseAction} request`);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading borrow requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Borrow Requests</h2>
            <p className="text-gray-600">Review and manage student borrow requests</p>
          </div>
          <div className="flex gap-4">
            <Card className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingGroups.length}</p>
                </div>
              </div>
            </Card>
            <Card className="px-4 py-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Processed</p>
                  <p className="text-2xl font-bold text-gray-900">{processedGroups.length}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingGroups.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="bg-yellow-50">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Pending Requests ({pendingGroups.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Components</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Expected Return</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingGroups.map(group => (
                    <React.Fragment key={group.groupId}>
                      <TableRow className="hover:bg-gray-50 cursor-pointer">
                        <TableCell onClick={() => toggleGroup(group.groupId)}>
                          {expandedGroups.has(group.groupId) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </TableCell>
                        <TableCell onClick={() => toggleGroup(group.groupId)}>
                          <div>
                            <p className="font-medium text-gray-900">{group.userName}</p>
                            <div className="flex flex-col gap-1 mt-1">
                              <p className="text-xs text-gray-600 flex items-center gap-1">
                                <Mail className="w-3 h-3" />{group.userEmail}
                              </p>
                              <p className="text-xs text-gray-600 flex items-center gap-1">
                                <Phone className="w-3 h-3" />{group.userPhone}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell onClick={() => toggleGroup(group.groupId)}>
                          <Badge variant="secondary">{group.components.length} items</Badge>
                        </TableCell>
                        <TableCell onClick={() => toggleGroup(group.groupId)}>
                          {new Date(group.requestDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell onClick={() => toggleGroup(group.groupId)}>
                          {new Date(group.expectedReturnDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell onClick={() => toggleGroup(group.groupId)}>
                          <p className="text-sm max-w-xs truncate" title={group.purpose}>
                            {group.purpose}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end items-center">
                            <Button
                              size="sm"
                              style={{ backgroundColor: '#16a34a', color: 'white' }}
                              className="hover:bg-green-700 min-w-[90px]"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenResponseDialog(group, 'approve');
                              }}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenResponseDialog(group, 'reject');
                              }}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedGroups.has(group.groupId) && (
                        <TableRow>
                          <TableCell colSpan={7} className="bg-gray-50 p-4">
                            <div className="ml-8">
                              <h4 className="font-medium text-gray-900 mb-3">Requested Components:</h4>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Component Name</TableHead>
                                    <TableHead className="text-center">Requested Qty</TableHead>
                                    <TableHead className="text-center">Approve Qty</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {group.components.map(component => (
                                    <TableRow key={component.id}>
                                      <TableCell className="font-medium">{component.componentName}</TableCell>
                                      <TableCell className="text-center">{component.quantity}</TableCell>
                                      <TableCell className="text-center">
                                        <Input
                                          type="number"
                                          min="0"
                                          max={component.quantity}
                                          value={editedQuantities[component.id] ?? component.quantity}
                                          onChange={(e) => updateQuantity(component.id, parseInt(e.target.value) || 0)}
                                          className="w-20 mx-auto text-center"
                                        />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processed Requests */}
      {processedGroups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processed Requests ({processedGroups.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Student</TableHead>
                    <TableHead>Components</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Response</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedGroups.map(group => (
                    <TableRow key={group.groupId}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{group.userName}</p>
                          <p className="text-xs text-gray-600">{group.userEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{group.components.length} items</Badge>
                      </TableCell>
                      <TableCell>{new Date(group.requestDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {group.status === 'approved' ? (
                          <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
                        ) : (
                          <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm max-w-xs truncate">
                          {group.components[0]?.adminResponse || 'No response'}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {requests.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Borrow Requests</h3>
            <p className="text-gray-500 mb-4">
              Student borrow requests will appear here when they submit requests
            </p>
          </CardContent>
        </Card>
      )}

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {responseAction === 'approve' ? 'Approve' : 'Reject'} Borrow Request
            </DialogTitle>
            <DialogDescription>
              {responseAction === 'approve'
                ? 'Review the quantities and approve this request. This will create borrowing records and update component availability.'
                : 'Provide a reason for rejecting this request. The student will see your response.'}
            </DialogDescription>
          </DialogHeader>

          {selectedGroup && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm"><span className="font-medium">Student:</span> {selectedGroup.userName}</p>
                <p className="text-sm"><span className="font-medium">Email:</span> {selectedGroup.userEmail}</p>
                <p className="text-sm"><span className="font-medium">Purpose:</span> {selectedGroup.purpose}</p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Components:</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead className="text-center">Requested</TableHead>
                      {responseAction === 'approve' && <TableHead className="text-center">Approving</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedGroup.components.map(component => (
                      <TableRow key={component.id}>
                        <TableCell>{component.componentName}</TableCell>
                        <TableCell className="text-center">{component.quantity}</TableCell>
                        {responseAction === 'approve' && (
                          <TableCell className="text-center font-medium text-green-600">
                            {editedQuantities[component.id] ?? component.quantity}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div>
                <Label htmlFor="response">
                  {responseAction === 'approve' ? 'Approval Message (Optional)' : 'Rejection Reason *'}
                </Label>
                <Textarea
                  id="response"
                  value={adminResponse}
                  onChange={e => setAdminResponse(e.target.value)}
                  placeholder={responseAction === 'approve'
                    ? 'Add any notes or instructions...'
                    : 'Please provide a reason for rejection (required)...'}
                  rows={3}
                  className="mt-2"
                  required={responseAction === 'reject'}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className={responseAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
                  variant={responseAction === 'reject' ? 'destructive' : 'default'}
                  onClick={handleSubmitResponse}
                >
                  {responseAction === 'approve' ? 'Approve Request' : 'Reject Request'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}