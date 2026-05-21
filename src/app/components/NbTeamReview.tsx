import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, X, ChevronDown } from 'lucide-react';

// 模拟数据
const mockApprovalData = {
  saleOppId: 'opp001',
  itemName: '镇海智慧社区ICT项目',
  jtOppCode: 'JT202505001',
  contractAmount: '500000',
  contractIctAmount: '300000',
  skAll: '100000',
  itemReward: '6000',
  firstLeader: { userId: 'user001', userName: '张三' },
  firstLeaderName: '张三',
  sjtTeamMemberVOS: [
    { subTeamId: 'sqxstd', subTeamName: '售前销售团队', sjtTeamMemberDTOList: [
      { id: 'm001', userId: 'user001', userName: '张三', jtTeamRoleName: '负责人', subTeamContribution: '60', isHead: '1', statusCd: '1000', createDate: '2025-05-01', issuedRewardAmount: '3000', rewardAmount: '6000' },
      { id: 'm002', userId: 'user002', userName: '李四', jtTeamRoleName: '成员', subTeamContribution: '40', isHead: '0', statusCd: '1000', createDate: '2025-05-02', issuedRewardAmount: '2000', rewardAmount: '4000' },
    ]},
    { subTeamId: 'sqzctd', subTeamName: '售前支撑团队', sjtTeamMemberDTOList: [
      { id: 'm003', userId: 'user003', userName: '王五', jtTeamRoleName: '负责人', subTeamContribution: '50', isHead: '1', statusCd: '1000', createDate: '2025-05-03', issuedRewardAmount: '2500', rewardAmount: '5000' },
    ]},
    { subTeamId: 'sztd', subTeamName: '售中团队', sjtTeamMemberDTOList: [
      { id: 'm004', userId: 'user004', userName: '赵六', jtTeamRoleName: '负责人', subTeamContribution: '100', isHead: '1', statusCd: '1000', createDate: '2025-05-04', issuedRewardAmount: '5000', rewardAmount: '10000' },
    ]},
    { subTeamId: 'shtd', subTeamName: '售后团队', sjtTeamMemberDTOList: [] },
  ],
};

export function NbTeamReview() {
  const navigate = useNavigate();
  const { saleOppId } = useParams();
  const [approvalData] = useState(mockApprovalData);
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({ sqxstd: true, sqzctd: true, sztd: true, shtd: true });
  const [approvalVisible, setApprovalVisible] = useState(false);

  const formatAmount = (amount: string | number) => {
    const num = parseFloat(String(amount));
    if (isNaN(num)) return '0.00';
    return (num / 10000).toFixed(2);
  };

  const toggleTeam = (teamId: string) => {
    setExpandedTeams(prev => ({ ...prev, [teamId]: !prev[teamId] }));
  };

  const handleApproval = () => {
    setApprovalVisible(true);
  };

  const handleApprovalConfirm = (approved: boolean) => {
    // 模拟审核操作
    setApprovalVisible(false);
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">成员确认审核</h1>
        </div>
      </div>

      <div className="p-4">
        {/* 项目信息卡片 */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 mr-3 flex-shrink-0">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231989fa'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'/%3E%3C/svg%3E" alt="" className="w-full h-full" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-medium text-gray-800">{approvalData.itemName}</h2>
              <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-xs">成员确认审核</span>
            </div>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>商机编码：</span>
              <span className="text-gray-800">{approvalData.jtOppCode}</span>
            </div>
            <div className="flex justify-between">
              <span>合同金额/ICT金额/已收款：</span>
              <span className="text-gray-800">{formatAmount(approvalData.contractAmount)}/{formatAmount(approvalData.contractIctAmount)}/{formatAmount(approvalData.skAll)}万元</span>
            </div>
            <div className="flex justify-between">
              <span>总奖励/已发放：</span>
              <span className="text-gray-800">{approvalData.itemReward}/0元</span>
            </div>
            <div className="flex justify-between">
              <span>第一责任人：</span>
              <span className="text-gray-800">{approvalData.firstLeaderName}</span>
            </div>
          </div>
        </div>

        {/* 团队成员列表 */}
        <div className="space-y-3">
          {approvalData.sjtTeamMemberVOS.map((team) => (
            <div key={team.subTeamId} className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleTeam(team.subTeamId)}
              >
                <div className="flex items-center gap-3">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231989fa'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'/%3E%3C/svg%3E" alt="" className="w-6 h-6" />
                  <span className="font-medium text-gray-800">{team.subTeamName}</span>
                  <span className="text-sm text-gray-500">({team.sjtTeamMemberDTOList.length}人)</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedTeams[team.subTeamId] ? 'rotate-180' : ''}`} />
              </div>

              {expandedTeams[team.subTeamId] && team.sjtTeamMemberDTOList.length > 0 && (
                <div className="p-4 border-t border-gray-100 space-y-3">
                  {team.sjtTeamMemberDTOList.map((member) => (
                    <div key={member.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${member.statusCd === '1100' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {member.userName}
                          </span>
                          {member.isHead === '1' && (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-xs">负责人</span>
                          )}
                        </div>
                        <span className="text-sm text-blue-600">{member.subTeamContribution}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{member.jtTeamRoleName}</span>
                        <span>加入时间：{member.createDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <span>已发放：{member.issuedRewardAmount}元</span>
                        <span>预计剩余：{(parseFloat(member.rewardAmount) - parseFloat(member.issuedRewardAmount)).toFixed(2)}元</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {expandedTeams[team.subTeamId] && team.sjtTeamMemberDTOList.length === 0 && (
                <div className="p-4 border-t border-gray-100 text-center text-gray-400 text-sm">暂无成员</div>
              )}
            </div>
          ))}
        </div>

        {/* 审核按钮 */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 h-12 border border-gray-200 rounded-xl text-gray-700"
          >
            取消
          </button>
          <button
            onClick={handleApproval}
            className="flex-1 h-12 bg-blue-500 text-white rounded-xl"
          >
            审核
          </button>
        </div>
      </div>

      {/* 审核弹窗 */}
      {approvalVisible && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">成员确认审核</h3>
              <button onClick={() => setApprovalVisible(false)} className="p-2">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <p>项目：{approvalData.itemName}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleApprovalConfirm(false)}
                className="flex-1 h-12 border border-gray-200 rounded-xl text-red-600"
              >
                驳回
              </button>
              <button
                onClick={() => handleApprovalConfirm(true)}
                className="flex-1 h-12 bg-blue-500 text-white rounded-xl"
              >
                通过
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}