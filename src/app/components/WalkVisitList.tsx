import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight, UserCircle2, Users, Search, ChevronDown, X } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { Input } from './ui/input';
import { mockOpportunities } from './OpportunityList';

// 商机/线索项结构（弹窗共用），对齐商情关联弹窗的字段集
interface LeadOrOppItem {
  id: string;
  name: string;
  code: string;
  customerName: string;
  customerCode: string;
  amount: string;
  createTime: string;
  manager: string;
  managerPhone: string;
  // 关联状态：unlinked=未关联 / linked-other=已关联其他商情 / pending=待处理
  linkStatus: 'unlinked' | 'linked-other' | 'pending';
}

interface WalkVisit {
  id: string;
  customerName: string;
  // 客户类型：本地网 / 蓝海
  customerType: 'local' | 'blueocean';
  // 本地网专属
  address?: string;
  vipCode?: string;
  customerLevel?: string;
  // 蓝海专属
  uscc?: string;
  // 顶部右侧标签：本网客户 / 蓝海客户
  tagLabel: '本网客户' | '蓝海客户';
  // 三态按钮当前激活：none / lead / opp
  tagState: 'none' | 'lead' | 'opp';
  // 该走访关联的客户经理 + 协同走访（accountManager.name 也作为走访人筛选来源）
  accountManager: { name: string; phone: string };
  collaborators: { post: string; phone: string; name?: string }[];
  // 走访统计
  shouldVisit: number;
  monthValidVisit: number;
  validLead: number;
  // 走访日期
  visitDate: string;
  // 客户已关联的线索/商机（数组形式，支持多条回显）
  leads: LeadOrOppItem[];
  opportunities: LeadOrOppItem[];
}

// 线索 mock 数据：可被多个走访引用，弹窗里用它充当可选数据池
const mockLeads: LeadOrOppItem[] = [
  {
    id: 'lead-001',
    name: '集团专线扩容意向',
    code: 'LEAD20260320001',
    customerName: '华能国际电力股份有限公司浙江分公司',
    customerCode: 'CUS20260320001',
    amount: '12万',
    createTime: '2026-03-20 09:20',
    manager: '王学莲',
    managerPhone: '13335712720',
    linkStatus: 'unlinked',
  },
  {
    id: 'lead-002',
    name: '客户短视频制作意向',
    code: 'LEAD20260319001',
    customerName: '杭州果驰文化传媒有限公司',
    customerCode: '91330110MAK4RKP750',
    amount: '5万',
    createTime: '2026-03-19 10:30',
    manager: '张三',
    managerPhone: '13800138001',
    linkStatus: 'unlinked',
  },
  {
    id: 'lead-003',
    name: '广告投放意向',
    code: 'LEAD20260319002',
    customerName: '杭州果驰文化传媒有限公司',
    customerCode: '91330110MAK4RKP750',
    amount: '8万',
    createTime: '2026-03-19 11:15',
    manager: '张三',
    managerPhone: '13800138001',
    linkStatus: 'linked-other',
  },
  {
    id: 'lead-004',
    name: '加油站监控上云意向',
    code: 'LEAD20260318005',
    customerName: '中国石油天然气股份有限公司浙江杭州销售分公司',
    customerCode: 'CUS20260319001',
    amount: '30万',
    createTime: '2026-03-18 14:00',
    manager: '李四',
    managerPhone: '13800138002',
    linkStatus: 'unlinked',
  },
  {
    id: 'lead-005',
    name: '校园网改造意向',
    code: 'LEAD20260317003',
    customerName: '杭州守真职业技能培训学校有限公司',
    customerCode: 'CUS20260317003',
    amount: '15万',
    createTime: '2026-03-17 16:45',
    manager: '王五',
    managerPhone: '13800138003',
    linkStatus: 'pending',
  },
  {
    id: 'lead-006',
    name: '云主机采购意向',
    code: 'LEAD20260316008',
    customerName: '华能国际电力股份有限公司浙江分公司',
    customerCode: 'CUS20260320001',
    amount: '50万',
    createTime: '2026-03-16 10:10',
    manager: '王学莲',
    managerPhone: '13335712720',
    linkStatus: 'unlinked',
  },
  {
    id: 'lead-007',
    name: 'VPN 组网升级',
    code: 'LEAD20260315011',
    customerName: '杭州果驰文化传媒有限公司',
    customerCode: '91330110MAK4RKP750',
    amount: '3.2万',
    createTime: '2026-03-15 09:00',
    manager: '张三',
    managerPhone: '13800138001',
    linkStatus: 'unlinked',
  },
  {
    id: 'lead-008',
    name: '云会议系统采购',
    code: 'LEAD20260314002',
    customerName: '中国石油天然气股份有限公司浙江杭州销售分公司',
    customerCode: 'CUS20260319001',
    amount: '8.6万',
    createTime: '2026-03-14 17:20',
    manager: '李四',
    managerPhone: '13800138002',
    linkStatus: 'linked-other',
  },
];

