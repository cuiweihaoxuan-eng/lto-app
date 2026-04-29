import { useState, useEffect } from 'react';
import { X, Search, ChevronDown, AlertTriangle } from 'lucide-react';

interface Opportunity {
  id: string;
  code: string;
  name: string;
  customerName: string;
  customerCode: string;
  amount: number;
  createTime: string;
  accountManager: string;
  accountManagerPhone: string;
  hasLinkedInfo: boolean;
}

interface LinkOpportunityDialogProps {
  open: boolean;
  onClose: () => void;
  businessInfo: any; // 业务信息
}

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    code: '20260409HZA5',
    name: '杭州市云数智能综合高阶政企客户经理段丽华的商机',
    customerName: '阿里巴巴',
    customerCode: 'zj3242353',
    amount: 0,
    createTime: '2026-04-09 18:40:13',
    accountManager: '段丽华',
    accountManagerPhone: '13800138000',
    hasLinkedInfo: false,
  },
  {
    id: '2',
    code: '20260409HZA6',
    name: '2026年杭州北至科技有限公司...',
    customerName: '安讯网络技术（杭州）有限公司',
    customerCode: 'zj8901234',
    amount: 50,
    createTime: '2026-04-09 18:38:01',
    accountManager: '李明',
    accountManagerPhone: '13800138001',
    hasLinkedInfo: true,
  },
  {
    id: '3',
    code: '20260409TZA6',
    name: '中国联合医院基业部政府公关',
    customerName: '浙江大学医学院附属第一医院',
    customerCode: 'zj5678901',
    amount: 120,
    createTime: '2026-04-09 18:30:52',
    accountManager: '张三',
    accountManagerPhone: '13800138002',
    hasLinkedInfo: false,
  },
  {
    id: '4',
    code: '20260409SXA9',
    name: '杭州元云凯尔文化创意产业...',
    customerName: '杭州元云凯尔文化创意有限公司',
    customerCode: 'zj1234567',
    amount: 80,
    createTime: '2026-04-09 18:26:35',
    accountManager: '王五',
    accountManagerPhone: '13800138003',
    hasLinkedInfo: false,
  },
  {
    id: '5',
    code: '20260409SXA10',
    name: '杭州元安全京工保校及...',
    customerName: '浙江电信',
    customerCode: 'zj9876543',
    amount: 200,
    createTime: '2026-04-09 18:21:08',
    accountManager: '赵六',
    accountManagerPhone: '13800138004',
    hasLinkedInfo: true,
  },
];

type FilterType = 'customer' | 'time' | 'linkStatus' | 'manager' | null;

