import { Box, Button } from '@mui/material'
import { PriceSectionAccordion } from '../price-section-accordion/price-section-accordion'
import { mockSections } from '../../model'
import { PriceToolbar } from '../price-toolbar/price-toolbar'
import { PriceActionsMenu } from '../price-actions-menu/price-actions-menu'

import { WorkExampleDialog } from '../../../../features/settings-workers/ui/work-example'
import { LinkToProductsDialog } from '../../../../features/settings-workers/ui/link-to-products'

import { PricePositionsTable } from '../price-positions-table/price-positions-table'
import AddIcon from '@mui/icons-material/Add'
import { usePriceSettings } from '../../model'
import { GeneralPriceDetailsDialog } from '../../../../features/settings-workers/ui/general-price-details'
import { PriceDetailsDialog } from '../../../../features/settings-workers/ui/price-details'
import { useState } from 'react'
import type { PriceSection, PricePosition } from '../../model/types'

export function PriceContent() {
  const [sections, setSections] = useState<PriceSection[]>(mockSections)

  const {
    anchorEl,
    expanded,
    searchQuery,
    openPriceDetailsDialog,
    priceDetails,
    openGeneralPriceDetailsDialog,
    openWorkExampleDialog,
    openLinkToProductsDialog,
    priceActions,

    setSearchQuery,
    setPriceDetails,
    handleAccordionChange,
    handleMenuOpen,
    handleMenuClose,
    setOpenPriceDetailsDialog,
    setOpenGeneralPriceDetailsDialog,
    setOpenWorkExampleDialog,
    setOpenLinkToProductsDialog,
  } = usePriceSettings()

  const handleAddSection = () => {
    // TODO: Implement add section logic
    console.log('Add section clicked')
  }

  const handlePositionsReorder = (sectionId: string, reorderedPositions: PricePosition[]) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId ? { ...section, positions: reorderedPositions } : section
      )
    )
  }

  return (
    <>
      <PriceToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onEditGeneralDetails={() => setOpenGeneralPriceDetailsDialog(true)}
        onAddSection={handleAddSection}
      />
      <Box sx={{ mt: 3 }}>
        {sections.map((section) => (
          <PriceSectionAccordion
            key={section.id}
            section={section}
            expanded={expanded.includes(section.id)}
            onToggle={handleAccordionChange}>
            <PricePositionsTable
              positions={section.positions}
              onMenuOpen={handleMenuOpen}
              onPositionsReorder={(reorderedPositions) => handlePositionsReorder(section.id, reorderedPositions)}
            />
            <Box sx={{ px: 2, py: 1 }}>
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                sx={{ textTransform: 'none', fontWeight: 500, my: 2 }}
                size="medium">
                ДОДАТИ ПОЗИЦІЮ ПРАЙСУ
              </Button>
            </Box>
          </PriceSectionAccordion>
        ))}
      </Box>
      <PriceActionsMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} actions={priceActions} />
      <PriceDetailsDialog
        open={openPriceDetailsDialog}
        onClose={() => setOpenPriceDetailsDialog(false)}
        names={priceDetails}
        onNamesChange={setPriceDetails}
        onSave={() => {}}
      />
      <GeneralPriceDetailsDialog
        open={openGeneralPriceDetailsDialog}
        onClose={() => setOpenGeneralPriceDetailsDialog(false)}
        onSave={() => {}}
      />
      <WorkExampleDialog
        open={openWorkExampleDialog}
        onClose={() => setOpenWorkExampleDialog(false)}
        onSave={() => {}}
      />
      <LinkToProductsDialog
        open={openLinkToProductsDialog}
        onClose={() => setOpenLinkToProductsDialog(false)}
        onSave={() => {}}
      />
    </>
  )
}
