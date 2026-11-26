
import {
  Users,
  UserCheck,
  FileClock,
  ShieldAlert,
  Newspaper,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  FileEdit,
  Radio,
  Folder,
  MapPin,
  Bell,
  BarChart3,
  History,
  ChevronRight,
  Settings,
} from 'lucide-react';

import { useApp } from '../../context';
import { AdminLayout } from './AdminLayout';

type AdminModule =
  | 'users'
  | 'reporters'
  | 'kyc'
  | 'newsQueue'
  | 'editor'
  | 'breakingNews'
  | 'categories'
  | 'locations'
  | 'notifications'
  | 'analytics'
  | 'auditLog';

const stats = [
  {
    title: 'Total Users',
    value: '2,450',
    change: '+12.5%',
    description: 'Compared to last month',
    icon: Users,
    color: 'blue',
    module: 'users' as AdminModule,
  },
  {
    title: 'Total Reporters',
    value: '128',
    change: '+8.2%',
    description: 'Registered reporters',
    icon: UserCheck,
    color: 'green',
    module: 'reporters' as AdminModule,
  },
  {
    title: 'Pending News',
    value: '24',
    change: 'Needs review',
    description: 'Articles awaiting approval',
    icon: FileClock,
    color: 'orange',
    module: 'newsQueue' as AdminModule,
  },
  {
    title: 'Pending KYC',
    value: '08',
    change: 'Action required',
    description: 'Reporter verification',
    icon: ShieldAlert,
    color: 'red',
    module: 'kyc' as AdminModule,
  },
];

const modules: {
  title: string;
  description: string;
  icon: typeof Users;
  color: string;
  module: AdminModule;
}[] = [
  {
    title: 'User Management',
    description: 'Manage registered users',
    icon: Users,
    color: 'blue',
    module: 'users',
  },
  {
    title: 'Reporter Management',
    description: 'Manage reporter accounts',
    icon: UserCheck,
    color: 'green',
    module: 'reporters',
  },
  {
    title: 'KYC Verification',
    description: 'Review reporter documents',
    icon: ShieldAlert,
    color: 'red',
    module: 'kyc',
  },
  {
    title: 'News Queue',
    description: 'Review submitted articles',
    icon: Newspaper,
    color: 'orange',
    module: 'newsQueue',
  },
  {
    title: 'Editor Workspace',
    description: 'Edit and prepare news',
    icon: FileEdit,
    color: 'purple',
    module: 'editor',
  },
  {
    title: 'Breaking News',
    description: 'Manage breaking headlines',
    icon: Radio,
    color: 'red',
    module: 'breakingNews',
  },
  {
    title: 'Categories',
    description: 'Manage news categories',
    icon: Folder,
    color: 'blue',
    module: 'categories',
  },
  {
    title: 'Location Management',
    description: 'Manage news locations',
    icon: MapPin,
    color: 'green',
    module: 'locations',
  },
  {
    title: 'Notifications',
    description: 'Manage platform alerts',
    icon: Bell,
    color: 'orange',
    module: 'notifications',
  },
  {
    title: 'Analytics',
    description: 'View platform statistics',
    icon: BarChart3,
    color: 'purple',
    module: 'analytics',
  },
  {
    title: 'Audit Log',
    description: 'Track admin activities',
    icon: History,
    color: 'blue',
    module: 'auditLog',
  },
];

const recentNews = [
  {
    title: 'Hyderabad Roads to Get a Major Upgrade',
    category: 'LOCAL',
    reporter: 'Ravi Kumar',
    time: '10 minutes ago',
    status: 'Pending',
  },
  {
    title: 'Telangana District Development Projects',
    category: 'DISTRICT',
    reporter: 'Priya Reddy',
    time: '35 minutes ago',
    status: 'Reviewing',
  },
  {
    title: 'Upcoming Telugu Movie Creates Buzz',
    category: 'CINEMA',
    reporter: 'Kiran',
    time: '1 hour ago',
    status: 'Approved',
  },
  {
    title: 'Young Cricket Talent Impresses Fans',
    category: 'SPORTS',
    reporter: 'Arjun',
    time: '2 hours ago',
    status: 'Pending',
  },
];

const activities = [
  {
    title: 'New reporter registration',
    description: 'A new reporter submitted an application.',
    time: '5 minutes ago',
    icon: UserCheck,
    color: 'blue',
  },
  {
    title: 'News article submitted',
    description: 'A new article entered the news queue.',
    time: '20 minutes ago',
    icon: Newspaper,
    color: 'red',
  },
  {
    title: 'KYC verification pending',
    description: 'A reporter uploaded identity documents.',
    time: '45 minutes ago',
    icon: ShieldAlert,
    color: 'orange',
  },
];

const colorStyles = {
  blue: {
    icon: 'bg-blue-50 text-blue-700',
    border: 'border-blue-100',
  },
  green: {
    icon: 'bg-green-50 text-green-700',
    border: 'border-green-100',
  },
  orange: {
    icon: 'bg-orange-50 text-orange-700',
    border: 'border-orange-100',
  },
  red: {
    icon: 'bg-red-50 text-red-700',
    border: 'border-red-100',
  },
};

