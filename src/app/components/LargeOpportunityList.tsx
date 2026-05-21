import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MoreHorizontal, Search, FileText, Building2, User, Calendar, DollarSign, ChevronDown, X, Download, ClipboardCheck } from 'lucide-react';
import { Input } from './ui/input';

type TabType = 'all' | 'pending' | 'approved';

interface Opportunity {
  id: string;
  name: string;
  customer: string;
  manager: string;
  branch: string;
  signStatus: 'pending' | 'signed' | 'cancelled';
  amount: number;
  contractAmount: number;
  receivedAmount: number;
}

const mockData: Opportunity[] = [
  {
    id: '1',
    name: '宁波某医院信息化建设项目',
    customer: '宁波某医院',
    manager: '张三',
    branch: '镇海支局',
    signStatus: 'signed',
    amount: 500000,
    contractAmount: 480000,
    receivedAmount: 200000,
  },
  {
    id: '2',
    name: '某企业智慧园区项目',
    customer: '某企业',
    manager: '李四',
    branch: '鄞州支局',
    signStatus: 'pending',
    amount: 1200000,
    contractAmount: 0,
    receivedAmount: 0,
  },
  {
    id: '3',
    name: '某学校智慧校园项目',
    customer: '某学校',
    manager: '王五',
    branch: '北仑支局',
    signStatus: 'signed',
    amount: 350000,
    contractAmount: 350000,
    receivedAmount: 350000,
  },
];

export function LargeOpportunityList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [oppStatusOpen, setOppStatusOpen] = useState(false);
  const [signStatusOpen, setSignStatusOpen] = useState(false);
  const [rewardStatusOpen, setRewardStatusOpen] = useState(false);
  const [distributeRecordsOpen, setDistributeRecordsOpen] = useState(false);
  const [auditRecordsOpen, setAuditRecordsOpen] = useState(false);

  const filteredData = mockData.filter(item => {
    if (activeTab === 'pending') return item.signStatus === 'pending';
    if (activeTab === 'approved') return item.signStatus === 'signed';
    return true;
  }).filter(item =>
    item.name.includes(searchQuery) || item.customer.includes(searchQuery)
  );

  const getSignStatusTag = (status: Opportunity['signStatus']) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full">待发起签报</span>;
      case 'signed':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">已收款</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">已取消</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-3 flex items-center justify-between">
        <button onClick={() => navigate('/wallet')} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">大额商机</h1>
        <button className="p-2 -mr-2">
          <MoreHorizontal className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex">
          {(['all', 'pending', 'approved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-center text-sm font-medium transition-colors relative ${
                activeTab === tab ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {tab === 'all' ? '全量商机' : tab === 'pending' ? '待审核商机' : '已审核商机'}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-blue-600 rounded-full" style={{ width: '60%' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="p-4 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="商机名称or客户名称"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 pl-10 pr-4 bg-gray-50 text-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 pb-4 bg-white">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setOppStatusOpen(true)}
            className="h-9 px-4 bg-gray-50 rounded-xl text-sm text-gray-700 flex items-center gap-1 flex-shrink-0"
          >
            商机状态 <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSignStatusOpen(true)}
            className="h-9 px-4 bg-gray-50 rounded-xl text-sm text-gray-700 flex items-center gap-1 flex-shrink-0"
          >
            签报状态 <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => setRewardStatusOpen(true)}
            className="h-9 px-4 bg-gray-50 rounded-xl text-sm text-gray-700 flex items-center gap-1 flex-shrink-0"
          >
            奖励状态 <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="px-4 space-y-3">
        {filteredData.map((opp) => (
          <div key={opp.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-gray-800 text-sm truncate">{opp.name}</div>
                  {getSignStatusTag(opp.signStatus)}
                </div>
                <div className="mt-2 space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{opp.customer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span>客户经理：{opp.manager}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>支局：{opp.branch}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Info */}
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-xs text-gray-500">预估金额</div>
                <div className="text-sm font-medium text-gray-800">¥{(opp.amount / 10000).toFixed(0)}万</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">合同金额</div>
                <div className="text-sm font-medium text-gray-800">¥{(opp.contractAmount / 10000).toFixed(0)}万</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">已收款</div>
                <div className="text-sm font-medium text-blue-600">¥{(opp.receivedAmount / 10000).toFixed(0)}万</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
              <button
                onClick={() => setDistributeRecordsOpen(true)}
                className="h-8 px-3 bg-blue-50 text-blue-600 rounded-lg text-xs flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                发放记录
              </button>
              <button
                onClick={() => setAuditRecordsOpen(true)}
                className="h-8 px-3 bg-gray-50 text-gray-600 rounded-lg text-xs flex items-center gap-1"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                审核记录
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Opportunity Status Filter Modal */}
      {oppStatusOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setOppStatusOpen(false)}>
          <div className="w-full bg-white rounded-t-3xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-800">商机状态</span>
              <button onClick={() => setOppStatusOpen(false)} className="p-2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-2">
              {['全部', '待签约', '已签约', '已取消'].map((status) => (
                <button
                  key={status}
                  onClick={() => setOppStatusOpen(false)}
                  className="w-full h-12 text-left px-4 bg-gray-50 rounded-xl text-gray-700"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sign Status Filter Modal */}
      {signStatusOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setSignStatusOpen(false)}>
          <div className="w-full bg-white rounded-t-3xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-800">签报状态</span>
              <button onClick={() => setSignStatusOpen(false)} className="p-2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-2">
              {['全部', '待发起签报', '签报中', '已签报', '已取消'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSignStatusOpen(false)}
                  className="w-full h-12 text-left px-4 bg-gray-50 rounded-xl text-gray-700"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reward Status Filter Modal */}
      {rewardStatusOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setRewardStatusOpen(false)}>
          <div className="w-full bg-white rounded-t-3xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-800">奖励状态</span>
              <button onClick={() => setRewardStatusOpen(false)} className="p-2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-2">
              {['全部', '未发放', '部分发放', '已发放'].map((status) => (
                <button
                  key={status}
                  onClick={() => setRewardStatusOpen(false)}
                  className="w-full h-12 text-left px-4 bg-gray-50 rounded-xl text-gray-700"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Distribute Records Sheet */}
      {distributeRecordsOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setDistributeRecordsOpen(false)}>
          <div className="w-full bg-white rounded-t-3xl max-h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="text-lg font-medium text-gray-800">发放记录</span>
              <button onClick={() => setDistributeRecordsOpen(false)} className="p-2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">首付款发放</span>
                  <span className="text-sm text-green-600">+¥20,000</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">2025-10-28 10:30</div>
                <div className="text-xs text-gray-400">状态：已到账</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">尾款发放</span>
                  <span className="text-sm text-gray-500">待发放</span>
                </div>
                <div className="text-xs text-gray-500">预计到账：2025-12-30</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Records Sheet */}
      {auditRecordsOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setAuditRecordsOpen(false)}>
          <div className="w-full bg-white rounded-t-3xl max-h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="text-lg font-medium text-gray-800">审核记录</span>
              <button onClick={() => setAuditRecordsOpen(false)} className="p-2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">审核通过</span>
                  <span className="text-xs text-green-600">通过</span>
                </div>
                <div className="text-xs text-gray-500 mb-2">2025-10-25 14:30</div>
                <div className="text-xs text-gray-600">审核人：张三</div>
                <div className="text-xs text-gray-500 mt-1">符合大额商机奖励标准，审核通过。</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">提交审核</span>
                  <span className="text-xs text-gray-500">提交</span>
                </div>
                <div className="text-xs text-gray-500">2025-10-20 09:15</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
