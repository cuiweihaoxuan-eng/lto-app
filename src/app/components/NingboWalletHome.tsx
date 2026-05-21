import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MoreHorizontal, ChevronDown, Calendar } from 'lucide-react';

// 模拟数据
const mockMyOppData = {
  totalReward: '8500.00',
  poolBonus: '21',
  rkZj: '5',
  rkQx: '3',
  rkCity: '8',
};

const mockManagedOppData = [
  { name: '镇海', color: '#EF4444', percent: '25%', used: '5万', total: '20万' },
  { name: '前湾新区', color: '#F59E0B', percent: '20%', used: '4万', total: '20万' },
  { name: '北仑', color: '#22C55E', percent: '15%', used: '3万', total: '20万' },
  { name: '鄞州', color: '#3B82F6', percent: '15%', used: '3万', total: '20万' },
  { name: '江北', color: '#8B5CF6', percent: '10%', used: '2万', total: '20万' },
  { name: '海曙', color: '#EC4899', percent: '8%', used: '1.6万', total: '20万' },
];

const mockRewardData = {
  validOppBonus: [
    { type: '本月已发放', typeClass: 'type-blue', amount: '8500.00', count: '5' },
    { type: '今年累计发放', typeClass: 'type-green', amount: '125000.00', count: '42' },
    { type: '待审核', typeClass: 'type-orange', amount: '1500.00', count: '3' },
  ],
  largeOppBonus: [
    { type: '本月已发放', typeClass: 'type-blue', amount: '15000.00', count: '2' },
    { type: '今年累计发放', typeClass: 'type-green', amount: '280000.00', count: '15' },
    { type: '还可发放', typeClass: 'type-orange', amount: '50000.00', count: '8' },
  ],
  projectCommissionBonus: [
    { type: '本月已发放', typeClass: 'type-blue', amount: '0.00', count: '0' },
    { type: '今年累计发放', typeClass: 'type-green', amount: '50000.00', count: '10' },
    { type: '还可发放', typeClass: 'type-orange', amount: '100000.00', count: '25' },
  ],
};

const areaList = ['宁波市', '杭州市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'];
const monthList = ['2026-05', '2026-04', '2026-03', '2026-02', '2026-01', '2025-12'];

