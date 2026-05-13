import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import {
  ChevronLeft, Copy, CheckCircle, AlertTriangle, FileText,
  RefreshCw, ChevronDown, ChevronUp, DollarSign, User, Building
} from 'lucide-react';

// 录收详情类型
interface RevenueDetail {
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
  customerName: string;
  customerCode: string;
  contractAmount: string;
  contractConfirmedRevenue: string;
  contractUnconfirmedRevenue: string;
  contractTotalReceived: string;
  contractRemainingReceived: string;
  planRevenue: string;
  actualRevenue: string;
  planAccount: string;
  actualAccount: string;
  totalAmountDetail: {
    service: string;
    standard: string;
    basic: string;
    equipment: string;
    agency: string;
  };
  confirmedAmountDetail: {
    service: string;
    standard: string;
    basic: string;
    equipment: string;
    agency: string;
  };
  unconfirmedAmountDetail: {
    service: string;
    standard: string;
    basic: string;
    equipment: string;
    agency: string;
  };
  approvalList: ApprovalRecord[];
  otherChannelList: OtherChannelRecord[];
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
const mockDetail: RevenueDetail = {
  id: '1',
  oppName: '中国邮政速递物流股份有限公司台州市分公司ICT项目',
  oppCode: 'OPP20260428001',
  contractName: '台州邮政ICT服务合同',
  contractCode: 'HT202604001',
  projectName: '台州邮政ICT实施项目',
  projectCode: 'XM202604001',
  status: '部分录收',
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
  planRevenue: '50,000.00',
  actualRevenue: '48,000.00',
  planAccount: '52,000.00',
  actualAccount: '50,000.00',
  totalAmountDetail: {
    service: '300,000.00',
    standard: '100,000.00',
    basic: '50,000.00',
    equipment: '30,000.00',
    agency: '20,000.00',
  },
  confirmedAmountDetail: {
    service: '270,000.00',
    standard: '90,000.00',
    basic: '45,000.00',
    equipment: '27,000.00',
    agency: '18,000.00',
  },
  unconfirmedAmountDetail: {
    service: '30,000.00',
    standard: '10,000.00',
    basic: '5,000.00',
    equipment: '3,000.00',
    agency: '2,000.00',
  },
  approvalList: [
    { id: 'a1', index: 1, name: '2026年5月服务费确认', amount: '50,000.00', eipNumber: 'EIP20260515001', eipDocId: 'DOC001', draftDept: '杭州分公司', syncEipTime: '2026-05-15 10:30', eipStatus: '审核中', presaleOrderNo: 'PSO202605001', orderId: 'ORD001', orderCode: 'ORD202605001', sync30Time: '-' },
    { id: 'a2', index: 2, name: '2026年4月服务费确认', amount: '50,000.00', eipNumber: 'EIP20260415001', eipDocId: 'DOC002', draftDept: '杭州分公司', syncEipTime: '2026-04-15 10:30', eipStatus: '审核通过', presaleOrderNo: 'PSO202604001', orderId: 'ORD002', orderCode: 'ORD202604001', sync30Time: '2026-04-16 09:00' },
    { id: 'a3', index: 3, name: '2026年3月服务费确认', amount: '50,000.00', eipNumber: 'EIP20260315002', eipDocId: 'DOC003', draftDept: '杭州分公司', syncEipTime: '2026-03-15 10:30', eipStatus: '审核通过', presaleOrderNo: 'PSO202603001', orderId: 'ORD003', orderCode: 'ORD202603001', sync30Time: '2026-03-16 09:00' },
  ],
  otherChannelList: [
    { id: 'oc1', index: 1, contractName: '台州邮政ICT服务合同', contractCode: 'HT202604001', productRevenue: 'ICT服务费', productRevenueCode: 'P001', billingPeriod: '2026-04', amountWithoutTax: '9,433.96' },
    { id: 'oc2', index: 2, contractName: '台州邮政ICT服务合同', contractCode: 'HT202604001', productRevenue: '运维服务费', productRevenueCode: 'P002', billingPeriod: '2026-03', amountWithoutTax: '4,716.98' },
  ],
};

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

// 六到位状态
const sixPositionData = [
  { id: 'customer', name: '客情掌握', status: '已录入', attachments: ['客户档案清单.xlsx', '拜访记录汇总.pdf'] },
  { id: 'plan', name: '方案总控', status: '已录入', attachments: ['团队组建方案.docx'] },
  { id: 'bidding', name: '谈判/应标自主', status: '未录入', attachments: [] },
  { id: 'procurement', name: '采购自主', status: '已录入', attachments: ['采购决策审批单.pdf'] },
  { id: 'project', name: '项目强管控', status: '已录入', attachments: ['验收报告.pdf'] },
  { id: 'maintenance', name: '运维自主', status: '未录入', attachments: [] },
];

export function RevenueApplyView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const approvalId = searchParams.get('approvalId');
  const [expandedSection, setExpandedSection] = useState<string[]>(['basic', 'amount', 'approval', 'other', 'sixposition']);

