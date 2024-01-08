import React, { useEffect, useState } from "react";
import {
  Spinner,
  ChatAttachment,
  ChatAttachmentDescription,
  ChatAttachmentLink,
} from "@twilio-paste/core";
import { ReduxMedia } from "../../store/reducers/messageListReducer";
import { DownloadIcon } from "@twilio-paste/icons/cjs/DownloadIcon";
import PdfPreviewModal from "../modals/PdfPreviewModal";

type MessageMediaProps = {
  onDownload: () => Promise<Error | undefined>;
  onOpen: (mediaSid: string, image?: ReduxMedia, file?: ReduxMedia) => void;
  sending?: boolean;
  images: ReduxMedia[];
  files: ReduxMedia[];
  attachments: Record<string, Blob>;
};

const MessageMedia: React.FC<MessageMediaProps> = ({
  onDownload,
  onOpen,
  images,
  files,
  sending,
  attachments,
}: MessageMediaProps) => {
  console.log("Images: ", images); // Log images
  console.log("Files: ", files); // Log files
  console.log("Attachments: ", attachments); // Log attachment blobs

  const [pdfPreview, setPdfPreview] = useState<PdfPreviewState | null>(null);

  const [isMediaLoaded, setMediaLoaded] = useState(false);

  type PdfPreviewState = {
    isOpen: boolean;
    file: Blob | null;
    filename: string;
  };

  useEffect(() => {
    onDownload().then(() => {
      setMediaLoaded(true);
    });
  }, []);

  return (
    <>
      <div>
        {images.map((img) => (
          <div
            key={img.sid}
            style={{
              minHeight: "200px",
              minWidth: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              borderRadius: "4px",
            }}
            onClick={() => isMediaLoaded && onOpen(img.sid, img)}
          >
            <div
              style={{
                zIndex: 7,
                position: "absolute",
                cursor: "pointer",
              }}
            >
              {sending || !isMediaLoaded ? (
                <Spinner
                  size="sizeIcon60"
                  decorative={false}
                  color="colorTextInverse"
                  title="Loading"
                />
              ) : null}
            </div>
            <img
              style={{
                maxHeight: "300px",
                zIndex: 0,
                maxWidth: "400px",
                width: "100%",
              }}
              src={
                isMediaLoaded
                  ? (window.URL || window.webkitURL).createObjectURL(
                      attachments[img.sid]
                    )
                  : undefined
              }
            />
          </div>
        ))}
      </div>

      {files.map((file) => {
        const fileAttachment = attachments && attachments[file.sid];

        return (
          <ChatAttachment
            key={`${file.filename ?? ""}.index`}
            attachmentIcon={
              fileAttachment ? (
                <a
                  href={(window.URL || window.webkitURL).createObjectURL(
                    fileAttachment
                  )}
                  download={file.filename}
                  style={{ textDecoration: "none" }}
                >
                  <DownloadIcon decorative={false} title="Download" />
                </a>
              ) : (
                <Spinner decorative={false} title="Loading" />
              )
            }
          >
            <ChatAttachmentLink
              href="#"
              onClick={() =>
                setPdfPreview({
                  isOpen: true,
                  file: attachments[file.sid], // Blob of the PDF
                  filename: file.filename ?? "", // Filename of the PDF
                })
              }
            >
              {file?.filename ?? ""}
            </ChatAttachmentLink>
            <ChatAttachmentDescription>
              {`${Math.round((file.size / Math.pow(2, 20)) * 100) / 100} MB`}
            </ChatAttachmentDescription>
          </ChatAttachment>
        );
      })}

      {pdfPreview && (
        <PdfPreviewModal
          pdf={pdfPreview.file}
          isOpen={pdfPreview.isOpen}
          handleClose={() => setPdfPreview(null)}
          filename={pdfPreview.filename}
          onDownload={() => {
            // Handle download logic here
          }}
        />
      )}
    </>
  );
};

export default MessageMedia;
