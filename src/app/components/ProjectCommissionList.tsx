import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MoreHorizontal, Search, FileText, Building2, User, Calendar, DollarSign, ChevronDown, X, Users, ClipboardCheck, Download, UserPlus, History } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Textarea } from './ui/textarea';

type TabType = 'all' | 'pending' | 'approved';

interface ProjectMember {
  name: string;
  role: string;
  level: string;
}

interface Project {
  id: string;
  name: string;
  customer: string;
  manager: string;
  branch: string;
  signTime: string;
  contractAmount: number;
  commissionAmount: number;
  paidAmount: number;
  status: 'pending' | 'approved' | 'paid';
  memberAuditStatus: 'pending' | 'approved';
  members: ProjectMember[];
}

const mockData: Project[] = [
  {
    id: '1',
    name: '宁波某医院信息化建设整体项目',
    customer: '宁波某医院',
    manager: '张三',
    branch: '镇海支局',
    signTime: '2025-08-15',
    contractAmount: 5000000,
    commissionAmount: 150000,
    paidAmount: 100000,
    status: 'approved',
    memberAuditStatus: 'approved',
    members: [
      { name: '张三', role: '项目经理', level: 'P6' },
      { name: '李四', role: '技术负责人', level: 'P5' },
      { name: '王五', role: '开发工程师', level: 'P4' },
    ],
  },
  {
    id: '2',
    name: '某企业智慧园区整体解决方案',
    customer: '某企业',
    manager: '李四',
    branch: '鄞州支局',
    signTime: '2025-09-20',
    contractAmount: 8000000,
    commissionAmount: 240000,
    paidAmount: 0,
    status: 'pending',
    memberAuditStatus: 'pending',
    members: [
      { name: '李四', role: '项目经理', level: 'P6' },
      { name: '赵六', role: '技术负责人', level: 'P5' },
    ],
  },
  {
    id: '3',
    name: '某学校智慧校园整体项目',
    customer: '某学校',
    manager: '王五',
    branch: '北仑支局',
    signTime: '2025-07-10',
    contractAmount: 3500000,
    commissionAmount: 105000,
    paidAmount: 105000,
    status: 'paid',
    memberAuditStatus: 'approved',
    members: [
      { name: '王五', role: '项目经理', level: 'P6' },
    ],
  },
];

