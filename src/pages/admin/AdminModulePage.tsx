
import { useMemo, useState } from 'react';
import {
  Search,
  Plus,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Filter,
  Users,
  UserCheck,
  ShieldCheck,
  Inbox,
  FileEdit,
  Radio,
  Folder,
  MapPin,
  Bell,
  BarChart3,
  History,
} from 'lucide-react';

import type { AdminModule } from '../../context';
import { AdminLayout } from './AdminLayout';

interface Item {
  id: number;
  name: string;
  detail: string;
  status: string;
}

const config: Record<AdminModule, {
  title: string;
  description: string;
  icon: typeof Users;
  columns: [string, string, string];
  samples: Item[];
}> = {
  users: {
    title: 'User Management',
    description: 'Manage registered MSR NEWS readers.',
    icon: Users,
    columns: ['User Name', 'Email / Details', 'Status'],
    samples: [
      { id: 1, name: 'Rahul Kumar', detail: 'rahul@example.com', status: 'Active' },
      { id: 2, name: 'Priya Sharma', detail: 'priya@example.com', status: 'Active' },
      { id: 3, name: 'Arun Reddy', detail: 'arun@example.com', status: 'Blocked' },
    ],
  },
  reporters: {
    title: 'Reporter Management',
    description: 'Manage and review registered reporters.',
    icon: UserCheck,
    columns: ['Reporter Name', 'Contact Details', 'Status'],
    samples: [
      { id: 1, name: 'Suresh Kumar', detail: 'suresh@example.com', status: 'Approved' },
      { id: 2, name: 'Anjali Rao', detail: 'anjali@example.com', status: 'Pending' },
      { id: 3, name: 'Kiran Reddy', detail: 'kiran@example.com', status: 'Rejected' },
    ],
  },
  kyc: {
    title: 'KYC Verification',
    description: 'Review reporter identity verification requests.',
    icon: ShieldCheck,
    columns: ['Applicant', 'Document', 'Verification'],
    samples: [
      { id: 1, name: 'Suresh Kumar', detail: 'Aadhaar Card', status: 'Pending' },
      { id: 2, name: 'Anjali Rao', detail: 'Driving Licence', status: 'Pending' },
      { id: 3, name: 'Kiran Reddy', detail: 'Voter ID', status: 'Approved' },
    ],
  },
  newsQueue: {
    title: 'News Queue',
    description: 'Review news articles submitted by reporters.',
    icon: Inbox,
    columns: ['News Headline', 'Submitted By', 'Status'],
    samples: [
      { id: 1, name: 'New road development announced', detail: 'Suresh Kumar', status: 'Pending' },
      { id: 2, name: 'District sports competition begins', detail: 'Anjali Rao', status: 'Pending' },
      { id: 3, name: 'Local school wins award', detail: 'Kiran Reddy', status: 'Approved' },
    ],
  },
  editor: {
    title: 'Editor Workspace',
    description: 'Review and edit news content before publishing.',
    icon: FileEdit,
    columns: ['Article', 'Assigned Editor', 'Status'],
    samples: [
      { id: 1, name: 'City development updates', detail: 'Admin Editor', status: 'In Review' },
      { id: 2, name: 'District education news', detail: 'News Editor', status: 'Draft' },
    ],
  },
  breakingNews: {
    title: 'Breaking News',
    description: 'Create and manage breaking news headlines.',
    icon: Radio,
    columns: ['Headline', 'News Type', 'Status'],
    samples: [
      { id: 1, name: 'Important city announcement', detail: 'Local', status: 'Active' },
      { id: 2, name: 'State-level sports update', detail: 'Sports', status: 'Inactive' },
    ],
  },
  categories: {
    title: 'Category Management',
    description: 'Manage MSR NEWS categories.',
    icon: Folder,
    columns: ['Category', 'Description', 'Status'],
    samples: [
      { id: 1, name: 'Local', detail: 'Local area news', status: 'Active' },
      { id: 2, name: 'District', detail: 'District news', status: 'Active' },
      { id: 3, name: 'Sports', detail: 'Sports updates', status: 'Active' },
      { id: 4, name: 'Entertainment', detail: 'Entertainment news', status: 'Active' },
      { id: 5, name: 'Cinema', detail: 'Cinema updates', status: 'Active' },
      { id: 6, name: 'Politics', detail: 'Political news', status: 'Active' },
    ],
  },
  locations: {
    title: 'Location Management',
    description: 'Manage states, districts and local areas.',
    icon: MapPin,
    columns: ['Location', 'Location Type', 'Status'],
    samples: [
      { id: 1, name: 'Andhra Pradesh', detail: 'State', status: 'Active' },
      { id: 2, name: 'Visakhapatnam', detail: 'District', status: 'Active' },
      { id: 3, name: 'Hyderabad', detail: 'City', status: 'Active' },
    ],
  },
  notifications: {
    title: 'Notifications',
    description: 'Create and manage reader notifications.',
    icon: Bell,
    columns: ['Notification', 'Audience', 'Status'],
    samples: [
      { id: 1, name: 'Welcome to MSR NEWS', detail: 'All Users', status: 'Sent' },
      { id: 2, name: 'Latest local news updates', detail: 'All Users', status: 'Draft' },
    ],
  },
  analytics: {
    title: 'Analytics',
    description: 'View sample MSR NEWS performance statistics.',
    icon: BarChart3,
    columns: ['Metric', 'Description', 'Status'],
    samples: [
      { id: 1, name: 'Total Readers', detail: '2,450 demo readers', status: 'Active' },
      { id: 2, name: 'Published Articles', detail: '186 demo articles', status: 'Active' },
      { id: 3, name: 'Active Reporters', detail: '28 demo reporters', status: 'Active' },
    ],
  },
  auditLog: {
    title: 'Audit Log',
    description: 'View sample administrative activity records.',
    icon: History,
    columns: ['Activity', 'Performed By', 'Status'],
    samples: [
      { id: 1, name: 'Admin logged in', detail: 'Administrator', status: 'Completed' },
      { id: 2, name: 'News article approved', detail: 'Administrator', status: 'Completed' },
      { id: 3, name: 'Reporter application reviewed', detail: 'Administrator', status: 'Completed' },
    ],
  },
};

