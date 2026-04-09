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
  useCreate_blogs_categoryMutation,
  useGetblog_categoryQuery,
  useUpdate_blogs_categoryMutation,
  useDelete_blogs_categoryMutation,
} from "../../redux/feature/category";

const BlogCategory = () => {
  const navigate = useNavigate();
  const { data: res, isLoading } = useGetblog_categoryQuery();
  const categories = res?.data || [];

  const [createCategory, { isLoading: isCreating }] =
    useCreate_blogs_categoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdate_blogs_categoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDelete_blogs_categoryMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [name, setName] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const openAdd = () => {
    setEditingCat(null);
    setName("");
    setModalOpen(true);
  };
  const openEdit = (cat) => {
    setEditingCat(cat);
    setName(cat.category_name);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (editingCat) {
        await updateCategory({
          id: editingCat.category_id,
          data: { category_name: name },
        }).unwrap();
      } else {
        await createCategory({ category_name: name }).unwrap();
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(deleteId).unwrap();
      setConfirmOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading)
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <PageHeader title="Blog Categories" subtitle="Manage blog categories">
          <button
            onClick={() => navigate("/admin/blog")}
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
      accessor: "category_id",
      className: "w-16",
      render: (row, index) => (
        <span className="text-gray-400">{index + 1}</span>
      ),
    },
    {
      header: "Category Name",
      accessor: "category_name",
      render: (row) => (
        <span className="font-medium text-gray-700">{row.category_name}</span>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Blog Categories" subtitle="Manage blog categories">
        <button
          onClick={() => navigate("/admin/blog")}
          className="p-2 hover:bg-white rounded-full border border-transparent hover:border-gray-200 transition bg-white shadow-sm mr-2"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <AddButton onClick={openAdd} label="Add Category" />
      </PageHeader>

      <div className="max-w-4xl mx-auto">
        <div className="hidden lg:block">
          <Table
            columns={columns}
            data={categories}
            actions={(row) => (
              <ActionButtons
                onEdit={() => openEdit(row)}
                onDelete={() => { setDeleteId(row.category_id); setConfirmOpen(true); }}
              />
            )}
            emptyMessage="No categories found"
          />
        </div>
        <div className="lg:hidden space-y-3">
          {categories.map((row, index) => (
            <div key={row.category_id} className="bg-white rounded-xl shadow-sm border p-4 flex justify-between items-center">
              <div>
                <span className="text-xs text-gray-400">#{index + 1}</span>
                <p className="font-medium text-gray-700">{row.category_name}</p>
              </div>
              <ActionButtons
                onEdit={() => openEdit(row)}
                onDelete={() => { setDeleteId(row.category_id); setConfirmOpen(true); }}
              />
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCat ? "Edit Category" : "Add Category"}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            autoFocus
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={isCreating || isUpdating}
            >
              {isCreating ? "Saving..." : isUpdating ? "Updating..." : editingCat ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeleteId(null); }}
        onConfirm={handleDelete}
        title="Delete Category?"
        message="Are you sure you want to delete this category? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default BlogCategory;