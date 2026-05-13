import { useNavigate } from 'react-router';
import { FileText, ClipboardList, TrendingUp, ListChecks, Package, ClipboardCheck, Bell, Briefcase, CheckSquare, Users, DollarSign } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'lead-management',
      icon: FileText,
      label: '线索管理',
      path: '#',
    },
    {
      id: 'approval',
      icon: ClipboardList,
      label: '审批',
      path: '#',
    },
    {
      id: 'opportunity-rating',
      icon: TrendingUp,
      label: '商机评分',
      path: '#',
    },
    {
      id: 'opportunity-list',
      icon: ListChecks,
      label: '商机列表',
      path: '/opportunity',
    },
    {
      id: 'data-package',
      icon: Package,
      label: '产数钱包',
      path: '#',
    },
    {
      id: 'opportunity-tracking',
      icon: ClipboardCheck,
      label: '商机跟踪列表',
      path: '/tasks',
    },
    {
      id: 'six-standard-list',
      icon: CheckSquare,
      label: '六到位',
      path: '/six-standard-list',
    },
    {
      id: 'expert-dispatch',
      icon: ClipboardList,
      label: '专家派单列表',
      path: '/expert-dispatch',
    },
    {
      id: 'expert-task-pool',
      icon: Users,
      label: '专家任务',
      path: '/expert-task-pool',
    },
    {
      id: 'notifications',
      icon: Bell,
      label: '消息通知列表',
      path: '/notifications',
    },
    {
      id: 'revenue-management',
      icon: DollarSign,
      label: '录收管理',
      path: '/revenue-management',
    },
    {
      id: 'business-info',
      icon: Briefcase,
      label: '商情管理',
      path: '/business-info',
    },
  ];

  const stats = [
    { label: '线索统计', value: 198, trend: 'up' },
    { label: '线索通过统计', value: 181, trend: 'up' },
    { label: '转商机统计', value: 26, trend: 'up' },
    { label: '转商机通过统计', value: 19, trend: 'up' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-400 to-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-8 text-white">
        <h1 className="text-3xl mb-6">您好！费佳</h1>
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
            <span className="text-sm">📍 宁波市 镇海云中台分部</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
            <span className="text-sm">📞 电话：15305606921</span>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="bg-white rounded-t-3xl px-6 pt-6 pb-8">
        <h2 className="text-lg text-gray-800 mb-4">功能入口</h2>
        <div className="grid grid-cols-4 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => item.path !== '#' && navigate(item.path)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-xl">
                  <Icon className="w-7 h-7 text-gray-700" />
                </div>
                <span className="text-xs text-gray-800 text-center">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white px-6 pb-8">
        <h2 className="text-lg text-gray-800 mb-4">我创建的线索</h2>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4"
            >
              <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-medium text-blue-600">{stat.value}</div>
                {stat.trend === 'up' && (
                  <div className="text-green-500">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}