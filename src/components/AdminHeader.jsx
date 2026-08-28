import React from 'react'
import { useNavigate } from 'react-router-dom'
import { User, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { supabase } from '../services/supabase'
import { useState, useEffect } from 'react'

const AdminHeader = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      }
    }
    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <header className="bg-white border-b border-border px-4 md:px-6 py-3 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-secondary">Dashboard Admin</h1>
        <p className="text-sm text-muted-foreground">Kelola penerimaan murid baru</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-secondary hidden sm:inline">
            {user?.email || 'Admin'}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-danger">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Logout</span>
        </Button>
      </div>
    </header>
  )
}

export default AdminHeader