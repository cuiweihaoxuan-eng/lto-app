import { useState } from 'react';
import { Search, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { TeamDialog } from './TeamDialog';

interface Task {
  id: string;
  title: string;
  customerManager: string;
  salesManager: string;
  auditor?: string;
  teamMembers: string[];
  branch: string;
  department: string;
  customerName: string;
  updateTime: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: '弱电整体改造，摄像头全覆盖...',
    customerManager: '回陆',
    salesManager: '金钰琳',
    auditor: '费佳',
    teamMembers: ['蒋小涵'],
    branch: '镇海城北综合汽车企业支局',
    department: '宁波赫海分公司',
    customerName: '宁波爱地宝商业管理有限公司',
    updateTime: '2026-03-26 10:38:11',
  },
  {
    id: '2',
    title: '火墙AI走访客户推荐火墙全面...',
    customerManager: '查林如',
    salesManager: '金钰琳',
    auditor: '李明',
    teamMembers: [],
    branch: '镇海城北综合汽车企业支局',
    department: '宁波赫海分公司',
    customerName: '宁波市镇海云莱纺织品有限公司',
    updateTime: '2026-03-26 09:01:51',
  },
  {
    id: '3',
    title: '火墙AI走访客户推荐火墙全面...',
    customerManager: '查林如',
    salesManager: '金钰琳',
    teamMembers: [],
    branch: '镇海城北综合汽车企业支局',
    department: '宁波赫海分公司',
    customerName: '',
    updateTime: '',
  },
];

export function TaskList() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTeamClick = (task: Task) => {
    setSelectedTaskId(task.id);
    setIsDialogOpen(true);
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium text-gray-900 flex-1">商机跟踪列表</h1>
        </div>
        <div className="flex items-center justify-around pb-0">
          <div className="flex flex-col items-center">
            <div className="relative">
              <span className="text-gray-400">待接单</span>
              <span className="absolute -top-1 -right-6 bg-red-500 text-white text-xs rounded-full px-1.5 min-w-[20px] text-center">
                26
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative">
              <span className="text-gray-900">跟进</span>
              <span className="absolute -top-1 -right-7 bg-red-500 text-white text-xs rounded-full px-1.5 min-w-[20px] text-center">
                583
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-500"></div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative">
              <span className="text-gray-400">历史记录</span>
              <span className="absolute -top-1 -right-8 bg-red-500 text-white text-xs rounded-full px-1.5 min-w-[20px] text-center">
                3387
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white px-4 py-3 flex items-center gap-2">
        <div className="flex-1 flex items-center bg-gray-100 rounded-md px-3 py-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="请输入搜索关键词"
            className="flex-1 bg-transparent border-none outline-none ml-2 text-gray-400 placeholder:text-gray-400"
          />
        </div>
        <button className="text-gray-600">取消</button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white px-4 py-3 flex items-center gap-4 overflow-x-auto">
        <button className="text-gray-700 whitespace-nowrap">客户经理</button>
        <button className="text-gray-700 whitespace-nowrap">售前经理</button>
        <button className="text-gray-700 whitespace-nowrap">评分状态</button>
        <button className="text-gray-700 whitespace-nowrap">更新周期</button>
        <button className="text-gray-700 whitespace-nowrap">日期范围</button>
      </div>

      {/* Task List */}
      <div className="p-4 space-y-3">
        {mockTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm">
            {/* Task Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-green-400 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-5 bg-white/90 rounded"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-900 font-medium break-words">
                  {task.title}
                </div>
              </div>
            </div>

            {/* Team Info */}
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400 rounded-sm flex-shrink-0"></div>
                <span className="text-gray-600 text-sm">
                  客户经理：{task.customerManager}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400 rounded-sm flex-shrink-0"></div>
                <span className="text-gray-600 text-sm">
                  售前经理：{task.salesManager}
                </span>
              </div>
              {task.auditor && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded-sm flex-shrink-0"></div>
                  <span className="text-gray-600 text-sm">
                    审核人：{task.auditor}
                  </span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-1 mb-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <div>团队成员：{task.teamMembers.join('、') || '-'}</div>
              <div>支局：{task.branch}</div>
              <div>分局：{task.department}</div>
            </div>

            {/* Customer Info */}
            {task.customerName && (
              <div className="space-y-1 mb-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded flex-shrink-0"></div>
                  <span className="text-gray-600">客户名称：</span>
                  <span className="text-gray-900">{task.customerName}</span>
                </div>
                {task.updateTime && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded flex-shrink-0"></div>
                    <span className="text-gray-600">更新时间：</span>
                    <span className="text-gray-900">{task.updateTime}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 pt-3 border-t overflow-x-auto">
              <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-full whitespace-nowrap hover:bg-gray-50">
                跟踪
              </button>
              <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-full whitespace-nowrap hover:bg-gray-50">
                一键求助
              </button>
              <button
                onClick={() => {
                  setSelectedTaskId(task.id);
                  setIsDialogOpen(true);
                }}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-full whitespace-nowrap hover:bg-gray-50"
              >
                组队
              </button>
              <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-full whitespace-nowrap hover:bg-gray-50">
                关闭挂起
              </button>
              <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-full whitespace-nowrap hover:bg-gray-50">
                重点商机申请
              </button>
              <button
                onClick={() => navigate(`/six-standard/${task.id}`)}
                className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-full whitespace-nowrap hover:bg-blue-50"
              >
                六到位
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Team Dialog */}
      <TeamDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        taskId={selectedTaskId}
      />
    </div>
  );
}