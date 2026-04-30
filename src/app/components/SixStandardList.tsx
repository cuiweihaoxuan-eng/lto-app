import { useState } from 'react';
import { ChevronLeft, Search, Filter, X, ChevronUp, ChevronDown, CheckCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sheet, SheetContent } from './ui/sheet';
import { Button } from './ui/button';

interface SixStandardItem {
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
  sixCriteria: {
    客情掌握: { completed: number; total: number };
    方案总控: { completed: number; total: number };
    谈判应标自主: { completed: number; total: number };
    采购自主: { completed: number; total: number };
    项目强管控: { completed: number; total: number };
    运维自主: { completed: number; total: number };
  };
}

const mockSixStandardList: SixStandardItem[] = [
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
    contractName: '宁波市政府弱电改造合同',
    contractCode: 'CTR20260409001',
    projectName: '宁波市政府弱电改造项目',
    projectCode: 'PRJ20260409001',
    sixCriteria: {
      客情掌握: { completed: 2, total: 5 },
      方案总控: { completed: 4, total: 8 },
      谈判应标自主: { completed: 1, total: 5 },
      采购自主: { completed: 1, total: 7 },
      项目强管控: { completed: 1, total: 6 },
      运维自主: { completed: 0, total: 4 },
    },
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
    sixCriteria: {
      客情掌握: { completed: 5, total: 5 },
      方案总控: { completed: 8, total: 8 },
      谈判应标自主: { completed: 5, total: 5 },
      采购自主: { completed: 7, total: 7 },
      项目强管控: { completed: 6, total: 6 },
      运维自主: { completed: 4, total: 4 },
    },
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
    sixCriteria: {
      客情掌握: { completed: 1, total: 5 },
      方案总控: { completed: 2, total: 8 },
      谈判应标自主: { completed: 0, total: 5 },
      采购自主: { completed: 0, total: 7 },
      项目强管控: { completed: 0, total: 0 },
      运维自主: { completed: 0, total: 4 },
    },
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
    sixCriteria: {
      客情掌握: { completed: 3, total: 5 },
      方案总控: { completed: 5, total: 8 },
      谈判应标自主: { completed: 2, total: 0 },
      采购自主: { completed: 3, total: 7 },
      项目强管控: { completed: 0, total: 6 },
      运维自主: { completed: 1, total: 4 },
    },
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
    sixCriteria: {
      客情掌握: { completed: 4, total: 5 },
      方案总控: { completed: 6, total: 8 },
      谈判应标自主: { completed: 3, total: 5 },
      采购自主: { completed: 5, total: 7 },
      项目强管控: { completed: 4, total: 6 },
      运维自主: { completed: 2, total: 4 },
    },
  },
];

const statusColors: Record<SixStandardItem['status'], string> = {
  '跟进中': 'bg-blue-100 text-blue-700',
  '已签约': 'bg-green-100 text-green-700',
  '已失效': 'bg-orange-100 text-orange-700',
  '已关闭': 'bg-gray-100 text-gray-700',
};


const criteriaLabels: (keyof SixStandardItem['sixCriteria'])[] = [
  '客情掌握',
  '方案总控',
  '谈判应标自主',
  '采购自主',
  '项目强管控',
  '运维自主',
];

// ===== 六到位统计模块配置 =====
const statModules = [
  {
    id: 'm1',
    name: '客情掌握',
    categories: [
      { id: 'c1', name: '客户档案' },
      { id: 'c2', name: '拜访记录' },
      { id: 'c3', name: '录入商机' },
      { id: 'c4', name: '近三年信息化项目' },
      { id: 'c5', name: '其他' },
    ],
  },
  {
    id: 'm2',
    name: '方案总控',
    categories: [
      { id: 'c6', name: '组建团队' },
      { id: 'c7', name: '方案设计与审核' },
      { id: 'c8', name: '方案解构与中台把关' },
      { id: 'c9', name: '其他' },
    ],
  },
  {
    id: 'm3',
    name: '谈判/应标自主',
    categories: [
      { id: 'c10', name: '参标记录' },
      { id: 'c11', name: '应标结果记录' },
      { id: 'c12', name: '商务谈判' },
      { id: 'c13', name: '前向合同信息' },
      { id: 'c14', name: '其他' },
    ],
  },
  {
    id: 'm4',
    name: '采购自主',
    categories: [
      { id: 'c15', name: '标前决策会' },
      { id: 'c16', name: '业务解构' },
      { id: 'c17', name: '业务风险及合规审核' },
      { id: 'c18', name: '后向资料' },
      { id: 'c19', name: '其他' },
    ],
  },
  {
    id: 'm5',
    name: '项目强管控',
    categories: [
      { id: 'c20', name: '项目实施总体设计' },
      { id: 'c21', name: '变更记录' },
      { id: 'c22', name: '验收报告' },
      { id: 'c23', name: '项目实施文件' },
      { id: 'c24', name: '审计清单' },
      { id: 'c25', name: '其他' },
    ],
  },
  {
    id: 'm6',
    name: '运维自主',
    categories: [
      { id: 'c26', name: '数字资产平台' },
      { id: 'c27', name: '第一服务界面' },
      { id: 'c28', name: '售后其他资料' },
      { id: 'c29', name: '其他' },
    ],
  },
];

