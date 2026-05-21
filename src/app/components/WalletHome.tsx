import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowLeft, MoreHorizontal, ChevronDown, Calendar, FileText, Wallet, Briefcase, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const regionData = [
  { name: '镇海', value: 25, color: '#EF4444' },
  { name: '前湾新区', value: 20, color: '#F59E0B' },
  { name: '北仑', value: 15, color: '#22C55E' },
  { name: '鄞州', value: 15, color: '#3B82F6' },
  { name: '江北', value: 10, color: '#8B5CF6' },
  { name: '海曙', value: 8, color: '#EC4899' },
  { name: '其他', value: 7, color: '#6B7280' },
];

const rewardStats = [
  {
    title: '有效商机奖',
    items: [
      { label: '本月发放', value: '8,500', unit: '元' },
      { label: '累计发放', value: '125,000', unit: '元' },
      { label: '本月待审核', value: '1', unit: '个项目' },
    ],
  },
  {
    title: '大额商机奖',
    items: [
      { label: '本月发放', value: '15,000', unit: '元' },
      { label: '累计发放', value: '280,000', unit: '元' },
      { label: '本月待审核', value: '0', unit: '个项目' },
    ],
  },
  {
    title: '项目提成奖',
    items: [
      { label: '本月发放', value: '0', unit: '元' },
      { label: '累计发放', value: '50,000', unit: '元' },
      { label: '本月待审核', value: '2', unit: '个项目' },
    ],
  },
];

const bonusPoolStats = [
  { label: '本月奖励待审核', value: '3', unit: '个项目', type: 'warning' },
  { label: '奖金池', value: '21/30', unit: '万', progress: 70 },
  { label: '本月奖励审核通过', value: '12', unit: '个', type: 'success' },
];

