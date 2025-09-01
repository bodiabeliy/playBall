import DeleteIcon from '@mui/icons-material/Delete'
import { useRef, useState, useEffect } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'

import UploadIcon from "../../shared/assets/icons/upload.svg?react"

export interface FileUploadProps {
  onFileChange?: (files: File[] | null) => void
  helperText?: string
  type?: 'default' | 'small' | 'big'
  maxFiles?: number
  isLoading?: boolean
  multiple?: boolean
}

const FileUpload = ({ 
  onFileChange, 
  helperText = 'files', 
  type = 'default',
  maxFiles = 10,
  isLoading = false,
  multiple = false
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState<{ [key: string]: number }>({})
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // Effect to enforce single file for 'big' type
  useEffect(() => {
    if (type === 'big' && files.length > 1) {
      // Keep only the most recent file
      const mostRecentFile = files[files.length - 1];
      setFiles([mostRecentFile]);
      if (onFileChange) onFileChange([mostRecentFile]);
    }
  }, [type, files, onFileChange]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFile = (file: File) => {
    if (!['image/svg+xml', 'image/png', 'image/jpeg'].includes(file.type) || file.size > 2 * 1024 * 1024) {
      return false
    }
    
    // Create a unique ID for tracking progress
    const fileId = `${file.name}-${Date.now()}`
    
    // Initialize progress for this file
    setProgress(prev => ({
      ...prev,
      [fileId]: 0
    }))

    // Simulate upload progress
    let prog = 0
    const interval = setInterval(() => {
      prog += 10
      setProgress(prev => ({
        ...prev,
        [fileId]: Math.min(prog, 100)
      }))
      if (prog >= 100) clearInterval(interval)
    }, 50)
    
    return { file, fileId }
  }
  
  const handleFiles = (newFiles: File[]) => {
    const validFiles: File[] = []
    const validFileIds: string[] = []
    
    // For 'big' type, allow only one file (replace existing)
    if (type === 'big' && newFiles.length > 0) {
      const file = newFiles[0] // Take only the first file
      const result = handleFile(file)
      if (result) {
        // Replace existing files
        setFiles([result.file])
        
        // Call onFileChange with the new single file
        if (onFileChange) onFileChange([result.file])
      }
      return // Exit early
    }
    
    // For other types, process all files
    newFiles.forEach(file => {
      const result = handleFile(file)
      if (result) {
        validFiles.push(result.file)
        validFileIds.push(result.fileId)
      }
    })
    
    if (validFiles.length > 0) {
      // Update files state with new files
      const maxAllowed = type === 'small' ? maxFiles : 1; // Apply maxFiles limit for small type
      const updatedFiles = [...files, ...validFiles].slice(0, maxAllowed)
      setFiles(updatedFiles)
      
      // Call onFileChange with updated files
      if (onFileChange) onFileChange(updatedFiles)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleDelete = (fileToDelete: File) => {
    // Remove file from files array
    const updatedFiles = files.filter(file => file !== fileToDelete)
    setFiles(updatedFiles)
    
    // Update progress state
    const updatedProgress = { ...progress }
    Object.keys(updatedProgress).forEach(key => {
      if (key.startsWith(fileToDelete.name)) {
        delete updatedProgress[key]
      }
    })
    setProgress(updatedProgress)
    
    // Update parent component
    if (onFileChange) {
      onFileChange(updatedFiles.length > 0 ? updatedFiles : null)
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      {type === 'big' ? (
        <Box sx={{ mb: 2,
          border: '1px dashed rgba(21, 22, 24, 0.12)',
          }}>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>

            {files.length > 0 ? (
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  height: '160px',
                  width: '100%',
                  cursor: 'pointer'
                }}
                onClick={() => inputRef.current?.click()}
              >
                <img
                  src={URL.createObjectURL(files[0])}
                  alt="Banner"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 2
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(files[0]);
                  }}
                >
                  <DeleteIcon />
                </Box>
                
                {/* Progress indicator */}
                {Object.keys(progress).map(key => {
                  if (key.startsWith(files[0].name)) {
                    return (
                      <Box 
                        key={key}
                        sx={{ 
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: 6,
                          bgcolor: 'rgba(0,0,0,0.3)'
                        }}
                      >
                        <Box
                          sx={{
                            width: `${progress[key]}%`,
                            height: '100%',
                            bgcolor: '#3b5bfd',
                            transition: 'width 0.3s'
                          }}
                        />
                      </Box>
                    );
                  }
                  return null;
                })}
              </Box>
            ) : (
              <Box
                sx={{
                  padding: '60px 16px',
                  textAlign: 'center',
                  background: isDragging ? '#f5f7ff' : '#fff',
                  cursor: isLoading ? 'default' : 'pointer',
                  transition: 'background 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '160px',
                  opacity: isLoading ? 0.7 : 1,
                  pointerEvents: isLoading ? 'none' : 'auto'
                }}
                onDragOver={(e) => {
                  if (isLoading) return;
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  if (isLoading) return;
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  if (isLoading) return;
                  handleDrop(e);
                }}
                onClick={() => {
                  if (isLoading) return;
                  inputRef.current?.click();
                }}
              >
                {isLoading ? (
                  <CircularProgress size={32} />
                ) : (
                  <UploadIcon style={{ width: 32, height: 32 }} />
                )}
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {isLoading ? 'Uploading...' : `Upload ${helperText}`}
                </Typography>
                <Typography variant="caption" color="rgba(21, 22, 24, 0.6)" sx={{ mt: 0.5 }}>
                  PNG, JPG, WebP, HEIC up to 2MB
                </Typography>
              </Box>
            )}
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="rgba(21, 22, 24, 0.6)">
                You can upload PDF, PNG or JPG up to 2MB
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : type === 'small' ? (
        <Box sx={{ mb: 2 }}>
          {/* Small Type Layout */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {/* Preview of uploaded images */}
            {files.length > 0 && (
              <Box sx={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                mb: 2
              }}>
                {files.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 100,
                      height: 100,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Club Image ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </Box>
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: 4,
                        bgcolor: '#e0e0e0'
                      }}
                    >
                      {Object.keys(progress).map(key => {
                        if (key.startsWith(file.name)) {
                          return (
                            <Box
                              key={key}
                              sx={{
                                width: `${progress[key]}%`,
                                height: '100%',
                                bgcolor: '#3b5bfd',
                                transition: 'width 0.3s'
                              }}
                            />
                          );
                        }
                        return null;
                      })}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {/* Upload Button */}
            <Box
              sx={{
                border: '1px dashed rgba(21, 22, 24, 0.12)',
                borderRadius: 2,
                padding: '12px',
                textAlign: 'center',
                background: isDragging ? '#f5f7ff' : '#fff',
                cursor: isLoading ? 'default' : 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isLoading ? 0.7 : 1,
                pointerEvents: isLoading ? 'none' : 'auto'
              }}
              onDragOver={(e) => {
                if (isLoading) return;
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                if (isLoading) return;
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                if (isLoading) return;
                handleDrop(e);
              }}
              onClick={() => {
                if (isLoading) return;
                inputRef.current?.click();
              }}
            >
             <Box sx={{display:"flex", alignItems:"center"}}>
                {isLoading ? (
                  <CircularProgress size={24} sx={{ margin: 1 }} />
                ) : (
                  <UploadIcon style={{ width: 24, height: 24, margin:4 }} />
                )}
               <Typography variant="caption" sx={{ fontWeight: 'bold'}}>
                {isLoading ? 'Uploading...' : `Upload ${helperText}`}
              </Typography>
             </Box>
             
              <Typography variant="caption" color="rgba(21, 22, 24, 0.6)" sx={{ mt: 0.5 }}>
                PNG, JPG, WebP, HEIC up to 2MB
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        // Default Type Layout
        <Box>
          <Box
            sx={{
                border: '1px dashed rgba(21, 22, 24, 0.12)',
                borderRadius: 2,
                padding: '12px',
                textAlign: 'center',
                background: isDragging ? '#f5f7ff' : '#fff',
                cursor: isLoading ? 'default' : 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isLoading ? 0.7 : 1,
                pointerEvents: isLoading ? 'none' : 'auto'
            }}
            onDragOver={(e) => {
              if (isLoading) return;
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              if (isLoading) return;
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              if (isLoading) return;
              handleDrop(e);
            }}
            onClick={() => {
              if (isLoading) return;
              inputRef.current?.click();
            }}
          >
           <Box sx={{display:"flex", alignItems:"center"}}>
               {isLoading ? (
                 <CircularProgress size={24} sx={{ margin: 1 }} />
               ) : (
                 <UploadIcon style={{ width: 24, height: 24, margin:4 }} />
               )}
               <Typography variant="caption" sx={{ fontWeight: 'bold'}}>
                {isLoading ? 'Uploading...' : `Upload ${helperText}`}
              </Typography>
            </Box>
            <Typography variant="body2" color="rgba(21, 22, 24, 0.6)" sx={{ mt: 1 }}>
              You can upload PNG, JPG, WebP, HEIC up to 2MB
            </Typography>
          </Box>

          {/* List of uploaded files */}
          {files.map((file, index) => (
            <Box
              key={index}
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                boxShadow: '0 1px 4px rgba(44,51,74,0.08)',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 16 }}>{file.name}</Typography>
                <Typography sx={{ fontSize: 12, color: '#0029d9' }}>
                  {Math.round(file.size / 1024)}kb
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Box
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      background: '#e0e0e0',
                      overflow: 'hidden',
                    }}
                  >
                    {Object.keys(progress).map(key => {
                      if (key.startsWith(file.name)) {
                        return (
                          <Box
                            key={key}
                            sx={{
                              width: `${progress[key]}%`,
                              height: '100%',
                              background: '#3b5bfd',
                              transition: 'width 0.3s',
                            }}
                          />
                        );
                      }
                      return null;
                    })}
                  </Box>
                </Box>
              </Box>
              <DeleteIcon 
                sx={{ color: '#757575', cursor: 'pointer' }} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(file);
                }} 
              />
            </Box>
          ))}
        </Box>
      )}
      
      <input
        ref={inputRef}
        type="file"
        accept=".svg,.png,.jpg,.jpeg,.webp,.heic,.heif"
        multiple={(type !== 'big') && multiple} // Allow multiple based on props and non-big type
        style={{ display: 'none' }}
        onChange={handleInputChange}
        disabled={isLoading}
      />
    </Box>
  )
}

export default FileUpload
