import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, X } from 'lucide-react';
import { Input } from './ui/input';

// 模拟数据
const mockLargeOppList = [
  { id: '1', saleOppName: '镇海区智慧社区项目', jtOppCode: 'JT202505001', contractAmount: '500000', oppReward: '500', custManagerName: '张三', saleOppStatus: '已完成', contractStatus: '已签报', rewardStatus: '已发放', saleOppId: 'opp001', qxId: 'qx001', cycleMonth: '202505' },
  { id: '2', saleOppName: '北仑区政务云平台', jtOppCode: 'JT202505002', contractAmount: '800000', oppReward: '500', custManagerName: '李四', saleOppStatus: '进行中', contractStatus: '待签报', rewardStatus: '待发放', saleOppId: 'opp002', qxId: 'qx002', cycleMonth: '202505' },
  { id: '3', saleOppName: '鄞州区教育信息化', jtOppCode: 'JT202505003', contractAmount: '300000', oppReward: '300', custManagerName: '王五', saleOppStatus: '已完成', contractStatus: '已签报', rewardStatus: '已发放', saleOppId: 'opp003', qxId: 'qx003', cycleMonth: '202504' },
  { id: '4', saleOppName: '前湾新区智慧园区', jtOppCode: 'JT202505004', contractAmount: '2000000', oppReward: '500', custManagerName: '赵六', saleOppStatus: '已完成', contractStatus: '已签报', rewardStatus: '已发放', saleOppId: 'opp004', qxId: 'qx004', cycleMonth: '202504' },
];

// 发放记录数据
const mockDistributeData = [
  { cycleMonth: '202505', oppAward: { contractAmount: 500000, skCycle: 100000, oppReward: 500 }, itemGrantPercent: '80', grantItemAmount: '400', memberList: [
    { awardType: '奖金', teamUserName: '张三', subTeamName: '售前销售团队', teamRoleName: '负责人', subTeamContribution: '60', amount: '300' },
    { awardType: '奖金', teamUserName: '李四', subTeamName: '售前销售团队', teamRoleName: '成员', subTeamContribution: '40', amount: '200' },
  ]},
  { cycleMonth: '202504', oppAward: { contractAmount: 400000, skCycle: 80000, oppReward: 400 }, itemGrantPercent: '75', grantItemAmount: '300', memberList: [
    { awardType: '奖金', teamUserName: '张三', subTeamName: '售前销售团队', teamRoleName: '负责人', subTeamContribution: '55', amount: '220' },
    { awardType: '奖金', teamUserName: '李四', subTeamName: '售前销售团队', teamRoleName: '成员', subTeamContribution: '45', amount: '180' },
  ]},
];

// 审核记录数据
const mockAuditData = [
  { docInstId: 'doc001', createDate: '2025-05-10 15:30:00', submitUserName: '张三', orgnName: '镇海分局', auditStatusName: '审核通过', signUrl: '签报文件.pdf' },
  { docInstId: 'doc002', createDate: '2025-05-05 10:20:00', submitUserName: '李四', orgnName: '镇海分局', auditStatusName: '待审核', signUrl: '' },
];

