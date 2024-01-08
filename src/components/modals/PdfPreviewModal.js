import React from "react";
import { Modal, ModalHeader } from "@twilio-paste/modal";
import { Box, ModalBody, Text } from "@twilio-paste/core";
import { Button } from "@twilio-paste/button";
import { DownloadIcon } from "@twilio-paste/icons/cjs/DownloadIcon";

type PdfPreviewModalProps = {
  pdf: Blob | null,
  isOpen: boolean,
  handleClose: () => void,
  filename: string,
  onDownload: () => void,
};

const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  pdf,
  isOpen,
  handleClose,
  filename,
  onDownload,
}: PdfPreviewModalProps) => (
  <Modal
    ariaLabelledby="pdf-preview"
    isOpen={isOpen}
    onDismiss={handleClose}
    size="default"
  >
    <ModalHeader>
      <Box
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Text as="p" fontSize="fontSize50" lineHeight="lineHeight60">
          {filename}
        </Text>

        <Button variant="secondary" onClick={onDownload}>
          <DownloadIcon
            decorative={false}
            title="Download File"
            size="sizeIcon60"
            color="colorText"
          />
          Download
        </Button>
      </Box>
    </ModalHeader>
    <ModalBody
      style={{
        maxWidth: "70vw",
        maxHeight: "70vh",
      }}
    >
      <embed
        style={{
          width: "100%",
          height: "100%",
        }}
        src={(window.URL || window.webkitURL).createObjectURL(pdf)}
        type="application/pdf"
      />
    </ModalBody>
  </Modal>
);

export default PdfPreviewModal;
