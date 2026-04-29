import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { UploadDialog } from './UploadDialog';

type FormType =
  | '投标过程记录'
  | '应标结果'
  | '商务谈判'
  | '标前决策'
  | '业务解构'
  | '方案解构中台'
  | '变更记录'
  | '数字资产平台'
  | '第一服务界面'
  | '业务风险审核';

interface FormData {
  // 投标过程记录
  biddingType?: string;
  biddingTime?: string;
  biddingSubject?: string;
  bidWinResult?: string;
  bidWinTime?: string;
  bidWinAmount?: string;
  signObject?: string;
  negotiationRecord?: string;
  negotiationResult?: string;

  // 标前决策
  decisionName?: string;
  decisionTime?: string;
  decisionResult?: string;
  partnerName?: string;

  // 业务解构
  deconstructComplete?: string;
  deconstructResult?: string;
  procurementPlan?: string;

  // 方案解构与中台把关
  deconstructDoc?: string;
  reviewOpinion?: string;
  reviewResult?: string;

  // 变更记录
  changeContent?: string;
  changeReason?: string;

  // 数字资产平台
  assetArchive?: string;
  archiveTime?: string;

  // 第一服务界面
  serviceDeskType?: string;
  serviceDeskRecord?: string;

  // 业务风险审核
  auditResult?: string;
  compareResult?: string;
}

interface FormInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formType: FormType;
  nodeName: string;
  onSave: (data: FormData) => void;
  initialData?: FormData;
}

