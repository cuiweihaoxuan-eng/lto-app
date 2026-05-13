import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ChevronLeft, Search, X, ChevronDown, ChevronUp,
  CheckCircle, AlertTriangle, FileText, Upload, ChevronRight, Copy
} from 'lucide-react';

// 合同/项目类型
interface ContractProject {
  id: string;
  customerName: string;
  customerCode: string;
  contractName: string;
  contractCode: string;
  contractAmount: string;
  projectName: string;
  projectCode: string;
  contractConfirmedRevenue: string;
  contractUnconfirmedRevenue: string;
  contractTotalReceived: string;
  contractRemainingReceived: string;
  planRevenue: string;
  actualRevenue: string;
  planAccount: string;
  actualAccount: string;
}

// 收入计划类型
interface RevenuePlan {
  id: string;
  index: number;
  productRevenue: string;
  businessType: string;
  invoiceType: string;
  taxRate: string;
  planConfirmTotalWithTax: string;
  planConfirmTotalWithoutTax: string;
  estimatedConfirmDate: string;
  revenueTriggerSystem: string;
  planStatus: '待确认' | '已确认';
  summary: string;
  type: '周期性' | '非周期性';
}

// Mock数据
const mockContracts: ContractProject[] = [
  {
    id: '1',
    customerName: '中国邮政速递物流股份有限公司台州市分公司',
    customerCode: 'ZJ2019060400004795',
    contractName: '台州邮政ICT服务合同',
    contractCode: 'HT202604001',
    contractAmount: '500,000.00',
    projectName: '台州邮政ICT实施项目',
    projectCode: 'XM202604001',
    contractConfirmedRevenue: '450,000.00',
    contractUnconfirmedRevenue: '50,000.00',
    contractTotalReceived: '480,000.00',
    contractRemainingReceived: '20,000.00',
    planRevenue: '50,000.00',
    actualRevenue: '48,000.00',
    planAccount: '52,000.00',
    actualAccount: '50,000.00',
  },
  {
    id: '2',
    customerName: '中国美术学院',
    customerCode: 'ZJ2020010100001234',
    contractName: '算力服务合同',
    contractCode: 'HT202604002',
    contractAmount: '200,000.00',
    projectName: '校园算力建设',
    projectCode: 'XM202604002',
    contractConfirmedRevenue: '80,000.00',
    contractUnconfirmedRevenue: '120,000.00',
    contractTotalReceived: '80,000.00',
    contractRemainingReceived: '120,000.00',
    planRevenue: '30,000.00',
    actualRevenue: '28,000.00',
    planAccount: '30,000.00',
    actualAccount: '28,000.00',
  },
  {
    id: '3',
    customerName: '宁波港集团有限公司',
    customerCode: 'ZJ2019051500001234',
    contractName: '宁波港数字化转型合同',
    contractCode: 'HT202604003',
    contractAmount: '800,000.00',
    projectName: '数字化转型一期',
    projectCode: 'XM202604003',
    contractConfirmedRevenue: '0.00',
    contractUnconfirmedRevenue: '800,000.00',
    contractTotalReceived: '0.00',
    contractRemainingReceived: '800,000.00',
    planRevenue: '100,000.00',
    actualRevenue: '85,000.00',
    planAccount: '100,000.00',
    actualAccount: '95,000.00',
  },
];

const mockPeriodicPlans: RevenuePlan[] = [
  { id: 'p1', index: 1, productRevenue: 'ICT服务费', businessType: '产数服务', invoiceType: '增值税专用发票', taxRate: '6%', planConfirmTotalWithTax: '10,000.00', planConfirmTotalWithoutTax: '9,433.96', estimatedConfirmDate: '2026-05-15', revenueTriggerSystem: 'BOSS系统', planStatus: '待确认', summary: '5月ICT服务费确认', type: '周期性' },
  { id: 'p2', index: 2, productRevenue: '运维服务费', businessType: '产数服务', invoiceType: '增值税专用发票', taxRate: '6%', planConfirmTotalWithTax: '5,000.00', planConfirmTotalWithoutTax: '4,716.98', estimatedConfirmDate: '2026-05-20', revenueTriggerSystem: 'BOSS系统', planStatus: '待确认', summary: '5月运维服务费确认', type: '周期性' },
  { id: 'p3', index: 3, productRevenue: '技术支持费', businessType: '产数服务', invoiceType: '增值税专用发票', taxRate: '6%', planConfirmTotalWithTax: '8,000.00', planConfirmTotalWithoutTax: '7,547.17', estimatedConfirmDate: '2026-05-25', revenueTriggerSystem: 'BOSS系统', planStatus: '已确认', summary: '5月技术支持费确认', type: '周期性' },
];

