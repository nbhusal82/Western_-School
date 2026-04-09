import React, { useState } from "react";
import PageHeader from "../shared/PageHeader";
import Table from "../shared/Table";
import Modal from "../shared/Modal";
import Button, {
  AddButton,
  ActionButtons,
  ConfirmDialog,
} from "../shared/Button";
import TableSkeleton from "../shared/Skeleton_table";
import { FormInput, FormTextarea, FormImageUpload } from "../shared/FormInput";
import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetreviewQuery,
  useUpdateReviewMutation,
} from "../redux/feature/siteslice";

const Review = () => {
  const { data: reviewRes, isLoading } = useGetreviewQuery();
  const reviews = reviewRes?.data || reviewRes || [];
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const imgurl = import.meta.env.VITE_IMAGE_URL;

  // States
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    review_text: "",
    image: null,
  });

  const openAddModal = () => {
    setEditingReview(null);
    setFormData({ name: "", position: "", review_text: "", image: null });
    setModalOpen(true);
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      position: review.position,
      review_text: review.review_text,
      image: null,
    });
    setModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteReview(selectedId).unwrap();
      setConfirmOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("position", formData.position);
    data.append("review_text", formData.review_text);
    if (formData.image) data.append("image", formData.image);

    try {
      if (editingReview) {
        await updateReview({ id: editingReview.id, data }).unwrap();
      } else {
        await createReview(data).unwrap();
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Table Columns Setup
  const columns = [
    {
      header: "S.N",
      render: (_, index) => <span className="text-gray-400">{index + 1}</span>,
    },
    {
      header: "Image",
      render: (row) => (
        <img
          src={`${imgurl}/${row.image}`}
          className="w-10 h-10 rounded-full object-cover border"
          alt={row.name}
        />
      ),
    },
    {
      header: "Name",
      accessor: "name",
      cellClassName: "font-medium text-gray-900",
    },
    {
      header: "Position",
      accessor: "position",
      cellClassName: "text-gray-900 font-medium",
    },
    {
      header: "Review",
      accessor: "review_text",
      cellClassName: "text-gray-900 max-w-xs font-medium truncate",
    },
  ];

  if (isLoading)
    return (
      <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
        <PageHeader
          title="Review Management"
          subtitle="Manage customer reviews"
        />
        <TableSkeleton rows={5} columns={6} />
      </div>
    );

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Review Management" subtitle="Manage customer reviews">
        <AddButton onClick={openAddModal} label="Add Review" />
      </PageHeader>

      <div className="hidden lg:block">
        <Table
          columns={columns}
          data={reviews}
          actions={(row) => (
            <ActionButtons
              onEdit={() => handleEdit(row)}
              onDelete={() => handleDeleteClick(row.id)}
            />
          )}
        />
      </div>

      <div className="lg:hidden space-y-3">
        {reviews.map((row, index) => (
          <div key={row.id} className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3 flex-1">
                <img src={`${imgurl}/${row.image}`} className="w-12 h-12 rounded-full object-cover border shrink-0" alt={row.name} />
                <div className="min-w-0">
                  <p className="font-medium text-gray-800">{row.name}</p>
                  <p className="text-xs text-gray-500">{row.position}</p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{row.review_text}</p>
                </div>
              </div>
              <ActionButtons
                onEdit={() => handleEdit(row)}
                onDelete={() => handleDeleteClick(row.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingReview ? "Edit Review" : "Add Review"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <FormInput
            label="Reviewer Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter reviewer name"
            required
          />

          <FormInput
            label="Position/Role"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            placeholder="e.g. Parent, Student"
            required
          />

          <FormTextarea
            label="Review Text"
            value={formData.review_text}
            onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
            placeholder="Write the review..."
            rows={4}
            required
          />

          <FormImageUpload
            label="Profile Photo"
            image={formData.image}
            onImageChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            onImageRemove={() => setFormData({ ...formData, image: null })}
            existingImageUrl={editingReview?.image ? `${imgurl}/${editingReview.image}` : null}
            previewShape="rounded-full"
            previewSize="w-20 h-20"
            hint="PNG, JPG up to 2MB"
          />

          <div className="flex gap-2 sm:gap-3 pt-2">
            <Button
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
              {isCreating ? "Saving..." : isUpdating ? "Updating..." : editingReview ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Review;