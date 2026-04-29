import { useState } from 'react';
import { ChevronLeft, Plus, Calendar, User, MapPin, Edit2, Trash2, Link } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';

interface VisitRecord {
  id: string;
  customerName: string;
  customerCode: string;
  visitType: string;
  visitTarget: string;
  visitDate: string;
  visitLocation: string;
  participants: string[];
  keyPoints: string;
}

const visitTypeLabels: { [key: string]: string } = {
  '0': '日常拜访',
  '1': '商机推进拜访',
  '2': '交流拜访',
  '3': '陌生拜访',
  '4': '签约',
  '5': '其他',
  '6': '战略合作',
  '7': '公开活动',
};

const mockVisitRecords: VisitRecord[] = [
  {
    id: '1',
    customerName: '宁波爱地宝商业管理有限公司',
    customerCode: 'CUS20260326001',
    visitType: '1',
    visitTarget: '张总',
    visitDate: '2026-03-25',
    visitLocation: '客户公司会议室',
    participants: ['张总', '李经理'],
    keyPoints: '讨论弱电改造方案细节，确认项目预算和时间节点。客户对方案整体满意，要求增加部分摄像头覆盖范围。',
  },
  {
    id: '2',
    customerName: '宁波爱地宝商业管理有限公司',
    customerCode: 'CUS20260326001',
    visitType: '0',
    visitTarget: '王主任',
    visitDate: '2026-03-20',
    visitLocation: '客户办公室',
    participants: ['王主任'],
    keyPoints: '日常回访，了解客户近期需求，维护客户关系。',
  },
];

// 模拟走访记录数据（同一客户的其他走访记录）
interface WalkVisitRecord {
  id: string;
  visitDate: string;
  visitLocation: string;
  visitTarget: string;
  ourParticipants: string[];
}

const mockWalkVisitRecords: WalkVisitRecord[] = [
  {
    id: 'w1',
    visitDate: '2026-03-18',
    visitLocation: '客户公司前台',
    visitTarget: '张总、李经理',
    ourParticipants: ['王经理', '刘主管'],
  },
  {
    id: 'w2',
    visitDate: '2026-03-15',
    visitLocation: '客户办公楼',
    visitTarget: '赵副总',
    ourParticipants: ['张经理'],
  },
  {
    id: 'w3',
    visitDate: '2026-03-10',
    visitLocation: '客户会议室',
    visitTarget: '李经理、王主任',
    ourParticipants: ['陈总', '王经理'],
  },
  {
    id: 'w4',
    visitDate: '2026-03-05',
    visitLocation: '客户食堂',
    visitTarget: '张总',
    ourParticipants: ['刘主管'],
  },
];

export function VisitRecordList() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [records, setRecords] = useState<VisitRecord[]>(mockVisitRecords);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [walkVisitDialogOpen, setWalkVisitDialogOpen] = useState(false);
  const [selectedWalkVisit, setSelectedWalkVisit] = useState<string | null>(null);

  const handleAddRecord = () => {
    navigate(`/visit-records/${taskId}/new`);
  };

  const handleViewRecord = (recordId: string) => {
    navigate(`/visit-records/${taskId}/${recordId}`);
  };

  const handleEditRecord = (recordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/visit-records/${taskId}/${recordId}`);
  };

  const handleDeleteClick = (recordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecordToDelete(recordId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (recordToDelete) {
      setRecords(records.filter((record) => record.id !== recordToDelete));
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  };

  const handleLinkWalkVisit = () => {
    setWalkVisitDialogOpen(true);
  };

  const handleSelectWalkVisit = (walkVisit: WalkVisitRecord) => {
    // 直接创建一条新的拜访记录并添加到列表
    const newRecord: VisitRecord = {
      id: `new-${Date.now()}`,
      customerName: '宁波爱地宝商业管理有限公司',
      customerCode: 'CUS20260326001',
      visitType: '0', // 默认日常拜访
      visitTarget: walkVisit.visitTarget,
      visitDate: walkVisit.visitDate,
      visitLocation: walkVisit.visitLocation,
      participants: walkVisit.ourParticipants,
      keyPoints: '从走访记录关联生成',
    };
    
    // 添加到记录列表顶部
    setRecords([newRecord, ...records]);
    setWalkVisitDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(`/six-standard/${taskId}`)}
            className="text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium text-gray-900 flex-1">拜访记录</h1>
          <button
            onClick={handleLinkWalkVisit}
            className="flex items-center gap-1 px-3 py-1.5 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
          >
            <Link className="w-4 h-4" />
            <span className="text-sm">关联走访记录</span>
          </button>
          <button
            onClick={handleAddRecord}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">新增</span>
          </button>
        </div>
      </div>

      {/* Records List */}
      <div className="p-4 space-y-4">
        {records.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-4">暂无拜访记录</div>
            <button
              onClick={handleAddRecord}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              添加拜访记录
            </button>
          </div>
        ) : (
          records.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => handleViewRecord(record.id)}
                className="w-full text-left"
              >
                {/* Customer Info */}
                <div className="mb-3 pb-3 border-b">
                  <div className="text-gray-900 font-medium mb-1">{record.customerName}</div>
                  <div className="text-xs text-gray-500">编码：{record.customerCode}</div>
                </div>

                {/* Visit Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                      {visitTypeLabels[record.visitType]}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">拜访对象：</span>
                    <span className="text-gray-900">{record.visitTarget}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">拜访日期：</span>
                    <span className="text-gray-900">{record.visitDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">拜访地点：</span>
                    <span className="text-gray-900">{record.visitLocation}</span>
                  </div>

                  <div className="mt-2 pt-2 border-t">
                    <div className="text-gray-600 mb-1">会谈要点：</div>
                    <div className="text-gray-700 line-clamp-2">{record.keyPoints}</div>
                  </div>
                </div>
              </button>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 pt-3 border-t">
                <button
                  onClick={(e) => handleEditRecord(record.id, e)}
                  className="flex-1 flex items-center justify-center gap-1 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>编辑</span>
                </button>
                <button
                  onClick={(e) => handleDeleteClick(record.id, e)}
                  className="flex-1 flex items-center justify-center gap-1 px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>删除</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm mx-4">
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            确定要删除这条拜访记录吗？���操作不可恢复。
          </DialogDescription>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setDeleteDialogOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleConfirmDelete}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              删除
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Walk Visit Dialog */}
      <Dialog open={walkVisitDialogOpen} onOpenChange={setWalkVisitDialogOpen}>
        <DialogContent className="max-w-sm mx-4">
          <DialogTitle>其他走访记录</DialogTitle>
          <DialogDescription>
            查看该客户的其他走访记录。
          </DialogDescription>
          <div className="space-y-2 mt-4">
            {mockWalkVisitRecords.map((walkVisit) => (
              <div
                key={walkVisit.id}
                className="bg-gray-100 rounded-lg p-3 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSelectWalkVisit(walkVisit)}
              >
                <div className="text-gray-600 mb-1">日期：{walkVisit.visitDate}</div>
                <div className="text-gray-600 mb-1">地点：{walkVisit.visitLocation}</div>
                <div className="text-gray-600 mb-1">对象：{walkVisit.visitTarget}</div>
                <div className="text-gray-600">参与者：{walkVisit.ourParticipants.join(', ')}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setWalkVisitDialogOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              关闭
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}