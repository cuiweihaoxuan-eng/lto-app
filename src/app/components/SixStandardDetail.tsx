import { useState } from 'react';
import { ChevronLeft, ChevronDown, Info, Plus, FileText, X, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { UploadDialog } from './UploadDialog';

// ===== Mock 数据 =====

const mockCustomerArchive = {
  customerName: '杭州某某科技有限公司',
  address: '浙江省杭州市西湖区文三路123号',
  contact: '张三',
  contactPhone: '138****1234',
  manager: '李四',
};

const mockVisitRecords = [
  { id: 1, customerUnit: '杭州某某科技有限公司', contact: '张三', purpose: '商机跟进', date: '2026-04-15', location: '客户会议室', visitor: '李四、王五', hasPhoto: true },
  { id: 2, customerUnit: '杭州某某科技有限公司', contact: '张三', purpose: '需求沟通', date: '2026-04-10', location: '客户办公室', visitor: '李四', hasPhoto: true },
];

const mockOpportunity = {
  opportunityName: 'XX单位信息化建设采购项目',
  opportunityCode: 'JHTB-2026-001',
  entryTime: '2026-04-10',
  isEarlyEntry: '是',
  biddingTime: '2026-04-15',
  signTime: '-',
};

const mockThreeYearProjects = [
  { id: 1, contractName: 'XX医院信息化建设一期项目', contractCode: 'HT-2024-001', signTime: '2024-03-15', amount: '¥5,800,000', vendor: '杭州某某科技有限公司' },
  { id: 2, contractName: 'XX学校智慧校园建设项目', contractCode: 'HT-2023-008', signTime: '2023-11-20', amount: '¥3,200,000', vendor: '浙江某某信息技术有限公司' },
];

const mockTeamMembers = [
  { id: 1, roleType: '第一责任人', userName: '张明', role: '项目经理', department: '政企客户部', entryTime: '2026-04-10', phone: '138****1234', inviter: '王总' },
  { id: 2, roleType: '客户经理', userName: '李华', role: '客户经理', department: '政企客户部', entryTime: '2026-04-10', phone: '139****5678', inviter: '张明' },
  { id: 3, roleType: '解决方案经理', userName: '王芳', role: '解决方案经理', department: '解决方案部', entryTime: '2026-04-11', phone: '137****9012', inviter: '张明' },
  { id: 4, roleType: '项目经理', userName: '赵强', role: '技术经理', department: '项目管理部', entryTime: '2026-04-12', phone: '136****3456', inviter: '张明' },
];

const mockBackwardList = [
  { id: 1, partnerName: '杭州XX科技有限公司', backwardType: '成本', backwardName: 'XX设备采购', backwardCode: 'HX-2026-001', amount: '¥600,000', signTime: '2026-03-10', signSubject: '浙江有数科技有限公司' },
];

const mockBackwardContracts = [
  { id: 1, partner: '杭州XX科技有限公司', contractName: 'XX项目设备采购合同', contractCode: 'HT-2026-001', signTime: '2026-03-15', amount: '¥800,000', signSubject: '杭州XX科技有限公司' },
];

// ===== 类型定义 =====

interface UploadedFile {
  name: string;
  size: string;
  uploadTime: string;
  synced: boolean;
}

interface SecondLevelItem {
  id: string;
  name: string;
  rule?: string;
  includedInSixPosition?: boolean;
  syncType?: string;
  entryPoint?: string;
  // 内容类型
  contentType: 'readonly' | 'upload' | 'form' | 'table' | 'mixed';
  // 对应哪种内容
  uploadFields?: string[];
  formFields?: string[];
}

// ===== 二级节点配置 =====

const secondLevelConfig: Record<string, SecondLevelItem> = {
  '1-1': { id: '1-1', name: '客户档案', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: true, syncType: '具备两级', entryPoint: '省内CRM、集团CRM', contentType: 'readonly' },
  '1-2': { id: '1-2', name: '拜访记录', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: true, syncType: '具备上送', entryPoint: '省内CCPM、省内LTO六到位', contentType: 'table' },
  '1-3': { id: '1-3', name: '录入商机', rule: '中标或已签约商机三级节点均点亮则二级节点自动点亮', includedInSixPosition: true, syncType: '具备两级', entryPoint: '省内LTO商机、集团BPM', contentType: 'readonly' },
  '1-4': { id: '1-4', name: '近三年信息化项目', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: true, syncType: '仅省内展示', entryPoint: '省内自动展示', contentType: 'table' },
  '1-5': { id: '1-5', name: '其他', rule: '文件上传则认为具备', includedInSixPosition: false, syncType: '仅省内展示', entryPoint: '省内LTO六到位', contentType: 'upload', uploadFields: ['客情掌握其它附件'] },
  '2-1': { id: '2-1', name: '组建团队', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: true, syncType: '具备下发', entryPoint: '集团BPM', contentType: 'table' },
  '2-2': { id: '2-2', name: '方案设计与审核', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: true, syncType: '具备下发', entryPoint: '省内LTO六到位、集团BPM下发', contentType: 'upload', uploadFields: ['总体解决方案文档', '方案审核记录', '专题研讨会记录', '可研报告', '客户方案沟通记录'] },
  '2-3': { id: '2-3', name: '方案解构与中台把关', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: true, syncType: '具备下发', entryPoint: '集团BPM下发', contentType: 'mixed' },
  '2-4': { id: '2-4', name: '其他', rule: '文件上传则认为具备', includedInSixPosition: false, syncType: '仅省内展示', entryPoint: '省内LTO六到位', contentType: 'upload', uploadFields: ['方案总控其它附件'] },
  '3-1': { id: '3-1', name: '参标记录', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: true, syncType: '结构化内容具备下发', entryPoint: '集团BPM下发', contentType: 'form' },
  '3-2': { id: '3-2', name: '应标结果记录', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: true, syncType: '结构化内容具备下发', entryPoint: '集团BPM下发', contentType: 'form' },
  '3-3': { id: '3-3', name: '商务谈判', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: true, syncType: '结构化内容具备下发', entryPoint: '集团BPM下发', contentType: 'form' },
  '3-4': { id: '3-4', name: '前向合同信息', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: false, syncType: '仅省内展示', entryPoint: '省内LTO六到位', contentType: 'mixed' },
  '3-5': { id: '3-5', name: '其他', rule: '文件上传则认为具备', includedInSixPosition: false, syncType: '仅省内展示', entryPoint: '省内LTO六到位', contentType: 'upload', uploadFields: ['谈判应标其它附件'] },
  '4-1': { id: '4-1', name: '标前决策会', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: true, syncType: '否', entryPoint: '省内LTO模式会、集团BPM', contentType: 'form' },
  '4-2': { id: '4-2', name: '业务解构', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: true, syncType: '具备下发', entryPoint: '集团BPM、省内LTO六到位', contentType: 'form' },
  '4-3': { id: '4-3', name: '业务风险及合规审核', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: true, syncType: '否', entryPoint: '集团BPM、省内LTO六到位', contentType: 'upload', uploadFields: ['审核结果', '对比结果', '省内风险附件'] },
  '4-4': { id: '4-4', name: '后向资料', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: false, syncType: '仅省内展示', entryPoint: '省内LTO六到位', contentType: 'mixed' },
  '4-5': { id: '4-5', name: '其他', rule: '文件上传则认为具备', includedInSixPosition: false, syncType: '仅省内展示', entryPoint: '省内LTO六到位', contentType: 'upload', uploadFields: ['采购自主其它附件'] },
  '5-1': { id: '5-1', name: '项目实施总体设计', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: true, syncType: '具备两级', entryPoint: '省内LTO六到位、集团PMS', contentType: 'upload', uploadFields: ['总体实施方案文档', '监理报告', '监理日志'] },
  '5-2': { id: '5-2', name: '变更记录', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: true, syncType: '具备两级', entryPoint: '省内LTO六到位、集团PMS', contentType: 'form' },
  '5-3': { id: '5-3', name: '验收报告', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: true, syncType: '具备两级', entryPoint: '省内LTO六到位、集团PMS', contentType: 'upload', uploadFields: ['初验报告', '终验报告', '进度表', '试运行报告'] },
  '5-4': { id: '5-4', name: '项目实施文件', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: false, syncType: '仅省内展示', entryPoint: '省内LTO六到位', contentType: 'upload', uploadFields: ['会议纪要', '项目周报/月报', '延期说明', '竣工报告', '问题纪要', '起租相关附件', '软硬件设备或服务清单', '项目交付报告', '项目交维报告', '项目试运行报告', '后向厂家任务计划', '后向厂家团队清单'] },
  '5-5': { id: '5-5', name: '审计清单', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: false, syncType: '仅省内展示', entryPoint: '省内LTO六到位', contentType: 'upload', uploadFields: ['项目送审承诺函-建设方', '送审项目基本信息表', '前向审计报告/前向结算审定书', '项目送审承诺函-施工方', '后向结算送审清单'] },
  '5-6': { id: '5-6', name: '其他', rule: '文件上传则认为具备', includedInSixPosition: false, syncType: '仅省内展示', entryPoint: '省内LTO六到位', contentType: 'upload', uploadFields: ['项目强管控其它附件'] },
  '6-1': { id: '6-1', name: '数字资产平台', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: true, syncType: '具备两级', entryPoint: '省内LTO六到位、集团BPM下发', contentType: 'form' },
  '6-2': { id: '6-2', name: '第一服务界面', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: true, syncType: '具备两级', entryPoint: '省内LTO六到位、集团BPM下发', contentType: 'form' },
  '6-3': { id: '6-3', name: '售后其他资料', rule: '三级节点均点亮则二级节点自动点亮', includedInSixPosition: false, syncType: '仅省内展示', entryPoint: '省内LTO六到位', contentType: 'upload', uploadFields: ['服务器资源', '运维群', '培训记录', '培训照片', '需求规格说明书', '概要设计说明书', '详细设计说明书', '数据库设计说明书'] },
  '6-4': { id: '6-4', name: '其他', rule: '文件上传则认为具备', includedInSixPosition: false, syncType: '仅省内展示', entryPoint: '省内LTO六到位', contentType: 'upload', uploadFields: ['运维自主其它附件'] },
};

// ===== 模块数据 =====

interface ModuleNode {
  id: string;
  moduleId: string;
  moduleName: string;
  categoryId: string;
  categoryName: string;
  completed: boolean;
  rule?: string;
  includedInSixPosition?: boolean;
}

const allNodes: ModuleNode[] = [
  // 客情掌握
  { id: '1-1-1', moduleId: 'module1', moduleName: '客情掌握', categoryId: '1-1', categoryName: '客户档案', completed: true },
  { id: '1-2-1', moduleId: 'module1', moduleName: '客情掌握', categoryId: '1-2', categoryName: '拜访记录', completed: true },
  { id: '1-3-1', moduleId: 'module1', moduleName: '客情掌握', categoryId: '1-3', categoryName: '录入商机', completed: false },
  { id: '1-3-2', moduleId: 'module1', moduleName: '客情掌握', categoryId: '1-3', categoryName: '录入商机', completed: false },
  { id: '1-4-1', moduleId: 'module1', moduleName: '客情掌握', categoryId: '1-4', categoryName: '近三年信息化项目', completed: false },
  { id: '1-5-1', moduleId: 'module1', moduleName: '客情掌握', categoryId: '1-5', categoryName: '其他', completed: false },
  // 方案总控
  { id: '2-1-1', moduleId: 'module2', moduleName: '方案总控', categoryId: '2-1', categoryName: '组建团队', completed: true },
  { id: '2-1-2', moduleId: 'module2', moduleName: '方案总控', categoryId: '2-1', categoryName: '组建团队', completed: true },
  { id: '2-2-1', moduleId: 'module2', moduleName: '方案总控', categoryId: '2-2', categoryName: '方案设计与审核', completed: false },
  { id: '2-2-2', moduleId: 'module2', moduleName: '方案总控', categoryId: '2-2', categoryName: '方案设计与审核', completed: false },
  { id: '2-2-3', moduleId: 'module2', moduleName: '方案总控', categoryId: '2-2', categoryName: '方案设计与审核', completed: false },
  { id: '2-2-4', moduleId: 'module2', moduleName: '方案总控', categoryId: '2-2', categoryName: '方案设计与审核', completed: false },
  { id: '2-2-5', moduleId: 'module2', moduleName: '方案总控', categoryId: '2-2', categoryName: '方案设计与审核', completed: false },
  { id: '2-3-1', moduleId: 'module2', moduleName: '方案总控', categoryId: '2-3', categoryName: '方案解构与中台把关', completed: false },
  { id: '2-3-2', moduleId: 'module2', moduleName: '方案总控', categoryId: '2-3', categoryName: '方案解构与中台把关', completed: false },
  { id: '2-3-3', moduleId: 'module2', moduleName: '方案总控', categoryId: '2-3', categoryName: '方案解构与中台把关', completed: true },
  { id: '2-4-1', moduleId: 'module2', moduleName: '方案总控', categoryId: '2-4', categoryName: '其他', completed: false },
  // 谈判/应标自主
  { id: '3-1-1', moduleId: 'module3', moduleName: '谈判/应标自主', categoryId: '3-1', categoryName: '参标记录', completed: false },
  { id: '3-1-2', moduleId: 'module3', moduleName: '谈判/应标自主', categoryId: '3-1', categoryName: '参标记录', completed: false },
  { id: '3-2-1', moduleId: 'module3', moduleName: '谈判/应标自主', categoryId: '3-2', categoryName: '应标结果记录', completed: false },
  { id: '3-2-2', moduleId: 'module3', moduleName: '谈判/应标自主', categoryId: '3-2', categoryName: '应标结果记录', completed: false },
  { id: '3-3-1', moduleId: 'module3', moduleName: '谈判/应标自主', categoryId: '3-3', categoryName: '商务谈判', completed: true },
  { id: '3-3-2', moduleId: 'module3', moduleName: '谈判/应标自主', categoryId: '3-3', categoryName: '商务谈判', completed: false },
  { id: '3-4-1', moduleId: 'module3', moduleName: '谈判/应标自主', categoryId: '3-4', categoryName: '前向合同信息', completed: false },
  { id: '3-5-1', moduleId: 'module3', moduleName: '谈判/应标自主', categoryId: '3-5', categoryName: '其他', completed: false },
  // 采购自主
  { id: '4-1-1', moduleId: 'module4', moduleName: '采购自主', categoryId: '4-1', categoryName: '标前决策会', completed: false },
  { id: '4-1-2', moduleId: 'module4', moduleName: '采购自主', categoryId: '4-1', categoryName: '标前决策会', completed: false },
  { id: '4-2-1', moduleId: 'module4', moduleName: '采购自主', categoryId: '4-2', categoryName: '业务解构', completed: false },
  { id: '4-2-2', moduleId: 'module4', moduleName: '采购自主', categoryId: '4-2', categoryName: '业务解构', completed: false },
  { id: '4-3-1', moduleId: 'module4', moduleName: '采购自主', categoryId: '4-3', categoryName: '业务风险及合规审核', completed: false },
  { id: '4-3-2', moduleId: 'module4', moduleName: '采购自主', categoryId: '4-3', categoryName: '业务风险及合规审核', completed: false },
  { id: '4-3-3', moduleId: 'module4', moduleName: '采购自主', categoryId: '4-3', categoryName: '业务风险及合规审核', completed: false },
  { id: '4-4-1', moduleId: 'module4', moduleName: '采购自主', categoryId: '4-4', categoryName: '后向资料', completed: false },
  { id: '4-5-1', moduleId: 'module4', moduleName: '采购自主', categoryId: '4-5', categoryName: '其他', completed: false },
  // 项目强管控
  { id: '5-1-1', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-1', categoryName: '项目实施总体设计', completed: false },
  { id: '5-1-2', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-1', categoryName: '项目实施总体设计', completed: false },
  { id: '5-1-3', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-1', categoryName: '项目实施总体设计', completed: false },
  { id: '5-2-1', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-2', categoryName: '变更记录', completed: false },
  { id: '5-2-2', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-2', categoryName: '变更记录', completed: false },
  { id: '5-3-1', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-3', categoryName: '验收报告', completed: false },
  { id: '5-3-2', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-3', categoryName: '验收报告', completed: false },
  { id: '5-3-3', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-3', categoryName: '验收报告', completed: false },
  { id: '5-3-4', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-3', categoryName: '验收报告', completed: false },
  { id: '5-4-1', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-4', categoryName: '项目实施文件', completed: false },
  { id: '5-4-2', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-4', categoryName: '项目实施文件', completed: false },
  { id: '5-4-3', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-4', categoryName: '项目实施文件', completed: false },
  { id: '5-4-4', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-4', categoryName: '项目实施文件', completed: false },
  { id: '5-4-5', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-4', categoryName: '项目实施文件', completed: false },
  { id: '5-4-6', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-4', categoryName: '项目实施文件', completed: false },
  { id: '5-4-7', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-4', categoryName: '项目实施文件', completed: false },
  { id: '5-4-8', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-4', categoryName: '项目实施文件', completed: false },
  { id: '5-4-9', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-4', categoryName: '项目实施文件', completed: false },
  { id: '5-4-10', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-4', categoryName: '项目实施文件', completed: false },
  { id: '5-4-11', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-4', categoryName: '项目实施文件', completed: false },
  { id: '5-4-12', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-4', categoryName: '项目实施文件', completed: false },
  { id: '5-5-1', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-5', categoryName: '审计清单', completed: false },
  { id: '5-5-2', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-5', categoryName: '审计清单', completed: false },
  { id: '5-5-3', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-5', categoryName: '审计清单', completed: false },
  { id: '5-5-4', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-5', categoryName: '审计清单', completed: false },
  { id: '5-5-5', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-5', categoryName: '审计清单', completed: false },
  { id: '5-6-1', moduleId: 'module5', moduleName: '项目强管控', categoryId: '5-6', categoryName: '其他', completed: false },
  // 运维自主
  { id: '6-1-1', moduleId: 'module6', moduleName: '运维自主', categoryId: '6-1', categoryName: '数字资产平台', completed: false },
  { id: '6-2-1', moduleId: 'module6', moduleName: '运维自主', categoryId: '6-2', categoryName: '第一服务界面', completed: false },
  { id: '6-3-1', moduleId: 'module6', moduleName: '运维自主', categoryId: '6-3', categoryName: '售后其他资料', completed: false },
  { id: '6-3-2', moduleId: 'module6', moduleName: '运维自主', categoryId: '6-3', categoryName: '售后其他资料', completed: false },
  { id: '6-3-3', moduleId: 'module6', moduleName: '运维自主', categoryId: '6-3', categoryName: '售后其他资料', completed: false },
  { id: '6-3-4', moduleId: 'module6', moduleName: '运维自主', categoryId: '6-3', categoryName: '售后其他资料', completed: false },
  { id: '6-3-5', moduleId: 'module6', moduleName: '运维自主', categoryId: '6-3', categoryName: '售后其他资料', completed: false },
  { id: '6-3-6', moduleId: 'module6', moduleName: '运维自主', categoryId: '6-3', categoryName: '售后其他资料', completed: false },
  { id: '6-3-7', moduleId: 'module6', moduleName: '运维自主', categoryId: '6-3', categoryName: '售后其他资料', completed: false },
  { id: '6-3-8', moduleId: 'module6', moduleName: '运维自主', categoryId: '6-3', categoryName: '售后其他资料', completed: false },
  { id: '6-4-1', moduleId: 'module6', moduleName: '运维自主', categoryId: '6-4', categoryName: '其他', completed: false },
];

const modules = [
  {
    id: 'module1',
    name: '客情掌握',
    rule: '二级节点均点亮则一级节点自动点亮',
    categories: [
      { id: '1-1', name: '客户档案' },
      { id: '1-2', name: '拜访记录' },
      { id: '1-3', name: '录入商机' },
      { id: '1-4', name: '近三年信息化项目' },
      { id: '1-5', name: '其他' },
    ],
  },
  {
    id: 'module2',
    name: '方案总控',
    rule: '二级节点均点亮则一级节点自动点亮',
    categories: [
      { id: '2-1', name: '组建团队' },
      { id: '2-2', name: '方案设计与审核' },
      { id: '2-3', name: '方案解构与中台把关' },
      { id: '2-4', name: '其他' },
    ],
  },
  {
    id: 'module3',
    name: '谈判/应标自主',
    rule: '制定总体实施方案或项目总验收报告任意一个二级节点点亮则一级节点自动点亮',
    categories: [
      { id: '3-1', name: '参标记录' },
      { id: '3-2', name: '应标结果记录' },
      { id: '3-3', name: '商务谈判' },
      { id: '3-4', name: '前向合同信息' },
      { id: '3-5', name: '其他' },
    ],
  },
  {
    id: 'module4',
    name: '采购自主',
    rule: '二级节点均点亮则一级节点自动点亮',
    categories: [
      { id: '4-1', name: '标前决策会' },
      { id: '4-2', name: '业务解构' },
      { id: '4-3', name: '业务风险及合规审核' },
      { id: '4-4', name: '后向资料' },
      { id: '4-5', name: '其他' },
    ],
  },
  {
    id: 'module5',
    name: '项目强管控',
    rule: '制定总体实施方案或项目总验收报告任意一个二级节点点亮则一级节点自动点亮',
    categories: [
      { id: '5-1', name: '项目实施总体设计' },
      { id: '5-2', name: '变更记录' },
      { id: '5-3', name: '验收报告' },
      { id: '5-4', name: '项目实施文件' },
      { id: '5-5', name: '审计清单' },
      { id: '5-6', name: '其他' },
    ],
  },
  {
    id: 'module6',
    name: '运维自主',
    rule: '二级节点均点亮则一级节点自动点亮',
    categories: [
      { id: '6-1', name: '数字资产平台' },
      { id: '6-2', name: '第一服务界面' },
      { id: '6-3', name: '售后其他资料' },
      { id: '6-4', name: '其他' },
    ],
  },
];

// ===== 内容面板组件 =====

interface ContentPanelProps {
  categoryId: string;
  categoryName: string;
  onClose: () => void;
  allFiles: Record<string, UploadedFile[]>;
  onFilesChange: (field: string, files: UploadedFile[]) => void;
  nodeCompleted: Record<string, boolean>;
  onNodeComplete: (nodeId: string) => void;
  uploadOpen: boolean;
  setUploadOpen: (open: boolean) => void;
  uploadField: string;
  setUploadField: (field: string) => void;
}

function ContentPanel({ categoryId, categoryName, onClose, allFiles, onFilesChange, nodeCompleted, onNodeComplete, uploadOpen, setUploadOpen, uploadField, setUploadField }: ContentPanelProps) {
  const navigate = useNavigate();
  const { taskId } = useParams();

  // 表单状态
  const [formData, setFormData] = useState<Record<string, string>>({});

  // ===== 客户档案 =====
  if (categoryId === '1-1') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-3">
          <span className="font-medium text-gray-900">{categoryName}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-white rounded-lg divide-y">
            {[
              { label: '客户名称', value: mockCustomerArchive.customerName },
              { label: '注册地址', value: mockCustomerArchive.address },
              { label: '客户联系人', value: mockCustomerArchive.contact },
              { label: '客户联系人手机号', value: mockCustomerArchive.contactPhone },
              { label: '客户经理', value: mockCustomerArchive.manager },
            ].map((item) => (
              <div key={item.label} className="px-4 py-3 flex justify-between">
                <span className="text-xs text-gray-500">{item.label}</span>
                <span className="text-xs text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===== 拜访记录 =====
  if (categoryId === '1-2') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <span className="font-medium text-gray-900">{categoryName}</span>
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-7 text-xs gap-1" onClick={() => navigate(`/visit-records/${taskId}`)}>
              <Plus className="w-3 h-3" /> 新增
            </Button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {mockVisitRecords.map((record) => (
            <div key={record.id} className="bg-white rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">#{record.id}</span>
                <span className="text-xs text-gray-500">{record.date}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">拜访客户单位</span>
                  <span className="text-gray-900">{record.customerUnit}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">拜访对象</span>
                  <span className="text-gray-900">{record.contact}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">拜访事由</span>
                  <span className="text-gray-900">{record.purpose}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">拜访地点</span>
                  <span className="text-gray-900">{record.location}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">我方拜访者</span>
                  <span className="text-gray-900">{record.visitor}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">现场照片</span>
                  <span className={record.hasPhoto ? 'text-green-600' : 'text-gray-400'}>{record.hasPhoto ? '已上传' : '未上传'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===== 录入商机 =====
  if (categoryId === '1-3') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-3">
          <span className="font-medium text-gray-900">{categoryName}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-white rounded-lg divide-y">
            {[
              { label: '商机名称', value: mockOpportunity.opportunityName },
              { label: '商机集团编码', value: mockOpportunity.opportunityCode },
              { label: '录入时间', value: mockOpportunity.entryTime },
              { label: '是否提前录入商机', value: mockOpportunity.isEarlyEntry },
              { label: '投标时间', value: mockOpportunity.biddingTime },
              { label: '签约时间', value: mockOpportunity.signTime },
            ].map((item) => (
              <div key={item.label} className="px-4 py-3 flex justify-between">
                <span className="text-xs text-gray-500">{item.label}</span>
                <span className="text-xs text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===== 近三年信息化项目 =====
  if (categoryId === '1-4') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-3">
          <span className="font-medium text-gray-900">{categoryName}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {mockThreeYearProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg p-4 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">合同名称</span>
                <span className="text-gray-900 text-right max-w-[60%] text-right">{project.contractName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">合同编号</span>
                <span className="text-gray-900">{project.contractCode}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">签约时间</span>
                <span className="text-gray-900">{project.signTime}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">合同金额</span>
                <span className="text-orange-600 font-medium">{project.amount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">实施厂家</span>
                <span className="text-gray-900">{project.vendor}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===== 组建团队 =====
  if (categoryId === '2-1') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-3">
          <span className="font-medium text-gray-900">{categoryName}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {mockTeamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg p-4 space-y-1.5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  member.roleType === '第一责任人' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                }`}>{member.roleType}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">用户名</span>
                <span className="text-gray-900">{member.userName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">角色</span>
                <span className="text-gray-900">{member.role}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">部门</span>
                <span className="text-gray-900">{member.department}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">进入时间</span>
                <span className="text-gray-900">{member.entryTime}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">联系电话</span>
                <span className="text-gray-900">{member.phone}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">邀请人</span>
                <span className="text-gray-900">{member.inviter}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===== 方案解构与中台把关 =====
  if (categoryId === '2-3') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-3">
          <span className="font-medium text-gray-900">{categoryName}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="bg-white rounded-lg p-4">
            <div className="text-xs font-medium text-gray-700 mb-3">方案解构</div>
            <div className="space-y-2">
              {[
                { label: '方案解构', value: 'XX项目方案解构文档.pdf' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <span className="text-xs text-blue-600 truncate ml-2">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-xs font-medium text-gray-700 mb-3">中台把关</div>
            <div className="space-y-2">
              {[
                { label: '把关意见', value: 'XX项目方案把关意见.pdf' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <span className="text-xs text-blue-600 truncate ml-2">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">把关结果</span>
              <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-600 rounded">待把关</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== 参标记录 =====
  if (categoryId === '3-1') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900">{categoryName}</span>
          <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">集团六到位要求</span>
          <span className="text-xs px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded">省内六到位要求</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="bg-white rounded-lg p-4 space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">是否应标 <span className="text-red-500">*</span></label>
              <select
                value={formData.biddingType || ''}
                onChange={(e) => setFormData({ ...formData, biddingType: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, biddingTime: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">投标主体 <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="请输入投标主体"
                value={formData.biddingSubject || ''}
                onChange={(e) => setFormData({ ...formData, biddingSubject: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
          {/* 招标文件 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">招标文件</span>
                <span className="text-xs px-1 py-0.5 bg-blue-50 text-blue-600 rounded">集团</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('招标文件'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['招标文件'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['招标文件'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
          {/* 投标依据标书 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">投标依据/标书</span>
                <span className="text-xs px-1 py-0.5 bg-blue-50 text-blue-600 rounded">集团</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('投标依据标书'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['投标依据标书'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['投标依据标书'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
          {/* 发标证明文件 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">发标证明文件</span>
                <span className="text-xs px-1 py-0.5 bg-blue-50 text-blue-600 rounded">集团</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('发标证明文件'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['发标证明文件'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['发标证明文件'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
          {/* 投标证明文件 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">投标证明文件</span>
                <span className="text-xs px-1 py-0.5 bg-blue-50 text-blue-600 rounded">集团</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('投标证明文件'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['投标证明文件'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['投标证明文件'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
          {/* 投标报价清单 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">投标报价清单</span>
                <span className="text-xs px-1 py-0.5 bg-orange-50 text-orange-600 rounded">省内</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('投标报价清单'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['投标报价清单'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['投标报价清单'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
          {/* 弃标证明文件 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">弃标证明文件</span>
                <span className="text-xs px-1 py-0.5 bg-blue-50 text-blue-600 rounded">集团</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('弃标证明文件'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['弃标证明文件'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['弃标证明文件'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
        </div>
        <div className="p-4 border-t bg-white">
          <Button className="w-full" size="sm" onClick={() => {
            if (formData.biddingType && formData.biddingTime && formData.biddingSubject) {
              onNodeComplete('3-1-1');
            }
          }}>保存</Button>
        </div>
      </div>
    );
  }

  // ===== 应标结果记录 =====
  if (categoryId === '3-2') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900">{categoryName}</span>
          <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">集团六到位要求</span>
          <span className="text-xs px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded">省内六到位要求</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="bg-white rounded-lg p-4 space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">应标结果 <span className="text-red-500">*</span></label>
              <select
                value={formData.bidWinResult || ''}
                onChange={(e) => setFormData({ ...formData, bidWinResult: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, bidWinTime: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">中标金额（万元）</label>
              <input
                type="number"
                placeholder="请输入"
                value={formData.bidWinAmount || ''}
                onChange={(e) => setFormData({ ...formData, bidWinAmount: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">签约对象</label>
              <input
                type="text"
                placeholder="请输入"
                value={formData.signObject || ''}
                onChange={(e) => setFormData({ ...formData, signObject: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
          {/* 中标结果通知书 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">中标结果通知书</span>
                <span className="text-xs px-1 py-0.5 bg-blue-50 text-blue-600 rounded">集团</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('中标结果通知书'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['中标结果通知书'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['中标结果通知书'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
          {/* 丢标复盘文件 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">丢标复盘文件</span>
                <span className="text-xs px-1 py-0.5 bg-blue-50 text-blue-600 rounded">集团</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('丢标复盘文件'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['丢标复盘文件'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['丢标复盘文件'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
        </div>
        <div className="p-4 border-t bg-white">
          <Button className="w-full" size="sm" onClick={() => {
            if (formData.bidWinResult) {
              onNodeComplete('3-2-1');
            }
          }}>保存</Button>
        </div>
      </div>
    );
  }

  // ===== 商务谈判 =====
  if (categoryId === '3-3') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-3">
          <span className="font-medium text-gray-900">{categoryName}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="bg-white rounded-lg p-4 space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">谈判记录 <span className="text-red-500">*</span></label>
              <textarea
                placeholder="请输入谈判记录内容"
                value={formData.negotiationRecord || ''}
                onChange={(e) => setFormData({ ...formData, negotiationRecord: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                rows={4}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">谈判结果 <span className="text-red-500">*</span></label>
              <select
                value={formData.negotiationResult || ''}
                onChange={(e) => setFormData({ ...formData, negotiationResult: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">请选择</option>
                <option value="达成合作">达成合作</option>
                <option value="继续洽谈">继续洽谈</option>
                <option value="未达成">未达成</option>
              </select>
            </div>
          </div>
          {/* 谈判记录上传 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">谈判记录上传</span>
                <span className="text-xs px-1 py-0.5 bg-blue-50 text-blue-600 rounded">集团</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('谈判记录上传'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['谈判记录上传'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['谈判记录上传'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
        </div>
        <div className="p-4 border-t bg-white">
          <Button className="w-full" size="sm" onClick={() => {
            if (formData.negotiationRecord && formData.negotiationResult) {
              onNodeComplete('3-3-1');
            }
          }}>保存</Button>
        </div>
      </div>
    );
  }

  // ===== 前向合同信息 =====
  if (categoryId === '3-4') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900">{categoryName}</span>
          <span className="text-xs px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded">省内六到位要求</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* 合同附件 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">合同附件</span>
                <span className="text-xs px-1 py-0.5 bg-orange-50 text-orange-600 rounded">省内</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('前向合同附件'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['前向合同附件'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['前向合同附件'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
          {/* 报价清单 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">报价清单</span>
                <span className="text-xs px-1 py-0.5 bg-orange-50 text-orange-600 rounded">省内</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('前向报价清单'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['前向报价清单'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['前向报价清单'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
          {/* 图纸 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">图纸</span>
                <span className="text-xs px-1 py-0.5 bg-orange-50 text-orange-600 rounded">省内</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('前向图纸'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['前向图纸'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['前向图纸'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
          {/* 合同信息列表 */}
          <div className="bg-white rounded-lg p-4">
            <div className="text-xs font-medium text-gray-700 mb-3">合同信息列表</div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">合同名称</span>
                <span className="text-gray-900">XX项目设备采购合同</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">合同编码</span>
                <span className="text-gray-900">HT-2026-001</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">合同金额</span>
                <span className="text-orange-600">¥800,000</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">签约时间</span>
                <span className="text-gray-900">2026-03-15</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">签约主体</span>
                <span className="text-gray-900">浙江有数科技有限公司</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">合同状态</span>
                <span className="text-green-600">执行中</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== 标前决策会 =====
  if (categoryId === '4-1') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900">{categoryName}</span>
          <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">集团六到位要求</span>
          <span className="text-xs px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded">省内六到位要求</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="bg-white rounded-lg p-4 space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">决策会名称</label>
              <input
                type="text"
                placeholder="请输入决策会名称"
                value={formData.decisionName || ''}
                onChange={(e) => setFormData({ ...formData, decisionName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">决策时间</label>
              <input
                type="date"
                value={formData.decisionTime || ''}
                onChange={(e) => setFormData({ ...formData, decisionTime: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">决策结果</label>
              <select
                value={formData.decisionResult || ''}
                onChange={(e) => setFormData({ ...formData, decisionResult: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
          {/* 标前决策会议决议上传 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">标前决策会议决议</span>
                <span className="text-xs px-1 py-0.5 bg-blue-50 text-blue-600 rounded">集团</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('标前决策会议决议'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['标前决策会议决议'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['标前决策会议决议'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
          {/* 模式会会议纪要 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">模式会会议纪要</span>
                <span className="text-xs px-1 py-0.5 bg-orange-50 text-orange-600 rounded">省内</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('模式会会议纪要'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['模式会会议纪要'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['模式会会议纪要'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
          {/* 总经理办公会纪要 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">总经理办公会纪要</span>
                <span className="text-xs px-1 py-0.5 bg-orange-50 text-orange-600 rounded">省内</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('总经理办公会纪要'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['总经理办公会纪要'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['总经理办公会纪要'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
        </div>
        <div className="p-4 border-t bg-white">
          <Button className="w-full" size="sm" onClick={() => {
            onNodeComplete('4-1-1');
          }}>保存</Button>
        </div>
      </div>
    );
  }

  // ===== 业务解构 =====
  if (categoryId === '4-2') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900">{categoryName}</span>
          <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">集团六到位要求</span>
          <span className="text-xs px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded">省内六到位要求</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="bg-white rounded-lg p-4 space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">业务解构完成 <span className="text-red-500">*</span></label>
              <select
                value={formData.deconstructComplete || ''}
                onChange={(e) => setFormData({ ...formData, deconstructComplete: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, deconstructResult: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                rows={3}
              />
            </div>
          </div>
          {/* 采购需求表 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">采购需求表</span>
                <span className="text-xs px-1 py-0.5 bg-blue-50 text-blue-600 rounded">集团</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('采购需求表'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['采购需求表'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['采购需求表'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
          {/* 采购方案 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">采购方案</span>
                <span className="text-xs px-1 py-0.5 bg-blue-50 text-blue-600 rounded">集团</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('采购方案'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['采购方案'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['采购方案'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
          {/* 采购结果 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">采购结果</span>
                <span className="text-xs px-1 py-0.5 bg-blue-50 text-blue-600 rounded">集团</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('采购结果'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['采购结果'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['采购结果'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
        </div>
        <div className="p-4 border-t bg-white">
          <Button className="w-full" size="sm" onClick={() => {
            if (formData.deconstructComplete) {
              onNodeComplete('4-2-1');
            }
          }}>保存</Button>
        </div>
      </div>
    );
  }

  // ===== 后向资料 =====
  if (categoryId === '4-4') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900">{categoryName}</span>
          <span className="text-xs px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded">省内六到位要求</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* 后向招标文件 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">后向招标文件</span>
                <span className="text-xs px-1 py-0.5 bg-orange-50 text-orange-600 rounded">省内</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('后向招标文件'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['后向招标文件'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['后向招标文件'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
          {/* 后向列表 */}
          <div className="bg-white rounded-lg p-4">
            <div className="text-xs font-medium text-gray-700 mb-3">后向列表</div>
            {mockBackwardList.map((item) => (
              <div key={item.id} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">合作伙伴名称</span>
                  <span className="text-gray-900">{item.partnerName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">后向类型</span>
                  <span className="text-gray-900">{item.backwardType}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">后向名称</span>
                  <span className="text-gray-900">{item.backwardName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">后向编码</span>
                  <span className="text-gray-900">{item.backwardCode}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">金额</span>
                  <span className="text-orange-600">{item.amount}</span>
                </div>
              </div>
            ))}
          </div>
          {/* 后向厂家相关合同 */}
          <div className="bg-white rounded-lg p-4">
            <div className="text-xs font-medium text-gray-700 mb-3">后向厂家相关合同</div>
            {mockBackwardContracts.map((item) => (
              <div key={item.id} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">合作伙伴</span>
                  <span className="text-gray-900">{item.partner}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">合同名称</span>
                  <span className="text-gray-900">{item.contractName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">合同金额</span>
                  <span className="text-orange-600">{item.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===== 变更记录 =====
  if (categoryId === '5-2') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900">{categoryName}</span>
          <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">集团六到位要求</span>
          <span className="text-xs px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded">省内六到位要求</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="bg-white rounded-lg p-4 space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">变更内容 <span className="text-red-500">*</span></label>
              <textarea
                placeholder="请输入变更内容"
                value={formData.changeContent || ''}
                onChange={(e) => setFormData({ ...formData, changeContent: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">变更原因</label>
              <textarea
                placeholder="请输入变更原因"
                value={formData.changeReason || ''}
                onChange={(e) => setFormData({ ...formData, changeReason: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                rows={2}
              />
            </div>
          </div>
          {/* 变更审核上传 */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">变更审核记录</span>
                <span className="text-xs px-1 py-0.5 bg-blue-50 text-blue-600 rounded">集团</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setUploadField('变更审核记录'); setUploadOpen(true); }}>
                <Plus className="w-3 h-3" /> 上传
              </Button>
            </div>
            {(allFiles['变更审核记录'] || []).length > 0 ? (
              <div className="space-y-1">
                {(allFiles['变更审核记录'] || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate flex-1">{f.name}</span>
                    {f.synced ? <span className="text-xs text-green-500">已同步</span> : <span className="text-xs text-yellow-500">未同步</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-gray-400">暂未上传</p>}
          </div>
        </div>
        <div className="p-4 border-t bg-white">
          <Button className="w-full" size="sm" onClick={() => {
            if (formData.changeContent) {
              onNodeComplete('5-2-1');
            }
          }}>保存</Button>
        </div>
      </div>
    );
  }

  // ===== 数字资产平台 =====
  if (categoryId === '6-1') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-3">
          <span className="font-medium text-gray-900">{categoryName}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="bg-white rounded-lg p-4 space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">商机是否建档 <span className="text-red-500">*</span></label>
              <select
                value={formData.assetArchive || ''}
                onChange={(e) => setFormData({ ...formData, assetArchive: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, archiveTime: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
        <div className="p-4 border-t bg-white">
          <Button className="w-full" size="sm" onClick={() => {
            if (formData.assetArchive) {
              onNodeComplete('6-1-1');
            }
          }}>保存</Button>
        </div>
      </div>
    );
  }

  // ===== 第一服务界面 =====
  if (categoryId === '6-2') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-3">
          <span className="font-medium text-gray-900">{categoryName}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="bg-white rounded-lg p-4 space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">服务界面类型 <span className="text-red-500">*</span></label>
              <select
                value={formData.serviceDeskType || ''}
                onChange={(e) => setFormData({ ...formData, serviceDeskType: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, serviceDeskRecord: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>
        <div className="p-4 border-t bg-white">
          <Button className="w-full" size="sm" onClick={() => {
            if (formData.serviceDeskType) {
              onNodeComplete('6-2-1');
            }
          }}>保存</Button>
        </div>
      </div>
    );
  }

  // ===== 通用上传面板（用于其他、上传类节点）=====
  const config = secondLevelConfig[categoryId];
  if (config?.contentType === 'upload' && config.uploadFields) {
    // 判断录入入口
    const syncTypes = config.uploadFields.map((f) => secondLevelConfig[categoryId]?.syncType || '');
    const hasGroup = syncTypes.some((t) => t.includes('具备下发') || t.includes('结构化内容具备下发') || t.includes('具备两级') || t.includes('具备上送'));
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900">{categoryName}</span>
          {hasGroup && <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">集团六到位要求</span>}
          {(!hasGroup || syncTypes.some((t) => t.includes('仅省内展示'))) && <span className="text-xs px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded">省内六到位要求</span>}
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {config.uploadFields.map((field) => {
            const files = allFiles[field] || [];
            return (
              <div key={field} className="bg-white rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">{field}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => {
                      setUploadField(field);
                      setUploadOpen(true);
                    }}
                  >
                    <Plus className="w-3 h-3" /> 上传
                  </Button>
                </div>
                {files.length > 0 && (
                  <div className="space-y-1.5">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                        <span className="text-xs text-gray-700 truncate flex-1">{file.name}</span>
                        {file.synced ? (
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        ) : (
                          <span className="text-xs text-yellow-600 flex-shrink-0">未同步</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {files.length === 0 && (
                  <p className="text-xs text-gray-400">暂未上传文件</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ===== 默认面板 =====
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b flex items-center gap-3">
        <span className="font-medium text-gray-900">{categoryName}</span>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-sm text-gray-400">该节点暂无详细内容</p>
      </div>
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        title={uploadField}
        files={allFiles[uploadField] || []}
        onFilesChange={(files) => onFilesChange(uploadField, files)}
      />
    </div>
  );
}

// ===== 主组件 =====

export function SixStandardDetail() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [expandedModules, setExpandedModules] = useState<string[]>(['module1']);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState<{ name: string; rule: string; completed?: boolean } | null>(null);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadField, setUploadField] = useState('');

  const [allFiles, setAllFiles] = useState<Record<string, UploadedFile[]>>({});

  const [nodeCompleted, setNodeCompleted] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    allNodes.forEach((n) => { initial[n.id] = n.completed; });
    return initial;
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleShowRule = (name: string, rule: string, completed?: boolean, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedRule({ name, rule, completed });
    setShowRuleDialog(true);
  };

  const handleNodeComplete = (nodeId: string) => {
    setNodeCompleted((prev) => ({ ...prev, [nodeId]: true }));
  };

  const getCategoryNodes = (categoryId: string) => {
    return allNodes.filter((n) => n.categoryId === categoryId);
  };

  const getCategoryProgress = (categoryId: string) => {
    const nodes = getCategoryNodes(categoryId);
    if (nodes.length === 0) return { completed: 0, total: 0 };
    const completed = nodes.filter((n) => nodeCompleted[n.id]).length;
    return { completed, total: nodes.length };
  };

  const completedCount = Object.values(nodeCompleted).filter(Boolean).length;
  const totalCount = allNodes.length;

  const activeCategoryName = activeCategoryId
    ? modules.flatMap((m) => m.categories).find((c) => c.id === activeCategoryId)?.name || ''
    : '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/tasks')} className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium text-gray-900 flex-1">六到位详情</h1>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="bg-white mx-4 mt-4 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700">完成进度</span>
          <span className="text-blue-600 font-medium">{completedCount}/{totalCount}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          已点亮 {completedCount} 个节点，还需点亮 {totalCount - completedCount} 个节点
        </div>
      </div>

      {/* Modules List */}
      <div className="p-4 space-y-3">
        {modules.map((module) => {
          const isExpanded = expandedModules.includes(module.id);
          const moduleNodes = allNodes.filter((n) => n.moduleId === module.id);
          const moduleCompletedCount = moduleNodes.filter((n) => nodeCompleted[n.id]).length;
          const moduleTotalCount = moduleNodes.length;
          const moduleProgress = (moduleCompletedCount / moduleTotalCount) * 100;

          return (
            <div key={module.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Module Header */}
              <div
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${moduleProgress === 100 ? 'bg-green-500' : 'bg-orange-500'}`} />
                  <span className="text-gray-900 font-medium">{module.name}</span>
                  <span className="text-xs text-gray-500">{moduleCompletedCount}/{moduleTotalCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  {module.rule && (
                    <button onClick={(e) => handleShowRule(module.name, module.rule, undefined, e)} className="p-1 hover:bg-gray-100 rounded">
                      <Info className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Categories */}
              {isExpanded && (
                <div className="border-t">
                  {module.categories.map((category) => {
                    const progress = getCategoryProgress(category.id);
                    const progressPercent = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
                    const config = secondLevelConfig[category.id];

                    return (
                      <div
                        key={category.id}
                        className="border-b last:border-b-0 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setActiveCategoryId(category.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${progressPercent === 100 ? 'bg-green-500' : progressPercent > 0 ? 'bg-orange-500' : 'bg-gray-300'}`} />
                            <span className="text-sm text-gray-700 truncate">{category.name}</span>
                            <span className="text-xs text-gray-400 flex-shrink-0">{progress.completed}/{progress.total}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {config?.rule && (
                              <button onClick={(e) => handleShowRule(category.name, config.rule!, progressPercent === 100, e)} className="p-1 hover:bg-gray-200 rounded">
                                <Info className="w-3.5 h-3.5 text-gray-400" />
                              </button>
                            )}
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rule Dialog */}
      <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-base">点亮规则</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">节点名称：</span>
              <span className="text-sm text-gray-900 ml-2">{selectedRule?.name}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">当前状态：</span>
              <span className={`text-sm ml-2 ${selectedRule?.completed ? 'text-green-600' : 'text-red-600'}`}>
                {selectedRule?.completed ? '已点亮' : '未点亮'}
              </span>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-700">{selectedRule?.rule}</div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowRuleDialog(false)}>知道</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Panel - 底部滑出 */}
      <Sheet open={!!activeCategoryId} onOpenChange={(open) => !open && setActiveCategoryId(null)}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0">
          <ContentPanel
            categoryId={activeCategoryId || ''}
            categoryName={activeCategoryName}
            onClose={() => setActiveCategoryId(null)}
            allFiles={allFiles}
            onFilesChange={(field, files) => {
              setAllFiles((prev) => ({ ...prev, [field]: files }));
              if (files.length > 0) {
                // 找到该字段对应的节点并标记完成
                const nodeMap: Record<string, string> = {
                  '客情掌握其它附件': '1-5-1',
                  '方案总控其它附件': '2-4-1',
                  '谈判应标其它附件': '3-5-1',
                  '采购自主其它附件': '4-5-1',
                  '项目强管控其它附件': '5-6-1',
                  '运维自主其它附件': '6-4-1',
                  '总体实施方案文档': '5-1-1',
                  '监理报告': '5-1-2',
                  '监理日志': '5-1-3',
                  '初验报告': '5-3-1',
                  '终验报告': '5-3-2',
                  '进度表': '5-3-3',
                  '试运行报告': '5-3-4',
                  '会议纪要': '5-4-1',
                  '项目周报/月报': '5-4-2',
                  '延期说明': '5-4-3',
                  '竣工报告': '5-4-4',
                  '问题纪要': '5-4-5',
                  '起租相关附件': '5-4-6',
                  '软硬件设备或服务清单': '5-4-7',
                  '项目交付报告': '5-4-8',
                  '项目交维报告': '5-4-9',
                  '项目试运行报告': '5-4-10',
                  '后向厂家任务计划': '5-4-11',
                  '后向厂家团队清单': '5-4-12',
                  '项目送审承诺函-建设方': '5-5-1',
                  '送审项目基本信息表': '5-5-2',
                  '前向审计报告/前向结算审定书': '5-5-3',
                  '项目送审承诺函-施工方': '5-5-4',
                  '后向结算送审清单': '5-5-5',
                  '服务器资源': '6-3-1',
                  '运维群': '6-3-2',
                  '培训记录': '6-3-3',
                  '培训照片': '6-3-4',
                  '需求规格说明书': '6-3-5',
                  '概要设计说明书': '6-3-6',
                  '详细设计说明书': '6-3-7',
                  '数据库设计说明书': '6-3-8',
                };
                const nodeId = nodeMap[field];
                if (nodeId) handleNodeComplete(nodeId);
              }
            }}
            nodeCompleted={nodeCompleted}
            onNodeComplete={handleNodeComplete}
            uploadOpen={uploadOpen}
            setUploadOpen={setUploadOpen}
            uploadField={uploadField}
            setUploadField={setUploadField}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
