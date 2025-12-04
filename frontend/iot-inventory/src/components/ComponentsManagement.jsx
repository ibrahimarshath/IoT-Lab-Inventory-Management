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
export function ComponentsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    // Load view mode from localStorage on initial render
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adminComponentViewMode');
      return saved === 'list' || saved === 'cards' ? saved : 'cards';
    }
    return 'cards';
  });

  // Persist view mode to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminComponentViewMode', viewMode);
    }
  }, [viewMode]);

  // Form states
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [formCategory, setFormCategory] = useState('');
  const [formTags, setFormTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const components = [{
    id: '1',
    name: 'Arduino Uno R3',
    category: 'Microcontroller',
    quantity: 25,
    available: 18,
    threshold: 10,
    description: 'ATmega328P-based microcontroller board with 14 digital I/O pins',
    datasheet: 'https://docs.arduino.cc/hardware/uno-rev3',
    purchaseDate: '2024-01-15',
    condition: 'Excellent',
    tags: ['robot', 'IoT', 'automation', 'beginner']
  }, {
    id: '2',
    name: 'Raspberry Pi 4 Model B (4GB)',
    category: 'Single Board Computer',
    quantity: 15,
    available: 12,
    threshold: 8,
    description: 'Quad-core ARM Cortex-A72 processor with 4GB RAM',
    datasheet: 'https://datasheets.raspberrypi.com/rpi4/raspberry-pi-4-datasheet.pdf',
    purchaseDate: '2024-02-20',
    condition: 'Excellent',
    tags: ['AI', 'IoT', 'robot', 'advanced']
  }, {
    id: '3',
    name: 'ESP32 DevKit V1',
    category: 'Microcontroller',
    quantity: 30,
    available: 22,
    threshold: 15,
    description: 'Dual-core WiFi and Bluetooth microcontroller',
    datasheet: 'https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf',
    purchaseDate: '2024-03-10',
    condition: 'Excellent',
    tags: ['IoT', 'wireless', 'automation']
  }, {
    id: '4',
    name: 'LIDAR Sensor TFMini Plus',
    category: 'Sensor',
    quantity: 8,
    available: 5,
    threshold: 5,
    description: 'ToF LiDAR sensor with 12m range',
    datasheet: 'https://www.benewake.com/en/tfmini-plus.html',
    purchaseDate: '2024-01-25',
    condition: 'Good',
    tags: ['drone', 'robot', 'navigation']
  }, {
    id: '5',
    name: 'Camera Module OV7670',
    category: 'Sensor',
    quantity: 12,
    available: 9,
    threshold: 8,
    description: 'VGA camera module with 640x480 resolution',
    datasheet: 'https://www.ovt.com/sensors/OV7670',
    purchaseDate: '2024-02-05',
    condition: 'Good',
    tags: ['drone', 'robot', 'AI', 'vision']
  }, {
    id: '6',
    name: 'Brushless Motor 2212 920KV',
    category: 'Actuator',
    quantity: 16,
    available: 12,
    threshold: 10,
    description: 'High-efficiency brushless motor for drones',
    datasheet: 'https://example.com/motor-2212',
    purchaseDate: '2024-03-15',
    condition: 'Excellent',
    tags: ['drone', 'flight']
  }, {
    id: '7',
    name: 'IMU MPU6050',
    category: 'Sensor',
    quantity: 20,
    available: 14,
    threshold: 12,
    description: '6-axis gyroscope and accelerometer',
    datasheet: 'https://invensense.tdk.com/products/motion-tracking/6-axis/mpu-6050/',
    purchaseDate: '2024-01-30',
    condition: 'Excellent',
    tags: ['drone', 'robot', 'navigation', 'stabilization']
  }, {
    id: '8',
    name: 'GPS Module NEO-6M',
    category: 'Sensor',
    quantity: 10,
    available: 6,
    threshold: 8,
    description: 'U-blox NEO-6M GPS receiver module',
    datasheet: 'https://www.u-blox.com/en/product/neo-6-series',
    purchaseDate: '2024-02-12',
    condition: 'Good',
    tags: ['drone', 'robot', 'navigation', 'outdoor']
  }];
  const categories = ['all', ...Array.from(new Set(components.map(c => c.category)))];
  const categoryOptions = Array.from(new Set(components.map(c => c.category)));
  const allTags = Array.from(new Set(components.flatMap(c => c.tags)));
  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) || component.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => component.tags.includes(tag));
    return matchesSearch && matchesCategory && matchesTags;
  });
  const toggleTag = tag => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };
  const resetForm = () => {
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
  return <div className="p-6">
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
                  <Input id="name" placeholder="e.g., Arduino Uno R3" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    {!showNewCategoryInput ? <div className="space-y-2">
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
                      </div> : <div className="space-y-2">
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
                      </div>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select>
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="needs-repair">Needs Repair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Total Quantity</Label>
                    <Input id="quantity" type="number" placeholder="0" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="threshold">Min Threshold</Label>
                    <Input id="threshold" type="number" placeholder="0" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input id="purchaseDate" type="date" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Brief description of the component" rows={3} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="datasheet">Datasheet URL</Label>
                  <Input id="datasheet" type="url" placeholder="https://..." />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="space-y-2">
                    {/* Selected Tags */}
                    {formTags.length > 0 && <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
                        {formTags.map((tag, index) => <Badge key={index} variant="secondary" className="gap-1">
                            {tag}
                            <button type="button" onClick={() => setFormTags(formTags.filter((_, i) => i !== index))} className="ml-1 hover:text-red-600">
                              ×
                            </button>
                          </Badge>)}
                      </div>}
                    
                    {/* Tag Selection */}
                    {!showNewTagInput ? <div className="space-y-2">
                        <Select onValueChange={value => {
                      if (!formTags.includes(value)) {
                        setFormTags([...formTags, value]);
                      }
                    }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tags" />
                          </SelectTrigger>
                          <SelectContent>
                            {allTags.filter(tag => !formTags.includes(tag)).map(tag => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Button type="button" variant="outline" size="sm" className="w-full text-xs" onClick={() => setShowNewTagInput(true)}>
                          + Add New Tag
                        </Button>
                      </div> : <div className="space-y-2">
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
                      </div>}
                  </div>
                  <p className="text-xs text-gray-500">Add tags to help users find components for specific projects</p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => handleDialogChange(false)}>Cancel</Button>
                <Button onClick={() => handleDialogChange(false)}>Add Component</Button>
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
                {categories.map(cat => <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Tag Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filter by tags:</span>
            {allTags.map(tag => <Badge key={tag} variant={selectedTags.includes(tag) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleTag(tag)}>
                {tag}
              </Badge>)}
            {selectedTags.length > 0 && <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])}>
                Clear filters
              </Button>}
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
      {viewMode === 'cards' ? <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredComponents.map(component => <Card key={component.id} className="hover:shadow-md transition-shadow">
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
                    <Button variant="ghost" size="sm">
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
                    {component.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>)}
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                  <a href={component.datasheet} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    View Datasheet
                  </a>
                </Button>
              </CardContent>
            </Card>)}
        </div> : <Card>
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
                  {filteredComponents.map(component => <TableRow key={component.id} className="hover:bg-gray-50">
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
                          {component.tags.slice(0, 2).map(tag => <Badge key={tag} variant="outline" className="text-xs whitespace-nowrap">
                              {tag}
                            </Badge>)}
                          {component.tags.length > 2 && <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="text-xs cursor-help">
                                  +{component.tags.length - 2}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{component.tags.slice(2).join(', ')}</p>
                              </TooltipContent>
                            </Tooltip>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-1 justify-end">
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
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Component</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>}
    </div>;
}