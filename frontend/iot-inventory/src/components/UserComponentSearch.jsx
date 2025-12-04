import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Filter, CheckCircle, XCircle, ExternalLink, LayoutGrid, List, ShoppingCart, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { toast } from 'sonner@2.0.3';




export function UserComponentSearch({ cart, setCart }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [viewMode, setViewMode] = useState(() => {
    // Load view mode from localStorage on initial render
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('componentViewMode');
      return (saved === 'list' || saved === 'cards') ? saved : 'cards';
    }
    return 'cards';
  });

  // Persist view mode to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('componentViewMode', viewMode);
    }
  }, [viewMode]);

  const components = [
    {
      id,
      name Uno R3',
      category,
      quantity,
      available,
      description: 'ATmega328P-based microcontroller board with 14 digital I/O pins',
      datasheet: 'https://docs.arduino.cc/hardware/uno-rev3',
      tags, 'IoT', 'automation', 'beginner'],
    },
    {
      id,
      name Pi 4 Model B (4GB)',
      category Board Computer',
      quantity,
      available,
      description: 'Quad-core ARM Cortex-A72 processor with 4GB RAM',
      datasheet: 'https://datasheets.raspberrypi.com/rpi4/raspberry-pi-4-datasheet.pdf',
      tags, 'IoT', 'robot', 'advanced'],
    },
    {
      id,
      name DevKit V1',
      category,
      quantity,
      available,
      description: 'Dual-core WiFi and Bluetooth microcontroller',
      datasheet: 'https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf',
      tags, 'wireless', 'automation'],
    },
    {
      id,
      name Sensor TFMini Plus',
      category,
      quantity,
      available,
      description LiDAR sensor with 12m range',
      datasheet: 'https://www.benewake.com/en/tfmini-plus.html',
      tags, 'robot', 'navigation'],
    },
    {
      id,
      name Module OV7670',
      category,
      quantity,
      available,
      description camera module with 640x480 resolution',
      datasheet: 'https://www.ovt.com/sensors/OV7670',
      tags, 'robot', 'AI', 'vision'],
    },
    {
      id,
      name Motor 2212 920KV',
      category,
      quantity,
      available,
      description: 'High-efficiency brushless motor for drones',
      datasheet: 'https://example.com/motor-2212',
      tags, 'flight'],
    },
    {
      id,
      name MPU6050',
      category,
      quantity,
      available,
      description: '6-axis gyroscope and accelerometer',
      datasheet: 'https://invensense.tdk.com/products/motion-tracking/6-axis/mpu-6050/',
      tags, 'robot', 'navigation', 'stabilization'],
    },
    {
      id,
      name Module NEO-6M',
      category,
      quantity,
      available,
      description: 'U-blox NEO-6M GPS receiver module',
      datasheet: 'https://www.u-blox.com/en/product/neo-6-series',
      tags, 'robot', 'navigation', 'outdoor'],
    },
    {
      id,
      name Motor SG90',
      category,
      quantity,
      available,
      description servo motor with 180° rotation',
      datasheet: 'https://example.com/sg90',
      tags, 'automation'],
    },
  ];

  const allTags = Array.from(new Set(components.flatMap(c => c.tags)));

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => component.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const addToCart = (component) => {
    const existingItem = cart.find(item => item.component.id === component.id);
    if (existingItem) {
      setCart(prev => prev.map(item => 
        item.component.id === component.id ? { ...item, quantity: item.quantity + 1 }
      ));
    } else {
      setCart(prev => [...prev, { component, quantity }]);
    }
    toast.success(`${component.name} added to cart!`);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">Browse Components</h2>
        <p className="text-gray-600">Search and view available components for your projects</p>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by component name, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tag Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter by Project Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTags([])}
              className="mt-3"
            >
              Clear all filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Results Count and View Toggle */}
      <div className="flex items-center justify-between mb-4">
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
      </div>

      {/* Component Cards */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map(component => (
            <Card key={component.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-gray-900">{component.name}</CardTitle>
                  {component.available > 0 ? (
                    <Badge variant="default" className="bg-green-500 gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="w-3 h-3" />
                      Out of Stock
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{component.category}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 text-sm">{component.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Stock Status:</p>
                  <p className="text-gray-900">
                    <span className={component.available > 0 ? "text-green-600" : "text-red-600"}>
                      {component.available}
                    </span>
                    {' / '}
                    {component.quantity} available
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Project Tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {component.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => window.open(component.datasheet, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Datasheet
                  </Button>
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => addToCart(component)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Component List */}
      {viewMode === 'list' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[160px]">Component Name</TableHead>
                    <TableHead className="w-[110px]">Category</TableHead>
                    <TableHead className="min-w-[200px]">Description</TableHead>
                    <TableHead className="w-[80px] text-center">Stock</TableHead>
                    <TableHead className="w-[120px]">Tags</TableHead>
                    <TableHead className="w-[140px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComponents.map(component => (
                    <TableRow 
                      key={component.id}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          <span className="break-words">{component.name}</span>
                          {component.available > 0 ? (
                            <Badge variant="default" className="bg-green-500 gap-1 text-xs w-fit">
                              <CheckCircle className="w-3 h-3" />
                              Available
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1 text-xs w-fit">
                              <XCircle className="w-3 h-3" />
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="whitespace-nowrap text-xs">{component.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600 break-words">{component.description}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="whitespace-nowrap">
                          <span className={component.available > 0 ? "text-green-600" : "text-red-600"}>
                            {component.available}
                          </span>
                          {' / '}
                          {component.quantity}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {component.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs whitespace-nowrap">
                              {tag}
                            </Badge>
                          ))}
                          {component.tags.length > 2 && (
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
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1 whitespace-nowrap px-2"
                                onClick={() => window.open(component.datasheet, '_blank')}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Datasheet</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1 whitespace-nowrap px-2"
                                onClick={() => addToCart(component)}
                                disabled={component.available === 0}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add to Cart</p>
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