const mockNonPeriodicPlans: RevenuePlan[] = [
  { id: 'np1', index: 1, productRevenue: '设备销售-服务器', businessType: '设备销售', invoiceType: '增值税专用发票', taxRate: '13%', planConfirmTotalWithTax: '113,000.00', planConfirmTotalWithoutTax: '100,000.00', estimatedConfirmDate: '2026-06-01', revenueTriggerSystem: 'BOSS系统', planStatus: '待确认', summary: '服务器销售确认', type: '非周期性' },
  { id: 'np2', index: 1, productRevenue: '软件授权费', businessType: '产数标品', invoiceType: '增值税专用发票', taxRate: '13%', planConfirmTotalWithTax: '33,900.00', planConfirmTotalWithoutTax: '30,000.00', estimatedConfirmDate: '2026-06-15', revenueTriggerSystem: 'BOSS系统', planStatus: '待确认', summary: '软件授权确认', type: '非周期性' },
];

// 六到位状态
const sixPositionData = [
  { id: 'customer', name: '客情掌握', status: '已录入', attachments: ['客户档案清单.xlsx', '拜访记录汇总.pdf'] },
  { id: 'plan', name: '方案总控', status: '已录入', attachments: ['团队组建方案.docx', '方案设计模板.pdf'] },
  { id: 'bidding', name: '谈判/应标自主', status: '未录入', attachments: [] },
  { id: 'procurement', name: '采购自主', status: '已录入', attachments: ['采购决策审批单.pdf'] },
  { id: 'project', name: '项目强管控', status: '已录入', attachments: ['项目总体设计方案.docx', '验收报告.pdf'] },
  { id: 'maintenance', name: '运维自主', status: '未录入', attachments: [] },
];

