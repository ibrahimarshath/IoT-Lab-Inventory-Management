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
import { Package, TrendingUp, TrendingDown, AlertTriangle, Download, Plus, Minus, Search, History, Upload } from 'lucide-react';
import { BulkComponentUpload } from './BulkComponentUpload';

export function Inventory() {
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [isMovementHistoryOpen, setIsMovementHistoryOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const inventoryItems = [{
    id: '1',
    name: 'Arduino Uno R3',
    category: 'Microcontroller',
    quantity: 25,
    available: 18,
    borrowed: 7,
    threshold: 10,
    location: 'Shelf A1',
    lastUpdated: '2024-12-01',
    value: 375
  }, {
    id: '2',
    name: 'Arduino Nano',
    category: 'Microcontroller',
    quantity: 8,
    available: 3,
    borrowed: 5,
    threshold: 10,
    location: 'Shelf A2',
    lastUpdated: '2024-12-02',
    value: 120
  }, {
    id: '3',
    name: 'Raspberry Pi 4 (4GB)',
    category: 'Single Board Computer',
    quantity: 12,
    available: 9,
    borrowed: 3,
    threshold: 5,
    location: 'Shelf B1',
    lastUpdated: '2024-11-30',
    value: 660
  }, {
    id: '4',
    name: 'ESP32 DevKit',
    category: 'Microcontroller',
    quantity: 20,
    available: 15,
    borrowed: 5,
    threshold: 8,
    location: 'Shelf A3',
    lastUpdated: '2024-12-01',
    value: 160
  }, {
    id: '5',
    name: 'Ultrasonic Sensor HC-SR04',
    category: 'Sensor',
    quantity: 5,
    available: 2,
    borrowed: 3,
    threshold: 15,
    location: 'Drawer C2',
    lastUpdated: '2024-12-02',
    value: 15
  }, {
    id: '6',
    name: 'DHT22 Temperature & Humidity Sensor',
    category: 'Sensor',
    quantity: 18,
    available: 12,
    borrowed: 6,
    threshold: 10,
    location: 'Drawer C3',
    lastUpdated: '2024-12-01',
    value: 90
  }, {
    id: '7',
    name: 'Servo Motor SG90',
    category: 'Actuator',
    quantity: 10,
    available: 5,
    borrowed: 5,
    threshold: 20,
    location: 'Drawer D1',
    lastUpdated: '2024-11-29',
    value: 50
  }, {
    id: '8',
    name: 'L298N Motor Driver',
    category: 'Driver Module',
    quantity: 15,
    available: 10,
    borrowed: 5,
    threshold: 15,
    location: 'Drawer D2',
    lastUpdated: '2024-12-01',
    value: 105
  }, {
    id: '9',
    name: 'Breadboard 830 Points',
    category: 'Prototyping',
    quantity: 18,
    available: 14,
    borrowed: 4,
    threshold: 12,
    location: 'Shelf E1',
    lastUpdated: '2024-12-02',
    value: 108
  }, {
    id: '10',
    name: 'Jumper Wires (Pack of 40)',
    category: 'Accessories',
    quantity: 6,
    available: 1,
    borrowed: 5,
    threshold: 8,
    location: 'Drawer F1',
    lastUpdated: '2024-12-01',
    value: 24
  }, {
    id: '11',
    name: 'OLED Display 0.96"',
    category: 'Display',
    quantity: 14,
    available: 9,
    borrowed: 5,
    threshold: 10,
    location: 'Drawer G1',
    lastUpdated: '2024-11-28',
    value: 168
  }, {
    id: '12',
    name: 'Power Supply 5V 2A',
    category: 'Power',
    quantity: 22,
    available: 18,
    borrowed: 4,
    threshold: 12,
    location: 'Shelf H1',
    lastUpdated: '2024-12-01',
    value: 176
  }];

  const stockMovements = [{
    id: '1',
    componentName: 'Arduino Uno R3',
    type: 'in',
    quantity: 10,
    reason: 'New Purchase',
    performedBy: 'Admin',
    date: '2024-12-01',
    notes: 'Restocking for upcoming semester'
  }, {
    id: '2',
    componentName: 'Ultrasonic Sensor HC-SR04',
    type: 'out',
    quantity: 8,
    reason: 'Student Borrowing',
    performedBy: 'John Smith',
    date: '2024-12-02',
    notes: 'Borrowed for robotics project'
  }, {
    id: '3',
    componentName: 'Servo Motor SG90',
    type: 'adjustment',
    quantity: -2,
    reason: 'Damaged Components',
    performedBy: 'Admin',
    date: '2024-11-29',
    notes: 'Components damaged during handling'
  }, {
    id: '4',
    componentName: 'ESP32 DevKit',
    type: 'in',
    quantity: 5,
    reason: 'New Purchase',
    performedBy: 'Admin',
    date: '2024-12-01',
    notes: 'Additional stock for IoT projects'
  }, {
    id: '5',
    componentName: 'Jumper Wires (Pack of 40)',
    type: 'out',
    quantity: 3,
    reason: 'Student Borrowing',
    performedBy: 'Alice Johnson',
    date: '2024-12-01',
    notes: 'Borrowed for circuit assembly'
  }];

  const getStockStatus = item => {
    if (item.quantity < item.threshold) {
      return {
        label: 'Low Stock',
        variant: 'destructive'
      };
    } else if (item.quantity <= item.threshold * 1.5) {
      return {
        label: 'Medium Stock',
        variant: 'default'
      };
    } else {
      return {
        label: 'In Stock',
        variant: 'default'
      };
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || filterStatus === 'low' && item.quantity < item.threshold || filterStatus === 'available' && item.quantity >= item.threshold;
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
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-500 mt-1">Track and manage all lab components and stock levels</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={() => setIsMovementHistoryOpen(true)}>
            <History className="w-4 h-4" />
            Movement History
          </Button>
          <Button className="gap-2" onClick={() => setIsBulkUploadOpen(true)}>
            <Upload className="w-4 h-4" />
            Bulk Upload
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
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
                {categories.map(category => <SelectItem key={category} value={category}>{category}</SelectItem>)}
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
      <Card className="border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Component Inventory</CardTitle>
          <CardDescription>Complete overview of all components in the lab</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[250px] font-semibold">Component</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Total Qty</TableHead>
                <TableHead className="font-semibold">Available</TableHead>
                <TableHead className="font-semibold">Borrowed</TableHead>
                <TableHead className="font-semibold">Threshold</TableHead>
                <TableHead className="font-semibold">Value</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map(item => {
                const status = getStockStatus(item);
                return (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{item.location}</TableCell>
                    <TableCell className="font-medium">{item.quantity}</TableCell>
                    <TableCell className="text-green-600 font-medium">{item.available}</TableCell>
                    <TableCell className="text-orange-600 font-medium">{item.borrowed}</TableCell>
                    <TableCell className="text-gray-600">{item.threshold}</TableCell>
                    <TableCell className="font-medium">${item.value}</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.quantity < item.threshold ? 'destructive' : 'default'}
                        className={`font-normal ${item.quantity < item.threshold ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                      >
                        {item.quantity < item.threshold && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8"
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
              <Textarea id="reason" placeholder="Explain the reason for this adjustment..." rows={3} />
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
                {stockMovements.map(movement => <TableRow key={movement.id}>
                  <TableCell className="text-sm">{movement.date}</TableCell>
                  <TableCell className="text-sm">{movement.componentName}</TableCell>
                  <TableCell>
                    <Badge variant={movement.type === 'in' ? 'default' : 'secondary'} className={movement.type === 'in' ? 'bg-green-500' : movement.type === 'out' ? 'bg-blue-500' : 'bg-orange-500'}>
                      {movement.type === 'in' && <Plus className="w-3 h-3 mr-1" />}
                      {movement.type === 'out' && <Minus className="w-3 h-3 mr-1" />}
                      {movement.type === 'in' ? 'Stock In' : movement.type === 'out' ? 'Stock Out' : 'Adjustment'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className={movement.type === 'in' || movement.type === 'adjustment' && movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                      {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{movement.reason}</TableCell>
                  <TableCell className="text-sm">{movement.performedBy}</TableCell>
                </TableRow>)}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Component Upload Dialog */}
      <BulkComponentUpload
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
      />
    </div>
  );
}