export function ProjectCommissionList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [auditStatusOpen, setAuditStatusOpen] = useState(false);
  const [timeRangeOpen, setTimeRangeOpen] = useState(false);
  const [memberAuditDialogOpen, setMemberAuditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [auditRecordsOpen, setAuditRecordsOpen] = useState(false);
  const [distributeRecordsOpen, setDistributeRecordsOpen] = useState(false);
  const [memberChangeOpen, setMemberChangeOpen] = useState(false);

  const filteredData = mockData.filter(item => {
    if (activeTab === 'pending') return item.status === 'pending' || item.memberAuditStatus === 'pending';
    if (activeTab === 'approved') return item.status !== 'pending';
    return true;
  }).filter(item =>
    item.name.includes(searchQuery) || item.customer.includes(searchQuery)
  );

  const getStatusTag = (project: Project) => {
    if (project.memberAuditStatus === 'pending') {
      return <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full">成员待审核</span>;
    }
    if (project.status === 'pending') {
      return <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">待发放</span>;
    }
    if (project.paidAmount >= project.commissionAmount) {
      return <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">已发放</span>;
    }
    return <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">部分发放</span>;
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-3 flex items-center justify-between">
        <button onClick={() => navigate('/wallet')} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">项目提成</h1>
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
              {tab === 'all' ? '全量项目' : tab === 'pending' ? '待审核项目' : '已审核项目'}
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
            placeholder="项目名称or客户名称"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 pl-10 pr-4 bg-gray-50 rounded-xl text-sm"
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
            签约时间 <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="px-4 space-y-3">
        {filteredData.map((project) => (
          <div key={project.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-gray-800 text-sm">{project.name}</div>
                  {getStatusTag(project)}
                </div>
                <div className="mt-2 space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{project.customer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span>客户经理：{project.manager}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>支局：{project.branch}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>签约时间：{project.signTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Info */}
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-xs text-gray-500">合同金额</div>
                <div className="text-sm font-medium text-gray-800">¥{(project.contractAmount / 10000).toFixed(0)}万</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">提成总额</div>
                <div className="text-sm font-medium text-gray-800">¥{(project.commissionAmount / 10000).toFixed(0)}万</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">已发放</div>
                <div className="text-sm font-medium text-green-600">¥{(project.paidAmount / 10000).toFixed(0)}万</div>
              </div>
            </div>

            {/* Members Preview */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500 mb-2">项目成员</div>
              <div className="flex flex-wrap gap-1">
                {project.members.map((member, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg">
                    {member.name}（{member.role}）
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
              {project.memberAuditStatus === 'pending' && (
                <button
                  onClick={() => {
                    setSelectedProject(project);
                    setMemberAuditDialogOpen(true);
                  }}
                  className="h-8 px-3 bg-orange-500 text-white rounded-lg text-xs flex items-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" />
                  成员定档审核
                </button>
              )}
              <button
                onClick={() => setMemberChangeOpen(true)}
                className="h-8 px-3 bg-blue-50 text-blue-600 rounded-lg text-xs flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                邀请成员
              </button>
              <button
                onClick={() => setMemberChangeOpen(true)}
                className="h-8 px-3 bg-gray-50 text-gray-600 rounded-lg text-xs flex items-center gap-1"
              >
                <History className="w-3.5 h-3.5" />
                成员变更记录
              </button>
              <button
                onClick={() => setAuditRecordsOpen(true)}
                className="h-8 px-3 bg-gray-50 text-gray-600 rounded-lg text-xs flex items-center gap-1"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                审核记录
              </button>
              <button
                onClick={() => setDistributeRecordsOpen(true)}
                className="h-8 px-3 bg-gray-50 text-gray-600 rounded-lg text-xs flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                发放记录
              </button>
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
              {['全部', '成员待审核', '待发放', '部分发放', '已发放'].map((status) => (
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
              <span className="text-lg font-medium text-gray-800">签约时间</span>
              <button onClick={() => setTimeRangeOpen(false)} className="p-2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-2">
              {['全部', '近一月', '近三月', '近半年', '近一年'].map((range) => (
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

      {/* Member Audit Dialog */}
      {memberAuditDialogOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-4 pb-8 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-800">成员定档审核</span>
              <button onClick={() => setMemberAuditDialogOpen(false)} className="p-2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              项目：{selectedProject.name}
            </div>
            <div className="space-y-3 mb-4">
              {selectedProject.members.map((member, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">{member.name}</span>
                    <span className="text-sm text-gray-500">{member.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">定档级别：</span>
                    <Select defaultValue={member.level}>
                            <SelectTrigger className="h-8 w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="P4">P4</SelectItem>
                              <SelectItem value="P5">P5</SelectItem>
                              <SelectItem value="P6">P6</SelectItem>
                              <SelectItem value="P7">P7</SelectItem>
                            </SelectContent>
                          </Select>
                  </div>
                </div>
              ))}
            </div>
            <Textarea
              className="h-24 p-3 bg-gray-50 rounded-xl text-sm resize-none mb-4"
              placeholder="审核备注"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setMemberAuditDialogOpen(false)}
                className="flex-1 h-12 border border-gray-200 rounded-xl text-gray-700"
              >
                驳回
              </button>
              <button
                onClick={() => setMemberAuditDialogOpen(false)}
                className="flex-1 h-12 bg-blue-500 text-white rounded-xl"
              >
                通过
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Change Sheet */}
      {memberChangeOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setMemberChangeOpen(false)}>
          <div className="w-full bg-white rounded-t-3xl max-h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="text-lg font-medium text-gray-800">成员变更记录</span>
              <button onClick={() => setMemberChangeOpen(false)} className="p-2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">新增成员</span>
                  <span className="text-xs text-green-600">通过</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">2025-10-20 14:30</div>
                <div className="text-xs text-gray-600">新增成员：赵六（P5技术负责人）</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">定档调整</span>
                  <span className="text-xs text-green-600">通过</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">2025-10-15 10:00</div>
                <div className="text-xs text-gray-600">张三 P5 → P6</div>
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
                  <span className="text-sm font-medium text-gray-800">项目审核</span>
                  <span className="text-xs text-green-600">通过</span>
                </div>
                <div className="text-xs text-gray-500 mb-2">2025-10-25 14:30</div>
                <div className="text-xs text-gray-600">审核人：分公司领导</div>
              </div>
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
                  <span className="text-sm font-medium text-gray-800">首期提成发放</span>
                  <span className="text-sm text-green-600">+¥50,000</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">2025-10-28 10:30</div>
                <div className="text-xs text-gray-400">张三：¥30,000 | 李四：¥20,000</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
