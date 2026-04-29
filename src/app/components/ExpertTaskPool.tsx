import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Search, X, Plus, Star, Users, Clock, MapPin, Calendar, Paperclip, Filter, ChevronLeft, Camera, Upload, FileText } from 'lucide-react';
import { useNavigate } from 'react-router';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';

// ============= 类型定义 =============
type TaskStatus = '待审核' | '待接单' | '已接单';
type MemberStatus = '待派单' | '待接单' | '申请接单' | '已接单';
type MemberSource = '邀请派单' | '申请接单';
type TaskCategory = '营销' | '产数' | '云网' | '综合';
type TaskType = '走访支撑' | '综合支撑';

interface Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  publisher: string;
  publishTime: string;
  estimatedHours: number;
  category: TaskCategory;
  taskType?: TaskType;
  region: string;
  requiredCount: number;
  startTime: string;
  endTime: string;
  attachments: string[];
  members: TaskMember[];
  customerName?: string;
  customerAddress?: string;
  opportunityCode?: string;
  auditor?: string;
  auditTime?: string;
}

interface TaskMember {
  id: string;
  name: string;
  phone: string;
  department: string;
  status: MemberStatus;
  source: MemberSource;
  dispatchTime?: string;
  acceptTime?: string;
  applyTime?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  reports?: Array<{
    time: string;
    description: string;
    attachments?: string[];
  }>;
}

interface ExpertMember {
  id: string;
  name: string;
  branch: string;
  phone: string;
  level?: string;
  category?: string;
  specialties?: string;
  type: 'expert' | 'manager';
}

interface DispatchItem {
  id: string;
  taskName: string;
  description?: string;
  publisher: string;
  expertName: string;
  customerName: string;
  customerAddress: string;
  createTime: string;
  dispatchTime: string;
  status: '待派单' | '待接单' | '已接单' | '已拒绝';
  area: string;
  estimatedHours: number;
  category?: string;
  taskType?: TaskType;
  region?: string;
  requiredCount?: number;
  startTime?: string;
  endTime?: string;
  customerCode?: string;
  members?: TaskMember[];
  source?: 'dispatch' | 'apply'; // 任务来源：派单 / 申请
  auditor?: string;
  auditTime?: string;
}

type FirstTabType = '全部' | '待审核' | '待接单' | '已接单';
type MyTaskTabType = '我发起的任务' | '我接收的任务';
type MainTabType = '专家任务池' | '我的任务单';

// ============= Mock 数据 =============
const mockExperts: ExpertMember[] = [
  { id: '1', name: '李旭峰', branch: '(北仑综合汽车企业支局)', phone: '15306865206', level: '三级', category: '营销', type: 'expert' },
  { id: '2', name: '王连宇', branch: '(北仑综合汽车企业支局)', phone: '19805843397', level: '储备', specialties: '产数·站研·软研', type: 'expert' },
  { id: '3', name: '杨欣怡', branch: '(北仑综合汽车企业支局)', phone: '15306861879', level: '首干', category: '云网', type: 'expert' },
  { id: '11', name: '张三', branch: '(北仑综合汽车企业支局)', phone: '15306865201', level: '二级', category: '营销', type: 'expert' },
  { id: '12', name: '李四', branch: '(北仑综合汽车企业支局)', phone: '15306865202', level: '三级', category: '技术', type: 'expert' },
  { id: '13', name: '王五', branch: '(北仑综合汽车企业支局)', phone: '15306865203', level: '一级', category: '云网', type: 'expert' },
];

const initialTasks: Task[] = [
  {
    id: '1',
    name: '宁波银行数字化转型项目支持',
    description: '需要专家支持宁波银行的数字化转型项目，提供技术方案咨询和实施指导。',
    status: '待审核',
    publisher: '费佳',
    publishTime: '2026-04-20 10:30',
    estimatedHours: 40,
    category: '产数',
    taskType: '走访支撑',
    region: '宁波市',
    requiredCount: 3,
    startTime: '2026-04-25',
    endTime: '2026-05-30',
    attachments: ['项目需求文档.pdf'],
    members: [
      { id: 'm1', name: '李旭峰', phone: '15306865206', department: '北仑综合汽车企业支局', status: '待派单', source: '邀请派单', dispatchTime: '2026-04-20 10:35' },
    ],
    customerName: '宁波银行',
    customerAddress: '宁波市鄞州区民安路128号',
    opportunityCode: 'SH202604001',
  },
  {
    id: '2',
    name: '镇海区企业上云培训',
    description: '为镇海区企业提供云服务使用培训，帮助企业快速上云。',
    status: '待接单',
    publisher: '费佳',
    publishTime: '2026-04-18 09:00',
    auditor: '周明',
    auditTime: '2026-04-18 09:30',
    estimatedHours: 16,
    category: '云网',
    region: '镇海区',
    requiredCount: 2,
    startTime: '2026-04-28',
    endTime: '2026-04-30',
    attachments: [],
    members: [
      { id: 'm3', name: '杨欣怡', phone: '15306861879', department: '北仑综合汽车企业支局', status: '待派单', source: '邀请派单', dispatchTime: '2026-04-18 09:15' },
      { id: 'm4', name: '张三', phone: '15306865201', department: '北仑综合汽车企业支局', status: '申请接单', source: '申请接单', applyTime: '2026-04-18 14:00' },
    ],
  },
  {
    id: '3',
    name: '北仑制造业营销咨询项目',
    description: '为北仑区制造业企业提供营销咨询和方案支持。',
    status: '已接单',
    publisher: '费佳',
    publishTime: '2026-04-15 14:00',
    auditor: '周明',
    auditTime: '2026-04-15 16:00',
    estimatedHours: 24,
    category: '营销',
    taskType: '综合支撑',
    region: '北仑区',
    requiredCount: 2,
    startTime: '2026-04-20',
    endTime: '2026-05-10',
    attachments: [],
    members: [
      { id: 'm5', name: '王连宇', phone: '19805843397', department: '北仑综合汽车企业支局', status: '已接单', source: '申请接单', applyTime: '2026-04-16 10:00', acceptTime: '2026-04-16 14:30', actualStartTime: '2026-04-17', actualEndTime: '2026-04-19', reports: [{ time: '2026-04-20 16:30', description: '已完成北仑制造业营销方案初稿，现场走访两次，收集需求文档3份。', attachments: ['营销方案初稿.docx', '需求调研.pdf'] }, { time: '2026-04-22 10:00', description: '方案已与客户确认，补充修改意见后提交最终版。', attachments: ['营销方案终稿.docx'] }] },
    ],
  },
  {
    id: '4',
    name: '海曙区智慧社区建设支撑项目',
    description: '为海曙区智慧社区建设提供技术支撑和方案咨询。',
    status: '已接单',
    publisher: '费佳',
    publishTime: '2026-04-10 09:00',
    auditor: '周明',
    auditTime: '2026-04-10 10:00',
    estimatedHours: 32,
    category: '云网',
    taskType: '综合支撑',
    region: '海曙区',
    requiredCount: 2,
    startTime: '2026-04-15',
    endTime: '2026-05-15',
    attachments: [],
    members: [
      { id: 'm6', name: '杨欣怡', phone: '15306861879', department: '北仑综合汽车企业支局', status: '已接单', source: '邀请派单', dispatchTime: '2026-04-10 09:30', acceptTime: '2026-04-10 11:00', actualStartTime: '2026-04-15', actualEndTime: '2026-04-20' },
    ],
  },
  {
    id: '5',
    name: '鄞州区中小企业数字化诊断服务',
    description: '为鄞州区中小企业提供数字化现状诊断和提升建议。',
    status: '已接单',
    publisher: '费佳',
    publishTime: '2026-04-05 10:00',
    auditor: '周明',
    auditTime: '2026-04-05 14:00',
    estimatedHours: 20,
    category: '产数',
    taskType: '综合支撑',
    region: '鄞州区',
    requiredCount: 3,
    startTime: '2026-04-10',
    endTime: '2026-05-10',
    attachments: [],
    members: [],
  },
];

