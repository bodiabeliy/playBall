import { useState, useEffect } from 'react'
import { Box, useTheme, useMediaQuery, Typography } from '@mui/material'
import PlusIcon from '../../../../shared/assets/icons/plus.svg?react'
import { SearchField, PrimaryButton } from '../../../../shared/components'
import { ReusableNavigation } from '../../../../shared/components/ui/reusable-navigation'
import { PricingTable } from '../../ui/pricing-table/pricing-table'
import { PricingFilterSection } from '../../ui/pricing-filter-section/pricing-filter-section'
import { EditPricingDialog } from '../../ui/edit-pricing/edit-pricing'
import { RemovePricingDialog } from '../../ui/remove-pricing/remove-pricing'
import { FilterButton } from '../../../../features/leads/ui/filter-button/filter-button'
import type { IPricing } from '../../../../app/providers/types/pricing'
import type { PricingFilterValues } from '../../model/types'

import { useAppDispatch, useAppSelector } from '../../../../app/providers/store-helpers'
import { clubSelector } from '../../../../app/providers/reducers/ClubSlice'
import { pricingsSelector, pricingLoadingSelector } from '../../../../app/providers/reducers/PricingSlice'
import { getAllPricings, createPricing, deletePricing } from '../../../../app/services/PricingService'

const TAB_LABELS = ['Padel', 'Tennis', 'Pickleball']

