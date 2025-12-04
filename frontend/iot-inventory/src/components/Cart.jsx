import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ShoppingCart, Trash2, Plus, Minus, Send, CalendarIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { toast } from 'sonner@2.0.3';
import { format } from 'date-fns@4.1.0';




export function Cart({ username, cart, setCart }) {
  const [purpose, setPurpose] = useState('');
  const [expectedReturn, setExpectedReturn] = useState();
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const updateQuantity = (componentId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(componentId);
      return;
    }
    const item = cart.find(item => item.component.id === componentId);
    if (item && newQuantity > item.component.available) {
      return; // Don't allow more than available
    }
    setCart(prev => prev.map(item =>
      item.component.id === componentId ? { ...item, quantity }
    ));
  };

  const removeFromCart = (componentId) => {
    setCart(prev => prev.filter(item => item.component.id !== componentId));
  };

  const handleSubmitRequest = () => {
    if (cart.length === 0) return;
    if (!purpose.trim() || !expectedReturn) {
      alert('Please fill in purpose and expected return date');
      return;
    }
    setIsSubmitDialogOpen(true);
  };

  const confirmSubmit = () => {
    // Here you would typically send the request to backend
    console.log('Submitting borrow request:', {
      username,
      items,
      purpose,
      expectedReturn,
      submittedAt Date()
    });
    
    // Clear cart and form
    setCart([]);
    setPurpose('');
    setExpectedReturn(undefined);
    setIsSubmitDialogOpen(false);
    
    toast.success('Borrow request submitted successfully!');
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 mb-2">My Cart</h2>
            <p className="text-gray-600">Review and submit your borrow request</p>
          </div>
          <Badge variant="secondary" className="gap-2">
            <ShoppingCart className="w-4 h-4" />
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {cart.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600">Browse components and add them to your cart to create a borrow request</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cart.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-center">Available</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.component.id}>
                        <TableCell className="min-w-[250px]">
                          <div>
                            <p className="font-medium">{item.component.name}</p>
                            <p className="text-sm text-gray-600 break-words whitespace-normal">{item.component.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{item.component.category}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={item.component.available < item.quantity ? 'text-red-600' : 'text-green-600'}>
                            {item.component.available}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.component.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.component.id, parseInt(e.target.value) || 1)}
                              className="w-16 text-center"
                              min="1"
                              max={item.component.available}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.component.id, item.quantity + 1)}
                              disabled={item.quantity >= item.component.available}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.component.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Request Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Borrowing</Label>
                <Textarea
                  id="purpose"
                  placeholder="e.g., Building a drone for course project..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="returnDate">Expected Return Date</Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expectedReturn ? (
                        format(expectedReturn, 'PPP')
                      ) : (
                        <span className="text-muted-foreground">Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={expectedReturn}
                      onSelect={(date) => {
                        setExpectedReturn(date);
                        setIsCalendarOpen(false);
                      }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Components:</span>
                  <span className="font-medium">{cart.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Quantity:</span>
                  <span className="font-medium">{totalItems}</span>
                </div>
              </div>

              <Button
                className="w-full gap-2"
                onClick={handleSubmitRequest}
                disabled={cart.length === 0}
              >
                <Send className="w-4 h-4" />
                Submit Borrow Request
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Borrow Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit this borrow request?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Components:</p>
              <ul className="space-y-1">
                {cart.map(item => (
                  <li key={item.component.id} className="text-sm">
                    {item.component.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Purpose:</p>
              <p className="text-sm">{purpose}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Expected Return:</p>
              <p className="text-sm">{expectedReturn ? expectedReturn.toLocaleDateString() : ''}</p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSubmit}>
              Confirm & Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}