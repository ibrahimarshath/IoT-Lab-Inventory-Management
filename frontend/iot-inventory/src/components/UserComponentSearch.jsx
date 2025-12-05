import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Filter, CheckCircle, XCircle, ExternalLink, LayoutGrid, List, Plus, Package } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { toast } from 'sonner';

export function UserComponentSearch({ cart, setCart }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('componentViewMode');
      return saved === 'list' || saved === 'cards' ? saved : 'cards';
    }
    return 'cards';
  });

  useEffect(() => {
    fetchComponents();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('componentViewMode', viewMode);
    }
  }, [viewMode]);

  const fetchComponents = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('/api/components', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch components');
      const data = await response.json();
      setComponents(data.filter(c => c.visibleToUsers !== false));
    } catch (error) {
      console.error('Error fetching components:', error);
      toast.error('Failed to load components');
    } finally {
      setLoading(false);
    }
  };

  const allTags = Array.from(new Set(components.flatMap(c => c.tags || [])));

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (component.description && component.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      component.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => (component.tags || []).includes(tag));
    return matchesSearch && matchesTags;
  });

  const toggleTag = tag => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const addToCart = component => {
    if (component.available === 0) {
      toast.error('This component is out of stock');
      return;
    }

    const existingItem = cart.find(item => item.component._id === component._id);
    if (existingItem) {
      if (existingItem.quantity >= component.available) {
        toast.error('Cannot add more than available stock');
        return;
      }
      setCart(prev => prev.map(item =>
        item.component._id === component._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart(prev => [...prev, { component, quantity: 1 }]);
    }
    toast.success(`${component.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading components...</p>
      </div>
    );
  }

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
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tag Filters */}
      {allTags.length > 0 && (
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
              <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])} className="mt-3">
                Clear all filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

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

      {/* Empty State */}
      {filteredComponents.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {components.length === 0 ? 'No Components Available' : 'No Components Found'}
            </h3>
            <p className="text-gray-500">
              {components.length === 0
                ? 'Components will appear here once they are added to the inventory'
                : 'Try adjusting your search or filters'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Component Cards */}
      {viewMode === 'cards' && filteredComponents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map(component => (
            <Card key={component._id} className="hover:shadow-lg transition-shadow">
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
                <p className="text-gray-700 mb-4 text-sm">{component.description || 'No description available'}</p>

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

                {component.tags && component.tags.length > 0 && (
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
                )}

                <div className="flex gap-2">
                  {component.datasheet && (
                    <Button
                      className="flex-1 gap-2"
                      variant="outline"
                      onClick={() => window.open(component.datasheet, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Datasheet
                    </Button>
                  )}
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => addToCart(component)}
                    disabled={component.available === 0}
                  >
                    <Plus className="w-4 h-4" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Component List */}
      {viewMode === 'list' && filteredComponents.length > 0 && (
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
                    <TableRow key={component._id} className="hover:bg-gray-50">
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
                        <p className="text-sm text-gray-600 break-words">{component.description || 'No description'}</p>
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
                          {(component.tags || []).slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs whitespace-nowrap">
                              {tag}
                            </Badge>
                          ))}
                          {(component.tags || []).length > 2 && (
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
                          {component.datasheet && (
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
                          )}
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