const mockMyTasks: DispatchItem[] = [
  {
    id: '1',
    taskName: '宁波银行数字化转型项目支持',
    description: '需要专家支持宁波银行的数字化转型项目，提供技术方案咨询和实施指导。',
    publisher: '回陆',
    expertName: '李旭峰',
    customerName: '宁波银行股份有限公司',
    customerAddress: '宁波市鄞州区宁东路900号',
    createTime: '2026-04-20 10:30:00',
    dispatchTime: '2026-04-20 10:35:00',
    status: '待接单',
    area: '宁波市',
    category: '产数',
    taskType: '走访支撑',
    region: '宁波市',
    requiredCount: 3,
    estimatedHours: 40,
    startTime: '2026-04-25',
    endTime: '2026-05-30',
    customerCode: 'SH202604001',
    source: 'dispatch',
    auditor: '周明',
    auditTime: '2026-04-20 11:00',
  },
  {
    id: '2',
    taskName: '江北企业数字化转型咨询项目',
    description: '为江北企业提供数字化转型方案咨询和技术支持。',
    publisher: '金钰琳',
    expertName: '王连宇',
    customerName: '宁波江北某科技公司',
    customerAddress: '宁波市江北区来福士广场',
    createTime: '2026-04-22 14:00:00',
    dispatchTime: '2026-04-22 14:30:00',
    status: '待接单',
    area: '江北区',
    category: '产数',
    taskType: '走访支撑',
    region: '江北区',
    requiredCount: 2,
    estimatedHours: 20,
    startTime: '2026-04-25',
    endTime: '2026-05-15',
    source: 'apply',
    auditor: '周明',
    auditTime: '2026-04-22 15:00',
  },
  {
    id: '3',
    taskName: '镇海区企业上云培训',
    description: '为镇海区企业提供云服务使用培训，帮助企业快速上云。',
    publisher: '查林如',
    expertName: '王连宇',
    customerName: '宁波某制造企业',
    customerAddress: '宁波市镇海区骆驼街道',
    createTime: '2026-04-18 09:00:00',
    dispatchTime: '2026-04-18 09:15:00',
    status: '已接单',
    auditor: '周明',
    auditTime: '2026-04-18 10:00',
    area: '镇海区',
    category: '云网',
    taskType: '综合支撑',
    region: '镇海区',
    requiredCount: 2,
    estimatedHours: 16,
    startTime: '2026-04-28',
    endTime: '2026-04-30',
    source: 'dispatch',
    members: [
      { id: 'm7', name: '费佳', phone: '15305606921', department: '镇海云中台分部', status: '已接单', source: '邀请派单', dispatchTime: '2026-04-18 09:15', acceptTime: '2026-04-18 10:00', actualStartTime: '2026-04-28', actualEndTime: '2026-04-28', reports: [{ time: '2026-04-28 15:00', description: '已完成企业上云培训第一场，覆盖客户20家，收集反馈表15份。', attachments: ['培训PPT.pptx', '反馈表.xlsx'] }] },
    ],
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  '待审核': { label: '待审核', color: 'bg-yellow-100 text-yellow-700' },
  '待接单': { label: '待接单', color: 'bg-blue-100 text-blue-700' },
  '已接单': { label: '已接单', color: 'bg-green-100 text-green-700' },
  '已拒绝': { label: '已拒绝', color: 'bg-red-100 text-red-700' },
};

// ============= 发布任务表单组件 =============
interface PublishTaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (task: Omit<Task, 'id' | 'status' | 'publisher' | 'publishTime' | 'members'>) => void;
}

