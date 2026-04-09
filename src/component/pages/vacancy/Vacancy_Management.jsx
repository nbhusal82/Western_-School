import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpen } from "lucide-react";
import PageHeader from "../../shared/PageHeader";
import Table from "../../shared/Table";
import Modal from "../../shared/Modal";
import Button, { AddButton, ActionButtons } from "../../shared/Button";
import TableSkeleton from "../../shared/Skeleton_table";
import ConfirmDialog from "../../shared/ConfirmDialog";
import { FormInput, FormTextarea, FormSelect } from "../../shared/FormInput";

import {
  useCreatevacancyMutation,
  useDeletevacancyMutation,
  useGetvacancyQuery,
  useUpdatevacancyMutation,
} from "../../redux/feature/content";

import {
  useGet_vacancy_categoryQuery,
  useCreatecategory_vacancyMutation,
  useUpdatecategory_vacancyMutation,
  useDeletecategory_vacancyMutation,
} from "../../redux/feature/category";

// 🔥 Utility to format date
const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const VacancyManagement = () => {
  const navigate = useNavigate();
  const { data: vacancyRes, isLoading, refetch } = useGetvacancyQuery();
  const { data: catRes } = useGet_vacancy_categoryQuery();

  const vacancyItems = vacancyRes?.data || [];
  const categories = catRes?.data || catRes || [];

  const [createVacancy, { isLoading: isCreating }] = useCreatevacancyMutation();
  const [updateVacancy, { isLoading: isUpdating }] = useUpdatevacancyMutation();
  const [deleteVacancy, { isLoading: isDeleting }] = useDeletevacancyMutation();

  const [createCategory, { isLoading: isCreatingCat }] =
    useCreatecategory_vacancyMutation();
  const [updateCategory, { isLoading: isUpdatingCat }] =
    useUpdatecategory_vacancyMutation();
  const [deleteCategory] = useDeletecategory_vacancyMutation();

  // Vacancy Modal States
  const [vacancyModal, setVacancyModal] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState(null);
  const [vacancyForm, setVacancyForm] = useState({
    title: "",
    category_id: "",
    description: "",
    deadline: "",
    status: "open",
  });

  // Category Modal States
  const [categoryModal, setCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Vacancy Handlers
  const openVacancyModal = (item = null) => {
    setEditingVacancy(item);
    setVacancyForm(
      item
        ? {
          title: item.title,
          category_id: item.category_id,
          description: item.description,
          deadline: item.application_deadline,
          status: item.status || "open",
        }
        : {
          title: "",
          category_id: "",
          description: "",
          deadline: "",
          status: "open",
        },
    );
    setVacancyModal(true);
  };

  const handleVacancySubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: vacancyForm.title,
      category_id: vacancyForm.category_id,
      description: vacancyForm.description,
      application_deadline: vacancyForm.deadline,
      status: vacancyForm.status,
      posted_date: new Date().toISOString().split("T")[0],
    };

    try {
      if (editingVacancy) {
        await updateVacancy({ id: editingVacancy.id, data: payload }).unwrap();
      } else {
        await createVacancy(payload).unwrap();
      }
      refetch();
      setVacancyModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (item, newStatus) => {
    try {
      await updateVacancy({
        id: item.id,
        data: {
          title: item.title,
          category_id: item.category_id,
          description: item.description,
          application_deadline: item.application_deadline,
          status: newStatus,
        },
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDeleteVacancy = async () => {
    try {
      await deleteVacancy(deleteId).unwrap();
      refetch();
      setConfirmOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Category Handlers
  const openCategoryModal = (item = null) => {
    setEditingCategory(item);
    setCategoryName(item ? item.category_name : "");
    setCategoryModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.category_id,
          data: { name: categoryName },
        }).unwrap();
      } else {
        await createCategory({ name: categoryName }).unwrap();
      }
      setCategoryModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Updated Columns with formatted date
  const columns = [
    { header: "Title", accessor: "title", cellClassName: "font-medium" },

    {
      header: "Category",
      render: (row) =>
        categories.find(
          (c) => String(c.category_id) === String(row.category_id),
        )?.category_name || "N/A",
    },

    {
      header: "Deadline",
      render: (row) => formatDate(row.application_deadline),
      cellClassName: "text-center",
    },

    {
      header: "Posted",
      render: (row) => formatDate(row.posted_date),
      cellClassName: "text-center",
    },

    {
      header: "Status",
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row, e.target.value)}
          className={`border rounded px-2 py-1 text-sm font-semibold ${row.status === "open"
              ? "text-green-600"
              : row.status === "closed"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="pending">Pending</option>
        </select>
      ),
      cellClassName: "text-center",
    },
  ];

  if (isLoading)
    return (
      <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
        <PageHeader
          title="Vacancy Management"
          subtitle="Manage job vacancies"
        />
        <TableSkeleton rows={5} columns={6} />
      </div>
    );

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Vacancy Management" subtitle="Manage job vacancies">
        <button
          onClick={() => navigate("/admin/vacancy/category")}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 mr-2"
        >
          <FolderOpen size={16} /> Categories
        </button>
        <AddButton onClick={() => openVacancyModal()} label="Add Vacancy" />
      </PageHeader>

      <div className="hidden lg:block">
        <Table
          columns={columns}
          data={vacancyItems}
          actions={(row) => (
            <ActionButtons
              onEdit={() => openVacancyModal(row)}
              onDelete={() => {
                setDeleteId(row.id);
                setConfirmOpen(true);
              }}
            />
          )}
        />
      </div>

      <div className="lg:hidden space-y-3">
        {vacancyItems.map((row, index) => (
          <div key={row.id} className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <span className="text-xs text-gray-400">#{index + 1}</span>
                <h3 className="font-medium text-gray-700">{row.title}</h3>
                <span className="text-xs text-gray-500">{categories.find((c) => String(c.category_id) === String(row.category_id))?.category_name || "N/A"}</span>
              </div>
              <ActionButtons
                onEdit={() => openVacancyModal(row)}
                onDelete={() => { setDeleteId(row.id); setConfirmOpen(true); }}
              />
            </div>
            <div className="flex gap-4 text-xs text-gray-500 mt-2">
              <span>Deadline: {formatDate(row.application_deadline)}</span>
              <select
                value={row.status}
                onChange={(e) => handleStatusChange(row, e.target.value)}
                className={`border rounded px-2 py-0.5 text-xs font-semibold ${row.status === "open" ? "text-green-600" : row.status === "closed" ? "text-red-600" : "text-yellow-600"
                  }`}
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* VACANCY MODAL */}
      <Modal
        isOpen={vacancyModal}
        onClose={() => setVacancyModal(false)}
        title={editingVacancy ? "Update Vacancy" : "Add Vacancy"}
        size="md"
      >
        <form onSubmit={handleVacancySubmit} className="space-y-4 sm:space-y-5">
          <FormInput
            label="Vacancy Title"
            value={vacancyForm.title}
            onChange={(e) => setVacancyForm({ ...vacancyForm, title: e.target.value })}
            placeholder="Enter vacancy title"
            required
          />

          <FormTextarea
            label="Job Description"
            value={vacancyForm.description}
            onChange={(e) => setVacancyForm({ ...vacancyForm, description: e.target.value })}
            placeholder="Write job description..."
            rows={3}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Category"
              value={vacancyForm.category_id}
              onChange={(e) => setVacancyForm({ ...vacancyForm, category_id: e.target.value })}
              options={categories.map(c => ({ value: c.category_id, label: c.category_name }))}
              placeholder="Select Category"
              required
            />

            <FormSelect
              label="Status"
              value={vacancyForm.status}
              onChange={(e) => setVacancyForm({ ...vacancyForm, status: e.target.value })}
              options={[
                { value: "open", label: "Open" },
                { value: "closed", label: "Closed" },
                { value: "pending", label: "Pending" }
              ]}
              placeholder="Select Status"
            />
          </div>

          <FormInput
            label="Application Deadline"
            type="date"
            value={vacancyForm.deadline}
            onChange={(e) => setVacancyForm({ ...vacancyForm, deadline: e.target.value })}
            required
          />

          <div className="flex gap-2 sm:gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setVacancyModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={isCreating || isUpdating}
            >
              {isCreating ? "Saving..." : isUpdating ? "Updating..." : editingVacancy ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* CATEGORY MODAL */}
      <Modal
        isOpen={categoryModal}
        onClose={() => setCategoryModal(false)}
        title={editingCategory ? "Edit Category" : "Add Category"}
        size="sm"
      >
        <form onSubmit={handleCategorySubmit} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase block mb-1">
              Category Name
            </label>
            <input
              autoFocus
              required
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. IT Department"
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setCategoryModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={isCreatingCat || isUpdatingCat}
            >
              {isCreatingCat ? "Saving..." : isUpdatingCat ? "Updating..." : editingCategory ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleDeleteVacancy}
        title="Delete Vacancy?"
        message="Are you sure you want to delete this vacancy? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default VacancyManagement;