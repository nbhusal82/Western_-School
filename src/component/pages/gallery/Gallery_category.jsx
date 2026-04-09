import React, { useState } from "react";
import { FolderOpen, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableSkeleton from "../../shared/Skeleton_table";
import Table from "../../shared/Table";
import PageHeader from "../../shared/PageHeader";
import Modal from "../../shared/Modal";
import Button, { AddButton, ActionButtons } from "../../shared/Button";
import ConfirmDialog from "../../shared/ConfirmDialog";

import {
  useGetcategory_galleryQuery,
  useCreatecategory_galleryMutation,
  useDeletecategory_galleryMutation,
  useUpdatecategory_galleryMutation,
} from "../../redux/feature/category";

const GalleryCategory = () => {
  const navigate = useNavigate();
  const { data: catRes, isLoading } = useGetcategory_galleryQuery();
  const categories = catRes?.data || [];

  const [createCategory, { isLoading: isCreating }] =
    useCreatecategory_galleryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeletecategory_galleryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdatecategory_galleryMutation();

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [catName, setCatName] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const openModal = (item = null) => {
    setEditing(item);
    setCatName(item ? item.category_name || item.name : "");
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setEditing(null);
    setCatName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateCategory({
          id: editing.id,
          data: { category_name: catName },
        }).unwrap();
      } else {
        await createCategory({ category_name: catName }).unwrap();
      }
      closeModal();
    } catch (err) {
      console.error("Failed to save category", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(selectedId).unwrap();
      setConfirmOpen(false);
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  if (isLoading)
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <PageHeader
          title="Gallery Categories"
          subtitle="Manage and organize your photo albums"
        >
          <button
            onClick={() => navigate("/admin/gallery")}
            className="p-2 hover:bg-white rounded-full border border-transparent hover:border-gray-200 transition bg-white shadow-sm"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
        </PageHeader>
        <div className="max-w-2xl">
          <TableSkeleton rows={5} columns={3} />
        </div>
      </div>
    );

  const columns = [
    {
      header: "S.N",
      accessor: "id",
      className: "w-16",
      render: (row, index) => (
        <span className="text-gray-400">{index + 1}</span>
      ),
    },
    {
      header: "Category Name",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-md text-blue-500">
            <FolderOpen size={16} />
          </div>
          <span className="font-medium text-gray-700">
            {row.category_name || row.name}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader
        title="Gallery Categories"
        subtitle="Manage and organize your photo albums"
      >
        <button
          onClick={() => navigate("/admin/gallery")}
          className="p-2 hover:bg-white rounded-full border border-transparent hover:border-gray-200 transition bg-white shadow-sm mr-2"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <AddButton onClick={() => openModal()} label="Add Category" />
      </PageHeader>

      <div className="max-w-4xl mx-auto">
        <div className="hidden lg:block">
          <Table
            columns={columns}
            data={categories}
            actions={(row) => (
              <ActionButtons
                onEdit={() => openModal(row)}
                onDelete={() => {
                  setSelectedId(row.id);
                  setConfirmOpen(true);
                }}
              />
            )}
            emptyMessage='No categories found. Click "Add Category" to start.'
          />
        </div>
        <div className="lg:hidden space-y-3">
          {categories.map((row, index) => (
            <div key={row.id} className="bg-white rounded-xl shadow-sm border p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-md text-blue-500"><FolderOpen size={16} /></div>
                <div>
                  <span className="text-xs text-gray-400">#{index + 1}</span>
                  <p className="font-medium text-gray-700">{row.category_name || row.name}</p>
                </div>
              </div>
              <ActionButtons
                onEdit={() => openModal(row)}
                onDelete={() => { setSelectedId(row.id); setConfirmOpen(true); }}
              />
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={modal}
        onClose={closeModal}
        title={editing ? "Edit Category" : "Add Category"}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            autoFocus
            required
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            placeholder="Category name"
            className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={isCreating || isUpdating}
            >
              {isCreating ? "Saving..." : isUpdating ? "Updating..." : editing ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setSelectedId(null); }}
        onConfirm={handleDelete}
        title="Delete Category?"
        message="Are you sure you want to delete this category? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default GalleryCategory;