import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import Tooth11 from '../../assets/icons/teeth/11.svg?react'
import Tooth12 from '../../assets/icons/teeth/12.svg?react'
import Tooth13 from '../../assets/icons/teeth/13.svg?react'
import Tooth14 from '../../assets/icons/teeth/14.svg?react'
import Tooth15 from '../../assets/icons/teeth/15.svg?react'
import Tooth16 from '../../assets/icons/teeth/16.svg?react'
import Tooth17 from '../../assets/icons/teeth/17.svg?react'
import Tooth18 from '../../assets/icons/teeth/18.svg?react'
import Tooth21 from '../../assets/icons/teeth/21.svg?react'
import Tooth22 from '../../assets/icons/teeth/22.svg?react'
import Tooth23 from '../../assets/icons/teeth/23.svg?react'
import Tooth24 from '../../assets/icons/teeth/24.svg?react'
import Tooth25 from '../../assets/icons/teeth/25.svg?react'
import Tooth26 from '../../assets/icons/teeth/26.svg?react'
import Tooth27 from '../../assets/icons/teeth/27.svg?react'
import Tooth28 from '../../assets/icons/teeth/28.svg?react'

import Tooth31 from '../../assets/icons/teeth/31.svg?react'
import Tooth32 from '../../assets/icons/teeth/32.svg?react'
import Tooth33 from '../../assets/icons/teeth/33.svg?react'
import Tooth34 from '../../assets/icons/teeth/34.svg?react'
import Tooth35 from '../../assets/icons/teeth/35.svg?react'
import Tooth36 from '../../assets/icons/teeth/36.svg?react'
import Tooth37 from '../../assets/icons/teeth/37.svg?react'
import Tooth38 from '../../assets/icons/teeth/38.svg?react'
import Tooth41 from '../../assets/icons/teeth/41.svg?react'
import Tooth42 from '../../assets/icons/teeth/42.svg?react'
import Tooth43 from '../../assets/icons/teeth/43.svg?react'
import Tooth44 from '../../assets/icons/teeth/44.svg?react'
import Tooth45 from '../../assets/icons/teeth/45.svg?react'
import Tooth46 from '../../assets/icons/teeth/46.svg?react'
import Tooth47 from '../../assets/icons/teeth/47.svg?react'
import Tooth48 from '../../assets/icons/teeth/48.svg?react'

import Tooth51 from '../../assets/icons/teeth/51.svg?react'
import Tooth52 from '../../assets/icons/teeth/52.svg?react'
import Tooth53 from '../../assets/icons/teeth/53.svg?react'
import Tooth54 from '../../assets/icons/teeth/54.svg?react'
import Tooth55 from '../../assets/icons/teeth/55.svg?react'

import Tooth61 from '../../assets/icons/teeth/61.svg?react'
import Tooth62 from '../../assets/icons/teeth/62.svg?react'
import Tooth63 from '../../assets/icons/teeth/63.svg?react'
import Tooth64 from '../../assets/icons/teeth/64.svg?react'
import Tooth65 from '../../assets/icons/teeth/65.svg?react'

import Tooth71 from '../../assets/icons/teeth/71.svg?react'
import Tooth72 from '../../assets/icons/teeth/72.svg?react'
import Tooth73 from '../../assets/icons/teeth/73.svg?react'
import Tooth74 from '../../assets/icons/teeth/74.svg?react'
import Tooth75 from '../../assets/icons/teeth/75.svg?react'

import Tooth81 from '../../assets/icons/teeth/81.svg?react'
import Tooth82 from '../../assets/icons/teeth/82.svg?react'
import Tooth83 from '../../assets/icons/teeth/83.svg?react'
import Tooth84 from '../../assets/icons/teeth/84.svg?react'
import Tooth85 from '../../assets/icons/teeth/85.svg?react'

import UpperJawAdult from '../../assets/icons/teeth/upper-jaw.svg?react'
import LowerJawAdult from '../../assets/icons/teeth/lower-jaw.svg?react'

import UpperJawKid from '../../assets/icons/teeth/upper-jaw-kid.svg?react'
import LowerJawKid from '../../assets/icons/teeth/lower-jaw-kid.svg?react'

import FirstQuadrant from '../../assets/icons/teeth/quadrant-1.svg?react'
import SecondQuadrant from '../../assets/icons/teeth/quadrant-2.svg?react'
import ThirdQuadrant from '../../assets/icons/teeth/quadrant-3.svg?react'
import FourthQuadrant from '../../assets/icons/teeth/quadrant-4.svg?react'

import FirstSegment from '../../assets/icons/teeth/segment-1.svg?react'
import SecondSegment from '../../assets/icons/teeth/segment-2.svg?react'
import ThirdSegment from '../../assets/icons/teeth/segment-3.svg?react'
import FourthSegment from '../../assets/icons/teeth/segment-4.svg?react'
import FifthSegment from '../../assets/icons/teeth/segment-5.svg?react'
import SixthSegment from '../../assets/icons/teeth/segment-6.svg?react'

