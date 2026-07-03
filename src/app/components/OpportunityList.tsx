import { useState } from 'react';
import { ChevronLeft, Search, Filter, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Checkbox } from './ui/checkbox';

interface Opportunity {
  id: string;
  name: string;
  code: string;
  status: '跟进中' | '已签约' | '已失效' | '已关闭';
  city: string;
  district: string;
  accountManager: string;
  amount: number;
  stage: string;
  enterpriseName: string;
  createTime: string;
  contractName: string;
  contractCode: string;
  projectName: string;
  projectCode: string;
}

export const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    name: '宁波市政府弱电系统改造项目',
    code: 'OPP20260409001',
    status: '跟进中',
    city: '宁波市',
    district: '镇海区',
    accountManager: '王经理',
    amount: 850,
    stage: '方案报价',
    enterpriseName: '宁波市政府办公室',
    createTime: '2026-04-08 10:30',
    contractName: '宁波市政府弱电系统改造合同',
    contractCode: 'CTR20260409001',
    projectName: '宁波市政府弱电改造项目',
    projectCode: 'PRJ20260409001',
  },
  {
    id: '2',
    name: '江北区智慧园区建设项目',
    code: 'OPP20260409002',
    status: '已签约',
    city: '宁波市',
    district: '江北区',
    accountManager: '赵经理',
    amount: 1200,
    stage: '合同签订',
    enterpriseName: '江北区科技园',
    createTime: '2026-04-09 09:15',
    contractName: '江北区智慧园区建设合同',
    contractCode: 'CTR20260409002',
    projectName: '江北区智慧园区建设',
    projectCode: 'PRJ20260409002',
  },
  {
    id: '3',
    name: '余姚市医院信息化系统升级',
    code: 'OPP20260408001',
    status: '跟进中',
    city: '宁波市',
    district: '余姚市',
    accountManager: '孙经理',
    amount: 650,
    stage: '需求调研',
    enterpriseName: '余姚市卫健局',
    createTime: '2026-04-07 16:45',
    contractName: '余姚市医院信息化升级合同',
    contractCode: 'CTR20260408001',
    projectName: '余姚市医院信息化升级',
    projectCode: 'PRJ20260408001',
  },
  {
    id: '4',
    name: '鄞州区教育云平台建设项目',
    code: 'OPP20260407001',
    status: '已失效',
    city: '宁波市',
    district: '鄞州区',
    accountManager: '周经理',
    amount: 420,
    stage: '需求终止',
    enterpriseName: '鄞州区教育局',
    createTime: '2026-04-06 11:20',
    contractName: '鄞州教育云平台建设合同',
    contractCode: 'CTR20260407001',
    projectName: '鄞州教育云平台建设',
    projectCode: 'PRJ20260407001',
  },
  {
    id: '5',
    name: '北仑区智慧交通系统项目',
    code: 'OPP20260406001',
    status: '已关闭',
    city: '宁波市',
    district: '北仑区',
    accountManager: '吴经理',
    amount: 980,
    stage: '项目终止',
    enterpriseName: '北仑区交通局',
    createTime: '2026-04-05 14:00',
    contractName: '北仑智慧交通系统合同',
    contractCode: 'CTR20260406001',
    projectName: '北仑智慧交通系统',
    projectCode: 'PRJ20260406001',
  },
];

const statusColors: Record<Opportunity['status'], string> = {
  '跟进中': 'bg-blue-100 text-blue-700',
  '已签约': 'bg-green-100 text-green-700',
  '已失效': 'bg-orange-100 text-orange-700',
  '已关闭': 'bg-gray-100 text-gray-700',
};

type TabType = '我发起的' | '我支撑的' | '我管理的';

