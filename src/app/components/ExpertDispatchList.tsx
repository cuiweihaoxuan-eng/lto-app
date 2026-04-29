import { useState } from 'react';
import { Search, MapPin, User, Calendar, FileText, X, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';

interface DispatchItem {
  id: string;
  opportunityName: string;
  opportunityCode: string;
  branchName: string;
  dispatchPerson: string;
  customerName: string;
  customerAddress: string;
  createTime: string;
  dispatchTime: string;
  status: 'pending' | 'accepted' | 'rejected' | 'visited';
  expertName: string;
  area: string;
}

const mockDispatchData: DispatchItem[] = [
  {
    id: '1',
    opportunityName: '弱电整体改造，摄像头全覆盖',
    opportunityCode: 'OP2026032601',
    branchName: '镇海城北综合汽车企业支局',
    dispatchPerson: '回陆',
    customerName: '宁波爱地宝商业管理有限公司',
    customerAddress: '宁波市镇海区骆驼街道',
    createTime: '2026-03-26 10:38:11',
    dispatchTime: '2026-03-27 14:30:00',
    status: 'pending',
    expertName: '李旭峰',
    area: '镇海区',
  },
  {
    id: '2',
    opportunityName: '火墙AI走访客户推荐火墙全面',
    opportunityCode: 'OP2026032602',
    branchName: '镇海城北综合汽车企业支局',
    dispatchPerson: '查林如',
    customerName: '宁波市镇海云莱纺织品有限公司',
    customerAddress: '宁波市镇海区蛟川街道',
    createTime: '2026-03-26 09:01:51',
    dispatchTime: '2026-03-27 15:00:00',
    status: 'accepted',
    expertName: '王连宇',
    area: '镇海区',
  },
  {
    id: '3',
    opportunityName: '企业网络升级改造项目',
    opportunityCode: 'OP2026032603',
    branchName: '北仑综合汽车企业支局',
    dispatchPerson: '金钰琳',
    customerName: '宁波某某制造有限公司',
    customerAddress: '宁波市北仑区小港街道',
    createTime: '2026-03-25 16:20:00',
    dispatchTime: '2026-03-27 09:00:00',
    status: 'visited',
    expertName: '杨欣怡',
    area: '北仑区',
  },
  {
    id: '4',
    opportunityName: '云服务解决方案咨询',
    opportunityCode: 'OP2026032604',
    branchName: '镇海城北综合汽车企业支局',
    dispatchPerson: '蒋小涵',
    customerName: '宁波科技公司',
    customerAddress: '宁波市镇海区招宝山街道',
    createTime: '2026-03-25 14:10:00',
    dispatchTime: '2026-03-26 10:00:00',
    status: 'rejected',
    expertName: '李旭峰',
    area: '镇海区',
  },
];

const statusConfig = {
  pending: { label: '待接单', color: 'bg-orange-100 text-orange-700' },
  accepted: { label: '已接单', color: 'bg-blue-100 text-blue-700' },
  rejected: { label: '已拒绝', color: 'bg-red-100 text-red-700' },
  visited: { label: '已走访', color: 'bg-green-100 text-green-700' },
};

const areaOptions = ['镇海区', '北仑区', '鄞州区', '海曙区', '江北区'];
const expertOptions = ['李旭峰', '王连宇', '杨欣怡', '张三', '李四', '王五', '赵六'];
const statusOptions = [
  { value: 'pending', label: '待接单' },
  { value: 'accepted', label: '已接单' },
  { value: 'rejected', label: '已拒绝' },
  { value: 'visited', label: '已走访' },
];

type FilterType = 'area' | 'expert' | 'status' | 'date';

export function ExpertDispatchList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    area: '',
    expertName: '',
    status: '',
    dateRange: { start: '', end: '' },
  });
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [tempFilters, setTempFilters] = useState(filters);

  const filteredData = mockDispatchData.filter((item) => {
    const matchesSearch =
      item.opportunityName.includes(searchQuery) ||
      item.expertName.includes(searchQuery);
    const matchesArea = !filters.area || item.area === filters.area;
    const matchesExpert = !filters.expertName || item.expertName === filters.expertName;
    const matchesStatus = !filters.status || item.status === filters.status;
    
    return matchesSearch && matchesArea && matchesExpert && matchesStatus;
  });

  const handleAction = (id: string, action: 'accept' | 'reject' | 'cancel') => {
    console.log(`Action ${action} on dispatch ${id}`);
    // TODO: Implement action logic
  };

  const openFilterDialog = (type: FilterType) => {
    setTempFilters(filters);
    setActiveFilter(type);
  };

  const closeFilterDialog = () => {
    setActiveFilter(null);
  };

  const confirmFilter = () => {
    setFilters(tempFilters);
    closeFilterDialog();
  };

  const resetCurrentFilter = () => {
    if (activeFilter === 'area') {
      setTempFilters({ ...tempFilters, area: '' });
    } else if (activeFilter === 'expert') {
      setTempFilters({ ...tempFilters, expertName: '' });
    } else if (activeFilter === 'status') {
      setTempFilters({ ...tempFilters, status: '' });
    } else if (activeFilter === 'date') {
      setTempFilters({ ...tempFilters, dateRange: { start: '', end: '' } });
    }
  };

  const getFilterLabel = (type: FilterType) => {
    if (type === 'area') {
      return filters.area || '区域';
    } else if (type === 'expert') {
      return filters.expertName || '专家名称';
    } else if (type === 'status') {
      const status = statusOptions.find((s) => s.value === filters.status);
      return status?.label || '派单状态';
    } else if (type === 'date') {
      if (filters.dateRange.start || filters.dateRange.end) {
        return '日期已选';
      }
      return '派单日期';
    }
    return '';
  };

  const hasActiveFilter = (type: FilterType) => {
    if (type === 'area') return !!filters.area;
    if (type === 'expert') return !!filters.expertName;
    if (type === 'status') return !!filters.status;
    if (type === 'date') return !!(filters.dateRange.start || filters.dateRange.end);
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-medium text-gray-900 flex-1">专家派单列表</h1>
          </div>
          
          {/* Search Bar */}
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3 mb-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索商机名称或专家名称"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none ml-2 text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => openFilterDialog('area')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap border ${
                hasActiveFilter('area')
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <MapPin className="w-4 h-4" />
              {getFilterLabel('area')}
            </button>
            <button
              onClick={() => openFilterDialog('expert')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap border ${
                hasActiveFilter('expert')
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <User className="w-4 h-4" />
              {getFilterLabel('expert')}
            </button>
            <button
              onClick={() => openFilterDialog('status')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap border ${
                hasActiveFilter('status')
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              {getFilterLabel('status')}
            </button>
            <button
              onClick={() => openFilterDialog('date')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap border ${
                hasActiveFilter('date')
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              {getFilterLabel('date')}
            </button>
          </div>
        </div>
      </div>

      {/* Dispatch List */}
      <div className="p-4 space-y-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-12 text-gray-400">暂无派单信息</div>
        ) : (
          filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-gray-900 font-medium mb-1">{item.opportunityName}</h3>
                  <div className="text-sm text-gray-500">编码：{item.opportunityCode}</div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                    statusConfig[item.status].color
                  }`}
                >
                  {statusConfig[item.status].label}
                </span>
              </div>

              {/* Info Grid */}
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-gray-600">支局：</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded ml-1">
                      {item.branchName}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">派单人：</span>
                  <span className="text-gray-900">{item.dispatchPerson}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">派单专家：</span>
                  <span className="text-gray-900">{item.expertName}</span>
                </div>
                <div className="text-gray-600">
                  客户名称：<span className="text-gray-900">{item.customerName}</span>
                </div>
                <div className="text-gray-600">
                  客户地址：<span className="text-gray-900">{item.customerAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">创建时间：</span>
                  <span className="text-gray-900">{item.createTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">派单时间：</span>
                  <span className="text-gray-900">{item.dispatchTime}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 pt-3 border-t">
                {item.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction(item.id, 'accept')}
                      className="flex-1 py-2 text-sm bg-blue-500 text-white rounded-lg border-0 hover:bg-blue-600"
                    >
                      接单
                    </button>
                    <button
                      onClick={() => handleAction(item.id, 'reject')}
                      className="flex-1 py-2 text-sm bg-white text-red-500 rounded-lg border border-red-500 hover:bg-red-50"
                    >
                      拒绝
                    </button>
                  </>
                )}
                {item.status === 'accepted' && (
                  <button
                    onClick={() => handleAction(item.id, 'cancel')}
                    className="flex-1 py-2 text-sm bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    撤销
                  </button>
                )}
                {item.status === 'rejected' && (
                  <button
                    onClick={() => handleAction(item.id, 'accept')}
                    className="flex-1 py-2 text-sm bg-blue-500 text-white rounded-lg border-0 hover:bg-blue-600"
                  >
                    重新接单
                  </button>
                )}
                {item.status === 'visited' && (
                  <div className="flex-1 py-2 text-sm text-center text-gray-400">
                    已完成走访
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filter Dialog */}
      <Dialog open={activeFilter !== null} onOpenChange={closeFilterDialog}>
        <DialogContent
          className="max-w-full w-full p-0 gap-0 bg-white rounded-t-2xl fixed bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0 h-auto max-h-[70vh] flex flex-col data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom border-0"
          aria-describedby="filter-dialog-description"
        >
          <DialogTitle className="sr-only">筛选条件</DialogTitle>
          <DialogDescription id="filter-dialog-description" className="sr-only">
            选择筛选条件
          </DialogDescription>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
            <h2 className="text-lg font-medium flex-1 text-center">
              {activeFilter === 'area' && '选择区域'}
              {activeFilter === 'expert' && '选择专家'}
              {activeFilter === 'status' && '选择状态'}
              {activeFilter === 'date' && '选择日期'}
            </h2>
            <button
              onClick={closeFilterDialog}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Area Filter */}
            {activeFilter === 'area' && (
              <div className="space-y-2">
                {areaOptions.map((area) => (
                  <button
                    key={area}
                    onClick={() => setTempFilters({ ...tempFilters, area })}
                    className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${
                      tempFilters.area === area
                        ? 'bg-blue-50 text-blue-700 border border-blue-500'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            )}

            {/* Expert Filter */}
            {activeFilter === 'expert' && (
              <div className="space-y-2">
                {expertOptions.map((expert) => (
                  <button
                    key={expert}
                    onClick={() => setTempFilters({ ...tempFilters, expertName: expert })}
                    className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${
                      tempFilters.expertName === expert
                        ? 'bg-blue-50 text-blue-700 border border-blue-500'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {expert}
                  </button>
                ))}
              </div>
            )}

            {/* Status Filter */}
            {activeFilter === 'status' && (
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => setTempFilters({ ...tempFilters, status: status.value })}
                    className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${
                      tempFilters.status === status.value
                        ? 'bg-blue-50 text-blue-700 border border-blue-500'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            )}

            {/* Date Filter */}
            {activeFilter === 'date' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">开始日期</label>
                  <input
                    type="date"
                    value={tempFilters.dateRange.start}
                    onChange={(e) =>
                      setTempFilters({
                        ...tempFilters,
                        dateRange: { ...tempFilters.dateRange, start: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">结束日期</label>
                  <input
                    type="date"
                    value={tempFilters.dateRange.end}
                    onChange={(e) =>
                      setTempFilters({
                        ...tempFilters,
                        dateRange: { ...tempFilters.dateRange, end: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center gap-3 px-6 py-4 border-t bg-white flex-shrink-0">
            <button
              onClick={resetCurrentFilter}
              className="flex-1 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              重置
            </button>
            <button
              onClick={confirmFilter}
              className="flex-1 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              确定
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}