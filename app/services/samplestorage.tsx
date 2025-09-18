import { 
  ref, 
  uploadBytes, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject, 
  getMetadata, 
  updateMetadata,
  listAll,
  getBlob
} from "firebase/storage";
import { storage } from "../../firebaseConfig"; // Your firebase config file

// ===== BASIC FILE UPLOAD =====

// 1. Upload a file (simple upload)
async function uploadFile(file: any, path: any) {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    console.log('File uploaded successfully!', snapshot);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Download URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// 2. Upload with progress monitoring
function uploadFileWithProgress(file: any, path: any, onProgress: any) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      // Progress function
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        
        if (onProgress) {
          onProgress(progress, snapshot.state);
        }

        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      // Error function
      (error) => {
        console.error('Upload failed:', error);
        reject(error);
      },
      // Success function
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);
          resolve({
            downloadURL,
            snapshot: uploadTask.snapshot
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

// ===== SPECIALIZED UPLOAD FUNCTIONS =====

// Upload user profile picture
async function uploadProfilePicture(userId: any, file: any) {
  const path = `users/${userId}/profile.jpg`;
  try {
    const downloadURL = await uploadFile(file, path);
    console.log('Profile picture uploaded:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
}

// Upload multiple files
async function uploadMultipleFiles(files: any[], basePath: string) {
  try {
    const uploadPromises = files.map((file, index) => {
      const fileName = file.name || `file_${index}`;
      const path = `${basePath}/${fileName}`;
      return uploadFile(file, path);
    });
    
    const downloadURLs = await Promise.all(uploadPromises);
    console.log('All files uploaded:', downloadURLs);
    return downloadURLs;
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw error;
  }
}

// Upload with custom metadata
async function uploadWithMetadata(file, path, customMetadata = {}) {
  try {
    const storageRef = ref(storage, path);
    
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedBy: 'user123',
        uploadedAt: new Date().toISOString(),
        ...customMetadata
      }
    };
    
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('File uploaded with metadata:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading with metadata:', error);
    throw error;
  }
}

// ===== FILE DOWNLOAD =====

// Get download URL
async function getFileURL(path) {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    console.log('Download URL:', url);
    return url;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
}

// Download file as blob
async function downloadFile(path) {
  try {
    const storageRef = ref(storage, path);
    const blob = await getBlob(storageRef);
    console.log('File downloaded as blob:', blob);
    return blob;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

// ===== FILE MANAGEMENT =====

// Delete a file
async function deleteFile(path) {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    console.log('File deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

// Get file metadata
async function getFileMetadata(path) {
  try {
    const storageRef = ref(storage, path);
    const metadata = await getMetadata(storageRef);
    console.log('File metadata:', metadata);
    return metadata;
  } catch (error) {
    console.error('Error getting metadata:', error);
    throw error;
  }
}

// Update file metadata
async function updateFileMetadata(path, newMetadata) {
  try {
    const storageRef = ref(storage, path);
    const metadata = await updateMetadata(storageRef, newMetadata);
    console.log('Metadata updated:', metadata);
    return metadata;
  } catch (error) {
    console.error('Error updating metadata:', error);
    throw error;
  }
}

// List files in a directory
async function listFiles(path) {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    
    const files = [];
    
    // Get download URLs for all files
    for (const itemRef of result.items) {
      const downloadURL = await getDownloadURL(itemRef);
      const metadata = await getMetadata(itemRef);
      
      files.push({
        name: itemRef.name,
        fullPath: itemRef.fullPath,
        downloadURL,
        size: metadata.size,
        contentType: metadata.contentType,
        timeCreated: metadata.timeCreated
      });
    }
    
    console.log('Files in directory:', files);
    return {
      files,
      folders: result.prefixes.map(folderRef => folderRef.name)
    };
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

// ===== UTILITY FUNCTIONS =====

// Validate file type
function validateFileType(file, allowedTypes) {
  const fileType = file.type;
  const isValid = allowedTypes.includes(fileType);
  
  if (!isValid) {
    throw new Error(`File type ${fileType} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  return true;
}

// Validate file size
function validateFileSize(file, maxSizeInMB) {
  const fileSizeInMB = file.size / (1024 * 1024);
  
  if (fileSizeInMB > maxSizeInMB) {
    throw new Error(`File size (${fileSizeInMB.toFixed(2)}MB) exceeds maximum allowed size (${maxSizeInMB}MB)`);
  }
  
  return true;
}

// Generate unique filename
function generateUniqueFileName(originalName) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  const extension = originalName.split('.').pop();
  return `${timestamp}_${random}.${extension}`;
}

// ===== COMPLETE UPLOAD HANDLER =====

async function handleFileUpload(file, userId, options = {}) {
  try {
    const {
      folder = 'uploads',
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
      maxSizeInMB = 10,
      customMetadata = {},
      onProgress
    } = options;
    
    // Validate file
    validateFileType(file, allowedTypes);
    validateFileSize(file, maxSizeInMB);
    
    // Generate path
    const fileName = generateUniqueFileName(file.name);
    const path = `${folder}/${userId}/${fileName}`;
    
    // Upload with progress
    const result = await uploadFileWithProgress(file, path, onProgress);
    
    // Add custom metadata if provided
    if (Object.keys(customMetadata).length > 0) {
      await updateFileMetadata(path, {
        customMetadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
          ...customMetadata
        }
      });
    }
    
    return {
      downloadURL: result.downloadURL,
      path,
      fileName,
      originalName: file.name,
      size: file.size,
      type: file.type
    };
  } catch (error) {
    console.error('Error in handleFileUpload:', error);
    throw error;
  }
}

// ===== REACT COMPONENT EXAMPLE =====

// Example usage in a React component
function FileUploadComponent() {
  const handleFileSelect = async (event:any) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      const result = await handleFileUpload(file, 'user123', {
        folder: 'profile-pictures',
        allowedTypes: ['image/jpeg', 'image/png'],
        maxSizeInMB: 5,
        onProgress: (progress:any, state: any) => {
          console.log(`Upload progress: ${progress}%`);
          // Update UI with progress
        }
      });
      
      console.log('Upload successful:', result);
      // Update UI with download URL
      
    } catch (error) {
      console.error('Upload failed:', error);
      // Show error message to user
    }
  };
  
  return `
    <input 
      type="file" 
      onChange={handleFileSelect}
      accept="image/jpeg,image/png"
    />
  `;
}

// ===== BATCH OPERATIONS =====

// Delete multiple files
async function deleteMultipleFiles(paths) {
  try {
    const deletePromises = paths.map(path => deleteFile(path));
    await Promise.all(deletePromises);
    console.log('All files deleted successfully');
  } catch (error) {
    console.error('Error deleting multiple files:', error);
    throw error;
  }
}

// Copy file (download then upload to new location)
async function copyFile(sourcePath: any, destinationPath: any) {
  try {
    const blob = await downloadFile(sourcePath);
    const sourceRef = ref(storage, sourcePath);
    const metadata = await getMetadata(sourceRef);
    
    const destRef = ref(storage, destinationPath);
    await uploadBytes(destRef, blob, {
      contentType: metadata.contentType,
      customMetadata: metadata.customMetadata
    });
    
    console.log('File copied successfully');
  } catch (error) {
    console.error('Error copying file:', error);
    throw error;
  }
}

// Export all functions
export {
  uploadFile,
  uploadFileWithProgress,
  uploadProfilePicture,
  uploadMultipleFiles,
  uploadWithMetadata,
  getFileURL,
  downloadFile,
  deleteFile,
  getFileMetadata,
  updateFileMetadata,
  listFiles,
  validateFileType,
  validateFileSize,
  generateUniqueFileName,
  handleFileUpload,
  deleteMultipleFiles,
  copyFile
};