import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ChevronLeft, Search, Filter, X, ChevronDown, ChevronUp,
  Plus, Copy, DollarSign, ChevronRight, RefreshCw,
  CheckCircle, AlertTriangle, FileText, Upload, ExternalLink
} from 'lucide-react';

// 录收记录类型
interface RevenueRecord {
  id: string;
  oppName: string;
  oppCode: string;
  contractName: string;
  contractCode: string;
  projectName: string;
  projectCode: string;
  status: '未录收' | '部分录收' | '录收完成';
  lastRevenueTime: string;
  totalAmount: string;
  confirmedAmount: string;
  unconfirmedAmount: string;
  // 完整详情数据
  customerName?: string;
  customerCode?: string;
  contractAmount?: string;
  contractConfirmedRevenue?: string;
  contractUnconfirmedRevenue?: string;
  contractTotalReceived?: string;
  contractRemainingReceived?: string;
  // 金额明细
  totalAmountDetail?: {
    service: string;
    standard: string;
    basic: string;
    equipment: string;
    agency: string;
  };
  confirmedAmountDetail?: {
    service: string;
    standard: string;
    basic: string;
    equipment: string;
    agency: string;
  };
  unconfirmedAmountDetail?: {
    service: string;
    standard: string;
    basic: string;
    equipment: string;
    agency: string;
  };
  // 审批单列表
  approvalList?: ApprovalRecord[];
  // 其他渠道录收
  otherChannelList?: OtherChannelRecord[];
}

interface ApprovalRecord {
  id: string;
  index: number;
  name: string;
  amount: string;
  eipNumber: string;
  eipDocId: string;
  draftDept: string;
  syncEipTime: string;
  eipStatus: string;
  presaleOrderNo: string;
  orderId: string;
  orderCode: string;
  sync30Time: string;
}

interface OtherChannelRecord {
  id: string;
  index: number;
  contractName: string;
  contractCode: string;
  productRevenue: string;
  productRevenueCode: string;
  billingPeriod: string;
  amountWithoutTax: string;
}

