import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/enhanced-button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { 
  getAllUsers, 
  sendAdminInitiatedResetEmail,
  generateAdminRecoveryLink,
  copyToClipboard 
} from '@/lib/adminUserRecovery'
import { Search, RotateCcw, Copy, Mail, AlertCircle, Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface User {
  id: string
  email: string
  name: string
  role: string
  created_at: string
  last_sign_in_at?: string
}

const SuperAdminUserManagement = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [recoveryLink, setRecoveryLink] = useState('')
  const [resetMethod, setResetMethod] = useState<'email' | 'link'>('email')
  const { toast } = useToast()

  // Load users
  useEffect(() => {
    loadUsers()
  }, [])

  // Filter users based on search
  useEffect(() => {
    const filtered = users.filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const result = await getAllUsers()

      if (result.error) {
        toast({
          title: 'Error Loading Users',
          description: result.error.message || 'Failed to load users',
          variant: 'destructive',
        })
        return
      }

      setUsers(result.data || [])
    } catch (err) {
      console.error('Error:', err)
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPasswordClick = (user: User) => {
    setSelectedUser(user)
    setResetMethod('email')
    setRecoveryLink('')
    setShowResetDialog(true)
  }

  const handleGenerateLink = async () => {
    if (!selectedUser) return

    try {
      setIsSending(true)
      console.log('🔐 Generating recovery link for:', selectedUser.email)

      const result = await generateAdminRecoveryLink(
        selectedUser.email,
        `${window.location.origin}/reset-password`
      )

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error.message,
          variant: 'destructive',
        })
        return
      }

      setRecoveryLink(result.data?.link || '')
      setResetMethod('link')
      console.log('✅ Link generated successfully')
      toast({
        title: 'Link Generated',
        description: 'Copy the link and send to user',
      })
    } catch (err) {
      console.error('Error:', err)
      toast({
        title: 'Error',
        description: 'Failed to generate recovery link',
        variant: 'destructive',
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleSendEmail = async () => {
    if (!selectedUser) return

    try {
      setIsSending(true)
      console.log('📧 Sending reset email to:', selectedUser.email)

      const result = await sendAdminInitiatedResetEmail(
        selectedUser.email,
        selectedUser.name,
        `${window.location.origin}/reset-password`
      )

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error.message,
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Success',
        description: `Reset password email sent to ${selectedUser.email}`,
      })
      setShowResetDialog(false)
      console.log('✅ Email sent successfully')
    } catch (err) {
      console.error('Error:', err)
      toast({
        title: 'Error',
        description: 'Failed to send reset email',
        variant: 'destructive',
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleCopyLink = async () => {
    if (!recoveryLink) return

    const copied = await copyToClipboard(recoveryLink)
    if (copied) {
      toast({
        title: 'Copied',
        description: 'Recovery link copied to clipboard',
      })
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Reset password untuk users
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Kelola reset password untuk semua users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari email atau nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={loadUsers}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
            </Button>
          </div>

          {/* Users Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-muted">
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(user.last_sign_in_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResetPasswordClick(user)}
                          className="gap-2"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Reset
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Total users: {users.length}
          </p>
        </CardContent>
      </Card>

      {/* Reset Password Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Kirim reset password link ke {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* User Info */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{selectedUser?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{selectedUser?.name}</p>
              </div>
            </div>

            {/* Method Selection */}
            <div className="space-y-3">
              <Label>Pilih cara pengiriman:</Label>
              
              {/* Option 1: Send Email */}
              <div
                className={`p-4 border rounded-lg cursor-pointer transition ${
                  resetMethod === 'email'
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-muted-foreground'
                }`}
                onClick={() => setResetMethod('email')}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Kirim ke Email
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      User akan menerima email dengan link reset password
                    </p>
                  </div>
                  <input
                    type="radio"
                    checked={resetMethod === 'email'}
                    onChange={() => setResetMethod('email')}
                  />
                </div>
              </div>

              {/* Option 2: Copy Link */}
              <div
                className={`p-4 border rounded-lg cursor-pointer transition ${
                  resetMethod === 'link'
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-muted-foreground'
                }`}
                onClick={() => handleGenerateLink()}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium flex items-center gap-2">
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Generate link dan copy untuk dikirim secara manual
                    </p>
                  </div>
                  <input
                    type="radio"
                    checked={resetMethod === 'link'}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </div>

            {/* Display Generated Link */}
            {resetMethod === 'link' && recoveryLink && (
              <div className="space-y-2">
                <Label htmlFor="recovery-link">Recovery Link:</Label>
                <div className="flex gap-2">
                  <Input
                    id="recovery-link"
                    value={recoveryLink}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    size="sm"
                    onClick={handleCopyLink}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Link berlaku untuk 1 jam
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResetDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={resetMethod === 'email' ? handleSendEmail : handleCopyLink}
              disabled={isSending || (resetMethod === 'link' && !recoveryLink)}
              className="gap-2"
            >
              {isSending && <Loader2 className="h-4 w-4 animate-spin" />}
              {resetMethod === 'email' ? 'Send Email' : 'Copy Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SuperAdminUserManagement
