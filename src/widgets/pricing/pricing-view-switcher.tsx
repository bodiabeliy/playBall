import { Tab, Tabs} from '@mui/material'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
interface PricingViewSwitcherProps {
  activeTab: number
  onTabChange: (newValue: number) => void
}

export function PricingViewSwitcher({ activeTab, onTabChange }: PricingViewSwitcherProps) {
  return (
    <Tabs
      value={activeTab}
      onChange={(_, newValue) => {
        onTabChange(newValue)
      }}
      orientation={'horizontal'}
      sx={{
        borderRadius: '10px',
        border: '1px solid #DFDFDF',
        fontWeight: 500,
        minHeight: '30px',
        '& .MuiTabs-flexContainer': {
          flexDirection:'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        },
        '& .MuiTabs-indicator': {
          display: 'none',
        },
      }}>
        <Tab
          key={"calandarView"}
          sx={{
            minHeight: '32px',
            height: '30px',
            color: '#DFDFDF',
            background: 'transparent',
            transition: 'background 0.2s',
            '&.Mui-selected': {
              color: '#fff',
              background: '#034C53',
              borderRadius: '10px',
            },
          }}
          icon={<CalendarTodayIcon sx={{scale:0.75}} />}
        />
        <Tab
          key={"tableView"}
          sx={{
            p:0,
            minHeight: '32px',
            height: '30px',
            color: '#DFDFDF',
            background: 'transparent',
            transition: 'background 0.2s',
            '&.Mui-selected': {
              color: '#fff',
              background: '#034C53',
              borderRadius: '10px',
            },
          }}
          icon={<FormatListBulletedIcon  sx={{scale:0.75}} />}
        />
      
    </Tabs>
  )
}
