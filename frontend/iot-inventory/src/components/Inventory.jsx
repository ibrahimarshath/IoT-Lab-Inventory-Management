import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Switch } from './ui/switch';
import { Package, Search, Plus, Upload, Eye, EyeOff, Edit, Trash2, Filter, LayoutGrid, List, ExternalLink, X, Download } from 'lucide-react';
import { BulkComponentUpload } from './BulkComponentUpload';
import { toast } from 'sonner';

export function Inventory() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('inventoryViewMode');
      return saved === 'list' || saved === 'cards' ? saved : 'list';
    }
    return 'list';
  });

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [customTagInput, setCustomTagInput] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    customCategory: '',
    quantity: '',
    threshold: '',
    description: '',
    datasheet: '',
    purchaseDate: '',
    condition: 'New',
    tags: '',
    isCustomTag: false,
    isCustomCategory: false,
    visibleToUsers: true
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('inventoryViewMode', viewMode);
    }
  }, [viewMode]);

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

  // Get unique categories from existing components
  const existingCategories = Array.from(new Set(components.map(c => c.category))).sort();
  const categories = ['all', ...existingCategories];

  // Get all unique tags
  const allTags = Array.from(new Set(components.flatMap(c => c.tags || []))).sort();

  const getStockStatus = (component) => {
    if (component.available === 0) return 'out-of-stock';
    if (component.available <= component.threshold) return 'low-stock';
    return 'in-stock';
  };

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (component.description && component.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || component.category === filterCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => (component.tags || []).includes(tag));
    const status = getStockStatus(component);
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'low-stock' && status === 'low-stock') ||
      (filterStatus === 'out-of-stock' && status === 'out-of-stock') ||
      (filterStatus === 'in-stock' && status === 'in-stock');
    return matchesSearch && matchesCategory && matchesTags && matchesStatus;
  });



  const totalItems = components.reduce((sum, c) => sum + c.quantity, 0);
  const lowStockCount = components.filter(c => getStockStatus(c) === 'low-stock').length;
  const outOfStockCount = components.filter(c => getStockStatus(c) === 'out-of-stock').length;

  const toggleTag = tag => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleExport = () => {
    // Simple CSV export
    const headers = ['Component Name', 'Category', 'Current Stock', 'Total Quantity', 'Threshold', 'Status'];
    const rows = filteredComponents.map(item => [
      item.name,
      item.category,
      item.available,
      item.quantity,
      item.threshold,
      getStockStatus(item)
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
      link.setAttribute('download', 'inventory_list.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      customCategory: '',
      quantity: '',
      threshold: '',
      description: '',
      datasheet: '',
      purchaseDate: '',
      condition: 'New',
      tags: '',
      isCustomTag: false,
      isCustomCategory: false,
      visibleToUsers: true
    });
    setEditingComponent(null);
    setCustomTagInput('');
  };

  const handleAddComponent = async () => {
    try {
      const token = sessionStorage.getItem('token');

      const category = formData.isCustomCategory ? formData.customCategory : formData.category;

      const payload = {
        name: formData.name,
        category: category,
        quantity: parseInt(formData.quantity),
        available: parseInt(formData.quantity),
        threshold: parseInt(formData.threshold),
        description: formData.description,
        datasheet: formData.datasheet,
        purchaseDate: formData.purchaseDate,
        condition: formData.condition,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        visibleToUsers: formData.visibleToUsers
      };

      const response = await fetch('/api/components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add component');
      }

      toast.success('Component added successfully');
      setIsAddDialogOpen(false);
      resetForm();
      fetchInventory();
    } catch (error) {
      console.error('Error adding component:', error);
      toast.error(error.message || 'Failed to add component');
    }
  };

  const handleEditComponent = async () => {
    try {
      const token = sessionStorage.getItem('token');

      const category = formData.isCustomCategory ? formData.customCategory : formData.category;

      const payload = {
        name: formData.name,
        category: category,
        quantity: parseInt(formData.quantity),
        threshold: parseInt(formData.threshold),
        description: formData.description,
        datasheet: formData.datasheet,
        purchaseDate: formData.purchaseDate,
        condition: formData.condition,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        visibleToUsers: formData.visibleToUsers
      };

      const response = await fetch(`/api/components/${editingComponent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to update component');

      toast.success('Component updated successfully');
      setIsEditDialogOpen(false);
      resetForm();
      fetchInventory();
    } catch (error) {
      console.error('Error updating component:', error);
      toast.error('Failed to update component');
    }
  };

  const handleDeleteComponent = async (componentId, componentName) => {
    if (!confirm(`Are you sure you want to delete "${componentName}"?`)) return;

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`/api/components/${componentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete component');

      toast.success('Component deleted successfully');
      fetchInventory();
    } catch (error) {
      console.error('Error deleting component:', error);
      toast.error('Failed to delete component');
    }
  };

  const openEditDialog = (component) => {
    setEditingComponent(component);
    setFormData({
      name: component.name,
      category: existingCategories.includes(component.category) ? component.category : '',
      customCategory: existingCategories.includes(component.category) ? '' : component.category,
      isCustomCategory: !existingCategories.includes(component.category),
      quantity: component.quantity.toString(),
      threshold: component.threshold.toString(),
      description: component.description || '',
      datasheet: component.datasheet || '',
      purchaseDate: component.purchaseDate ? new Date(component.purchaseDate).toISOString().split('T')[0] : '',
      condition: component.condition,
      tags: (component.tags || []).join(', '),
      isCustomTag: (component.tags || []).length > 1,
      visibleToUsers: component.visibleToUsers !== false
    });
    setIsEditDialogOpen(true);
  };

  const toggleVisibility = async (componentId, currentVisibility) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`/api/components/${componentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ visibleToUsers: !currentVisibility })
      });

      if (!response.ok) throw new Error('Failed to update visibility');

      toast.success(`Component ${!currentVisibility ? 'shown to' : 'hidden from'} users`);
      fetchInventory();
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

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
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-gray-900 mb-2">Inventory Overview</h2>
            <p className="text-gray-600">Monitor stock levels and component availability</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline" className="gap-2" disabled={filteredComponents.length === 0}>
              <Download className="w-4 h-4" />
              Export List
            </Button>
            <Button onClick={() => setIsBulkUploadOpen(true)} variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Bulk Upload
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Component
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      < div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" >
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
                <p className="text-sm text-gray-600 mb-1">Categories</p>
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
      </div >

      {/* Search and Filters */}
      < div className="flex flex-col gap-4 mb-6" >
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search components by name, category, or description..."
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

        {/* Tag Filters */}
        {
          allTags.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Filter by tags:</span>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])}>
                  Clear filters
                </Button>
              )}
            </div>
          )
        }
      </div >

      {/* View Toggle */}
      < div className="flex items-center justify-between mb-4" >
        <p className="text-gray-600">
          {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''} found
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">View:</span>
          <div className="flex gap-1 border border-gray-200 rounded-lg p-1">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="gap-2"
            >
              <LayoutGrid className="w-4 h-4" />
              Cards
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="gap-2"
            >
              <List className="w-4 h-4" />
              List
            </Button>
          </div>
        </div>
      </div >

      {/* Empty State */}
      {
        filteredComponents.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {components.length === 0 ? 'No Inventory Items' : 'No Items Found'}
              </h3>
              <p className="text-gray-500">
                {components.length === 0
                  ? 'Add components to start tracking inventory'
                  : 'Try adjusting your search or filters'}
              </p>
            </CardContent>
          </Card>
        )
      }

      {/* Card View */}
      {
        viewMode === 'cards' && filteredComponents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComponents.map(component => {
              const status = getStockStatus(component);
              const borrowed = component.quantity - component.available;

              return (
                <Card key={component._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-gray-900">{component.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleVisibility(component._id, component.visibleToUsers)}
                        className="h-8 w-8 p-0"
                      >
                        {component.visibleToUsers ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    <Badge variant="secondary">{component.category}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 text-sm">{component.description || 'No description'}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Quantity:</span>
                        <span className="font-medium text-gray-900">{component.quantity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Available:</span>
                        <span className={`font-medium ${status === 'out-of-stock' ? 'text-red-600' :
                          status === 'low-stock' ? 'text-orange-600' :
                            'text-green-600'
                          }`}>
                          {component.available}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Borrowed:</span>
                        <span className="font-medium text-gray-900">{borrowed}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Threshold:</span>
                        <span className="font-medium text-gray-900">{component.threshold}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Condition:</span>
                        <span className="font-medium text-gray-900">{component.condition}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      {status === 'out-of-stock' && (
                        <Badge variant="destructive" className="w-full justify-center">Out of Stock</Badge>
                      )}
                      {status === 'low-stock' && (
                        <Badge className="bg-orange-500 w-full justify-center">Low Stock</Badge>
                      )}
                      {status === 'in-stock' && (
                        <Badge className="bg-green-500 w-full justify-center">In Stock</Badge>
                      )}
                    </div>

                    {component.tags && component.tags.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Tags:</p>
                        <div className="flex flex-wrap gap-1">
                          {component.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t">
                      {component.datasheet && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => window.open(component.datasheet, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3" />
                          Datasheet
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(component)}
                        className="flex-1 gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteComponent(component._id, component.name)}
                        className="gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )
      }

      {/* List View (Table) */}
      {
        viewMode === 'list' && filteredComponents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
            </CardHeader>
            <CardContent>
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
                    <TableHead className="text-center">Visibility</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleVisibility(component._id, component.visibleToUsers)}
                            className="gap-2"
                          >
                            {component.visibleToUsers ? (
                              <>
                                <Eye className="w-4 h-4 text-green-600" />
                                <span className="text-xs text-green-600">Visible</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-400">Hidden</span>
                              </>
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(component)}
                              className="gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteComponent(component._id, component.name)}
                              className="gap-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      }

      {/* Add/Edit Component Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingComponent ? 'Edit Component' : 'Add New Component'}</DialogTitle>
            <DialogDescription>
              {editingComponent ? 'Update the component details' : 'Enter the component details to add to inventory'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Component Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Arduino Uno R3"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                {formData.isCustomCategory ? (
                  <div className="flex gap-2">
                    <Input
                      id="category"
                      value={formData.customCategory}
                      onChange={e => setFormData({ ...formData, customCategory: e.target.value })}
                      placeholder="Enter new category name"
                      className="flex-1"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFormData({ ...formData, isCustomCategory: false, category: '', customCategory: '' })}
                      title="Select existing category"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Select
                    value={formData.category}
                    onValueChange={val => {
                      if (val === 'new_custom') {
                        setFormData({ ...formData, isCustomCategory: true, category: '', customCategory: '' });
                      } else {
                        setFormData({ ...formData, category: val, customCategory: '' });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select or add category" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                      <SelectItem value="new_custom" className="text-blue-600 font-medium">
                        + Add New Category
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Total Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="threshold">Min Threshold *</Label>
                <Input
                  id="threshold"
                  type="number"
                  value={formData.threshold}
                  onChange={e => setFormData({ ...formData, threshold: e.target.value })}
                  placeholder="5"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="condition">Condition</Label>
                <Select value={formData.condition} onValueChange={val => setFormData({ ...formData, condition: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the component"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="datasheet">Datasheet URL</Label>
                <Input
                  id="datasheet"
                  value={formData.datasheet}
                  onChange={e => setFormData({ ...formData, datasheet: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md bg-white">
                {formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button
                      type="button"
                      className="hover:bg-red-100 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Get current tags, split, trim and filter
                        const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
                        // Filter out the tag to be removed
                        const newTags = currentTags.filter(t => t !== tag).join(', ');
                        setFormData({ ...formData, tags: newTags });
                      }}
                    >
                      <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
                    </button>
                  </Badge>
                )) : (
                  <span className="text-sm text-gray-400 p-1">No tags selected</span>
                )}
              </div>
              <div className="flex gap-2">
                <Select
                  value=""
                  onValueChange={(val) => {
                    const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
                    if (!currentTags.includes(val)) {
                      const newTags = [...currentTags, val].join(', ');
                      setFormData({ ...formData, tags: newTags });
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Add existing..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allTags.filter(tag => !formData.tags?.includes(tag)).map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                    {allTags.filter(tag => !formData.tags?.includes(tag)).length === 0 && (
                      <div className="p-2 text-sm text-gray-500">No more tags</div>
                    )}
                  </SelectContent>
                </Select>
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Type new tag..."
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (!customTagInput.trim()) return;
                        const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
                        if (!currentTags.includes(customTagInput.trim())) {
                          const newTags = [...currentTags, customTagInput.trim()].join(', ');
                          setFormData({ ...formData, tags: newTags });
                        }
                        setCustomTagInput('');
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (!customTagInput.trim()) return;
                      const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
                      if (!currentTags.includes(customTagInput.trim())) {
                        const newTags = [...currentTags, customTagInput.trim()].join(', ');
                        setFormData({ ...formData, tags: newTags });
                      }
                      setCustomTagInput('');
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <Label htmlFor="visibility" className="text-sm font-medium">Visible to Users</Label>
                <p className="text-xs text-gray-600 mt-1">Allow students to see and borrow this component</p>
              </div>
              <Switch
                id="visibility"
                checked={formData.visibleToUsers}
                onCheckedChange={checked => setFormData({ ...formData, visibleToUsers: checked })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              setIsEditDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button
              onClick={editingComponent ? handleEditComponent : handleAddComponent}
              disabled={
                !formData.name ||
                (!formData.category && !formData.isCustomCategory) || (formData.isCustomCategory && !formData.customCategory) ||
                !formData.quantity ||
                !formData.threshold
              }
            >
              {editingComponent ? 'Update Component' : 'Add Component'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <BulkComponentUpload
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        onSuccess={fetchInventory}
        existingCategories={existingCategories}
        existingTags={allTags}
      />
    </div >
  );
}
