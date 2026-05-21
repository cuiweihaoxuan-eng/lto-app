import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MoreHorizontal, Search, FileText, Building2, User, Calendar, DollarSign, ChevronDown, X, Plus, Send, ClipboardList, FileCheck, ExternalLink } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Textarea } from './ui/textarea';

interface SignReport {
  id: string;
  title: string;
  type: 'opportunity' | 'project';
  relatedName: string;
  customer: string;
  amount: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'signed';
  createTime: string;
  signTime?: string;
  fileName?: string;
}

const mockData: SignReport[] = [
  {
    id: '1',
    title: '宁波某医院信息化项目签报申请',
    type: 'opportunity',
    relatedName: '宁波某医院信息化建设项目',
    customer: '宁波某医院',
    amount: 500000,
    status: 'signed',
    createTime: '2025-10-15',
    signTime: '2025-10-20',
    fileName: '2025钱包发文.pdf',
  },
  {
    id: '2',
    title: '某企业智慧园区项目签报申请',
    type: 'opportunity',
    relatedName: '某企业智慧园区项目',
    customer: '某企业',
    amount: 1200000,
    status: 'pending',
    createTime: '2025-10-22',
  },
  {
    id: '3',
    title: '某学校智慧校园项目签报申请',
    type: 'project',
    relatedName: '某学校智慧校园整体项目',
    customer: '某学校',
    amount: 350000,
    status: 'approved',
    createTime: '2025-10-18',
  },
  {
    id: '4',
    title: '某科技公司IT系统建设项目签报',
    type: 'opportunity',
    relatedName: '某科技公司IT系统建设项目',
    customer: '某科技公司',
    amount: 800000,
    status: 'draft',
    createTime: '2025-10-25',
  },
  {
    id: '5',
    title: '某制造企业数字化转型项目签报',
    type: 'project',
    relatedName: '某制造企业数字化转型项目',
    customer: '某制造企业',
    amount: 2000000,
    status: 'rejected',
    createTime: '2025-10-10',
  },
];

