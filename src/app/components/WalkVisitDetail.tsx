import { useParams, useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { mockWalkVisits } from './WalkVisitList';

// 简单行组件：左 label + 右 value
function DetailRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="text-sm text-gray-700 flex-shrink-0">{label}</div>
      <div className="text-sm text-gray-900 text-right break-words ml-4 flex-1 max-w-[60%]">
        {value ?? <span className="text-gray-400">-</span>}
      </div>
    </div>
  );
}

// 可拨号行
function PhoneRow({ label, phone }: { label: string; phone?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="text-sm text-gray-700">{label}</div>
      {phone ? (
        <a href={`tel:${phone}`} className="text-sm text-blue-500">
          {phone}
        </a>
      ) : (
        <span className="text-sm text-gray-400">-</span>
      )}
    </div>
  );
}

export function WalkVisitDetail() {
  const { walkVisitId } = useParams();
  const navigate = useNavigate();

  const visit = mockWalkVisits.find((v) => v.id === walkVisitId);

  if (!visit) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-20">
          <div className="px-4 py-3 flex items-center">
            <button onClick={() => navigate(-1)} className="text-gray-600">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-medium text-gray-900 flex-1 text-center mr-6">
              走访详情
            </h1>
          </div>
        </div>
        <div className="p-8 text-center text-gray-400">走访记录不存在</div>
      </div>
    );
  }

  // 派单类型：mock 数据里没有该字段，统一显示 "-"
  const dispatchType: string | undefined = undefined;

  // 走访信息（详情块）字段
  const visitInfo = {
    status: '已通过' as string,
    type: '业务洽谈',
    contactName: '测试',
    contactPhone: '17357110123',
    post: '测试',
    department: '测试',
    content: '测试',
    hasCollab: false, // 截图里协同走视为 "无"
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="px-4 py-3 flex items-center">
          <button onClick={() => navigate(-1)} className="text-gray-600">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium text-gray-900 flex-1 text-center mr-6">
            走访详情
          </h1>
        </div>
      </div>

      {/* 第一段：基本信息 */}
      <div className="bg-white px-4 mt-3">
        <DetailRow label="客户名称" value={visit.customerName} />
        <DetailRow
          label="走访地址"
          value={
            visit.address ? (
              <div className="flex items-start justify-end gap-2">
                <span>{visit.address}</span>
                <button
                  onClick={() => alert('地图查看功能开发中')}
                  className="text-blue-500 text-sm flex-shrink-0"
                >
                  查看&gt;
                </button>
              </div>
            ) : (
              undefined
            )
          }
        />
        <DetailRow label="派单类型" value={dispatchType} />
        <DetailRow label="走访日期" value={visit.visitDate} />
        <DetailRow label="走访人" value={visit.accountManager.name} />
        <PhoneRow label="走访人号码" phone={visit.accountManager.phone} />
      </div>

      {/* 第二段：走访信息（浅灰背景上的灰底块） */}
      <div className="px-3 mt-4">
        <div className="bg-gray-50 rounded-2xl p-4">
          {/* 标题 + 状态胶囊 */}
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-base font-medium text-gray-900">走访信息</h2>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
              {visitInfo.status}
            </span>
          </div>

          {/* 字段 */}
          <div>
            <DetailRow label="走访类型" value={visitInfo.type} />
            <DetailRow label="联系人" value={visitInfo.contactName} />
            <PhoneRow label="联系电话" phone={visitInfo.contactPhone} />
            <DetailRow label="岗位" value={visitInfo.post} />
            <DetailRow label="部门" value={visitInfo.department} />
            <DetailRow label="走访内容" value={visitInfo.content} />
            <DetailRow label="协同走访" value={visitInfo.hasCollab ? '有' : '无'} />
            {visitInfo.hasCollab ? (
              <>
                <DetailRow label="协同走访人员姓名" />
                <DetailRow label="协同走访人员走访动作评价" />
              </>
            ) : (
              <DetailRow label="是否蓝海客户" value={visit.customerType === 'blueocean' ? '是' : '否'} />
            )}
          </div>
        </div>
      </div>

      {/* 底部按钮：历史走访信息 */}
      <div className="fixed left-0 right-0 bottom-0 px-4 pb-6 pt-2 bg-gradient-to-t from-white to-white/0">
        <button
          onClick={() => alert('历史走访信息功能开发中')}
          className="w-full py-3 bg-blue-500 text-white rounded-xl text-base hover:bg-blue-600"
        >
          历史走访信息
        </button>
      </div>
    </div>
  );
}
