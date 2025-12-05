import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Search, Edit, Trash2, ExternalLink, Filter, LayoutGrid, List } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { toast } from 'sonner';

export function ComponentsManagement() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adminComponentViewMode');
      return saved === 'list' || saved === 'cards' ? saved : 'cards';
    }
    return 'cards';
  });

  // Form states
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [formCategory, setFormCategory] = useState('');
  const [formTags, setFormTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [showNewTagInput, setShowNewTagInput] = useState(false);

  // New Component Form Data
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    threshold: '',
    purchaseDate: '',
    description: '',
    datasheet: '',
    condition: 'Good'
  });

  const fetchComponents = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('/api/components', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch components');
      const data = await response.json();
      setComponents(data);
    } catch (error) {
      console.error('Error fetching components:', error);
      toast.error('Failed to load components');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminComponentViewMode', viewMode);
    }
  }, [viewMode]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleAddComponent = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const payload = {
        ...formData,
        category: formCategory,
        tags: formTags,
        quantity: parseInt(formData.quantity),
        threshold: parseInt(formData.threshold)
      };

      const response = await fetch('/api/components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to add component');

      toast.success('Component added successfully');
      setIsAddDialogOpen(false);
      resetForm();
      fetchComponents();
    } catch (error) {
      console.error('Error adding component:', error);
      toast.error('Failed to add component');
    }
  };

  const handleDeleteComponent = async (id) => {
    if (!confirm('Are you sure you want to delete this component?')) return;
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`/api/components/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete component');

      toast.success('Component deleted successfully');
      fetchComponents();
    } catch (error) {
      console.error('Error deleting component:', error);
      toast.error('Failed to delete component');
    }
  };

  const categories = ['all', ...Array.from(new Set(components.map(c => c.category)))];
  const categoryOptions = Array.from(new Set(components.map(c => c.category)));
  const allTags = Array.from(new Set(components.flatMap(c => c.tags || [])));

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (component.description && component.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => component.tags.includes(tag));
    return matchesSearch && matchesCategory && matchesTags;
  });

  const toggleTag = tag => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      quantity: '',
      threshold: '',
      purchaseDate: '',
      description: '',
      datasheet: '',
      condition: 'Good'
    });
    setFormCategory('');
    setFormTags([]);
    setNewCategory('');
    setNewTag('');
    setShowNewCategoryInput(false);
    setShowNewTagInput(false);
  };

  const handleDialogChange = open => {
    setIsAddDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900 mb-2">Components Management</h2>
            <p className="text-gray-600">Manage all hardware components in the lab</p>
          </div>
          <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Component
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={handleDialogChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Component</DialogTitle>
                <DialogDescription>Enter the details of the new hardware component</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Component Name</Label>
                  <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Arduino Uno R3" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    {!showNewCategoryInput ? (
                      <div className="space-y-2">
                        <Select value={formCategory} onValueChange={setFormCategory}>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Button type="button" variant="outline" size="sm" className="w-full text-xs" onClick={() => setShowNewCategoryInput(true)}>
                          + Add New Category
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Enter new category" />
                        <div className="flex gap-2">
                          <Button type="button" size="sm" className="flex-1" onClick={() => {
                            if (newCategory.trim()) {
                              setFormCategory(newCategory.trim());
                              setNewCategory('');
                              setShowNewCategoryInput(false);
                            }
                          }}>
                            Add
                          </Button>
                          <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => {
                            setShowNewCategoryInput(false);
                            setNewCategory('');
                          }}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={formData.condition} onValueChange={val => setFormData(prev => ({ ...prev, condition: val }))}>
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="needs-repair">Needs Repair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Total Quantity</Label>
                    <Input id="quantity" type="number" value={formData.quantity} onChange={handleInputChange} placeholder="0" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="threshold">Min Threshold</Label>
                    <Input id="threshold" type="number" value={formData.threshold} onChange={handleInputChange} placeholder="0" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input id="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={handleInputChange} placeholder="Brief description of the component" rows={3} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="datasheet">Datasheet URL</Label>
                  <Input id="datasheet" type="url" value={formData.datasheet} onChange={handleInputChange} placeholder="https://..." />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="space-y-2">
                    {/* Selected Tags */}
                    {formTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
                        {formTags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            {tag}
                            <button type="button" onClick={() => setFormTags(formTags.filter((_, i) => i !== index))} className="ml-1 hover:text-red-600">
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Tag Selection */}
                    {!showNewTagInput ? (
                      <div className="space-y-2">
                        <Select onValueChange={value => {
                          if (!formTags.includes(value)) {
                            setFormTags([...formTags, value]);
                          }
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tags" />
                          </SelectTrigger>
                          <SelectContent>
                            {allTags.filter(tag => !formTags.includes(tag)).map(tag => (
                              <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button type="button" variant="outline" size="sm" className="w-full text-xs" onClick={() => setShowNewTagInput(true)}>
                          + Add New Tag
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Enter new tag" />
                        <div className="flex gap-2">
                          <Button type="button" size="sm" className="flex-1" onClick={() => {
                            if (newTag.trim() && !formTags.includes(newTag.trim())) {
                              setFormTags([...formTags, newTag.trim()]);
                              setNewTag('');
                              setShowNewTagInput(false);
                            }
                          }}>
                            Add
                          </Button>
                          <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => {
                            setShowNewTagInput(false);
                            setNewTag('');
                          }}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Add tags to help users find components for specific projects</p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => handleDialogChange(false)}>Cancel</Button>
                <Button onClick={handleAddComponent}>Add Component</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search components by name or description..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
          </div>

          {/* Tag Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filter by tags:</span>
            {allTags.map(tag => (
              <Badge key={tag} variant={selectedTags.includes(tag) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleTag(tag)}>
                {tag}
              </Badge>
            ))}
            {selectedTags.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])}>
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-end gap-2 mb-6">
          <span className="text-sm text-gray-600">View:</span>
          <div className="flex gap-1 border border-gray-200 rounded-lg p-1">
            <Button variant={viewMode === 'cards' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('cards')} className="gap-2">
              <LayoutGrid className="w-4 h-4" />
              Cards
            </Button>
            <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="gap-2">
              <List className="w-4 h-4" />
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Components Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading components...</div>
      ) : filteredComponents.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No components found.</div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredComponents.map(component => (
            <Card key={component._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{component.name}</CardTitle>
                    <Badge variant="secondary">{component.category}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteComponent(component._id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{component.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Quantity:</span>
                    <span className="text-gray-900">{component.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available:</span>
                    <span className={component.available < component.threshold ? 'text-red-600' : 'text-green-600'}>
                      {component.available}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Condition:</span>
                    <span className="text-gray-900">{component.condition}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Purchase Date:</span>
                    <span className="text-gray-900">{new Date(component.purchaseDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {component.tags && component.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {component.datasheet && (
                  <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                    <a href={component.datasheet} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      View Datasheet
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[180px]">Component Name</TableHead>
                    <TableHead className="min-w-[220px]">Description</TableHead>
                    <TableHead className="w-[80px] text-center">Total</TableHead>
                    <TableHead className="w-[80px] text-center">Available</TableHead>
                    <TableHead className="w-[90px]">Condition</TableHead>
                    <TableHead className="w-[100px]">Purchase</TableHead>
                    <TableHead className="w-[120px]">Tags</TableHead>
                    <TableHead className="w-[140px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComponents.map(component => (
                    <TableRow key={component._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          <span className="break-words">{component.name}</span>
                          <Badge variant="secondary" className="whitespace-nowrap text-xs w-fit">
                            {component.category}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600 break-words leading-snug">{component.description}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm">{component.quantity}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`text-sm ${component.available < component.threshold ? 'text-red-600' : 'text-green-600'}`}>
                          {component.available}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs">{component.condition}</TableCell>
                      <TableCell className="text-xs whitespace-nowrap">{new Date(component.purchaseDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {component.tags && component.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs whitespace-nowrap">
                              {tag}
                            </Badge>
                          ))}
                          {component.tags && component.tags.length > 2 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="text-xs cursor-help">
                                  +{component.tags.length - 2}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{component.tags.slice(2).join(', ')}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-1 justify-end">
                          {component.datasheet && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                                  <a href={component.datasheet} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View Datasheet</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Component</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDeleteComponent(component._id)}>
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Component</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}