export function LinkOpportunityDialog({ open, onClose, businessInfo }: LinkOpportunityDialogProps) {
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [showReminder, setShowReminder] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [reminderChecked, setReminderChecked] = useState(false);

  // Filter states
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedLinkStatus, setSelectedLinkStatus] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [managerSearch, setManagerSearch] = useState('');

  if (!open) return null;

  useEffect(() => {
    if (open) {
      setShowReminder(true);
      setReminderChecked(false);
    }
  }, [open]);

  const handleConfirmClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    if (selectedOpp) {
      console.log('关联商机:', selectedOpp);
    }
    setShowConfirmDialog(false);
    setReminderChecked(false);
    onClose();
  };

  const customers = ['商机录入', '安讯网络技术（杭州）有限公司', '浙江电信', '宁波市政府'];
  const linkStatuses = ['未关联', '已关联'];
  const managers = ['段丽华', '李明', '张三', '王五', '赵六'];

  const filteredCustomers = customers.filter(c => c.includes(customerSearch));
  const filteredManagers = managers.filter(m => m.includes(managerSearch));

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">关联已有商机</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b p-4 space-y-3">
        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="请输入商机名称、商机编码"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveFilter('customer')}
            className="px-3 py-1.5 text-sm border rounded-lg whitespace-nowrap flex items-center gap-1 bg-white hover:bg-gray-50"
          >
            客户{selectedCustomer && ': ' + selectedCustomer}
            <ChevronDown className="w-3 h-3" />
          </button>
          <button
            onClick={() => setActiveFilter('time')}
            className="px-3 py-1.5 text-sm border rounded-lg whitespace-nowrap flex items-center gap-1 bg-white hover:bg-gray-50"
          >
            时间
            <ChevronDown className="w-3 h-3" />
          </button>
          <button
            onClick={() => setActiveFilter('linkStatus')}
            className="px-3 py-1.5 text-sm border rounded-lg whitespace-nowrap flex items-center gap-1 bg-white hover:bg-gray-50"
          >
            关联状态{selectedLinkStatus && ': ' + selectedLinkStatus}
            <ChevronDown className="w-3 h-3" />
          </button>
          <button
            onClick={() => setActiveFilter('manager')}
            className="px-3 py-1.5 text-sm border rounded-lg whitespace-nowrap flex items-center gap-1 bg-white hover:bg-gray-50"
          >
            客户经理{selectedManager && ': ' + selectedManager}
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 重要提醒Banner */}
      {showReminder && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium text-yellow-800 mb-1">重要提醒</div>
              <div className="text-sm text-yellow-700">
                商情中标前30天内请勿对关联的商机作以下两类修改(如强行修改，集团会判为虚假商机，算作漏单!!!):
                <ol className="list-decimal list-inside mt-1 ml-2 space-y-0.5">
                  <li>客户名称变更</li>
                  <li>商机名称+商机金额+客户需求同时变更</li>
                </ol>
              </div>
            </div>
            <button onClick={() => setShowReminder(false)} className="text-yellow-600 hover:text-yellow-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Opportunity List */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y">
          {mockOpportunities.map((opp) => (
            <div
              key={opp.id}
              onClick={() => setSelectedOpp(selectedOpp?.id === opp.id ? null : opp)}
              className={`p-4 cursor-pointer transition-colors ${
                selectedOpp?.id === opp.id ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Radio/Checkbox */}
                <div className="mt-1">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedOpp?.id === opp.id ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}>
                    {selectedOpp?.id === opp.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="text-sm font-medium text-gray-900">{opp.name} - {opp.code}</div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                      {opp.customerName}（{opp.customerCode}）
                    </span>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded font-medium">
                      {opp.amount}万
                    </span>
                    {opp.hasLinkedInfo && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                        已关联其他商情
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-gray-600">
                    <div>
                      <span className="text-gray-500">创建时间：</span>{opp.createTime}
                    </div>
                    <div>
                      <span className="text-gray-500">客户经理：</span>
                      {opp.accountManager}（{opp.accountManagerPhone}）
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t p-4 flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          取消
        </button>
        <button
          onClick={handleConfirmClick}
          disabled={!selectedOpp}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          确定
        </button>
      </div>

      {/* 确认关联弹窗 */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">重要提醒</h3>
              </div>
              <div className="text-sm text-gray-700 mb-4">
                商情中标前30天内请勿对关联的商机作以下两类修改(如强行修改，集团会判为虚假商机，算作漏单!!!):
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>客户名称变更</li>
                  <li>商机名称+商机金额+客户需求同时变更</li>
                </ol>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                <input
                  type="checkbox"
                  checked={reminderChecked}
                  onChange={(e) => setReminderChecked(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                我已知悉上述提醒
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!reminderChecked}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  确认关联
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Dialogs */}
      {activeFilter === 'customer' && (
        <div className="fixed inset-0 bg-black/30 z-10 flex items-end" onClick={() => setActiveFilter(null)}>
          <div className="bg-white w-full max-h-[60vh] rounded-t-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium">选择客户</h3>
              <button onClick={() => setActiveFilter(null)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <input
                type="text"
                placeholder="搜索客户"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm mb-3"
              />
              <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setActiveFilter(null);
                    }}
                    className={`p-3 rounded-lg cursor-pointer ${
                      selectedCustomer === customer ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    {customer}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeFilter === 'time' && (
        <div className="fixed inset-0 bg-black/30 z-10 flex items-end" onClick={() => setActiveFilter(null)}>
          <div className="bg-white w-full max-h-[60vh] rounded-t-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium">选择时间</h3>
              <button onClick={() => setActiveFilter(null)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <div className="p-3 border rounded-lg">
                  <label className="text-sm text-gray-600">开始时间</label>
                  <input type="date" className="w-full mt-1 px-2 py-1 border rounded" />
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="text-sm text-gray-600">结束时间</label>
                  <input type="date" className="w-full mt-1 px-2 py-1 border rounded" />
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setActiveFilter(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => setActiveFilter(null)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    确定
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeFilter === 'linkStatus' && (
        <div className="fixed inset-0 bg-black/30 z-10 flex items-end" onClick={() => setActiveFilter(null)}>
          <div className="bg-white w-full max-h-[60vh] rounded-t-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium">选择关联状态</h3>
              <button onClick={() => setActiveFilter(null)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {linkStatuses.map((status) => (
                <div
                  key={status}
                  onClick={() => {
                    setSelectedLinkStatus(status);
                    setActiveFilter(null);
                  }}
                  className={`p-3 rounded-lg cursor-pointer ${
                    selectedLinkStatus === status ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                  }`}
                >
                  {status}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeFilter === 'manager' && (
        <div className="fixed inset-0 bg-black/30 z-10 flex items-end" onClick={() => setActiveFilter(null)}>
          <div className="bg-white w-full max-h-[60vh] rounded-t-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium">选择客户经理</h3>
              <button onClick={() => setActiveFilter(null)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <input
                type="text"
                placeholder="搜索客户经理"
                value={managerSearch}
                onChange={(e) => setManagerSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm mb-3"
              />
              <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                {filteredManagers.map((manager) => (
                  <div
                    key={manager}
                    onClick={() => {
                      setSelectedManager(manager);
                      setActiveFilter(null);
                    }}
                    className={`p-3 rounded-lg cursor-pointer ${
                      selectedManager === manager ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    {manager}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}