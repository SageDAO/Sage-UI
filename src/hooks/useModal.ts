import { useState } from 'react';
export default function useModal(initialState?: boolean) {
  const [isOpen, setIsOpen] = useState<boolean>(initialState || false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  return { isOpen, openModal, closeModal };
}
