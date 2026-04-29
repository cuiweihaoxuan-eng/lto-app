import { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Search, X, ChevronLeft, Plus, Star } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';

interface TeamMember {
  id: string;
  name: string;
  branch: string;
  phone: string;
  level?: string;
  category?: string;
  specialties?: string;
  type: 'expert' | 'manager';
  // 专家参与状态
  isDispatched?: boolean; // 是否已派单
  isAccepted?: boolean; // 是否接单
  isVisited?: boolean; // 是否走访
  visitTime?: string; // 走访时间
}

// 生成更多专家组成员数据
const expertMembers: TeamMember[] = [
  {
    id: '1',
    name: '李旭峰',
    branch: '(北仑综合汽车企业支局)',
    phone: '15306865206',
    level: '三级',
    category: '营销',
    type: 'expert',
  },
  {
    id: '2',
    name: '王连宇',
    branch: '(北仑综合汽车企业支局)',
    phone: '19805843397',
    level: '储备',
    specialties: '产数·站研·软研',
    type: 'expert',
  },
  {
    id: '3',
    name: '杨欣怡',
    branch: '(北仑综合汽车企业支局)',
    phone: '15306861879',
    level: '首干',
    category: '云网',
    type: 'expert',
  },
  {
    id: '11',
    name: '张三',
    branch: '(北仑综合汽车企业支局)',
    phone: '15306865201',
    level: '二级',
    category: '营销',
    type: 'expert',
  },
  {
    id: '12',
    name: '李四',
    branch: '(北仑综合汽车企业支局)',
    phone: '15306865202',
    level: '三级',
    category: '技术',
    type: 'expert',
  },
  {
    id: '13',
    name: '王五',
    branch: '(北仑综合汽车企业支局)',
    phone: '15306865203',
    level: '一级',
    category: '云网',
    type: 'expert',
  },
  {
    id: '14',
    name: '赵六',
    branch: '(北仑综合汽车企业支局)',
    phone: '15306865204',
    level: '储备',
    category: '营销',
    type: 'expert',
  },
  {
    id: '15',
    name: '孙七',
    branch: '(北仑综合汽车企业支局)',
    phone: '15306865205',
    level: '首干',
    category: '技术',
    type: 'expert',
  },
  {
    id: '16',
    name: '周八',
    branch: '(北仑综合汽车企业支局)',
    phone: '15306865207',
    level: '二级',
    category: '云网',
    type: 'expert',
  },
  {
    id: '17',
    name: '吴九',
    branch: '(北仑综合汽车企业支局)',
    phone: '15306865208',
    level: '三级',
    category: '营销',
    type: 'expert',
  },
  {
    id: '18',
    name: '郑十',
    branch: '(北仑综合汽车企业支局)',
    phone: '15306865209',
    level: '储备',
    category: '技术',
    type: 'expert',
  },
  {
    id: '19',
    name: '钱十一',
    branch: '(北仑综合汽车企业支局)',
    phone: '15306865210',
    level: '首干',
    category: '云网',
    type: 'expert',
  },
  {
    id: '20',
    name: '冯十二',
    branch: '(镇海分局)',
    phone: '15306865211',
    level: '二级',
    category: '营销',
    type: 'expert',
  },
  {
    id: '101',
    name: '陈明',
    branch: '(鄞州分局)',
    phone: '15306865212',
    level: '一级',
    category: '技术',
    type: 'expert',
  },
  {
    id: '102',
    name: '林芳',
    branch: '(海曙分局)',
    phone: '15306865213',
    level: '三级',
    category: '云网',
    type: 'expert',
  },
  {
    id: '103',
    name: '黄强',
    branch: '(江北分局)',
    phone: '15306865214',
    level: '储备',
    category: '营销',
    type: 'expert',
  },
  {
    id: '104',
    name: '刘洋',
    branch: '(北仑综合汽车企业支局)',
    phone: '15306865215',
    level: '首干',
    category: '技术',
    type: 'expert',
  },
  {
    id: '105',
    name: '徐静',
    branch: '(镇海分局)',
    phone: '15306865216',
    level: '二级',
    category: '云网',
    type: 'expert',
  },
  {
    id: '106',
    name: '马超',
    branch: '(鄞州分局)',
    phone: '15306865217',
    level: '三级',
    category: '营销',
    type: 'expert',
  },
  {
    id: '107',
    name: '何丽',
    branch: '(海曙分局)',
    phone: '15306865218',
    level: '储备',
    category: '技术',
    type: 'expert',
  },
  {
    id: '108',
    name: '邓伟',
    branch: '(江北分局)',
    phone: '15306865219',
    level: '首干',
    category: '云网',
    type: 'expert',
  },
  {
    id: '109',
    name: '罗军',
    branch: '(北仑综合汽车企业支局)',
    phone: '15306865220',
    level: '一级',
    category: '营销',
    type: 'expert',
  },
  {
    id: '110',
    name: '沈敏',
    branch: '(镇海分局)',
    phone: '15306865221',
    level: '二级',
    category: '技术',
    type: 'expert',
  },
  {
    id: '111',
    name: '韩涛',
    branch: '(鄞州分局)',
    phone: '15306865222',
    level: '三级',
    category: '云网',
    type: 'expert',
  },
  {
    id: '112',
    name: '蒋丽',
    branch: '(海曙分局)',
    phone: '15306865223',
    level: '储备',
    category: '营销',
    type: 'expert',
  },
];

