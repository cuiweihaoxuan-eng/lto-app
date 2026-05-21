import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MoreHorizontal, Search, FileText, Building2, User, Calendar, DollarSign, ChevronDown, X, Check, AlertCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

type TabType = 'all' | 'pending' | 'approved';

interface Opportunity {
  id: string;
  name: string;
  customer: string;
  manager: string;
  branch: string;
  enterTime: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  reviewStatus: 'pending' | 'approved' | 'rejected';
}

const mockData: Opportunity[] = [
  {
    id: '1',
    name: '宁波某医院信息化建设项目',
    customer: '宁波某医院',
    manager: '张三',
    branch: '镇海支局',
    enterTime: '2025-10-15',
    amount: 500000,
    status: 'approved',
    reviewStatus: 'approved',
  },
  {
    id: '2',
    name: '某企业智慧园区项目',
    customer: '某企业',
    manager: '李四',
    branch: '鄞州支局',
    enterTime: '2025-10-20',
    amount: 1200000,
    status: 'approved',
    reviewStatus: 'pending',
  },
  {
    id: '3',
    name: '某学校智慧校园项目',
    customer: '某学校',
    manager: '王五',
    branch: '北仑支局',
    enterTime: '2025-10-22',
    amount: 350000,
    status: 'approved',
    reviewStatus: 'approved',
  },
];

export function ValidOpportunityList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [auditStatusOpen, setAuditStatusOpen] = useState(false);
  const [timeRangeOpen, setTimeRangeOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [auditRecordsOpen, setAuditRecordsOpen] = useState(false);

  const filteredData = mockData.filter(item => {
    if (activeTab === 'pending') return item.reviewStatus === 'pending';
    if (activeTab === 'approved') return item.reviewStatus !== 'pending';
    return true;
  }).filter(item =>
    item.name.includes(searchQuery) || item.customer.includes(searchQuery)
  );

  const getStatusTag = (status: Opportunity['reviewStatus']) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full">待审核</span>;
      case 'approved':
        return <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">审核通过</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">审核驳回</span>;
    }
  };

  const handleAudit = (opp: Opportunity) => {
    setSelectedOpp(opp);
    setAuditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-3 flex items-center justify-between">
        <button onClick={() => navigate('/wallet')} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">有效商机</h1>
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
            className="w-full"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 pb-4 bg-white">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setAuditStatusOpen(true)}
            className="h-9 px-4 bg-gray-50 rounded-xl text-sm text-gray-700 flex items-center gap-1 flex-shrink-0"
          >
            审核状态 <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTimeRangeOpen(true)}
            className="h-9 px-4 bg-gray-50 rounded-xl text-sm text-gray-700 flex items-center gap-1 flex-shrink-0"
          >
            时间范围 <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => setManagerOpen(true)}
            className="h-9 px-4 bg-gray-50 rounded-xl text-sm text-gray-700 flex items-center gap-1 flex-shrink-0"
          >
            客户经理 <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => setBranchOpen(true)}
            className="h-9 px-4 bg-gray-50 rounded-xl text-sm text-gray-700 flex items-center gap-1 flex-shrink-0"
          >
            支局 <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="px-4 space-y-3">
        {filteredData.map((opp) => (
          <div key={opp.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-gray-800 text-sm truncate">{opp.name}</div>
                  {getStatusTag(opp.reviewStatus)}
                </div>
                <div className="mt-2 space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{opp.customer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>录入时间：{opp.enterTime}</span>
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
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
              <div className="text-xs text-gray-400">
                预估金额：<span className="text-blue-600 font-medium">¥{(opp.amount / 10000).toFixed(0)}万</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setAuditRecordsOpen(true)}
                  className="h-8 px-3 bg-gray-50 text-gray-600 rounded-lg text-xs flex items-center gap-1"
                >
                  审核记录
                </button>
                {opp.reviewStatus === 'pending' && (
                  <button
                    onClick={() => handleAudit(opp)}
                    className="h-8 px-3 bg-green-500 text-white rounded-lg text-xs flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    审核
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Status Filter Modal */}
      {auditStatusOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setAuditStatusOpen(false)}>
          <div className="w-full bg-white rounded-t-3xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-800">审核状态</span>
              <button onClick={() => setAuditStatusOpen(false)} className="p-2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-2">
              {['全部', '待审核', '审核通过', '审核驳回'].map((status) => (
                <button
                  key={status}
                  onClick={() => setAuditStatusOpen(false)}
                  className="w-full h-12 text-left px-4 bg-gray-50 rounded-xl text-gray-700"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Time Range Filter Modal */}
      {timeRangeOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setTimeRangeOpen(false)}>
          <div className="w-full bg-white rounded-t-3xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-800">时间范围</span>
              <button onClick={() => setTimeRangeOpen(false)} className="p-2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-2">
              {['全部', '近一周', '近一月', '近三月'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRangeOpen(false)}
                  className="w-full h-12 text-left px-4 bg-gray-50 rounded-xl text-gray-700"
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Manager Filter Modal */}
      {managerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setManagerOpen(false)}>
          <div className="w-full bg-white rounded-t-3xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-800">客户经理</span>
              <button onClick={() => setManagerOpen(false)} className="p-2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-2">
              {['全部', '张三', '李四', '王五', '赵六'].map((manager) => (
                <button
                  key={manager}
                  onClick={() => setManagerOpen(false)}
                  className="w-full h-12 text-left px-4 bg-gray-50 rounded-xl text-gray-700"
                >
                  {manager}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Branch Filter Modal */}
      {branchOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setBranchOpen(false)}>
          <div className="w-full bg-white rounded-t-3xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-800">支局</span>
              <button onClick={() => setBranchOpen(false)} className="p-2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-2">
              {['全部', '镇海支局', '鄞州支局', '北仑支局', '江北支局', '海曙支局'].map((branch) => (
                <button
                  key={branch}
                  onClick={() => setBranchOpen(false)}
                  className="w-full h-12 text-left px-4 bg-gray-50 rounded-xl text-gray-700"
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Audit Dialog */}
      {auditDialogOpen && selectedOpp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-4 pb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-800">审核</span>
              <button onClick={() => setAuditDialogOpen(false)} className="p-2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              商机：{selectedOpp.name}
            </div>
            <Textarea
              className="w-full"
              placeholder="审核描述"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setAuditDialogOpen(false)}
                className="flex-1 h-12 border border-gray-200 rounded-xl text-gray-700"
              >
                审核驳回
              </button>
              <button
                onClick={() => setAuditDialogOpen(false)}
                className="flex-1 h-12 bg-blue-500 text-white rounded-xl"
              >
                审核通过
              </button>
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
                  <span className="text-sm font-medium text-gray-800">张三</span>
                  <span className="text-xs text-green-600">审核通过</span>
                </div>
                <div className="text-xs text-gray-500 mb-2">2025-10-25 14:30</div>
                <div className="text-sm text-gray-600">经核实，该商机符合有效商机标准，审核通过。</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">李四</span>
                  <span className="text-xs text-gray-500">提交审核</span>
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
