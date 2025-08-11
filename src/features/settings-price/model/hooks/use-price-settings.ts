import { useState } from 'react'
import type { PriceAction } from '../types'
import SettingsIcon from '../../../../shared/assets/icons/settings_general.svg?react'
import DocumentIcon from '../../../../shared/assets/icons/document.svg?react'
import ArtIcon from '../../../../shared/assets/icons/art.svg?react'
import DeleteIcon from '@mui/icons-material/Delete'

export function usePriceSettings() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [expanded, setExpanded] = useState<Array<string>>([])
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [openPriceDetailsDialog, setOpenPriceDetailsDialog] = useState(false)
  const [priceDetails, setPriceDetails] = useState<string[]>(['Назва', 'Назва', 'Назва', 'Назва'])
  const [openGeneralPriceDetailsDialog, setOpenGeneralPriceDetailsDialog] = useState(false)
  const [openWorkExampleDialog, setOpenWorkExampleDialog] = useState(false)
  const [openLinkToProductsDialog, setOpenLinkToProductsDialog] = useState(false)

  const handleAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? [...expanded, panel] : expanded.filter((item) => item !== panel))
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const priceActions: PriceAction[] = [
    { label: 'Деталі прайсу', Icon: SettingsIcon, onClick: () => setOpenPriceDetailsDialog(true) },
    { label: 'Приклад роботи', Icon: ArtIcon, onClick: () => setOpenWorkExampleDialog(true) },
    { label: "Прив'язка до товарів", Icon: DocumentIcon, onClick: () => setOpenLinkToProductsDialog(true) },
    { label: 'Видалити', Icon: DeleteIcon },
  ]

  return {
    anchorEl,
    expanded,
    activeTab,
    searchQuery,
    openPriceDetailsDialog,
    priceDetails,
    openGeneralPriceDetailsDialog,
    openWorkExampleDialog,
    openLinkToProductsDialog,
    priceActions,

    setActiveTab,
    setSearchQuery,
    setPriceDetails,
    handleAccordionChange,
    handleMenuOpen,
    handleMenuClose,
    setOpenPriceDetailsDialog,
    setOpenGeneralPriceDetailsDialog,
    setOpenWorkExampleDialog,
    setOpenLinkToProductsDialog,
  }
}
