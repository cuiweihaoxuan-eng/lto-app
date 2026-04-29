import { useState } from 'react';
import { ChevronLeft, Search, Filter, Eye, Star, StarOff, FileText, Clock, User, MapPin, DollarSign, X, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { LinkOpportunityDialog } from './LinkOpportunityDialog';

interface BusinessInfo {
  id: string;
  code: string;
  projectCode: string;
  projectName: string;
  distributeTime: string;
  city: string;
  district: string;
  status: 'unprocessed' | 'converted' | 'linked' | 'returned';
  currentStep: string;
  currentRole: string;
  currentOperators: string[];
  accountManager: string;
  linkedOpportunityCode?: string;
  opportunityName?: string;
  linkedTime?: string;
  dataType: string;
  amount?: number;
  bidPublishTime?: string;
  bidOpenTime?: string;
  bidDeadline?: string;
  bidWinTime?: string;
  bidUnit: string;
  enterpriseName: string;
  bidWinner?: string;
  operatorTag: string;
  projectType: string;
  controlDept: string;
  areaGroup: string;
  attachments: number;
  isFavorite: boolean;
}

interface Opportunity {
  id: string;
  code: string;
  name: string;
  customerName: string;
  customerCode: string;
  amount: number;
  createTime: string;
  accountManager: string;
  accountManagerPhone: string;
  hasLinkedInfo: boolean; // 是否关联其他商情
}

const mockBusinessInfos: BusinessInfo[] = [
  {
    id: '1',
    code: 'SQ202604090001',
    projectCode: 'PRJ20260409001',
    projectName: '宁波市政府弱电系统改造项目',
    distributeTime: '2026-04-08 10:30',
    city: '宁波市',
    district: '镇海区',
    status: 'unprocessed',
    currentStep: '派单给商机管理员',
    currentRole: '地市管理员',
    currentOperators: ['张经理', '李经理'],
    accountManager: '王经理',
    dataType: '招标',
    amount: 850,
    bidPublishTime: '2026-04-05',
    bidOpenTime: '2026-04-20',
    bidDeadline: '2026-04-18',
    bidUnit: '宁波市政府',
    enterpriseName: '宁波市政府办公室',
    operatorTag: '电信',
    projectType: '弱电系统',
    controlDept: '政企部',
    areaGroup: '浙江-宁波',
    attachments: 3,
    isFavorite: true,
  },
  {
    id: '2',
    code: 'SQ202604090002',
    projectCode: 'PRJ20260409002',
    projectName: '江北区智慧园区建设项目',
    distributeTime: '2026-04-08 09:15',
    city: '宁波市',
    district: '江北区',
    status: 'converted',
    currentStep: '转商机',
    currentRole: '客户经理',
    currentOperators: ['赵经理'],
    accountManager: '赵经理',
    linkedOpportunityCode: 'OPP20260409001',
    opportunityName: '江北区智慧园区建设',
    linkedTime: '2026-04-09 10:00',
    dataType: '中标',
    amount: 1200,
    bidPublishTime: '2026-03-25',
    bidWinTime: '2026-04-08',
    bidUnit: '江北区科技局',
    enterpriseName: '江北区科技园',
    bidWinner: '浙江电信',
    operatorTag: '电信',
    projectType: '智慧园区',
    controlDept: '政企部',
    areaGroup: '浙江-宁波',
    attachments: 5,
    isFavorite: false,
  },
  {
    id: '3',
    code: 'SQ202604090003',
    projectCode: 'PRJ20260409003',
    projectName: '余姚市医院信息化系统升级',
    distributeTime: '2026-04-07 16:45',
    city: '宁波市',
    district: '余姚市',
    status: 'linked',
    currentStep: '已关联商机',
    currentRole: '区县管理员',
    currentOperators: ['孙经理', '周经理', '吴经理'],
    accountManager: '孙经理',
    linkedOpportunityCode: 'OPP20260408001',
    opportunityName: '余姚市医院信息化升级',
    linkedTime: '2026-04-08 14:30',
    dataType: '招标',
    amount: 650,
    bidPublishTime: '2026-04-01',
    bidDeadline: '2026-04-15',
    bidUnit: '余姚市人民医院',
    enterpriseName: '余姚市卫健局',
    operatorTag: '移动',
    projectType: '医疗信息化',
    controlDept: '行业部',
    areaGroup: '浙江-宁波',
    attachments: 2,
    isFavorite: true,
  },
];

const statusLabels = {
  unprocessed: '未处理',
  converted: '转商机',
  linked: '已关联',
  returned: '已退回',
};

const statusColors = {
  unprocessed: 'bg-orange-100 text-orange-700',
  converted: 'bg-blue-100 text-blue-700',
  linked: 'bg-green-100 text-green-700',
  returned: 'bg-gray-100 text-gray-700',
};

type FirstTabType = 'all' | 'unprocessed' | 'processed' | 'favorite';
type SecondTabType = 'myTask' | 'othersTask' | 'converted' | 'linked' | 'returned';

export function BusinessInfoList() {
  const navigate = useNavigate();
  const [activeFirstTab, setActiveFirstTab] = useState<FirstTabType>('all');
  const [activeSecondTab, setActiveSecondTab] = useState<SecondTabType>('myTask');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTab, setDetailTab] = useState<'info' | 'process'>('info');
  const [selectedInfo, setSelectedInfo] = useState<BusinessInfo | null>(null);
  const [businessInfos, setBusinessInfos] = useState<BusinessInfo[]>(mockBusinessInfos);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [linkOpportunityOpen, setLinkOpportunityOpen] = useState(false);
  
  // Filter states
  const [filterIndustryType, setFilterIndustryType] = useState('');
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterDept, setFilterDept] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterDataType, setFilterDataType] = useState('');
  const [filterOperatorTag, setFilterOperatorTag] = useState('');
  const [filterDistributeTimeStart, setFilterDistributeTimeStart] = useState('');
  const [filterDistributeTimeEnd, setFilterDistributeTimeEnd] = useState('');
  const [filterAmountMin, setFilterAmountMin] = useState('');
  const [filterAmountMax, setFilterAmountMax] = useState('');
  const [filterBidPublishTimeStart, setFilterBidPublishTimeStart] = useState('');
  const [filterBidPublishTimeEnd, setFilterBidPublishTimeEnd] = useState('');
  const [filterBidWinTimeStart, setFilterBidWinTimeStart] = useState('');
  const [filterBidWinTimeEnd, setFilterBidWinTimeEnd] = useState('');
  const [filterCurrentStep, setFilterCurrentStep] = useState('');
  const [filterCurrentRole, setFilterCurrentRole] = useState<string[]>([]);

  const firstTabs: { key: FirstTabType; label: string; count: number }[] = [
    { key: 'all', label: '全部', count: 3 },
    { key: 'unprocessed', label: '未处理', count: 1 },
    { key: 'processed', label: '已处理', count: 2 },
    { key: 'favorite', label: '我关注的', count: 2 },
  ];

  const getSecondTabs = (): { key: SecondTabType; label: string }[] => {
    switch (activeFirstTab) {
      case 'unprocessed':
        return [
          { key: 'myTask', label: '待我处理' },
          { key: 'othersTask', label: '他人处理' },
        ];
      case 'processed':
        return [
          { key: 'converted', label: '已转商机' },
          { key: 'linked', label: '已关联商机' },
          { key: 'returned', label: '已回退集团' },
        ];
      default:
        return [
          { key: 'myTask', label: '未处理（待我处理）' },
          { key: 'othersTask', label: '未处理（他人处理）' },
          { key: 'converted', label: '转商机' },
          { key: 'linked', label: '已关联商机' },
          { key: 'returned', label: '已回退集团' },
        ];
    }
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBusinessInfos(
      businessInfos.map((info) =>
        info.id === id ? { ...info, isFavorite: !info.isFavorite } : info
      )
    );
  };

  const handleViewDetail = (info: BusinessInfo) => {
    setSelectedInfo(info);
    setDetailTab('info');
    setDetailOpen(true);
  };

  const handleViewProcess = (info: BusinessInfo, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedInfo(info);
    setDetailTab('process');
    setDetailOpen(true);
  };

  const handleToggleExpand = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSearch = () => {
    console.log('搜索关键词:', searchKeyword);
    alert('查询按钮已点击，搜索关键词: ' + searchKeyword);
    // 这里可以添加搜索逻辑
    setSearchOpen(false);
  };

  const handleReset = () => {
    console.log('重置按钮已点击');
    alert('重置按钮已点击');
    setSearchKeyword('');
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
          <h1 className="text-lg font-medium text-gray-900 flex-1">商情管理</h1>
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

        {/* First Level Tabs */}
        <div className="flex border-b">
          {firstTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveFirstTab(tab.key);
                setActiveSecondTab(getSecondTabs()[0].key);
              }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeFirstTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              {tab.label}
              <span
                className={`ml-1 ${activeFirstTab === tab.key ? 'text-blue-600' : 'text-gray-400'}`}
              >
                ({tab.count})
              </span>
            </button>
          ))}
        </div>

        {/* Second Level Tabs */}
        <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide">
          {getSecondTabs().map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSecondTab(tab.key)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                activeSecondTab === tab.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Panel */}
      {searchOpen && (
        <div className="bg-white border-b p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="请输入商情编号、项目名称、项目编码、招标单位"
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
              {/* 行业类型 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  行业类型
                </label>
                <select
                  value={filterIndustryType}
                  onChange={(e) => setFilterIndustryType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">请选择</option>
                  <option value="政府">政府</option>
                  <option value="医疗">医疗</option>
                  <option value="教育">教育</option>
                  <option value="企业">企业</option>
                  <option value="其他">其他</option>
                </select>
              </div>

              {/* 商情状态 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  商情状态
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'unprocessed', label: '未处理' },
                    { value: 'converted', label: '转商机' },
                    { value: 'linked', label: '已关联' },
                    { value: 'returned', label: '已退回' },
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

              {/* 管控部门 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  管控部门
                </label>
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">请选择</option>
                  <option value="政企部">政企部</option>
                  <option value="行业部">行业部</option>
                  <option value="集团部">集团部</option>
                </select>
              </div>

              {/* 商情区域 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  商情区域
                </label>
                <input
                  type="text"
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  placeholder="请输入区域"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              {/* 数据类型 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  数据类型
                </label>
                <select
                  value={filterDataType}
                  onChange={(e) => setFilterDataType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">请选择</option>
                  <option value="招标">招标</option>
                  <option value="中标">中标</option>
                </select>
              </div>

              {/* 运营商标签 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  运营商标签
                </label>
                <select
                  value={filterOperatorTag}
                  onChange={(e) => setFilterOperatorTag(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">请选择</option>
                  <option value="电信">电信</option>
                  <option value="移动">移动</option>
                  <option value="联通">联通</option>
                </select>
              </div>

              {/* 集团派发时间 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  集团派发时间
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={filterDistributeTimeStart}
                    onChange={(e) => setFilterDistributeTimeStart(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <div className="text-center text-xs text-gray-500">至</div>
                  <input
                    type="date"
                    value={filterDistributeTimeEnd}
                    onChange={(e) => setFilterDistributeTimeEnd(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* 招标/中标金额 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  招标/中标金额（万元）
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={filterAmountMin}
                    onChange={(e) => setFilterAmountMin(e.target.value)}
                    placeholder="最小金额"
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={filterAmountMax}
                    onChange={(e) => setFilterAmountMax(e.target.value)}
                    placeholder="最大金额"
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* 招标发布时间 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  招标发布时间
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={filterBidPublishTimeStart}
                    onChange={(e) => setFilterBidPublishTimeStart(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <div className="text-center text-xs text-gray-500">至</div>
                  <input
                    type="date"
                    value={filterBidPublishTimeEnd}
                    onChange={(e) => setFilterBidPublishTimeEnd(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* 中标时间 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  中标时间
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={filterBidWinTimeStart}
                    onChange={(e) => setFilterBidWinTimeStart(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <div className="text-center text-xs text-gray-500">至</div>
                  <input
                    type="date"
                    value={filterBidWinTimeEnd}
                    onChange={(e) => setFilterBidWinTimeEnd(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* 当前操作步骤 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  当前操作步骤
                </label>
                <input
                  type="text"
                  value={filterCurrentStep}
                  onChange={(e) => setFilterCurrentStep(e.target.value)}
                  placeholder="请输入操作步骤"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              {/* 当前操作角色 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  当前操作角色
                </label>
                <div className="space-y-2">
                  {[
                    { value: '省管理员', label: '省管理员' },
                    { value: '地市管理员', label: '地市管理员' },
                    { value: '区县管理员', label: '区县管理员' },
                    { value: '客户经理', label: '客户经理' },
                  ].map((role) => (
                    <label key={role.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filterCurrentRole.includes(role.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterCurrentRole([...filterCurrentRole, role.value]);
                          } else {
                            setFilterCurrentRole(filterCurrentRole.filter((r) => r !== role.value));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">{role.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFilterIndustryType('');
                    setFilterStatus([]);
                    setFilterDept('');
                    setFilterRegion('');
                    setFilterDataType('');
                    setFilterOperatorTag('');
                    setFilterDistributeTimeStart('');
                    setFilterDistributeTimeEnd('');
                    setFilterAmountMin('');
                    setFilterAmountMax('');
                    setFilterBidPublishTimeStart('');
                    setFilterBidPublishTimeEnd('');
                    setFilterBidWinTimeStart('');
                    setFilterBidWinTimeEnd('');
                    setFilterCurrentStep('');
                    setFilterCurrentRole([]);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  重置
                </button>
                <button
                  onClick={() => {
                    console.log('应用筛选条件');
                    alert('筛选条件已应用');
                    setFilterOpen(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Business Info List */}
      <div className="p-4 space-y-4">
        {businessInfos.map((info) => (
          <div
            key={info.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            {/* Header with Title and Status */}
            <div className="p-4 border-b">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900 leading-snug mb-2">
                    {info.projectName}
                  </h3>
                  {/* Tags Row */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                      {info.city}
                    </span>
                    <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded">
                      {info.district}
                    </span>
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded">
                      {info.accountManager}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded ${statusColors[info.status]}`}>
                    {statusLabels[info.status]}
                  </span>
                  <button onClick={(e) => handleToggleFavorite(info.id, e)}>
                    {info.isFavorite ? (
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <StarOff className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs text-gray-600">
                  <span className="text-gray-900">{info.projectCode}</span>
                  <span className="text-gray-500 ml-1">({info.code})</span>
                </div>
                <div className="text-xs text-gray-600">
                  <span className="text-gray-500">集团派发时间：</span>
                  <span className="text-gray-900">{info.distributeTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600">
                    <span className="text-gray-500">当前步骤：</span>
                    <button
                      onClick={(e) => handleViewProcess(info, e)}
                      className="text-xs text-blue-600 underline"
                    >
                      {info.currentStep} → {info.currentRole}
                    </button>
                  </div>
                  <button
                    onClick={() => handleToggleExpand(info.id)}
                    className="text-gray-500 hover:text-gray-700 p-1"
                  >
                    {expandedCards[info.id] ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {info.linkedOpportunityCode && (
                  <div className="text-xs text-gray-600">
                    <span className="text-gray-500">关联商机：</span>
                    <span className="text-blue-600">{info.opportunityName}-{info.linkedOpportunityCode}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Business Detail Section - Collapsible */}
            {expandedCards[info.id] && (
              <div className="border-b bg-gray-50 px-4 py-3">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  <div className="text-gray-600">
                    <span className="text-gray-500">数据类型：</span>{info.dataType}
                  </div>
                  {info.amount && (
                    <div className="text-gray-600">
                      <span className="text-gray-500">金额：</span>
                      <span className="text-orange-600 font-medium">{info.amount}万</span>
                    </div>
                  )}
                  {info.bidPublishTime && (
                    <div className="text-gray-600">
                      <span className="text-gray-500">发布：</span>{info.bidPublishTime}
                    </div>
                  )}
                  {info.bidOpenTime && (
                    <div className="text-gray-600">
                      <span className="text-gray-500">开标：</span>{info.bidOpenTime}
                    </div>
                  )}
                  {info.bidDeadline && (
                    <div className="text-gray-600">
                      <span className="text-gray-500">截至：</span>{info.bidDeadline}
                    </div>
                  )}
                  {info.bidWinTime && (
                    <div className="text-gray-600">
                      <span className="text-gray-500">中标：</span>{info.bidWinTime}
                    </div>
                  )}
                  <div className="text-gray-600 col-span-2">
                    <span className="text-gray-500">招标单位：</span>{info.bidUnit}
                  </div>
                  {info.bidWinner && (
                    <div className="text-gray-600 col-span-2">
                      <span className="text-gray-500">中标单位：</span>{info.bidWinner}
                    </div>
                  )}
                  <div className="text-gray-600">
                    <span className="text-gray-500">运营商：</span>{info.operatorTag}
                  </div>
                  <div className="text-gray-600">
                    <span className="text-gray-500">项目类型：</span>{info.projectType}
                  </div>
                  <div className="text-gray-600">
                    <span className="text-gray-500">管控部门：</span>{info.controlDept}
                  </div>
                  <div className="text-gray-600">
                    <span className="text-gray-500">附件：</span>{info.attachments} 个
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="p-3 overflow-x-auto">
              <div className="flex gap-2">
                {info.status === 'unprocessed' && (
                  <>
                    <button
                      onClick={() => setLinkOpportunityOpen(true)}
                      className="px-3 py-1.5 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-50 whitespace-nowrap flex-shrink-0"
                    >
                      关联商机
                    </button>
                    <button
                      className="px-3 py-1.5 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-50 whitespace-nowrap flex-shrink-0"
                    >
                      创建商机
                    </button>
                    <button
                      className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50 whitespace-nowrap flex-shrink-0"
                    >
                      回退集团
                    </button>
                    <button
                      className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50 whitespace-nowrap flex-shrink-0"
                    >
                      取回
                    </button>
                    <button
                      className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50 whitespace-nowrap flex-shrink-0"
                    >
                      回退驳回
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleViewDetail(info)}
                  className="px-3 py-1.5 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-50 whitespace-nowrap flex-shrink-0"
                >
                  详情
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Dialog - Full Screen */}
      {detailOpen && selectedInfo && (
        <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b px-4 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 flex-1">
              <button 
                onClick={() => setDetailOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-medium text-gray-900">{selectedInfo.dataType}商情详情</h2>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b bg-white shadow-sm">
            <button
              onClick={() => setDetailTab('info')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                detailTab === 'info'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              商情详情
            </button>
            <button
              onClick={() => setDetailTab('process')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                detailTab === 'process'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              流转流程
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {detailTab === 'info' ? (
              <div className="p-4 space-y-4">
                {/* Basic Info Section */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3 pb-2 border-b">
                    基本信息
                  </h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <div>
                      <span className="text-gray-500 block mb-1">商情编号</span>
                      <div className="text-gray-900">{selectedInfo.code}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">招标所属区域</span>
                      <div className="text-gray-900">{selectedInfo.areaGroup}</div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 block mb-1">商情名称</span>
                      <div className="text-gray-900">{selectedInfo.projectName}</div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 block mb-1">招标单位</span>
                      <div className="text-gray-900">{selectedInfo.bidUnit}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">招标/中标金额(万)</span>
                      <div className="text-orange-600 font-medium">
                        {selectedInfo.amount || '-'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">中标单位</span>
                      <div className="text-gray-900">{selectedInfo.bidWinner || '-'}</div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 block mb-1">项目名称</span>
                      <div className="text-gray-900">{selectedInfo.projectName}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">开始招标时间</span>
                      <div className="text-gray-900">{selectedInfo.bidOpenTime || '-'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">招标截至时间</span>
                      <div className="text-gray-900">{selectedInfo.bidDeadline || '-'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">招标行政市</span>
                      <div className="text-gray-900">{selectedInfo.city}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">招标区县</span>
                      <div className="text-gray-900">{selectedInfo.district}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">中标时间</span>
                      <div className="text-gray-900">{selectedInfo.bidWinTime || '-'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">运营商标签</span>
                      <div className="text-gray-900">{selectedInfo.operatorTag}</div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 block mb-1">项目编码</span>
                      <div className="text-gray-900">{selectedInfo.projectCode}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">项目类型</span>
                      <div className="text-gray-900">{selectedInfo.projectType}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">管控部门</span>
                      <div className="text-gray-900">{selectedInfo.controlDept}</div>
                    </div>
                  </div>
                </div>

                {/* Customer Category */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3 pb-2 border-b">
                    客户归类
                  </h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <div>
                      <span className="text-gray-500 block mb-1">一级行业</span>
                      <div className="text-gray-900">其他</div>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">二级行业</span>
                      <div className="text-gray-900">其他</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4">
                {/* Process Timeline */}
                <div className="space-y-3">
                  {/* Process Item 1 */}
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-2 bg-blue-50 border-b">
                      <div className="text-xs text-gray-600">2026-04-08 04:32:12</div>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                      <div className="flex text-sm">
                        <span className="text-gray-500 w-20 flex-shrink-0">操作人</span>
                        <span className="text-gray-900 flex-1">-</span>
                      </div>
                      <div className="flex text-sm">
                        <span className="text-gray-500 w-20 flex-shrink-0">执行操作</span>
                        <span className="text-gray-900 flex-1">商情自动派单</span>
                      </div>
                      <div className="flex text-sm">
                        <span className="text-gray-500 w-20 flex-shrink-0">操作内容</span>
                        <span className="text-gray-900 flex-1">商情自动派单</span>
                      </div>
                      <div className="flex text-sm">
                        <span className="text-gray-500 w-20 flex-shrink-0">接收人</span>
                        <span className="text-gray-900 flex-1">-</span>
                      </div>
                    </div>
                  </div>

                  {/* Process Item 2 */}
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-2 bg-blue-50 border-b">
                      <div className="text-xs text-gray-600">2026-04-08 06:50:01</div>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                      <div className="flex text-sm">
                        <span className="text-gray-500 w-20 flex-shrink-0">操作人</span>
                        <span className="text-gray-900 flex-1">吴琼</span>
                      </div>
                      <div className="flex text-sm">
                        <span className="text-gray-500 w-20 flex-shrink-0">执行操作</span>
                        <span className="text-gray-900 flex-1">派单给客户经理</span>
                      </div>
                      <div className="flex text-sm">
                        <span className="text-gray-500 w-20 flex-shrink-0">操作内容</span>
                        <span className="text-gray-900 flex-1">吴琼 派单给客户经理</span>
                      </div>
                      <div className="flex text-sm">
                        <span className="text-gray-500 w-20 flex-shrink-0">接收人</span>
                        <span className="text-gray-900 flex-1">周吉</span>
                      </div>
                    </div>
                  </div>

                  {/* Process Item 3 */}
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-2 bg-blue-50 border-b">
                      <div className="text-xs text-gray-600">2026-04-08 15:54:07</div>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                      <div className="flex text-sm">
                        <span className="text-gray-500 w-20 flex-shrink-0">操作人</span>
                        <span className="text-gray-900 flex-1">王帅</span>
                      </div>
                      <div className="flex text-sm">
                        <span className="text-gray-500 w-20 flex-shrink-0">执行操作</span>
                        <span className="text-gray-900 flex-1">取回商情</span>
                      </div>
                      <div className="flex text-sm">
                        <span className="text-gray-500 w-20 flex-shrink-0">操作内容</span>
                        <span className="text-gray-900 flex-1">王帅 取回商情</span>
                      </div>
                      <div className="flex text-sm">
                        <span className="text-gray-500 w-20 flex-shrink-0">接收人</span>
                        <span className="text-gray-900 flex-1">王帅</span>
                      </div>
                    </div>
                  </div>

                  {/* Process Item 4 */}
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-2 bg-blue-50 border-b">
                      <div className="text-xs text-gray-600">2026-04-08 15:54:20</div>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                      <div className="flex text-sm">
                        <span className="text-gray-500 w-20 flex-shrink-0">操作人</span>
                        <span className="text-gray-900 flex-1">王帅</span>
                      </div>
                      <div className="flex text-sm">
                        <span className="text-gray-500 w-20 flex-shrink-0">执行操作</span>
                        <span className="text-gray-900 flex-1">回退商情</span>
                      </div>
                      <div className="flex text-sm">
                        <span className="text-gray-500 w-20 flex-shrink-0">操作内容</span>
                        <span className="text-gray-900 flex-1">王帅 回退商情</span>
                      </div>
                      <div className="flex text-sm">
                        <span className="text-gray-500 w-20 flex-shrink-0">接收人</span>
                        <span className="text-gray-900 flex-1">彭雨微 赵丹平 吴琼 吴琼 昊琳</span>
                      </div>
                      <div className="flex text-sm">
                        <span className="text-gray-500 w-20 flex-shrink-0">回退原因</span>
                        <span className="text-gray-900 flex-1">非本区域商情</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-white border-t p-4 shadow-lg">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setDetailOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                返回
              </button>
              {selectedInfo.status === 'unprocessed' && (
                <>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    关联商机
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    创建商机
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    回退集团
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    取回
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    回退驳回
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Link Opportunity Dialog */}
      {linkOpportunityOpen && selectedInfo && (
        <LinkOpportunityDialog
          open={linkOpportunityOpen}
          onClose={() => setLinkOpportunityOpen(false)}
          businessInfo={selectedInfo}
        />
      )}
    </div>
  );
}