function PublishTaskDialog({ open, onOpenChange, onSubmit }: PublishTaskFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [category, setCategory] = useState<TaskCategory>('营销');
  const [taskType, setTaskType] = useState<TaskType>('综合支撑');
  const [region, setRegion] = useState('');
  const [requiredCount, setRequiredCount] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [opportunityCode, setOpportunityCode] = useState('');

  useEffect(() => {
    if (open) {
      setName(''); setDescription(''); setEstimatedHours(''); setCategory('营销');
      setTaskType('综合支撑'); setRegion(''); setRequiredCount(''); setStartTime(''); setEndTime('');
      setAttachments([]); setCustomerName(''); setCustomerAddress(''); setOpportunityCode('');
    }
  }, [open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments: string[] = [];
      for (let i = 0; i < files.length; i++) {
        newAttachments.push(files[i].name);
      }
      setAttachments([...attachments, ...newAttachments]);
    }
    e.target.value = '';
  };

  const handleCameraCapture = () => {
    const newAttachment = `photo_${Date.now()}.jpg`;
    setAttachments([...attachments, newAttachment]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!name || !description || !estimatedHours || !region || !requiredCount || !startTime || !endTime) return;
    onSubmit({
      name, description, estimatedHours: Number(estimatedHours), category, taskType, region,
      requiredCount: Number(requiredCount), startTime, endTime, attachments,
      customerName: taskType === '走访支撑' ? customerName : undefined,
      customerAddress: taskType === '走访支撑' ? customerAddress : undefined,
      opportunityCode: taskType === '走访支撑' ? opportunityCode : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-full p-0 gap-0 bg-white rounded-t-2xl fixed bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0 h-[85vh] flex flex-col border-0">
        <DialogTitle className="sr-only">发布新任务</DialogTitle>

        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <div className="w-10" />
          <h2 className="text-lg font-medium flex-1 text-center">发布新任务</h2>
          <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="taskName" className="text-sm text-gray-700">任务名称 *</Label>
            <input id="taskName" type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="请输入任务名称" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taskDesc" className="text-sm text-gray-700">任务描述 *</Label>
            <textarea id="taskDesc" value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入任务描述" rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-700">任务分类 *</Label>
            <RadioGroup value={category} onValueChange={(value) => setCategory(value as TaskCategory)} className="flex items-center gap-4">
              {(['营销', '产数', '云网', '综合'] as TaskCategory[]).map((cat) => (
                <div key={cat} className="flex items-center gap-2">
                  <RadioGroupItem value={cat} id={`category-${cat}`} />
                  <Label htmlFor={`category-${cat}`} className="cursor-pointer">{cat}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-700">专家类型 *</Label>
            <RadioGroup value={taskType} onValueChange={(value) => setTaskType(value as TaskType)} className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="走访支撑" id="taskType-visit" />
                <Label htmlFor="taskType-visit" className="cursor-pointer">走访支撑</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="综合支撑" id="taskType-general" />
                <Label htmlFor="taskType-general" className="cursor-pointer">综合支撑</Label>
              </div>
            </RadioGroup>
          </div>

          {taskType === '走访支撑' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-sm text-gray-700">客户名称 *</Label>
                <input id="customerName" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="请输入客户名称" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerAddress" className="text-sm text-gray-700">客户地址 *</Label>
                <input id="customerAddress" type="text" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="请输入客户地址" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="opportunityCode" className="text-sm text-gray-700">商机编码 *</Label>
                <input id="opportunityCode" type="text" value={opportunityCode} onChange={(e) => setOpportunityCode(e.target.value)}
                  placeholder="请输入商机编码" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region" className="text-sm text-gray-700">区域 *</Label>
              <input id="region" type="text" value={region} onChange={(e) => setRegion(e.target.value)}
                placeholder="如：宁波市" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requiredCount" className="text-sm text-gray-700">需求人数 *</Label>
              <input id="requiredCount" type="number" value={requiredCount} onChange={(e) => setRequiredCount(e.target.value)}
                placeholder="如：3" min="1" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedHours" className="text-sm text-gray-700">预计工时（人/天） *</Label>
            <input id="estimatedHours" type="number" value={estimatedHours} onChange={(e) => setEstimatedHours(e.target.value)}
              placeholder="如：40" min="1" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-sm text-gray-700">开始时间 *</Label>
              <input id="startTime" type="date" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-sm text-gray-700">结束时间 *</Label>
              <input id="endTime" type="date" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* 附件上传 */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-700">附件上传</Label>
            <div className="grid grid-cols-3 gap-3">
              {/* 拍照 */}
              <button
                onClick={handleCameraCapture}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">拍照</span>
              </button>

              {/* 从相册选择 */}
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">相册</span>
              </label>

              {/* 文件 */}
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <FileText className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">文件</span>
              </label>
            </div>
          </div>

          {/* 已上传的附件列表 */}
          {attachments.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm text-gray-700">已上传附件</Label>
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">{file}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveAttachment(index)}
                      className="text-gray-400 hover:text-red-500 flex-shrink-0 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 py-4 border-t bg-white flex-shrink-0">
          <button onClick={() => onOpenChange(false)} className="flex-1 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button onClick={handleSubmit} className="flex-1 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600">发布</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============= 申请接单确认弹窗组件 =============
interface ApplyConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskName: string;
  onConfirm: () => void;
}

function ApplyConfirmDialog({ open, onOpenChange, taskName, onConfirm }: ApplyConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogTitle>确认申请</DialogTitle>
        <DialogDescription className="sr-only">确认申请接单</DialogDescription>
        <div className="py-4">
          <p className="text-gray-700 text-center">
            是否申请接单<span className="font-medium text-gray-900 mx-1">「{taskName}」</span>？
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onOpenChange(false)} className="flex-1 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button onClick={handleConfirm} className="flex-1 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">确认申请</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============= 撤单确认弹窗组件 =============
interface CancelConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskName: string;
  onConfirm: () => void;
}

function CancelConfirmDialog({ open, onOpenChange, taskName, onConfirm }: CancelConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogTitle>确认撤单</DialogTitle>
        <DialogDescription className="sr-only">确认撤单</DialogDescription>
        <div className="py-4">
          <p className="text-gray-700 text-center">
            确定要撤消任务<span className="font-medium text-gray-900 mx-1">「{taskName}」</span>吗？
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onOpenChange(false)} className="flex-1 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button onClick={handleConfirm} className="flex-1 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600">确认撤单</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============= 审核弹窗组件 =============
interface AuditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'approve' | 'reject' | null;
  onSubmit: (reason: string) => void;
}

function AuditDialog({ open, onOpenChange, action, onSubmit }: AuditDialogProps) {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    onSubmit(reason);
    setReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogTitle>{action === 'approve' ? '审核通过' : '审核拒绝'}</DialogTitle>
        <DialogDescription className="sr-only">{action === 'approve' ? '审核通过' : '审核拒绝'}</DialogDescription>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="auditReason" className="text-sm text-gray-700">{action === 'approve' ? '通过原因' : '拒绝原因'}</Label>
            <textarea id="auditReason" value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder={`请输入${action === 'approve' ? '通过原因' : '拒绝原因'}`} rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onOpenChange(false)} className="flex-1 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button onClick={handleSubmit} className={`flex-1 py-2 text-white rounded-lg hover:opacity-90 ${action === 'approve' ? 'bg-green-500' : 'bg-red-500'}`}>确定</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============= 任务详情弹窗组件 =============
interface TaskDetailDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (taskId: string, action: string, memberId?: string) => void;
  secondTab?: '我发起的任务' | '我接收的任务' | '我审核的任务';
}

function TaskDetailDialog({ task, open, onOpenChange, onAction, secondTab }: TaskDetailDialogProps) {
  if (!task) return null;

  const isDispatchItem = 'source' in task;
  const taskName = isDispatchItem ? (task as DispatchItem).taskName : (task as Task).name;
  const region = isDispatchItem ? (task as DispatchItem).area : (task as Task).region;
  const publisher = isDispatchItem ? (task as DispatchItem).publisher : (task as Task).publisher;
  const publishTime = isDispatchItem ? (task as DispatchItem).createTime : (task as Task).publishTime;
  const customerName = isDispatchItem ? (task as DispatchItem).customerName : (task as Task).customerName;
  const customerAddress = isDispatchItem ? (task as DispatchItem).customerAddress : (task as Task).customerAddress;
  const opportunityCode = isDispatchItem ? (task as DispatchItem).customerCode : (task as Task).opportunityCode;
  const attachments = isDispatchItem ? [] : (task as Task).attachments;
  const auditor = isDispatchItem ? (task as DispatchItem).auditor : (task as Task).auditor;
  const auditTime = isDispatchItem ? (task as DispatchItem).auditTime : (task as Task).auditTime;

  const memberStatusColors: Record<MemberStatus, string> = {
    '待派单': 'bg-gray-100 text-gray-600',
    '待接单': 'bg-orange-100 text-orange-700',
    '申请接单': 'bg-purple-100 text-purple-700',
    '已接单': 'bg-green-100 text-green-700',
  };

  const sourceColors: Record<MemberSource, string> = {
    '邀请派单': 'bg-blue-50 text-blue-600',
    '申请接单': 'bg-green-50 text-green-600',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-full p-0 gap-0 bg-white rounded-t-2xl fixed bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0 max-h-[80vh] flex flex-col border-0">
        <DialogTitle className="sr-only">任务详情</DialogTitle>

        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <h2 className="text-lg font-medium">任务详情</h2>
          <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">{taskName}</h3>
              <span className={`px-3 py-1 rounded-full text-xs ${statusConfig[task.status]?.color}`}>{task.status}</span>
            </div>
            <p className="text-gray-600 text-sm">{task.description}</p>
          </div>

          <div className="space-y-2 text-sm">
            {/* 发起人 + 发起时间 */}
            <div className="grid grid-cols-[1.25rem_3.5rem_1fr_1.25rem_3.5rem_1fr] gap-x-3 items-start">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600 whitespace-nowrap">发起人：</span><span className="text-gray-800">{publisher}</span>
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600 whitespace-nowrap">发起时间：</span><span className="text-gray-500 truncate">{publishTime}</span>
            </div>
            {/* 审核人 + 审核时间 */}
            {auditor ? (
              <div className="grid grid-cols-[1.25rem_3.5rem_1fr_1.25rem_3.5rem_1fr] gap-x-3 items-start">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600 whitespace-nowrap">审核人：</span><span className="text-gray-800">{auditor}</span>
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600 whitespace-nowrap">审核时间：</span><span className="text-gray-500 truncate">{auditTime || '—'}</span>
              </div>
            ) : null}
            {/* 需求 + 工时 */}
            <div className="grid grid-cols-[1.25rem_3.5rem_1fr_1.25rem_3.5rem_1fr] gap-x-3 items-start">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600 whitespace-nowrap">需求：</span><span className="text-gray-800">{task.requiredCount} 人</span>
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600 whitespace-nowrap">工时：</span><span className="text-gray-800">{task.estimatedHours} 人/天</span>
            </div>
            {/* 时间范围 */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600 whitespace-nowrap">时间：</span><span className="text-gray-500">{task.startTime} 至 {task.endTime}</span>
            </div>
            {/* 附件 */}
            {attachments.length > 0 && (
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-gray-400" />
                <span className="text-gray-500">附件：</span><span className="text-gray-700">{attachments.join('、')}</span>
              </div>
            )}
            {/* 区域 + 分类 + 类型 */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">{region}</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">{task.category}</span>
              {task.taskType && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">{task.taskType}</span>}
            </div>
            {/* 走访支撑详情 */}
            {task.taskType === '走访支撑' && (
              <div className="space-y-1">
                {customerName && <div className="flex items-center gap-2 text-sm"><span className="text-gray-500">客户名称：</span><span className="text-gray-700">{customerName}</span></div>}
                {customerAddress && <div className="flex items-center gap-2 text-sm"><span className="text-gray-500">客户地址：</span><span className="text-gray-700">{customerAddress}</span></div>}
                {opportunityCode && <div className="flex items-center gap-2 text-sm"><span className="text-gray-500">商机编码：</span><span className="text-gray-700">{opportunityCode}</span></div>}
              </div>
            )}
          </div>

          {/* 操作按钮 - 根据 secondTab 区分 */}
          {secondTab === '我发起的任务' && task.status === '待审核' && (
            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => onAction(task.id, 'cancel')} className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">撤单</button>
            </div>
          )}

          {secondTab === '我发起的任务' && task.status === '待接单' && (
            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => onAction(task.id, 'cancel')} className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">撤单</button>
              <button onClick={() => onAction(task.id, 'invite')} className="px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm">派单</button>
            </div>
          )}

          {secondTab === '我发起的任务' && task.status === '已接单' && (
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-sm text-gray-500">（无操作按钮）</span>
            </div>
          )}

          {secondTab === '我审核的任务' && task.status === '待审核' && (
            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => onAction(task.id, 'approve')} className="px-3 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 text-sm">审核通过</button>
              <button onClick={() => onAction(task.id, 'reject')} className="px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 text-sm">审核拒绝</button>
            </div>
          )}

          {secondTab === '我审核的任务' && task.status === '已接单' && (
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-sm text-gray-500">（无操作按钮）</span>
            </div>
          )}

          {secondTab === '我接收的任务' && 'source' in task && (task as DispatchItem).status === '待接单' && (task as DispatchItem).source === 'dispatch' && (
            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => onAction(task.id, 'accept')} className="px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 text-sm">接单</button>
              <button onClick={() => onAction(task.id, 'refuse')} className="px-3 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 text-sm">拒绝</button>
            </div>
          )}

          {secondTab === '我接收的任务' && 'source' in task && (task as DispatchItem).status === '待接单' && (task as DispatchItem).source === 'apply' && (
            <div className="flex flex-wrap gap-2 pt-2 pt-2">
              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">申请待同意</span>
            </div>
          )}

          {secondTab === '我接收的任务' && 'source' in task && (task as DispatchItem).status === '已接单' && (
            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => onAction(task.id, 'supplement')} className="px-3 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 text-sm">补充信息</button>
            </div>
          )}

          {/* 接单人列表 - 派单人视角 */}
          {task.members?.length > 0 && task.status === '已接单' && (
            <div className="space-y-3 pt-2">
              <h4 className="font-medium text-gray-800">接单人信息</h4>
              <div className="space-y-3">
                {(task.members || []).map((member) => (
                  <div key={member.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-medium flex items-center gap-1">
                          {member.name}
                          <span className={`px-1.5 py-0.5 text-xs rounded ${member.source === '邀请派单' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                            {member.source === '邀请派单' ? '邀请' : '申请'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">电话：{member.phone}</div>
                        <div className="text-sm text-gray-600">部门：{member.department}</div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-xs ${memberStatusColors[member.status]}`}>{member.status}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {member.source === '申请接单' && member.status === '申请接单' && (
                          <>
                            <button onClick={() => onAction(task.id, 'agreeApply', member.id)} className="px-3 py-1 text-sm text-green-600 border border-green-600 rounded hover:bg-green-50">同意申请</button>
                            <button onClick={() => onAction(task.id, 'rejectApply', member.id)} className="px-3 py-1 text-sm text-red-500 border border-red-500 rounded hover:bg-red-50">拒绝申请</button>
                          </>
                        )}
                        {member.source === '邀请派单' && member.status === '待派单' && (
                          <>
                            <button onClick={() => onAction(task.id, 'dispatch', member.id)} className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">派单</button>
                            <button onClick={() => onAction(task.id, 'remove', member.id)} className="px-3 py-1 text-sm text-red-500 border border-red-500 rounded hover:bg-red-50">移除</button>
                          </>
                        )}
                        {(member.status === '已接单' && (secondTab === '我接收的任务' || secondTab === '我发起的任务')) && (
                          <button onClick={() => onAction(task.id, 'participate', member.id)} className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">是否参与</button>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 space-y-0.5">
                      {member.dispatchTime && <div>派单时间：{member.dispatchTime}</div>}
                      {member.applyTime && <div>申请时间：{member.applyTime}</div>}
                      {member.acceptTime && <div>接单时间：{member.acceptTime}</div>}
                      {member.actualStartTime && <div>实际参与：{member.actualStartTime.slice(0, 10)}{member.actualEndTime ? ` 至 ${member.actualEndTime.slice(0, 10)}` : ''}</div>}
                    </div>
                    {(member.reports || []).map((report, i) => (
                      <div key={i} className="text-sm text-gray-700 pt-1 border-t border-gray-200">
                        <div className="text-gray-400 text-xs mb-1">回单时间：{report.time}</div>
                        <div className="text-gray-700">{report.description}</div>
                        {report.attachments && report.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {report.attachments.map((file, j) => (
                              <span key={j} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{file}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============= 选人弹窗组件 =============
interface SelectExpertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (members: ExpertMember[]) => void;
  selectedIds: string[];
}

function SelectExpertDialog({ open, onOpenChange, onSelect, selectedIds }: SelectExpertDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);

  const filteredExperts = mockExperts.filter(
    (expert) => !selectedIds.includes(expert.id) &&
    (expert.name.includes(searchQuery) || expert.phone.includes(searchQuery) || expert.branch.includes(searchQuery))
  );

  const toggleMember = (id: string) => {
    setTempSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleConfirm = () => {
    const selected = mockExperts.filter((e) => tempSelectedIds.includes(e.id));
    onSelect(selected);
    setTempSelectedIds([]);
    setSearchQuery('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-full p-0 gap-0 bg-white rounded-t-2xl fixed bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0 h-[70vh] flex flex-col border-0">
        <DialogTitle className="sr-only">选择专家</DialogTitle>

        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <div className="w-10" />
          <h2 className="text-lg font-medium flex-1 text-center">选择专家</h2>
          <button onClick={() => { setTempSelectedIds([]); setSearchQuery(''); onOpenChange(false); }} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 flex-shrink-0">
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input type="text" placeholder="搜索专家姓名、电话、部门" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none ml-2 text-gray-700" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {filteredExperts.length === 0 ? (
            <div className="text-center text-gray-400 py-8">暂无结果</div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
              {filteredExperts.map((expert) => {
                const isSelected = tempSelectedIds.includes(expert.id);
                return (
                  <div key={expert.id} className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                    onClick={() => toggleMember(expert.id)}>
                    <Checkbox checked={isSelected} onCheckedChange={() => toggleMember(expert.id)} className="mt-0.5" />
                    <div className="flex-1 space-y-1 text-sm">
                      <div className="text-gray-900 flex items-center gap-2">
                        {expert.name}<span className="text-gray-600">{expert.branch}</span>
                      </div>
                      <div className="text-gray-600">电话：{expert.phone}</div>
                      {expert.level && (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">{expert.level}</span>
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">{expert.category || expert.specialties}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 py-4 border-t bg-white flex-shrink-0">
          <button onClick={() => { setTempSelectedIds([]); setSearchQuery(''); onOpenChange(false); }}
            className="flex-1 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button onClick={handleConfirm} className="flex-1 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600">确定 ({tempSelectedIds.length})</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============= 参与详情弹窗 =============
interface ParticipateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TaskMember | null;
  onConfirm: (isParticipated: boolean, startTime: string, endTime: string) => void;
}

function ParticipateDialog({ open, onOpenChange, member, onConfirm }: ParticipateDialogProps) {
  const [isParticipated, setIsParticipated] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (member && open) { setIsParticipated(false); setStartTime(''); setEndTime(''); }
  }, [member, open]);

  const handleConfirm = () => { onConfirm(isParticipated, startTime, endTime); onOpenChange(false); };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogTitle>是否参与</DialogTitle>
        <DialogDescription className="sr-only">设置专家参与详情</DialogDescription>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm text-gray-700">专家姓名</Label>
            <div className="text-gray-900">{member.name}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-gray-700">是否参与</Label>
            <RadioGroup value={isParticipated ? 'yes' : 'no'} onValueChange={(value) => setIsParticipated(value === 'yes')}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="participate-yes" />
                  <Label htmlFor="participate-yes" className="cursor-pointer">是</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="participate-no" />
                  <Label htmlFor="participate-no" className="cursor-pointer">否</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          {isParticipated && (
            <>
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-sm text-gray-700">开始时间</Label>
                <input id="startTime" type="date" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm text-gray-700">结束时间</Label>
                <input id="endTime" type="date" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={() => onOpenChange(false)} className="flex-1 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button onClick={handleConfirm} className="flex-1 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">确定</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============= 补充信息弹窗组件 =============
interface SupplementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskName: string;
  onSubmit: (data: { content: string; attachments: string[] }) => void;
}

function SupplementDialog({ open, onOpenChange, taskName, onSubmit }: SupplementDialogProps) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setContent('');
      setAttachments([]);
    }
  }, [open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments: string[] = [];
      for (let i = 0; i < files.length; i++) {
        newAttachments.push(files[i].name);
      }
      setAttachments([...attachments, ...newAttachments]);
    }
    e.target.value = '';
  };

  const handleCameraCapture = () => {
    // 模拟拍照，实际项目中需要使用相机 API
    const newAttachment = `photo_${Date.now()}.jpg`;
    setAttachments([...attachments, newAttachment]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit({ content, attachments });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-full p-0 gap-0 bg-white rounded-t-2xl fixed bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0 max-h-[85vh] flex flex-col border-0">
        <DialogTitle className="sr-only">补充信息</DialogTitle>

        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <div className="w-10" />
          <h2 className="text-lg font-medium flex-1 text-center">补充信息</h2>
          <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* 任务名称 */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-700">任务名称</Label>
            <div className="text-gray-900 font-medium">{taskName}</div>
          </div>

          {/* 文本内容 */}
          <div className="space-y-2">
            <Label htmlFor="supplementContent" className="text-sm text-gray-700">补充内容 *</Label>
            <textarea
              id="supplementContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请输入补充内容..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* 附件上传 */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-700">附件上传</Label>
            <div className="grid grid-cols-3 gap-3">
              {/* 拍照 */}
              <button
                onClick={handleCameraCapture}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">拍照</span>
              </button>

              {/* 从相册选择 */}
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">相册</span>
              </label>

              {/* 文件 */}
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <FileText className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">文件</span>
              </label>
            </div>
          </div>

          {/* 已上传的附件列表 */}
          {attachments.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm text-gray-700">已上传附件</Label>
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">{file}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveAttachment(index)}
                      className="text-gray-400 hover:text-red-500 flex-shrink-0 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 py-4 border-t bg-white flex-shrink-0">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className={`flex-1 py-3 rounded-lg ${
              content.trim()
                ? 'text-white bg-blue-500 hover:bg-blue-600'
                : 'text-gray-400 bg-gray-200 cursor-not-allowed'
            }`}
          >
            提交
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============= 筛选条件侧边栏组件 =============
interface FilterSidebarProps {
  open: boolean;
  onClose: () => void;
  // 专家任务池筛选
  taskName: string;
  onTaskNameChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  startDate: string;
  onStartDateChange: (v: string) => void;
  endDate: string;
  onEndDateChange: (v: string) => void;
  // 我的任务单筛选（无任务名称）
  showTaskName?: boolean;
}

function FilterSidebar({
  open, onClose, taskName, onTaskNameChange, category, onCategoryChange,
  status, onStatusChange, startDate, onStartDateChange, endDate, onEndDateChange,
  showTaskName = true
}: FilterSidebarProps) {
  const handleReset = () => {
    onTaskNameChange('');
    onCategoryChange('');
    onStatusChange('');
    onStartDateChange('');
    onEndDateChange('');
  };

  const handleConfirm = () => {
    onClose();
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />}
      <div className={`fixed right-0 top-0 bottom-0 w-80 bg-white z-50 flex flex-col shadow-xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="px-4 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">筛选条件</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {showTaskName && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">任务名称</label>
              <input type="text" value={taskName} onChange={(e) => onTaskNameChange(e.target.value)}
                placeholder="请输入任务名称" className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">任务类型</label>
            <select value={category} onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="">请选择</option>
              <option value="营销">营销</option>
              <option value="产数">产数</option>
              <option value="云网">云网</option>
              <option value="综合">综合</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">状态</label>
            <select value={status} onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="">请选择</option>
              <option value="待审核">待审核</option>
              <option value="待接单">待接单</option>
              <option value="已接单">已接单</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">发布时间</label>
            <div className="space-y-2">
              <input type="date" value={startDate} onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
              <div className="text-center text-xs text-gray-500">至</div>
              <input type="date" value={endDate} onChange={(e) => onEndDateChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <button onClick={handleReset} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">重置</button>
            <button onClick={handleConfirm} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">确定</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ============= 专家任务池列表组件 =============
interface ExpertTaskListProps {
  tasks: Task[];
  onOpenDetail: (task: Task) => void;
  onAction: (taskId: string, action: string) => void;
  filters: {
    taskName?: string;
    category: string;
    status: string;
    region: string;
    expert: string;
    dispatchTime: string;
  };
  secondTab: FirstTabType;
}

function ExpertTaskList({ tasks, onOpenDetail, onAction, filters, secondTab }: ExpertTaskListProps) {
  const [applyConfirmOpen, setApplyConfirmOpen] = useState(false);
  const [applyConfirmTask, setApplyConfirmTask] = useState<Task | null>(null);

  const handleApplyClick = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setApplyConfirmTask(task);
    setApplyConfirmOpen(true);
  };

  const handleApplyConfirm = () => {
    if (applyConfirmTask) {
      onAction(applyConfirmTask.id, 'apply');
    }
    setApplyConfirmOpen(false);
    setApplyConfirmTask(null);
  };
  // 过滤任务（根据筛选条件）
  const filteredTasks = tasks.filter((task) => {
    const matchesTab = secondTab === '全部' || task.status === secondTab;
    const matchesName = !filters.taskName || task.name.includes(filters.taskName);
    const matchesCategory = !filters.category || task.category === filters.category;
    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesRegion = !filters.region || task.region === filters.region;
    const matchesExpert = !filters.expert || (task.members?.some(m => m.name.includes(filters.expert)) ?? false);
    const dispatchTimeMatch = !filters.dispatchTime || (() => {
      if (!filters.dispatchTime) return true;
      const times = filters.dispatchTime.split('至');
      if (times.length === 2) {
        return task.publishTime >= times[0] && task.publishTime <= times[1];
      }
      return true;
    })();
    return matchesTab && matchesName && matchesCategory && matchesStatus && matchesRegion && matchesExpert && dispatchTimeMatch;
  });

  return (
    <>
      {/* 任务列表 */}
      <div className="p-4 space-y-3 pb-24">
        {filteredTasks.length === 0 ? (
          <div className="text-center text-gray-400 py-12">暂无任务</div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} onClick={() => onOpenDetail(task)}
              className="bg-white rounded-xl p-4 shadow-sm space-y-3 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{task.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${statusConfig[task.status]?.color}`}>{task.status}</span>
              </div>
              <div className="text-sm text-gray-500 space-y-0.5">
                <div><span>发布人：{task.publisher}</span><span className="ml-2">{task.publishTime}</span></div>
                {task.auditor && <div><span>审核人：{task.auditor}</span>{task.auditTime && <span className="ml-2">审核时间：{task.auditTime}</span>}</div>}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">{task.category}</span>
                {task.taskType && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">{task.taskType}</span>}
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">{task.region}</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">需求{task.requiredCount}人</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{task.estimatedHours}人/天</span>
              </div>
              {task.taskType === '走访支撑' && (
                <div className="text-xs text-gray-600 space-y-0.5">
                  {task.customerName && <div>客户：{task.customerName}</div>}
                  {task.customerAddress && <div>地址：{task.customerAddress}</div>}
                  {task.opportunityCode && <div>编码：{task.opportunityCode}</div>}
                </div>
              )}
              <div className="text-xs text-gray-400">{task.startTime} 至 {task.endTime}</div>
              {task.members?.length > 0 && <div className="text-sm text-gray-600 pt-1">已报名：{task.members.length}人</div>}
              {secondTab === '待接单' && (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={(e) => handleApplyClick(task, e)}
                    className="flex-1 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    申请接单
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 申请接单确认弹窗 */}
      <ApplyConfirmDialog
        open={applyConfirmOpen}
        onOpenChange={setApplyConfirmOpen}
        taskName={applyConfirmTask?.name || ''}
        onConfirm={handleApplyConfirm}
      />
    </>
  );
}

// ============= 我的任务单列表组件 =============
interface MyTaskListProps {
  tasks: DispatchItem[];
  myPublishedTasks: Task[];
  onOpenDetail: (task: Task) => void;
  onOpenSupplement: (task: { id: string; name: string }) => void;
  onAction: (taskId: string, action: string) => void;
  filters: {
    taskName?: string;
    category: string;
    status: string;
    expert: string;
    dispatchTime: string;
  };
  secondTab: '我发起的任务' | '我接收的任务' | '我审核的任务';
}

function MyTaskList({ tasks, myPublishedTasks, onOpenDetail, onOpenSupplement, onAction, filters, secondTab }: MyTaskListProps) {
  // 接单/拒绝确认弹窗状态
  const [acceptConfirmOpen, setAcceptConfirmOpen] = useState(false);
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
  const [confirmTask, setConfirmTask] = useState<DispatchItem | null>(null);
  // 人员清单展开状态 - 默认展开任务2（待接单状态有示例数据）
  const [memberExpandMap, setMemberExpandMap] = useState<Record<string, boolean>>({ '2': true });
  // 撤单确认弹窗状态
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [cancelConfirmTask, setCancelConfirmTask] = useState<Task | null>(null);

  const toggleMemberExpand = (taskId: string) => {
    setMemberExpandMap(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleAcceptClick = (task: DispatchItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmTask(task);
    setAcceptConfirmOpen(true);
  };

  const handleRejectClick = (task: DispatchItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmTask(task);
    setRejectConfirmOpen(true);
  };

  const handleAcceptConfirm = () => {
    if (confirmTask) {
      onAction(confirmTask.id, 'acceptReceived');
    }
    setAcceptConfirmOpen(false);
    setConfirmTask(null);
  };

  const handleRejectConfirm = () => {
    if (confirmTask) {
      onAction(confirmTask.id, 'rejectReceived');
    }
    setRejectConfirmOpen(false);
    setConfirmTask(null);
  };

  const handleCancelConfirm = () => {
    if (cancelConfirmTask) {
      onAction(cancelConfirmTask.id, 'cancel');
    }
    setCancelConfirmOpen(false);
    setCancelConfirmTask(null);
  };

  // 我发起的任务过滤
  const myPublishedFiltered = myPublishedTasks.filter((task) => {
    const matchesCategory = !filters.category || task.category === filters.category;
    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesExpert = !filters.expert || (task.members?.some(m => m.name.includes(filters.expert)) ?? false);
    const dispatchTimeMatch = !filters.dispatchTime || (() => {
      if (!filters.dispatchTime) return true;
      const times = filters.dispatchTime.split('至');
      if (times.length === 2) {
        return task.publishTime >= times[0] && task.publishTime <= times[1];
      }
      return true;
    })();
    return matchesCategory && matchesStatus && matchesExpert && dispatchTimeMatch;
  });

  // 我接收的任务过滤
  const myReceivedFiltered = tasks.filter((task) => {
    const matchesStatus = !filters.status ||
      (filters.status === '待接单' && task.status === '待接单') ||
      (filters.status === '已接单' && task.status === '已接单');
    const matchesExpert = !filters.expert || task.expertName.includes(filters.expert);
    const dispatchTimeMatch = !filters.dispatchTime || (() => {
      if (!filters.dispatchTime) return true;
      const times = filters.dispatchTime.split('至');
      if (times.length === 2) {
        return task.dispatchTime >= times[0] && task.dispatchTime <= times[1];
      }
      return true;
    })();
    return matchesStatus && matchesExpert && dispatchTimeMatch;
  });

  // 我审核的任务（待审核状态的任务）
  const myAuditFiltered = myPublishedTasks.filter((task) => task.status === '待审核');

  const currentTasks = secondTab === '我发起的任务' ? myPublishedFiltered
    : secondTab === '我接收的任务' ? myReceivedFiltered
    : myAuditFiltered;

  return (
    <>
      {/* 任务列表 */}
      <div className="p-4 space-y-3 pb-20">
        {currentTasks.length === 0 ? (
          <div className="text-center text-gray-400 py-12">暂无任务</div>
        ) : (
          <>
            {secondTab === '我发起的任务' && (
              // 我发起的任务
              (currentTasks as Task[]).map((task) => (
                <div key={task.id} onClick={() => onOpenDetail(task)}
                  className="bg-white rounded-xl p-4 shadow-sm space-y-3 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{task.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${statusConfig[task.status]?.color}`}>{task.status}</span>
                  </div>
                  <div className="text-sm text-gray-500 space-y-0.5">
                    <div><span>发布人：{task.publisher}</span><span className="ml-2">{task.publishTime}</span></div>
                    {task.auditor && <div><span>审核人：{task.auditor}</span>{task.auditTime && <span className="ml-2">审核时间：{task.auditTime}</span>}</div>}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">{task.category}</span>
                    {task.taskType && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">{task.taskType}</span>}
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">{task.region}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">需求{task.requiredCount}人</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{task.estimatedHours}人/天</span>
                  </div>
                  {task.taskType === '走访支撑' && (
                    <div className="text-xs text-gray-600 space-y-0.5">
                      {task.customerName && <div>客户：{task.customerName}</div>}
                      {task.customerAddress && <div>地址：{task.customerAddress}</div>}
                      {task.opportunityCode && <div>编码：{task.opportunityCode}</div>}
                    </div>
                  )}
                  <div className="text-xs text-gray-400">{task.startTime} 至 {task.endTime}</div>
                  {task.members?.length > 0 && task.status !== '待审核' && (
                    <div className="pt-2">
                      <div
                        className="text-sm text-gray-600 flex items-center gap-1 cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); toggleMemberExpand(task.id); }}
                      >
                        <span>已报名：{task.members.length}人</span>
                        <svg
                          className={`w-4 h-4 transition-transform ${memberExpandMap[task.id] ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {memberExpandMap[task.id] && (
                        <div className="space-y-2 mt-2">
                          {(task.members || []).map((member) => (
                            <div key={member.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-800 flex items-center gap-1">
                                  <span className="truncate">{member.name}</span>
                                  <span className={`px-1.5 py-0.5 text-xs rounded ${member.source === '邀请派单' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                    {member.source === '邀请派单' ? '邀请' : '申请'}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">{member.department}</div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {member.source === '申请接单' && member.status === '申请接单' && (
                                  <>
                                    <button onClick={(e) => { e.stopPropagation(); onAction(task.id, 'agreeApply', member.id); }} className="px-2 py-1 text-xs text-green-600 border border-green-600 rounded hover:bg-green-50">同意申请</button>
                                    <button onClick={(e) => { e.stopPropagation(); onAction(task.id, 'rejectApply', member.id); }} className="px-2 py-1 text-xs text-red-500 border border-red-500 rounded hover:bg-red-50">拒绝申请</button>
                                  </>
                                )}
                                {member.source === '邀请派单' && member.status === '待派单' && (
                                  <>
                                    <button onClick={(e) => { e.stopPropagation(); onAction(task.id, 'dispatch', member.id); }} className="px-2 py-1 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-50">派单</button>
                                    <button onClick={(e) => { e.stopPropagation(); onAction(task.id, 'remove', member.id); }} className="px-2 py-1 text-xs text-red-500 border border-red-500 rounded hover:bg-red-50">移除</button>
                                  </>
                                )}
                                {member.status === '已接单' && (
                                  <button onClick={(e) => { e.stopPropagation(); onAction(task.id, 'participate', member.id); }} className="px-2 py-1 text-xs text-purple-600 border border-purple-600 rounded hover:bg-purple-50">是否参与</button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {task.status === '待审核' && (
                    <div className="flex gap-2 pt-2">
                      <button onClick={(e) => { e.stopPropagation(); setCancelConfirmTask(task); setCancelConfirmOpen(true); }} className="flex-1 py-2 text-sm bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50">撤单</button>
                    </div>
                  )}
                  {task.status === '待接单' && (
                    <div className="flex gap-2 pt-2">
                      <button onClick={(e) => { e.stopPropagation(); setCancelConfirmTask(task); setCancelConfirmOpen(true); }} className="flex-1 py-2 text-sm bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50">撤单</button>
                      <button onClick={(e) => { e.stopPropagation(); onAction(task.id, 'invite'); }} className="flex-1 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">派单</button>
                    </div>
                  )}
                </div>
              ))
            )}
            {secondTab === '我接收的任务' && (
              // 我接收的任务
              (currentTasks as DispatchItem[]).map((task) => (
                <div key={task.id} onClick={() => onOpenDetail(task as unknown as Task)}
                  className="bg-white rounded-xl p-4 shadow-sm space-y-3 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 truncate">{task.taskName}</h3>
                        <span className={`px-1.5 py-0.5 text-xs rounded flex-shrink-0 ${task.source === 'dispatch' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                          {task.source === 'dispatch' ? '邀请单' : '申请单'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description || `专家：${task.expertName}`}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${statusConfig[task.status]?.color}`}>{task.status}</span>
                  </div>
                  <div className="text-sm text-gray-500 space-y-0.5">
                    <div><span>发布人：{task.publisher}</span><span className="ml-2">{task.dispatchTime}</span></div>
                    {task.auditor && <div><span>审核人：{task.auditor}</span>{task.auditTime && <span className="ml-2">审核时间：{task.auditTime}</span>}</div>}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {task.category && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">{task.category}</span>}
                    {task.taskType && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">{task.taskType}</span>}
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">{task.area}</span>
                    {task.requiredCount && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">需求{task.requiredCount}人</span>}
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{task.estimatedHours}人/天</span>
                  </div>
                  {task.taskType === '走访支撑' && (
                    <div className="text-xs text-gray-600 space-y-0.5">
                      {task.customerName && <div>客户：{task.customerName}</div>}
                      {task.customerAddress && <div>地址：{task.customerAddress}</div>}
                      {task.customerCode && <div>编码：{task.customerCode}</div>}
                    </div>
                  )}
                  {task.startTime && task.endTime && <div className="text-xs text-gray-400">{task.startTime} 至 {task.endTime}</div>}
                  {task.status === '待接单' && task.source === 'dispatch' && (
                    <div className="flex gap-2 pt-2">
                      <button onClick={(e) => handleAcceptClick(task, e)} className="flex-1 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">接单</button>
                      <button onClick={(e) => handleRejectClick(task, e)} className="flex-1 py-2 text-sm bg-white text-red-500 rounded-lg border border-red-500 hover:bg-red-50">拒绝</button>
                    </div>
                  )}
                  {task.status === '待接单' && task.source === 'apply' && (
                    <div className="pt-2">
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">申请待同意</span>
                    </div>
                  )}
                  {task.status === '已接单' && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onOpenSupplement({ id: task.id, name: task.taskName }); }}
                        className="flex-1 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        补充信息
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
            {secondTab === '我审核的任务' && (
              // 我审核的任务
              (currentTasks as Task[]).map((task) => (
                <div key={task.id} onClick={() => onOpenDetail(task)}
                  className="bg-white rounded-xl p-4 shadow-sm space-y-3 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{task.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${statusConfig[task.status]?.color}`}>{task.status}</span>
                  </div>
                  <div className="text-sm text-gray-500 space-y-0.5">
                    <div><span>发布人：{task.publisher}</span><span className="ml-2">{task.publishTime}</span></div>
                    {task.auditor && <div><span>审核人：{task.auditor}</span>{task.auditTime && <span className="ml-2">审核时间：{task.auditTime}</span>}</div>}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">{task.category}</span>
                    {task.taskType && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">{task.taskType}</span>}
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">{task.region}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">需求{task.requiredCount}人</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{task.estimatedHours}人/天</span>
                  </div>
                  {task.taskType === '走访支撑' && (
                    <div className="text-xs text-gray-600 space-y-0.5">
                      {task.customerName && <div>客户：{task.customerName}</div>}
                      {task.customerAddress && <div>地址：{task.customerAddress}</div>}
                      {task.opportunityCode && <div>编码：{task.opportunityCode}</div>}
                    </div>
                  )}
                  <div className="text-xs text-gray-400">{task.startTime} 至 {task.endTime}</div>
                  {task.members?.length > 0 && <div className="text-sm text-gray-600 pt-1">已报名：{task.members.length}人</div>}
                  {task.status === '待审核' && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onAction(task.id, 'approve'); }}
                        className="flex-1 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        审核通过
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onAction(task.id, 'reject'); }}
                        className="flex-1 py-2 text-sm bg-white text-red-500 rounded-lg border border-red-500 hover:bg-red-50"
                      >
                        审核拒绝
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* 接单确认弹窗 */}
      <Dialog open={acceptConfirmOpen} onOpenChange={setAcceptConfirmOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogTitle>确认接单</DialogTitle>
          <DialogDescription className="sr-only">确认接单</DialogDescription>
          <div className="py-4">
            <p className="text-gray-700 text-center">
              是否接单<span className="font-medium text-gray-900 mx-1">「{confirmTask?.taskName}」</span>？
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setAcceptConfirmOpen(false)} className="flex-1 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
            <button onClick={handleAcceptConfirm} className="flex-1 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">确认接单</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 拒绝确认弹窗 */}
      <Dialog open={rejectConfirmOpen} onOpenChange={setRejectConfirmOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogTitle>确认拒绝</DialogTitle>
          <DialogDescription className="sr-only">确认拒绝</DialogDescription>
          <div className="py-4">
            <p className="text-gray-700 text-center">
              是否拒绝接单<span className="font-medium text-gray-900 mx-1">「{confirmTask?.taskName}」</span>？
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setRejectConfirmOpen(false)} className="flex-1 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
            <button onClick={handleRejectConfirm} className="flex-1 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600">确认拒绝</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 撤单确认弹窗 */}
      {cancelConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCancelConfirmOpen(false)} />
          <div className="relative bg-white rounded-xl p-6 w-[90%] max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-center mb-4">确认撤单</h3>
            <p className="text-gray-700 text-center mb-6">
              确定要撤消任务<span className="font-medium text-gray-900 mx-1">「{cancelConfirmTask?.name}」</span>吗？
            </p>
            <div className="flex gap-3">
              <button onClick={() => setCancelConfirmOpen(false)} className="flex-1 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
              <button onClick={handleCancelConfirm} className="flex-1 py-2.5 text-white bg-red-500 rounded-lg hover:bg-red-600">确认撤单</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============= 主组件 =============
export function ExpertTaskPool() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [myTasks, setMyTasks] = useState<DispatchItem[]>(mockMyTasks);
  const [mainTab, setMainTab] = useState<MainTabType>('专家任务池');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [auditAction, setAuditAction] = useState<'approve' | 'reject' | null>(null);
  const [selectExpertDialogOpen, setSelectExpertDialogOpen] = useState(false);
  const [participateDialogOpen, setParticipateDialogOpen] = useState(false);
  const [participateMember, setParticipateMember] = useState<TaskMember | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  // 补充信息弹窗状态
  const [supplementDialogOpen, setSupplementDialogOpen] = useState(false);
  const [supplementTask, setSupplementTask] = useState<{ id: string; name: string } | null>(null);

  // 撤单确认弹窗状态
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [cancelConfirmTask, setCancelConfirmTask] = useState<Task | null>(null);

  // 专家任务池筛选条件
  type FilterType = 'category' | 'dispatchTime' | 'expert' | 'region' | 'status';
  const [taskPoolFilters, setTaskPoolFilters] = useState({
    category: '',
    dispatchTime: '',
    expert: '',
    region: '',
    status: '',
  });
  const [taskPoolActiveFilter, setTaskPoolActiveFilter] = useState<FilterType | null>(null);
  const [taskPoolTempFilters, setTaskPoolTempFilters] = useState(taskPoolFilters);

  // 我的任务单筛选条件
  const [myTaskFilters, setMyTaskFilters] = useState({
    category: '',
    dispatchTime: '',
    expert: '',
    status: '',
  });
  const [myTaskActiveFilter, setMyTaskActiveFilter] = useState<FilterType | null>(null);
  const [myTaskTempFilters, setMyTaskTempFilters] = useState(myTaskFilters);

  
  // 专家任务池二级 Tab 状态
  const [taskPoolSecondTab, setTaskPoolSecondTab] = useState<FirstTabType>('全部');

  // 我的任务单二级 Tab 状态
  const [myTaskSecondTab, setMyTaskSecondTab] = useState<'我发起的任务' | '我接收的任务' | '我审核的任务'>('我发起的任务');

  const handlePublishTask = (taskData: Omit<Task, 'id' | 'status' | 'publisher' | 'publishTime' | 'members'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      status: '待审核',
      publisher: '费佳',
      publishTime: new Date().toLocaleString('zh-CN'),
      members: [],
    };
    setTasks([newTask, ...tasks]);
  };

  const handleOpenDetail = (task: Task) => {
    setSelectedTask(task);
    setDetailDialogOpen(true);
  };

  const handleTaskAction = (taskId: string, action: string, memberId?: string) => {
    setCurrentTaskId(taskId);

    switch (action) {
      case 'approve':
      case 'reject':
        setAuditAction(action);
        setAuditDialogOpen(true);
        break;
      case 'cancel':
        setTasks(tasks.filter((t) => t.id !== taskId));
        setSelectedTask(null);
        setDetailDialogOpen(false);
        break;
      case 'apply':
        setTasks(tasks.map((t) =>
          t.id === taskId ? {
            ...t,
            members: [...t.members, {
              id: `m-${Date.now()}`, name: '费佳', phone: '15305606921',
              department: '镇海云中台分部', status: '申请接单' as MemberStatus,
              source: '申请接单' as MemberSource,
              applyTime: new Date().toLocaleString('zh-CN'),
            }]
          } : t
        ));
        break;
      case 'invite':
        setSelectExpertDialogOpen(true);
        break;
      case 'dispatch':
        if (memberId) {
          setTasks(tasks.map((t) => t.id === taskId ? {
            ...t, members: (t.members || []).map((m) => m.id === memberId ? { ...m, status: '待接单' as MemberStatus } : m)
          } : t));
        }
        break;
      case 'remove':
        if (memberId) {
          setTasks(tasks.map((t) => t.id === taskId ? { ...t, members: (t.members || []).filter((m) => m.id !== memberId) } : t));
        }
        break;
      case 'accept':
        if (memberId) {
          setTasks(tasks.map((t) => t.id === taskId ? {
            ...t, members: (t.members || []).map((m) => m.id === memberId ? { ...m, status: '已接单' as MemberStatus, acceptTime: new Date().toLocaleString('zh-CN') } : m)
          } : t));
        }
        break;
      case 'refuse':
        if (memberId) {
          setTasks(tasks.map((t) => t.id === taskId ? { ...t, members: (t.members || []).filter((m) => m.id !== memberId) } : t));
        }
        break;
      case 'agreeApply':
        if (memberId) {
          setTasks(tasks.map((t) => t.id === taskId ? {
            ...t, members: (t.members || []).map((m) => m.id === memberId ? { ...m, status: '已接单' as MemberStatus, source: '申请接单' as MemberSource, acceptTime: new Date().toLocaleString('zh-CN') } : m)
          } : t));
        }
        break;
      case 'rejectApply':
        if (memberId) {
          setTasks(tasks.map((t) => t.id === taskId ? { ...t, members: (t.members || []).filter((m) => m.id !== memberId) } : t));
        }
        break;
      case 'participate':
        if (memberId) {
          const task = tasks.find((t) => t.id === taskId);
          const member = task?.members.find((m) => m.id === memberId);
          if (member) { setParticipateMember(member); setParticipateDialogOpen(true); }
        }
        break;
      case 'acceptReceived':
        setMyTasks(myTasks.map((t) => t.id === taskId ? { ...t, status: '已接单' as DispatchItem['status'] } : t));
        break;
      case 'rejectReceived':
        setMyTasks(myTasks.map((t) => t.id === taskId ? { ...t, status: '已拒绝' as DispatchItem['status'] } : t));
        break;
    }

    if (selectedTask) {
      const updated = tasks.find((t) => t.id === taskId);
      if (updated) setSelectedTask(updated);
    }
  };

  const handleAuditSubmit = (reason: string) => {
    if (!currentTaskId) return;
    if (auditAction === 'approve') {
      setTasks(tasks.map((t) => t.id === currentTaskId ? { ...t, status: '待接单' as TaskStatus } : t));
    } else if (auditAction === 'reject') {
      setTasks(tasks.filter((t) => t.id !== currentTaskId));
    }
    setDetailDialogOpen(false);
  };

  const handleCancelConfirm = () => {
    if (!cancelConfirmTask) return;
    setTasks(tasks.filter((t) => t.id !== cancelConfirmTask.id));
    setDetailDialogOpen(false);
    setCancelConfirmOpen(false);
    setCancelConfirmTask(null);
  };

  const handleSelectExperts = (experts: ExpertMember[]) => {
    if (!currentTaskId) return;
    const newMembers: TaskMember[] = experts.map((e) => ({
      id: `m-${Date.now()}-${e.id}`, name: e.name, phone: e.phone, department: e.branch,
      status: '待派单' as MemberStatus, source: '邀请派单' as MemberSource,
      dispatchTime: new Date().toLocaleString('zh-CN'),
    }));
    setTasks(tasks.map((t) => t.id === currentTaskId ? { ...t, members: [...(t.members || []), ...newMembers] } : t));
    const updated = tasks.find((t) => t.id === currentTaskId);
    if (updated) setSelectedTask({ ...updated, members: [...(updated.members || []), ...newMembers] });
  };

  const handleParticipateConfirm = (isParticipated: boolean, startTime: string, endTime: string) => {
    if (!currentTaskId || !participateMember) return;
    const updatedMembers = (t: Task) => ({
      ...t, members: (t.members || []).map((m) => m.id === participateMember.id ? { ...m, actualStartTime: isParticipated ? startTime : undefined, actualEndTime: isParticipated ? endTime : undefined } : m)
    });
    setTasks(tasks.map((t) => t.id === currentTaskId ? updatedMembers(t) : t));
    setMyTasks(myTasks.map((t) => t.id === currentTaskId && t.members ? { ...t, members: t.members.map((m) => m.id === participateMember.id ? { ...m, actualStartTime: isParticipated ? startTime : undefined, actualEndTime: isParticipated ? endTime : undefined } : m) } : t));
  };

  const handleSupplementSubmit = (data: { content: string; attachments: string[] }) => {
    console.log('补充信息:', data);
    // 实际项目中这里应该调用 API 保存数据
    alert(`补充信息已提交：\n内容：${data.content}\n附件：${data.attachments.length}个`);
    setSupplementDialogOpen(false);
  };

  const handleOpenSupplement = (task: { id: string; name: string }) => {
    setSupplementTask(task);
    setSupplementDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        {/* 标题栏 */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-medium text-gray-900">专家任务</h1>
          </div>
          <button
            onClick={() => setPublishDialogOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            发布任务
          </button>
        </div>

        {/* 一级 Tab */}
        <div className="flex border-b">
          <button
            onClick={() => setMainTab('专家任务池')}
            className={`relative flex-1 py-3 text-sm font-medium transition-colors ${
              mainTab === '专家任务池' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <span className="relative z-10">专家任务池</span>
            {mainTab === '专家任务池' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-blue-500 rounded-full" />}
          </button>
          <button
            onClick={() => setMainTab('我的任务单')}
            className={`relative flex-1 py-3 text-sm font-medium transition-colors ${
              mainTab === '我的任务单' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <span className="relative z-10">我的任务单</span>
            {mainTab === '我的任务单' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-blue-500 rounded-full" />}
          </button>
        </div>

        {/* 二级 Tab - 专家任务池 */}
        {mainTab === '专家任务池' && (
          <div className="flex gap-3 px-4 py-2">
            {(['全部', '待审核', '待接单', '已接单'] as FirstTabType[]).map((tab) => {
              const counts = {
                '全部': tasks.length,
                '待审核': tasks.filter((t) => t.status === '待审核').length,
                '待接单': tasks.filter((t) => t.status === '待接单').length,
                '已接单': tasks.filter((t) => t.status === '已接单').length,
              };
              return (
                <button
                  key={tab}
                  onClick={() => setTaskPoolSecondTab(tab)}
                  className={`flex-1 px-2 py-1.5 rounded-full text-xs transition-colors text-center whitespace-nowrap ${
                    taskPoolSecondTab === tab
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tab} ({counts[tab]})
                </button>
              );
            })}
          </div>
        )}

        {/* 二级 Tab - 我的任务单 */}
        {mainTab === '我的任务单' && (
          <div className="flex gap-3 px-4 py-2">
            {(['我发起的任务', '我接收的任务', '我审核的任务'] as const).map((tab) => {
              const count = tab === '我发起的任务' ? tasks.length : tab === '我接收的任务' ? myTasks.length : tasks.filter((t) => t.status === '待审核').length;
              const label = tab === '我发起的任务' ? '我发起的' : tab === '我接收的任务' ? '我接收的' : '我审核的';
              return (
                <button
                  key={tab}
                  onClick={() => setMyTaskSecondTab(tab)}
                  className={`flex-1 px-3 py-1.5 rounded-full text-xs transition-colors text-center ${
                    myTaskSecondTab === tab
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* 搜索框 */}
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索任务名称"
              value={mainTab === '专家任务池' ? taskPoolFilters.taskName || '' : myTaskFilters.taskName || ''}
              onChange={(e) => mainTab === '专家任务池'
                ? setTaskPoolFilters({ ...taskPoolFilters, taskName: e.target.value })
                : setMyTaskFilters({ ...myTaskFilters, taskName: e.target.value })
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
            />
          </div>
        </div>

        {/* 查询条件 - 专家任务池 */}
        {mainTab === '专家任务池' && (
          <div className="px-4 py-2 flex gap-2">
            <button
              onClick={() => { setTaskPoolActiveFilter('category'); setTaskPoolTempFilters(taskPoolFilters); }}
              className={`flex-1 flex items-center justify-center gap-1 text-sm ${
                taskPoolFilters.category ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {taskPoolFilters.category || '类型'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <button
              onClick={() => { setTaskPoolActiveFilter('dispatchTime'); setTaskPoolTempFilters(taskPoolFilters); }}
              className={`flex-1 flex items-center justify-center gap-1 text-sm ${
                taskPoolFilters.dispatchTime ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {taskPoolFilters.dispatchTime || '时间'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <button
              onClick={() => { setTaskPoolActiveFilter('expert'); setTaskPoolTempFilters(taskPoolFilters); }}
              className={`flex-1 flex items-center justify-center gap-1 text-sm ${
                taskPoolFilters.expert ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {taskPoolFilters.expert || '专家'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <button
              onClick={() => { setTaskPoolActiveFilter('region'); setTaskPoolTempFilters(taskPoolFilters); }}
              className={`flex-1 flex items-center justify-center gap-1 text-sm ${
                taskPoolFilters.region ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {taskPoolFilters.region || '区域'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {taskPoolSecondTab === '全部' && (
              <button
                onClick={() => { setTaskPoolActiveFilter('status'); setTaskPoolTempFilters(taskPoolFilters); }}
                className={`flex-1 flex items-center justify-center gap-1 text-sm ${
                  taskPoolFilters.status ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {taskPoolFilters.status || '状态'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            )}
          </div>
        )}

        {/* 查询条件 - 我的任务单 */}
        {mainTab === '我的任务单' && (
          <div className="px-4 py-2 flex gap-2">
            <button
              onClick={() => { setMyTaskActiveFilter('category'); setMyTaskTempFilters(myTaskFilters); }}
              className={`flex-1 flex items-center justify-center gap-1 text-sm ${
                myTaskFilters.category ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {myTaskFilters.category || '类型'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <button
              onClick={() => { setMyTaskActiveFilter('dispatchTime'); setMyTaskTempFilters(myTaskFilters); }}
              className={`flex-1 flex items-center justify-center gap-1 text-sm ${
                myTaskFilters.dispatchTime ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {myTaskFilters.dispatchTime || '时间'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <button
              onClick={() => { setMyTaskActiveFilter('expert'); setMyTaskTempFilters(myTaskFilters); }}
              className={`flex-1 flex items-center justify-center gap-1 text-sm ${
                myTaskFilters.expert ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {myTaskFilters.expert || '专家'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <button
              onClick={() => { setMyTaskActiveFilter('status'); setMyTaskTempFilters(myTaskFilters); }}
              className={`flex-1 flex items-center justify-center gap-1 text-sm ${
                myTaskFilters.status ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {myTaskFilters.status || '状态'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        )}
      </div>

      {mainTab === '专家任务池' ? (
        <ExpertTaskList tasks={tasks} onOpenDetail={handleOpenDetail} onAction={handleTaskAction} filters={taskPoolFilters} secondTab={taskPoolSecondTab} />
      ) : (
        <MyTaskList
          tasks={myTasks}
          myPublishedTasks={tasks}
          onOpenDetail={handleOpenDetail}
          onOpenSupplement={handleOpenSupplement}
          onAction={handleTaskAction}
          filters={myTaskFilters}
          secondTab={myTaskSecondTab}
        />
      )}

      
      {/* Dialogs */}
      <PublishTaskDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen} onSubmit={handlePublishTask} />
      <TaskDetailDialog
        task={selectedTask}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onAction={handleTaskAction}
        secondTab={mainTab === '我的任务单' ? myTaskSecondTab : undefined}
      />
      <AuditDialog open={auditDialogOpen} onOpenChange={setAuditDialogOpen} action={auditAction} onSubmit={handleAuditSubmit} />
      <SelectExpertDialog open={selectExpertDialogOpen} onOpenChange={setSelectExpertDialogOpen} onSelect={handleSelectExperts}
        selectedIds={(selectedTask?.members || []).map((m) => m.id)} />
      <ParticipateDialog open={participateDialogOpen} onOpenChange={setParticipateDialogOpen} member={participateMember}
        onConfirm={handleParticipateConfirm} />
      <CancelConfirmDialog
        open={cancelConfirmOpen}
        onOpenChange={setCancelConfirmOpen}
        taskName={cancelConfirmTask?.name ?? ''}
        onConfirm={handleCancelConfirm}
      />
      <SupplementDialog
        open={supplementDialogOpen}
        onOpenChange={setSupplementDialogOpen}
        taskName={supplementTask?.name || ''}
        onSubmit={handleSupplementSubmit}
      />

      {/* 筛选弹窗 */}
      <Dialog
        open={taskPoolActiveFilter !== null || myTaskActiveFilter !== null}
        onOpenChange={(open) => {
          if (!open) {
            setTaskPoolActiveFilter(null);
            setMyTaskActiveFilter(null);
          }
        }}
      >
        <DialogContent
          className="max-w-full w-full p-0 gap-0 bg-white rounded-t-2xl fixed bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0 h-auto max-h-[70vh] flex flex-col border-0"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
            <h2 className="text-lg font-medium flex-1 text-center">
              {taskPoolActiveFilter === 'category' && '选择任务类型'}
              {taskPoolActiveFilter === 'dispatchTime' && '选择派单时间'}
              {taskPoolActiveFilter === 'expert' && '选择专家'}
              {taskPoolActiveFilter === 'region' && '选择区域'}
              {taskPoolActiveFilter === 'status' && '选择状态'}
              {myTaskActiveFilter === 'category' && '选择任务类型'}
              {myTaskActiveFilter === 'dispatchTime' && '选择派单时间'}
              {myTaskActiveFilter === 'expert' && '选择专家'}
              {myTaskActiveFilter === 'status' && '选择状态'}
            </h2>
            <button
              onClick={() => { setTaskPoolActiveFilter(null); setMyTaskActiveFilter(null); }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* 专家任务池筛选内容 */}
            {mainTab === '专家任务池' && taskPoolActiveFilter === 'category' && (
              <div className="space-y-2">
                {['', '营销', '产数', '云网', '综合'].map((cat) => (
                  <button
                    key={cat || '全部'}
                    onClick={() => { setTaskPoolFilters({ ...taskPoolFilters, category: cat }); setTaskPoolActiveFilter(null); }}
                    className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${
                      taskPoolFilters.category === cat
                        ? 'bg-blue-50 text-blue-700 border border-blue-500'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cat || '全部'}
                  </button>
                ))}
              </div>
            )}

            {mainTab === '专家任务池' && taskPoolActiveFilter === 'dispatchTime' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={taskPoolTempFilters.startDate || ''}
                    onChange={(e) => setTaskPoolTempFilters({ ...taskPoolTempFilters, startDate: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <span className="self-center text-gray-500">至</span>
                  <input
                    type="date"
                    value={taskPoolTempFilters.endDate || ''}
                    onChange={(e) => setTaskPoolTempFilters({ ...taskPoolTempFilters, endDate: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={() => {
                    setTaskPoolFilters({ ...taskPoolFilters, dispatchTime: taskPoolTempFilters.startDate && taskPoolTempFilters.endDate ? `${taskPoolTempFilters.startDate}至${taskPoolTempFilters.endDate}` : '' });
                    setTaskPoolActiveFilter(null);
                  }}
                  className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  确定
                </button>
              </div>
            )}

            {mainTab === '专家任务池' && taskPoolActiveFilter === 'expert' && (
              <div className="space-y-2">
                {mockExperts.map((expert) => (
                  <button
                    key={expert.id}
                    onClick={() => { setTaskPoolFilters({ ...taskPoolFilters, expert: expert.name }); setTaskPoolActiveFilter(null); }}
                    className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${
                      taskPoolFilters.expert === expert.name
                        ? 'bg-blue-50 text-blue-700 border border-blue-500'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {expert.name}
                  </button>
                ))}
              </div>
            )}

            {mainTab === '专家任务池' && taskPoolActiveFilter === 'region' && (
              <div className="space-y-2">
                {['', '宁波市', '北仑区', '镇海区', '鄞州区', '海曙区'].map((region) => (
                  <button
                    key={region || '全部'}
                    onClick={() => { setTaskPoolFilters({ ...taskPoolFilters, region }); setTaskPoolActiveFilter(null); }}
                    className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${
                      taskPoolFilters.region === region
                        ? 'bg-blue-50 text-blue-700 border border-blue-500'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {region || '全部'}
                  </button>
                ))}
              </div>
            )}

            {mainTab === '专家任务池' && taskPoolActiveFilter === 'status' && (
              <div className="space-y-2">
                {['', '待审核', '待接单', '已接单'].map((status) => (
                  <button
                    key={status || '全部'}
                    onClick={() => { setTaskPoolFilters({ ...taskPoolFilters, status }); setTaskPoolActiveFilter(null); }}
                    className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${
                      taskPoolFilters.status === status
                        ? 'bg-blue-50 text-blue-700 border border-blue-500'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {status || '全部'}
                  </button>
                ))}
              </div>
            )}

            {/* 我的任务单筛选内容 */}
            {mainTab === '我的任务单' && myTaskActiveFilter === 'category' && (
              <div className="space-y-2">
                {['', '营销', '产数', '云网', '综合'].map((cat) => (
                  <button
                    key={cat || '全部'}
                    onClick={() => { setMyTaskFilters({ ...myTaskFilters, category: cat }); setMyTaskActiveFilter(null); }}
                    className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${
                      myTaskFilters.category === cat
                        ? 'bg-blue-50 text-blue-700 border border-blue-500'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cat || '全部'}
                  </button>
                ))}
              </div>
            )}

            {mainTab === '我的任务单' && myTaskActiveFilter === 'dispatchTime' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={myTaskTempFilters.startDate || ''}
                    onChange={(e) => setMyTaskTempFilters({ ...myTaskTempFilters, startDate: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <span className="self-center text-gray-500">至</span>
                  <input
                    type="date"
                    value={myTaskTempFilters.endDate || ''}
                    onChange={(e) => setMyTaskTempFilters({ ...myTaskTempFilters, endDate: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={() => {
                    setMyTaskFilters({ ...myTaskFilters, dispatchTime: myTaskTempFilters.startDate && myTaskTempFilters.endDate ? `${myTaskTempFilters.startDate}至${myTaskTempFilters.endDate}` : '' });
                    setMyTaskActiveFilter(null);
                  }}
                  className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  确定
                </button>
              </div>
            )}

            {mainTab === '我的任务单' && myTaskActiveFilter === 'expert' && (
              <div className="space-y-2">
                {mockExperts.map((expert) => (
                  <button
                    key={expert.id}
                    onClick={() => { setMyTaskFilters({ ...myTaskFilters, expert: expert.name }); setMyTaskActiveFilter(null); }}
                    className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${
                      myTaskFilters.expert === expert.name
                        ? 'bg-blue-50 text-blue-700 border border-blue-500'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {expert.name}
                  </button>
                ))}
              </div>
            )}

            {mainTab === '我的任务单' && myTaskActiveFilter === 'status' && (
              <div className="space-y-2">
                {['', '待审核', '待接单', '已接单'].map((status) => (
                  <button
                    key={status || '全部'}
                    onClick={() => { setMyTaskFilters({ ...myTaskFilters, status }); setMyTaskActiveFilter(null); }}
                    className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${
                      myTaskFilters.status === status
                        ? 'bg-blue-50 text-blue-700 border border-blue-500'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {status || '全部'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