const moduleColors: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 group-hover:bg-blue-700',
  green: 'bg-green-50 text-green-700 group-hover:bg-green-600',
  red: 'bg-red-50 text-red-600 group-hover:bg-red-600',
  orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600',
  purple: 'bg-purple-50 text-purple-700 group-hover:bg-purple-700',
};

export function AdminDashboardPage() {
  const { navigate } = useApp();

  const openModule = (module: AdminModule) => {
    navigate({
      name: 'adminModule',
      module,
    });
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1500px] space-y-7">

        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#102B55] via-[#163B6B] to-[#1D4C83] p-6 text-white shadow-lg sm:p-8">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
          <div className="absolute -bottom-24 right-40 h-52 w-52 rounded-full border-[25px] border-white/5" />

          <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                Admin Dashboard
              </span>

              <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                Welcome back, Administrator!
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                Here's what's happening across your MSR NEWS platform.
                Manage news, reporters and your audience from one place.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => openModule('newsQueue')}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  <FileEdit size={17} />
                  Review News
                  <ArrowUpRight size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => openModule('analytics')}
                  className="flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20"
                >
                  <TrendingUp size={17} />
                  View Analytics
                </button>
              </div>
            </div>

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
              <Newspaper size={42} />
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                Platform Overview
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your platform at a glance
              </p>
            </div>

            <span className="text-xs font-medium text-gray-400">
              Demo statistics
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;
              const styles =
                colorStyles[item.color as keyof typeof colorStyles];

              return (
                <button
                  type="button"
                  key={item.title}
                  onClick={() => openModule(item.module)}
                  className={`rounded-2xl border ${styles.border} bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`rounded-xl p-3 ${styles.icon}`}>
                      <Icon size={23} />
                    </div>
                    <ArrowUpRight size={19} className="text-gray-400" />
                  </div>

                  <p className="mt-5 text-sm font-medium text-gray-500">
                    {item.title}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <h3 className="text-3xl font-extrabold text-gray-900">
                      {item.value}
                    </h3>
                    <span className="rounded-md bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700">
                      {item.change}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* All Admin Modules */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                Administration Modules
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Access and manage all MSR NEWS sections
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#102B55]">
              11 Modules
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {modules.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  type="button"
                  key={item.module}
                  onClick={() => openModule(item.module)}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition group-hover:text-white ${moduleColors[item.color]}`}
                  >
                    <Icon size={23} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-extrabold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {item.description}
                    </p>
                  </div>

                  <ChevronRight
                    size={19}
                    className="shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#102B55]"
                  />
                </button>
              );
            })}
          </div>
        </section>

        {/* Recent News and Activity */}
        <section className="grid grid-cols-1 gap-6 2xl:grid-cols-3">

          {/* Recent News Table */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm 2xl:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5">
              <div>
                <h2 className="font-extrabold text-gray-900">
                  Recent News Submissions
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Latest articles submitted by reporters
                </p>
              </div>

              <button
                type="button"
                onClick={() => openModule('newsQueue')}
                className="rounded-lg bg-[#102B55] px-4 py-2 text-xs font-bold text-white transition hover:bg-red-600"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">News Article</th>
                    <th className="px-5 py-4">Reporter</th>
                    <th className="px-5 py-4">Time</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {recentNews.map((news) => (
                    <tr
                      key={news.title}
                      className="transition hover:bg-blue-50/40"
                    >
                      <td className="px-5 py-4">
                        <p className="max-w-[260px] text-sm font-bold text-gray-900">
                          {news.title}
                        </p>
                        <span className="mt-1 inline-block text-[10px] font-bold tracking-wider text-red-600">
                          {news.category}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {news.reporter}
                      </td>

                      <td className="px-5 py-4 text-xs text-gray-500">
                        {news.time}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                            news.status === 'Approved'
                              ? 'bg-green-50 text-green-700'
                              : news.status === 'Reviewing'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-orange-50 text-orange-700'
                          }`}
                        >
                          {news.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-gray-900">
                  Recent Activity
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Demo activity feed
                </p>
              </div>
              <Clock size={19} className="text-gray-400" />
            </div>

            <div className="space-y-5">
              {activities.map((activity) => {
                const Icon = activity.icon;

                return (
                  <div key={activity.title} className="flex gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        activity.color === 'red'
                          ? 'bg-red-50 text-red-600'
                          : activity.color === 'orange'
                            ? 'bg-orange-50 text-orange-600'
                            : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      <Icon size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900">
                        {activity.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {activity.description}
                      </p>
                      <p className="mt-2 text-[10px] font-medium text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl bg-blue-50 p-4">
              <div className="flex items-center gap-2 text-[#102B55]">
                <TrendingUp size={18} />
                <p className="text-sm font-bold">Platform Activity</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-gray-600">
                Monitor news submissions, reporter registrations and
                platform activities from your administration panel.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Information */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={19} className="text-green-600" />
            <p className="text-sm font-semibold text-gray-800">
              Admin panel is running in demo mode.
            </p>
          </div>

          <span className="text-xs text-gray-400">
            MSR NEWS Administration
          </span>
        </div>

      </div>
    </AdminLayout>
  );
}