export function OpportunityList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('我发起的');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // Filter states
  const [filterAccountManager, setFilterAccountManager] = useState('');
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterRegion, setFilterRegion] = useState('');
  const [filterCreateTimeStart, setFilterCreateTimeStart] = useState('');
  const [filterCreateTimeEnd, setFilterCreateTimeEnd] = useState('');

  const tabs: TabType[] = ['我发起的', '我支撑的', '我管理的'];

  const handleSearch = () => {
    console.log('搜索关键词:', searchKeyword);
    setSearchOpen(false);
  };

  const handleReset = () => {
    setSearchKeyword('');
  };

  const handleToggleExpand = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        {/* 标题栏 */}
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium text-gray-900 flex-1 text-center mr-6">商机列表</h1>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`p-2 rounded-xl transition-colors ${searchOpen ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <span className="relative z-10">{tab}</span>
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* 搜索框和筛选按钮 */}
        {searchOpen && (
          <div className="px-4 pt-2 pb-3 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="请输入商机名称、商机编码、客户名称"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm transition-colors flex-shrink-0 ${
                filterOpen ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filter Sidebar */}
      {filterOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setFilterOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 flex flex-col shadow-xl">
            {/* Header */}
            <div className="px-4 py-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">筛选条件</h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* 客户经理 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  客户经理
                </label>
                <Select value={filterAccountManager} onValueChange={setFilterAccountManager}>
                  <SelectTrigger className="w-full bg-gray-100 rounded-xl text-sm">
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="王经理">王经理</SelectItem>
                    <SelectItem value="赵经理">赵经理</SelectItem>
                    <SelectItem value="孙经理">孙经理</SelectItem>
                    <SelectItem value="周经理">周经理</SelectItem>
                    <SelectItem value="吴经理">吴经理</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 商机状态 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  商机状态
                </label>
                <div className="space-y-2">
                  {[
                    { value: '跟进中', label: '跟进中' },
                    { value: '已签约', label: '已签约' },
                    { value: '已失效', label: '已失效' },
                    { value: '已关闭', label: '已关闭' },
                  ].map((status) => (
                    <label key={status.value} className="flex items-center gap-2">
                      <Checkbox
                        checked={filterStatus.includes(status.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilterStatus([...filterStatus, status.value]);
                          } else {
                            setFilterStatus(filterStatus.filter((s) => s !== status.value));
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{status.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 商机区域 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  商机区域
                </label>
                <Input
                  type="text"
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  placeholder="请输入区域"
                  className="w-full bg-gray-100 rounded-xl text-sm"
                />
              </div>

              {/* 创建时间 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  创建时间
                </label>
                <div className="space-y-2">
                  <Input
                    type="date"
                    value={filterCreateTimeStart}
                    onChange={(e) => setFilterCreateTimeStart(e.target.value)}
                    className="w-full"
                  />
                  <div className="text-center text-xs text-gray-500">至</div>
                  <Input
                    type="date"
                    value={filterCreateTimeEnd}
                    onChange={(e) => setFilterCreateTimeEnd(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFilterAccountManager('');
                    setFilterStatus([]);
                    setFilterRegion('');
                    setFilterCreateTimeStart('');
                    setFilterCreateTimeEnd('');
                  }}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl text-sm"
                >
                  重置
                </button>
                <button
                  onClick={() => {
                    console.log('应用筛选条件');
                    setFilterOpen(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Opportunity List */}
      <div className="p-4 space-y-4">
        {mockOpportunities.map((opp) => (
          <div
            key={opp.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            {/* Header with Title and Status */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900 leading-snug">
                    {opp.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{opp.code}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${statusColors[opp.status]}`}>
                  {opp.status}
                </span>
              </div>

              {/* Tags Row */}
              <div className="flex items-center gap-2 flex-wrap mt-3">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                  {opp.city} {opp.district}
                </span>
                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded">
                  {opp.accountManager}
                </span>
                <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded">
                  {opp.amount}万
                </span>
                <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded">
                  {opp.stage}
                </span>
              </div>

              {/* Bottom Info Row */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-600 truncate">
                    <span className="text-gray-500">客户：</span>
                    <span className="text-gray-900">{opp.enterpriseName}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    <span className="text-gray-500">创建时间：</span>
                    <span className="text-gray-900">{opp.createTime}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleExpand(opp.id)}
                  className="text-gray-500 hover:text-gray-700 p-1 flex-shrink-0"
                >
                  {expandedCards[opp.id] ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Collapsed Detail Section */}
            {expandedCards[opp.id] && (
              <div className="border-t bg-gray-50 px-4 py-3">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  <div className="text-gray-600 col-span-2">
                    <span className="text-gray-500">合同名称：</span>
                    <span className="text-gray-900">{opp.contractName}</span>
                  </div>
                  <div className="text-gray-600 col-span-2">
                    <span className="text-gray-500">合同编码：</span>
                    <span className="text-gray-900">{opp.contractCode}</span>
                  </div>
                  <div className="text-gray-600 col-span-2">
                    <span className="text-gray-500">项目名称：</span>
                    <span className="text-gray-900">{opp.projectName}</span>
                  </div>
                  <div className="text-gray-600 col-span-2">
                    <span className="text-gray-500">项目编码：</span>
                    <span className="text-gray-900">{opp.projectCode}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="px-4 py-3 border-t flex gap-2 overflow-x-auto">
              <button className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-xl whitespace-nowrap flex-shrink-0">
                详情
              </button>
              <button className="px-3 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-xl whitespace-nowrap flex-shrink-0">
                编辑
              </button>
              <button className="px-3 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-xl whitespace-nowrap flex-shrink-0">
                跟进
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