export function NbLargeOppList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [listData] = useState(mockLargeOppList);

  // 弹窗状态
  const [distributeVisible, setDistributeVisible] = useState(false);
  const [auditVisible, setAuditVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeDistributeTab, setActiveDistributeTab] = useState(0);
  const [activeAuditTab, setActiveAuditTab] = useState(0);

  const formatAmount = (amount: string | number) => {
    const num = parseFloat(String(amount));
    if (isNaN(num)) return '0.00';
    return (num / 10000).toFixed(2);
  };

  const getStatusTags = (item: any) => {
    const tags = [];
    if (item.saleOppStatus === '已完成') {
      tags.push({ text: item.saleOppStatus, color: '#07c160' });
    } else if (item.saleOppStatus === '进行中') {
      tags.push({ text: item.saleOppStatus, color: '#1989fa' });
    }
    if (item.contractStatus === '已签报') {
      tags.push({ text: item.contractStatus, color: '#07c160' });
    } else {
      tags.push({ text: item.contractStatus, color: '#ff976a' });
    }
    if (item.rewardStatus === '已发放') {
      tags.push({ text: item.rewardStatus, color: '#07c160' });
    } else {
      tags.push({ text: item.rewardStatus, color: '#ff976a' });
    }
    return tags;
  };

  // 发放记录
  const handleDistribute = (item: any) => {
    setSelectedItem(item);
    setDistributeVisible(true);
    setActiveDistributeTab(0);
  };

  // 审核记录
  const handleAudit = (item: any) => {
    setSelectedItem(item);
    setAuditVisible(true);
    setActiveAuditTab(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">大额商机列表</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white">
        <div className="flex border-b border-gray-200">
          {['全量商机', '未分配商机', '已分配商机'].map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(['all', 'undone', 'already'][index])}
              className={`flex-1 py-3 text-center text-sm font-medium transition-colors relative ${
                activeTab === ['all', 'undone', 'already'][index] ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {tab}
              {activeTab === ['all', 'undone', 'already'][index] && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white px-4 py-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="请输入项目名称"
              className="pl-10"
            />
          </div>
          <button className="h-10 px-4 bg-gray-100 rounded-xl text-sm text-gray-600">查询</button>
        </div>
      </div>

      {/* List */}
      <div className="p-4 space-y-4">
        {listData.map((item) => {
          const tags = getStatusTags(item);
          return (
            <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm">
              {/* 头部 */}
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 mr-2 flex-shrink-0">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231989fa'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'/%3E%3C/svg%3E" alt="" className="w-full h-full" />
                </div>
                <div className="flex-1">
                  <h1 className="text-lg font-medium text-gray-800">{item.saleOppName}</h1>
                  <div className="flex gap-3 mt-1">
                    {tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-xs"
                        style={{ backgroundColor: tag.color + '20', color: tag.color }}
                      >
                        {tag.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 内容 */}
              <div className="text-sm text-gray-600 space-y-3">
                <div className="flex items-center">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'/%3E%3C/svg%3E" alt="" className="w-4 h-4 mr-2" style={{ filter: 'brightness(0)' }} />
                  <span className="mr-2">商机编码</span>
                  <span className="text-gray-800 flex-1 text-right">{item.jtOppCode}</span>
                </div>
                <div className="flex items-center">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z'/%3E%3C/svg%3E" alt="" className="w-4 h-4 mr-2" style={{ filter: 'brightness(0)' }} />
                  <span className="mr-2">合同金额</span>
                  <span className="text-gray-800 flex-1 text-right">{formatAmount(item.contractAmount)}万元</span>
                </div>
                <div className="flex items-center">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4-1.89-4-3.91 0-1.62 1.38-2.89 3.11-3.21V4h2.67v1.93c1.2.21 2.32 1.09 2.32 2.81 0 .83-.61 1.61-1.59 1.61-.61 0-1.06-.34-1.61-.87l-1.49 1.49c1.01 1.29 2.36 2.13 3.87 2.59V18h-2.68v1.09z'/%3E%3C/svg%3E" alt="" className="w-4 h-4 mr-2" style={{ filter: 'brightness(0)' }} />
                  <span className="mr-2">大额商机奖</span>
                  <span className="text-gray-800 flex-1 text-right">{item.oppReward}元</span>
                </div>
                <div className="flex items-center">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z'/%3E%3C/svg%3E" alt="" className="w-4 h-4 mr-2" style={{ filter: 'brightness(0)' }} />
                  <span className="mr-2">客户经理</span>
                  <span className="text-gray-800 flex-1 text-right">{item.custManagerName || '-'}</span>
                </div>
              </div>

              {/* 按钮 - 原项目样式 */}
              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleDistribute(item)}
                  className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm"
                >
                  发放记录
                </button>
                <button
                  onClick={() => handleAudit(item)}
                  className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm"
                >
                  审核记录
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 发放记录弹窗 */}
      {distributeVisible && selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800">发放记录</h3>
              <button onClick={() => setDistributeVisible(false)} className="p-2">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            {/* Tab 切换 */}
            <div className="flex border-b border-gray-200">
              {mockDistributeData.map((record, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDistributeTab(idx)}
                  className={`flex-1 py-3 text-center text-sm font-medium transition-colors relative ${
                    activeDistributeTab === idx ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {record.cycleMonth}记录
                  {activeDistributeTab === idx && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {mockDistributeData[activeDistributeTab] && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231989fa'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'/%3E%3C/svg%3E" alt="" className="w-6 h-6" />
                    <span className="text-sm text-gray-600">发放记录</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 text-sm">
                      <span className="text-gray-500">合同金额</span>
                      <span className="text-gray-800">{formatAmount(mockDistributeData[activeDistributeTab].oppAward.contractAmount)}万元</span>
                    </div>
                    <div className="flex justify-between p-2 text-sm">
                      <span className="text-gray-500">本期收款金额</span>
                      <span className="text-gray-800">{formatAmount(mockDistributeData[activeDistributeTab].oppAward.skCycle)}万元</span>
                    </div>
                    <div className="flex justify-between p-2 text-sm">
                      <span className="text-gray-500">商机奖励</span>
                      <span className="text-gray-800">{mockDistributeData[activeDistributeTab].oppAward.oppReward}元</span>
                    </div>
                    <div className="flex justify-between p-2 text-sm">
                      <span className="text-gray-500">提成奖发放比例</span>
                      <span className="text-gray-800">{mockDistributeData[activeDistributeTab].itemGrantPercent}%</span>
                    </div>
                    <div className="flex justify-between p-2 text-sm">
                      <span className="text-gray-500">发放项目提成奖</span>
                      <span className="text-gray-800">{mockDistributeData[activeDistributeTab].grantItemAmount}元</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-800 mb-2">发放清单</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-blue-50">
                            <th className="p-2 text-left">类型</th>
                            <th className="p-2 text-left">姓名</th>
                            <th className="p-2 text-left">团队</th>
                            <th className="p-2 text-left">角色</th>
                            <th className="p-2 text-left">贡献值</th>
                            <th className="p-2 text-left">金额</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockDistributeData[activeDistributeTab].memberList.map((member, idx) => (
                            <tr key={idx} className={idx % 2 === 1 ? 'bg-gray-50' : ''}>
                              <td className="p-2">{member.awardType}</td>
                              <td className="p-2">{member.teamUserName}</td>
                              <td className="p-2">{member.subTeamName}</td>
                              <td className="p-2">{member.teamRoleName}</td>
                              <td className="p-2">{member.subTeamContribution}%</td>
                              <td className="p-2">{member.amount}元</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 审核记录弹窗 */}
      {auditVisible && selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800">商机奖励审核记录</h3>
              <button onClick={() => setAuditVisible(false)} className="p-2">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            {/* Tab 切换 */}
            <div className="flex border-b border-gray-200">
              {mockAuditData.map((record, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveAuditTab(idx)}
                  className={`flex-1 py-3 text-center text-sm font-medium transition-colors relative ${
                    activeAuditTab === idx ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {record.createDate.split(' ')[0]}
                  {activeAuditTab === idx && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {mockAuditData[activeAuditTab] && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231989fa'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'/%3E%3C/svg%3E" alt="" className="w-6 h-6" />
                    <span className="text-sm text-gray-600">商机奖励审核</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      mockAuditData[activeAuditTab].auditStatusName === '审核通过' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {mockAuditData[activeAuditTab].auditStatusName}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 text-sm">
                      <span className="text-gray-500">送审人</span>
                      <span className="text-gray-800">{mockAuditData[activeAuditTab].submitUserName}</span>
                    </div>
                    <div className="flex justify-between p-2 text-sm">
                      <span className="text-gray-500">所在组织</span>
                      <span className="text-gray-800">{mockAuditData[activeAuditTab].orgnName}</span>
                    </div>
                    <div className="flex justify-between p-2 text-sm">
                      <span className="text-gray-500">审批时间</span>
                      <span className="text-gray-800">{mockAuditData[activeAuditTab].createDate}</span>
                    </div>
                    <div className="flex justify-between p-2 text-sm">
                      <span className="text-gray-500">审批类型</span>
                      <span className="text-gray-800">商机奖励审核</span>
                    </div>
                    <div className="flex justify-between p-2 text-sm">
                      <span className="text-gray-500">签报文件</span>
                      <span className="text-blue-600">{mockAuditData[activeAuditTab].signUrl || '-'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}