export { mockLeads };

export const mockWalkVisits: WalkVisit[] = [
  {
    id: '1',
    customerName: '华能国际电力股份有限公司浙江分公司',
    customerType: 'local',
    address: '中山北路565号华能大厦',
    vipCode: '571A168254',
    customerLevel: '大客C',
    tagLabel: '本网客户',
    tagState: 'none',
    accountManager: { name: '王学莲', phone: '13335712720' },
    collaborators: [
      { post: '客户经理', phone: '13335712720', name: '王学莲' },
      { post: '技术支撑', phone: '13757101234', name: '测试' },
    ],
    shouldVisit: 2,
    monthValidVisit: 2,
    validLead: 0,
    visitDate: '2026-03-20',
    leads: [],
    opportunities: [],
  },
  {
    id: '2',
    customerName: '杭州果驰文化传媒有限公司',
    customerType: 'blueocean',
    uscc: '91330110MAK4RKP750',
    tagLabel: '蓝海客户',
    tagState: 'lead',
    accountManager: { name: '张三', phone: '13800138001' },
    collaborators: [{ post: '商务经理', phone: '13800138002', name: '李四' }],
    shouldVisit: 1,
    monthValidVisit: 1,
    validLead: 1,
    visitDate: '2026-03-19',
    // 演示用：预关联两条线索，卡片会显示两条"编码 · 名称"
    leads: [mockLeads[1], mockLeads[2]],
    opportunities: [],
  },
  {
    id: '3',
    customerName: '中国石油天然气股份有限公司浙江杭州销售分公司',
    customerType: 'local',
    address: '杭州市西湖区黄龙路五号恒励大厦六楼',
    vipCode: '571A796705',
    customerLevel: '商客B',
    tagLabel: '本网客户',
    tagState: 'opp',
    accountManager: { name: '李四', phone: '13800138002' },
    collaborators: [
      { post: '客户经理', phone: '13800138002', name: '李四' },
      { post: '行业经理', phone: '13800138003', name: '王五' },
    ],
    shouldVisit: 1,
    monthValidVisit: 1,
    validLead: 1,
    visitDate: '2026-03-19',
    // 多条商机用于演示单选 + 关联状态差异
    opportunities: [
      {
        id: mockOpportunities[0].id,
        name: mockOpportunities[0].name,
        code: mockOpportunities[0].code,
        customerName: mockOpportunities[0].enterpriseName,
        customerCode: 'CUS20260319001',
        amount: '850万',
        createTime: mockOpportunities[0].createTime,
        manager: mockOpportunities[0].accountManager,
        managerPhone: '13800138000',
        linkStatus: 'unlinked',
      },
      {
        id: mockOpportunities[1].id,
        name: mockOpportunities[1].name,
        code: mockOpportunities[1].code,
        customerName: mockOpportunities[1].enterpriseName,
        customerCode: 'CUS20260319002',
        amount: '1200万',
        createTime: mockOpportunities[1].createTime,
        manager: mockOpportunities[1].accountManager,
        managerPhone: '13800138001',
        linkStatus: 'linked-other',
      },
      {
        id: mockOpportunities[2].id,
        name: mockOpportunities[2].name,
        code: mockOpportunities[2].code,
        customerName: mockOpportunities[2].enterpriseName,
        customerCode: 'CUS20260319003',
        amount: '650万',
        createTime: mockOpportunities[2].createTime,
        manager: mockOpportunities[2].accountManager,
        managerPhone: '13800138002',
        linkStatus: 'unlinked',
      },
    ],
    leads: [],
  },
  {
    id: '4',
    customerName: '杭州守真职业技能培训学校有限公司',
    customerType: 'local',
    address: '杭州',
    vipCode: '571X1318171',
    customerLevel: '商客C',
    tagLabel: '本网客户',
    tagState: 'none',
    accountManager: { name: '王五', phone: '13800138003' },
    collaborators: [],
    shouldVisit: 0,
    monthValidVisit: 0,
    validLead: 0,
    visitDate: '2026-03-18',
    leads: [],
    opportunities: [],
  },
];