const STORAGE_PREFIX = 'msr_admin_module_';

export function AdminModulePage({ module }: { module: AdminModule }) {
  const settings = config[module];
  const Icon = settings.icon;
  const storageKey = STORAGE_PREFIX + module;

  const [items, setItems] = useState<Item[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : settings.samples;
    } catch {
      return settings.samples;
    }
  });

  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(
    () => items.filter(item =>
      `${item.name} ${item.detail} ${item.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    ),
    [items, search]
  );

  const save = (updated: Item[]) => {
    setItems(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const addItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newName.trim()) return;

    save([
      ...items,
      {
        id: Date.now(),
        name: newName.trim(),
        detail: newDetail.trim() || 'Demo entry',
        status: module === 'newsQueue' || module === 'kyc' ? 'Pending' : 'Active',
      },
    ]);

    setNewName('');
    setNewDetail('');
    setShowForm(false);
  };

  const updateStatus = (id: number, status: string) => {
    save(items.map(item => item.id === id ? { ...item, status } : item));
  };

  const removeItem = (id: number) => {
    if (!window.confirm('Delete this demo record?')) return;
    save(items.filter(item => item.id !== id));
  };

  const activeCount = items.filter(item =>
    ['Active', 'Approved', 'Sent', 'Completed'].includes(item.status)
  ).length;

  const pendingCount = items.filter(item =>
    ['Pending', 'Draft', 'In Review'].includes(item.status)
  ).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Icon size={17} />
              Administration / {settings.title}
            </div>
            <h1 className="mt-2 text-2xl font-black text-[#102B55]">
              {settings.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {settings.description}
            </p>
          </div>

          {module !== 'analytics' && module !== 'auditLog' && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#102B55] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-red-600"
            >
              <Plus size={18} />
              Add New
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Records</p>
            <h2 className="mt-2 text-3xl font-black text-[#102B55]">{items.length}</h2>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Active / Approved</p>
            <h2 className="mt-2 text-3xl font-black text-green-600">{activeCount}</h2>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending / Draft</p>
            <h2 className="mt-2 text-3xl font-black text-orange-500">{pendingCount}</h2>
          </div>
        </div>

        {showForm && (
          <form onSubmit={addItem} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-[#102B55]">Add New Record</h2>
            <input
              value={newName}
              onChange={event => setNewName(event.target.value)}
              placeholder={settings.columns[0]}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600"
            />
            <input
              value={newDetail}
              onChange={event => setNewDetail(event.target.value)}
              placeholder={settings.columns[1]}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600"
            />
            <div className="flex gap-3">
              <button type="submit" className="rounded-xl bg-[#102B55] px-5 py-3 font-bold text-white hover:bg-red-600">
                Save Record
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border px-5 py-3 font-semibold text-gray-600">
                Cancel
              </button>
            </div>
          </form>
        )}

        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Records</h2>
              <p className="text-sm text-gray-500">Search and manage demo records.</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 sm:w-72">
              <Search size={18} className="text-gray-400" />
              <input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search records..."
                className="w-full text-sm outline-none"
              />
              <Filter size={16} className="text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  {settings.columns.map(column => (
                    <th key={column} className="px-5 py-4">{column}</th>
                  ))}
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id} className="border-t border-gray-100 hover:bg-blue-50/40">
                    <td className="px-5 py-4 font-semibold text-gray-800">{item.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{item.detail}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                        ['Active', 'Approved', 'Sent', 'Completed'].includes(item.status)
                          ? 'bg-green-50 text-green-700'
                          : ['Rejected', 'Blocked', 'Inactive'].includes(item.status)
                            ? 'bg-red-50 text-red-600'
                            : 'bg-orange-50 text-orange-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {['users', 'reporters', 'kyc', 'newsQueue', 'editor', 'breakingNews'].includes(module) && (
                          <>
                            <button
                              title="Approve / Activate"
                              onClick={() => updateStatus(item.id, module === 'users' ? 'Active' : 'Approved')}
                              className="rounded-lg bg-green-50 p-2 text-green-700 hover:bg-green-100"
                            >
                              <CheckCircle size={17} />
                            </button>
                            <button
                              title="Reject / Block"
                              onClick={() => updateStatus(item.id, module === 'users' ? 'Blocked' : 'Rejected')}
                              className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                            >
                              <XCircle size={17} />
                            </button>
                          </>
                        )}
                        <button
                          title="Edit"
                          onClick={() => {
                            setNewName(item.name);
                            setNewDetail(item.detail);
                            setShowForm(true);
                            removeItem(item.id);
                          }}
                          className="rounded-lg bg-blue-50 p-2 text-blue-700 hover:bg-blue-100"
                        >
                          <Edit size={17} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => removeItem(item.id)}
                          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
