import { useState } from "react";

export const useWorkitemsEditModal = () => {
  const [openWorkitemEditModal, setOpenWorkitemEditModal] = useState(false);
  const [openWorkitemEditModalTimestamp] = useState(new Date().getTime());
  const [workitemToEdit, setWorkitemToEdit] = useState(null);

  const handleOpenWorkitemEditModal = (workitemid) => {
    setWorkitemToEdit(workitemid);
    setOpenWorkitemEditModal(true);
  };

  const handleCloseWorkitemEditModal = () => {
    setWorkitemToEdit(null);
    setOpenWorkitemEditModal(false);
  };

  return {
    openWorkitemEditModal,
    setOpenWorkitemEditModal,
    workitemToEdit,
    setWorkitemToEdit,
    openWorkitemEditModalTimestamp,
    handleOpenWorkitemEditModal,
    handleCloseWorkitemEditModal,
  };
};
