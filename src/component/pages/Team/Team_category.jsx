import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableSkeleton from "../../shared/Skeleton_table";
import Table from "../../shared/Table";
import PageHeader from "../../shared/PageHeader";
import Modal from "../../shared/Modal";
import Button, { AddButton, ActionButtons } from "../../shared/Button";
import ConfirmDialog from "../../shared/ConfirmDialog";
import {
  useCreate_team_categoryMutation,
  useDelete_team_categoryMutation,
  useGet_team_categoryQuery,
  useUpdate_team_categoryMutation,
} from "../../redux/feature/category";

const TeamCategory = () => {
  const navigate = useNavigate();

  // Data Fetching
  const {
    data: response = [],
    isLoading: isFetching,
    refetch,
  } = useGet_team_categoryQuery();
  const categories = response?.data || response;

  // Mutations
  const [createCat, { isLoading: isCreating }] =
    useCreate_team_categoryMutation();
  const [updateCat, { isLoading: isUpdating }] =
    useUpdate_team_categoryMutation();
  const [deleteCat] = useDelete_team_categoryMutation();

  // Local States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const openAddModal = () => {
    setEditingCat(null);
    setCategoryName("");
    setModalOpen(true);
  };

  const handleEdit = (cat) => {
    setEditingCat(cat);
    setCategoryName(cat.category_name || cat.name || "");
    setModalOpen(true);
  };

  // --- FIXED DELETE LOGIC ---
  const handleDelete = async () => {
    try {
      await deleteCat(deleteId).unwrap();
      refetch();
      setConfirmOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete Error:", err);
      const errorMsg =
        err?.data?.message ||
        "Cannot delete. This category might be in use by team members.";
      alert("Delete Failed: " + errorMsg);
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      if (editingCat) {
        // UPDATE Logic
        await updateCat({
          id: editingCat.category_id || editingCat.id, // Try both ID fields
          category_name: categoryName,
        }).unwrap();
      } else {
        // CREATE Logic
        await createCat({ category_name: categoryName }).unwrap();
      }
      setModalOpen(false);
      setCategoryName("");
    } catch (err) {
      console.error("Operation failed:", err);
      alert("Error: " + (err?.data?.message || "Something went wrong"));
    }
  };

  if (isFetching)
    return (
      <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
        <PageHeader title="Team Categories" subtitle="Organize your staff departments">
          <button onClick={() => navigate("/admin/team")} className="p-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition active:scale-90">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
        </PageHeader>
        <div className="max-w-4xl mx-auto">
          <TableSkeleton rows={5} columns={3} />
        </div>
      </div>
    );

  const columns = [
    {
      header: "ID",
      accessor: "category_id",
      className: "w-20",
      render: (row) => <span className="text-gray-400 font-mono text-xs">#{row.category_id || row.id}</span>,
    },
    {
      header: "Department Name",
      accessor: "category_name",
      render: (row) => <span className="font-bold text-gray-700 tracking-tight">{row.category_name || row.name}</span>,
    },
  ];

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Team Categories" subtitle="Organize your staff departments">
        <button onClick={() => navigate("/admin/team")} className="p-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition active:scale-90 mr-2">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <AddButton onClick={openAddModal} label="New Category" />
      </PageHeader>

      <div className="max-w-4xl mx-auto">
        <Table
          columns={columns}
          data={categories}
          actions={(row) => (
            <ActionButtons
              onEdit={() => handleEdit(row)}
              onDelete={() => { setDeleteId(row.category_id || row.id); setConfirmOpen(true); }}
            />
          )}
          emptyMessage="No Categories Found"
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCat ? "Update Dept." : "New Dept."}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Category Name
            </label>
            <input
              disabled={isCreating || isUpdating}
              type="text"
              required
              autoFocus
              placeholder="e.g. Administration"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full border border-gray-100 bg-gray-50/50 px-5 py-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[var(--color-secondary)] outline-none transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setModalOpen(false)}
              disabled={isCreating || isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-2"
              isLoading={isCreating || isUpdating}
            >
              {editingCat ? "Update Now" : "Create Dept"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeleteId(null); }}
        onConfirm={handleDelete}
        title="Delete Category?"
        message="Are you sure? Members linked to this category might be affected."
      />
    </div>
  );
};

export default TeamCategory;
