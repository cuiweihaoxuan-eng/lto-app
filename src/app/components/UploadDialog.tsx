import { useState, useRef } from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from './ui/utils';
import { Button } from './ui/button';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

interface UploadedFile {
  name: string;
  size: string;
  uploadTime: string;
  synced: boolean;
}

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  accept?: string;
  multiple?: boolean;
  onSave?: () => void;
}

export function UploadDialog({
  open,
  onOpenChange,
  title,
  files,
  onFilesChange,
  accept,
  multiple = true,
  onSave,
}: UploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => ({
      name: file.name,
      size: file.size < 1024 * 1024
        ? (file.size / 1024).toFixed(1) + ' KB'
        : (file.size / 1024 / 1024).toFixed(1) + ' MB',
      uploadTime: new Date().toLocaleString(),
      synced: false,
    }));

    if (multiple) {
      onFilesChange([...files, ...newFiles]);
    } else {
      onFilesChange(newFiles);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const handleSync = (index: number) => {
    const updated = [...files];
    updated[index] = { ...updated[index], synced: true };
    onFilesChange(updated);
  };

  const handleSave = () => {
    onSave?.();
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* 不允许点击遮罩关闭 */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed top-[50%] left-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-white p-6 shadow-lg duration-200",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-medium text-gray-900">{title}</h2>
            <DialogPrimitive.Close asChild>
              <button className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </DialogPrimitive.Close>
          </div>

          <div className="max-h-[50vh] overflow-y-auto space-y-4">
            {/* 上传按钮 */}
            <div
              className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">点击上传文件</p>
              <p className="text-xs text-gray-400 mt-1">支持 PDF、Word、Excel、图片等格式</p>
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* 文件列表 */}
            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">已上传文件（{files.length}个）</p>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
                  >
                    <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-800 truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">{file.size}</p>
                    </div>
                    {file.synced ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <button
                        onClick={() => handleSync(index)}
                        className="text-xs text-blue-600 hover:text-blue-700 flex-shrink-0 whitespace-nowrap"
                      >
                        同步
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-gray-400 hover:text-red-500 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {files.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-4">暂未上传文件</p>
            )}
          </div>

          {/* 底部按钮 */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button size="sm" onClick={handleSave}>
              保存
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
