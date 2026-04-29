import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

interface FileItem {
  name: string;
  size: string;
  uploadTime: string;
  synced: boolean;
}

interface FormData {
  // 发标信息
  isStart: string;
  bidType: string;
  startTime: string;
  biddingDocumentsFiles: FileItem[];
  // 发标应对信息
  bidBody: string;
  expectedPartners: string;
  tagMeetingDecisionFiles: FileItem[];
  isBid: string;
  // 投标信息
  tenderDocumentFiles: FileItem[];
  bidResult: string;
  // 中标信息
  bidTime: string;
  winBidAmount: string;
  winBidTime: string;
  customerContact: string;
  customerContactPhone: string;
  expectedCompleteTime: string;
  contractObject: string;
  winBidNoticeFiles: FileItem[];
  // 签约信息
  businessNegotiationTime: string;
  signAmount: string;
  signTime: string;
  signBodyFiles: FileItem[];
  // 商务谈判
  negotiationRecord: string;
  negotiationResult: string;
  negotiationRecordFiles: FileItem[];
  // 丢标信息
  bidTime2: string;
  loseReason: string;
  loseReasonOther: string;
  // 弃标信息
  isApprove: string;
  approver: string;
  approverHrCode: string;
  approverPhonenumber: string;
  approverRole: string;
  winningStatus: string;
  abandBidResult: string;
  qbFqTime: string;
  qbTgTime: string;
  // 未开标信息
  notOpenReason: string;
  // 未签约信息
  failResult: string;
  failReasonOther: string;
}

const bidTypeOptions = [
  { value: '1', label: '公开招标' },
  { value: '2', label: '邀请招标' },
  { value: '3', label: '竞争性谈判' },
  { value: '4', label: '单一来源采购' },
  { value: '5', label: '询价' },
  { value: '6', label: '直接签约' },
];

const bidResultOptions = [
  { value: '1', label: '中标' },
  { value: '2', label: '丢标' },
  { value: '3', label: '未开标' },
  { value: '4', label: '已签约' },
  { value: '5', label: '未签约' },
  { value: '6', label: '弃标' },
];

const loseReasonOptions = [
  { value: '1', label: '商机未提前知晓' },
  { value: '2', label: '客情关系不足，未提前介入项目' },
  { value: '3', label: '技术方案无法全面响应，技术丢分多' },
  { value: '4', label: '价格因素丢分' },
  { value: '5', label: '缺乏标书要求的企业资质或个人证书，商务丢分多' },
  { value: '6', label: '云网资源不满足项目需求' },
  { value: '7', label: '投标失误' },
  { value: '8', label: '其他' },
];

const abandBidResultOptions = [
  { value: '1', label: '不满足招标文件要求，如特殊的企业资质门槛，特定的项目案例等' },
  { value: '2', label: '技术方案不满足项目需求' },
  { value: '3', label: '项目利润率低，不符合电信管控要求' },
  { value: '4', label: '商机前期不知晓，时间太短，无法按时提交投标文件' },
  { value: '5', label: '综合评估中标概率很低' },
  { value: '6', label: '属于公司限制的项目类型，如纯设备集成、设备代购等' },
  { value: '7', label: '竞合项目，可通过被集成或分包获取收益' },
  { value: '8', label: '其他' },
  { value: '9', label: '商业模式不支持，如PPP、合资公司、无任何承诺服务合同' },
];

const approverRoleOptions = [
  { value: '1', label: '部门经理' },
  { value: '2', label: '行业总裁' },
  { value: '3', label: '领导' },
  { value: '4', label: '其他' },
];

interface AddBidDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: FormData) => void;
}

