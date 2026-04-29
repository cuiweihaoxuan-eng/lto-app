import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import notificationImage from 'figma:asset/303f0bbcff00ae087df0c3b55151472c7a91f651.png';

interface NotificationItem {
  id: string;
  opportunityName: string;
  opportunityCode: string;
  initiateTime: string;
  todoTask: string;
  reminder: string;
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    opportunityName: '智安单位监控项目服务',
    opportunityCode: 'ZJ20251216624155',
    initiateTime: '2025-12-19',
    todoTask: '专家走访调用',
    reminder: '张三邀请您参与商机走访，是否接单？',
  },
  {
    id: '2',
    opportunityName: '企业网络升级改造',
    opportunityCode: 'ZJ20251216624156',
    initiateTime: '2025-12-18',
    todoTask: '商情派单',
    reminder: '你有一个商情派单待处理，请前去绑定。',
  },
  {
    id: '3',
    opportunityName: '云服务解决方案',
    opportunityCode: 'ZJ20251216624157',
    initiateTime: '2025-12-17',
    todoTask: '专家走访调用',
    reminder: '李四邀请您参与商机走访，是否接单？',
  },
  {
    id: '4',
    opportunityName: '安防系统集成项目',
    opportunityCode: 'ZJ20251216624158',
    initiateTime: '2025-12-16',
    todoTask: '商情派单',
    reminder: '你有一个商情派单待处理，请前去绑定。',
  },
];

export function NotificationList() {
  const navigate = useNavigate();

  const handleViewDetail = (item: NotificationItem) => {
    console.log('View detail for notification:', item.id);
    
    // 根据待办事项类型跳转到不同页面
    if (item.todoTask === '专家走访调用') {
      navigate('/expert-dispatch');
    } else if (item.todoTask === '商情派单') {
      navigate('/business-info');
    } else {
      // 其他类型默认跳转到专家派单列表
      navigate('/expert-dispatch');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium text-gray-900 flex-1">工作通知·浙江电信</h1>
          <span className="text-sm text-gray-500">99+</span>
        </div>
      </div>

      {/* Notification List */}
      <div className="p-4 space-y-4">
        {mockNotifications.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Image Section */}
            <div className="flex items-center justify-center bg-gray-100 p-8">
              <img
                src={notificationImage}
                alt="通知图标"
                className="w-48 h-48 object-contain"
              />
            </div>

            {/* Info Section */}
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <span className="text-sm text-gray-600">商机名称：</span>
                <span className="text-sm text-gray-900 flex-1 text-right">
                  {item.opportunityName}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-sm text-gray-600">商机编码：</span>
                <span className="text-sm text-gray-900 flex-1 text-right">
                  {item.opportunityCode}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-sm text-gray-600">发起时间：</span>
                <span className="text-sm text-gray-900 flex-1 text-right">
                  {item.initiateTime}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-sm text-gray-600">待办事项：</span>
                <span className="text-sm text-gray-900 flex-1 text-right">
                  {item.todoTask}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-sm text-gray-600">提醒事项：</span>
                <span className="text-sm text-red-500 flex-1 text-right">
                  {item.reminder}
                </span>
              </div>

              {/* View Detail Button */}
              <button
                onClick={() => handleViewDetail(item)}
                className="w-full flex items-center justify-between px-4 py-3 mt-4 border-t hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-700">查看详情</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}