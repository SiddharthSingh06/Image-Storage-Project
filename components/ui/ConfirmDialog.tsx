"use client";

import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-muted font-mono mb-6">{description}</p>
      <div className="flex gap-4 justify-end">
        <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
          {cancelText}
        </Button>
        <Button 
          variant={isDestructive ? "primary" : "secondary"} 
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="w-full sm:w-auto"
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