export function NingboWalletHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my');
  const [showManagedTab] = useState(true);
  const [selectedArea, setSelectedArea] = useState('宁波市');
  const [selectedMonth, setSelectedMonth] = useState('2026-05');
  const [areaPickerOpen, setAreaPickerOpen] = useState(false);
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [rewardDescVisible, setRewardDescVisible] = useState(false);

  const formatAmount = (amount: string | number) => {
    const num = parseFloat(String(amount));
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const goToList = (type: string, bonusType: string) => {
    const cycleMonth = selectedMonth.replace('-', '');
    const params = new URLSearchParams({
      cycleMonth,
      userId: '123',
    });

    switch (`${bonusType}-${type}`) {
      case 'valid-currentMonth':
        navigate(`/ningbo-wallet/valid-opportunity?${params}&auditStatus=10,30`);
        break;
      case 'valid-total':
        navigate(`/ningbo-wallet/valid-opportunity?${params}&auditStatus=10,30&startCycleMonth=${selectedMonth.slice(0, 4)}01`);
        break;
      case 'valid-pending':
        navigate(`/ningbo-wallet/valid-opportunity?${params}&auditStatus=20`);
        break;
      case 'large-currentMonth':
        navigate(`/ningbo-wallet/large-opportunity?${params}&disburseFlag=1,2`);
        break;
      case 'large-total':
        navigate(`/ningbo-wallet/large-opportunity?${params}&disburseFlag=1,2`);
        break;
      case 'large-remaining':
        navigate(`/ningbo-wallet/large-opportunity?${params}&disburseFlag=0`);
        break;
      case 'project-currentMonth':
        navigate(`/ningbo-wallet/project-list?${params}&disburseFlag=1,2`);
        break;
      case 'project-total':
        navigate(`/ningbo-wallet/project-list?${params}&disburseFlag=1,2`);
        break;
      case 'project-remaining':
        navigate(`/ningbo-wallet/project-list?${params}&disburseFlag=0`);
        break;
    }
  };

  const goToHistory = () => {
    navigate(`/ningbo-wallet/history-list`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">钱包</h1>
          <button className="p-2 -mr-2">
            <MoreHorizontal className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 py-3 text-center text-base font-medium transition-colors relative ${
              activeTab === 'my' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            我的商机
            {activeTab === 'my' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
          {showManagedTab && (
            <button
              onClick={() => setActiveTab('managed')}
              className={`flex-1 py-3 text-center text-base font-medium transition-colors relative ${
                activeTab === 'managed' ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              我管理的商机
              {activeTab === 'managed' && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white pb-6">
        {/* 顶部选择器区域 */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* 奖励说明 */}
          <button
            className="text-sm text-blue-500 font-medium"
            onClick={() => setRewardDescVisible(true)}
          >
            奖励说明
          </button>

          <div className="flex items-center gap-3">
            {activeTab === 'managed' && (
              <button
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-sm text-gray-700"
                onClick={() => setAreaPickerOpen(true)}
              >
                <span>{selectedArea}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            )}

            <button
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-sm text-gray-700"
              onClick={() => setMonthPickerOpen(true)}
            >
              <Calendar className="w-4 h-4" />
              <span>{selectedMonth}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 饼图和统计区域 */}
        <div className="flex mx-4 shadow-md rounded-xl overflow-hidden">
          {/* 饼图区域 */}
          <div className="w-40 h-40 sm:w-48 sm:h-48 flex-shrink-0">
            <div className="w-full h-full flex items-center justify-center">
              {/* 模拟饼图 */}
              <div className="relative w-full h-full">
                <div className="absolute inset-0 rounded-full"
                  style={{
                    background: 'conic-gradient(#EF4444 0deg 90deg, #F59E0B 90deg 162deg, #22C55E 162deg 216deg, #3B82F6 216deg 270deg, #8B5CF6 270deg 306deg, #EC4899 306deg 360deg)',
                  }}
                />
                <div className="absolute inset-4 rounded-full bg-white flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-500">
                    {activeTab === 'my' ? '分局奖金池' : '地市奖金池'}
                  </span>
                  <span className="text-lg font-bold text-gray-800">
                    {activeTab === 'my' ? mockMyOppData.totalReward : '100'}
                  </span>
                  <span className="text-xs text-gray-500">万元</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧统计列表 */}
          <div className="flex-1 p-3 overflow-y-auto">
            {activeTab === 'my' ? (
              /* 我的商机 - 单条数据 */
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                  <span className="text-sm text-gray-800">我</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {formatAmount(mockMyOppData.totalReward)}/{formatAmount(mockMyOppData.poolBonus)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 py-1">
                  <span className="text-gray-500">支局排名：</span>
                  <span className="text-blue-500 font-medium">第{mockMyOppData.rkZj}名</span>
                </div>
                <div className="text-sm text-gray-600 py-1">
                  <span className="text-gray-500">分局排名：</span>
                  <span className="text-blue-500 font-medium">第{mockMyOppData.rkQx}名</span>
                </div>
                <div className="text-sm text-gray-600 py-1">
                  <span className="text-gray-500">地市排名：</span>
                  <span className="text-blue-500 font-medium">第{mockMyOppData.rkCity}名</span>
                </div>
              </div>
            ) : (
              /* 我管理的商机 - 区域列表 */
              <div className="space-y-2">
                {mockManagedOppData.map((area, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: area.color }} />
                      <span className="text-sm text-gray-800 truncate max-w-20">{area.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{area.percent}</span>
                      <span>{area.used}/{area.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 奖励展示区域 */}
        <div className="px-4 pt-4">
          {/* 公司名称 */}
          <div className="text-center py-3">
            <span className="text-base font-medium text-gray-800">
              {activeTab === 'my' ? '我的商机' : selectedArea}
            </span>
          </div>

          {/* 奖励卡片网格 */}
          <div className="space-y-3">
            {/* 有效商机奖 */}
            <div className="bg-gray-100 rounded-xl p-3">
              <div className="flex">
                <div className="w-12 flex-shrink-0 flex items-center justify-center">
                  <span className="text-sm text-gray-600 writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
                    有效商机奖
                  </span>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-2">
                  {mockRewardData.validOppBonus.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-3 text-center cursor-pointer"
                      onClick={() => goToList(item.type === '本月已发放' ? 'currentMonth' : item.type === '今年累计发放' ? 'total' : 'pending', 'valid')}
                    >
                      <span className={`inline-block px-2 py-0.5 rounded text-xs mb-2 ${
                        item.typeClass === 'type-blue' ? 'bg-blue-50 text-blue-600' :
                        item.typeClass === 'type-green' ? 'bg-green-50 text-green-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                        {item.type}
                      </span>
                      <div className="text-base font-medium text-gray-800">{formatAmount(item.amount)}</div>
                      <div className="text-xs text-gray-500">元</div>
                      <div className="text-xs text-gray-400 mt-1">{item.count}个商机</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 大额商机奖 */}
            <div className="bg-gray-100 rounded-xl p-3">
              <div className="flex">
                <div className="w-12 flex-shrink-0 flex items-center justify-center">
                  <span className="text-sm text-gray-600 writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
                    大额商机奖
                  </span>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-2">
                  {mockRewardData.largeOppBonus.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-3 text-center cursor-pointer"
                      onClick={() => goToList(item.type === '本月已发放' ? 'currentMonth' : item.type === '今年累计发放' ? 'total' : 'remaining', 'large')}
                    >
                      <span className={`inline-block px-2 py-0.5 rounded text-xs mb-2 ${
                        item.typeClass === 'type-blue' ? 'bg-blue-50 text-blue-600' :
                        item.typeClass === 'type-green' ? 'bg-green-50 text-green-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                        {item.type}
                      </span>
                      <div className="text-base font-medium text-gray-800">{formatAmount(item.amount)}</div>
                      <div className="text-xs text-gray-500">元</div>
                      <div className="text-xs text-gray-400 mt-1">{item.count}个商机</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 项目提成奖 */}
            <div className="bg-gray-100 rounded-xl p-3">
              <div className="flex">
                <div className="w-12 flex-shrink-0 flex items-center justify-center">
                  <span className="text-sm text-gray-600 writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
                    项目提成奖
                  </span>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-2">
                  {mockRewardData.projectCommissionBonus.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-3 text-center cursor-pointer"
                      onClick={() => goToList(item.type === '本月已发放' ? 'currentMonth' : item.type === '今年累计发放' ? 'total' : 'remaining', 'project')}
                    >
                      <span className={`inline-block px-2 py-0.5 rounded text-xs mb-2 ${
                        item.typeClass === 'type-blue' ? 'bg-blue-50 text-blue-600' :
                        item.typeClass === 'type-green' ? 'bg-green-50 text-green-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                        {item.type}
                      </span>
                      <div className="text-base font-medium text-gray-800">{formatAmount(item.amount)}</div>
                      <div className="text-xs text-gray-500">元</div>
                      <div className="text-xs text-gray-400 mt-1">{item.count}个项目</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 历史签报 */}
            <button
              className="w-full py-3 bg-gray-100 rounded-xl text-sm text-gray-600 text-center"
              onClick={goToHistory}
            >
              历史签报 5 个
            </button>
          </div>
        </div>
      </div>

      {/* 区域选择弹窗 */}
      {areaPickerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-medium text-gray-800">选择区域</span>
              <button onClick={() => setAreaPickerOpen(false)} className="p-2">
                <span className="text-2xl text-gray-400">×</span>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {areaList.map((area) => (
                <button
                  key={area}
                  onClick={() => {
                    setSelectedArea(area);
                    setAreaPickerOpen(false);
                  }}
                  className={`h-10 rounded-xl text-sm ${selectedArea === area ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {area}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setAreaPickerOpen(false)}
                className="flex-1 h-12 border border-gray-200 rounded-xl text-gray-700"
              >
                取消
              </button>
              <button
                onClick={() => setAreaPickerOpen(false)}
                className="flex-1 h-12 bg-blue-500 text-white rounded-xl"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 月份选择弹窗 */}
      {monthPickerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-medium text-gray-800">选择月份</span>
              <button onClick={() => setMonthPickerOpen(false)} className="p-2">
                <span className="text-2xl text-gray-400">×</span>
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto mb-4">
              {monthList.map((month) => (
                <button
                  key={month}
                  onClick={() => {
                    setSelectedMonth(month);
                    setMonthPickerOpen(false);
                  }}
                  className={`w-full h-12 text-left px-4 rounded-xl mb-1 ${selectedMonth === month ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                >
                  {month}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setMonthPickerOpen(false)}
                className="flex-1 h-12 border border-gray-200 rounded-xl text-gray-700"
              >
                取消
              </button>
              <button
                onClick={() => setMonthPickerOpen(false)}
                className="flex-1 h-12 bg-blue-500 text-white rounded-xl"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 奖励说明弹窗 */}
      {rewardDescVisible && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white">
              <span className="text-base font-medium text-gray-800">奖励说明</span>
              <button onClick={() => setRewardDescVisible(false)} className="p-2">
                <span className="text-2xl text-gray-400">×</span>
              </button>
            </div>
            <div className="text-sm text-gray-600 space-y-3">
              <h2 className="text-sm font-bold">一、商机有效奖励</h2>
              <h3 className="text-sm font-medium">1. 核心规则</h3>
              <p>免审核额度：每个支局默认每月享有 10 个免审核有效商机名额，无需云分台管理员额外审核，符合条件即可直接触发奖励。</p>
              <p>奖励金额分级：线索填写不完整单个有效商机奖励30元；线索填写完整单个有效商机奖励50元。</p>
              <p>超额审核机制：当月有效商机数量超过10条时，超出部分需提交云分台管理员审核。</p>
              <h3 className="text-sm font-medium">2. 额度调整权限</h3>
              <p>云分台管理员可根据支局的商机转化率，动态调整该支局的"免审核有效商机奖励数量"。</p>

              <h2 className="text-sm font-bold">二、商机奖</h2>
              <h3 className="text-sm font-medium">1. 触发条件</h3>
              <p>需满足两个核心前提：商机成功转化，且收到第一笔款项；完成内部签批流程审批。</p>
              <h3 className="text-sm font-medium">2. 奖励金额标准（按合同金额分级）</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-2 text-left">合同金额范围</th>
                      <th className="border p-2 text-left">奖励金额</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border p-2">合同金额 &gt;= 50万元</td><td className="border p-2">500元</td></tr>
                    <tr><td className="border p-2">10万元 &lt; 合同金额 &lt;= 50万元</td><td className="border p-2">300元</td></tr>
                    <tr><td className="border p-2">1万元 &lt; 合同金额 &lt;= 10万元</td><td className="border p-2">200元</td></tr>
                    <tr><td className="border p-2">合同金额 &lt;= 1万元</td><td className="border p-2">无奖励</td></tr>
                  </tbody>
                </table>
              </div>
              <h3 className="text-sm font-medium">3. 金额抵扣规则</h3>
              <p>商机奖包含"商机有效奖励"，即发放商机奖时，需扣除已提前发放给客户经理的"商机有效奖励金额"。</p>

              <h2 className="text-sm font-bold">三、项目提成奖</h2>
              <h3 className="text-sm font-medium">1. 触发条件</h3>
              <p>与商机奖一致：商机转化后收到第一笔款项，且完成签批流程审批。</p>
              <h3 className="text-sm font-medium">2. 奖励计算逻辑</h3>
              <p>仅按合同中的ICT金额计算奖励（非合同总金额）。</p>
              <p>积分换算规则：1万元ICT金额 = 1积分，1积分 = 200元奖励。</p>
            </div>
            <button
              onClick={() => setRewardDescVisible(false)}
              className="w-full h-12 mt-4 bg-blue-500 text-white rounded-xl"
            >
              知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
}