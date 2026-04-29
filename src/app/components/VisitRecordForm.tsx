import { useState, useEffect } from 'react';
import { ChevronLeft, X, Camera, Upload } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router';

interface Participant {
  name: string;
  isLeader: boolean;
}

const visitTypeOptions = [
  { value: '0', label: '日常拜访' },
  { value: '1', label: '商机推进拜访' },
  { value: '2', label: '交流拜访' },
  { value: '3', label: '陌生拜访' },
  { value: '4', label: '签约' },
  { value: '5', label: '其他' },
  { value: '6', label: '战略合作' },
  { value: '7', label: '公开活动' },
];

export function VisitRecordForm() {
  const navigate = useNavigate();
  const { taskId, recordId } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = !!recordId && recordId !== 'new';

  const [formData, setFormData] = useState({
    customerName: '宁波爱地宝商业管理有限公司',
    customerCode: 'CUS20260326001',
    visitType: '1',
    visitTarget: '',
    visitDate: '',
    visitLocation: '',
    keyPoints: '',
  });

  const [theirParticipants, setTheirParticipants] = useState<Participant[]>([
    { name: '', isLeader: false },
  ]);

  const [ourParticipants, setOurParticipants] = useState<Participant[]>([
    { name: '', isLeader: false },
  ]);

  const [photos, setPhotos] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 从URL参数中加载走访记录数据
  useEffect(() => {
    const visitDate = searchParams.get('visitDate');
    const visitLocation = searchParams.get('visitLocation');
    const visitTarget = searchParams.get('visitTarget');
    const ourParticipantsParam = searchParams.get('ourParticipants');

    if (visitDate || visitLocation || visitTarget || ourParticipantsParam) {
      // 更新表单数据
      setFormData((prev) => ({
        ...prev,
        visitDate: visitDate || '',
        visitLocation: visitLocation || '',
        visitTarget: visitTarget || '',
      }));

      // 更新对方参加人员（如果有拜访对象，将其拆分为多个人员）
      if (visitTarget) {
        const targets = visitTarget.split('、').map((name) => ({
          name: name.trim(),
          isLeader: false,
        }));
        setTheirParticipants(targets.length > 0 ? targets : [{ name: '', isLeader: false }]);
      }

      // 更新我方参加人员
      if (ourParticipantsParam) {
        const participants = ourParticipantsParam.split(',').map((name) => ({
          name: name.trim(),
          isLeader: false,
        }));
        setOurParticipants(participants.length > 0 ? participants : [{ name: '', isLeader: false }]);
      }
    }
  }, [searchParams]);

  const handleAddParticipant = (type: 'their' | 'our') => {
    if (type === 'their') {
      setTheirParticipants([...theirParticipants, { name: '', isLeader: false }]);
    } else {
      setOurParticipants([...ourParticipants, { name: '', isLeader: false }]);
    }
  };

  const handleRemoveParticipant = (type: 'their' | 'our', index: number) => {
    if (type === 'their') {
      setTheirParticipants(theirParticipants.filter((_, i) => i !== index));
    } else {
      setOurParticipants(ourParticipants.filter((_, i) => i !== index));
    }
  };

  const handleParticipantChange = (
    type: 'their' | 'our',
    index: number,
    field: 'name' | 'isLeader',
    value: string | boolean
  ) => {
    if (type === 'their') {
      const updated = [...theirParticipants];
      if (field === 'name') {
        updated[index].name = value as string;
      } else {
        updated[index].isLeader = value as boolean;
      }
      setTheirParticipants(updated);
    } else {
      const updated = [...ourParticipants];
      if (field === 'name') {
        updated[index].name = value as string;
      } else {
        updated[index].isLeader = value as boolean;
      }
      setOurParticipants(updated);
    }
  };

  const handlePhotoUpload = () => {
    // TODO: Implement photo upload
    console.log('Upload photo');
  };

  const handleTakePhoto = () => {
    // TODO: Implement take photo
    console.log('Take photo');
  };

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.visitTarget) {
      newErrors.visitTarget = '拜访对象不能为空';
    }
    if (!formData.visitDate) {
      newErrors.visitDate = '拜访日期不能为空';
    }
    if (!formData.visitLocation) {
      newErrors.visitLocation = '拜访地点不能为空';
    }
    if (!formData.keyPoints) {
      newErrors.keyPoints = '会谈要点事项不能为空';
    }
    if (theirParticipants.some((p) => !p.name)) {
      newErrors.theirParticipants = '对方参加人员姓名不能为空';
    }
    if (ourParticipants.some((p) => !p.name)) {
      newErrors.ourParticipants = '我方参加人员姓名不能为空';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log('Submit form:', {
        formData,
        theirParticipants,
        ourParticipants,
        photos,
      });
      navigate(`/visit-records/${taskId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(`/visit-records/${taskId}`)}
            className="text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium text-gray-900 flex-1">
            {isEdit ? '编辑拜访记录' : '新增拜访记录'}
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        {/* Customer Info */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-600 mb-2">客户信息</div>
          <div className="space-y-2">
            <div className="text-gray-900">{formData.customerName}</div>
            <div className="text-xs text-gray-500">编码：{formData.customerCode}</div>
          </div>
        </div>

        {/* Visit Type */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm text-gray-600 mb-2">
            拜访类型 <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.visitType}
            onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {visitTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Visit Target */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm text-gray-600 mb-2">
            拜访对象 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="请输入拜访对象"
            value={formData.visitTarget}
            onChange={(e) => setFormData({ ...formData, visitTarget: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.visitTarget && <div className="text-red-500 text-xs">{errors.visitTarget}</div>}
        </div>

        {/* Their Participants */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-gray-600">
              对方参加人员 <span className="text-red-500">*</span>
            </label>
            <button
              onClick={() => handleAddParticipant('their')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + 添加
            </button>
          </div>
          <div className="space-y-3">
            {theirParticipants.map((participant, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="姓名"
                  value={participant.name}
                  onChange={(e) =>
                    handleParticipantChange('their', index, 'name', e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="flex items-center gap-1 text-sm text-gray-600 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={participant.isLeader}
                    onChange={(e) =>
                      handleParticipantChange('their', index, 'isLeader', e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  高层
                </label>
                {theirParticipants.length > 1 && (
                  <button
                    onClick={() => handleRemoveParticipant('their', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            {errors.theirParticipants && (
              <div className="text-red-500 text-xs">{errors.theirParticipants}</div>
            )}
          </div>
        </div>

        {/* Our Participants */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-gray-600">
              我方参加人员 <span className="text-red-500">*</span>
            </label>
            <button
              onClick={() => handleAddParticipant('our')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + 添加
            </button>
          </div>
          <div className="space-y-3">
            {ourParticipants.map((participant, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="姓名"
                  value={participant.name}
                  onChange={(e) =>
                    handleParticipantChange('our', index, 'name', e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="flex items-center gap-1 text-sm text-gray-600 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={participant.isLeader}
                    onChange={(e) =>
                      handleParticipantChange('our', index, 'isLeader', e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  领导
                </label>
                {ourParticipants.length > 1 && (
                  <button
                    onClick={() => handleRemoveParticipant('our', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            {errors.ourParticipants && (
              <div className="text-red-500 text-xs">{errors.ourParticipants}</div>
            )}
          </div>
        </div>

        {/* Visit Date */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm text-gray-600 mb-2">
            拜访日期 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.visitDate}
            onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.visitDate && <div className="text-red-500 text-xs">{errors.visitDate}</div>}
        </div>

        {/* Visit Location */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm text-gray-600 mb-2">
            拜访地点 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="请输入拜访地点"
            value={formData.visitLocation}
            onChange={(e) => setFormData({ ...formData, visitLocation: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.visitLocation && (
            <div className="text-red-500 text-xs">{errors.visitLocation}</div>
          )}
        </div>

        {/* Key Points */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm text-gray-600 mb-2">
            双方会谈要点事项 <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="请输入会谈要点事项"
            value={formData.keyPoints}
            onChange={(e) => setFormData({ ...formData, keyPoints: e.target.value })}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          {errors.keyPoints && <div className="text-red-500 text-xs">{errors.keyPoints}</div>}
        </div>

        {/* Photos */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm text-gray-600 mb-3">照片上传</label>
          <div className="grid grid-cols-3 gap-3">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded-lg">
                <img src={photo} alt="" className="w-full h-full object-cover rounded-lg" />
                <button
                  onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {photos.length < 9 && (
              <>
                <button
                  onClick={handleTakePhoto}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <Camera className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500">拍照</span>
                </button>

                <button
                  onClick={handlePhotoUpload}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500">上传</span>
                </button>
              </>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500">最多上传9张照片</div>
        </div>

        {/* Submit Button */}
        <div className="pb-4">
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}