import { useState, useEffect } from 'react'
import { Box, IconButton, Typography, Link as MuiLink, useMediaQuery, useTheme } from '@mui/material'
import PlusIcon from '../../../../shared/assets/icons/plus.svg?react'
import InfoIcon from '../../../../shared/assets/icons/info.svg?react'
import { SearchField, PrimaryButton, InfoDialog } from '../../../../shared/components'
import { CourtsTable, PermissionsTable, RoleDialog, EditWorkerForm } from '../../ui'
import { PaginationFooter } from '../../ui/pagination-footer'
import type { Role, Brance } from '../../model'
import { PERMISSIONS } from '../../model'
import { BrancesTable } from '../../ui/brances-table'
import { BranchesApi } from '../../api/branches-api'
import { AddBranchDialog } from '../../ui/add-branch'
import { BackBtn } from '../../../back-btn'
import { CourtsNavigation } from '../../../../widgets/courts/courts-navigation'
import { useAppDispatch, useAppSelector } from '../../../../app/providers/store-helpers'
import { clubSelector } from '../../../../app/providers/reducers/ClubSlice'
import { getAllCourts } from '../../../../app/services/CourtService'
import { courtSelector, courtsSelector } from '../../../../app/providers/reducers/CourtSlice'
import type { ICourt, ICourtItem } from '../../../../app/providers/types/court'

export function CourtsManagment() {
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingCourt, setEditingCourt] = useState<ICourtItem | null>(null)
  const [openInfo, setOpenInfo] = useState(false)
  const [openRoleDialog, setOpenRoleDialog] = useState(false)
  const [openAddBranchDialog, setOpenAddBranchDialog] = useState(false)

  const [roles, setRoles] = useState<Role[]>([{ value: 'Лікар' }, { value: '' }])

  const [courts, setCourts] = useState<ICourt[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [brances, setBrances] = useState<Brance[]>([])
  const [totalBrancesRows, setTotalBrancesRows] = useState(0)
  const [brancesPage, setBrancesPage] = useState(0)
  const [brancesRowsPerPage, setBrancesRowsPerPage] = useState(10)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const dispatch = useAppDispatch()

  const courtList = useAppSelector(courtsSelector)
  
  
  const currentClub = useAppSelector(clubSelector)

  useEffect(() => {
    dispatch(getAllCourts(currentClub.id))
  }, [page, rowsPerPage, searchQuery])

  useEffect(() => {
    dispatch(getAllCourts(currentClub.id))
  }, [dispatch, currentClub])

  

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

  const handleEditCourt = (court: ICourtItem) => {
    setEditingCourt(court)
  }

  const handleDeleteCourt = async () => {
   
  }

  const handleSaveCourt = async () => {
    if (!editingCourt) return

   
  }

  const handleSaveRoles = () => {
    console.log('Saving roles:', roles)
  }

  const handleSaveBranch = () => {
    console.log('Saving branch')
    setOpenAddBranchDialog(false)
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
         <Box>
           <SearchField value={searchQuery} onChange={setSearchQuery} fullWidth={false} />
           <PrimaryButton
            startIcon={<PlusIcon />}
            sx={{
              padding: '4px 16px',
              fontSize: 13,
            }}
            onClick={() => setOpenAddBranchDialog(true)}>
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
          mt: isMobile ? 0 : 2,
          position: 'relative',
        }}>
        {activeTab === 0 && (
          <Box sx={{ display: editingCourt ? 'none' : 'block' }}>
            <CourtsTable
              courts={courtList}
              totalRows={totalRows}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
              onRowsPerPageChange={setRowsPerPage}
              onEdit={handleEditCourt}
              onDelete={handleDeleteCourt}
            />
          </Box>
        )}
        {activeTab === 1 && (
          <Box sx={{ height: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: isMobile ? 0 : 2,
                p: isMobile ? 1 : 3,
              }}>
              <IconButton onClick={() => setOpenInfo(true)}>
                <InfoIcon style={{ color: '#000', fillOpacity: 0.56 }} />
              </IconButton>
            </Box>
            <PermissionsTable permissions={PERMISSIONS} />
            <Box sx={{ mt: 'auto' }}>
              <PaginationFooter
                count={10}
                page={1}
                onPageChange={() => {}}
                rowsPerPage={10}
                onRowsPerPageChange={() => {}}
                totalRows={100}
              />
            </Box>
          </Box>
        )}
        {activeTab === 2 && (
          <Box sx={{ height: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                mb: isMobile ? 0 : 2,
                p: isMobile ? 1 : 3,
              }}>
            </Box>
            <BrancesTable
              brances={brances}
              totalRows={totalBrancesRows}
              page={brancesPage}
              rowsPerPage={brancesRowsPerPage}
              onPageChange={setBrancesPage}
              onRowsPerPageChange={setBrancesRowsPerPage}
            />
          </Box>
        )}
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
      <AddBranchDialog
        open={openAddBranchDialog}
        onClose={() => setOpenAddBranchDialog(false)}
        onSave={handleSaveBranch}
      />
    </>
  )
}
