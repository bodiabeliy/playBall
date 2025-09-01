import { useState, useEffect } from 'react'
import { Box, Tabs, Tab, IconButton, Typography, Link as MuiLink, useMediaQuery, useTheme } from '@mui/material'
import PlusIcon from '../../../../shared/assets/icons/plus.svg?react'
import InfoIcon from '../../../../shared/assets/icons/info.svg?react'
import { SearchField, PrimaryButton, InfoDialog } from '../../../../shared/components'
import {  PermissionsTable, RoleDialog, EditWorkerForm } from '../../ui'
import { PaginationFooter } from '../../ui/pagination-footer'
import type { Worker, Role, Brance } from '../../model'
import { PERMISSIONS, TAB_LABELS } from '../../model'
import { BrancesTable } from '../../ui/brances-table'
import { BranchesApi } from '../../api/branches-api'
import { AddBranchDialog } from '../../ui/add-branch'
import { BackBtn } from '../../../back-btn'

export function WorkersManagement() {
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null)
  const [openInfo, setOpenInfo] = useState(false)
  const [openRoleDialog, setOpenRoleDialog] = useState(false)
  const [openAddBranchDialog, setOpenAddBranchDialog] = useState(false)

  const [roles, setRoles] = useState<Role[]>([{ value: 'Лікар' }, { value: '' }])

  const [page,] = useState(0)
  const [rowsPerPage,] = useState(10)

  const [brances, setBrances] = useState<Brance[]>([])
  const [totalBrancesRows, setTotalBrancesRows] = useState(0)
  const [brancesPage, setBrancesPage] = useState(0)
  const [brancesRowsPerPage, setBrancesRowsPerPage] = useState(10)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    const loadWorkers = async () => {
   
    }

    loadWorkers()
  }, [page, rowsPerPage, searchQuery])

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

  const handleBackToWorkers = () => setEditingWorker(null)

  const handleAddWorker = () => {
    console.log('Add worker clicked')
  }

  const handleSaveWorker = async () => {
   
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
          justifyContent: isMobile || editingWorker ? 'space-between' : 'end',
          px: isMobile ? 2 : 0,
        }}>
        {editingWorker ? <BackBtn handleBack={handleBackToWorkers} /> : null}
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#0029d9',
            },
            '&.Mui-selected': {
              color: '#0029d9',
            },
          }}>
          {TAB_LABELS.map((label) => (
            <Tab
              key={label}
              sx={{
                '&.Mui-selected': {
                  color: '#0029d9',
                },
                textTransform: 'none',
              }}
              label={label}
            />
          ))}
        </Tabs>
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
          <Box sx={{ display: editingWorker ? 'none' : 'block' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: isMobile ? 'flex-end' : 'space-between',
                alignItems: 'center',
                p: isMobile ? 1 : 3,
              }}>
              {!isMobile ? <SearchField value={searchQuery} onChange={setSearchQuery} fullWidth={false} /> : null}
              <PrimaryButton startIcon={<PlusIcon />} onClick={handleAddWorker}>
                Додати
              </PrimaryButton>
            </Box>
        
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
              <PrimaryButton
                startIcon={<PlusIcon />}
                sx={{
                  padding: '4px 16px',
                  fontSize: 13,
                }}
                onClick={() => setOpenRoleDialog(true)}>
                ДОДАТИ РОЛЬ
              </PrimaryButton>
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
              <PrimaryButton
                startIcon={<PlusIcon />}
                sx={{
                  padding: '4px 16px',
                  fontSize: 13,
                }}
                onClick={() => setOpenAddBranchDialog(true)}>
                ДОДАТИ ФІЛІЮ
              </PrimaryButton>
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
        {editingWorker && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <EditWorkerForm worker={editingWorker} onCancel={handleBackToWorkers} onSave={handleSaveWorker} />
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
