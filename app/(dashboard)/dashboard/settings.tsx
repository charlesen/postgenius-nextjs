'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { customerPortalAction } from '@/lib/payments/actions';
import { User } from '@/lib/db/schema';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { updateAccount, updatePassword, deleteAccount } from '@/app/(login)/actions';

export function Settings({ user }: { user: User }) {
  const [updateState, updateAction, isUpdating] = useActionState(updateAccount, {
    success: '',
    error: ''
  });

  const [passwordState, passwordAction, isChangingPassword] = useActionState(updatePassword, {
    success: '',
    error: ''
  });

  const [deleteState, deleteAction, isDeleting] = useActionState(deleteAccount, {
    success: '',
    error: ''
  });

  const planLabel = user.planName || 'Free';
  const statusLabel =
    user.subscriptionStatus === 'active'
      ? 'Active'
      : user.subscriptionStatus === 'trialing'
        ? 'Trialing'
        : 'Inactive';

  return (
    <section className="flex-1 p-4 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
          Account Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your subscription and personal information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">
                Current Plan:{' '}
                <Badge variant="outline" className="ml-1">
                  {planLabel}
                </Badge>
              </p>
              <p className="text-sm text-muted-foreground">
                Status:{' '}
                <span className="font-medium text-black dark:text-white">
                  {statusLabel}
                </span>
              </p>
            </div>
            <form action={customerPortalAction} className="mt-4 sm:mt-0">
              <Button type="submit" variant="outline">
                Manage Subscription
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateAction} className="space-y-4">
            <Input name="name" defaultValue={user.name || ''} placeholder="Name" />
            <Input name="email" defaultValue={user.email} placeholder="Email" />
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
            {updateState.error && <p className="text-red-500 text-sm">{updateState.error}</p>}
            {updateState.success && <p className="text-green-600 text-sm">{updateState.success}</p>}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={passwordAction} className="space-y-4">
            <Input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
            />
            <Input type="password" name="newPassword" placeholder="New Password" />
            <Input type="password" name="confirmPassword" placeholder="Confirm Password" />
            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? 'Changing...' : 'Update Password'}
            </Button>
            {passwordState.error && <p className="text-red-500 text-sm">{passwordState.error}</p>}
            {passwordState.success && <p className="text-green-600 text-sm">{passwordState.success}</p>}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={deleteAction} className="space-y-4">
            <Input
              type="password"
              name="password"
              placeholder="Confirm your password to delete account"
            />
            <Button type="submit" variant="destructive" disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Button>
            {deleteState.error && <p className="text-red-500 text-sm">{deleteState.error}</p>}
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
