import React, { useState } from "react";
import TableSkeleton from "../../shared/Skeleton_table";
import Modal from "../../shared/Modal";
import PageHeader from "../../shared/PageHeader";
import Table from "../../shared/Table";
import Button, { AddButton, ActionButtons } from "../../shared/Button";
import ConfirmDialog from "../../shared/ConfirmDialog";
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormImageUpload,
} from "../../shared/FormInput";

import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useGetEventQuery,
  useUpdateEventMutation,
} from "../../redux/feature/academic";

const Event = () => {
  const { data, isLoading, refetch } = useGetEventQuery();
  const events = data?.data || [];

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const imageurl = import.meta.env.VITE_IMAGE_URL;

  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    id: null,
    title: "",
    category: "",
    description: "",
    event_date: "",
    pdf_url: "",
    image: null,
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const getImagePath = (item) =>
    item?.image_url || item?.pdf_url || item?.image_urls || "";

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("event_date", form.event_date);

    if (form.image) {
      formData.append("images", form.image);
    }

    try {
      if (editMode) {
        await updateEvent({ id: form.id, data: formData }).unwrap();
      } else {
        await createEvent(formData).unwrap();
      }

      handleCloseModal();
      refetch(); // 🔥 important
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Something went wrong!");
    }
  };

  // ✅ EDIT
  const handleEdit = (event) => {
    setForm({
      id: event.id,
      title: event.title,
      category: event.category,
      description: event.description,
      event_date: event.event_date?.split("T")[0],
      pdf_url: getImagePath(event),
      image: null,
    });

    setEditMode(true);
    setModal(true);
  };

  // ✅ CLOSE MODAL
  const handleCloseModal = () => {
    setModal(false);
    setEditMode(false);

    setForm({
      id: null,
      title: "",
      category: "",
      description: "",
      event_date: "",
      pdf_url: "",
      image: null,
    });
  };

  // ✅ DELETE
  const handleDelete = async () => {
    try {
      await deleteEvent(deleteId).unwrap();
      setConfirmOpen(false);
      setDeleteId(null);
      refetch();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // ✅ LOADING
  if (isLoading)
    return (
      <div className="p-6">
        <PageHeader title="Events Management">
          <AddButton onClick={() => setModal(true)} label="Add Event" />
        </PageHeader>
        <TableSkeleton rows={5} columns={6} />
      </div>
    );

  // ✅ TABLE COLUMNS
  const columns = [
    {
      header: "S.N",
      render: (row, index) => index + 1,
    },
    {
      header: "Title",
      render: (row) => row.title,
    },
    {
      header: "Category",
      render: (row) => row.category,
    },
    {
      header: "Date",
      render: (row) =>
        row.event_date ? new Date(row.event_date).toLocaleDateString() : "-",
    },
    {
      header: "Image",
      render: (row) =>
        getImagePath(row) ? (
          <img
            src={`${imageurl}/${getImagePath(row)}`}
            alt={row.title || "event"}
            className="w-14 h-10 object-cover rounded"
          />
        ) : (
          "No Image"
        ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader title="Events Management">
        <AddButton onClick={() => setModal(true)} label="Add Event" />
      </PageHeader>

      <Table
        columns={columns}
        data={events}
        actions={(row) => (
          <ActionButtons
            onEdit={() => handleEdit(row)}
            onDelete={() => {
              setDeleteId(row.id);
              setConfirmOpen(true);
            }}
          />
        )}
      />

      {/* ✅ MODAL */}
      <Modal
        isOpen={modal}
        onClose={handleCloseModal}
        title={editMode ? "Edit Event" : "Add Event"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <FormSelect
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={[
              { value: "Monthly", label: "Monthly" },
              { value: "Yearly", label: "Yearly" },
            ]}
            placeholder="Select category"
            required
          />

          <FormInput
            type="date"
            label="Date"
            value={form.event_date}
            onChange={(e) => setForm({ ...form, event_date: e.target.value })}
            required
          />

          <FormTextarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <FormImageUpload
            label="Image"
            image={form.image}
            onImageChange={(e) =>
              setForm({ ...form, image: e.target.files[0] })
            }
            onImageRemove={() => setForm({ ...form, image: null })}
            existingImageUrl={
              editMode && form.pdf_url ? `${imageurl}/${form.pdf_url}` : null
            }
          />

          <div className="flex gap-2">
            <Button onClick={handleCloseModal} variant="outline">
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreating || isUpdating}>
              {editMode ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ✅ DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Event?"
        message="Are you sure?"
      />
    </div>
  );
};

export default Event;
