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
import { RevenueManagementList } from './components/RevenueManagementList';
import { RevenueApplyForm } from './components/RevenueApplyForm';
import { RevenueApplyView } from './components/RevenueApplyView';
import { WalletHome } from './components/WalletHome';
import { NingboWalletHome } from './components/NingboWalletHome';
import { NbValidOppList } from './components/NbValidOppList';
import { NbLargeOppList } from './components/NbLargeOppList';
import { NbProjectList } from './components/NbProjectList';
import { NbHistoryList } from './components/NbHistoryList';
import { NbTeamReview } from './components/NbTeamReview';
import { ValidOpportunityList } from './components/ValidOpportunityList';
import { LargeOpportunityList } from './components/LargeOpportunityList';
import { ProjectCommissionList } from './components/ProjectCommissionList';
import { SignReportList } from './components/SignReportList';

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
    {
      path: '/revenue-management',
      Component: RevenueManagementList,
    },
    {
      path: '/revenue-apply',
      Component: RevenueApplyForm,
    },
    {
      path: '/revenue-view/:id',
      Component: RevenueApplyView,
    },
    // 产数钱包模块
    {
      path: '/wallet',
      Component: WalletHome,
    },
    {
      path: '/wallet/valid-opportunity',
      Component: ValidOpportunityList,
    },
    {
      path: '/wallet/large-opportunity',
      Component: LargeOpportunityList,
    },
    {
      path: '/wallet/project-commission',
      Component: ProjectCommissionList,
    },
    {
      path: '/wallet/sign-report',
      Component: SignReportList,
    },
  // 宁波钱包模块
    {
      path: '/ningbo-wallet',
      Component: NingboWalletHome,
    },
    {
      path: '/ningbo-wallet/valid-opportunity',
      Component: NbValidOppList,
    },
    {
      path: '/ningbo-wallet/large-opportunity',
      Component: NbLargeOppList,
    },
    {
      path: '/ningbo-wallet/project-list',
      Component: NbProjectList,
    },
    {
      path: '/ningbo-wallet/history-list',
      Component: NbHistoryList,
    },
    {
      path: '/ningbo-wallet/team-review/:saleOppId',
      Component: NbTeamReview,
    },
  ],
  {
    basename: '/lto-app',
  }
);