export function FormInputDialog({
  open,
  onOpenChange,
  formType,
  nodeName,
  onSave,
  initialData,
}: FormInputDialogProps) {
  const [formData, setFormData] = useState<FormData>(initialData || {});
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFiles, setUploadFiles] = useState<{ name: string; size: string; uploadTime: string; synced: boolean }[]>([]);

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
    setFormData({});
  };

  const renderForm = () => {
    switch (formType) {
      case '投标过程记录':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">是否应标 <span className="text-red-500">*</span></label>
              <select
                value={formData.biddingType || ''}
                onChange={(e) => handleChange('biddingType', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">请选择</option>
                <option value="是">是</option>
                <option value="否">否</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">投标时间 <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={formData.biddingTime || ''}
                onChange={(e) => handleChange('biddingTime', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">投标主体 <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="请输入投标主体"
                value={formData.biddingSubject || ''}
                onChange={(e) => handleChange('biddingSubject', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">投标相关文件</label>
              <Button variant="outline" size="sm" onClick={() => { setUploadTitle('投标相关文件'); setUploadOpen(true); }}>
                上传文件
              </Button>
              {uploadFiles.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">{uploadFiles.length} 个文件已上传</p>
              )}
            </div>
          </div>
        );

      case '应标结果':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">应标结果 <span className="text-red-500">*</span></label>
              <select
                value={formData.bidWinResult || ''}
                onChange={(e) => handleChange('bidWinResult', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">请选择</option>
                <option value="中标">中标</option>
                <option value="丢标">丢标</option>
                <option value="未开标">未开标</option>
                <option value="已签约">已签约</option>
                <option value="未签约">未签约</option>
                <option value="弃标">弃标</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">中标时间</label>
              <input
                type="date"
                value={formData.bidWinTime || ''}
                onChange={(e) => handleChange('bidWinTime', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">中标金额（万元）</label>
              <input
                type="number"
                placeholder="请输入"
                value={formData.bidWinAmount || ''}
                onChange={(e) => handleChange('bidWinAmount', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">签约对象</label>
              <input
                type="text"
                placeholder="请输入"
                value={formData.signObject || ''}
                onChange={(e) => handleChange('signObject', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
        );

      case '商务谈判':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">谈判记录 <span className="text-red-500">*</span></label>
              <textarea
                placeholder="请输入谈判记录内容"
                value={formData.negotiationRecord || ''}
                onChange={(e) => handleChange('negotiationRecord', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                rows={4}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">谈判结果 <span className="text-red-500">*</span></label>
              <select
                value={formData.negotiationResult || ''}
                onChange={(e) => handleChange('negotiationResult', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">请选择</option>
                <option value="达成合作">达成合作</option>
                <option value="继续洽谈">继续洽谈</option>
                <option value="未达成">未达成</option>
              </select>
            </div>
          </div>
        );

      case '标前决策':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">决策会名称</label>
              <input
                type="text"
                placeholder="请输入决策会名称"
                value={formData.decisionName || ''}
                onChange={(e) => handleChange('decisionName', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">决策时间</label>
              <input
                type="date"
                value={formData.decisionTime || ''}
                onChange={(e) => handleChange('decisionTime', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">决策结果</label>
              <select
                value={formData.decisionResult || ''}
                onChange={(e) => handleChange('decisionResult', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">请选择</option>
                <option value="通过">通过</option>
                <option value="不通过">不通过</option>
                <option value="暂缓">暂缓</option>
                <option value="需要补充材料">需要补充材料</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">预计合作伙伴</label>
              <input
                type="text"
                placeholder="请输入合作伙伴名称"
                value={formData.partnerName || ''}
                onChange={(e) => handleChange('partnerName', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
        );

      case '业务解构':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">业务解构完成 <span className="text-red-500">*</span></label>
              <select
                value={formData.deconstructComplete || ''}
                onChange={(e) => handleChange('deconstructComplete', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">请选择</option>
                <option value="是">是</option>
                <option value="否">否</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">解构结果说明</label>
              <textarea
                placeholder="请输入业务解构结果说明"
                value={formData.deconstructResult || ''}
                onChange={(e) => handleChange('deconstructResult', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">采购需求表或方案</label>
              <Button variant="outline" size="sm" onClick={() => { setUploadTitle('采购需求表或方案'); setUploadOpen(true); }}>
                上传文件
              </Button>
            </div>
          </div>
        );

      case '方案解构中台':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">方案解构完成 <span className="text-red-500">*</span></label>
              <select
                value={formData.deconstructComplete || ''}
                onChange={(e) => handleChange('deconstructComplete', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">请选择</option>
                <option value="是">是</option>
                <option value="否">否</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">方案解构文档</label>
              <Button variant="outline" size="sm" onClick={() => { setUploadTitle('方案解构文档'); setUploadOpen(true); }}>
                上传文件
              </Button>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">中台把关意见</label>
              <textarea
                placeholder="请输入中台把关意见"
                value={formData.reviewOpinion || ''}
                onChange={(e) => handleChange('reviewOpinion', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">把关结果</label>
              <select
                value={formData.reviewResult || ''}
                onChange={(e) => handleChange('reviewResult', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">请选择</option>
                <option value="通过">通过</option>
                <option value="待把关">待把关</option>
                <option value="不通过">不通过</option>
              </select>
            </div>
          </div>
        );

      case '变更记录':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">变更内容 <span className="text-red-500">*</span></label>
              <textarea
                placeholder="请输入变更内容"
                value={formData.changeContent || ''}
                onChange={(e) => handleChange('changeContent', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">变更原因</label>
              <textarea
                placeholder="请输入变更原因"
                value={formData.changeReason || ''}
                onChange={(e) => handleChange('changeReason', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                rows={2}
              />
            </div>
          </div>
        );

      case '数字资产平台':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">商机是否建档 <span className="text-red-500">*</span></label>
              <select
                value={formData.assetArchive || ''}
                onChange={(e) => handleChange('assetArchive', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">请选择</option>
                <option value="是">是</option>
                <option value="否">否</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">建档时间</label>
              <input
                type="date"
                value={formData.archiveTime || ''}
                onChange={(e) => handleChange('archiveTime', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
        );

      case '第一服务界面':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">服务界面类型 <span className="text-red-500">*</span></label>
              <select
                value={formData.serviceDeskType || ''}
                onChange={(e) => handleChange('serviceDeskType', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">请选择</option>
                <option value="电话">电话</option>
                <option value="在线">在线</option>
                <option value="电话+在线">电话+在线</option>
                <option value="暂无">暂无</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">服务记录说明</label>
              <textarea
                placeholder="请输入服务界面记录说明"
                value={formData.serviceDeskRecord || ''}
                onChange={(e) => handleChange('serviceDeskRecord', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                rows={3}
              />
            </div>
          </div>
        );

      case '业务风险审核':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">审核结果 <span className="text-red-500">*</span></label>
              <select
                value={formData.auditResult || ''}
                onChange={(e) => handleChange('auditResult', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">请选择</option>
                <option value="通过">通过</option>
                <option value="不通过">不通过</option>
                <option value="待审核">待审核</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">对比结果文件</label>
              <Button variant="outline" size="sm" onClick={() => { setUploadTitle('对比结果文件'); setUploadOpen(true); }}>
                上传文件
              </Button>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">省内风险附件</label>
              <Button variant="outline" size="sm" onClick={() => { setUploadTitle('省内风险附件'); setUploadOpen(true); }}>
                上传文件
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-gray-500 text-center py-4">
            该节点暂无可录入内容
          </div>
        );
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md mx-4 max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-base">{nodeName}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {renderForm()}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button size="sm" onClick={handleSubmit}>
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        title={uploadTitle}
        files={uploadFiles}
        onFilesChange={setUploadFiles}
      />
    </>
  );
}
