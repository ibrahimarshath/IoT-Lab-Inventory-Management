import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Download, 
  Plus,
  Minus,
  Filter,
  Search,
  History } from 'lucide-react';



export function Inventory() {
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [isMovementHistoryOpen, setIsMovementHistoryOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const inventoryItems = [
    {
      id,
      name Uno R3',
      category,
      quantity,
      available,
      borrowed,
      threshold,
      location A1',
      lastUpdated: '2024-12-01',
      value,
    },
    {
      id,
      name Nano',
      category,
      quantity,
      available,
      borrowed,
      threshold,
      location A2',
      lastUpdated: '2024-12-02',
      value,
    },
    {
      id,
      name Pi 4 (4GB)',
      category Board Computer',
      quantity,
      available,
      borrowed,
      threshold,
      location B1',
      lastUpdated: '2024-11-30',
      value,
    },
    {
      id,
      name DevKit',
      category,
      quantity,
      available,
      borrowed,
      threshold,
      location A3',
      lastUpdated: '2024-12-01',
      value,
    },
    {
      id,
      name Sensor HC-SR04',
      category,
      quantity,
      available,
      borrowed,
      threshold,
      location C2',
      lastUpdated: '2024-12-02',
      value,
    },
    {
      id,
      name Temperature & Humidity Sensor',
      category,
      quantity,
      available,
      borrowed,
      threshold,
      location C3',
      lastUpdated: '2024-12-01',
      value,
    },
    {
      id,
      name Motor SG90',
      category,
      quantity,
      available,
      borrowed,
      threshold,
      location D1',
      lastUpdated: '2024-11-29',
      value,
    },
    {
      id,
      name Motor Driver',
      category Module',
      quantity,
      available,
      borrowed,
      threshold,
      location D2',
      lastUpdated: '2024-12-01',
      value,
    },
    {
      id,
      name 830 Points',
      category,
      quantity,
      available,
      borrowed,
      threshold,
      location E1',
      lastUpdated: '2024-12-02',
      value,
    },
    {
      id,
      name Wires (Pack of 40)',
      category,
      quantity,
      available,
      borrowed,
      threshold,
      location F1',
      lastUpdated: '2024-12-01',
      value,
    },
    {
      id,
      name Display 0.96"',
      category,
      quantity,
      available,
      borrowed,
      threshold,
      location G1',
      lastUpdated: '2024-11-28',
      value,
    },
    {
      id,
      name Supply 5V 2A',
      category,
      quantity,
      available,
      borrowed,
      threshold,
      location H1',
      lastUpdated: '2024-12-01',
      value,
    },
  ];

  const stockMovements = [
    {
      id,
      componentName Uno R3',
      type,
      quantity,
      reason Purchase',
      performedBy,
      date: '2024-12-01',
      notes for upcoming semester',
    },
    {
      id,
      componentName Sensor HC-SR04',
      type,
      quantity,
      reason Borrowing',
      performedBy Smith',
      date: '2024-12-02',
      notes for robotics project',
    },
    {
      id,
      componentName Motor SG90',
      type,
      quantity: -2,
      reason Components',
      performedBy,
      date: '2024-11-29',
      notes damaged during handling',
    },
    {
      id,
      componentName DevKit',
      type,
      quantity,
      reason Purchase',
      performedBy,
      date: '2024-12-01',
      notes stock for IoT projects',
    },
    {
      id,
      componentName Wires (Pack of 40)',
      type,
      quantity,
      reason Borrowing',
      performedBy Johnson',
      date: '2024-12-01',
      notes for circuit assembly',
    },
  ];

  const getStockStatus = (item) => {
    if (item.quantity < item.threshold) {
      return { label Stock', variant };
    } else if (item.quantity <= item.threshold * 1.5) {
      return { label Stock', variant };
    } else {
      return { label Stock', variant };
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'low' && item.quantity < item.threshold) ||
                         (filterStatus === 'available' && item.quantity >= item.threshold);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalItems = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = inventoryItems.reduce((sum, item) => sum + item.value, 0);
  const lowStockItems = inventoryItems.filter(item => item.quantity < item.threshold).length;
  const totalBorrowed = inventoryItems.reduce((sum, item) => sum + item.borrowed, 0);

  const categories = Array.from(new Set(inventoryItems.map(item => item.category)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-2">Inventory Management</h2>
          <p className="text-gray-600">Track and manage all lab components and stock levels</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={() => setIsMovementHistoryOpen(true)}>
            <History className="w-4 h-4" />
            Movement History
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Components</p>
                <p className="text-3xl text-gray-900">{totalItems}</p>
              </div>
              <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Value</p>
                <p className="text-3xl text-gray-900">${totalValue}</p>
              </div>
              <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
                <p className="text-3xl text-gray-900">{lowStockItems}</p>
              </div>
              <div className="bg-red-50 text-red-600 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Currently Borrowed</p>
                <p className="text-3xl text-gray-900">{totalBorrowed}</p>
              </div>
              <div className="bg-orange-50 text-orange-600 p-3 rounded-lg">
                <TrendingDown className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">In Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Component Inventory</CardTitle>
          <CardDescription>Complete overview of all components in the lab</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[180px]">Component</TableHead>
                <TableHead className="w-[120px]">Location</TableHead>
                <TableHead className="w-[100px]">Total Qty</TableHead>
                <TableHead className="w-[100px]">Available</TableHead>
                <TableHead className="w-[100px]">Borrowed</TableHead>
                <TableHead className="w-[100px]">Threshold</TableHead>
                <TableHead className="w-[100px]">Value</TableHead>
                <TableHead className="w-[110px]">Status</TableHead>
                <TableHead className="w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map(item => {
                const status = getStockStatus(item);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm text-gray-900 break-words">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{item.location}</TableCell>
                    <TableCell className="text-sm text-gray-900">{item.quantity}</TableCell>
                    <TableCell className="text-sm text-green-600">{item.available}</TableCell>
                    <TableCell className="text-sm text-orange-600">{item.borrowed}</TableCell>
                    <TableCell className="text-sm text-gray-600">{item.threshold}</TableCell>
                    <TableCell className="text-sm text-gray-900">${item.value}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.quantity < item.threshold ? 'destructive' : 'default'}
                        className={item.quantity < item.threshold ? '' : 'bg-green-500'}
                      >
                        {item.quantity < item.threshold && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedComponent(item);
                          setIsAdjustDialogOpen(true);
                        }}
                      >
                        Adjust Stock
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stock Adjustment Dialog */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Stock Level</DialogTitle>
            <DialogDescription>
              Update inventory for {selectedComponent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Current Stock</Label>
              <Input value={selectedComponent?.quantity || 0} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adjustment-type">Adjustment Type</Label>
              <Select>
                <SelectTrigger id="adjustment-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Stock (Purchase/Return)</SelectItem>
                  <SelectItem value="remove">Remove Stock (Damage/Loss)</SelectItem>
                  <SelectItem value="correct">Correction (Manual Count)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" placeholder="Enter quantity" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea 
                id="reason" 
                placeholder="Explain the reason for this adjustment..." 
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAdjustDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAdjustDialogOpen(false)}>
              Save Adjustment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Movement History Dialog */}
      <Dialog open={isMovementHistoryOpen} onOpenChange={setIsMovementHistoryOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Stock Movement History</DialogTitle>
            <DialogDescription>
              Track all inventory changes and movements
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Component</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Performed By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockMovements.map(movement => (
                  <TableRow key={movement.id}>
                    <TableCell className="text-sm">{movement.date}</TableCell>
                    <TableCell className="text-sm">{movement.componentName}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={movement.type === 'in' ? 'default' : 'secondary'}
                        className={
                          movement.type === 'in' ? 'bg-green-500'  movement.type === 'out' ? 'bg-blue-500'  'bg-orange-500'
                        }
                      >
                        {movement.type === 'in' && <Plus className="w-3 h-3 mr-1" />}
                        {movement.type === 'out' && <Minus className="w-3 h-3 mr-1" />}
                        {movement.type === 'in' ? 'Stock In'  movement.type === 'out' ? 'Stock Out' : 'Adjustment'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className={
                        movement.type === 'in' || (movement.type === 'adjustment' && movement.quantity > 0)
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }>
                        {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{movement.reason}</TableCell>
                    <TableCell className="text-sm">{movement.performedBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
