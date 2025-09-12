import { useState, useEffect } from 'react'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import PlusIcon from '../../../../shared/assets/icons/plus.svg?react'
import { SearchField, PrimaryButton } from '../../../../shared/components'
import { CourtsTable } from '../../ui'
import { type Brance, TAB_LABELS } from '../../model'

import { BranchesApi } from '../../api/branches-api'
import { AddCourtDialog } from '../../ui/add-court'
import { RemoveCourtDialog } from '../../ui/remove-court'
import { BackBtn } from '../../../back-btn'
import { CourtsNavigation } from '../../../../widgets/courts/courts-navigation'
import { useAppDispatch, useAppSelector } from '../../../../app/providers/store-helpers'
import { clubSelector } from '../../../../app/providers/reducers/ClubSlice'
import { getAllCourts, updateCourt } from '../../../../app/services/CourtService'
import { 
  courtsSelector, 
  setLoading,
  loadingSelector
} from '../../../../app/providers/reducers/CourtSlice'
import type { ICourt } from '../../../../app/providers/types/court'

export function CourtsManagment() {
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingCourt, setEditingCourt] = useState<ICourt | null>(null)
  const [deletingCourt, setDeletingCourt] = useState<ICourt | null>(null)

  const [openAddCourtDialog, setOpenAddCourtDialog] = useState(false)
  const [openRemoveCourtDialog, setOpenRemoveCourtDialog] = useState(false)


  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortBy] = useState('name')
  const [sortOrder] = useState('asc')

  const [, setBrances] = useState<Brance[]>([])
  const [, setTotalBrancesRows] = useState(0)
  const [brancesPage] = useState(0)
  const [brancesRowsPerPage] = useState(10)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const dispatch = useAppDispatch()

  const courtList = useAppSelector(courtsSelector)
  const currentClub = useAppSelector(clubSelector)
  const isLoading = useAppSelector(loadingSelector)

  const currentSportType = TAB_LABELS[activeTab];

  // Handler for search input with debounce
  useEffect(() => {    
    const delaySearch = setTimeout(() => {
      if (currentClub && currentClub.id) {
        dispatch(setLoading(true));
        dispatch(getAllCourts(
          currentClub.id, 
          page + 1, 
          rowsPerPage, 
          searchQuery.toLowerCase(), // Ensure search is lowercase for consistency
          currentSportType.toLowerCase(), // Pass the sport type based on active tab
          '', 
          sortBy,
          sortOrder
        ))
          .then((response) => {
            console.log(`Received ${response?.items?.length || 0} courts from API out of ${response?.total || 0} total`);
          })
          .finally(() => {
            dispatch(setLoading(false));
          });
      }
    }, 300); // Reduce debounce time for more responsive search

    return () => clearTimeout(delaySearch);
  }, [page, rowsPerPage, searchQuery, activeTab, currentSportType, sortBy, sortOrder, dispatch, currentClub]);

  

  useEffect(() => {
    const loadBrances = async () => {
      try {
        const response = await BranchesApi.getBranches(brancesPage, brancesRowsPerPage, searchQuery)
        setBrances(response.brances)
        setTotalBrancesRows(response.total)
      } catch (error) {
        console.error('Failed to load brances:', error)
      }
    }

    loadBrances()
  }, [brancesPage, brancesRowsPerPage, searchQuery])

  const handleBackToCourts = () => setEditingCourt(null)



  const handleEditCourt = async(updatedCourt: ICourt) => {
    if (updatedCourt.id && currentClub?.id) {
      await dispatch(updateCourt(updatedCourt.id, updatedCourt))
      await dispatch(getAllCourts(
        currentClub.id, 
        page + 1, 
        rowsPerPage, 
        searchQuery.toLowerCase(),
        currentSportType.toLowerCase(),
        '', 
        sortBy,
        sortOrder
      ));
       
    }
  }
  const handleDeleteCourt = async (court: ICourt) => {
    setDeletingCourt(court);
    setOpenRemoveCourtDialog(true);
  }
  
  const handleConfirmDelete = async () => {
    // Refresh the courts list after successful deletion
    if (currentClub && currentClub.id) {
      try {
        // Re-fetch courts after deletion
        await dispatch(getAllCourts(
          currentClub.id, 
          page + 1, 
          rowsPerPage, 
          searchQuery.toLowerCase(),
          currentSportType.toLowerCase(), 
          '', 
          sortBy,
          sortOrder
        ));
      } finally {
        // Close the dialog
        setOpenRemoveCourtDialog(false);
      }
    }
  }

  const handleSaveBranch = async () => {
    console.log('Saving branch')
    // Refresh the courts list after adding a new court
    if (currentClub && currentClub.id) {
      try {
        // Re-fetch courts
        await dispatch(getAllCourts(
          currentClub.id, 
          page + 1, 
          rowsPerPage, 
          searchQuery.toLowerCase(),
          currentSportType.toLowerCase(), 
          '', 
          sortBy,
          sortOrder
        ));
      } finally {
        setOpenAddCourtDialog(false);
      }
    }
  }

  return (
    <>
      {
        isMobile && (
            <Typography variant="h6" sx={{ fontWeight: 500, mr: 4 }}>
              Courts
            </Typography>
        )
      }
      <Box
        sx={{
          display: 'flex',
          justifyContent: isMobile || editingCourt ? 'space-between' : 'end',
          // px: isMobile ? 2 : 0,
        }}>
          
        {editingCourt ? <BackBtn handleBack={handleBackToCourts} /> : null}
        <Box sx={{ display: 'flex', flexDirection:isMobile?"column":"row", justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex' }}>
              {
                !isMobile && (
                    <Typography variant="h6" sx={{ fontWeight: 500, mr: 4 }}>
                      Courts
                    </Typography>
                )
              }
            <CourtsNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          </Box>
         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt:isMobile? 2:0, pb:isMobile? 2:0,  }}>
           <SearchField 
              value={searchQuery} 
              onChange={(value) => {
                setSearchQuery(value);
                setPage(0);
              }} 
              fullWidth={false} 
              placeholder="Search courts..."
              isMoblie={isMobile}
           />
           <PrimaryButton
            startIcon={<PlusIcon />}
            sx={{
              padding: '4px 16px',
              fontSize: 13,
              height: '30px',
            }}
            onClick={() => setOpenAddCourtDialog(true)}>
            New Court
          </PrimaryButton>
         </Box>
        </Box>
      </Box>
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
        <Box sx={{ display: editingCourt ? 'none' : 'block' }}>
          <CourtsTable
            courts={courtList}
            totalRows={courtList?.total || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            onEdit={handleEditCourt}
            onDelete={handleDeleteCourt}
            activeTab={activeTab}
            searchQuery={searchQuery}
            isLoading={isLoading}
          />
        </Box>
        
      
      </Box>
     
      <AddCourtDialog
        currentSportType={currentSportType}
        open={openAddCourtDialog}
        onClose={() => setOpenAddCourtDialog(false)}
        onSave={handleSaveBranch}
      />
      
      <RemoveCourtDialog
        open={openRemoveCourtDialog}
        onClose={() => setOpenRemoveCourtDialog(false)}
        onDelete={handleConfirmDelete}
        court={deletingCourt}
      />
    </>
  )
}