export function WalletHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'my' | 'managed'>('my');
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('宁波市');
  const [selectedMonth, setSelectedMonth] = useState('2025-11');

  const totalPool = 1000000; // 100万

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">产数钱包</h1>
        <button className="p-2 -mr-2">
          <MoreHorizontal className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex">
          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors relative ${
              activeTab === 'my' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            我的商机
            {activeTab === 'my' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('managed')}
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors relative ${
              activeTab === 'managed' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            我管理的商机
            {activeTab === 'managed' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>
      </div>

      <div className="pb-24">
        {/* Data Overview Section */}
        <div className="bg-white p-4">
          <div className="flex gap-4">
            {/* Donut Chart */}
            <div className="relative w-36 h-36 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-gray-800">100</div>
                <div className="text-xs text-gray-500">万元</div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 flex flex-col justify-center space-y-2">
              <div className="text-sm text-gray-500">地市奖金池</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-800">100</span>
                <span className="text-sm text-gray-500">万元</span>
              </div>
              <div className="text-xs text-gray-400 mt-2">您的排名</div>
              <div className="flex gap-4 text-xs">
                <span className="text-gray-600">支局<span className="text-blue-600 font-medium ml-1">前10%</span></span>
                <span className="text-gray-600">分局<span className="text-blue-600 font-medium ml-1">前15%</span></span>
                <span className="text-gray-600">地市<span className="text-blue-600 font-medium ml-1">前20%</span></span>
              </div>
            </div>
          </div>

          {/* City & Date Selector */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setCityPickerOpen(true)}
              className="flex-1 h-10 bg-gray-50 rounded-xl px-4 flex items-center justify-between text-sm"
            >
              <span className="text-gray-700">{selectedCity}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => setDatePickerOpen(true)}
              className="flex-1 h-10 bg-gray-50 rounded-xl px-4 flex items-center justify-between text-sm"
            >
              <span className="text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                {selectedMonth}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Bonus Pool Status */}
        <div className="bg-white mt-3 p-4">
          <div className="text-sm font-medium text-gray-800 mb-3">宁波市本月奖励状态</div>
          <div className="flex flex-wrap gap-2">
            {bonusPoolStats.map((stat, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded-xl ${
                  stat.type === 'warning'
                    ? 'bg-orange-50'
                    : stat.type === 'success'
                    ? 'bg-green-50'
                    : 'bg-blue-50'
                }`}
              >
                <div className={`text-xs ${
                  stat.type === 'warning'
                    ? 'text-orange-600'
                    : stat.type === 'success'
                    ? 'text-green-600'
                    : 'text-blue-600'
                }`}>
                  {stat.label}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-lg font-bold ${
                    stat.type === 'warning'
                      ? 'text-orange-600'
                      : stat.type === 'success'
                      ? 'text-green-600'
                      : 'text-blue-600'
                  }`}>{stat.value}</span>
                  <span className="text-xs text-gray-500">{stat.unit}</span>
                </div>
                {stat.progress !== undefined && (
                  <div className="mt-1 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reward Stats Cards */}
        <div className="p-4 space-y-4">
          <div className="text-sm font-medium text-gray-800">本月奖励统计</div>
          {rewardStats.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  sectionIndex === 0 ? 'bg-blue-100' :
                  sectionIndex === 1 ? 'bg-purple-100' : 'bg-green-100'
                }`}>
                  {sectionIndex === 0 ? (
                    <FileText className="w-4 h-4 text-blue-600" />
                  ) : sectionIndex === 1 ? (
                    <Briefcase className="w-4 h-4 text-purple-600" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-800">{section.title}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="text-center">
                    <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                    <div className="text-lg font-bold text-gray-800">{item.value}</div>
                    <div className="text-xs text-gray-400">{item.unit}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (sectionIndex === 0) navigate('/wallet/valid-opportunity');
                      else if (sectionIndex === 1) navigate('/wallet/large-opportunity');
                      else navigate('/wallet/project-commission');
                    }}
                    className="flex-1 h-9 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <FileText className="w-4 h-4" />
                    查看列表
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sign Report Button */}
        <div className="px-4">
          <button
            onClick={() => navigate('/wallet/sign-report')}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
          >
            <Clock className="w-5 h-5" />
            签报列表
          </button>
        </div>

        {/* Region List */}
        <div className="mt-4 p-4">
          <div className="text-sm font-medium text-gray-800 mb-3">各区域奖金池</div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            {regionData.map((region, index) => (
              <div key={index} className="flex items-center py-2.5 border-b border-gray-50 last:border-0">
                <div
                  className="w-2.5 h-2.5 rounded-full mr-3"
                  style={{ backgroundColor: region.color }}
                />
                <span className="flex-1 text-sm text-gray-700">{region.name}</span>
                <span className="text-sm text-gray-500 mr-2">{region.value}%</span>
                <span className="text-xs text-gray-400">
                  {Math.round(totalPool * region.value / 100 / 10000)}万
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reward Description Link */}
        <div className="px-4 mt-4">
          <button className="text-sm text-blue-500 underline decoration-blue-500/30">
            ※奖励说明※
          </button>
        </div>
      </div>

      {/* City Picker Modal */}
      {cityPickerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-4 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-800">选择城市</span>
              <button onClick={() => setCityPickerOpen(false)} className="p-2">
                <span className="text-xl text-gray-400">×</span>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['宁波市', '杭州市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'].map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setCityPickerOpen(false);
                  }}
                  className={`h-10 rounded-xl text-sm ${
                    selectedCity === city
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCityPickerOpen(false)}
                className="flex-1 h-12 border border-gray-200 rounded-xl text-gray-700"
              >
                取消
              </button>
              <button
                onClick={() => setCityPickerOpen(false)}
                className="flex-1 h-12 bg-blue-500 text-white rounded-xl"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Picker Modal */}
      {datePickerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-800">选择月份</span>
              <button onClick={() => setDatePickerOpen(false)} className="p-2">
                <span className="text-xl text-gray-400">×</span>
              </button>
            </div>
            <div className="h-48 overflow-y-auto mb-4">
              {['2025-11', '2025-10', '2025-09', '2025-08', '2025-07'].map((month) => (
                <button
                  key={month}
                  onClick={() => {
                    setSelectedMonth(month);
                    setDatePickerOpen(false);
                  }}
                  className={`w-full h-12 text-left px-4 rounded-xl mb-1 ${
                    selectedMonth === month
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDatePickerOpen(false)}
                className="flex-1 h-12 border border-gray-200 rounded-xl text-gray-700"
              >
                取消
              </button>
              <button
                onClick={() => setDatePickerOpen(false)}
                className="flex-1 h-12 bg-blue-500 text-white rounded-xl"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
