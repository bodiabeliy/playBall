import { useState, useEffect, useMemo } from 'react'
import { Box, useTheme, useMediaQuery, Typography } from '@mui/material'
import PlusIcon from '../../../../shared/assets/icons/plus.svg?react'
import { SearchField, PrimaryButton } from '../../../../shared/components'
import { PricingNavigation, TAB_LABELS } from '../../../../widgets/pricing'
import { PricingTable } from '../../ui/pricing-table/pricing-table'
import { PricingFilterSection } from '../../ui/pricing-filter-section/pricing-filter-section'
import { CreatePricingDialog } from '../../ui/create-pricing'
import { RemovePricingDialog } from '../../ui/remove-pricing/remove-pricing'
import { FilterButton } from '../../../../features/leads/ui/filter-button/filter-button'
import type { IPricing } from '../../../../app/providers/types/pricing'
import type { PricingFilterValues } from '../../model/types'

import { useAppDispatch, useAppSelector } from '../../../../app/providers/store-helpers'
import { clubSelector } from '../../../../app/providers/reducers/ClubSlice'
import { 
  pricingsSelector, 
  pricingLoadingSelector,
  setLoading
} from '../../../../app/providers/reducers/PricingSlice'
import { getAllPricings, createPricing, deletePricing } from '../../../../app/services/PricingService'
import { PricingViewSwitcher } from '../../../../widgets/pricing/pricing-view-switcher'
import { useNavigate } from 'react-router'

export function PricingManagement() {
  const [activeTab, setActiveTab] = useState(0)
  const [activeSwitcherTab, setActiveSwitcherTab] = useState(1)

  const [searchQuery, setSearchQuery] = useState('')
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false)
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
  sort_by: 'start_date',
    sort_order: 'asc',
  })

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const dispatch = useAppDispatch()
  const pricingList = useAppSelector(pricingsSelector)
  const currentClub = useAppSelector(clubSelector)
  const isLoading = useAppSelector(pricingLoadingSelector)

  const currentSportType = TAB_LABELS[activeTab].toLowerCase()
  const navigate = useNavigate()

  // Derive effective sport filter (tab has priority unless explicit filter chosen)
  const effectiveSportType = (appliedFilters.sport_type || currentSportType).toLowerCase()

  // Filter pricings client-side (API might not yet implement sport_type filtering for price-policies)
  const filteredPricingResponse = useMemo(() => {
    const source = pricingList || { items: [], total: 0, page: 1, size: rowsPerPage, pages: 0 }
    const items = (source.items || []).filter(p => {
      // if no courts treat as keep (or could exclude). We'll exclude to avoid wrong sport showing.
      if (!p.courts || p.courts.length === 0) return false
      return p.courts.some(c => c.sport_type?.toLowerCase() === effectiveSportType)
    })
    return {
      ...source,
      items,
      total: items.length,
      pages: Math.max(1, Math.ceil(items.length / rowsPerPage)),
    }
  }, [pricingList, effectiveSportType, rowsPerPage])

  // Ensure current page is in range after filtering
  useEffect(() => {
    const maxPageIndex = Math.max(0, Math.ceil(filteredPricingResponse.total / rowsPerPage) - 1)
    if (page > maxPageIndex) setPage(0)
  }, [filteredPricingResponse.total, rowsPerPage, page])

  // Handler for search input with debounce
  useEffect(() => {    
    const delaySearch = setTimeout(() => {
      if (currentClub && currentClub.id) {
        dispatch(setLoading(true));
        dispatch(getAllPricings(
          currentClub.id, 
          page + 1, 
          rowsPerPage, 
          searchQuery.toLowerCase(),
          appliedFilters.sport_type || currentSportType,
          '', 
          appliedFilters.sort_by,
          appliedFilters.sort_order
        ))
          .then((response) => {
            console.log(`Received ${response?.items?.length || 0} pricing policies from API out of ${response?.total || 0} total`);
          })
          .finally(() => {
            dispatch(setLoading(false));
          });
      }
    }, 300); // Reduce debounce time for more responsive search

    return () => clearTimeout(delaySearch);
  }, [page, rowsPerPage, searchQuery, activeTab, currentSportType, appliedFilters.sport_type, appliedFilters.sort_by, appliedFilters.sort_order, dispatch, currentClub])



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
  sort_by: 'start_date',
      sort_order: 'asc',
    })
    setPage(0)
  }

  const handleFilterApply = () => {
    setPage(0)
  }

  const handleEditPricing = async () => {
    // Edit is not supported yet by API; keep placeholder for future update
    console.info('EditPricing requested but create-only flow is enabled for now.')
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
          searchQuery.toLowerCase(),
          appliedFilters.sport_type || currentSportType,
          '',
          appliedFilters.sort_by,
          appliedFilters.sort_order
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
          searchQuery.toLowerCase(),
          appliedFilters.sport_type || currentSportType,
          '',
          appliedFilters.sort_by,
          appliedFilters.sort_order
        ))
      } catch (error) {
        console.error('Failed to create pricing:', error)
      }
    }
  }

  const activeFiltersCount = Object.values(appliedFilters).filter(value => value !== '').length

  return (
    <>
      {
        isMobile && (
          <Typography variant="h6" sx={{ fontWeight: 500, mr: 4 }}>
            Pricing
          </Typography>
        )
      }
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
            <PricingNavigation 
              activeTab={activeTab} 
              onTabChange={(newValue) => {
                setActiveTab(newValue)
                setPage(0) // Reset page when changing tabs
                // Clear sport_type filter to use the current tab's sport type
                setAppliedFilters(prev => ({
                  ...prev,
                  sport_type: ''
                }))
              }} 
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: isMobile ? 2 : 0, pb: isMobile ? 2 : 0 }}>

             <PricingViewSwitcher 
              activeTab={activeSwitcherTab} 
              onTabChange={(newValue) => {
                setActiveSwitcherTab(newValue)
              }} 
            />
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
              onClick={() => navigate('/pricing/new-price',)}>
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
          pricings={filteredPricingResponse}
          totalRows={filteredPricingResponse.total}
          page={page}
          rowsPerPage={rowsPerPage}
          sportType={effectiveSportType}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          onEdit={handleEditPricing}
          onDelete={handleDeletePricing}
          searchQuery={searchQuery}
          isLoading={isLoading}
        />
      </Box>

  <CreatePricingDialog
        open={openAddPricingDialog}
        onClose={() => setOpenAddPricingDialog(false)}
        onSave={handleSavePricing}
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
