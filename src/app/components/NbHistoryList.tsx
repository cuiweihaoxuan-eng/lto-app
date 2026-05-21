import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

// 模拟数据
const mockHistoryList = [
  { id: '1', qxName: '镇海分局', cycleMonth: '202505', itemCnt: '5', approvedProjectCount: '4', contractAmount: '2500000', contractIctAmount: '1500000', skAll: '500000', totalReward: '30000', oppReward: '2000', itemReward: '28000', submitUserName: '张三', submitTime: '2025-05-10 15:30', auditState: '30' },
  { id: '2', qxName: '北仑分局', cycleMonth: '202504', itemCnt: '8', approvedProjectCount: '8', contractAmount: '4000000', contractIctAmount: '2500000', skAll: '800000', totalReward: '50000', oppReward: '3000', itemReward: '47000', submitUserName: '李四', submitTime: '2025-04-10 14:20', auditState: '30' },
  { id: '3', qxName: '鄞州分局', cycleMonth: '202503', itemCnt: '6', approvedProjectCount: '6', contractAmount: '3000000', contractIctAmount: '1800000', skAll: '600000', totalReward: '36000', oppReward: '1800', itemReward: '34200', submitUserName: '王五', submitTime: '2025-03-10 16:45', auditState: '20' },
  { id: '4', qxName: '前湾分局', cycleMonth: '202502', itemCnt: '4', approvedProjectCount: '4', contractAmount: '2000000', contractIctAmount: '1200000', skAll: '400000', totalReward: '24000', oppReward: '1200', itemReward: '22800', submitUserName: '赵六', submitTime: '2025-02-10 10:00', auditState: '40' },
  { id: '5', qxName: '海曙分局', cycleMonth: '202501', itemCnt: '7', approvedProjectCount: '7', contractAmount: '3500000', contractIctAmount: '2000000', skAll: '700000', totalReward: '40000', oppReward: '2100', itemReward: '37900', submitUserName: '孙七', submitTime: '2025-01-10 09:30', auditState: '30' },
];

export function NbHistoryList() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [listData] = useState(mockHistoryList);

  const formatAmount = (amount: string | number) => {
    const num = parseFloat(String(amount));
    if (isNaN(num)) return '0';
    return (num / 10000).toFixed(2);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return dateStr.slice(0, 10);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case '30': return { text: '审核通过', color: '#07c160' };
      case '20': return { text: '审批中', color: '#07c160' };
      case '10': return { text: '自动发放', color: '#07c160' };
      case '40': return { text: '已驳回', color: '#ee0a24' };
      default: return { text: '待发起', color: '#1989fa' };
    }
  };

  const getCardTitle = (item: any) => {
    return `${item.qxName}${item.cycleMonth}账期奖励审批`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">历史签报</h1>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto">
          {['全部', '审批中', '审核通过', '已驳回'].map((filter, index) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(['all', '20,10', '30', '40'][index])}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === ['all', '20,10', '30', '40'][index]
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="p-4 space-y-4">
        {listData.map((item) => {
          const statusInfo = getStatusInfo(item.auditState);
          return (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
              {/* 头部 */}
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 mr-3 flex-shrink-0">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231989fa'%3E%3Cpath d='M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z'/%3E%3C/svg%3E" alt="" className="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-medium text-gray-800 truncate">{getCardTitle(item)}</h3>
                    <span
                      className="px-2 py-0.5 rounded text-xs shrink-0"
                      style={{ backgroundColor: statusInfo.color + '20', color: statusInfo.color }}
                    >
                      {statusInfo.text}
                    </span>
                  </div>
                </div>
              </div>

              {/* 内容 */}
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>区县分局：</span>
                  <span className="text-gray-800">{item.qxName}</span>
                </div>
                <div className="flex justify-between">
                  <span>账期：</span>
                  <span className="text-gray-800">{item.cycleMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span>项目数/已审核成员项目：</span>
                  <span className="text-gray-800">
                    <span className="text-blue-500 cursor-pointer">{item.itemCnt}</span>
                    /
                    <span className="text-blue-500 cursor-pointer">{item.approvedProjectCount}</span>
                    个
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>合同金额/ICT金额：</span>
                  <span className="text-gray-800">{formatAmount(item.contractAmount)}/{formatAmount(item.contractIctAmount)}万元</span>
                </div>
                <div className="flex justify-between">
                  <span>本期收款金额：</span>
                  <span className="text-gray-800">{formatAmount(item.skAll)}万元</span>
                </div>
                <div className="flex justify-between">
                  <span>总奖励金额：</span>
                  <span className="text-gray-800">{formatAmount(item.totalReward)}万元</span>
                </div>
                <div className="flex justify-between">
                  <span>商机奖：</span>
                  <span className="text-gray-800">{item.oppReward}元</span>
                </div>
                <div className="flex justify-between">
                  <span>项目提成奖：</span>
                  <span className="text-gray-800">{item.itemReward}元</span>
                </div>
                <div className="flex justify-between">
                  <span>送审人：</span>
                  <span className="text-gray-800">{item.submitUserName}</span>
                </div>
                <div className="flex justify-between">
                  <span>送审时间：</span>
                  <span className="text-gray-800">{formatDate(item.submitTime)}</span>
                </div>
              </div>

              {/* 底部按钮 */}
              <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
                <button className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm">奖励清单</button>
                <button className="px-4 py-1.5 bg-gray-800 text-white rounded-full text-sm">签批文件</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}