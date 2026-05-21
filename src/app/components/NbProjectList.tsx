import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, ChevronDown, User, X, Check } from 'lucide-react';
import { Input } from './ui/input';

// 团队权重配置
const TEAM_WEIGHTS: Record<string, number> = {
  sqxstd: 0.4, // 售前销售团队 40%
  sqzctd: 0.3, // 售前支撑团队 30%
  sztd: 0.2,   // 售中团队 20%
  shtd: 0.1,   // 售后团队 10%
};

// 模拟数据
const mockProjectList = [
  { id: '1', itemName: '镇海智慧社区ICT项目', jtOppCode: 'JT202505001', contractAmount: '500000', contractIctAmount: '300000', skAll: '100000', itemReward: '6000', firstLeaderName: '张三', firstLeaderId: 'user001', memberList: ['李四', '王五', '赵六'], auditState: '30', saleOppId: 'opp001', qxId: 'qx001', cycleMonth: '202505' },
  { id: '2', itemName: '北仑政务云平台项目', jtOppCode: 'JT202505002', contractAmount: '800000', contractIctAmount: '500000', skAll: '200000', itemReward: '10000', firstLeaderName: '李四', firstLeaderId: 'user002', memberList: ['张三', '王五'], auditState: '20', saleOppId: 'opp002', qxId: 'qx002', cycleMonth: '202505' },
  { id: '3', itemName: '鄞州教育信息化项目', jtOppCode: 'JT202505003', contractAmount: '300000', contractIctAmount: '200000', skAll: '50000', itemReward: '4000', firstLeaderName: '王五', firstLeaderId: 'user003', memberList: ['张三', '李四', '赵六'], auditState: '30', saleOppId: 'opp003', qxId: 'qx003', cycleMonth: '202504' },
  { id: '4', itemName: '前湾智慧园区项目', jtOppCode: 'JT202505004', contractAmount: '2000000', contractIctAmount: '1000000', skAll: '500000', itemReward: '20000', firstLeaderName: '赵六', firstLeaderId: 'user004', memberList: ['张三', '李四'], auditState: '0', saleOppId: 'opp004', qxId: 'qx004', cycleMonth: '202504' },
];

// 团队成员数据结构
interface TeamMember {
  id: string;
  userId: string;
  userName: string;
  jtTeamRole: string;
  jtTeamRoleName: string;
  subTeamContribution: string;
  isHead: string;
  isHeadName: string;
  statusCd: string;
  createDate: string;
  issuedRewardAmount: string;
  rewardAmount: string;
  expandDetails: boolean;
}

// 团队数据结构
interface Team {
  subTeamId: string;
  subTeamName: string;
  sjtTeamMemberDTOList: TeamMember[];
}

// 初始化团队成员数据
const initTeamMembers = (): Record<string, Team> => ({
  sqxstd: { subTeamId: 'sqxstd', subTeamName: '售前销售团队', sjtTeamMemberDTOList: [
    { id: 'm001', userId: 'user001', userName: '张三', jtTeamRole: 'role001', jtTeamRoleName: '负责人', subTeamContribution: '60', isHead: '1', isHeadName: '是', statusCd: '1000', createDate: '2025-05-01', issuedRewardAmount: '3000', rewardAmount: '6000', expandDetails: false },
    { id: 'm002', userId: 'user002', userName: '李四', jtTeamRole: 'role002', jtTeamRoleName: '成员', subTeamContribution: '40', isHead: '0', isHeadName: '否', statusCd: '1000', createDate: '2025-05-02', issuedRewardAmount: '2000', rewardAmount: '4000', expandDetails: false },
  ]},
  sqzctd: { subTeamId: 'sqzctd', subTeamName: '售前支撑团队', sjtTeamMemberDTOList: [
    { id: 'm003', userId: 'user003', userName: '王五', jtTeamRole: 'role001', jtTeamRoleName: '负责人', subTeamContribution: '50', isHead: '1', isHeadName: '是', statusCd: '1000', createDate: '2025-05-03', issuedRewardAmount: '2500', rewardAmount: '5000', expandDetails: false },
    { id: 'm004', userId: 'user004', userName: '赵六', jtTeamRole: 'role002', jtTeamRoleName: '成员', subTeamContribution: '50', isHead: '0', isHeadName: '否', statusCd: '1000', createDate: '2025-05-04', issuedRewardAmount: '2500', rewardAmount: '5000', expandDetails: false },
  ]},
  sztd: { subTeamId: 'sztd', subTeamName: '售中团队', sjtTeamMemberDTOList: [
    { id: 'm005', userId: 'user005', userName: '孙七', jtTeamRole: 'role001', jtTeamRoleName: '负责人', subTeamContribution: '100', isHead: '1', isHeadName: '是', statusCd: '1000', createDate: '2025-05-05', issuedRewardAmount: '5000', rewardAmount: '10000', expandDetails: false },
  ]},
  shtd: { subTeamId: 'shtd', subTeamName: '售后团队', sjtTeamMemberDTOList: [] },
});

