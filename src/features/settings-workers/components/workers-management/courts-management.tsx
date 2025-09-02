import { useState, useEffect } from 'react'
import { Box, Typography, Link as MuiLink, useMediaQuery, useTheme } from '@mui/material'
import PlusIcon from '../../../../shared/assets/icons/plus.svg?react'
import InfoIcon from '../../../../shared/assets/icons/info.svg?react'
import { SearchField, PrimaryButton, InfoDialog } from '../../../../shared/components'
import { CourtsTable, RoleDialog } from '../../ui'
import { type Role, type Brance, TAB_LABELS } from '../../model'

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
  const [openInfo, setOpenInfo] = useState(false)
  const [openRoleDialog, setOpenRoleDialog] = useState(false)
  const [openAddCourtDialog, setOpenAddCourtDialog] = useState(false)
  const [openRemoveCourtDialog, setOpenRemoveCourtDialog] = useState(false)

  const [roles, setRoles] = useState<Role[]>([{ value: 'Лікар' }, { value: '' }])

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

  const handleSaveRoles = () => {
    console.log('Saving roles:', roles)
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: isMobile || editingCourt ? 'space-between' : 'end',
          px: isMobile ? 2 : 0,
        }}>
        {editingCourt ? <BackBtn handleBack={handleBackToCourts} /> : null}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="h6" sx={{ fontWeight: 500, mr: 4 }}>
              Courts
            </Typography>
            <CourtsNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          </Box>
         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
           <SearchField 
              value={searchQuery} 
              onChange={(value) => {
                // Set the search query directly
                setSearchQuery(value);
                // Reset to first page when searching
                setPage(0);
              }} 
              fullWidth={false} 
              placeholder="Search courts..."
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
        
        {editingCourt && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            {/* <EditWorkerForm worker={editingCourt} onCancel={handleBackToCourts} onSave={handleSaveCourt} /> */}
          </Box>
        )}
      </Box>
      <InfoDialog
        open={openInfo}
        onClose={() => setOpenInfo(false)}
        title="Доступи"
        icon={<InfoIcon style={{ color: '#3b5efb' }} />}>
        <Typography sx={{ mb: 2 }}>
          <b>Звіт Налаштування ЗП</b> це інтерактивний звіт, який дає можливість встановити (або змінити вже існуючі)
          параметри нарахування заробітної плати.
        </Typography>
        <Typography sx={{ mb: 1 }}>Таблиця цього звіту містить такі параметри для кожного працівника:</Typography>
        <ul style={{ margin: 0, paddingLeft: 24, marginBottom: 16 }}>
          <li>
            <Typography component="span">
              <b>Ставка</b> – сума щомісячного окладу.
            </Typography>
          </li>
          <li>
            <Typography component="span">
              <b>Погодинна ставка та Погодинна ставка 2</b> – сума погодинної ставки.
            </Typography>
          </li>
          <li>
            <Typography component="span">
              <b>Податки</b> – відсоток оподаткування від заробітної плати.
            </Typography>
          </li>
          <li>
            <Typography component="span">
              <b>Трекер</b> – дозволяє увімкнути або вимкнути трекер робочого часу. Детальніше з цією функцією можна
              ознайомитись у розділі довідки{' '}
              <MuiLink href="#" color="primary" underline="hover">
                Трекер робочого часу
              </MuiLink>
              .
            </Typography>
          </li>
          <li>
            <Typography component="span">
              <b>Виконує роботи</b> – активація автоматичного розрахунку заробітної плати працівника у разі якщо він
              отримує відсоток або фіксовану ставку від виконаних ним робіт.
            </Typography>
          </li>
        </ul>
        <Typography sx={{ mb: 1 }}>
          <b>Коефіцієнт заробітної плати</b> – дозволяє встановити відсоткову або фіксовану ставку від виконаних робіт
          для кожного спеціаліста. При цьому у кожного лікаря можуть бути різні ставки (або ставки будуть взагалі
          відсутні) залежно від виду послуг та умов співпраці клініки з лікарем. Детальніше з цією функцією можна
          ознайомитись у розділі довідки{' '}
          <MuiLink href="#" color="primary" underline="hover">
            Коефіцієнти заробітної плати
          </MuiLink>
          .
        </Typography>
      </InfoDialog>
      <RoleDialog
        open={openRoleDialog}
        onClose={() => setOpenRoleDialog(false)}
        roles={roles}
        onRolesChange={setRoles}
        onSave={handleSaveRoles}
      />
      <AddCourtDialog
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