// 推荐专家列表（从专家组中选出）
const recommendedExpertIds = ['1', '2', '3'];

// 生成更多普通组成员数据
const managerMembers: TeamMember[] = [
  {
    id: '4',
    name: '周威',
    branch: '',
    phone: '15306867329',
    type: 'manager',
  },
  {
    id: '5',
    name: '李建豪',
    branch: '',
    phone: '15306889673',
    type: 'manager',
  },
  {
    id: '6',
    name: '朱瀚',
    branch: '(宁波全融支局)',
    phone: '18067207665',
    type: 'manager',
  },
  {
    id: '7',
    name: '宫美杰',
    branch: '',
    phone: '15306868528',
    type: 'manager',
  },
  {
    id: '8',
    name: '孙利威',
    branch: '',
    phone: '15306862901',
    type: 'manager',
  },
  {
    id: '21',
    name: '陈经理',
    branch: '',
    phone: '15306862902',
    type: 'manager',
  },
  {
    id: '22',
    name: '林经理',
    branch: '(宁波全融支局)',
    phone: '15306862903',
    type: 'manager',
  },
  {
    id: '23',
    name: '黄经理',
    branch: '',
    phone: '15306862904',
    type: 'manager',
  },
  {
    id: '24',
    name: '刘经理',
    branch: '',
    phone: '15306862905',
    type: 'manager',
  },
  {
    id: '25',
    name: '徐经理',
    branch: '(宁波全融支局)',
    phone: '15306862906',
    type: 'manager',
  },
  {
    id: '26',
    name: '马经理',
    branch: '',
    phone: '15306862907',
    type: 'manager',
  },
  {
    id: '27',
    name: '何经理',
    branch: '',
    phone: '15306862908',
    type: 'manager',
  },
  {
    id: '28',
    name: '邓经理',
    branch: '(宁波全融支局)',
    phone: '15306862909',
    type: 'manager',
  },
  {
    id: '29',
    name: '罗经理',
    branch: '',
    phone: '15306862910',
    type: 'manager',
  },
  {
    id: '30',
    name: '沈经理',
    branch: '',
    phone: '15306862911',
    type: 'manager',
  },
  {
    id: '31',
    name: '韩经理',
    branch: '(宁波全融支局)',
    phone: '15306862912',
    type: 'manager',
  },
  {
    id: '32',
    name: '蒋经理',
    branch: '',
    phone: '15306862913',
    type: 'manager',
  },
  {
    id: '33',
    name: '魏经理',
    branch: '',
    phone: '15306862914',
    type: 'manager',
  },
  {
    id: '34',
    name: '卫经理',
    branch: '(宁波全融支局)',
    phone: '15306862915',
    type: 'manager',
  },
  {
    id: '35',
    name: '于经理',
    branch: '',
    phone: '15306862916',
    type: 'manager',
  },
  {
    id: '36',
    name: '董经理',
    branch: '',
    phone: '15306862917',
    type: 'manager',
  },
  {
    id: '37',
    name: '梁经理',
    branch: '(宁波全融支局)',
    phone: '15306862918',
    type: 'manager',
  },
  {
    id: '38',
    name: '杜经理',
    branch: '',
    phone: '15306862919',
    type: 'manager',
  },
  {
    id: '39',
    name: '潘经理',
    branch: '',
    phone: '15306862920',
    type: 'manager',
  },
  {
    id: '40',
    name: '袁经理',
    branch: '(宁波全融支局)',
    phone: '15306862921',
    type: 'manager',
  },
];