// 发放记录数据
const mockDistributeData = [
  { cycleMonth: '202505', oppAward: { contractAmount: 500000, skCycle: 100000, oppReward: 500 }, memberList: [
    { awardType: '奖金', teamUserName: '张三', subTeamName: '售前销售团队', teamRoleName: '负责人', subTeamContribution: '60', amount: '300' },
    { awardType: '奖金', teamUserName: '李四', subTeamName: '售前销售团队', teamRoleName: '成员', subTeamContribution: '40', amount: '200' },
  ]},
  { cycleMonth: '202504', oppAward: { contractAmount: 400000, skCycle: 80000, oppReward: 400 }, memberList: [
    { awardType: '奖金', teamUserName: '张三', subTeamName: '售前销售团队', teamRoleName: '负责人', subTeamContribution: '55', amount: '220' },
    { awardType: '奖金', teamUserName: '李四', subTeamName: '售前销售团队', teamRoleName: '成员', subTeamContribution: '45', amount: '180' },
  ]},
];

// 审核记录数据
const mockAuditData = [
  { docInstId: 'doc001', createDate: '2025-05-10 15:30:00', submitUserName: '张三', orgnName: '镇海分局', auditStatusName: '审核通过', signUrl: '签报文件.pdf' },
  { docInstId: 'doc002', createDate: '2025-05-05 10:20:00', submitUserName: '李四', orgnName: '镇海分局', auditStatusName: '待审核', signUrl: '' },
];

// 成员变更记录数据
const mockMemberChangeData = [
  { id: 'change001', userName: '王五', changeType: '加入', changeDate: '2025-05-10', status: '已通过' },
  { id: 'change002', userName: '孙七', changeType: '退出', changeDate: '2025-05-08', status: '已通过' },
  { id: 'change003', userName: '赵六', changeType: '角色变更', changeDate: '2025-05-05', status: '待审核' },
];

// 可选成员列表
const availableMembers = [
  { userId: 'user006', userName: '周八', dept: '镇海支局' },
  { userId: 'user007', userName: '吴九', dept: '镇海支局' },
  { userId: 'user008', userName: '郑十', dept: '北仑支局' },
];

// 角色选项
const roleOptions = [
  { value: 'role001', label: '负责人' },
  { value: 'role002', label: '成员' },
];

// 责任人选项
const isHeadOptions = [
  { value: '1', label: '是' },
  { value: '0', label: '否' },
];

