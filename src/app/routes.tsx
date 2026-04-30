import { createBrowserRouter } from 'react-router';
import { Home } from './components/Home';
import { TaskList } from './components/TaskList';
import { ExpertDispatchList } from './components/ExpertDispatchList';
import { NotificationList } from './components/NotificationList';
import { SixStandardDetail } from './components/SixStandardDetail';
import { SixStandardList } from './components/SixStandardList';
import { SixStandardStatistics } from './components/SixStandardStatistics';
import { VisitRecordList } from './components/VisitRecordList';
import { VisitRecordForm } from './components/VisitRecordForm';
import { BusinessInfoList } from './components/BusinessInfoList';
import { OpportunityList } from './components/OpportunityList';
import { ExpertTaskPool } from './components/ExpertTaskPool';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: Home,
    },
    {
      path: '/tasks',
      Component: TaskList,
    },
    {
      path: '/expert-dispatch',
      Component: ExpertDispatchList,
    },
    {
      path: '/notifications',
      Component: NotificationList,
    },
    {
      path: '/business-info',
      Component: BusinessInfoList,
    },
    {
      path: '/opportunity',
      Component: OpportunityList,
    },
    {
      path: '/six-standard/:taskId',
      Component: SixStandardDetail,
    },
    {
      path: '/six-standard-list',
      Component: SixStandardList,
    },
    {
      path: '/six-standard-statistics',
      Component: SixStandardStatistics,
    },
    {
      path: '/visit-records/:taskId',
      Component: VisitRecordList,
    },
    {
      path: '/visit-records/:taskId/:recordId',
      Component: VisitRecordForm,
    },
    {
      path: '/expert-task-pool',
      Component: ExpertTaskPool,
    },
  ],
  {
    basename: '/lto-app',
  }
);
