/// <reference types="react" />
import React from 'react';
import { Page } from '../../types';
import { Icon } from '../icons';

const users = [
    { email: 'alex.j@example.com', plan: 'Pro', status: 'Active', joined: '2023-10-01' },
    { email: 'ben.c@example.com', plan: 'Free', status: 'Active', joined: '2023-10-05' },
    { email: 'chloe.d@example.com', plan: 'Enterprise', status: 'Active', joined: '2023-09-15' },
    { email: 'dave.e@example.com', plan: 'Free', status: 'Inactive', joined: '2023-08-20' },
];

const AdminView: React.FC = () => {
    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <Icon name={Page.OWNER_ADMINS} className="w-8 h-8 gradient-text" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Admin Dashboard</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
                Manage your organization, monitor usage, and oversee users from this central control panel.
            </p>
            
            <div className="p-6 bg-white dark:bg-slate-800 shadow-lg rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
                        <h3 className="font-semibold text-slate-500 dark:text-slate-400">Total Users</h3>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">1,254</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
                        <h3 className="font-semibold text-slate-500 dark:text-slate-400">API Calls (24h)</h3>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">8,921</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
                        <h3 className="font-semibold text-slate-500 dark:text-slate-400">Active Subs</h3>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">342</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
                        <h3 className="font-semibold text-slate-500 dark:text-slate-400">Errors (24h)</h3>
                        <p className="text-3xl font-bold text-red-500">12</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-4">API Usage Last 7 Days</h3>
                    <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg h-64 flex items-end gap-2">
                        {/* Chart placeholder */}
                        <div className="w-full h-[60%] bg-gradient-to-t from-purple-200 to-purple-300 dark:from-teal-800 dark:to-teal-700 rounded-t-md"></div>
                        <div className="w-full h-[80%] bg-gradient-to-t from-purple-200 to-purple-300 dark:from-teal-800 dark:to-teal-700 rounded-t-md"></div>
                        <div className="w-full h-[50%] bg-gradient-to-t from-purple-200 to-purple-300 dark:from-teal-800 dark:to-teal-700 rounded-t-md"></div>
                        <div className="w-full h-[70%] bg-gradient-to-t from-purple-200 to-purple-300 dark:from-teal-800 dark:to-teal-700 rounded-t-md"></div>
                        <div className="w-full h-[90%] bg-gradient-to-t from-purple-200 to-purple-300 dark:from-teal-800 dark:to-teal-700 rounded-t-md"></div>
                        <div className="w-full h-[65%] bg-gradient-to-t from-purple-200 to-purple-300 dark:from-teal-800 dark:to-teal-700 rounded-t-md"></div>
                        <div className="w-full h-[85%] bg-gradient-to-t from-purple-200 to-purple-300 dark:from-teal-800 dark:to-teal-700 rounded-t-md"></div>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-2">User Management</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                                <tr>
                                    <th className="p-2">Email</th>
                                    <th className="p-2">Plan</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Joined</th>
                                    <th className="p-2 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.email} className="border-b border-slate-200 dark:border-slate-700">
                                        <td className="p-2 font-medium text-slate-800 dark:text-slate-100">{user.email}</td>
                                        <td className="p-2 text-slate-600 dark:text-slate-300">{user.plan}</td>
                                        <td className="p-2">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-200'}`}>{user.status}</span>
                                        </td>
                                        <td className="p-2 text-slate-600 dark:text-slate-300">{user.joined}</td>
                                        <td className="p-2 text-right">
                                            <button className="p-1 text-slate-500 hover:text-purple-600 dark:hover:text-teal-400"><Icon name="edit" className="w-4 h-4"/></button>
                                            <button className="p-1 text-slate-500 hover:text-red-500"><Icon name="delete" className="w-4 h-4"/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminView;