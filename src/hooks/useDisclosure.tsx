import { useState } from "react";

export type UseDisclosure = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
};

export const useDisclosure = (initialValue?: boolean): UseDisclosure => {
  const [isOpen, setIsOpen] = useState(
    typeof initialValue !== "undefined" ? initialValue : false,
  );

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => setIsOpen((val) => !val);

  return { isOpen, onOpen, onClose, onToggle };
};