// Mock数据
const mockData: RevenueRecord[] = [
  {
    id: '1',
    oppName: '中国邮政速递物流股份有限公司台州市分公司ICT项目',
    oppCode: 'OPP20260428001',
    contractName: '台州邮政ICT服务合同',
    contractCode: 'HT202604001',
    projectName: '台州邮政ICT实施项目',
    projectCode: 'XM202604001',
    status: '录收完成',
    lastRevenueTime: '2026-05-10 09:30',
    totalAmount: '500,000.00',
    confirmedAmount: '450,000.00',
    unconfirmedAmount: '50,000.00',
    customerName: '中国邮政速递物流股份有限公司台州市分公司',
    customerCode: 'ZJ2019060400004795',
    contractAmount: '500,000.00',
    contractConfirmedRevenue: '450,000.00',
    contractUnconfirmedRevenue: '50,000.00',
    contractTotalReceived: '480,000.00',
    contractRemainingReceived: '20,000.00',
    totalAmountDetail: { service: '300,000.00', standard: '100,000.00', basic: '50,000.00', equipment: '30,000.00', agency: '20,000.00' },
    confirmedAmountDetail: { service: '270,000.00', standard: '90,000.00', basic: '45,000.00', equipment: '27,000.00', agency: '18,000.00' },
    unconfirmedAmountDetail: { service: '30,000.00', standard: '10,000.00', basic: '5,000.00', equipment: '3,000.00', agency: '2,000.00' },
    approvalList: [
      { id: 'a1', index: 1, name: '2026年4月服务费确认', amount: '50,000.00', eipNumber: 'EIP20260415001', eipDocId: 'DOC001', draftDept: '杭州分公司', syncEipTime: '2026-04-15 10:30', eipStatus: '审核通过', presaleOrderNo: 'PSO202604001', orderId: 'ORD001', orderCode: 'ORD202604001', sync30Time: '2026-04-16 09:00' },
      { id: 'a2', index: 2, name: '2026年3月服务费确认', amount: '50,000.00', eipNumber: 'EIP20260315002', eipDocId: 'DOC002', draftDept: '杭州分公司', syncEipTime: '2026-03-15 10:30', eipStatus: '审核通过', presaleOrderNo: 'PSO202603001', orderId: 'ORD002', orderCode: 'ORD202603001', sync30Time: '2026-03-16 09:00' },
      { id: 'a3', index: 3, name: '2026年2月服务费确认', amount: '50,000.00', eipNumber: 'EIP20260215003', eipDocId: 'DOC003', draftDept: '杭州分公司', syncEipTime: '2026-02-15 10:30', eipStatus: '审核通过', presaleOrderNo: 'PSO202602001', orderId: 'ORD003', orderCode: 'ORD202602001', sync30Time: '2026-02-16 09:00' },
    ],
    otherChannelList: [
      { id: 'oc1', index: 1, contractName: '台州邮政ICT服务合同', contractCode: 'HT202604001', productRevenue: 'ICT服务费', productRevenueCode: 'P001', billingPeriod: '2026-04', amountWithoutTax: '9,433.96' },
      { id: 'oc2', index: 2, contractName: '台州邮政ICT服务合同', contractCode: 'HT202604001', productRevenue: '运维服务费', productRevenueCode: 'P002', billingPeriod: '2026-03', amountWithoutTax: '4,716.98' },
    ],
  },
  {
    id: '2',
    oppName: '中国美术学院校园算力项目',
    oppCode: 'OPP20260428002',
    contractName: '算力服务合同',
    contractCode: 'HT202604002',
    projectName: '校园算力建设',
    projectCode: 'XM202604002',
    status: '部分录收',
    lastRevenueTime: '2026-04-20 14:00',
    totalAmount: '200,000.00',
    confirmedAmount: '80,000.00',
    unconfirmedAmount: '120,000.00',
    customerName: '中国美术学院',
    customerCode: 'ZJ2020010100001234',
    contractAmount: '200,000.00',
    contractConfirmedRevenue: '80,000.00',
    contractUnconfirmedRevenue: '120,000.00',
    contractTotalReceived: '80,000.00',
    contractRemainingReceived: '120,000.00',
    approvalList: [
      { id: 'a4', index: 1, name: '2026年4月算力服务确认', amount: '40,000.00', eipNumber: 'EIP20260420003', eipDocId: 'DOC003', draftDept: '杭州分公司', syncEipTime: '-', eipStatus: '待提交', presaleOrderNo: 'PSO202604002', orderId: 'ORD003', orderCode: 'ORD202604002', sync30Time: '-' },
      { id: 'a5', index: 2, name: '2026年5月算力服务确认', amount: '40,000.00', eipNumber: 'EIP20260515004', eipDocId: 'DOC004', draftDept: '杭州分公司', syncEipTime: '2026-05-15 10:30', eipStatus: '审核中', presaleOrderNo: 'PSO202605001', orderId: 'ORD004', orderCode: 'ORD202605001', sync30Time: '-' },
    ],
    otherChannelList: [],
  },
  {
    id: '3',
    oppName: '宁波港数字化转型ICT项目',
    oppCode: 'OPP20260428003',
    contractName: '宁波港数字化转型合同',
    contractCode: 'HT202604003',
    projectName: '数字化转型一期',
    projectCode: 'XM202604003',
    status: '未录收',
    lastRevenueTime: '-',
    totalAmount: '800,000.00',
    confirmedAmount: '0.00',
    unconfirmedAmount: '800,000.00',
    customerName: '宁波港集团有限公司',
    customerCode: 'ZJ2019051500001234',
    contractAmount: '800,000.00',
    contractConfirmedRevenue: '0.00',
    contractUnconfirmedRevenue: '800,000.00',
    contractTotalReceived: '0.00',
    contractRemainingReceived: '800,000.00',
    approvalList: [],
    otherChannelList: [],
  },
  {
    id: '4',
    oppName: '某区政府智慧党建平台项目',
    oppCode: 'OPP20260428004',
    contractName: '智慧党建服务合同',
    contractCode: 'HT202604004',
    projectName: '智慧党建平台建设',
    projectCode: 'XM202604004',
    status: '部分录收',
    lastRevenueTime: '2026-04-15 10:00',
    totalAmount: '350,000.00',
    confirmedAmount: '150,000.00',
    unconfirmedAmount: '200,000.00',
    approvalList: [
      { id: 'a6', index: 1, name: '2026年4月党建服务确认', amount: '50,000.00', eipNumber: 'EIP20260415005', eipDocId: 'DOC005', draftDept: '杭州分公司', syncEipTime: '2026-04-15 10:30', eipStatus: '审核驳回', presaleOrderNo: 'PSO202604003', orderId: 'ORD005', orderCode: 'ORD202604003', sync30Time: '-' },
    ],
    otherChannelList: [],
  },
];

