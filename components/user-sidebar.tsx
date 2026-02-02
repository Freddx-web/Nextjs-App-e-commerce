'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  User,
  Settings,
  ShoppingBag,
  Package,
  CreditCard,
  LogOut,
  Home,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
// Define the menu items for the sidebar
const menuItems = [
  {
    title: 'Mi Perfil',
    href: '/profile',
    icon: User,
  },
  {
    title: 'Inicio',
    href: '/',
    icon: Home,
  },
  {
    title: 'Configuración',
    href: '/profile/settings',
    icon: Settings,
  },
  {
    title: 'Mis Pedidos',
    href: '/profile/orders',
    icon: ShoppingBag,
  },
  {
    title: 'Mis Direcciones',
    href: '/profile/addresses',
    icon: Package,
  },
  {
    title: 'Métodos de Pago',
    href: '/profile/payment',
    icon: CreditCard,
  },
];
// Main sidebar component
export function UserSidebar() {
  // Get the current pathname to determine active links
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Render the sidebar
  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg" />
                <span className="font-bold text-xl">Mi Cuenta</span>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft
                className={cn(
                  'h-5 w-5 transition-transform',
                  collapsed && 'rotate-180'
                )}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-green-50 text-green-600'
                      : 'text-gray-700 hover:bg-gray-100',
                    collapsed && 'justify-center'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="font-medium">{item.title}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full text-gray-700 hover:bg-red-50 hover:text-red-600',
                collapsed && 'justify-center'
              )}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">Cerrar Sesión</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