export function RevenueApplyForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showContractPicker, setShowContractPicker] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedContract, setSelectedContract] = useState<ContractProject | null>(null);
  const [selectedPlans, setSelectedPlans] = useState<Set<string>>(new Set());
  const [planTab, setPlanTab] = useState<'periodic' | 'nonPeriodic'>('periodic');
  const [applyReason, setApplyReason] = useState('');
  const [showSixPosition, setShowSixPosition] = useState(false);
  const [showContractInfo, setShowContractInfo] = useState(true);
  const [showIncomePlan, setShowIncomePlan] = useState(true);

  // 计算收支不匹配
  const calculateMismatch = () => {
    if (!selectedContract) return 0;
    const plan = parseFloat(selectedContract.planRevenue.replace(/,/g, '')) || 0;
    const actual = parseFloat(selectedContract.actualRevenue.replace(/,/g, '')) || 0;
    if (plan === 0) return 0;
    return Math.abs((plan - actual) / plan * 100).toFixed(2);
  };

  const isMismatchOver10 = () => {
    const mismatch = parseFloat(calculateMismatch());
    return mismatch > 10;
  };

  // 过滤合同
  const filteredContracts = mockContracts.filter(c =>
    !searchText ||
    c.customerName.includes(searchText) ||
    c.contractName.includes(searchText) ||
    c.projectName.includes(searchText)
  );

  // 切换选择计划
  const togglePlan = (id: string) => {
    setSelectedPlans(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // 提交申请
  const handleSubmit = () => {
    alert('录收申请已提交！');
    navigate('/revenue-management');
  };

  // 下一步是否可以点击
  const canNextStep2 = selectedContract !== null;
  const canSubmit = selectedContract !== null && selectedPlans.size > 0 && applyReason.trim() !== '';

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
            申请录收
          </h1>
        </div>

        {/* 步骤指示器 */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <span className={`text-sm ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>选择合同</span>
            </div>
            <div className={`flex-1 h-0.5 mx-3 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`} />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className={`text-sm ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>选择计划</span>
            </div>
            <div className={`flex-1 h-0.5 mx-3 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`} />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
              <span className={`text-sm ${step >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>提交</span>
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="px-4 py-4 pb-24">
        {/* 步骤1：选择合同/项目 */}
        {step === 1 && (
          <div className="space-y-4">
            {/* 已选合同卡片 */}
            {selectedContract ? (
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-900">已选合同</span>
                  <button
                    onClick={() => setShowContractPicker(true)}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    重新选择
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500">客户名称</div>
                    <div className="text-sm text-gray-900 mt-0.5">{selectedContract.customerName}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500">合同名称</div>
                      <div className="text-sm text-gray-900 mt-0.5">{selectedContract.contractName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">合同编码</div>
                      <div className="text-sm text-gray-900 mt-0.5">{selectedContract.contractCode}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500">项目名称</div>
                      <div className="text-sm text-gray-900 mt-0.5">{selectedContract.projectName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">合同金额</div>
                      <div className="text-sm font-medium text-blue-600 mt-0.5">¥{selectedContract.contractAmount}</div>
                    </div>
                  </div>

                  {/* 收支状态 */}
                  <div className={`rounded-xl p-3 mt-3 ${
                    isMismatchOver10() ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
                  }`}>
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
                      <div>计划列收: <span className="font-medium text-blue-600">{selectedContract.planRevenue}</span></div>
                      <div>已列收: <span className="font-medium text-green-600">{selectedContract.actualRevenue}</span></div>
                      <div>计划列账: <span className="font-medium text-blue-600">{selectedContract.planAccount}</span></div>
                      <div>已列支: <span className="font-medium text-green-600">{selectedContract.actualAccount}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowContractPicker(true)}
                className="w-full bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center gap-3"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-gray-900 font-medium">选择合同/项目</span>
                <span className="text-sm text-gray-400">点击选择要录收的合同和项目</span>
              </button>
            )}
          </div>
        )}

        {/* 步骤2：选择收入计划 */}
        {step === 2 && selectedContract && (
          <div className="space-y-4">
            {/* Tab切换 */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setPlanTab('periodic')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    planTab === 'periodic' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
                  }`}
                >
                  周期性收入计划
                </button>
                <button
                  onClick={() => setPlanTab('nonPeriodic')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    planTab === 'nonPeriodic' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
                  }`}
                >
                  非周期性收入计划
                </button>
              </div>

              {/* 计划列表 */}
              <div className="divide-y divide-gray-100">
                {(planTab === 'periodic' ? mockPeriodicPlans : mockNonPeriodicPlans).map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => togglePlan(plan.id)}
                    className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                      selectedPlans.has(plan.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedPlans.has(plan.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}>
                      {selectedPlans.has(plan.id) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{plan.productRevenue}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          plan.planStatus === '已确认' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {plan.planStatus}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{plan.businessType}</span>
                        <span>税率: {plan.taxRate}</span>
                        <span>{plan.estimatedConfirmDate}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-medium text-blue-600">¥{plan.planConfirmTotalWithTax}</div>
                      <div className="text-xs text-gray-400">含税</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 已选计划统计 */}
            {selectedPlans.size > 0 && (
              <div className="bg-blue-50 rounded-2xl p-4">
                <div className="text-sm font-medium text-blue-900 mb-2">
                  已选择 {selectedPlans.size} 个收入计划
                </div>
                <div className="text-sm text-blue-700">
                  预计确认金额: ¥
                  {(planTab === 'periodic' ? mockPeriodicPlans : mockNonPeriodicPlans)
                    .filter(p => selectedPlans.has(p.id))
                    .reduce((sum, p) => sum + parseFloat(p.planConfirmTotalWithTax.replace(/,/g, '')), 0)
                    .toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 步骤3：填写申请事由 */}
        {step === 3 && (
          <div className="space-y-4">
            {/* 申请事由 */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                申请事由 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={applyReason}
                onChange={(e) => setApplyReason(e.target.value)}
                placeholder="请输入申请事由..."
                rows={4}
                className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 六到位附件 */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-900">六到位附件情况</span>
                <button
                  onClick={() => setShowSixPosition(!showSixPosition)}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  {showSixPosition ? '收起' : '查看详情'}
                </button>
              </div>

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
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 形象进度表上传 */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <span className="text-sm font-medium text-gray-900 mb-2 block">形象进度表</span>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-500">点击上传文件</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              上一步
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !canNextStep2}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                (step === 1 && !canNextStep2) || (step === 2 && selectedPlans.size === 0)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              下一步
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                !canSubmit
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              提交申请
            </button>
          )}
        </div>
      </div>

      {/* 合同选择弹窗 */}
      {showContractPicker && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-base font-medium text-gray-900">选择合同/项目</span>
              <button
                onClick={() => setShowContractPicker(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="px-4 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索客户、合同、项目..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
              {filteredContracts.map((contract) => (
                <button
                  key={contract.id}
                  onClick={() => {
                    setSelectedContract(contract);
                    setShowContractPicker(false);
                  }}
                  className={`w-full p-4 rounded-xl text-left transition-colors ${
                    selectedContract?.id === contract.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {contract.contractName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {contract.projectName} | ¥{contract.contractAmount}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
