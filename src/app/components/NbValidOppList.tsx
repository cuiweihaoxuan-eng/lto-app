import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, X } from 'lucide-react';

// 模拟数据
const mockOppList = [
  { id: '1', saleOppName: '镇海区智慧社区项目', jtSaleOppCode: 'JT202505001', custName: '镇海区民政局', validOppAmount: '50', createDate: '2025-05-10', custManagerName: '张三', branchName: '镇海支局', auditStatus: '30', auditStatusName: '审核通过', saleOppId: 'opp001', qxId: 'qx001', cycleMonth: '202505' },
  { id: '2', saleOppName: '北仑区政务云平台', jtSaleOppCode: 'JT202505002', custName: '北仑区信息中心', validOppAmount: '80', createDate: '2025-05-08', custManagerName: '李四', branchName: '北仑支局', auditStatus: '20', auditStatusName: '待审核', saleOppId: 'opp002', qxId: 'qx002', cycleMonth: '202505' },
  { id: '3', saleOppName: '鄞州区教育信息化', jtSaleOppCode: 'JT202505003', custName: '鄞州区教育局', validOppAmount: '30', createDate: '2025-05-06', custManagerName: '王五', branchName: '鄞州支局', auditStatus: '30', auditStatusName: '审核通过', saleOppId: 'opp003', qxId: 'qx003', cycleMonth: '202504' },
  { id: '4', saleOppName: '前湾新区智慧园区', jtSaleOppCode: 'JT202505004', custName: '前湾新区管委会', validOppAmount: '200', createDate: '2025-05-05', custManagerName: '赵六', branchName: '前湾支局', auditStatus: '30', auditStatusName: '审核通过', saleOppId: 'opp004', qxId: 'qx004', cycleMonth: '202504' },
  { id: '5', saleOppName: '海曙区医疗信息化', jtSaleOppCode: 'JT202505005', custName: '海曙区卫健局', validOppAmount: '45', createDate: '2025-05-03', custManagerName: '孙七', branchName: '海曙支局', auditStatus: '20', auditStatusName: '待审核', saleOppId: 'opp005', qxId: 'qx005', cycleMonth: '202503' },
  { id: '6', saleOppName: '江北区智慧交通', jtSaleOppCode: 'JT202505006', custName: '江北区交通局', validOppAmount: '60', createDate: '2025-04-28', custManagerName: '周八', branchName: '江北支局', auditStatus: '10', auditStatusName: '自动发放', saleOppId: 'opp006', qxId: 'qx006', cycleMonth: '202503' },
];

// 审核记录数据
const mockAuditData = [
  { docInstId: 'doc001', createDate: '2025-05-10 15:30:00', submitUserName: '张三', orgnName: '镇海分局', auditStatusName: '审核通过', signUrl: '签报文件.pdf' },
  { docInstId: 'doc002', createDate: '2025-05-05 10:20:00', submitUserName: '李四', orgnName: '镇海分局', auditStatusName: '待审核', signUrl: '' },
];

export function NbValidOppList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [listData] = useState(mockOppList);

  // 弹窗状态
  const [approvalVisible, setApprovalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeAuditTab, setActiveAuditTab] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '30': return { bg: '#07c160', text: '审核通过' };
      case '20': return { bg: '#1989fa', text: '待审核' };
      case '10': return { bg: '#1989fa', text: '自动发放' };
      default: return { bg: '#999', text: '未知' };
    }
  };

  // 审核
  const handleReview = (item: any) => {
    setSelectedItem(item);
    setApprovalVisible(true);
  };

  // 查看详情
  const handleViewDetail = (item: any) => {
    setSelectedItem(item);
    setDetailVisible(true);
    setActiveAuditTab(0);
  };

  // 商机详情
  const handleOppDetail = (item: any) => {
    navigate(`/ningbo-wallet/opp-detail/${item.saleOppId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">有效商机列表</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white">
        <div className="flex border-b border-gray-200">
          {['全量商机', '待审核商机', '已审核商机'].map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(['all', 'pending', 'approved'][index])}
              className={`flex-1 py-3 text-center text-sm font-medium transition-colors relative ${
                activeTab === ['all', 'pending', 'approved'][index] ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {tab}
              {activeTab === ['all', 'pending', 'approved'][index] && (
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
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="请输入商机名称/客户名称"
              className="w-full h-10 pl-10 pr-4 bg-gray-100 rounded-xl text-sm outline-none"
            />
          </div>
          <button className="h-10 px-4 bg-gray-100 rounded-xl text-sm text-gray-600">查询</button>
        </div>
      </div>

      {/* List */}
      <div className="p-4 space-y-3">
        {listData.map((item) => {
          const statusInfo = getStatusColor(item.auditStatus);
          return (
            <div
              key={item.id}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              {/* 头部 */}
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 mr-2 flex-shrink-0">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231989fa'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'/%3E%3C/svg%3E" alt="" className="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-medium text-gray-800 truncate">{item.saleOppName}</h3>
                    <span
                      className="px-2 py-0.5 rounded text-xs shrink-0"
                      style={{ backgroundColor: statusInfo.bg + '20', color: statusInfo.bg }}
                    >
                      {statusInfo.text}
                    </span>
                  </div>
                </div>
              </div>

              {/* 内容 */}
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>客户名称：</span>
                  <span className="text-gray-800">{item.custName}</span>
                </div>
                <div className="flex justify-between">
                  <span>商机编码：</span>
                  <span className="text-gray-800">{item.jtSaleOppCode}</span>
                </div>
                <div className="flex justify-between">
                  <span>有效商机奖金额：</span>
                  <span className="text-blue-600 font-medium">{item.validOppAmount}元</span>
                </div>
                <div className="flex justify-between">
                  <span>商机录入时间：</span>
                  <span className="text-gray-800">{item.createDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>客户经理：</span>
                  <span className="text-gray-800">{item.custManagerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>支局：</span>
                  <span className="text-gray-800">{item.branchName}</span>
                </div>
              </div>

              {/* 底部按钮 - 原项目样式 */}
              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                {item.auditStatus === '20' && (
                  <button
                    onClick={() => handleReview(item)}
                    className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm"
                  >
                    审核
                  </button>
                )}
                {item.auditStatus === '30' && (
                  <button
                    onClick={() => handleViewDetail(item)}
                    className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    查看详情
                  </button>
                )}
                <button
                  onClick={() => handleOppDetail(item)}
                  className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm"
                >
                  商机详情
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 审核弹窗 */}
      {approvalVisible && selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">有效商机奖审核</h3>
              <button onClick={() => setApprovalVisible(false)} className="p-2">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <p>项目：{selectedItem.saleOppName}</p>
              <p>有效商机奖金额：{selectedItem.validOppAmount}元</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setApprovalVisible(false)}
                className="flex-1 h-12 border border-gray-200 rounded-xl text-gray-700"
              >
                驳回
              </button>
              <button
                onClick={() => setApprovalVisible(false)}
                className="flex-1 h-12 bg-blue-500 text-white rounded-xl"
              >
                通过
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 审核详情弹窗 */}
      {detailVisible && selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800">审核详情</h3>
              <button onClick={() => setDetailVisible(false)} className="p-2">
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
                    <span className="text-sm text-gray-600">有效商机奖审核</span>
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
                      <span className="text-gray-800">有效商机奖审核</span>
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