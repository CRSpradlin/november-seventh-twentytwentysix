'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { checkAdminAuth, adminLogout, adminCreateInvitation } from '@/app/backend/admin';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [formData, setFormData] = useState({
    displayName: '',
    invitationCode: '',
    partyMembers: '',
  });

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await checkAdminAuth();
        if (!isAuthenticated) {
          router.push('/admin');
        }
      } catch (err) {
        router.push('/admin');
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Parse party members from comma-separated string
      const partyMembers = formData.partyMembers
        .split(',')
        .map(name => name.trim())
        .filter(Boolean);

      const result = await adminCreateInvitation(
        formData.displayName,
        formData.invitationCode,
        partyMembers
      );

      if (result.success) {
        setSuccess('Invitation created successfully!');
        // Reset form
        setFormData({
          displayName: '',
          invitationCode: '',
          partyMembers: '',
        });
      } else {
        setError(result.error || 'Failed to create invitation');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    router.push('/admin');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage wedding invitations</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Invitation</CardTitle>
            <CardDescription>
              Add a new invitation to the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  placeholder="The Smith Family"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  The name that will be displayed on the invitation
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invitationCode">Invitation Code</Label>
                <Input
                  id="invitationCode"
                  name="invitationCode"
                  placeholder="SMITH2026"
                  value={formData.invitationCode}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Unique code for guests to access their invitation
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="partyMembers">Party Members</Label>
                <Textarea
                  id="partyMembers"
                  name="partyMembers"
                  placeholder="John Smith, Jane Smith, Tommy Smith"
                  value={formData.partyMembers}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter guest names separated by commas
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create Invitation'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
