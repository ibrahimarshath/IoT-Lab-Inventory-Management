import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User, Mail, Phone, Edit2, Save, X, Building, Lock } from 'lucide-react';

export function Profile({
  mode,
  username
}) {
  const [isEditing, setIsEditing] = useState(false);
  const defaultData = mode === 'admin' ? {
    name: username,
    email: 'admin@atriauniversity.edu.in',
    phone: '+1 (555) 999-0000',
    role: 'Lab Administrator',
    department: 'IoT Research Lab'
  } : {
    name: username,
    email: `${username.toLowerCase().replace(' ', '.')}@atriauniversity.edu.in`,
    phone: '+1 (555) 123-4567',
    studentId: 'STU2024001',
    department: 'Computer Science'
  };
  const [profileData, setProfileData] = useState(defaultData);
  const [editData, setEditData] = useState(defaultData);

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const getInitials = name => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">Profile</h2>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            {!isEditing ? (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex justify-center pb-4 border-b border-gray-200">
                <div className={`w-24 h-24 rounded-full ${mode === 'admin' ? 'bg-purple-600' : 'bg-blue-600'} flex items-center justify-center text-white text-2xl`}>
                  {getInitials(isEditing ? editData.name : profileData.name)}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900 pl-6">{profileData.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editData.email}
                    onChange={e => setEditData({ ...editData, email: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900 pl-6">{profileData.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  Phone
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={editData.phone}
                    onChange={e => setEditData({ ...editData, phone: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900 pl-6">{profileData.phone}</p>
                )}
              </div>

              {/* Role/Student ID */}
              {mode === 'admin' ? (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    Role
                  </Label>
                  <p className="text-gray-600 pl-6 text-sm">{profileData.role}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    Student ID
                  </Label>
                  <p className="text-gray-600 pl-6 text-sm">{profileData.studentId}</p>
                </div>
              )}

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  Department
                </Label>
                {isEditing ? (
                  <Input
                    id="department"
                    value={editData.department}
                    onChange={e => setEditData({ ...editData, department: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900 pl-6">{profileData.department}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <ChangePassword />
      </div>
    </div>
  );
}

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Change Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
          {success && <p className="text-sm text-green-600 bg-green-50 p-2 rounded">{success}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}