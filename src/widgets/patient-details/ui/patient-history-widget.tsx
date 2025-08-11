import { useState } from 'react'
import { Box, Typography, Checkbox, useMediaQuery, useTheme } from '@mui/material'
import LinkIcon from '../../../shared/assets/icons/link.svg?react'
import FileIcon from '../../../shared/assets/icons/file.svg?react'
import Teeth1 from '../../../shared/assets/images/teeth-1.png'
import Teeth2 from '../../../shared/assets/images/teeth-2.png'
import Teeth3 from '../../../shared/assets/images/teeth-3.png'
import Teeth4 from '../../../shared/assets/images/teeth-4.png'
import Teeth5 from '../../../shared/assets/images/teeth-5.png'
import { ImageModal } from './image-modal'
import { MentionTextField } from './mention-textfield'

interface PatientHistoryWidgetProps {
  patientId: string
}

// @ts-ignore
export function PatientHistoryWidget({ patientId }: PatientHistoryWidgetProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ src: string } | null>(null)
  const [comment1, setComment1] = useState('')
  const [comment2, setComment2] = useState('')

  const handleImageClick = (src: string) => {
    setSelectedImage({ src })
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedImage(null)
  }

  return (
    <Box sx={{ m: 2, p: 0 }}>
      <Box
        sx={{
          mb: 3,
          borderRadius: 2,
          boxShadow: '0 2px 3px -1px rgba(0,0,0,0.1), 0 1px 12px 0 rgba(0,0,0,0.1), 0 1px 3px 0 rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}>
        <Box sx={{ p: 2, background: '#fff' }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, display: 'inline' }}>Візит 1</Typography>
          <Typography sx={{ color: '#888', fontSize: 13, ml: 1, display: 'inline' }}>07.09.2024 17:30</Typography>
          <Typography sx={{ fontSize: 13, mt: 0.5 }}>
            Лікар: Олекса Олексій Ігорович <span style={{ color: '#888' }}>Асистент: Олекса Олексій Ігорович</span>
          </Typography>
        </Box>
        <Box sx={{ background: '#e6e9f7', p: 2, pt: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: isMobile ? 'flex-start' : 'center',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              gap: isMobile ? 2 : 0,
            }}>
            <Box>
              <Typography sx={{ color: '#7324d5', fontSize: 15, mb: 0.5, cursor: 'pointer' }}>
                Виконані маніпуляції
              </Typography>
              <Typography sx={{ fontSize: 14, color: '#222' }}>
                Профілактична гігієна; Ремінералізуюча аплікація
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: '#0029d9', fontSize: 14, cursor: 'pointer' }}>Акт виконаних робіт</Typography>
              <LinkIcon style={{ width: 16, height: 16, color: '#0029d9' }} />
            </Box>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(6, 1fr)', mt: 2, gap: 1 }}>
            <img
              src={Teeth1}
              alt="teeth1"
              style={{
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onClick={() => handleImageClick(Teeth1)}
            />
            <img
              src={Teeth2}
              alt="teeth2"
              style={{
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onClick={() => handleImageClick(Teeth2)}
            />
            <img
              src={Teeth3}
              alt="teeth3"
              style={{
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onClick={() => handleImageClick(Teeth3)}
            />
            <img
              src={Teeth4}
              alt="teeth4"
              style={{
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onClick={() => handleImageClick(Teeth4)}
            />
            <img
              src={Teeth5}
              alt="xray"
              style={{
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onClick={() => handleImageClick(Teeth5)}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fafafa',
              }}>
              <FileIcon style={{ width: 40, height: 48, color: '#e0e0e0' }} />
              <Typography sx={{ fontSize: 12, color: '#888', mt: 1 }}>document_File_name.pdf</Typography>
            </Box>
          </Box>
          <MentionTextField
            placeholder="Напишіть свій коментар..."
            multiline
            rows={1}
            value={comment1}
            onChange={setComment1}
            sx={{
              width: '100%',
              background: '#d9dce9',
              mt: 2,
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          mb: 3,
          borderRadius: 2,
          boxShadow: '0 2px 3px -1px rgba(0,0,0,0.1), 0 1px 12px 0 rgba(0,0,0,0.1), 0 1px 3px 0 rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}>
        <Box sx={{ p: 2, background: '#fff' }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, display: 'inline' }}>Візит 2</Typography>
          <Typography sx={{ color: '#888', fontSize: 13, ml: 1, display: 'inline' }}>07.09.2024 17:30</Typography>
          <Typography sx={{ fontSize: 13, mt: 0.5 }}>
            Лікар: Олекса Олексій Ігорович <span style={{ color: '#888' }}>Асистент: Олекса Олексій Ігорович</span>
          </Typography>
        </Box>
        <Box sx={{ background: '#f5f7fe', p: 2, pt: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: isMobile ? 'flex-start' : 'center',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
            }}>
            <Box sx={{ mb: isMobile ? 2 : 0 }}>
              <Typography sx={{ color: '#7324d5', fontSize: 15, mb: 0.5, cursor: 'pointer' }}>
                Виконані маніпуляції
              </Typography>
              <Typography sx={{ fontSize: 14, color: '#222' }}>
                Профілактична гігієна; Ремінералізуюча аплікація
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ color: '#0029d9', fontSize: 14, cursor: 'pointer' }}>Акт виконаних робіт</Typography>
                <LinkIcon style={{ width: 16, height: 16, color: '#0029d9' }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Checkbox size="small" sx={{ p: 0, mr: 1 }} />
                <Typography sx={{ fontSize: 14, color: '#7324d5' }}>Етап не потребує фото</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Box
              sx={{
                border: '1.5px solid #ff2d2d',
                borderRadius: 2,
                p: 1,
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Typography sx={{ color: '#ff2d2d', fontSize: 15, textAlign: 'center' }}>
                Фото виконаних робіт не підвантажені, заробітна плата утримується до моменту завантаження фото
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 2, background: '#f5f7fe', borderRadius: 2, p: 1 }}>
            <MentionTextField
              placeholder="Напишіть свій коментар..."
              multiline
              rows={1}
              value={comment2}
              onChange={setComment2}
              sx={{
                width: '100%',
                background: '#e2e4ea',
              }}
            />
          </Box>
        </Box>
      </Box>
      {selectedImage && <ImageModal open={modalOpen} onClose={handleCloseModal} imageSrc={selectedImage.src} />}
    </Box>
  )
}