interface TeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: any;
}

type ViewMode = 'added' | 'select';

// 参与详情弹窗组件
function ParticipationDialog({
  open,
  onOpenChange,
  member,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
  onConfirm: (data: { isVisited: boolean; visitTime: string }) => void;
}) {
  const [isVisited, setIsVisited] = useState(false);
  const [visitTime, setVisitTime] = useState('');

  useEffect(() => {
    if (member && open) {
      setIsVisited(member.isVisited || false);
      setVisitTime(member.visitTime || '');
    }
  }, [member, open]);

  const handleConfirm = () => {
    onConfirm({ isVisited, visitTime });
    onOpenChange(false);
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogTitle>是否参与</DialogTitle>
        <DialogDescription className="sr-only">
          设置专家参与详情
        </DialogDescription>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm text-gray-700">专家姓名</Label>
            <div className="text-gray-900">{member.name}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isVisited" className="text-sm text-gray-700">
              是否走访
            </Label>
            <RadioGroup
              value={isVisited ? 'yes' : 'no'}
              onValueChange={(value) => setIsVisited(value === 'yes')}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="visit-yes" />
                  <Label htmlFor="visit-yes" className="cursor-pointer">
                    是
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="visit-no" />
                  <Label htmlFor="visit-no" className="cursor-pointer">
                    否
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visitTime" className="text-sm text-gray-700">
              走访时间
            </Label>
            <input
              id="visitTime"
              type="datetime-local"
              value={visitTime}
              onChange={(e) => setVisitTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            确定
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TeamDialog({ open, onOpenChange, task }: TeamDialogProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('added');
  const [groupType, setGroupType] = useState<'expert' | 'manager'>('expert');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedMembers, setAddedMembers] = useState<TeamMember[]>([
    {
      ...expertMembers[0],
      isDispatched: true,
      isAccepted: true,
      isVisited: true,
      visitTime: '2026-03-27T14:30',
    },
    managerMembers[0],
  ]);
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
  const [displayedCount, setDisplayedCount] = useState(10);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  // 参与详情弹窗状态
  const [participationDialogOpen, setParticipationDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const currentMembers = groupType === 'expert' ? expertMembers : managerMembers;

  // 获取推荐专家
  const recommendedExperts = expertMembers.filter((m) =>
    recommendedExpertIds.includes(m.id)
  );

  // 过滤搜索结果
  const filteredMembers = currentMembers.filter(
    (member) =>
      member.name.includes(searchQuery) ||
      member.phone.includes(searchQuery) ||
      member.branch.includes(searchQuery)
  );

  // 如果是专家组且没有搜索，过滤掉推荐的专家，避免重复显示
  const regularMembers = groupType === 'expert' && !searchQuery
    ? filteredMembers.filter((m) => !recommendedExpertIds.includes(m.id))
    : filteredMembers;

  const displayedMembers = regularMembers.slice(0, displayedCount);

  const loadMore = useCallback(() => {
    if (displayedCount < regularMembers.length) {
      setDisplayedCount((prev) => Math.min(prev + 10, regularMembers.length));
    }
  }, [displayedCount, regularMembers.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore]);

  useEffect(() => {
    setDisplayedCount(10);
  }, [groupType, searchQuery]);

  const toggleMember = (memberId: string) => {
    setTempSelectedIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const removeMember = (memberId: string) => {
    setAddedMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handleConfirm = () => {
    if (viewMode === 'select') {
      const selectedMembers = [...expertMembers, ...managerMembers].filter((m) =>
        tempSelectedIds.includes(m.id)
      );
      const newMembers = selectedMembers.filter(
        (m) => !addedMembers.find((am) => am.id === m.id)
      );
      setAddedMembers([...addedMembers, ...newMembers]);
      setTempSelectedIds([]);
      setViewMode('added');
    } else {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    if (viewMode === 'select') {
      setViewMode('added');
      setTempSelectedIds([]);
    } else {
      onOpenChange(false);
    }
  };

  const handleReset = () => {
    if (viewMode === 'select') {
      setTempSelectedIds([]);
      setSearchQuery('');
    }
  };

  const handleAddClick = () => {
    setViewMode('select');
  };

  const handleBack = () => {
    setViewMode('added');
    setTempSelectedIds([]);
  };

  const handleParticipationClick = (member: TeamMember) => {
    setSelectedMember(member);
    setParticipationDialogOpen(true);
  };

  const handleParticipationConfirm = (data: { isVisited: boolean; visitTime: string }) => {
    if (selectedMember) {
      setAddedMembers((prev) =>
        prev.map((m) =>
          m.id === selectedMember.id
            ? { ...m, isAccepted: true, ...data }
            : m
        )
      );
    }
  };

  // 派单处理函数
  const handleDispatch = (memberId: string) => {
    setAddedMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? { ...m, isDispatched: true }
          : m
      )
    );
  };

  // 获取当前Tab显示的已添加成员
  const currentAddedMembers = addedMembers.filter((m) => m.type === groupType);

  // 渲染成员卡片
  const renderMemberCard = (member: TeamMember, isRecommended = false) => {
    const isSelected = tempSelectedIds.includes(member.id);
    const isAdded = addedMembers.some((m) => m.id === member.id);
    
    return (
      <div
        key={member.id}
        className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
          isSelected ? 'bg-blue-50' : 'bg-white'
        } ${isAdded ? 'opacity-50' : ''} ${isRecommended ? 'relative' : ''}`}
        onClick={() => !isAdded && toggleMember(member.id)}
      >
        <Checkbox
          checked={isSelected}
          disabled={isAdded}
          onCheckedChange={() => !isAdded && toggleMember(member.id)}
          className="mt-0.5 flex-shrink-0"
        />
        <div className="flex-1 space-y-1 text-sm">
          <div className="text-gray-900 flex items-center gap-2">
            {member.name}
            {member.branch && (
              <span className="text-gray-600">{member.branch}</span>
            )}
            {isRecommended && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded">
                <Star className="w-3 h-3 fill-current" />
                推荐
              </span>
            )}
            {isAdded && (
              <span className="text-gray-400 ml-2">(已添加)</span>
            )}
          </div>
          <div className="text-gray-600">
            联系方式：{member.phone}
          </div>
          {member.level && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">专家专业等级：</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                {member.level}
              </span>
            </div>
          )}
          {(member.category || member.specialties) && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">专家专业类型：</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                {member.category || member.specialties}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-full w-full p-0 gap-0 bg-white rounded-t-2xl fixed bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0 h-[70vh] flex flex-col data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom border-0"
          aria-describedby="team-dialog-description"
        >
          <DialogTitle className="sr-only">组队人员选择</DialogTitle>
          <DialogDescription id="team-dialog-description" className="sr-only">
            选择组队人员，可以从专家组或普通组中进行选择
          </DialogDescription>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
            {viewMode === 'select' && (
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            <h2 className="text-lg font-medium flex-1 text-center">
              {viewMode === 'added' ? '组队人员' : '添加成员'}
            </h2>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Radio Group - 两种视图都显示 */}
          <div className="px-6 py-3 border-b flex-shrink-0">
            <RadioGroup
              value={groupType}
              onValueChange={(value) => setGroupType(value as 'expert' | 'manager')}
              className="flex items-center justify-center gap-8"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="expert" id="expert" />
                <Label htmlFor="expert" className="text-gray-700 cursor-pointer">
                  专家组
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="manager" id="manager" />
                <Label htmlFor="manager" className="text-gray-700 cursor-pointer">
                  普通组
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Content Area with Scrolling */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {viewMode === 'added' ? (
              // Added Members View
              <div className="flex-1 overflow-y-auto">
                {currentAddedMembers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <p>暂无成员</p>
                  </div>
                ) : (
                  <div className="px-6 py-4">
                    <div className="bg-white divide-y divide-gray-200 border border-gray-200 rounded-lg">
                      {currentAddedMembers.map((member) => (
                        <div
                          key={member.id}
                          className="p-4 flex items-start justify-between gap-3"
                        >
                          <div className="flex-1 space-y-2 text-sm">
                            <div className="text-gray-900">
                              {member.name}
                              {member.branch && (
                                <span className="text-gray-600">{member.branch}</span>
                              )}
                            </div>
                            <div className="text-gray-600">
                              联系方式：{member.phone}
                            </div>
                            {member.level && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">专家专业等级：</span>
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                  {member.level}
                                </span>
                              </div>
                            )}
                            {(member.category || member.specialties) && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">专家专业类型：</span>
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                                  {member.category || member.specialties}
                                </span>
                              </div>
                            )}
                            
                            {/* 专家组显示参与状态 */}
                            {member.type === 'expert' && member.isDispatched && (
                              <>
                                <div className="flex items-center gap-2 pt-1">
                                  <span className="text-gray-600">接单状态：</span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs ${
                                      member.isAccepted
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                                  >
                                    {member.isAccepted ? '已接单' : '未接单'}
                                  </span>
                                </div>
                                {member.isAccepted && (
                                  <>
                                    <div className="text-gray-600">
                                      是否走访：{member.isVisited ? '是' : '否'}
                                    </div>
                                    {member.visitTime && (
                                      <div className="text-gray-600">
                                        走访时间：{new Date(member.visitTime).toLocaleString('zh-CN', {
                                          year: 'numeric',
                                          month: '2-digit',
                                          day: '2-digit',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            {member.type === 'expert' && !member.isDispatched && (
                              <button
                                onClick={() => handleDispatch(member.id)}
                                className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors whitespace-nowrap"
                              >
                                派单
                              </button>
                            )}
                            {member.type === 'expert' && member.isAccepted && (
                              <button
                                onClick={() => handleParticipationClick(member)}
                                className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors whitespace-nowrap"
                              >
                                是否参与
                              </button>
                            )}
                            {/* 只有未派单的专家或普通组成员才显示移除按钮 */}
                            {(member.type === 'manager' || !member.isDispatched) && (
                              <button
                                onClick={() => removeMember(member.id)}
                                className="px-3 py-1 text-sm text-red-500 border border-red-500 rounded hover:bg-red-50 transition-colors whitespace-nowrap"
                              >
                                移除
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Select Members View
              <>
                {/* Search Bar */}
                <div className="px-6 py-4 flex-shrink-0">
                  <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="请输入关键字搜索"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none ml-2 text-gray-700 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Member List */}
                <div className="flex-1 overflow-y-auto px-6 pb-4">
                  {/* 推荐专家区域（仅专家组且无搜索时显示） */}
                  {groupType === 'expert' && !searchQuery && recommendedExperts.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-orange-500 fill-current" />
                        <h3 className="text-sm font-medium text-gray-700">推荐专家</h3>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg divide-y divide-orange-200">
                        {recommendedExperts.map((member) => renderMemberCard(member, true))}
                      </div>
                    </div>
                  )}

                  {/* 普通成员列表 */}
                  <div className="bg-white divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    {displayedMembers.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        暂无结果
                      </div>
                    ) : (
                      <>
                        {displayedMembers.map((member) => renderMemberCard(member, false))}
                        {displayedCount < regularMembers.length && (
                          <div ref={observerTarget} className="p-4 text-center text-gray-400">
                            加载中...
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center gap-3 px-6 py-4 border-t bg-white flex-shrink-0">
            {viewMode === 'added' ? (
              <button
                onClick={handleAddClick}
                className="w-full py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                添加
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  重置
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  确定
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 参与详情弹窗 */}
      <ParticipationDialog
        open={participationDialogOpen}
        onOpenChange={setParticipationDialogOpen}
        member={selectedMember}
        onConfirm={handleParticipationConfirm}
      />
    </>
  );
}
