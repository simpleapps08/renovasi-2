import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onFileRemove: () => void;
  isLoading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  selectedFile, 
  onFileRemove,
  isLoading = false 
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    disabled: isLoading
  });

  if (selectedFile) {
    return (
      <Card className="relative">
        <CardContent className="p-4">
          <div className="relative">
            <img 
              src={URL.createObjectURL(selectedFile)} 
              alt="Selected room" 
              className="w-full h-64 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={onFileRemove}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Image className="h-4 w-4" />
            <span>{selectedFile.name}</span>
            <span>({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 border-dashed transition-all duration-200 ${
      isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'
    } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-green-400 hover:bg-green-50/50'}`}>
      <CardContent className="p-8">
        <div {...getRootProps()} className="text-center">
          <input {...getInputProps()} />
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            isDragActive ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            <Upload className={`h-8 w-8 ${
              isDragActive ? 'text-green-600' : 'text-gray-500'
            }`} />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            {isDragActive ? 'Drop foto ruangan di sini' : 'Upload Foto Ruangan'}
          </h3>
          <p className="text-gray-600 mb-4">
            Drag & drop foto ruangan atau klik untuk memilih file
          </p>
          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600 font-medium">
              Format: JPG, PNG, WEBP • Maksimal 10MB • Auto-kompres jika &gt;2MB
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;