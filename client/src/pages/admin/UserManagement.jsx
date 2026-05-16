import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Search, Filter, MoreVertical, 
  Shield, UserCheck, UserX, Mail, 
  Phone, Calendar, ChevronRight, Edit2, Trash2, X
} from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { cn } from '../../utils/cn';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Aditya Sharma', email: 'aditya.s@safelink.gov', role: 'Police', status: 'Active', joined: '12 Jan 2026' },
    { id: 2, name: 'Priya Patel', email: 'priya.p@safelink.gov', role: 'Admin', status: 'Active', joined: '05 Jan 2026' },
    { id: 3, name: 'Rahul Deshmukh', email: 'rahul.d@gmail.com', role: 'Citizen', status: 'Active', joined: '18 Feb 2026' },
    { id: 4, name: 'Sneha Kulkarni', email: 'sneha.k@hospital.in', role: 'Medical', status: 'Pending', joined: '22 Feb 2026' },
    { id: 5, name: 'Vikram Singh', email: 'vikram.s@fire.gov', role: 'Fire', status: 'Active', joined: '10 Jan 2026' },
    { id: 6, name: 'Amit Verma', email: 'amit.v@volunteer.org', role: 'Volunteer', status: 'Suspended', joined: '15 Jan 2026' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  
  // Add User State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Police' });

  // Edit User State
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Delete User State
  const [userToDelete, setUserToDelete] = useState(null);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) return;
    setIsAdding(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const createdUser = {
      id: Date.now(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'Active',
      joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    
    setUsers([createdUser, ...users]);
    setIsAdding(false);
    setIsAddUserOpen(false);
    setNewUser({ name: '', email: '', role: 'Police' });
    alert(`✅ Successfully provisioned new access for ${createdUser.name}`);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
    setIsEditUserOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser.name || !editingUser.email) return;
    setIsEditing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setIsEditing(false);
    setIsEditUserOpen(false);
    setEditingUser(null);
  };

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : u.status === 'Suspended' ? 'Pending' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-black text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage platform access, roles, and security protocols.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAddUserOpen(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Users size={18} /> Add New User
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search users by name, email, or role..."
            className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-indigo-600 transition-all text-sm dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2 hover:bg-slate-100 transition-all">
            <Filter size={14} /> Filter
          </button>
          <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2 hover:bg-slate-100 transition-all">
            <Shield size={14} /> Security Audit
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department / Role</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined Date</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                          <Mail size={10} /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        user.role === 'Admin' ? "bg-rose-500" :
                        user.role === 'Police' ? "bg-indigo-500" : "bg-emerald-500"
                      )}></div>
                      <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">{user.role}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                      user.status === 'Active' ? "bg-emerald-100 text-emerald-600" :
                      user.status === 'Pending' ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
                    )}>
                      {user.status === 'Active' ? <UserCheck size={12} /> : <UserX size={12} />}
                      {user.status}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Calendar size={14} className="text-slate-400" />
                      {user.joined}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(user)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(user.id)}
                        title="Toggle Status"
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-xl transition-all"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setUserToDelete(null)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative z-10 border border-slate-100 dark:border-slate-800 text-center"
          >
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-outfit font-black text-slate-900 dark:text-white mb-2">Delete User?</h3>
            <p className="text-sm text-slate-500 font-medium mb-8">
              Are you sure you want to remove <span className="font-bold text-slate-700 dark:text-slate-300">{userToDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm rounded-xl hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 dark:shadow-none"
              >
                Yes, Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditUserOpen && editingUser && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsEditUserOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative z-10 border border-slate-100 dark:border-slate-800"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-outfit font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 size={24} className="text-indigo-600" /> Edit User Profile
              </h3>
              <button 
                onClick={() => setIsEditUserOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Full Name</label>
                <input 
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600 transition-all text-sm dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Official Email</label>
                <input 
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600 transition-all text-sm dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Department Role</label>
                <select 
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600 transition-all text-sm dark:text-white appearance-none cursor-pointer"
                >
                  <option value="Police">Police Department</option>
                  <option value="Medical">Medical Services</option>
                  <option value="Fire">Fire Department</option>
                  <option value="Admin">System Administrator</option>
                  <option value="Citizen">Registered Citizen</option>
                  <option value="Volunteer">Registered Volunteer</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => setIsEditUserOpen(false)}
                  disabled={isEditing}
                  className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm rounded-xl hover:bg-slate-100 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveEdit}
                  disabled={isEditing || !editingUser.name || !editingUser.email}
                  className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-200"
                >
                  {isEditing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsAddUserOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative z-10 border border-slate-100 dark:border-slate-800"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-outfit font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Users size={24} className="text-indigo-600" /> Add New User
              </h3>
              <button 
                onClick={() => setIsAddUserOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Full Name</label>
                <input 
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600 transition-all text-sm dark:text-white"
                  placeholder="e.g. Inspector Raj"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Official Email</label>
                <input 
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600 transition-all text-sm dark:text-white"
                  placeholder="name@safelink.gov"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Department Role</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600 transition-all text-sm dark:text-white appearance-none cursor-pointer"
                >
                  <option value="Police">Police Department</option>
                  <option value="Medical">Medical Services</option>
                  <option value="Fire">Fire Department</option>
                  <option value="Admin">System Administrator</option>
                  <option value="Volunteer">Registered Volunteer</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => setIsAddUserOpen(false)}
                  disabled={isAdding}
                  className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm rounded-xl hover:bg-slate-100 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddUser}
                  disabled={isAdding || !newUser.name || !newUser.email}
                  className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-200"
                >
                  {isAdding ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Provision User"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
