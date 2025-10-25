// Fix: Changed React import to `import * as React from 'react'` to resolve JSX typing issues.
import * as React from 'react';
import { Page } from '../../types';
import { Icon } from '../icons';

const users = [
    { email: 'alex.j@example.com', plan: 'Pro', status: 'Active', joined: '2023-10-01' },
    { email: 'ben.c@example.com', plan: 'Free', status: 'Active', joined: '2023-10-05' },
    { email: 'chloe.d@example.com', plan: 'Enterprise', status: 'Active', joined: '2023-09-15' },
    { email: 'dave.e@example.com', plan: 'Free', status: 'Inactive', joined: '2023-08-20' },
];

const AdminView: React.FC = () => {
    const chartData = [60, 80, 75, 90, 65, 70, 85].reverse(); // Mock data for last 7 days

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
                {/* Fix: Replaced non-existent Page.OWNER_ADMINS with Page.ADMIN. */}
                <Icon name={Page.ADMIN} className="w-8 h-8 gradient-text" />
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
                         {chartData.map((height, i) => (
                            <div key={i} className="flex-1 bg-gradient-to-t from-purple-400 to-teal-400 rounded-t-md transition-all duration-300" style={{ height: `${height}%` }}></div>
                        ))}
                    </div>
                </div>
                
                <div className="mt-8">
                    <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-4">User Management</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-700 dark:text-slate-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Plan</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Joined</th>
                                    <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.email} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                        <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">{user.email}</td>
                                        <td className="px-6 py-4">{user.plan}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{user.joined}</td>
                                        <td className="px-6 py-4 text-right">
                                            <a href="#" className="font-medium text-purple-600 dark:text-teal-400 hover:underline">Edit</a>
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
