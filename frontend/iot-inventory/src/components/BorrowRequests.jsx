import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Clock, CheckCircle, XCircle, AlertCircle, Mail, Phone, User } from 'lucide-react';
import { toast } from 'sonner';

export function BorrowRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseAction, setResponseAction] = useState('');
  const [adminResponse, setAdminResponse] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = sessionStorage.getItem('token');
      console.log('Fetching borrow requests...');
      const response = await fetch('/api/borrow-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Response status:', response.status);
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      console.log('Fetched requests:', data);
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load borrow requests');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenResponseDialog = (request, action) => {
    setSelectedRequest(request);
    setResponseAction(action);
    setAdminResponse('');
    setIsResponseDialogOpen(true);
  };

  const handleSubmitResponse = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const endpoint = responseAction === 'approve' ? 'approve' : 'reject';

      const response = await fetch(`/api/borrow-requests/${selectedRequest.id}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ adminResponse })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${responseAction} request`);
      }

      toast.success(`Request ${responseAction}d successfully`);
      setIsResponseDialogOpen(false);
      fetchRequests();
    } catch (error) {
      console.error(`Error ${responseAction}ing request:`, error);
      toast.error(error.message || `Failed to ${responseAction} request`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

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
            <h2 className="text-gray-900 mb-2">Borrow Requests</h2>
            <p className="text-gray-600">Review and manage student borrow requests</p>
          </div>
          <div className="flex gap-4">
            <Card className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
                </div>
              </div>
            </Card>
            <Card className="px-4 py-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Processed</p>
                  <p className="text-2xl font-bold text-gray-900">{processedRequests.length}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {pendingRequests.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Pending Requests ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Component</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Expected Return</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map(request => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{request.userName}</p>
                        <div className="flex flex-col gap-1 mt-1">
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" />{request.userEmail}
                          </p>
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <Phone className="w-3 h-3" />{request.userPhone}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{request.componentName}</TableCell>
                    <TableCell className="text-center">{request.quantity}</TableCell>
                    <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(request.expectedReturnDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <p className="text-sm max-w-xs truncate" title={request.purpose}>
                        {request.purpose}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleOpenResponseDialog(request, 'approve')}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleOpenResponseDialog(request, 'reject')}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {processedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processed Requests ({processedRequests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Component</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Response</TableHead>
                  <TableHead>Responded By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedRequests.map(request => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{request.userName}</p>
                        <p className="text-xs text-gray-600">{request.userEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{request.componentName}</TableCell>
                    <TableCell className="text-center">{request.quantity}</TableCell>
                    <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <p className="text-sm max-w-xs truncate" title={request.adminResponse}>
                        {request.adminResponse || 'No response'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">{request.respondedBy || 'N/A'}</p>
                      {request.responseDate && (
                        <p className="text-xs text-gray-500">
                          {new Date(request.responseDate).toLocaleDateString()}
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {requests.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Borrow Requests</h3>
            <p className="text-gray-500 mb-4">
              Student borrow requests will appear here when they submit requests
            </p>
            <p className="text-sm text-gray-400">
              This feature allows students to request components before borrowing
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {responseAction === 'approve' ? 'Approve' : 'Reject'} Borrow Request
            </DialogTitle>
            <DialogDescription>
              {responseAction === 'approve'
                ? 'This will create a borrowing record and update component availability.'
                : 'Provide a reason for rejecting this request.'}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm"><span className="font-medium">Student:</span> {selectedRequest.userName}</p>
                <p className="text-sm"><span className="font-medium">Component:</span> {selectedRequest.componentName}</p>
                <p className="text-sm"><span className="font-medium">Quantity:</span> {selectedRequest.quantity}</p>
                <p className="text-sm"><span className="font-medium">Purpose:</span> {selectedRequest.purpose}</p>
              </div>

              <div>
                <Label htmlFor="response">
                  {responseAction === 'approve' ? 'Approval Message (Optional)' : 'Rejection Reason'}
                </Label>
                <Textarea
                  id="response"
                  value={adminResponse}
                  onChange={e => setAdminResponse(e.target.value)}
                  placeholder={responseAction === 'approve'
                    ? 'Add any notes or instructions...'
                    : 'Please provide a reason for rejection...'}
                  rows={3}
                  className="mt-2"
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