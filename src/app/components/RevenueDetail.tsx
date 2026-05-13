import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ChevronLeft, ChevronDown, ChevronUp, Copy, CheckCircle,
  Clock, FileText, User, Building, DollarSign
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
  status: '录收完成',
  lastRevenueTime: '2026-05-10 09:30',
  totalAmount: '500,000.00',
  confirmedAmount: '450,000.00',
  unconfirmedAmount: '50,000.00',
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
    { id: 'a1', index: 1, name: '2026年4月服务费确认', amount: '50,000.00', eipNumber: 'EIP20260415001', eipDocId: 'DOC001', draftDept: '杭州分公司', syncEipTime: '2026-04-15 10:30', eipStatus: '审核通过', presaleOrderNo: 'PSO202604001', orderId: 'ORD001', orderCode: 'ORD202604001', sync30Time: '2026-04-16 09:00' },
    { id: 'a2', index: 2, name: '2026年3月服务费确认', amount: '50,000.00', eipNumber: 'EIP20260315002', eipDocId: 'DOC002', draftDept: '杭州分公司', syncEipTime: '2026-03-15 10:30', eipStatus: '审核通过', presaleOrderNo: 'PSO202603001', orderId: 'ORD002', orderCode: 'ORD202603001', sync30Time: '2026-03-16 09:00' },
    { id: 'a3', index: 3, name: '2026年2月服务费确认', amount: '50,000.00', eipNumber: 'EIP20260215003', eipDocId: 'DOC003', draftDept: '杭州分公司', syncEipTime: '2026-02-15 10:30', eipStatus: '审核通过', presaleOrderNo: 'PSO202602001', orderId: 'ORD003', orderCode: 'ORD202602001', sync30Time: '2026-02-16 09:00' },
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

export function RevenueDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [expandedAmount, setExpandedAmount] = useState(false);
  const [expandedApproval, setExpandedApproval] = useState<string | null>(null);

  const detail = mockDetail;
  const statusStyle = statusConfig[detail.status];

  // 金额类别
  const amountCategories = [
    { key: 'service', label: '产数服务' },
    { key: 'standard', label: '产数标品' },
    { key: 'basic', label: '基本面' },
    { key: 'equipment', label: '设备销售' },
    { key: 'agency', label: '代收代付' },
  ];

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
            录收详情
          </h1>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="px-4 py-4 space-y-4">
        {/* 基本信息卡片 */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          {/* 状态标签 */}
          <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
              {detail.status}
            </span>
            <span className="text-sm text-gray-400">
              最新录收: {detail.lastRevenueTime}
            </span>
          </div>

          {/* 商机名称 */}
          <h2 className="text-base font-medium text-gray-900 mb-4">
            {detail.oppName}
          </h2>

          {/* 基本信息 */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">商机编码:</span>
              <span className="text-gray-900">{detail.oppCode}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">合同名称:</span>
              <span className="text-gray-900">{detail.contractName}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">合同编码:</span>
              <span className="text-gray-900">{detail.contractCode}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">项目名称:</span>
              <span className="text-gray-900">{detail.projectName}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">项目编码:</span>
              <span className="text-gray-900">{detail.projectCode}</span>
            </div>
          </div>
        </div>

        {/* 金额信息卡片 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setExpandedAmount(!expandedAmount)}
            className="w-full p-4 flex items-center justify-between"
          >
            <span className="text-sm font-medium text-gray-900">金额明细</span>
            {expandedAmount ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* 金额概览 */}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">项目总金额</div>
                <div className="text-sm font-medium text-gray-900">¥{detail.totalAmount}</div>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <div className="text-xs text-green-600 mb-1">已确认金额</div>
                <div className="text-sm font-medium text-green-600">¥{detail.confirmedAmount}</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-3 text-center">
                <div className="text-xs text-orange-600 mb-1">未确认金额</div>
                <div className="text-sm font-medium text-orange-600">¥{detail.unconfirmedAmount}</div>
              </div>
            </div>
          </div>

          {/* 展开的金额明细 */}
          {expandedAmount && (
            <div className="border-t border-gray-100 px-4 py-4 bg-gray-50">
              <div className="space-y-4">
                {/* 表头 */}
                <div className="grid grid-cols-4 gap-2 text-xs text-gray-500 pb-2 border-b border-gray-200">
                  <div className="text-center">类别</div>
                  <div className="text-right">项目总金额</div>
                  <div className="text-right">已确认</div>
                  <div className="text-right">未确认</div>
                </div>

                {/* 数据行 */}
                {amountCategories.map((cat) => (
                  <div key={cat.key} className="grid grid-cols-4 gap-2 text-sm">
                    <div className="text-center text-gray-700">{cat.label}</div>
                    <div className="text-right text-gray-900">¥{detail.totalAmountDetail[cat.key as keyof typeof detail.totalAmountDetail]}</div>
                    <div className="text-right text-green-600">¥{detail.confirmedAmountDetail[cat.key as keyof typeof detail.confirmedAmountDetail]}</div>
                    <div className="text-right text-orange-600">¥{detail.unconfirmedAmountDetail[cat.key as keyof typeof detail.unconfirmedAmountDetail]}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 录收审批单列表 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-900">
              录收审批单 ({detail.approvalList.length})
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {detail.approvalList.map((approval) => {
              const isExpanded = expandedApproval === approval.id;
              const statusStyle = approvalStatusConfig[approval.eipStatus] || { bg: 'bg-gray-100', text: 'text-gray-600' };

              return (
                <div key={approval.id}>
                  <button
                    onClick={() => setExpandedApproval(isExpanded ? null : approval.id)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium">
                        {approval.index}
                      </span>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">{approval.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">¥{approval.amount}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                        {approval.eipStatus}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 bg-gray-50">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-xs text-gray-500">EIP文号</div>
                          <div className="text-gray-900 mt-0.5 flex items-center gap-1">
                            {approval.eipNumber}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(approval.eipNumber);
                              }}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Copy className="w-3 h-3 text-gray-400" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">EIP文档ID</div>
                          <div className="text-gray-900 mt-0.5">{approval.eipDocId}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">起草部门</div>
                          <div className="text-gray-900 mt-0.5">{approval.draftDept}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">同步EIP时间</div>
                          <div className="text-gray-900 mt-0.5">{approval.syncEipTime}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">预占工单号</div>
                          <div className="text-gray-900 mt-0.5">{approval.presaleOrderNo}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">工单ID</div>
                          <div className="text-gray-900 mt-0.5">{approval.orderId}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">工单编码</div>
                          <div className="text-gray-900 mt-0.5">{approval.orderCode}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">同步30时间</div>
                          <div className="text-gray-900 mt-0.5">{approval.sync30Time}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 其他渠道录收列表 */}
        {detail.otherChannelList.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-900">
                其他渠道录收 ({detail.otherChannelList.length})
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {detail.otherChannelList.map((item) => (
                <div key={item.id} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-gray-100 text-gray-600 rounded text-xs flex items-center justify-center font-medium">
                        {item.index}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{item.productRevenue}</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">¥{item.amountWithoutTax}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pl-7">
                    <div>合同: {item.contractCode}</div>
                    <div>账期: {item.billingPeriod}</div>
                    <div>收入项编码: {item.productRevenueCode}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <button
          onClick={() => navigate('/revenue-apply')}
          className="w-full py-3 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          申请新录收
        </button>
      </div>
    </div>
  );
}