export function PricingManagement() {
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false)
  const [editingPricing, setEditingPricing] = useState<IPricing | null>(null)
  const [deletingPricing, setDeletingPricing] = useState<IPricing | null>(null)
  const [openAddPricingDialog, setOpenAddPricingDialog] = useState(false)
  const [openRemovePricingDialog, setOpenRemovePricingDialog] = useState(false)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)


  const [appliedFilters, setAppliedFilters] = useState<PricingFilterValues>({
    search: '',
    sport_type: '',
    start_date: '',
    end_date: '',
    is_timed: '',
    sort_by: 'name',
    sort_order: 'asc',
  })

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const dispatch = useAppDispatch()
  const pricingList = useAppSelector(pricingsSelector)
  const currentClub = useAppSelector(clubSelector)
  const isLoading = useAppSelector(pricingLoadingSelector)

  const currentSportType = TAB_LABELS[activeTab].toLowerCase()

  // Load pricing data
  useEffect(() => {
    const loadPricing = async () => {
      if (currentClub && currentClub.id) {
        try {
          await dispatch(getAllPricings(
            currentClub.id,
            page + 1,
            rowsPerPage,
            searchQuery,
            appliedFilters.sport_type || currentSportType,
            '',
            appliedFilters.sort_by,
            appliedFilters.sort_order
          ))
        } catch (error) {
          console.error('Failed to load pricing:', error)
        }
      }
    }

    const delaySearch = setTimeout(() => {
      loadPricing()
    }, 300)

    return () => clearTimeout(delaySearch)
  }, [page, rowsPerPage, searchQuery, activeTab, currentSportType, appliedFilters, dispatch, currentClub])



  const handleFilterClick = () => {
    setIsFiltersExpanded(!isFiltersExpanded)
  }

  const handleFilterChange = (field: keyof PricingFilterValues, value: string) => {
    setAppliedFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFilterReset = () => {
    setAppliedFilters({
      search: '',
      sport_type: '',
      start_date: '',
      end_date: '',
      is_timed: '',
      sort_by: 'name',
      sort_order: 'asc',
    })
    setPage(0)
  }

  const handleFilterApply = () => {
    setPage(0)
  }

  const handleEditPricing = async (updatedPricing: IPricing) => {
    if (updatedPricing.id && currentClub?.id) {
      try {
        // For now, just close the dialog - implement update when API is ready
        setEditingPricing(null)
        setOpenAddPricingDialog(false)
        // Refresh the pricing list
        if (currentClub && currentClub.id) {
          await dispatch(getAllPricings(
            currentClub.id,
            page + 1,
            rowsPerPage,
            searchQuery,
            appliedFilters.sport_type || currentSportType
          ))
        }
      } catch (error) {
        console.error('Failed to update pricing:', error)
      }
    }
  }

  const handleDeletePricing = async (pricing: IPricing) => {
    setDeletingPricing(pricing)
    setOpenRemovePricingDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (deletingPricing?.id && currentClub?.id) {
      try {
        await dispatch(deletePricing(currentClub.id, deletingPricing.id))
        setOpenRemovePricingDialog(false)
        setDeletingPricing(null)
        
        // Refresh the pricing list
        await dispatch(getAllPricings(
          currentClub.id,
          page + 1,
          rowsPerPage,
          searchQuery,
          appliedFilters.sport_type || currentSportType
        ))
      } catch (error) {
        console.error('Failed to delete pricing:', error)
      }
    }
  }

  const handleSavePricing = async (newPricing: IPricing) => {
    if (currentClub && currentClub.id) {
      try {
        await dispatch(createPricing(currentClub.id, newPricing))
        setOpenAddPricingDialog(false)
        
        // Refresh the pricing list
        await dispatch(getAllPricings(
          currentClub.id,
          page + 1,
          rowsPerPage,
          searchQuery,
          appliedFilters.sport_type || currentSportType
        ))
      } catch (error) {
        console.error('Failed to create pricing:', error)
      }
    }
  }

  const activeFiltersCount = Object.values(appliedFilters).filter(value => value !== '').length

  return (
    <>
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: isMobile ? 'space-between' : 'end',
        }}>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? "column" : "row", justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex' }}>
            {
              !isMobile && (
                <Typography variant="h6" sx={{ fontWeight: 500, mr: 4 }}>
                  Pricing
                </Typography>
              )
            }
            <ReusableNavigation 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              labels={TAB_LABELS} 
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: isMobile ? 2 : 0, pb: isMobile ? 2 : 0 }}>
            <FilterButton
              activeFilters={activeFiltersCount}
              isMobile={isMobile}
              isExpanded={isFiltersExpanded}
              onClick={handleFilterClick}
            />
            <SearchField 
              value={searchQuery} 
              onChange={(value) => {
                setSearchQuery(value);
                setPage(0);
              }} 
              fullWidth={false} 
              placeholder="Search pricing policies..."
              isMoblie={isMobile}
            />
            <PrimaryButton
              startIcon={<PlusIcon />}
              sx={{
                padding: '4px 16px',
                fontSize: 13,
                height: '30px',
              }}
              onClick={() => setOpenAddPricingDialog(true)}>
              New Price
            </PrimaryButton>
          </Box>
        </Box>
      </Box>

      {/* Filter Section */}
      {isFiltersExpanded && (
        <Box sx={{ mt: 2 }}>
          <PricingFilterSection
            filters={appliedFilters}
            onFilterChange={handleFilterChange}
            onReset={handleFilterReset}
            onApply={handleFilterApply}
          />
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxShadow:
            '0 2px 3px -1px rgba(0, 0, 0, 0.1), 0 1px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          background: '#fff',
          borderRadius: '16px',
          mt: isMobile ? 0 : 3,
          position: 'relative',
        }}>
        <PricingTable
          pricings={pricingList}
          totalRows={pricingList.total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          onEdit={handleEditPricing}
          onDelete={handleDeletePricing}
          searchQuery={searchQuery}
          isLoading={isLoading}
        />
      </Box>

      {/* Dialogs */}
      <EditPricingDialog
        open={openAddPricingDialog}
        onClose={() => setOpenAddPricingDialog(false)}
        onSave={handleSavePricing}
        pricing={editingPricing}
      />

      <RemovePricingDialog
        open={openRemovePricingDialog}
        onClose={() => setOpenRemovePricingDialog(false)}
        onConfirm={handleConfirmDelete}
        pricing={deletingPricing}
      />
    </>
  )
}
