import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ShoppingCart, AlertTriangle, XCircle, Download } from 'lucide-react';
import { toast } from 'sonner';

export function ProcurementList() {
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch('/api/components', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch inventory');
            const data = await response.json();
            setComponents(data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            toast.error('Failed to load inventory data');
        } finally {
            setLoading(false);
        }
    };

    const getStockStatus = (component) => {
        if (component.available === 0) return 'out-of-stock';
        if (component.available <= component.threshold) return 'low-stock';
        return 'in-stock';
    };

    // Filter for low stock and out of stock items
    const procurementItems = components.filter(component => {
        const status = getStockStatus(component);
        return status === 'low-stock' || status === 'out-of-stock';
    });

    const outOfStockCount = procurementItems.filter(c => getStockStatus(c) === 'out-of-stock').length;
    const lowStockCount = procurementItems.filter(c => getStockStatus(c) === 'low-stock').length;

    const handleExport = () => {
        // Simple CSV export
        const headers = ['Component Name', 'Category', 'Current Stock', 'Total Quantity', 'Threshold', 'Status'];
        const rows = procurementItems.map(item => [
            item.name,
            item.category,
            item.available,
            item.quantity,
            item.threshold,
            getStockStatus(item) === 'out-of-stock' ? 'Out of Stock' : 'Low Stock'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'procurement_list.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-center py-12">
                    <p className="text-gray-500">Loading procurement data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Procurement List</h2>
                        <p className="text-gray-600">Items that need to be restocked</p>
                    </div>
                    <Button onClick={handleExport} className="gap-2" disabled={procurementItems.length === 0}>
                        <Download className="w-4 h-4" />
                        Export List
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-red-50 border-red-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-red-600 font-medium mb-1">Out of Stock</p>
                                    <p className="text-3xl font-bold text-red-900">{outOfStockCount}</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <XCircle className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-orange-50 border-orange-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-orange-600 font-medium mb-1">Low Stock</p>
                                    <p className="text-3xl font-bold text-orange-900">{lowStockCount}</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Items to Procure ({procurementItems.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {procurementItems.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Component Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-center">Available</TableHead>
                                    <TableHead className="text-center">Total Qty</TableHead>
                                    <TableHead className="text-center">Threshold</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {procurementItems.map(component => {
                                    const status = getStockStatus(component);
                                    return (
                                        <TableRow key={component._id}>
                                            <TableCell className="font-medium">{component.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{component.category}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center font-bold">
                                                <span className={status === 'out-of-stock' ? 'text-red-600' : 'text-orange-600'}>
                                                    {component.available}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center text-gray-500">{component.quantity}</TableCell>
                                            <TableCell className="text-center text-gray-500">{component.threshold}</TableCell>
                                            <TableCell>
                                                {status === 'out-of-stock' ? (
                                                    <Badge variant="destructive" className="gap-1">
                                                        <XCircle className="w-3 h-3" /> Out of Stock
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-orange-500 gap-1">
                                                        <AlertTriangle className="w-3 h-3" /> Low Stock
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12">
                            <div className="bg-green-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                                <ShoppingCart className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Inventory is Healthy</h3>
                            <p className="text-gray-500">No items are currently low on stock or out of stock.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
