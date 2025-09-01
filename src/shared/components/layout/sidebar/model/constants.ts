// import DesktopIcon from '../../../../assets/icons/desktop.svg?react'
import BookingIcon from '../../../../assets/icons/booking.svg?react'
import ActivitiesIcon from '../../../../assets/icons/activities.svg?react'
import CourtIcon from '../../../../assets/icons/courts.svg?react'
import ChatIcon from '../../../../assets/icons/chat.svg?react'
import PricingIcon from '../../../../assets/icons/pricing.svg?react'
import PaymentIcon from '../../../../assets/icons/payments.svg?react'
import ReportIcon from '../../../../assets/icons/reports.svg?react'
import CustomersIcon from '../../../../assets/icons/customers.svg?react'
import WalletIcon from '../../../../assets/icons/wallets.svg?react'
import SettingIcon from '../../../../assets/icons/settings_general.svg?react'
import LogoutIcon from '../../../../assets/icons/logout.svg?react'




import type { Club, SidebarSection } from './types'

export const MOCK_CLUBS: Club[] = [
  {
    id: '1',
    name: 'Club 1',
    isActive: true,
  },
  {
    id: '2',
    name: 'Club 2',
    isActive: false,
  },
  {
    id: '3',
    name: 'Club 3',
    isActive: false,
  },
]

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    id: 'main',
    title: 'sidebar.main',
    items: [
      {
        id: 'reports',
        text: 'sidebar.reports',
        icon: ReportIcon,
      },
      {
        id: 'activities',
        text: 'sidebar.activities',
        icon: ActivitiesIcon,
        // link: '/patients', //change
      },
      {
        id: 'courts',
        text: 'sidebar.courts',
        icon: CourtIcon,
        link: '/courts', 
      },
      {
        id: 'pricing',
        text: 'sidebar.pricing',
        icon: PricingIcon,
        // link: '/patients', //change
      },
      {
        id: 'booking',
        text: 'sidebar.booking',
        icon: BookingIcon,
        // link: '/booking',
      },
      {
        id: 'customers',
        text: 'sidebar.customers',
        icon: CustomersIcon,
        // link: '/customers', //change
      },

      {
        id: 'chat',
        text: 'sidebar.chats',
        icon: ChatIcon,
        // link: '/chat', 
      },
      {
        id: 'wallets',
        text: 'sidebar.wallet-transactions',
        icon: WalletIcon,
        // link: '/patients', //change
      },
      {
        id: 'payment',
        text: 'sidebar.payments',
        icon: PaymentIcon,
        // link: '/patients', //change
      },
      {
        id: 'settings',
        text: 'sidebar.settings',
        icon: SettingIcon,
        link: '/settings', 
      },
      {
        id: 'logout',
        text: 'sidebar.logout',
        icon: LogoutIcon,
        isAction:true
      },
    ],
  },
]

export const USER_PROFILE = {
  settingsLink: '/settings',
}
