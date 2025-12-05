import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, ExternalLink, LayoutGrid, List, Eye, EyeOff } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { toast } from 'sonner';

export function ComponentsManagement() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adminComponentViewMode');
      return saved === 'list' || saved === 'cards' ? saved : 'cards';
    }
    return 'cards';
  });

  useEffect(() => {
    fetchComponents();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminComponentViewMode', viewMode);
    }
  }, [viewMode]);

  const fetchComponents = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('/api/components', {
        headers: { 'Authorization': `Bearer ${token}` }
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
      fetchComponents();
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  // Get unique categories from components
  const categories = ['all', ...Array.from(new Set(components.map(c => c.category)))];

  // Get all unique tags
  const allTags = Array.from(new Set(components.flatMap(c => c.tags || [])));

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (component.description && component.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => (component.tags || []).includes(tag));
    return matchesSearch && matchesCategory && matchesTags;
  });

  const toggleTag = tag => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading components...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">Browse and Manage Components</h2>
        <p className="text-gray-600">Manage all hardware components in the lab</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search components by name or description..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
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

        {/* Tag Filters */}
        {allTags.length > 0 && (
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
        )}
      </div>

      {/* View Toggle */}
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

      {/* Component Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map(component => (
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
                    <span className={`font-medium ${component.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {component.available}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Condition:</span>
                    <span className="font-medium text-gray-900">{component.condition}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Purchase Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(component.purchaseDate).toLocaleDateString()}
                    </span>
                  </div>
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

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    {component.visibleToUsers ? (
                      <>
                        <Eye className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Visible to users</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">Hidden from users</span>
                      </>
                    )}
                  </div>
                  {component.datasheet && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.open(component.datasheet, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Datasheet
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Component List View */}
      {viewMode === 'list' && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Available</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-center">Visibility</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComponents.map(component => (
                  <TableRow key={component._id}>
                    <TableCell className="font-medium">{component.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{component.category}</Badge>
                    </TableCell>
                    <TableCell className="text-center">{component.quantity}</TableCell>
                    <TableCell className="text-center">
                      <span className={component.available > 0 ? 'text-green-600' : 'text-red-600'}>
                        {component.available}
                      </span>
                    </TableCell>
                    <TableCell>{component.condition}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(component.tags || []).slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
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
                      {component.datasheet && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {filteredComponents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No components found</p>
        </div>
      )}
    </div>
  );
}