'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { checkAdminAuth, adminLogout, adminCreateInvitation, adminGetAllInvitations, adminDeleteInvitation } from '@/app/backend/admin';
import { Invitation } from '@/app/generated/prisma/client';
import { Badge } from '@/app/components/ui/badge';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/app/components/ui/alert-dialog';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const result = await adminDeleteInvitation(id);
      if (result.success) {
        await fetchInvitations();
      } else {
        setError(result.error || 'Failed to delete invitation');
      }
    } catch {
      setError('An error occurred while deleting.');
    } finally {
      setDeletingId(null);
    }
  };

  const [formData, setFormData] = useState({
    displayName: '',
    invitationCode: '',
    partyMembers: '',
  });

  // Fetch all invitations
  const fetchInvitations = async () => {
    const result = await adminGetAllInvitations();
    if (result.success && result.invitations) {
      setInvitations(result.invitations);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await checkAdminAuth();
        console.log('Admin authenticated:', isAuthenticated);
        if (!isAuthenticated) {
          router.push('/admin');
          return;
        }
        await fetchInvitations();
      } catch {
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
        // Refresh invitations list
        await fetchInvitations();
      } else {
        setError(result.error || 'Failed to create invitation');
      }
    } catch {
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
      <div className="max-w-6xl mx-auto space-y-6">
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

        <Card>
          <CardHeader>
            <CardTitle>All Invitations</CardTitle>
            <CardDescription>
              {invitations.length} invitation{invitations.length !== 1 ? 's' : ''} in the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invitations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No invitations yet. Create one above to get started.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-separate border-spacing-x-4 border-spacing-y-2">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4 font-medium">ID</th>
                      <th className="text-left py-4 px-4 font-medium">Display Name</th>
                      <th className="text-left py-4 px-4 font-medium">Invitation Code</th>
                      <th className="text-left py-4 px-4 font-medium">Party Members</th>
                      <th className="text-left py-4 px-4 font-medium">RSVP Submitted</th>
                      <th className="text-left py-4 px-4 font-medium">Accepting</th>
                      <th className="text-left py-4 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitations.map((invitation) => {
                      const totalMembers = invitation.partyMembers.length;
                      const submittedCount = invitation.submittedRSVPMembers.length;
                      const acceptingCount = invitation.acceptingMembers.length;
                      const allSubmitted = submittedCount === totalMembers;

                      return (
                        <tr key={invitation.id} className="hover:bg-muted/50">
                          <td className="py-4 px-4 text-muted-foreground">{invitation.id}</td>
                          <td className="py-4 px-4 font-medium">{invitation.displayName}</td>
                          <td className="py-4 px-4">
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              {invitation.invitationCode}
                            </code>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1.5">
                              {invitation.partyMembers.map((member) => {
                                const hasSubmitted = invitation.submittedRSVPMembers.includes(member);
                                const isAccepting = invitation.acceptingMembers.includes(member);

                                return (
                                  <Badge
                                    key={member}
                                    variant={
                                      !hasSubmitted
                                        ? 'outline'
                                        : isAccepting
                                          ? 'default'
                                          : 'secondary'
                                    }
                                  >
                                    {member}
                                  </Badge>
                                );
                              })}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant={allSubmitted ? 'default' : 'outline'}>
                              {submittedCount}/{totalMembers}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant={acceptingCount > 0 ? 'default' : 'outline'}>
                              {acceptingCount}/{totalMembers}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                  disabled={deletingId === invitation.id}
                                >
                                  {deletingId === invitation.id ? 'Deleting...' : 'Delete'}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the invitation for{' '}
                                    <strong>{invitation.displayName}</strong> ({invitation.invitationCode}).
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(invitation.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {invitations.length > 0 && (() => {
              const totalMembers = invitations.reduce((sum, inv) => sum + inv.partyMembers.length, 0);
              const totalAccepting = invitations.reduce((sum, inv) => sum + inv.acceptingMembers.length, 0);
              const totalSubmitted = invitations.reduce((sum, inv) => sum + inv.submittedRSVPMembers.length, 0);
              const totalDeclining = totalSubmitted - totalAccepting;
              const totalUnsubmitted = totalMembers - totalSubmitted;

              return (
                <div className="mt-6 flex flex-wrap gap-6 border-t pt-6">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{totalAccepting}</Badge>
                    <span className="text-sm text-muted-foreground">Accepting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{totalDeclining}</Badge>
                    <span className="text-sm text-muted-foreground">Declining</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{totalUnsubmitted}</Badge>
                    <span className="text-sm text-muted-foreground">Unsubmitted</span>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm font-medium">{totalMembers} total members</span>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
