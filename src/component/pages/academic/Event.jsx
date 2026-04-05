import React, { useState } from "react";
import { Calendar } from "lucide-react";
import TableSkeleton from "../../shared/Skeleton_table";
import Modal from "../../shared/Modal";
import PageHeader from "../../shared/PageHeader";
import Table from "../../shared/Table";
import { AddButton, ActionButtons } from "../../shared/Button";
import ConfirmDialog from "../../shared/ConfirmDialog";
import {
  FormInput,
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
  const { data, isLoading } = useGetEventQuery();
  const events = data?.data || [];
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();
  const imageurl = import.meta.env.VITE_IMAGE_URL;

  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    event_date: "",
    pdf_url: "",
    image: null,
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("event_date", form.event_date);
    if (form.image) {
      formData.append("image", form.image);
    } else if (form.pdf_url) {
      formData.append("pdf_url", form.pdf_url);
    }

    if (editMode) {
      await updateEvent({ id: form.id, data: formData }).unwrap();
    } else {
      await createEvent(formData).unwrap();
    }
    handleCloseModal();
  };

  const handleEdit = (event) => {
    setForm({ ...event, image: null });
    setEditMode(true);
    setModal(true);
  };

  const handleCloseModal = () => {
    setModal(false);
    setEditMode(false);
    setForm({
      title: "",
      category: "",
      description: "",
      event_date: "",
      pdf_url: "",
      image: null,
    });
  };

  const handleDelete = async () => {
    try {
      await deleteEvent(deleteId).unwrap();
      setConfirmOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading)
    return (
      <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
        <PageHeader title="Events Management" subtitle="Manage school events" />
        <div className="hidden lg:block">
          <TableSkeleton rows={5} columns={7} />
        </div>
        <div className="lg:hidden space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border p-4 animate-pulse"
            >
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  const columns = [
    {
      header: "S.N",
      accessor: "id",
      render: (row, index) => (
        <span className="text-gray-400">{index + 1}</span>
      ),
    },
    {
      header: "Title",
      accessor: "title",
      render: (row) => (
        <span className="font-medium text-gray-700">{row.title}</span>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      render: (row) => (
        <span
          className="px-2 py-0.5 rounded-full text-xs"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-secondary) 15%, white)",
            color: "var(--color-secondary)",
          }}
        >
          {row.category}
        </span>
      ),
    },
    {
      header: "Description",
      accessor: "description",
      render: (row) => (
        <span className="text-gray-500 max-w-xs truncate block">
          {row.description}
        </span>
      ),
    },
    {
      header: "Date",
      accessor: "event_date",
      render: (row) => (
        <div className="flex items-center gap-1 text-gray-500">
          <Calendar size={13} className="text-gray-400" />
          {new Date(row.event_date).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: "Image",
      accessor: "pdf_url",
      render: (row) => (
        <img
          src={`${imageurl}/${row.pdf_url}`}
          alt="event"
          className="w-12 h-9 object-cover rounded"
        />
      ),
    },
  ];

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Events Management" subtitle="Manage school events">
        <AddButton onClick={() => setModal(true)} label="Add Event" />
      </PageHeader>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block">
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
      </div>

      {/* MOBILE CARDS */}
      <div className="lg:hidden space-y-3">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-sm border p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-400">#{index + 1}</span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--color-secondary) 15%, white)",
                      color: "var(--color-secondary)",
                    }}
                  >
                    {event.category}
                  </span>
                </div>
                <h3 className="font-medium text-gray-700 mb-1">
                  {event.title}
                </h3>
              </div>
              <ActionButtons
                onEdit={() => handleEdit(event)}
                onDelete={() => {
                  setDeleteId(event.id);
                  setConfirmOpen(true);
                }}
              />
            </div>
            <div className="flex items-start gap-3">
              <img
                src={`${imageurl}/${event.pdf_url}`}
                alt="event"
                className="w-16 h-12 object-cover rounded shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                  {event.description}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar size={13} className="text-gray-400" />
                  {new Date(event.event_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modal}
        onClose={handleCloseModal}
        title={editMode ? "Edit Event" : "Add Event"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <FormInput
            label="Event Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Enter event title"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Sports, Cultural"
              required
            />

            <FormInput
              label="Event Date"
              type="date"
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              required
            />
          </div>

          <FormTextarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Write event description..."
            rows={4}
            required
          />

          <FormImageUpload
            label="Event Image"
            image={form.image}
            onImageChange={(e) =>
              setForm({ ...form, image: e.target.files[0] })
            }
            onImageRemove={() => setForm({ ...form, image: null })}
            existingImageUrl={
              editMode && form.pdf_url ? `${imageurl}/${form.pdf_url}` : null
            }
            previewShape="rounded-xl"
            previewSize="w-24 h-24"
            hint="PNG, JPG up to 5MB"
          />

          <div className="flex gap-2 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 py-2.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="flex-1 text-white py-2.5 rounded-xl text-sm font-medium shadow-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--color-secondary)" }}
            >
              {isCreating || isUpdating
                ? editMode
                  ? "Updating..."
                  : "Adding..."
                : editMode
                  ? "Update"
                  : "Save"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleDelete}
        title="Delete Event?"
        message="Are you sure you want to delete this event? This action cannot be undone."
      />
    </div>
  );
};

export default Event;
