import { Card, CardContent } from './ui/card';
import { Clock } from 'lucide-react';

export function BorrowRequests({ adminUsername }) {
  // Empty array - will be populated from API when borrow request feature is implemented
  const requests = [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900 mb-2">Borrow Requests</h2>
            <p className="text-gray-600">Review and manage student borrow requests</p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="p-12 text-center">
          <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Borrow Requests</h3>
          <p className="text-gray-500 mb-4">
            Student borrow requests will appear here when they submit requests
          </p>
          <p className="text-sm text-gray-400">
            This feature allows students to request components before borrowing
          </p>
        </CardContent>
      </Card>
    </div>
  );
}