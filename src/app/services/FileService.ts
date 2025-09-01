import axios from 'axios';
import imageCompression from 'browser-image-compression';

// Constants for Directus integration
const DIRECTUS_BASE_URL = 'https://playball.mooo.com';
const DIRECTUS_TOKEN = '8Mp7lj-IlJ_srsNtMZODXeCWqujsAMqb';
const DIRECTUS_FOLDER_ID = '1092fad4-1875-4fcd-84c8-36433068b0a9';

// Type definitions for Directus responses
interface DirectusFile {
  id: string;
  title: string | null;
  type: string;
  filename_download: string;
  filename_disk: string;
  storage: string;
}

interface DirectusClubPhoto {
  id: number;
  club_id: number;
  directus_files_id: DirectusFile;
}

// Image processing options
const compressionOptions = {
  maxSizeMB: 0.5, // Max file size of 500KB
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/webp'
};

/**
 * Compresses an image and converts it to WebP format
 * @param file - Original file to compress
 * @returns Compressed image file in WebP format
 */
export const compressImage = async (file: File): Promise<File> => {
  try {
    // Handle common image formats
    if (file.type.match(/image\/(jpeg|jpg|png|webp|heic|heif)/i)) {
      const compressedFile = await imageCompression(file, compressionOptions);
      return compressedFile;
    }
    console.warn(`Unsupported file format: ${file.type}`);
    return file;
  } catch (error) {
    console.error('Error compressing image:', error);
    return file;
  }
};

/**
 * Uploads club logo or banner to your API
 * @param file - Compressed file to upload
 * @param endpoint - API endpoint to use
 * @returns Response from API
 */
export const uploadClubImage = async (file: File, endpoint: string) => {
  try {
    const formData = new FormData();
    const compressedFile = await compressImage(file);
    
    formData.append('file', compressedFile);
    
    const response = await axios.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading club image:', error);
    throw error;
  }
};

/**
 * Upload a file to Directus
 * @param file - Compressed file to upload
 * @returns Directus file ID
 */
export const uploadToDirectus = async (file: File): Promise<string> => {
  try {
    // Step 1: Compress the image
    const compressedFile = await compressImage(file);
    
    // Step 2: Upload file to Directus
    const formData = new FormData();
    formData.append('file', compressedFile);
    
    const uploadResponse = await axios.post<{data: DirectusFile}>(`${DIRECTUS_BASE_URL}/files`, formData, {
      headers: {
        'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log("uploadResponse", uploadResponse);
    
    
    if (!uploadResponse.data || !uploadResponse.data.data || !uploadResponse.data.data.id) {
      throw new Error('Failed to upload file to Directus');
    }
    
    const fileId = uploadResponse.data.data.id;
    
    // Step 3: Move file to specific folder
    await axios.patch(
      `${DIRECTUS_BASE_URL}/files/${fileId}`,
      { folder: DIRECTUS_FOLDER_ID },
      { headers: { 'Authorization': `Bearer ${DIRECTUS_TOKEN}` } }
    );
    
    return fileId;
  } catch (error) {
    console.error('Error uploading to Directus:', error);
    throw error;
  }
};

/**
 * Link uploaded file to a club in Directus
 * @param clubId - ID of the club
 * @param fileId - ID of the uploaded file
 * @returns Response from Directus
 */
export const linkFileToClub = async (clubId: number, fileId: string) => {
  try {
    const response = await axios.post(
      `${DIRECTUS_BASE_URL}/items/clubs_photos`,
      {
        club_id: clubId,
        directus_files_id: fileId
      },
      {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error linking file to club:', error);
    throw error;
  }
};

/**
 * Upload multiple images to club gallery (Directus)
 * @param clubId - ID of the club
 * @param files - Array of files to upload
 * @returns Array of uploaded file IDs
 */
export const uploadClubGallery = async (clubId: number, files: File[]): Promise<string[]> => {
  try {
    const fileIds: string[] = [];
    
    // Process files sequentially to avoid overwhelming the server
    for (const file of files) {
      try {
        // Upload file to Directus
        const fileId = await uploadToDirectus(file);
        fileIds.push(fileId);
        
        // Link file to club
        await linkFileToClub(clubId, fileId);
      } catch (err) {
        console.error(`Error processing file ${file.name}:`, err);
      }
    }
    
    return fileIds;
  } catch (error) {
    console.error('Error uploading gallery:', error);
    throw error;
  }
};

/**
 * Delete a file from Directus
 * @param fileId - ID of the file to delete
 * @returns Success status
 */
export const deleteDirectusFile = async (fileId: string): Promise<boolean> => {
  try {
    await axios.delete(`${DIRECTUS_BASE_URL}/files/${fileId}`, {
      headers: {
        'Authorization': `Bearer ${DIRECTUS_TOKEN}`
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting file from Directus:', error);
    throw error;
  }
};

/**
 * Retrieve gallery images for a specific club
 * @param clubId - ID of the club
 * @returns Array of image URLs
 */
export const getClubGallery = async (clubId: number): Promise<string[]> => {
  try {
    const response = await axios.get<{data: DirectusClubPhoto[]}>( 
      `${DIRECTUS_BASE_URL}/items/clubs_photos?filter[club_id][_eq]=${clubId}&fields=directus_files_id.*`,
      {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`
        }
      }
    );
    
    if (!response.data || !response.data.data) {
      return [];
    }
    
    // Extract file URLs from response
    return response.data.data.map((item: DirectusClubPhoto) => {
      const fileId = item.directus_files_id?.id;
      if (!fileId) return null;
      return `${DIRECTUS_BASE_URL}/assets/${fileId}`;
    }).filter(Boolean) as string[];
    
  } catch (error) {
    console.error('Error fetching club gallery:', error);
    return [];
  }
};
