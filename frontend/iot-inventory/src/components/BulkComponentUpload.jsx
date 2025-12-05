import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, X, Check, Upload, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

export function BulkComponentUpload({ open, onOpenChange, onSuccess }) {
    const [components, setComponents] = useState([
        { id: 1, name: '', category: '', isCustomCategory: false, condition: 'New', quantity: '', threshold: '', purchaseDate: '', description: '', datasheet: '', tags: '' },
        { id: 2, name: '', category: '', isCustomCategory: false, condition: 'New', quantity: '', threshold: '', purchaseDate: '', description: '', datasheet: '', tags: '' },
        { id: 3, name: '', category: '', isCustomCategory: false, condition: 'New', quantity: '', threshold: '', purchaseDate: '', description: '', datasheet: '', tags: '' },
        { id: 4, name: '', category: '', isCustomCategory: false, condition: 'New', quantity: '', threshold: '', purchaseDate: '', description: '', datasheet: '', tags: '' },
        { id: 5, name: '', category: '', isCustomCategory: false, condition: 'New', quantity: '', threshold: '', purchaseDate: '', description: '', datasheet: '', tags: '' },
    ]);

    const categories = [
        "Microcontroller",
        "Sensor",
        "Single Board Computer",
        "Actuator",
        "Power",
        "Display",
        "Communication",
        "Shield",
        "Tool",
        "Other"
    ];

    const conditions = [
        "New",
        "Good",
        "Fair",
        "Poor",
        "Damaged"
    ];

    const handleCellChange = (id, field, value) => {
        setComponents(components.map(comp => {
            if (comp.id !== id) return comp;

            if (field === 'category') {
                if (value === 'Other') {
                    return { ...comp, category: '', isCustomCategory: true };
                }
                return { ...comp, category: value, isCustomCategory: false };
            }

            return { ...comp, [field]: value };
        }));
    };

    const toggleCustomCategory = (id, isCustom) => {
        setComponents(components.map(comp =>
            comp.id === id ? { ...comp, isCustomCategory: isCustom, category: '' } : comp
        ));
    };

    const addRow = () => {
        const newId = Math.max(...components.map(c => c.id)) + 1;
        setComponents([...components, {
            id: newId,
            name: '',
            category: '',
            isCustomCategory: false,
            condition: 'New',
            quantity: '',
            threshold: '',
            purchaseDate: '',
            description: '',
            datasheet: '',
            tags: ''
        }]);
    };

    const removeRow = (id) => {
        if (components.length > 1) {
            setComponents(components.filter(comp => comp.id !== id));
        }
    };

    const handleSubmit = async () => {
        // Filter out empty rows
        const filledComponents = components.filter(comp =>
            comp.name.trim() !== '' || comp.category.trim() !== ''
        );

        if (filledComponents.length === 0) {
            toast.error('Please add at least one component');
            return;
        }

        // Validate filled rows
        const invalidRows = filledComponents.filter(comp =>
            !comp.name.trim() || !comp.category.trim() || !comp.quantity || !comp.threshold
        );

        if (invalidRows.length > 0) {
            toast.error('Please fill in all required fields (Name, Category, Quantity, Threshold)');
            return;
        }

        try {
            const token = sessionStorage.getItem('token');

            // Prepare components for API
            const componentsToUpload = filledComponents.map(comp => ({
                name: comp.name.trim(),
                category: comp.category.trim(),
                quantity: parseInt(comp.quantity),
                available: parseInt(comp.quantity),
                threshold: parseInt(comp.threshold),
                condition: comp.condition,
                description: comp.description?.trim() || '',
                datasheet: comp.datasheet?.trim() || '',
                purchaseDate: comp.purchaseDate || new Date().toISOString().split('T')[0],
                tags: comp.tags ? comp.tags.split(',').map(t => t.trim()).filter(t => t) : [],
                visibleToUsers: true // Default to visible
            }));

            // Upload each component
            const promises = componentsToUpload.map(comp =>
                fetch('/api/components', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(comp)
                })
            );

            const results = await Promise.all(promises);
            const failed = results.filter(r => !r.ok);

            if (failed.length > 0) {
                toast.error(`${failed.length} component(s) failed to upload`);
            } else {
                toast.success(`${filledComponents.length} component(s) added successfully!`);
            }

            // Reset form
            setComponents([
                { id: 1, name: '', category: '', isCustomCategory: false, condition: 'New', quantity: '', threshold: '', purchaseDate: '', description: '', datasheet: '', tags: '' },
                { id: 2, name: '', category: '', isCustomCategory: false, condition: 'New', quantity: '', threshold: '', purchaseDate: '', description: '', datasheet: '', tags: '' },
                { id: 3, name: '', category: '', isCustomCategory: false, condition: 'New', quantity: '', threshold: '', purchaseDate: '', description: '', datasheet: '', tags: '' },
                { id: 4, name: '', category: '', isCustomCategory: false, condition: 'New', quantity: '', threshold: '', purchaseDate: '', description: '', datasheet: '', tags: '' },
                { id: 5, name: '', category: '', isCustomCategory: false, condition: 'New', quantity: '', threshold: '', purchaseDate: '', description: '', datasheet: '', tags: '' },
            ]);

            if (onSuccess) onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Error uploading components:', error);
            toast.error('Failed to upload components');
        }
    };

    const handleCancel = () => {
        setComponents([
            { id: 1, name: '', category: '', isCustomCategory: false, condition: 'New', quantity: '', threshold: '', purchaseDate: '', description: '', datasheet: '', tags: '' },
            { id: 2, name: '', category: '', isCustomCategory: false, condition: 'New', quantity: '', threshold: '', purchaseDate: '', description: '', datasheet: '', tags: '' },
            { id: 3, name: '', category: '', isCustomCategory: false, condition: 'New', quantity: '', threshold: '', purchaseDate: '', description: '', datasheet: '', tags: '' },
            { id: 4, name: '', category: '', isCustomCategory: false, condition: 'New', quantity: '', threshold: '', purchaseDate: '', description: '', datasheet: '', tags: '' },
            { id: 5, name: '', category: '', isCustomCategory: false, condition: 'New', quantity: '', threshold: '', purchaseDate: '', description: '', datasheet: '', tags: '' },
        ]);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[95vw] w-[95vw] h-[90vh] flex flex-col p-0 bg-white gap-0 overflow-hidden">
                {/* Header */}
                <div className="border-b px-6 py-4 bg-white shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Upload className="w-5 h-5" />
                        Bulk Component Upload
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                        Add multiple components at once. Fill in the table below with component details.
                    </DialogDescription>
                </div>

                {/* Scrollable Table Content */}
                <div className="flex-1 overflow-auto min-h-0 bg-white">
                    <table className="w-full border-collapse text-sm">
                        <thead className="sticky top-0 bg-gray-100 z-20 shadow-sm">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700 border border-gray-300 w-12 sticky left-0 bg-gray-100 z-30">#</th>
                                <th className="px-2 py-2 text-left font-semibold text-gray-700 border border-gray-300 min-w-[200px]">
                                    Component Name <span className="text-red-500">*</span>
                                </th>
                                <th className="px-2 py-2 text-left font-semibold text-gray-700 border border-gray-300 min-w-[200px]">
                                    Category <span className="text-red-500">*</span>
                                </th>
                                <th className="px-2 py-2 text-left font-semibold text-gray-700 border border-gray-300 min-w-[140px]">
                                    Condition
                                </th>
                                <th className="px-2 py-2 text-left font-semibold text-gray-700 border border-gray-300 w-32">
                                    Total Qty <span className="text-red-500">*</span>
                                </th>
                                <th className="px-2 py-2 text-left font-semibold text-gray-700 border border-gray-300 w-32">
                                    Min Threshold <span className="text-red-500">*</span>
                                </th>
                                <th className="px-2 py-2 text-left font-semibold text-gray-700 border border-gray-300 min-w-[160px]">
                                    Purchase Date
                                </th>
                                <th className="px-2 py-2 text-left font-semibold text-gray-700 border border-gray-300 min-w-[250px]">
                                    Description
                                </th>
                                <th className="px-2 py-2 text-left font-semibold text-gray-700 border border-gray-300 min-w-[200px]">
                                    Datasheet URL
                                </th>
                                <th className="px-2 py-2 text-left font-semibold text-gray-700 border border-gray-300 min-w-[200px]">
                                    Tags
                                </th>
                                <th className="px-2 py-2 text-center font-semibold text-gray-700 w-16 sticky right-0 bg-gray-100 z-30 border border-gray-300 shadow-[-5px_0_10px_-5px_rgba(0,0,0,0.1)]">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {components.map((comp, index) => (
                                <tr key={comp.id} className="group">
                                    <td className="px-4 py-1 text-gray-500 border border-gray-300 text-center sticky left-0 bg-white group-hover:bg-gray-50 z-10">
                                        {index + 1}
                                    </td>
                                    <td className="p-0 border border-gray-300 bg-white group-hover:bg-gray-50">
                                        <Input
                                            value={comp.name}
                                            onChange={(e) => handleCellChange(comp.id, 'name', e.target.value)}
                                            placeholder="e.g. Arduino Uno"
                                            className="h-9 border-0 rounded-none shadow-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-blue-500 px-2"
                                        />
                                    </td>
                                    <td className="p-0 border border-gray-300 bg-white group-hover:bg-gray-50">
                                        {comp.isCustomCategory ? (
                                            <div className="flex h-9">
                                                <Input
                                                    value={comp.category}
                                                    onChange={(e) => handleCellChange(comp.id, 'category', e.target.value)}
                                                    placeholder="Type category..."
                                                    className="h-full border-0 rounded-none shadow-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-blue-500 px-2 flex-1"
                                                    autoFocus
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-full w-9 shrink-0 rounded-none hover:bg-gray-100"
                                                    onClick={() => toggleCustomCategory(comp.id, false)}
                                                    title="Back to list"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Select
                                                value={comp.category}
                                                onValueChange={(value) => handleCellChange(comp.id, 'category', value)}
                                            >
                                                <SelectTrigger className="h-9 border-0 rounded-none shadow-none focus:ring-1 focus:ring-inset focus:ring-blue-500 px-2">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(cat => (
                                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </td>
                                    <td className="p-0 border border-gray-300 bg-white group-hover:bg-gray-50">
                                        <Select
                                            value={comp.condition}
                                            onValueChange={(value) => handleCellChange(comp.id, 'condition', value)}
                                        >
                                            <SelectTrigger className="h-9 border-0 rounded-none shadow-none focus:ring-1 focus:ring-inset focus:ring-blue-500 px-2">
                                                <SelectValue placeholder="Select condition" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {conditions.map(cond => (
                                                    <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="p-0 border border-gray-300 bg-white group-hover:bg-gray-50">
                                        <Input
                                            type="number"
                                            value={comp.quantity}
                                            onChange={(e) => handleCellChange(comp.id, 'quantity', e.target.value)}
                                            placeholder="0"
                                            className="h-9 border-0 rounded-none shadow-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-blue-500 px-2"
                                            min="0"
                                        />
                                    </td>
                                    <td className="p-0 border border-gray-300 bg-white group-hover:bg-gray-50">
                                        <Input
                                            type="number"
                                            value={comp.threshold}
                                            onChange={(e) => handleCellChange(comp.id, 'threshold', e.target.value)}
                                            placeholder="0"
                                            className="h-9 border-0 rounded-none shadow-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-blue-500 px-2"
                                            min="0"
                                        />
                                    </td>
                                    <td className="p-0 border border-gray-300 bg-white group-hover:bg-gray-50">
                                        <Input
                                            type="date"
                                            value={comp.purchaseDate}
                                            onChange={(e) => handleCellChange(comp.id, 'purchaseDate', e.target.value)}
                                            className="h-9 border-0 rounded-none shadow-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-blue-500 px-2"
                                        />
                                    </td>
                                    <td className="p-0 border border-gray-300 bg-white group-hover:bg-gray-50">
                                        <Input
                                            value={comp.description}
                                            onChange={(e) => handleCellChange(comp.id, 'description', e.target.value)}
                                            placeholder="Brief description"
                                            className="h-9 border-0 rounded-none shadow-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-blue-500 px-2"
                                        />
                                    </td>
                                    <td className="p-0 border border-gray-300 bg-white group-hover:bg-gray-50">
                                        <Input
                                            value={comp.datasheet}
                                            onChange={(e) => handleCellChange(comp.id, 'datasheet', e.target.value)}
                                            placeholder="https://..."
                                            className="h-9 border-0 rounded-none shadow-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-blue-500 px-2"
                                        />
                                    </td>
                                    <td className="p-0 border border-gray-300 bg-white group-hover:bg-gray-50">
                                        <Input
                                            value={comp.tags}
                                            onChange={(e) => handleCellChange(comp.id, 'tags', e.target.value)}
                                            placeholder="Comma separated tags"
                                            className="h-9 border-0 rounded-none shadow-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-blue-500 px-2"
                                        />
                                    </td>
                                    <td className="p-0 border border-gray-300 text-center sticky right-0 bg-white shadow-[-5px_0_10px_-5px_rgba(0,0,0,0.1)] group-hover:bg-gray-50 z-10">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeRow(comp.id)}
                                            className="h-9 w-full rounded-none text-red-600 hover:text-red-700 hover:bg-red-50"
                                            disabled={components.length === 1}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="border-t px-6 py-4 bg-gray-50 shrink-0 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={addRow}
                            className="gap-2 bg-white hover:bg-gray-50"
                        >
                            <Plus className="w-4 h-4" />
                            Add Row
                        </Button>
                        <span className="text-sm text-gray-500">
                            {components.length} row(s)
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} className="gap-2">
                            <Check className="w-4 h-4" />
                            Upload Components
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
