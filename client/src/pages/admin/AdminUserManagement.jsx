import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Shield, ChevronDown,
  UserCheck, UserX, Mail, Phone,
  Clock, MoreVertical, Filter, X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { subscribeToCollection, updateDocument, COLLECTIONS } from '../../services/firestoreService';

const ROLES = ['citizen', 'police', 'hospital', 'fire', 'admin'];
const ROLE_COLORS = {
  citizen: 'bg-indigo-100 text-indigo-600',
  police: 'bg-blue-100 text-blue-600',
  hospital: 'bg-rose-100 text-rose-600',
  fire: 'bg-orange-100 text-orange-600',
  admin: 'bg-purple-100 text-purple-600',
};

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const unsub = subscribeToCollection(COLLECTIONS.USERS, (docs) => {
      setUsers(docs);
      setLoading(false);
    }, [], 'lastLogin', 'desc', 200);
    return () => unsub();
  }, []);

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch = searchQuery
      ? (u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         u.email?.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    const matchesRole = roleFilter === 'all' ? true : u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Change user role
  const handleRoleChange = async (userId, role) => {
    setUpdating(true);
    try {
      await updateDocument(COLLECTIONS.USERS, userId, { role });
      setEditingUser(null);
    } catch (err) {
      console.error('Role update error:', err);
    }
    setUpdating(false);
  };

  // Stats
  const roleCounts = ROLES.reduce((acc, role) => {
    acc[role] = users.filter(u => u.role === role).length;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center space-y-4">
          <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          <p className="text-sm font-bold text-slate-500">Loading users from Firestore...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Users className="text-indigo-600" size={32} />
            User Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Manage user roles and permissions &bull; <span className="text-indigo-600 font-bold">{users.length} registered users</span>
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs w-56 focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs dark:text-white"
          >
            <option value="all">All Roles</option>
            {ROLES.map(r => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {ROLES.map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(roleFilter === role ? 'all' : role)}
            className={cn(
              "p-4 rounded-2xl border transition-all text-center",
              roleFilter === role
                ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 shadow-lg"
                : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-200"
            )}
          >
            <p className="text-2xl font-black text-slate-900 dark:text-white">{roleCounts[role] || 0}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{role}</p>
          </button>
        ))}
      </div>

      {/* User Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {['User', 'Email', 'Role', 'Last Login', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{user.displayName || 'Unnamed'}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{user.id?.slice(0, 12)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} className="text-slate-400" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">{user.email || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {editingUser === user.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs dark:text-white"
                        >
                          {ROLES.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleRoleChange(user.id, newRole)}
                          disabled={updating}
                          className="p-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                        >
                          <UserCheck size={14} />
                        </button>
                        <button onClick={() => setEditingUser(null)} className="p-1 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest",
                        ROLE_COLORS[user.role] || ROLE_COLORS.citizen
                      )}>
                        {user.role || 'citizen'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-slate-400" />
                      <span className="text-[11px] text-slate-500 font-medium">
                        {user.lastLogin?.toDate ? user.lastLogin.toDate().toLocaleDateString() : '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => { setEditingUser(user.id); setNewRole(user.role || 'citizen'); }}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                    >
                      Change Role
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="py-16 text-center">
              <Users size={48} className="mx-auto text-slate-200 dark:text-slate-700 mb-4" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
