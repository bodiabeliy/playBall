import { useState, useMemo } from 'react'
import { Box, useTheme, useMediaQuery, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import { SidebarLayout } from '../../shared'
import { SearchField } from '../../shared/components'
import {
  LeadsTable,
  FilterButton,
  AddLeadButton,
  DeletionModal,
  CreationModal,
  SendMessageModal,
} from '../../features/leads'
import { FilterSection } from '../../features/leads/ui/filter-section/filter-section'
import { SelectionToolbar } from '../../features/leads/ui/selection-toolbar/selection-toolbar'
import type { FilterValues } from '../../features/leads/ui/filter-section/filter-section'
import { LEADS_MOBILE_OPTIONS, mockLeads } from '../../features/leads/model/constants'
import type { Lead, LeadFilter } from '../../features/leads/model/types'
import type { SendMessageData } from '../../features/leads/ui/send-message-modal/send-message-modal'

import MoreVerticalIcon from '../../shared/assets/icons/more-vertical.svg?react'
import ViewSwitcher from '../../features/leads/ui/view-switcher/view-switcher'
import { LeadSelector } from '../../shared/components/ui/dropdown'
import { useTranslation } from 'react-i18next'


export function LeadsPage() {
  const { t } = useTranslation('customers')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false)
  const [isShowKanban, setisShowKanban] = useState(false)

  const [appliedFilters, setAppliedFilters] = useState<FilterValues>({
    lead: '',
    period: '',
    branch: '',
    createdBy: '',
    mainResponsible: '',
    status: '',
    tag: '',
    source: '',
    products: '',
    important: '',
    task: '',
    lastCall: '',
    refusalReason: '',
    brand: '',
    paymentAmount: '',
    utmCampaign: '',
    utmSource: '',
    utmContent: '',
    utmTerm: '',
    ipAddress: '',
    firstCallNumber: '',
  })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState<LeadFilter>(LEADS_MOBILE_OPTIONS[0])

  const [deletionModal, setDeletionModal] = useState<{
    open: boolean
    isSingleItem: boolean
    selectedCount: number
  }>({
    open: false,
    isSingleItem: false,
    selectedCount: 0,
  })

  const [createActionsModal, setCreateActionsModal] = useState(false)

  const [sendMessageModal, setSendMessageModal] = useState<{
    open: boolean
    isSingleItem: boolean
    selectedCount: number
  }>({
    open: false,
    isSingleItem: false,
    selectedCount: 0,
  })

  const handleFilterSelect = (filterOption: LeadFilter) => {
    setSelectedOption(filterOption)
  }

  const activeFiltersCount = useMemo(() => {
    return Object.values(appliedFilters).filter((value) => value !== '').length
  }, [appliedFilters])

  const filteredLeads = useMemo(() => {
    let filtered = mockLeads

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(query) ||
          lead.phoneNumber.includes(query) ||
          lead.comment.toLowerCase().includes(query)
      )
    }

    if (appliedFilters.status) {
      filtered = filtered.filter((lead) => lead.status === appliedFilters.status)
    }

    return filtered
  }, [searchQuery, appliedFilters])

  const paginatedLeads = useMemo(() => {
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return filteredLeads.slice(startIndex, endIndex)
  }, [filteredLeads, page, rowsPerPage])

  const totalRows = filteredLeads.length

  const handleFilterClick = () => {
    setIsFiltersExpanded(!isFiltersExpanded)
  }

  const handleFilterChange = (field: keyof FilterValues, value: string) => {
    setAppliedFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFilterReset = () => {
    setAppliedFilters({
      lead: 'По створенню',
      period: '01.09.24',
      branch: '',
      createdBy: '',
      mainResponsible: '',
      status: '',
      tag: '',
      source: '',
      products: '',
      important: '',
      task: '',
      lastCall: '',
      refusalReason: '',
      brand: '',
      paymentAmount: '',
      utmCampaign: '',
      utmSource: 'FACEBOOK_ADS_VIK',
      utmContent: '',
      utmTerm: '',
      ipAddress: '',
      firstCallNumber: '',
    })
    setPage(0)
  }

  const handleFilterApply = () => {
    setPage(0)
  }

  const handleAddLead = () => {
    setCreateActionsModal(true)
  }

  const handleEditLead = (lead: Lead) => {
    navigate(`/lead/${lead.id}/edit`)
  }

  const handleSendMessage = () => {
    setSendMessageModal({
      open: true,
      isSingleItem: true,
      selectedCount: 1,
    })
  }

  const handleDeleteLead = () => {
    setDeletionModal({
      open: true,
      isSingleItem: true,
      selectedCount: 1,
    })
  }

  const handleSelectAll = () => {
    setSelectedLeads(filteredLeads.map((lead) => lead.id))
  }

  const handleDeleteSelected = () => {
    setDeletionModal({
      open: true,
      isSingleItem: false,
      selectedCount: selectedLeads.length,
    })
  }

  const handleEditSelected = () => {
    setCreateActionsModal(true)
  }

  const handleSendMessageSelected = () => {
    setSendMessageModal({
      open: true,
      isSingleItem: false,
      selectedCount: selectedLeads.length,
    })
  }

  const handleDeletionConfirm = () => {
    console.log('Deletion confirmed for:', deletionModal.isSingleItem ? 'single lead' : `${selectedLeads.length} leads`)
    // TODO: Implement actual deletion logic
  }

  const handleCreateActionsSave = (data: Lead) => {
    console.log('Create actions saved:', data)
  }

  const handleSendMessageConfirm = (data: SendMessageData) => {
    console.log('Message sent:', data)
    // TODO: Implement actual message sending logic
  }

  return (
    <SidebarLayout
      title={isMobile ? ' ' : t('pageTitle')}
      >
      <Box
        sx={{
          p: isMobile ? 2 : 4,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}>
        {/* Top bar: Activities title left, controls right */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
          }}>
          {/* Left: Title */}
          <Typography variant="h6" sx={{ fontWeight: 500 }}>Activities</Typography>
          {/* Right: Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Filter button */}
            <FilterButton
              activeFilters={activeFiltersCount}
              isMobile={isMobile}
              isExpanded={isFiltersExpanded}
              onClick={handleFilterClick}
            />
           
            {/* Search field */}
            <SearchField
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={isMobile ? '' : 'Search activity'}
              fullWidth={false}
              isStartAdornment={false}
              sx={{ maxWidth: 100 }}
            />
            {/* Create Activity button */}
            <AddLeadButton
              onClick={handleAddLead}
              isMobile={isMobile}
              children={t('actionButton')}
              // sx={{ bgcolor: '#004e64', color: '#fff', borderRadius: '8px', px: 2, py: 1, fontWeight: 500 }}
            />
          </Box>
        </Box>
        {isFiltersExpanded && (
          <FilterSection
            filters={appliedFilters}
            onFilterChange={handleFilterChange}
            onReset={handleFilterReset}
            onApply={handleFilterApply}
          />
        )}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            boxShadow:
              '0 2px 3px -1px rgba(0, 0, 0, 0.1), 0 1px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            background: '#fff',
            borderRadius: '16px',
            overflow: 'hidden',
          }}>
          {/* Table and selection toolbar below top bar */}
          <LeadsTable
            leads={paginatedLeads}
            totalRows={totalRows}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            selectedLeads={selectedLeads}
            onSelectionChange={setSelectedLeads}
            onSendMessage={handleSendMessage}
            onDeleteLead={handleDeleteLead}
            onEditLead={handleEditLead}
            isShowKanban={isShowKanban}
          />
        </Box>
      </Box>
      <DeletionModal
        open={deletionModal.open}
        onClose={() => setDeletionModal({ ...deletionModal, open: false })}
        onConfirm={handleDeletionConfirm}
        selectedCount={deletionModal.selectedCount}
        isSingleItem={deletionModal.isSingleItem}
      />
      <CreationModal
        open={createActionsModal}
        onClose={() => setCreateActionsModal(false)}
        onSave={handleCreateActionsSave}
      />

      <SendMessageModal
        open={sendMessageModal.open}
        onClose={() => setSendMessageModal({ ...sendMessageModal, open: false })}
        onSend={handleSendMessageConfirm}
      />
    </SidebarLayout>
  )
}
