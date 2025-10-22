import React from 'react';
import { UsersIcon, SubscriptionIcon, ChatIcon } from '../components/Icons';

// Fix: Changed icon prop type to `React.ReactElement<any>` to resolve a TypeScript error when using React.cloneElement.
const AdminStatCard: React.FC<{ title: string; value: string; icon: React.ReactElement<any>; }> = ({ title, value, icon }) => (
    <div className="p-6 rounded-2xl glass-pane shadow-lg flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-slate-100 text-text-secondary">
            {React.cloneElement(icon, { className: "w-6 h-6" })}
        </div>
        <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
    </div>
);

const mockUsers = [
    { id: 1, name: "Demo User", email: "demo@snakeengine.ai", plan: "Free", since: "2023-10-26" },
    { id: 2, name: "Alex Pro", email: "alex@example.com", plan: "Pro", since: "2023-10-20" },
    { id: 3, name: "Corp Inc.", email: "contact@corp.inc", plan: "Enterprise", since: "2023-09-15" },
    { id: 4, name: "Jane Doe", email: "jane.d@example.com", plan: "Pro", since: "2023-10-22" },
];

export const AdminPage: React.FC = () => {
    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Admin Panel</h1>
                <p className="text-text-secondary mt-1">Platform overview and management.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <AdminStatCard title="Total Users" value="1,428" icon={<UsersIcon />} />
                <AdminStatCard title="Active Subscriptions" value="312" icon={<SubscriptionIcon />} />
                <AdminStatCard title="API Calls (24h)" value="15,731" icon={<ChatIcon />} />
            </div>
            
            <div className="p-6 rounded-2xl glass-pane">
                <h2 className="text-xl font-semibold text-text-primary mb-4">User Management</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="text-xs text-text-secondary uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">User</th>
                                <th scope="col" className="px-6 py-3">Subscription</th>
                                <th scope="col" className="px-6 py-3">Member Since</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockUsers.map(user => (
                                <tr key={user.id} className="border-b border-border-color hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                                        {user.name} <br/> <span className="text-text-secondary font-normal">{user.email}</span>
                                    </td>
                                    <td className="px-6 py-4">{user.plan}</td>
                                    <td className="px-6 py-4">{user.since}</td>
                                    <td className="px-6 py-4"><a href="#" className="font-medium text-brand-purple hover:underline">Edit</a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};