export function AddBidDialog({ open, onOpenChange, onSubmit }: AddBidDialogProps) {
  const [form, setForm] = useState<FormData>({
    isStart: '',
    bidType: '',
    startTime: '',
    biddingDocumentsFiles: [],
    bidBody: '',
    expectedPartners: '',
    tagMeetingDecisionFiles: [],
    isBid: '',
    tenderDocumentFiles: [],
    bidResult: '',
    bidTime: '',
    winBidAmount: '',
    winBidTime: '',
    customerContact: '',
    customerContactPhone: '',
    expectedCompleteTime: '',
    contractObject: '',
    winBidNoticeFiles: [],
    businessNegotiationTime: '',
    signAmount: '',
    signTime: '',
    signBodyFiles: [],
    negotiationRecord: '',
    negotiationResult: '',
    negotiationRecordFiles: [],
    bidTime2: '',
    loseReason: '',
    loseReasonOther: '',
    isApprove: '',
    approver: '',
    approverHrCode: '',
    approverPhonenumber: '',
    approverRole: '',
    winningStatus: '',
    abandBidResult: '',
    qbFqTime: '',
    qbTgTime: '',
    notOpenReason: '',
    failResult: '',
    failReasonOther: '',
  });

  const [expandedSections, setExpandedSections] = useState<string[]>(['basic']);

  const set = (key: keyof FormData, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleSubmit = () => {
    onSubmit?.(form);
    onOpenChange(false);
  };

  const renderSectionHeader = (title: string, section: string) => (
    <div
      className="flex items-center justify-between py-3 cursor-pointer"
      onClick={() => toggleSection(section)}
    >
      <span className="text-sm font-medium text-gray-800">{title}</span>
      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.includes(section) ? 'rotate-180' : ''}`} />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 bg-white px-4 py-3 border-b z-10">
          <DialogTitle className="text-base font-medium">录入前向投标</DialogTitle>
        </DialogHeader>

        <div className="px-4 py-3 space-y-2">
          {/* 发标信息 */}
          <div className="bg-white rounded-lg px-3 py-1">
            {renderSectionHeader('发标信息', 'basic')}
            {expandedSections.includes('basic') && (
              <div className="space-y-3 pb-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    是否发标 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.isStart}
                    onChange={e => set('isStart', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="">请选择</option>
                    <option value="1">是</option>
                    <option value="0">否</option>
                  </select>
                </div>

                {form.isStart === '1' && (
                  <>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        发标类型 <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.bidType}
                        onChange={e => set('bidType', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value="">请选择</option>
                        {bidTypeOptions.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        发标时间 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={form.startTime}
                        onChange={e => set('startTime', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        招标文件/招标公告 <span className="text-red-500">*</span>
                      </label>
                      <div className="border rounded-lg p-3 space-y-2">
                        {form.biddingDocumentsFiles.length > 0 && (
                          <div className="space-y-1">
                            {form.biddingDocumentsFiles.map((f, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <span className="text-blue-600 truncate flex-1">{f.name}</span>
                                <span className="text-gray-400">{f.size}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <button
                          className="w-full py-2 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-blue-400 hover:text-blue-500"
                          onClick={() => {
                            const newFile: FileItem = {
                              name: '招标文件.pdf',
                              size: '2.5 MB',
                              uploadTime: new Date().toLocaleString(),
                              synced: false,
                            };
                            set('biddingDocumentsFiles', [...form.biddingDocumentsFiles, newFile]);
                          }}
                        >
                          + 点击上传
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 发标应对信息 */}
          <div className="bg-white rounded-lg px-3 py-1">
            {renderSectionHeader('发标应对信息', 'response')}
            {expandedSections.includes('response') && (
              <div className="space-y-3 pb-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    投标主体 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="请输入"
                    value={form.bidBody}
                    onChange={e => set('bidBody', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    预计合作伙伴 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="请输入"
                    value={form.expectedPartners}
                    onChange={e => set('expectedPartners', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    是否应标 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="isBid"
                        value="1"
                        checked={form.isBid === '1'}
                        onChange={e => set('isBid', e.target.value)}
                      />
                      是
                    </label>
                    <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="isBid"
                        value="0"
                        checked={form.isBid === '0'}
                        onChange={e => set('isBid', e.target.value)}
                      />
                      否
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    标前会议决策记录 <span className="text-red-500">*</span>
                  </label>
                  <div className="border rounded-lg p-3 space-y-2">
                    {form.tagMeetingDecisionFiles.length > 0 && (
                      <div className="space-y-1">
                        {form.tagMeetingDecisionFiles.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <span className="text-blue-600 truncate flex-1">{f.name}</span>
                            <span className="text-gray-400">{f.size}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      className="w-full py-2 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-blue-400 hover:text-blue-500"
                      onClick={() => {
                        const newFile: FileItem = {
                          name: '标前会议决策记录.pdf',
                          size: '1.2 MB',
                          uploadTime: new Date().toLocaleString(),
                          synced: false,
                        };
                        set('tagMeetingDecisionFiles', [...form.tagMeetingDecisionFiles, newFile]);
                      }}
                    >
                      + 点击上传
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 应标信息 */}
          {form.isBid === '1' && (
            <div className="bg-white rounded-lg px-3 py-1">
              {renderSectionHeader('应标信息', 'bid')}
              {expandedSections.includes('bid') && (
                <div className="space-y-3 pb-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      应标结果 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.bidResult}
                      onChange={e => set('bidResult', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="">请选择</option>
                      {bidResultOptions.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      投标依据/标书 <span className="text-red-500">*</span>
                    </label>
                    <div className="border rounded-lg p-3 space-y-2">
                      {form.tenderDocumentFiles.length > 0 && (
                        <div className="space-y-1">
                          {form.tenderDocumentFiles.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <span className="text-blue-600 truncate flex-1">{f.name}</span>
                              <span className="text-gray-400">{f.size}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <button
                        className="w-full py-2 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-blue-400 hover:text-blue-500"
                        onClick={() => {
                          const newFile: FileItem = {
                            name: '投标标书.pdf',
                            size: '5.8 MB',
                            uploadTime: new Date().toLocaleString(),
                            synced: false,
                          };
                          set('tenderDocumentFiles', [...form.tenderDocumentFiles, newFile]);
                        }}
                      >
                        + 点击上传
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 中标信息 */}
          {form.bidResult === '1' && (
            <div className="bg-white rounded-lg px-3 py-1">
              {renderSectionHeader('中标信息', 'win')}
              {expandedSections.includes('win') && (
                <div className="space-y-3 pb-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      投标时间 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.bidTime}
                      onChange={e => set('bidTime', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      中标金额（万元） <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="请输入"
                      value={form.winBidAmount}
                      onChange={e => set('winBidAmount', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      中标时间 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.winBidTime}
                      onChange={e => set('winBidTime', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      签约对象 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="请输入"
                      value={form.contractObject}
                      onChange={e => set('contractObject', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      客户项目联系人 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="请输入"
                      value={form.customerContact}
                      onChange={e => set('customerContact', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      客户项目联系方式 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="请输入"
                      value={form.customerContactPhone}
                      onChange={e => set('customerContactPhone', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">项目期望完成时间</label>
                    <input
                      type="date"
                      value={form.expectedCompleteTime}
                      onChange={e => set('expectedCompleteTime', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">中标通知书</label>
                    <div className="border rounded-lg p-3 space-y-2">
                      {form.winBidNoticeFiles.length > 0 && (
                        <div className="space-y-1">
                          {form.winBidNoticeFiles.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <span className="text-blue-600 truncate flex-1">{f.name}</span>
                              <span className="text-gray-400">{f.size}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <button
                        className="w-full py-2 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-blue-400 hover:text-blue-500"
                        onClick={() => {
                          const newFile: FileItem = {
                            name: '中标通知书.pdf',
                            size: '1.0 MB',
                            uploadTime: new Date().toLocaleString(),
                            synced: false,
                          };
                          set('winBidNoticeFiles', [...form.winBidNoticeFiles, newFile]);
                        }}
                      >
                        + 点击上传
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 已签约信息 */}
          {form.bidResult === '4' && (
            <div className="bg-white rounded-lg px-3 py-1">
              {renderSectionHeader('已签约信息', 'signed')}
              {expandedSections.includes('signed') && (
                <div className="space-y-3 pb-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">商务谈判时间</label>
                    <input
                      type="date"
                      value={form.businessNegotiationTime}
                      onChange={e => set('businessNegotiationTime', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      客户项目联系人 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="请输入"
                      value={form.customerContact}
                      onChange={e => set('customerContact', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      客户项目联系方式 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="请输入"
                      value={form.customerContactPhone}
                      onChange={e => set('customerContactPhone', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">项目期望完成时间</label>
                    <input
                      type="date"
                      value={form.expectedCompleteTime}
                      onChange={e => set('expectedCompleteTime', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">签约金额（万元）</label>
                    <input
                      type="number"
                      placeholder="请输入"
                      value={form.signAmount}
                      onChange={e => set('signAmount', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">签约时间</label>
                    <input
                      type="date"
                      value={form.signTime}
                      onChange={e => set('signTime', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">合同附件</label>
                    <div className="border rounded-lg p-3 space-y-2">
                      {form.signBodyFiles.length > 0 && (
                        <div className="space-y-1">
                          {form.signBodyFiles.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <span className="text-blue-600 truncate flex-1">{f.name}</span>
                              <span className="text-gray-400">{f.size}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <button
                        className="w-full py-2 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-blue-400 hover:text-blue-500"
                        onClick={() => {
                          const newFile: FileItem = {
                            name: '合同.pdf',
                            size: '2.0 MB',
                            uploadTime: new Date().toLocaleString(),
                            synced: false,
                          };
                          set('signBodyFiles', [...form.signBodyFiles, newFile]);
                        }}
                      >
                        + 点击上传
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 丢标信息 */}
          {form.bidResult === '2' && (
            <div className="bg-white rounded-lg px-3 py-1">
              {renderSectionHeader('丢标信息', 'lose')}
              {expandedSections.includes('lose') && (
                <div className="space-y-3 pb-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      投标时间 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.bidTime2}
                      onChange={e => set('bidTime2', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      丢标原因 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.loseReason}
                      onChange={e => set('loseReason', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="">请选择</option>
                      {loseReasonOptions.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>

                  {form.loseReason === '8' && (
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">其他丢标原因</label>
                      <textarea
                        placeholder="请输入"
                        value={form.loseReasonOther}
                        onChange={e => set('loseReasonOther', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 弃标信息 */}
          {form.bidResult === '6' && (
            <div className="bg-white rounded-lg px-3 py-1">
              {renderSectionHeader('弃标信息', 'abandon')}
              {expandedSections.includes('abandon') && (
                <div className="space-y-3 pb-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      是否完成弃标审批 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.isApprove}
                      onChange={e => set('isApprove', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="">请选择</option>
                      <option value="1">是</option>
                      <option value="0">否</option>
                    </select>
                  </div>

                  {form.isApprove === '1' && (
                    <>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">
                          弃标审批人 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="请输入"
                          value={form.approver}
                          onChange={e => set('approver', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 block mb-1">
                          审批人人力编码 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="请输入"
                          value={form.approverHrCode}
                          onChange={e => set('approverHrCode', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 block mb-1">审批人手机号</label>
                        <input
                          type="text"
                          placeholder="请输入"
                          value={form.approverPhonenumber}
                          onChange={e => set('approverPhonenumber', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 block mb-1">
                          审批人角色 <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={form.approverRole}
                          onChange={e => set('approverRole', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        >
                          <option value="">请选择</option>
                          {approverRoleOptions.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 block mb-1">
                          弃标审批结果 <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={form.winningStatus}
                          onChange={e => set('winningStatus', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        >
                          <option value="">请选择</option>
                          <option value="0">未审批</option>
                          <option value="1">审核通过</option>
                          <option value="2">已退回</option>
                          <option value="3">未通过</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 block mb-1">
                          弃标原因 <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={form.abandBidResult}
                          onChange={e => set('abandBidResult', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        >
                          <option value="">请选择</option>
                          {abandBidResultOptions.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 block mb-1">
                          弃标审批发起时间 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={form.qbFqTime}
                          onChange={e => set('qbFqTime', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 block mb-1">
                          弃标审批通过时间 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={form.qbTgTime}
                          onChange={e => set('qbTgTime', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 未开标信息 */}
          {form.bidResult === '3' && (
            <div className="bg-white rounded-lg px-3 py-1">
              {renderSectionHeader('未开标信息', 'notOpen')}
              {expandedSections.includes('notOpen') && (
                <div className="space-y-3 pb-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      未开标原因 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="请输入未开标原因"
                      value={form.notOpenReason}
                      onChange={e => set('notOpenReason', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 未签约信息 */}
          {form.bidResult === '5' && (
            <div className="bg-white rounded-lg px-3 py-1">
              {renderSectionHeader('未签约信息', 'fail')}
              {expandedSections.includes('fail') && (
                <div className="space-y-3 pb-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      签约失败原因 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.failResult}
                      onChange={e => set('failResult', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="">请选择</option>
                      <option value="1">客户需求变更或取消</option>
                      <option value="2">丢单</option>
                      <option value="3">其他</option>
                    </select>
                  </div>

                  {form.failResult === '3' && (
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        其他签约失败原因 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        placeholder="请输入"
                        value={form.failReasonOther}
                        onChange={e => set('failReasonOther', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="sticky bottom-0 bg-white px-4 py-3 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={handleSubmit}>提交</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}