// 状态配置
const statusConfig = {
  '未录收': { bg: 'bg-orange-50', text: 'text-orange-600', dot: 'bg-orange-500' },
  '部分录收': { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' },
  '录收完成': { bg: 'bg-green-50', text: 'text-green-600', dot: 'bg-green-500' },
};

// 审批状态配置
const approvalStatusConfig: Record<string, { bg: string; text: string }> = {
  '审核通过': { bg: 'bg-green-50', text: 'text-green-600' },
  '审核中': { bg: 'bg-blue-50', text: 'text-blue-600' },
  '待提交': { bg: 'bg-gray-100', text: 'text-gray-600' },
  '审核驳回': { bg: 'bg-red-50', text: 'text-red-600' },
};

export function RevenueManagementList() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('全部');
  const [expandedSection, setExpandedSection] = useState<Record<string, string[]>>({});

  // 过滤数据
  const filteredData = mockData.filter(item => {
    const matchSearch = !searchText ||
      item.oppName.includes(searchText) ||
      item.oppCode.includes(searchText) ||
      item.contractName.includes(searchText) ||
      item.projectName.includes(searchText);
    const matchStatus = statusFilter === '全部' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 切换详情区块展开
  const toggleSection = (cardId: string, section: string) => {
    setExpandedSection(prev => {
      const cardSections = prev[cardId] || [];
      if (cardSections.includes(section)) {
        return { ...prev, [cardId]: cardSections.filter(s => s !== section) };
      } else {
        return { ...prev, [cardId]: [...cardSections, section] };
      }
    });
  };

  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-white z-10 shadow-sm">
        <div className="flex items-center px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="flex-1 text-center text-lg font-medium text-gray-900 mr-8">
            录收管理
          </h1>
        </div>

        {/* 搜索框和筛选按钮 */}
        <div className="px-4 pb-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索商机名称、编码、项目..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchText && (
              <button
                onClick={() => setSearchText('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm transition-colors flex-shrink-0 ${
              showFilters ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* 清除筛选 */}
        {statusFilter !== '全部' && (
          <div className="px-4 pb-3 flex items-center gap-2">
            <button
              onClick={() => setStatusFilter('全部')}
              className="text-sm text-blue-500"
            >
              清除筛选
            </button>
          </div>
        )}

        {/* 筛选面板 */}
        {showFilters && (
          <div className="px-4 pb-3 border-t border-gray-100 pt-3 bg-white">
            <div className="flex flex-wrap gap-2">
              {['全部', '未录收', '部分录收', '录收完成'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    statusFilter === status
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 列表内容 */}
      <div className="px-4 py-4 pb-24 space-y-3">
        {filteredData.map((record) => {
          const statusStyle = statusConfig[record.status];
          const sections = expandedSection[record.id] || [];

          return (
            <div
              key={record.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-200"
            >
              {/* 主卡片内容 */}
              <div className="p-4">
                {/* 商机名称 + 状态标签 + 下拉箭头（同行） */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 leading-tight">
                      {record.oppName}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">{record.projectCode}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                      {record.status}
                    </span>
                    <button
                      onClick={() => toggleSection(record.id, 'info')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {sections.includes('info') ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 下拉展示的信息 */}
                {sections.includes('info') && (
                  <div className="mt-3 mb-3 space-y-1.5 text-sm">
                    <div className="text-gray-900">{record.oppName} <span className="text-gray-400">({record.oppCode})</span></div>
                    <div className="text-gray-900">{record.contractName} <span className="text-gray-400">({record.contractCode})</span></div>
                    <div className="text-gray-900">{record.customerName || '-'} <span className="text-gray-400">{record.customerCode ? `(${record.customerCode})` : ''}</span></div>
                  </div>
                )}

                {/* 金额卡片 */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">项目总金额</div>
                    <div className="text-sm font-medium text-gray-900">¥{record.totalAmount}</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <div className="text-xs text-green-600 mb-1">已确认</div>
                    <div className="text-sm font-medium text-green-600">¥{record.confirmedAmount}</div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3 text-center">
                    <div className="text-xs text-orange-600 mb-1">未确认</div>
                    <div className="text-sm font-medium text-orange-600">¥{record.unconfirmedAmount}</div>
                  </div>
                </div>

                {/* 录收审批单区块 */}
                <div className="border-t border-gray-100 mt-3">
                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => toggleSection(record.id, 'approval')}
                      className="w-full px-0 py-3 flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        录收审批单 ({record.approvalList?.length || 0})
                      </span>
                      {sections.includes('approval') ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    {sections.includes('approval') && (
                      <div className="pb-3 space-y-2">
                        {record.approvalList && record.approvalList.length > 0 ? (
                          record.approvalList.map((approval) => {
                            const apStatus = approvalStatusConfig[approval.eipStatus] || { bg: 'bg-gray-100', text: 'text-gray-600' };
                            return (
                              <button
                                key={approval.id}
                                onClick={() => navigate(`/revenue-view/${record.id}?approvalId=${approval.id}`)}
                                className="w-full bg-gray-50 rounded-xl p-3 text-left hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium">
                                      {approval.index}
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">{approval.name}</span>
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${apStatus.bg} ${apStatus.text}`}>
                                      {approval.eipStatus}
                                    </span>
                                    <span className="text-sm font-medium text-green-600">¥{approval.amount}</span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 pl-7">
                                  <div>EIP文号: {approval.eipNumber}</div>
                                  <div>同步时间: {approval.syncEipTime}</div>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-400">
                            暂无审批单
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 其他渠道录收区块 */}
                  <div>
                    <button
                      onClick={() => toggleSection(record.id, 'other')}
                      className="w-full px-0 py-3 flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        其他渠道录收 ({record.otherChannelList?.length || 0})
                      </span>
                      {sections.includes('other') ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    {sections.includes('other') && (
                      <div className="pb-3 space-y-2">
                        {record.otherChannelList && record.otherChannelList.length > 0 ? (
                          record.otherChannelList.map((item) => (
                            <div key={item.id} className="bg-gray-50 rounded-xl p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">{item.productRevenue}</span>
                                <span className="text-sm font-medium text-green-600">¥{item.amountWithoutTax}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                                <div>合同: {item.contractCode}</div>
                                <div>账期: {item.billingPeriod}</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-400">
                            暂无其他渠道录收
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 底部时间和申请录收按钮 */}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-400">
                    {record.lastRevenueTime !== '-' ? `最新录收: ${record.lastRevenueTime}` : '暂无录收记录'}
                  </span>
                  {record.status === '未录收' && (
                    <button
                      onClick={() => navigate(`/revenue-apply?oppId=${record.id}`)}
                      className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
                    >
                      <Plus className="w-4 h-4" />
                      申请录收
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* 空状态 */}
        {filteredData.length === 0 && (
          <div className="py-16 text-center">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无录收记录</p>
            <p className="text-sm text-gray-400 mt-1">试试调整筛选条件</p>
          </div>
        )}
      </div>

      {/* 底部悬浮按钮 */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => navigate('/revenue-apply')}
          className="flex items-center justify-center w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}