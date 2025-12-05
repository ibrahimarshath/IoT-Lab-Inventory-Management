import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Package, Search } from 'lucide-react';

export function Inventory() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

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
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(components.map(c => c.category)))];

  const getStockStatus = (component) => {
    if (component.available === 0) return 'out-of-stock';
    if (component.available <= component.threshold) return 'low-stock';
    return 'in-stock';
  };

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || component.category === filterCategory;
    const status = getStockStatus(component);
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'low-stock' && status === 'low-stock') ||
      (filterStatus === 'out-of-stock' && status === 'out-of-stock') ||
      (filterStatus === 'in-stock' && status === 'in-stock');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalValue = components.reduce((sum, c) => sum + (c.quantity * (c.value || 0)), 0);
  const totalItems = components.reduce((sum, c) => sum + c.quantity, 0);
  const lowStockCount = components.filter(c => getStockStatus(c) === 'low-stock').length;
  const outOfStockCount = components.filter(c => getStockStatus(c) === 'out-of-stock').length;

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">Inventory Overview</h2>
        <p className="text-gray-600">Monitor stock levels and component availability</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Items</p>
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
                <p className="text-sm text-gray-600 mb-1">Component Types</p>
                <p className="text-3xl text-gray-900">{components.length}</p>
              </div>
              <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Low Stock</p>
                <p className="text-3xl text-gray-900">{lowStockCount}</p>
              </div>
              <div className="bg-orange-50 text-orange-600 p-3 rounded-lg">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
                <p className="text-3xl text-gray-900">{outOfStockCount}</p>
              </div>
              <div className="bg-red-50 text-red-600 p-3 rounded-lg">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredComponents.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {components.length === 0 ? 'No Inventory Items' : 'No Items Found'}
              </h3>
              <p className="text-gray-500">
                {components.length === 0
                  ? 'Add components to start tracking inventory'
                  : 'Try adjusting your search or filters'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Total Qty</TableHead>
                  <TableHead className="text-center">Available</TableHead>
                  <TableHead className="text-center">Borrowed</TableHead>
                  <TableHead className="text-center">Threshold</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComponents.map(component => {
                  const status = getStockStatus(component);
                  const borrowed = component.quantity - component.available;

                  return (
                    <TableRow key={component._id}>
                      <TableCell className="font-medium">{component.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{component.category}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{component.quantity}</TableCell>
                      <TableCell className="text-center">
                        <span className={
                          status === 'out-of-stock' ? 'text-red-600' :
                            status === 'low-stock' ? 'text-orange-600' :
                              'text-green-600'
                        }>
                          {component.available}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">{borrowed}</TableCell>
                      <TableCell className="text-center">{component.threshold}</TableCell>
                      <TableCell>
                        {status === 'out-of-stock' && (
                          <Badge variant="destructive">Out of Stock</Badge>
                        )}
                        {status === 'low-stock' && (
                          <Badge className="bg-orange-500">Low Stock</Badge>
                        )}
                        {status === 'in-stock' && (
                          <Badge className="bg-green-500">In Stock</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(component.createdAt || component.purchaseDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}