export function SignReportList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<SignReport | null>(null);
  const [rewardListOpen, setRewardListOpen] = useState(false);

  const filteredData = mockData.filter(item =>
    item.title.includes(searchQuery) || item.relatedName.includes(searchQuery) || item.customer.includes(searchQuery)
  );

  const getStatusTag = (status: SignReport['status']) => {
    switch (status) {
      case 'draft':
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">草稿</span>;
      case 'pending':
        return <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full">签报中</span>;
      case 'approved':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">已批准</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">已驳回</span>;
      case 'signed':
        return <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">已签报</span>;
    }
  };

  const handleCreateSignReport = () => {
    setCreateDialogOpen(true);
  };

  const handleCancelSignReport = (report: SignReport) => {
    setSelectedReport(report);
    setCancelDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-3 flex items-center justify-between">
        <button onClick={() => navigate('/wallet')} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">签报列表</h1>
        <button className="p-2 -mr-2">
          <MoreHorizontal className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="搜索签报标题/客户名称"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-gray-50 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 pb-4 bg-white">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setStatusFilterOpen(true)}
            className="h-9 px-4 bg-gray-50 rounded-xl text-sm text-gray-700 flex items-center gap-1 flex-shrink-0"
          >
            全部状态 <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={handleCreateSignReport}
            className="h-9 px-4 bg-blue-500 text-white rounded-xl text-sm flex items-center gap-1 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            发起签报
          </button>
        </div>
      </div>

      {/* List */}
      <div className="px-4 space-y-3">
        {filteredData.map((report) => (
          <div key={report.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                report.status === 'signed' ? 'bg-green-100' :
                report.status === 'pending' ? 'bg-orange-100' :
                report.status === 'rejected' ? 'bg-red-100' :
                'bg-blue-100'
              }`}>
                <FileText className={`w-5 h-5 ${
                  report.status === 'signed' ? 'text-green-600' :
                  report.status === 'pending' ? 'text-orange-600' :
                  report.status === 'rejected' ? 'text-red-600' :
                  'text-blue-600'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-gray-800 text-sm">{report.title}</div>
                  {getStatusTag(report.status)}
                </div>
                <div className="mt-2 space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{report.customer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>发起时间：{report.createTime}</span>
                  </div>
                  {report.signTime && (
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>签报时间：{report.signTime}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                签报金额：<span className="text-blue-600 font-medium">¥{(report.amount / 10000).toFixed(0)}万</span>
              </div>
              {report.fileName && (
                <div className="mt-1 text-xs text-gray-400">
                  签批文件：<span className="text-blue-500">{report.fileName}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
              {report.status === 'draft' && (
                <>
                  <button
                    onClick={handleCreateSignReport}
                    className="h-8 px-3 bg-blue-500 text-white rounded-lg text-xs flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    发起签报
                  </button>
                  <button
                    onClick={() => handleCancelSignReport(report)}
                    className="h-8 px-3 bg-red-50 text-red-600 rounded-lg text-xs flex items-center gap-1"
                  >
                    取消签报
                  </button>
                </>
              )}
              {report.status === 'pending' && (
                <button
                  onClick={() => handleCancelSignReport(report)}
                  className="h-8 px-3 bg-red-50 text-red-600 rounded-lg text-xs flex items-center gap-1"
                >
                  取消签报
                </button>
              )}
              {(report.status === 'approved' || report.status === 'signed') && (
                <>
                  <button
                    onClick={() => setRewardListOpen(true)}
                    className="h-8 px-3 bg-blue-50 text-blue-600 rounded-lg text-xs flex items-center gap-1"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    奖励清单
                  </button>
                  {report.fileName && (
                    <button
                      onClick={() => {}}
                      className="h-8 px-3 bg-gray-50 text-gray-600 rounded-lg text-xs flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      签批文件
                    </button>
                  )}
                </>
              )}
              {report.status === 'rejected' && (
                <button
                  onClick={handleCreateSignReport}
                  className="h-8 px-3 bg-blue-50 text-blue-600 rounded-lg text-xs flex items-center gap-1"
                >
                  重新发起
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Status Filter Modal */}
      {statusFilterOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setStatusFilterOpen(false)}>
          <div className="w-full bg-white rounded-t-3xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-800">签报状态</span>
              <button onClick={() => setStatusFilterOpen(false)} className="p-2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-2">
              {['全部状态', '草稿', '签报中', '已批准', '已签报', '已驳回'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilterOpen(false)}
                  className="w-full h-12 text-left px-4 bg-gray-50 rounded-xl text-gray-700"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Sign Report Dialog */}
      {createDialogOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-4 pb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-800">发起签报</span>
              <button onClick={() => setCreateDialogOpen(false)} className="p-2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">关联商机/项目</label>
                <Select>
                  <SelectTrigger className="w-full h-11 bg-gray-50 rounded-xl">
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">宁波某医院信息化建设项目</SelectItem>
                    <SelectItem value="2">某企业智慧园区项目</SelectItem>
                    <SelectItem value="3">某学校智慧校园项目</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">签报金额</label>
                <Input
                  type="number"
                  placeholder="请输入金额"
                  className="w-full h-11 px-4 bg-gray-50 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">签报说明</label>
                <Textarea
                  placeholder="请输入签报说明"
                  className="w-full h-24 p-3 bg-gray-50 rounded-xl text-sm resize-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">附件</label>
                <button className="w-full h-11 border border-dashed border-gray-300 rounded-xl text-gray-400 text-sm flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  添加附件
                </button>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setCreateDialogOpen(false)}
                className="flex-1 h-12 border border-gray-200 rounded-xl text-gray-700"
              >
                取消
              </button>
              <button
                onClick={() => setCreateDialogOpen(false)}
                className="flex-1 h-12 bg-blue-500 text-white rounded-xl"
              >
                发起签报
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Sign Report Dialog */}
      {cancelDialogOpen && selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-4 pb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-800">取消签报</span>
              <button onClick={() => setCancelDialogOpen(false)} className="p-2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              确定要取消签报「{selectedReport.title}」吗？
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">取消原因</label>
              <Textarea
                placeholder="请输入取消原因"
                className="w-full h-24 p-3 bg-gray-50 rounded-xl text-sm resize-none"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setCancelDialogOpen(false)}
                className="flex-1 h-12 border border-gray-200 rounded-xl text-gray-700"
              >
                返回
              </button>
              <button
                onClick={() => setCancelDialogOpen(false)}
                className="flex-1 h-12 bg-red-500 text-white rounded-xl"
              >
                确认取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reward List Sheet */}
      {rewardListOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setRewardListOpen(false)}>
          <div className="w-full bg-white rounded-t-3xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="text-lg font-medium text-gray-800">奖励清单</span>
              <button onClick={() => setRewardListOpen(false)} className="p-2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <div className="text-sm text-gray-600 mb-2">关联项目</div>
                <div className="font-medium text-gray-800">宁波某医院信息化建设项目</div>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">有效商机奖</span>
                    <span className="text-sm text-blue-600">¥8,500</span>
                  </div>
                  <div className="text-xs text-gray-500">审核状态：已通过</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">大额商机奖</span>
                    <span className="text-sm text-blue-600">¥15,000</span>
                  </div>
                  <div className="text-xs text-gray-500">审核状态：已通过</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">项目提成奖</span>
                    <span className="text-sm text-blue-600">¥50,000</span>
                  </div>
                  <div className="text-xs text-gray-500">审核状态：发放中</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">奖励合计</span>
                  <span className="text-lg font-bold text-blue-600">¥73,500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
