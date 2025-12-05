import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Trash2, User, Shield, AlertCircle, Eye, X, Calendar, Package } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";

export function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch('/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users');
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUserDetails = async (userId) => {
        setLoadingDetails(true);
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`/api/admin/users/${userId}/details`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }

            const data = await response.json();
            setUserDetails(data);
        } catch (err) {
            console.error('Error fetching user details:', err);
            toast.error('Failed to load user details');
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        fetchUserDetails(user._id);
    };

    const handleDeleteUser = async (userId) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete user');
            }

            setUsers(users.filter(user => user._id !== userId));
            toast.success('User deleted successfully');
        } catch (err) {
            console.error('Error deleting user:', err);
            toast.error(err.message || 'Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-gray-900 mb-2">Users Management</h2>
                        <p className="text-gray-600">View and manage all registered users</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search users by name or email..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                            Loading users...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                            No users found matching your search.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map(user => (
                                        <TableRow key={user._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewUser(user)}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${user.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{user.name}</p>
                                                        <p className="text-sm text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className={user.role === 'admin' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : ''}>
                                                    {user.role === 'admin' ? (
                                                        <div className="flex items-center gap-1">
                                                            <Shield className="w-3 h-3" />
                                                            Admin
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1">
                                                            <User className="w-3 h-3" />
                                                            User
                                                        </div>
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300" onClick={() => handleViewUser(user)}>
                                                                <Eye className="w-4 h-4 text-blue-600" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>View Details</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <AlertDialog>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300">
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Delete User</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter className="flex flex-row gap-2 justify-end">
                                                                <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDeleteUser(user._id)}
                                                                    className="bg-red-600 hover:bg-red-700 text-white mt-0"
                                                                    style={{
                                                                        backgroundColor: '#dc2626',
                                                                        color: 'white',
                                                                        padding: '0.5rem 1rem',
                                                                        borderRadius: '0.375rem'
                                                                    }}
                                                                >
                                                                    Confirm
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* User Details Dialog */}
            <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>
                            View detailed information and borrowing history for this user.
                        </DialogDescription>
                    </DialogHeader>

                    {loadingDetails ? (
                        <div className="py-8 text-center text-gray-500">Loading details...</div>
                    ) : userDetails ? (
                        <div className="space-y-6">
                            {/* User Info */}
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl ${userDetails.user.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                    {userDetails.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{userDetails.user.name}</h3>
                                    <p className="text-gray-600">{userDetails.user.email}</p>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="outline">{userDetails.user.role}</Badge>
                                        <Badge variant="outline">Joined: {new Date(userDetails.user.createdAt).toLocaleDateString()}</Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Borrowing History */}
                            <div>
                                <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Borrowing History
                                </h4>
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Component</TableHead>
                                                <TableHead>Qty</TableHead>
                                                <TableHead>Borrowed</TableHead>
                                                <TableHead>Due</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {userDetails.history && userDetails.history.length > 0 ? (
                                                userDetails.history.map((record) => (
                                                    <TableRow key={record._id}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <Package className="w-4 h-4 text-gray-400" />
                                                                {record.componentName}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{record.quantity}</TableCell>
                                                        <TableCell>{new Date(record.borrowDate).toLocaleDateString()}</TableCell>
                                                        <TableCell>{new Date(record.dueDate).toLocaleDateString()}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={
                                                                record.status === 'active' ? 'default' :
                                                                    record.status === 'returned' ? 'secondary' : 'destructive'
                                                            }>
                                                                {record.status}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                                        No borrowing history found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-8 text-center text-red-500">Failed to load user details</div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
