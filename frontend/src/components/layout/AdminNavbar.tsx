import React from 'react'
import { SidebarTrigger } from '../ui/sidebar'
import SearchCommand from '../forms/SearchCommand'
import NotificationMenu from '../ui/NotificationMenu'
import UserMenu from '../ui/UserMenu'

const AdminNavbar = () => {
  return (
    <header className='sticky top-0 z-50 flex h-16 items-center justify-between bg-background px-6 border-b border-dark'>
        <div className="flex items-center gap-4">
        <SidebarTrigger />
        <SearchCommand />
        </div>
        <div className='flex items-center gap-4'>
          <NotificationMenu />
          <UserMenu />
        </div>
    </header>
  )
}

export default AdminNavbar