export function NbProjectList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [listData] = useState(mockProjectList);

  // 弹窗状态
  const [memberDetailVisible, setMemberDetailVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({ sqxstd: true, sqzctd: true, sztd: true, shtd: true });
  const [inviteVisible, setInviteVisible] = useState(false);
  const [distributeVisible, setDistributeVisible] = useState(false);
  const [auditVisible, setAuditVisible] = useState(false);
  const [memberChangeVisible, setMemberChangeVisible] = useState(false);
  const [activeDistributeTab, setActiveDistributeTab] = useState(0);
  const [activeAuditTab, setActiveAuditTab] = useState(0);

  // 邀请成员弹窗状态
  const [inviteTeamId, setInviteTeamId] = useState<string>('sqxstd');
  const [inviteTeamName, setInviteTeamName] = useState<string>('售前销售团队');

  // 贡献度错误弹窗
  const [contributionErrorVisible, setContributionErrorVisible] = useState(false);
  const [invalidUsers, setInvalidUsers] = useState<any[]>([]);

  // 编辑弹窗状态
  const [editMemberVisible, setEditMemberVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  // 团队成员数据
  const [teamMembers, setTeamMembers] = useState<Record<string, Team>>(initTeamMembers());

  // 添加成员弹窗
  const [addMemberVisible, setAddMemberVisible] = useState(false);
  const [addMemberTeamId, setAddMemberTeamId] = useState<string>('');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');

  const formatAmount = (amount: string | number) => {
    const num = parseFloat(String(amount));
    if (isNaN(num)) return '0.00';
    return (num / 10000).toFixed(2);
  };

  const getStatusTags = (item: any) => {
    const tags = [];
    if (item.auditState === '0') {
      tags.push({ text: '待发起签报', color: '#ff976a' });
    } else if (item.auditState === '20') {
      tags.push({ text: '签报审批中', color: '#ff976a' });
    } else if (item.auditState === '30') {
      tags.push({ text: '签报已完成', color: '#07c160' });
    }
    return tags;
  };

  // 查看团队成员详情
  const handleMemberDetail = (item: any) => {
    setSelectedProject(item);
    setTeamMembers(initTeamMembers());
    setMemberDetailVisible(true);
  };

  // 邀请成员
  const handleInvite = (item: any) => {
    setSelectedProject(item);
    setInviteVisible(true);
  };

  // 发放记录
  const handleDistribute = (item: any) => {
    setSelectedProject(item);
    setDistributeVisible(true);
    setActiveDistributeTab(0);
  };

  // 审核记录
  const handleAudit = (item: any) => {
    setSelectedProject(item);
    setAuditVisible(true);
    setActiveAuditTab(0);
  };

  // 成员变更记录
  const handleMemberChange = (item: any) => {
    setSelectedProject(item);
    setMemberChangeVisible(true);
  };

  // 展开/收起团队
  const toggleTeam = (teamId: string) => {
    setExpandedTeams(prev => ({ ...prev, [teamId]: !prev[teamId] }));
  };

  // 在团队成员详情弹窗中打开邀请成员
  const handleOpenInviteInDetail = (teamId: string, teamName: string) => {
    setInviteTeamId(teamId);
    setInviteTeamName(teamName);
    setInviteVisible(true);
    setMemberDetailVisible(false);
  };

  // 展开/收起成员详情
  const toggleMemberDetails = (teamId: string, memberId: string) => {
    setTeamMembers(prev => {
      const newData = { ...prev };
      const team = newData[teamId];
      if (team) {
        team.sjtTeamMemberDTOList = team.sjtTeamMemberDTOList.map(m =>
          m.id === memberId ? { ...m, expandDetails: !m.expandDetails } : m
        );
      }
      return newData;
    });
  };

  // 编辑成员
  const handleEditMember = (team: Team, member: TeamMember) => {
    setEditingTeam(team);
    setEditingMember({ ...member });
    setEditMemberVisible(true);
  };

  // 移除成员
  const handleRemoveMember = (teamId: string, member: TeamMember) => {
    setTeamMembers(prev => {
      const newData = { ...prev };
      const team = newData[teamId];
      if (team) {
        team.sjtTeamMemberDTOList = team.sjtTeamMemberDTOList.filter(m => m.id !== member.id);
      }
      return newData;
    });
  };

  // 更新成员贡献度
  const updateMemberContribution = (value: string) => {
    if (editingMember) {
      const num = parseInt(value) || 0;
      setEditingMember({ ...editingMember, subTeamContribution: String(num) });
    }
  };

  // 更新成员角色
  const updateMemberRole = (roleValue: string) => {
    if (editingMember) {
      const role = roleOptions.find(r => r.value === roleValue);
      setEditingMember({
        ...editingMember,
        jtTeamRole: roleValue,
        jtTeamRoleName: role?.label || '',
      });
    }
  };

  // 更新是否为责任人
  const updateMemberIsHead = (isHeadValue: string) => {
    if (editingMember && editingTeam) {
      if (isHeadValue === '1') {
        const hasOtherHead = editingTeam.sjtTeamMemberDTOList.some(
          m => m.isHead === '1' && m.id !== editingMember.id
        );
        if (hasOtherHead) {
          alert('该团队已有责任人');
          return;
        }
      }
      setEditingMember({
        ...editingMember,
        isHead: isHeadValue,
        isHeadName: isHeadValue === '1' ? '是' : '否',
      });
    }
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (editingMember && editingTeam) {
      setTeamMembers(prev => {
        const newData = { ...prev };
        const team = newData[editingTeam.subTeamId];
        if (team) {
          team.sjtTeamMemberDTOList = team.sjtTeamMemberDTOList.map(m =>
            m.id === editingMember.id ? editingMember : m
          );
        }
        return newData;
      });
      setEditMemberVisible(false);
      setEditingMember(null);
      setEditingTeam(null);
    }
  };

  // 校验贡献度
  const validateContribution = (): { isValid: boolean; invalidUsers: any[] } => {
    const userContributions: Record<string, any> = {};

    Object.entries(teamMembers).forEach(([teamId, team]) => {
      const weight = TEAM_WEIGHTS[teamId] || 0;
      team.sjtTeamMemberDTOList.forEach(member => {
        if (member.statusCd !== '1000') return;
        if (!member.userId) return;

        if (!userContributions[member.userId]) {
          userContributions[member.userId] = {
            userName: member.userName,
            contributions: {},
            totalContribution: 0,
          };
        }
        const contribution = parseFloat(member.subTeamContribution) || 0;
        const weightedContribution = contribution * weight;
        userContributions[member.userId].contributions[teamId] = {
          teamName: team.subTeamName,
          contribution: contribution,
          weightedContribution: weightedContribution,
        };
        userContributions[member.userId].totalContribution += weightedContribution;
      });
    });

    const invalidUsersList: any[] = [];
    Object.keys(userContributions).forEach(userId => {
      const userData = userContributions[userId];
      if (userData.totalContribution > 50) {
        invalidUsersList.push({
          userName: userData.userName,
          totalContribution: userData.totalContribution.toFixed(2),
          contributions: userData.contributions,
        });
      }
    });

    return { isValid: invalidUsersList.length === 0, invalidUsers: invalidUsersList };
  };

  // 提交成员变更
  const handleSubmitMembers = () => {
    const validation = validateContribution();
    if (!validation.isValid) {
      setInvalidUsers(validation.invalidUsers);
      setContributionErrorVisible(true);
      return;
    }
    alert('提交成功');
    setMemberDetailVisible(false);
  };

  // 计算预计剩余奖励
  const getRemainingAmount = (member: TeamMember) => {
    const rewardAmount = parseFloat(member.rewardAmount) || 0;
    const issuedRewardAmount = parseFloat(member.issuedRewardAmount) || 0;
    const remaining = rewardAmount - issuedRewardAmount;
    return remaining > 0 ? remaining.toFixed(2) : '0.00';
  };

  // 打开添加成员弹窗
  const openAddMember = (teamId: string) => {
    setAddMemberTeamId(teamId);
    setSelectedMemberId('');
    setAddMemberVisible(true);
  };

  // 确认添加成员
  const confirmAddMember = () => {
    if (!selectedMemberId) {
      alert('请选择成员');
      return;
    }
    const memberInfo = availableMembers.find(m => m.userId === selectedMemberId);
    if (!memberInfo) return;

    const newMember: TeamMember = {
      id: `m${Date.now()}`,
      userId: memberInfo.userId,
      userName: memberInfo.userName,
      jtTeamRole: 'role002',
      jtTeamRoleName: '成员',
      subTeamContribution: '0',
      isHead: '0',
      isHeadName: '否',
      statusCd: '1000',
      createDate: new Date().toISOString().split('T')[0],
      issuedRewardAmount: '0',
      rewardAmount: '0',
      expandDetails: false,
    };

    setTeamMembers(prev => {
      const newData = { ...prev };
      const team = newData[addMemberTeamId];
      if (team) {
        team.sjtTeamMemberDTOList.push(newMember);
      }
      return newData;
    });

    setAddMemberVisible(false);
  };

  // 判断是否显示邀请成员按钮
  const canInviteMember = (item: any) => {
    return item.auditState !== '20' && item.auditState !== '30';
  };

  // 判断是否显示成员定档审核
  const canMemberAudit = (item: any) => {
    return item.auditState !== '20' && item.auditState !== '30';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">项目列表</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white">
        <div className="flex border-b border-gray-200">
          {['全量项目', '未分配项目', '已分配项目'].map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(['all', 'unassigned', 'assigned'][index])}
              className={`flex-1 py-3 text-center text-sm font-medium transition-colors relative ${
                activeTab === ['all', 'unassigned', 'assigned'][index] ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {tab}
              {activeTab === ['all', 'unassigned', 'assigned'][index] && (
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
              placeholder="请输入项目名称/客户名称"
              className="w-full h-10 pl-10 pr-4 bg-gray-100 rounded-xl text-sm outline-none"
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
                  <h1 className="text-base font-medium text-gray-800">{item.itemName}</h1>
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
                  <span className="mr-2">合同金额/ICT金额/已收款</span>
                  <span className="text-gray-800 flex-1 text-right">{formatAmount(item.contractAmount)}/{formatAmount(item.contractIctAmount)}/{formatAmount(item.skAll)}万元</span>
                </div>
                <div className="flex items-center">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4-1.89-4-3.91 0-1.62 1.38-2.89 3.11-3.21V4h2.67v1.93c1.2.21 2.32 1.09 2.32 2.81 0 .83-.61 1.61-1.59 1.61-.61 0-1.06-.34-1.61-.87l-1.49 1.49c1.01 1.29 2.36 2.13 3.87 2.59V18h-2.68v1.09z'/%3E%3C/svg%3E" alt="" className="w-4 h-4 mr-2" style={{ filter: 'brightness(0)' }} />
                  <span className="mr-2">总奖励/已发放</span>
                  <span className="text-gray-800 flex-1 text-right">{item.itemReward}/0元</span>
                </div>
                <div className="flex items-center">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z'/%3E%3C/svg%3E" alt="" className="w-4 h-4 mr-2" style={{ filter: 'brightness(0)' }} />
                  <span className="mr-2">第一责任人</span>
                  <span className="text-gray-800 flex-1 text-right">{item.firstLeaderName}</span>
                </div>
                <div className="flex items-center">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z'/%3E%3C/svg%3E" alt="" className="w-4 h-4 mr-2" style={{ filter: 'brightness(0)' }} />
                  <span className="mr-2">其他团队成员</span>
                  <span className="text-gray-800 flex-1 text-right">{item.memberList.join('、')}</span>
                </div>
              </div>

              {/* 按钮 */}
              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100 flex-wrap">
                <button
                  onClick={() => handleMemberDetail(item)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  团队成员详情
                </button>
                <button
                  onClick={() => handleMemberChange(item)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  成员变更记录
                </button>
                <button
                  onClick={() => handleDistribute(item)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  发放记录
                </button>
                <button
                  onClick={() => handleAudit(item)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  审核记录
                </button>
                {canInviteMember(item) && (
                  <button
                    onClick={() => handleInvite(item)}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs"
                  >
                    邀请成员
                  </button>
                )}
                {canMemberAudit(item) && (
                  <button
                    onClick={() => navigate(`/ningbo-wallet/team-review/${item.saleOppId}`)}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs"
                  >
                    成员定档审核
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 团队成员详情弹窗 */}
      {memberDetailVisible && selectedProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800">团队成员详情</h3>
              <button onClick={() => setMemberDetailVisible(false)} className="p-2">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {Object.entries(teamMembers).map(([teamId, team]) => (
                <div key={teamId} className="bg-gray-50 rounded-xl overflow-hidden">
                  {/* 团队头部 */}
                  <div
                    className="flex items-center justify-between p-4 bg-white cursor-pointer"
                    onClick={() => toggleTeam(teamId)}
                  >
                    <div className="flex items-center gap-3">
                      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231989fa'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'/%3E%3C/svg%3E" alt="" className="w-6 h-6" />
                      <span className="font-medium text-gray-800">{team.subTeamName}</span>
                      <span className="text-sm text-gray-500">({team.sjtTeamMemberDTOList.length}人)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openAddMember(teamId);
                        }}
                        className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold"
                      >
                        +
                      </button>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedTeams[teamId] ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* 成员列表 */}
                  {expandedTeams[teamId] && team.sjtTeamMemberDTOList.length > 0 && (
                    <div className="p-4 space-y-3">
                      {team.sjtTeamMemberDTOList.map((member) => (
                        <div key={member.id}>
                          {/* 成员行 */}
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg mb-1">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${member.statusCd === '1100' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                {member.userName}
                              </span>
                              {member.isHead === '1' && (
                                <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-xs">负责人</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-blue-600 font-medium">{member.subTeamContribution}%</span>
                              {member.statusCd === '1000' && (
                                <button
                                  onClick={() => handleRemoveMember(teamId, member)}
                                  className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-lg"
                                >
                                  -
                                </button>
                              )}
                              {member.statusCd === '1100' && (
                                <span className="text-xs text-gray-400">已退出</span>
                              )}
                              <button
                                onClick={() => toggleMemberDetails(teamId, member.id)}
                                className="w-7 h-7 rounded bg-gray-200 flex items-center justify-center text-xs"
                              >
                                {member.expandDetails ? '∧' : 'V'}
                              </button>
                            </div>
                          </div>

                          {/* 展开的详细信息 */}
                          {member.expandDetails && member.statusCd === '1000' && (
                            <div className="p-4 bg-white rounded-lg mb-3">
                              <div className="space-y-3">
                                {/* 角色 */}
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500">角色</span>
                                  <button
                                    onClick={() => handleEditMember(team, member)}
                                    className="text-sm text-blue-600"
                                  >
                                    {member.jtTeamRoleName || '请选择'}
                                  </button>
                                </div>
                                {/* 是否为责任人 */}
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500">是否为责任人</span>
                                  <button
                                    onClick={() => handleEditMember(team, member)}
                                    className="text-sm text-blue-600"
                                  >
                                    {member.isHeadName}
                                  </button>
                                </div>
                                {/* 贡献值 */}
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500">贡献值</span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleEditMember(team, member)}
                                      className="text-sm text-blue-600"
                                    >
                                      {member.subTeamContribution}
                                    </button>
                                    <span className="text-sm text-gray-500">%</span>
                                  </div>
                                </div>
                                {/* 加入时间 */}
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500">加入时间</span>
                                  <span className="text-sm text-gray-800">{member.createDate}</span>
                                </div>
                                {/* 已发放奖励 */}
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500">已发放奖励</span>
                                  <span className="text-sm text-gray-800">{member.issuedRewardAmount}元</span>
                                </div>
                                {/* 预计剩余奖励 */}
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500">预计剩余奖励</span>
                                  <span className="text-sm text-gray-800">{getRemainingAmount(member)}元</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {expandedTeams[teamId] && team.sjtTeamMemberDTOList.length === 0 && (
                    <div className="p-4 text-center text-gray-400 text-sm">暂无成员</div>
                  )}
                </div>
              ))}
            </div>

            {/* 底部按钮 */}
            <div className="p-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setMemberDetailVisible(false)}
                className="flex-1 h-12 border border-gray-200 rounded-xl text-gray-700"
              >
                取消
              </button>
              <button
                onClick={handleSubmitMembers}
                className="flex-1 h-12 bg-blue-500 text-white rounded-xl"
              >
                提交
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑成员弹窗 */}
      {editMemberVisible && editingMember && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-end">
          <div className="w-full bg-white rounded-t-3xl">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800">编辑成员</h3>
              <button onClick={() => setEditMemberVisible(false)} className="p-2">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* 角色选择 */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">角色</span>
                <div className="flex gap-2">
                  {roleOptions.map(role => (
                    <button
                      key={role.value}
                      onClick={() => updateMemberRole(role.value)}
                      className={`px-4 py-2 rounded-xl text-sm ${
                        editingMember.jtTeamRole === role.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 是否为责任人 */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">是否为责任人</span>
                <div className="flex gap-2">
                  {isHeadOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => updateMemberIsHead(option.value)}
                      className={`px-4 py-2 rounded-xl text-sm ${
                        editingMember.isHead === option.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 贡献值 */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">贡献值</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={editingMember.subTeamContribution}
                    onChange={(e) => updateMemberContribution(e.target.value)}
                    className="w-20 h-10 text-center border border-gray-200 rounded-xl outline-none"
                  />
                  <span className="text-sm text-gray-600">%</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setEditMemberVisible(false)}
                className="flex-1 h-12 border border-gray-200 rounded-xl text-gray-700"
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 h-12 bg-blue-500 text-white rounded-xl"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 添加成员弹窗 */}
      {addMemberVisible && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-end">
          <div className="w-full bg-white rounded-t-3xl">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800">添加成员</h3>
              <button onClick={() => setAddMemberVisible(false)} className="p-2">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {availableMembers.map((member) => (
                <div
                  key={member.userId}
                  onClick={() => setSelectedMemberId(member.userId)}
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer ${
                    selectedMemberId === member.userId ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{member.userName}</div>
                      <div className="text-xs text-gray-500">{member.dept}</div>
                    </div>
                  </div>
                  {selectedMemberId === member.userId && (
                    <Check className="w-5 h-5 text-blue-500" />
                  )}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setAddMemberVisible(false)}
                className="flex-1 h-12 border border-gray-200 rounded-xl text-gray-700"
              >
                取消
              </button>
              <button
                onClick={confirmAddMember}
                className="flex-1 h-12 bg-blue-500 text-white rounded-xl"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 贡献度错误弹窗 */}
      {contributionErrorVisible && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">提示</h3>
              <button onClick={() => setContributionErrorVisible(false)} className="p-2">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="text-sm text-gray-600 mb-4 space-y-2">
              {invalidUsers.map((user, idx) => (
                <div key={idx} className="p-2 bg-red-50 rounded-lg">
                  <span className="text-red-600">"{user.userName}"</span>整体贡献度占比{user.totalContribution}%
                </div>
              ))}
            </div>
            <div className="text-xs text-red-500 mb-4 p-3 bg-red-50 rounded-xl">
              <p className="font-medium mb-1">整体贡献度超过50%，不支持提交，请修改贡献度</p>
              <p className="text-red-400">公式：(40%×售前销售 + 30%×售前支撑 + 20%×售中 + 10%×售后) ≤ 50%</p>
            </div>
            <button
              onClick={() => setContributionErrorVisible(false)}
              className="w-full h-12 bg-blue-500 text-white rounded-xl"
            >
              调整
            </button>
          </div>
        </div>
      )}

      {/* 邀请成员弹窗 */}
      {inviteVisible && selectedProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800">邀请成员</h3>
              <button onClick={() => setInviteVisible(false)} className="p-2">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-sm text-gray-600 mb-4">
                <p className="mb-2">项目：{selectedProject.itemName}</p>
              </div>

              {/* 团队选择 */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-800 mb-2">选择团队</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'sqxstd', name: '售前销售团队' },
                    { id: 'sqzctd', name: '售前支撑团队' },
                    { id: 'sztd', name: '售中团队' },
                    { id: 'shtd', name: '售后团队' },
                  ].map((team) => (
                    <button
                      key={team.id}
                      onClick={() => {
                        setInviteTeamId(team.id);
                        setInviteTeamName(team.name);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm ${
                        inviteTeamId === team.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {team.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 可选成员列表 */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-800 mb-2">可选成员</div>
                <div className="space-y-2">
                  {availableMembers.map((member) => (
                    <div
                      key={member.userId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{member.userName}</div>
                          <div className="text-xs text-gray-500">{member.dept}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          alert(`已邀请 ${member.userName} 加入 ${inviteTeamName}`);
                          setInviteVisible(false);
                        }}
                        className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm"
                      >
                        添加
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 提示信息 */}
              <div className="text-xs text-gray-500 text-center">
                点击成员右侧"添加"按钮可将该成员加入所选团队
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setInviteVisible(false)}
                className="w-full h-12 border border-gray-200 rounded-xl text-gray-700"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 发放记录弹窗 */}
      {distributeVisible && selectedProject && (
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
      {auditVisible && selectedProject && (
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

      {/* 成员变更记录弹窗 */}
      {memberChangeVisible && selectedProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800">成员变更记录</h3>
              <button onClick={() => setMemberChangeVisible(false)} className="p-2">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {mockMemberChangeData.map((record, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-800">{record.userName}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        record.changeType === '加入' ? 'bg-green-100 text-green-600' :
                        record.changeType === '退出' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {record.changeType}
                      </span>
                    </div>
                    <span className={`text-xs ${
                      record.status === '已通过' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">变更时间：{record.changeDate}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}