const topAdult = [
  { label: '18', icon: Tooth18 },
  { label: '17', icon: Tooth17 },
  { label: '16', icon: Tooth16 },
  { label: '15', icon: Tooth15 },
  { label: '14', icon: Tooth14 },
  { label: '13', icon: Tooth13 },
  { label: '12', icon: Tooth12 },
  { label: '11', icon: Tooth11 },
  { label: '21', icon: Tooth21 },
  { label: '22', icon: Tooth22 },
  { label: '23', icon: Tooth23 },
  { label: '24', icon: Tooth24 },
  { label: '25', icon: Tooth25 },
  { label: '26', icon: Tooth26 },
  { label: '27', icon: Tooth27 },
  { label: '28', icon: Tooth28 },
]

const bottomAdult = [
  { label: '48', icon: Tooth48 },
  { label: '47', icon: Tooth47 },
  { label: '46', icon: Tooth46 },
  { label: '45', icon: Tooth45 },
  { label: '44', icon: Tooth44 },
  { label: '43', icon: Tooth43 },
  { label: '42', icon: Tooth42 },
  { label: '41', icon: Tooth41 },
  { label: '31', icon: Tooth31 },
  { label: '32', icon: Tooth32 },
  { label: '33', icon: Tooth33 },
  { label: '34', icon: Tooth34 },
  { label: '35', icon: Tooth35 },
  { label: '36', icon: Tooth36 },
  { label: '37', icon: Tooth37 },
  { label: '38', icon: Tooth38 },
]

const topKid = [
  { label: '55', icon: Tooth55 },
  { label: '54', icon: Tooth54 },
  { label: '53', icon: Tooth53 },
  { label: '52', icon: Tooth52 },
  { label: '51', icon: Tooth51 },
  { label: '61', icon: Tooth61 },
  { label: '62', icon: Tooth62 },
  { label: '63', icon: Tooth63 },
  { label: '64', icon: Tooth64 },
  { label: '65', icon: Tooth65 },
]

const bottomKid = [
  { label: '81', icon: Tooth81 },
  { label: '82', icon: Tooth82 },
  { label: '83', icon: Tooth83 },
  { label: '84', icon: Tooth84 },
  { label: '85', icon: Tooth85 },
  { label: '71', icon: Tooth71 },
  { label: '72', icon: Tooth72 },
  { label: '73', icon: Tooth73 },
  { label: '74', icon: Tooth74 },
  { label: '75', icon: Tooth75 },
]

export type TeethChartType =
  | 'tooth'
  | 'quadrant'
  | 'segment'
  | 'all'
  | 'without-formula'
  | 'jaw'
  | 'baby-tooth'
  | 'baby-jaw'
  | 'all-baby-teeth'

const Teeth = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  return (
    <>
      <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1, borderBottom: '2px solid #eee', paddingBottom: 1 }}>
        {topAdult.map((T, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 0.5,
            }}>
            <T.icon style={{ width: isMobile ? 20 : 33, height: isMobile ? 20 : 33 }} />
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: 12,
                lineHeight: '100%',
                letterSpacing: '0.01em',
                color: 'rgba(21, 22, 24, 0.6)',
              }}>
              {T.label}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1 }}>
        {bottomAdult.map((T, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 0.5,
              paddingTop: 1,
            }}>
            <T.icon style={{ width: isMobile ? 20 : 33, height: isMobile ? 20 : 33 }} />
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: 12,
                lineHeight: '100%',
                letterSpacing: '0.01em',
                color: 'rgba(21, 22, 24, 0.6)',
              }}>
              {T.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  )
}

const KidsTeeth = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  return (
    <>
      <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1, borderBottom: '2px solid #eee', paddingBottom: 1 }}>
        {topKid.map((T, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 0.5,
            }}>
            <T.icon style={{ width: isMobile ? 20 : 33, height: isMobile ? 20 : 33 }} />
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: 12,
                lineHeight: '100%',
                letterSpacing: '0.01em',
                color: 'rgba(21, 22, 24, 0.6)',
              }}>
              {T.label}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1 }}>
        {bottomKid.map((T, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 0.5,
              paddingTop: 1,
            }}>
            <T.icon style={{ width: isMobile ? 20 : 33, height: isMobile ? 20 : 33 }} />
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: 12,
                lineHeight: '100%',
                letterSpacing: '0.01em',
                color: 'rgba(21, 22, 24, 0.6)',
              }}>
              {T.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  )
}

const KidsJaw = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  return (
    <>
      <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1, borderBottom: '2px solid #eee', paddingBottom: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
          }}>
          <UpperJawKid style={{}} />
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '100%',
              letterSpacing: '0.01em',
              color: 'rgba(21, 22, 24, 0.6)',
            }}>
            Верхня щелепа
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
            paddingTop: 1,
          }}>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '100%',
              letterSpacing: '0.01em',
              color: 'rgba(21, 22, 24, 0.6)',
            }}>
            Нижня щелепа
          </Typography>
          <LowerJawKid style={{}} />
        </Box>
      </Box>
    </>
  )
}