// ===== 统计表单数据 =====
interface StatFormData {
  [key: string]: string;
}

function StatsTab() {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeCategoryName, setActiveCategoryName] = useState('');
  const [formData, setFormData] = useState<StatFormData>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const toggleModule = (id: string) => {
    setExpandedModules((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const openCategory = (id: string, name: string) => {
    setActiveCategoryId(id);
    setActiveCategoryName(name);
  };

  const handleSave = () => {
    if (activeCategoryId) {
      setCompleted((prev) => ({ ...prev, [activeCategoryId]: true }));
    }
    setActiveCategoryId(null);
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const renderCategoryForm = () => {
    if (!activeCategoryId) return null;

    const isDone = !!completed[activeCategoryId];

    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{activeCategoryName}</span>
            {isDone && <CheckCircle className="w-4 h-4 text-green-500" />}
          </div>
          <button onClick={() => setActiveCategoryId(null)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isDone ? (
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-green-700">已完成录入</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4 space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  是否完成 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData[activeCategoryId] || ''}
                  onChange={(e) => handleChange(activeCategoryId, e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">请选择</option>
                  <option value="是">是</option>
                  <option value="否">否</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">备注说明</label>
                <textarea
                  placeholder="请输入备注说明"
                  value={formData[`${activeCategoryId}_remark`] || ''}
                  onChange={(e) => handleChange(`${activeCategoryId}_remark`, e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-white">
          <Button className="w-full" size="sm" onClick={handleSave}>
            {isDone ? '已保存' : '保存'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="p-4 space-y-3">
        {statModules.map((module) => {
          const isExpanded = expandedModules.includes(module.id);
          const moduleDoneCount = module.categories.filter((c) => completed[c.id]).length;
          const moduleTotal = module.categories.length;
          const allDone = moduleDoneCount === moduleTotal;

          return (
            <div key={module.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${allDone ? 'bg-green-500' : moduleDoneCount > 0 ? 'bg-orange-400' : 'bg-gray-300'}`} />
                  <span className="text-gray-900 font-medium text-sm">{module.name}</span>
                  <span className="text-xs text-gray-500">{moduleDoneCount}/{moduleTotal}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>

              {isExpanded && (
                <div className="border-t">
                  {module.categories.map((cat, idx) => {
                    const catDone = !!completed[cat.id];
                    return (
                      <div
                        key={cat.id}
                        className="border-b last:border-b-0 px-4 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                        onClick={() => openCategory(cat.id, cat.name)}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${catDone ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-sm text-gray-700">{cat.name}</span>
                          {catDone && <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Sheet open={!!activeCategoryId} onOpenChange={(open) => !open && setActiveCategoryId(null)}>
        <SheetContent side="bottom" className="h-[60vh] rounded-t-2xl p-0">
          {renderCategoryForm()}
        </SheetContent>
      </Sheet>
    </>
  );
}

export function SixStandardList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'list' | 'stats'>('list');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const [filterAccountManager, setFilterAccountManager] = useState('');
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterRegion, setFilterRegion] = useState('');
  const [filterCreateTimeStart, setFilterCreateTimeStart] = useState('');
  const [filterCreateTimeEnd, setFilterCreateTimeEnd] = useState('');
  const [filterContractName, setFilterContractName] = useState('');
  const [filterProjectName, setFilterProjectName] = useState('');

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

  const handleViewDetail = (id: string) => {
    navigate(`/six-standard/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium text-gray-900 flex-1">六到位详情</h1>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-gray-600 hover:text-gray-800"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="text-gray-600 hover:text-gray-800"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'list'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            六到位清单
          </button>
          <button
            onClick={() => navigate('/six-standard-statistics')}
            className="flex-1 py-3 text-sm font-medium transition-colors text-gray-600"
          >
            六到位统计
          </button>
        </div>
      </div>

      {/* Search Panel */}
      {searchOpen && (
        <div className="bg-white border-b p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="请输入商机名称、商机编码、客户名称"
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
            >
              重置
            </button>
            <button
              onClick={handleSearch}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              查询
            </button>
          </div>
        </div>
      )}

      {/* Filter Sidebar */}
      {filterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setFilterOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 flex flex-col shadow-xl">
            <div className="px-4 py-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">筛选条件</h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* 客户经理 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  客户经理
                </label>
                <select
                  value={filterAccountManager}
                  onChange={(e) => setFilterAccountManager(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">请选择</option>
                  <option value="王经理">王经理</option>
                  <option value="赵经理">赵经理</option>
                  <option value="孙经理">孙经理</option>
                  <option value="周经理">周经理</option>
                  <option value="吴经理">吴经理</option>
                </select>
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
                      <input
                        type="checkbox"
                        checked={filterStatus.includes(status.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterStatus([...filterStatus, status.value]);
                          } else {
                            setFilterStatus(filterStatus.filter((s) => s !== status.value));
                          }
                        }}
                        className="rounded"
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
                <input
                  type="text"
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  placeholder="请输入区域"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              {/* 合同名称 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  合同名称
                </label>
                <input
                  type="text"
                  value={filterContractName}
                  onChange={(e) => setFilterContractName(e.target.value)}
                  placeholder="请输入合同名称"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              {/* 项目名称 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  项目名称
                </label>
                <input
                  type="text"
                  value={filterProjectName}
                  onChange={(e) => setFilterProjectName(e.target.value)}
                  placeholder="请输入项目名称"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              {/* 创建时间 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  创建时间
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={filterCreateTimeStart}
                    onChange={(e) => setFilterCreateTimeStart(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <div className="text-center text-xs text-gray-500">至</div>
                  <input
                    type="date"
                    value={filterCreateTimeEnd}
                    onChange={(e) => setFilterCreateTimeEnd(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFilterAccountManager('');
                    setFilterStatus([]);
                    setFilterRegion('');
                    setFilterCreateTimeStart('');
                    setFilterCreateTimeEnd('');
                    setFilterContractName('');
                    setFilterProjectName('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  重置
                </button>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'list' ? (
      <>
      {/* Six Standard List */}
      <div className="p-4 space-y-4">
        {mockSixStandardList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{item.code}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${statusColors[item.status]}`}>
                  {item.status}
                </span>
              </div>

              {/* Tags Row */}
              <div className="flex items-center gap-2 flex-wrap mt-3">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                  {item.city} {item.district}
                </span>
                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded">
                  {item.accountManager}
                </span>
                <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded">
                  {item.amount}万
                </span>
                <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded">
                  {item.stage}
                </span>
              </div>

              {/* Six Criteria Tags */}
              <div className="flex items-center gap-2 flex-wrap mt-3">
                {criteriaLabels.map((key) => {
                  const { completed, total } = item.sixCriteria[key];
                  const isDone = completed === total && total > 0;
                  const isNotReached = total === 0;
                  return (
                    <span
                      key={key}
                      className={`px-2 py-0.5 text-xs rounded ${
                        isDone
                          ? 'bg-green-100 text-green-700'
                          : isNotReached
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {key} {completed}/{total}
                    </span>
                  );
                })}
              </div>

              {/* Bottom Info Row */}
              <div className="flex items-center justify-between mt-3">
                <div className="text-xs text-gray-600">
                  <span className="text-gray-500">创建时间：</span>
                  <span className="text-gray-900">{item.createTime}</span>
                </div>
                <button
                  onClick={() => handleToggleExpand(item.id)}
                  className="text-gray-500 hover:text-gray-700 p-1 flex-shrink-0"
                >
                  {expandedCards[item.id] ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Contract & Project Detail */}
            {expandedCards[item.id] && (
              <div className="border-t bg-gray-50 px-4 py-3 space-y-1">
                <div className="text-xs text-gray-600 truncate">
                  <span className="text-gray-500">合同：</span>
                  <span className="text-gray-900">{item.contractName}</span>
                  <span className="text-gray-400 ml-1">-{item.contractCode}</span>
                </div>
                <div className="text-xs text-gray-600 truncate">
                  <span className="text-gray-500">项目：</span>
                  <span className="text-gray-900">{item.projectName}</span>
                  <span className="text-gray-400 ml-1">-{item.projectCode}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="px-4 py-3 border-t flex gap-2 overflow-x-auto">
              <button
                onClick={() => handleViewDetail(item.id)}
                className="px-3 py-1.5 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-50 whitespace-nowrap flex-shrink-0"
              >
                查看详情
              </button>
            </div>
          </div>
        ))}
      </div>
      </>
      ) : (
      <StatsTab />
      )}
    </div>
  );
}