const tagConfig = {
  none: { label: '无商机', activeClass: 'border-gray-300 text-gray-700', inactiveClass: 'border-gray-200 text-gray-500' },
  lead: { label: '有线索', activeClass: 'border-blue-500 text-blue-600 bg-blue-50', inactiveClass: 'border-gray-200 text-gray-500' },
  opp: { label: '有商机', activeClass: 'border-blue-500 text-blue-600 bg-blue-50', inactiveClass: 'border-gray-200 text-gray-500' },
} as const;

const tagOrder: Array<'none' | 'lead' | 'opp'> = ['none', 'lead', 'opp'];

export function WalkVisitList() {
  const navigate = useNavigate();
  const [walkVisits, setWalkVisits] = useState<WalkVisit[]>(mockWalkVisits);
  // 弹窗：记录 id + 类型
  const [popup, setPopup] = useState<{ visitId: string; type: 'lead' | 'opp' } | null>(null);
  // 弹窗里多选的记录 id 集合（点击行切换选中状态）
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  // 弹窗搜索关键词
  const [popupKeyword, setPopupKeyword] = useState('');
  // 每张卡片协同走访是否展开
  const [expandedCollab, setExpandedCollab] = useState<Record<string, boolean>>({});
  const MAX_COLLAB_PREVIEW = 3;

  // 顶部筛选：客户名搜索 + 客户类型 + 走访类型 + 走访人
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCustomerType, setFilterCustomerType] = useState<'all' | '本网' | '蓝海'>('all');
  const [filterVisitTag, setFilterVisitTag] = useState<'all' | 'none' | 'lead' | 'opp'>('all');
  const [filterVisitor, setFilterVisitor] = useState<string>('all');

  // 搜索图标开关 + 当前激活的筛选 Sheet
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'customerType' | 'visitTag' | 'visitor' | null>(null);

  // 走访人下拉数据（accountManager.name + collaborators.name 去重）
  const allVisitors = Array.from(
    new Set(
      walkVisits.flatMap((v) => [
        v.accountManager.name,
        ...v.collaborators.map((c) => c.name).filter(Boolean) as string[],
      ])
    )
  );

  // 顶部筛后的走访列表
  const filteredVisits = walkVisits.filter((v) => {
    // 客户名模糊匹配
    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase();
      if (!v.customerName.toLowerCase().includes(kw)) return false;
    }
    // 客户类型
    if (filterCustomerType === '本网' && v.customerType !== 'local') return false;
    if (filterCustomerType === '蓝海' && v.customerType !== 'blueocean') return false;
    // 走访类型
    if (filterVisitTag !== 'all' && v.tagState !== filterVisitTag) return false;
    // 走访人：客户经理或协同人均可
    if (filterVisitor !== 'all') {
      const all = [v.accountManager.name, ...v.collaborators.map((c) => c.name).filter(Boolean) as string[]];
      if (!all.includes(filterVisitor)) return false;
    }
    return true;
  });

  const handleTagClick = (visitId: string, tag: 'none' | 'lead' | 'opp', e: React.MouseEvent) => {
    e.stopPropagation();
    // 找到对应走访
    const visit = walkVisits.find((v) => v.id === visitId);
    if (!visit) return;

    // 如果当前标签已经激活，且该项有内容，则打开弹窗（预选已关联数据）
    if (visit.tagState === tag && (tag === 'lead' || tag === 'opp')) {
      openPopup(visitId, tag);
      return;
    }

    // 更新激活标签
    setWalkVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, tagState: tag } : v))
    );

    // 如果切换到 lead/opp 且该客户没有内容，给出占位提示
    if (tag === 'lead' && visit.leads.length === 0) {
      // 不打开弹窗，状态切换但弹窗在卡片外提示
      // 这里选择直接切激活态即可；如果要弹窗，可改为 setPopup(...)；保留空数据体验
    }
    if (tag === 'opp' && visit.opportunities.length === 0) {
      // 同上
    }
  };

  const currentVisit = popup ? walkVisits.find((v) => v.id === popup.visitId) : null;
  // 弹窗里展示的是当前类型对应的全局候选池（线索/商机），而不是已关联列表，
  // 这样选择空间才完整；已关联项会在打开弹窗时通过 selectedItemIds 预选回显。
  const popupList: LeadOrOppItem[] | undefined = popup
    ? popup.type === 'lead'
      ? mockLeads
      : mockOpportunities
    : undefined;

  // 打开弹窗时，依据该走访已关联的线索/商机回显预选项
  const openPopup = (visitId: string, type: 'lead' | 'opp') => {
    const visit = walkVisits.find((v) => v.id === visitId);
    if (!visit) return;
    const current = type === 'lead' ? visit.leads : visit.opportunities;
    const pool = type === 'lead' ? mockLeads : mockOpportunities;
    const poolIds = new Set(pool.map((x) => x.id));
    // 预选该走访已关联的 id（只保留当下候选池里真正存在的）
    const preSelected = current.map((c) => c.id).filter((id) => poolIds.has(id));
    setSelectedItemIds(preSelected);
    setPopup({ visitId, type });
  };

  // 取当前激活标签对应的列表项集合（用于卡片上多回显）
  const activeTagItems = (visit: WalkVisit): LeadOrOppItem[] => {
    if (visit.tagState === 'lead') return visit.leads;
    if (visit.tagState === 'opp') return visit.opportunities;
    return [];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        {/* 标题行：返回 + 标题 + 搜索图标 */}
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium text-gray-900 flex-1 text-center mr-6">自主走访</h1>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`p-2 rounded-xl transition-colors ${
              searchOpen ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="搜索"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* 搜索框（仅 searchOpen 时展开） */}
        {searchOpen && (
          <div className="px-4 pt-2 pb-3 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索客户名称"
                className="w-full pl-10 pr-10"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label="清空搜索"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 筛选胶囊组（仅 searchOpen 时展开） */}
        {searchOpen && (
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {/* 客户类型 */}
            <button
              onClick={() => setActiveFilter('customerType')}
              className={`flex-1 flex items-center justify-center gap-1 text-sm min-w-[80px] ${
                filterCustomerType !== 'all' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {filterCustomerType === 'all' ? '客户类型' : filterCustomerType}
              <ChevronDown className="w-4 h-4" />
            </button>
            {/* 走访类型 */}
            <button
              onClick={() => setActiveFilter('visitTag')}
              className={`flex-1 flex items-center justify-center gap-1 text-sm min-w-[80px] ${
                filterVisitTag !== 'all' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {filterVisitTag === 'all'
                ? '走访类型'
                : filterVisitTag === 'none'
                ? '无'
                : filterVisitTag === 'lead'
                ? '有线索'
                : '有商机'}
              <ChevronDown className="w-4 h-4" />
            </button>
            {/* 走访人 */}
            <button
              onClick={() => setActiveFilter('visitor')}
              className={`flex-1 flex items-center justify-center gap-1 text-sm min-w-[80px] ${
                filterVisitor !== 'all' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {filterVisitor === 'all' ? '走访人' : filterVisitor}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Walk Visit Cards */}
      <div className="p-4 space-y-4">
        {filteredVisits.length === 0 ? (
          <div className="text-center text-gray-400 py-8 text-sm">暂无符合条件的走访</div>
        ) : null}
        {filteredVisits.map((visit) => (
          <div
            key={visit.id}
            onClick={() => navigate(`/walk-visit/${visit.id}`)}
            className="bg-white rounded-xl p-4 shadow-sm cursor-pointer"
          >
            {/* 顶部：客户名称 + 右侧[客户类型标签 + 三态按钮] */}
            <div className="flex items-start justify-between gap-2">
              <div className="text-base font-medium text-gray-900 leading-snug flex-1 min-w-0">
                {visit.customerName}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
                <span className="text-xs px-2 py-0.5 rounded bg-orange-50 text-orange-700">
                  {visit.tagLabel}
                </span>
                {(() => {
                  const activeKey = visit.tagState;
                  const cfg = tagConfig[activeKey];
                  return (
                    <button
                      onClick={(e) => handleTagClick(visit.id, activeKey, e)}
                      className={`px-2 py-0.5 border rounded-full text-[10px] transition-colors ${cfg.activeClass}`}
                    >
                      {cfg.label}
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* 主体内容 */}
            <div className="mt-3 space-y-1.5 text-sm text-gray-600">
              {visit.customerType === 'local' && visit.address && (
                <div className="text-gray-700">{visit.address}</div>
              )}
              {visit.customerType === 'blueocean' && visit.uscc && (
                <div>统一社会信用代码 {visit.uscc}</div>
              )}

              <div className="flex items-center gap-4">
                {visit.vipCode && <span>贵宾卡号 {visit.vipCode}</span>}
                {visit.customerLevel && (
                  <span>
                    客户等级 <span className="text-gray-900">{visit.customerLevel}</span>
                  </span>
                )}
              </div>

              {/* 客户经理（电话） */}
              <div className="flex items-center gap-2">
                <UserCircle2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">客户经理：</span>
                <span className="text-gray-900">{visit.accountManager.name}</span>
                <a
                  href={`tel:${visit.accountManager.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-500"
                >
                  {visit.accountManager.phone}
                </a>
              </div>

              {/* 协同走访人（岗位-电话），0 人时不渲染 */}
              {visit.collaborators.length > 0 && (() => {
                const expanded = !!expandedCollab[visit.id];
                const overflow = visit.collaborators.length > MAX_COLLAB_PREVIEW;
                const visible = expanded
                  ? visit.collaborators
                  : visit.collaborators.slice(0, MAX_COLLAB_PREVIEW);
                return (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">
                        协同走访 <span className="text-gray-900">{visit.collaborators.length}人</span>
                      </span>
                      {overflow && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCollab((prev) => ({ ...prev, [visit.id]: !prev[visit.id] }));
                          }}
                          className="text-blue-500 text-xs"
                        >
                          {expanded ? '收起>' : '展开全部>'}
                        </button>
                      )}
                    </div>
                    <div className="pl-6 space-y-1">
                      {visible.map((c, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-gray-600">{c.post}</span>
                          {c.name && <span className="text-gray-900">— {c.name}</span>}
                          <a
                            href={`tel:${c.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-500"
                          >
                            {c.phone}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div className="pt-2">{visit.visitDate}</div>
            </div>

            {/* 线索/商机快捷标签（仅激活态 + 有数据时显示） */}
            {(() => {
              const items = activeTagItems(visit);
              if (items.length === 0) return null;
              // 多条以逗号分隔展示，避免卡片过高；超出 2 条折叠为「… 等 N 条」
              const PREVIEW = 2;
              const visible = items.slice(0, PREVIEW);
              const more = items.length - visible.length;
              const text = visible.map((it) => `${it.code}·${it.name}`).join('，') + (more > 0 ? ` 等${items.length}条` : '');
              return (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openPopup(visit.id, visit.tagState as 'lead' | 'opp');
                  }}
                  className="mt-3 w-full flex items-center justify-between gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-xl text-xs"
                >
                  <span className="truncate">{text}</span>
                  <ChevronRight className="w-3 h-3 flex-shrink-0" />
                </button>
              );
            })()}

            {/* 底部三态按钮组 - 商情"关联商机"按钮样式（与顶部紧凑组共享状态） */}
            <div className="mt-3 p-3 bg-gray-50 rounded-xl flex items-center gap-2 overflow-x-auto">
              {tagOrder.map((tagKey) => {
                const cfg = tagConfig[tagKey];
                const active = visit.tagState === tagKey;
                // 复用商情管理 BusinessInfoList 中"关联商机"按钮的样式：
                // px-3 py-1.5 text-xs rounded-xl，蓝底/灰底 + 白字
                const baseClass =
                  'px-3 py-1.5 text-xs rounded-xl whitespace-nowrap flex-shrink-0 transition-colors';
                const variantClass = active
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-500 hover:bg-gray-600 text-white';
                return (
                  <button
                    key={tagKey}
                    onClick={(e) => handleTagClick(visit.id, tagKey, e)}
                    className={`${baseClass} ${variantClass}`}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 筛选 Sheet 弹窗：点击胶囊后从底部弹出，点选即生效 */}
      <Dialog
        open={activeFilter !== null}
        onOpenChange={(open) => {
          if (!open) setActiveFilter(null);
        }}
      >
        <DialogContent className="max-w-full w-full p-0 gap-0 bg-white rounded-t-2xl fixed bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0 h-auto max-h-[70vh] flex flex-col border-0">
          <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
            <div className="w-10" />
            <h2 className="text-lg font-medium flex-1 text-center">
              {activeFilter === 'customerType' && '选择客户类型'}
              {activeFilter === 'visitTag' && '选择走访类型'}
              {activeFilter === 'visitor' && '选择走访人'}
            </h2>
            <button
              onClick={() => setActiveFilter(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-2">
            {/* 客户类型 */}
            {activeFilter === 'customerType' && (
              <>
                {[
                  { value: 'all' as const, label: '全部' },
                  { value: '本网' as const, label: '本网' },
                  { value: '蓝海' as const, label: '蓝海' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setFilterCustomerType(opt.value);
                      setActiveFilter(null);
                    }}
                    className={`w-full py-3 px-4 rounded-xl text-left transition-colors ${
                      filterCustomerType === opt.value
                        ? 'bg-blue-50 text-blue-700 border border-blue-500'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </>
            )}

            {/* 走访类型 */}
            {activeFilter === 'visitTag' && (
              <>
                {[
                  { value: 'all' as const, label: '全部' },
                  { value: 'none' as const, label: '无' },
                  { value: 'lead' as const, label: '有线索' },
                  { value: 'opp' as const, label: '有商机' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setFilterVisitTag(opt.value);
                      setActiveFilter(null);
                    }}
                    className={`w-full py-3 px-4 rounded-xl text-left transition-colors ${
                      filterVisitTag === opt.value
                        ? 'bg-blue-50 text-blue-700 border border-blue-500'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </>
            )}

            {/* 走访人 */}
            {activeFilter === 'visitor' && (
              <>
                <button
                  onClick={() => {
                    setFilterVisitor('all');
                    setActiveFilter(null);
                  }}
                  className={`w-full py-3 px-4 rounded-xl text-left transition-colors ${
                    filterVisitor === 'all'
                      ? 'bg-blue-50 text-blue-700 border border-blue-500'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  全部
                </button>
                {allVisitors.map((name) => (
                  <button
                    key={name}
                    onClick={() => {
                      setFilterVisitor(name);
                      setActiveFilter(null);
                    }}
                    className={`w-full py-3 px-4 rounded-xl text-left transition-colors ${
                      filterVisitor === name
                        ? 'bg-blue-50 text-blue-700 border border-blue-500'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 弹窗：线索/商机列表 - 沿用商情管理"关联商机"弹窗样式 */}
      <Dialog
        open={!!popup}
        onOpenChange={(open) => {
          if (!open) {
            setPopup(null);
            setSelectedItemIds([]);
            setPopupKeyword('');
          }
        }}
      >
        <DialogContent className="max-w-md w-full mx-0 max-h-screen overflow-y-auto p-0">
          {/* 顶部标题栏 */}
          <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b flex items-center justify-between">
            <span className="text-base font-medium text-gray-900">
              {popup?.type === 'lead' ? '关联已有线索' : '关联已有商机'}
            </span>
            <button
              onClick={() => {
                setPopup(null);
                setSelectedItemIds([]);
                setPopupKeyword('');
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 搜索框 */}
          <div className="px-4 pt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={popupKeyword}
                onChange={(e) => setPopupKeyword(e.target.value)}
                placeholder={`请输入${popup?.type === 'lead' ? '线索' : '商机'}名称、${popup?.type === 'lead' ? '线索' : '商机'}编码`}
                className="w-full pl-10 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 四个筛选下拉（占位 UI，与截图一致） */}
          <div className="px-4 pt-3 flex items-center gap-2 overflow-x-auto">
            {['客户', '时间', '关联状态', '客户经理'].map((label) => (
              <button
                key={label}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-xl text-xs text-gray-700 whitespace-nowrap flex-shrink-0 hover:bg-gray-50"
              >
                <span>{label}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            ))}
          </div>

          {/* 列表区 */}
          <div className="mt-3">
            {popupList && popupList.length > 0 ? (
              (() => {
                const filtered = popupList.filter((it) => {
                  if (!popupKeyword) return true;
                  const kw = popupKeyword.toLowerCase();
                  return (
                    it.name.toLowerCase().includes(kw) ||
                    it.code.toLowerCase().includes(kw)
                  );
                });
                if (filtered.length === 0) {
                  return (
                    <div className="text-center text-gray-400 py-8 text-sm">
                      未匹配到记录
                    </div>
                  );
                }
                return filtered.map((item) => {
                  const selected = selectedItemIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedItemIds((prev) =>
                          prev.includes(item.id)
                            ? prev.filter((id) => id !== item.id)
                            : [...prev, item.id]
                        );
                      }}
                      className={`w-full text-left px-4 py-3 border-b flex items-start gap-3 ${
                        selected ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      {/* 多选方块 */}
                      <div
                        className={`mt-1 w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                          selected
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {selected && (
                          <svg viewBox="0 0 12 12" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="2,6 5,9 10,3" />
                          </svg>
                        )}
                      </div>

                      {/* 内容区 */}
                      <div className="flex-1 min-w-0">
                        {/* 标题：名称 - 编码 */}
                        <div className="text-sm font-medium text-gray-900 leading-snug mb-2">
                          {item.name} - {item.code}
                        </div>

                        {/* 胶囊行：客户 + 金额 + 关联状态 */}
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                            {item.customerName}（{item.customerCode}）
                          </span>
                          <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded">
                            {item.amount}
                          </span>
                          {item.linkStatus === 'linked-other' && (
                            <span className="px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded">
                              已关联其他商情
                            </span>
                          )}
                        </div>

                        {/* 创建时间 + 客户经理(电话) */}
                        <div className="text-xs text-gray-500">
                          <div>创建时间：{item.createTime}</div>
                          <div>
                            客户经理：
                            <a
                              href={`tel:${item.managerPhone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-blue-500"
                            >
                              {item.manager}（{item.managerPhone}）
                            </a>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                });
              })()
            ) : (
              <div className="text-center text-gray-400 py-8 text-sm">
                暂无{popup?.type === 'lead' ? '线索' : '商机'}数据
              </div>
            )}
          </div>

          {/* 底部：取消 + 确定（截图样式） */}
          <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => {
                setPopup(null);
                setSelectedItemIds([]);
                setPopupKeyword('');
              }}
              className="flex-1 px-4 py-2 border border-blue-500 text-blue-500 rounded-xl text-sm hover:bg-blue-50"
            >
              取消
            </button>
            <button
              onClick={() => {
                if (!popup || selectedItemIds.length === 0) return;
                // 拿到弹窗中显示的所有候选项（取 popupList），按 selectedItemIds 顺序取出实际对象
                const sourcePool = popup.type === 'lead' ? mockLeads : mockOpportunities;
                const idToItem = new Map(sourcePool.map((x) => [x.id, x]));
                const picked = selectedItemIds
                  .map((id) => idToItem.get(id))
                  .filter((x): x is LeadOrOppItem => !!x);
                setWalkVisits((prev) =>
                  prev.map((v) => {
                    if (v.id !== popup.visitId) return v;
                    if (popup.type === 'lead') return { ...v, leads: picked, tagState: 'lead' };
                    return { ...v, opportunities: picked, tagState: 'opp' };
                  })
                );
                setPopup(null);
                setSelectedItemIds([]);
                setPopupKeyword('');
              }}
              disabled={selectedItemIds.length === 0}
              className={`flex-1 px-4 py-2 rounded-xl text-sm ${
                selectedItemIds.length > 0
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              确定{selectedItemIds.length > 0 ? `(${selectedItemIds.length})` : ''}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