  // 根据审批单ID过滤单个审批单
  const currentApproval = approvalId
    ? mockDetail.approvalList.find(a => a.id === approvalId)
    : null;

  // 计算收支不匹配
  const calculateMismatch = () => {
    const plan = parseFloat(mockDetail.planRevenue.replace(/,/g, '')) || 0;
    const actual = parseFloat(mockDetail.actualRevenue.replace(/,/g, '')) || 0;
    if (plan === 0) return 0;
    return Math.abs((plan - actual) / plan * 100).toFixed(2);
  };

  const isMismatchOver10 = () => {
    const mismatch = parseFloat(calculateMismatch());
    return mismatch > 10;
  };

  // 切换区块展开
  const toggleSection = (section: string) => {
    setExpandedSection(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // 金额类别
  const amountCategories = [
    { key: 'service', label: '产数服务' },
    { key: 'standard', label: '产数标品' },
    { key: 'basic', label: '基本面' },
    { key: 'equipment', label: '设备销售' },
    { key: 'agency', label: '代收代付' },
  ];

  // 底部按钮操作
  const handleCopy = () => {
    const data = {
      oppName: mockDetail.oppName,
      contractName: mockDetail.contractName,
      projectName: mockDetail.projectName,
      totalAmount: mockDetail.totalAmount,
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert('已复制到剪贴板');
  };

  const handleSyncEip = () => {
    alert('同步EIP成功');
  };

  const handleSync30 = () => {
    alert('同步3.0成功');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
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
            录收查看
          </h1>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="px-4 py-4 space-y-3">
        {/* 基本信息卡片 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('basic')}
            className="w-full p-4 flex items-center justify-between"
          >
            <span className="text-sm font-medium text-gray-900">基本信息</span>
            {expandedSection.includes('basic') ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {expandedSection.includes('basic') && (
            <div className="px-4 pb-4 space-y-3">
              {/* 状态标签和最新录收时间 */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[mockDetail.status].bg} ${statusConfig[mockDetail.status].text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[mockDetail.status].dot}`}></span>
                  {mockDetail.status}
                </span>
                <span className="text-xs text-gray-400">
                  最新录收: {mockDetail.lastRevenueTime}
                </span>
              </div>

              {/* 商机名称 */}
              <h2 className="text-base font-medium text-gray-900">
                {mockDetail.oppName}
              </h2>

              {/* 编码信息 */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-xs text-gray-500">客户名称</div>
                  <div className="text-gray-900">{mockDetail.customerName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">客户编码</div>
                  <div className="text-gray-900">{mockDetail.customerCode}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">商机编码</div>
                  <div className="text-gray-900">{mockDetail.oppCode}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">合同编码</div>
                  <div className="text-gray-900">{mockDetail.contractCode}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">项目名称</div>
                  <div className="text-gray-900">{mockDetail.projectName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">项目编码</div>
                  <div className="text-gray-900">{mockDetail.projectCode}</div>
                </div>
              </div>

              {/* 合同信息 */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                <div className="text-xs text-gray-500">合同信息</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">合同名称</div>
                    <div className="text-gray-900">{mockDetail.contractName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">合同金额</div>
                    <div className="text-blue-600 font-medium">¥{mockDetail.contractAmount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">确认录收金额</div>
                    <div className="text-green-600 font-medium">¥{mockDetail.contractConfirmedRevenue}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">未确认录收金额</div>
                    <div className="text-orange-600 font-medium">¥{mockDetail.contractUnconfirmedRevenue}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">累计确认收款</div>
                    <div className="text-gray-900">¥{mockDetail.contractTotalReceived}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">剩余未收款</div>
                    <div className="text-red-600 font-medium">¥{mockDetail.contractRemainingReceived}</div>
                  </div>
                </div>
              </div>

              {/* 收支匹配状态 */}
              <div className={`rounded-xl p-3 ${isMismatchOver10() ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                <div className="flex items-center gap-2">
                  {isMismatchOver10() ? (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  <div>
                    <div className={`text-sm font-medium ${isMismatchOver10() ? 'text-red-700' : 'text-green-700'}`}>
                      {isMismatchOver10() ? '⚠️ 收支不匹配超10%' : '✓ 收支匹配正常'}
                    </div>
                    <div className={`text-lg font-bold ${isMismatchOver10() ? 'text-red-600' : 'text-green-600'}`}>
                      {calculateMismatch()}%
                    </div>
                  </div>
                </div>
              </div>

              {/* 项目进度 */}
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-500 mb-2">当前项目截止当月</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>计划列收: <span className="font-medium text-blue-600">{mockDetail.planRevenue}</span></div>
                  <div>已列收: <span className="font-medium text-green-600">{mockDetail.actualRevenue}</span></div>
                  <div>计划列账: <span className="font-medium text-blue-600">{mockDetail.planAccount}</span></div>
                  <div>已列支: <span className="font-medium text-green-600">{mockDetail.actualAccount}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 金额明细卡片 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('amount')}
            className="w-full p-4 flex items-center justify-between"
          >
            <span className="text-sm font-medium text-gray-900">金额明细</span>
            {expandedSection.includes('amount') ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {expandedSection.includes('amount') && (
            <div className="px-4 pb-4">
              {/* 金额概览 */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">项目总金额</div>
                  <div className="text-sm font-medium text-gray-900">¥{mockDetail.totalAmount}</div>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-green-600 mb-1">已确认金额</div>
                  <div className="text-sm font-medium text-green-600">¥{mockDetail.confirmedAmount}</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-orange-600 mb-1">未确认金额</div>
                  <div className="text-sm font-medium text-orange-600">¥{mockDetail.unconfirmedAmount}</div>
                </div>
              </div>

              {/* 金额明细表格 */}
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <div className="grid grid-cols-4 gap-2 text-xs text-gray-500 p-3 border-b border-gray-200 bg-white">
                  <div>类别</div>
                  <div className="text-right">项目总金额</div>
                  <div className="text-right">已确认</div>
                  <div className="text-right">未确认</div>
                </div>
                {amountCategories.map((cat) => (
                  <div key={cat.key} className="grid grid-cols-4 gap-2 text-sm p-3 border-b border-gray-100 last:border-0 bg-white">
                    <div className="text-gray-700">{cat.label}</div>
                    <div className="text-right text-gray-900">¥{mockDetail.totalAmountDetail[cat.key as keyof typeof mockDetail.totalAmountDetail]}</div>
                    <div className="text-right text-green-600">¥{mockDetail.confirmedAmountDetail[cat.key as keyof typeof mockDetail.confirmedAmountDetail]}</div>
                    <div className="text-right text-orange-600">¥{mockDetail.unconfirmedAmountDetail[cat.key as keyof typeof mockDetail.unconfirmedAmountDetail]}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 录收审批单卡片 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('approval')}
            className="w-full p-4 flex items-center justify-between"
          >
            <span className="text-sm font-medium text-gray-900">
              录收审批单 {currentApproval ? `(第${currentApproval.index}期)` : `(${mockDetail.approvalList.length})`}
            </span>
            {expandedSection.includes('approval') ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {expandedSection.includes('approval') && (
            <div className="px-4 pb-4 space-y-2">
              {(currentApproval ? [currentApproval] : mockDetail.approvalList).map((approval) => {
                const apStatus = approvalStatusConfig[approval.eipStatus] || { bg: 'bg-gray-100', text: 'text-gray-600' };
                return (
                  <div key={approval.id} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium">
                          {approval.index}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{approval.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${apStatus.bg} ${apStatus.text}`}>
                          {approval.eipStatus}
                        </span>
                        <span className="text-sm font-medium text-green-600">¥{approval.amount}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 pl-8">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>EIP文号: {approval.eipNumber}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(approval.eipNumber)}
                          className="p-0.5 hover:bg-gray-200 rounded"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <div>起草部门: {approval.draftDept}</div>
                      <div>同步EIP: {approval.syncEipTime}</div>
                      <div>同步30: {approval.sync30Time}</div>
                      <div>预占工单: {approval.presaleOrderNo}</div>
                      <div>工单编码: {approval.orderCode}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 其他渠道录收卡片 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('other')}
            className="w-full p-4 flex items-center justify-between"
          >
            <span className="text-sm font-medium text-gray-900">
              其他渠道录收 ({mockDetail.otherChannelList.length})
            </span>
            {expandedSection.includes('other') ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {expandedSection.includes('other') && (
            <div className="px-4 pb-4 space-y-2">
              {mockDetail.otherChannelList.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-gray-200 text-gray-600 rounded text-xs flex items-center justify-center font-medium">
                        {item.index}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{item.productRevenue}</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">¥{item.amountWithoutTax}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 pl-7">
                    <div>合同: {item.contractCode}</div>
                    <div>账期: {item.billingPeriod}</div>
                    <div>收入项编码: {item.productRevenueCode}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 六到位附件卡片 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('sixposition')}
            className="w-full p-4 flex items-center justify-between"
          >
            <span className="text-sm font-medium text-gray-900">六到位附件情况</span>
            {expandedSection.includes('sixposition') ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {expandedSection.includes('sixposition') && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                {sixPositionData.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-xl p-3 ${
                      item.status === '已录入' ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-2 h-2 rounded-full ${
                        item.status === '已录入' ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className={`text-xs font-medium ${
                        item.status === '已录入' ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        六到位-{item.name}
                      </span>
                    </div>
                    <div className={`text-xs ${
                      item.status === '已录入' ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {item.status}
                      {item.attachments.length > 0 && ` (${item.attachments.length})`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <Copy className="w-4 h-4" />
            复制
          </button>
          <button
            onClick={handleSyncEip}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            同步EIP
          </button>
          <button
            onClick={handleSync30}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            同步3.0
          </button>
        </div>
      </div>
    </div>
  );
}