const KidAllTeeth = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  return (
    <>
      <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1, borderBottom: '2px solid #eee', paddingBottom: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
          }}>
          <UpperJawKid style={{}} />
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '100%',
              letterSpacing: '0.01em',
              color: 'rgba(21, 22, 24, 0.6)',
            }}>
            Всі
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
            paddingTop: 1,
          }}>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '100%',
              letterSpacing: '0.01em',
              color: 'rgba(21, 22, 24, 0.6)',
            }}>
            Зуби
          </Typography>
          <LowerJawKid style={{}} />
        </Box>
      </Box>
    </>
  )
}

const Jaw = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  return (
    <>
      <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1, borderBottom: '2px solid #eee', paddingBottom: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
          }}>
          <UpperJawAdult style={{}} />
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '100%',
              letterSpacing: '0.01em',
              color: 'rgba(21, 22, 24, 0.6)',
            }}>
            Верхня щелепа
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
            paddingTop: 1,
          }}>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '100%',
              letterSpacing: '0.01em',
              color: 'rgba(21, 22, 24, 0.6)',
            }}>
            Нижня щелепа
          </Typography>
          <LowerJawAdult style={{}} />
        </Box>
      </Box>
    </>
  )
}

const Quadrant = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  return (
    <>
      <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1, borderBottom: '2px solid #eee', paddingBottom: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
          }}>
          <FirstQuadrant style={{}} />
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '100%',
              letterSpacing: '0.01em',
              color: 'rgba(21, 22, 24, 0.6)',
            }}>
            I Квадрант
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
          }}>
          <SecondQuadrant style={{}} />
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '100%',
              letterSpacing: '0.01em',
              color: 'rgba(21, 22, 24, 0.6)',
            }}>
            II Квадрант
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
            paddingTop: 1,
          }}>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '100%',
              letterSpacing: '0.01em',
              color: 'rgba(21, 22, 24, 0.6)',
            }}>
            IV Квадрант
          </Typography>
          <FourthQuadrant style={{}} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
            paddingTop: 1,
          }}>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '100%',
              letterSpacing: '0.01em',
              color: 'rgba(21, 22, 24, 0.6)',
            }}>
            III Квадрант
          </Typography>
          <ThirdQuadrant style={{}} />
        </Box>
      </Box>
    </>
  )
}

const Segment = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  return (
    <>
      <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1, borderBottom: '2px solid #eee', paddingBottom: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
          }}>
          <FirstSegment style={{}} />
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '100%',
              letterSpacing: '0.01em',
              color: 'rgba(21, 22, 24, 0.6)',
            }}>
            1 Сегмент
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
          }}>
          <SecondSegment style={{}} />
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '100%',
              letterSpacing: '0.01em',
              color: 'rgba(21, 22, 24, 0.6)',
            }}>
            2 Сегмент
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
          }}>
          <ThirdSegment style={{}} />
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '100%',
              letterSpacing: '0.01em',
              color: 'rgba(21, 22, 24, 0.6)',
            }}>
            3 Сегмент
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
            paddingTop: 1,
          }}>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '100%',
              letterSpacing: '0.01em',
              color: 'rgba(21, 22, 24, 0.6)',
            }}>
            6 Сегмент
          </Typography>
          <SixthSegment style={{}} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
            paddingTop: 1,
          }}>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '100%',
              letterSpacing: '0.01em',
              color: 'rgba(21, 22, 24, 0.6)',
            }}>
            5 Сегмент
          </Typography>
          <FifthSegment style={{}} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
            paddingTop: 1,
          }}>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '100%',
              letterSpacing: '0.01em',
              color: 'rgba(21, 22, 24, 0.6)',
            }}>
            4 Сегмент
          </Typography>
          <FourthSegment style={{}} />
        </Box>
      </Box>
    </>
  )
}

const AllTeeth = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  return (
    <>
      <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1, borderBottom: '2px solid #eee', paddingBottom: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
          }}>
          <UpperJawAdult style={{}} />
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '100%',
              letterSpacing: '0.01em',
              color: 'rgba(21, 22, 24, 0.6)',
            }}>
            Всі
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
            paddingTop: 1,
          }}>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '100%',
              letterSpacing: '0.01em',
              color: 'rgba(21, 22, 24, 0.6)',
            }}>
            Зуби
          </Typography>
          <LowerJawAdult style={{}} />
        </Box>
      </Box>
    </>
  )
}

export function TeethChart({ type }: { type: TeethChartType }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

  const renderTeeth = () => {
    switch (type) {
      case 'tooth':
        return <Teeth />
      case 'quadrant':
        return <Quadrant />
      case 'segment':
        return <Segment />
      case 'all':
        return <AllTeeth />
      case 'without-formula':
        return <Teeth />
      case 'jaw':
        return <Jaw />
      case 'baby-tooth':
        return <KidsTeeth />
      case 'baby-jaw':
        return <KidsJaw />
      case 'all-baby-teeth':
        return <KidAllTeeth />
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, px: isMobile ? 2 : 4 }}>
      {renderTeeth()}
    </Box>
  )
}
