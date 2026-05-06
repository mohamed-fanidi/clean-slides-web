'use client';

import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';

type Props = {
  contentId: string;
  onContentChange: (
    contentId: string,
    newContent: string | string[] | string[][]
  ) => void;
};

const UploadImage = ({ contentId, onContentChange }: Props) => {
  const handleChangeEvent = (e: {
    cdnUrl: string | string[] | string[][];
  }) => {
    if (!e.cdnUrl) return;
    onContentChange(contentId, e.cdnUrl);
  };

  return (
    <div>
      <FileUploaderRegular
        sourceList="local url"
        pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!}
        multiple={false}
        onFileUploadSuccess={handleChangeEvent}
        maxLocalFileSizeBytes={10 * 1024 * 1024} // 10MB
      />
    </div>
  );
};

export default UploadImage;
