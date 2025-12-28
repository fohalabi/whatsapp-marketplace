'use client';

import React, { useState } from 'react';
import { Shield, Mail, User, Clock, Key, Smartphone, Bell, Moon, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Mock data
const mockProfile = {
  fullName: "Sarah Martinez",
  email: "sarah.martinez@company.com",
  role: "Admin",
  status: "Active",
  permissions: [
    "Can manage orders",
    "Can handle chats",
    "Can view financials",
    "Can manage users",
    "Can access analytics",
    "Can modify settings"
  ],
  twoFactorEnabled: true,
  recentActivity: [
    { action: "Logged in", timestamp: "2025-12-26 09:15 AM" },
    { action: "Approved merchant: TechStore Ltd", timestamp: "2025-12-26 08:45 AM" },
    { action: "Updated order status: #ORD-4521", timestamp: "2025-12-25 04:30 PM" },
    { action: "Responded to support ticket #892", timestamp: "2025-12-25 02:15 PM" },
    { action: "Modified user permissions: John Doe", timestamp: "2025-12-24 11:20 AM" },
    { action: "Generated monthly report", timestamp: "2025-12-24 10:05 AM" },
    { action: "Logged in", timestamp: "2025-12-24 09:00 AM" }
  ],
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
    theme: "light"
  }
};

const AdminProfile = () => {
  const [profile] = useState(mockProfile);
  const [emailNotif, setEmailNotif] = useState(profile.preferences.emailNotifications);
  const [pushNotif, setPushNotif] = useState(profile.preferences.pushNotifications);
  const [theme, setTheme] = useState(profile.preferences.theme);

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      Admin: "bg-amber-100 text-amber-800 border-amber-200",
      Manager: "bg-cyan-100 text-cyan-800 border-cyan-200",
      Support: "bg-emerald-100 text-emerald-800 border-emerald-200"
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "text-green-600" 
      : "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Security */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Profile Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {profile.fullName.split(' ').map(n => n[0]).join('')}
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{profile.fullName}</h2>
                <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(profile.role)}`}>
                    {profile.role}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`flex items-center gap-1 text-sm font-semibold ${getStatusColor(profile.status)}`}>
                    {profile.status === "Active" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    {profile.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                Security
              </h3>

              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Key className="w-4 h-4" />
                    Change Password
                  </span>
                  <span className="text-gray-400">→</span>
                </button>

                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Smartphone className="w-4 h-4" />
                      Two-Factor Auth
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      profile.twoFactorEnabled 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {profile.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Extra security can be enabled later
                  </p>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-gray-700">
                    <Bell className="w-4 h-4" />
                    Email Notifications
                  </span>
                  <button
                    onClick={() => setEmailNotif(!emailNotif)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      emailNotif ? "bg-emerald-600" : "bg-gray-300"
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      emailNotif ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-gray-700">
                    <Bell className="w-4 h-4" />
                    Push Notifications
                  </span>
                  <button
                    onClick={() => setPushNotif(!pushNotif)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      pushNotif ? "bg-emerald-600" : "bg-gray-300"
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      pushNotif ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-gray-700">
                    <Moon className="w-4 h-4" />
                    Theme Mode
                  </span>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Permissions & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Role & Permissions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                Role & Permissions
              </h3>

              <div className="mb-4 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-sm text-amber-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  These permissions are assigned based on your role. Contact your administrator if you need additional access.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profile.permissions.map((permission, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{permission}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Recent Activity
              </h3>

              <div className="space-y-1">
                {profile.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 text-sm text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition-colors">
                View Full Activity Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;