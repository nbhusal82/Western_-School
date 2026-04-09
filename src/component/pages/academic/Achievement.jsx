import React, { useState } from "react";
import { Award, Calendar, ImageIcon } from "lucide-react";
import PageHeader from "../../shared/PageHeader";
import Modal from "../../shared/Modal";
import Button, { AddButton, ActionButtons } from "../../shared/Button";
import ConfirmDialog from "../../shared/ConfirmDialog";
import { FormInput, FormTextarea, FormImageUpload } from "../../shared/FormInput";
import {
  useCreateachievementMutation,
  useDeleteachievementMutation,
  useGetachievementQuery,
  useUpdateachievementMutation,
} from "../../redux/feature/academic";

const Achievement = () => {
  const { data: response = [], isLoading: isFetching } = useGetachievementQuery();
  const achievements = response?.data || response;

  const [createAch, { isLoading: isCreating }] = useCreateachievementMutation();
  const [updateAch, { isLoading: isUpdating }] = useUpdateachievementMutation();
  const [deleteAch, { isLoading: isDeleting }] = useDeleteachievementMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState(null);
  const imgurl = import.meta.env.VITE_IMAGE_URL;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    achievement_date: "",
    image: null,
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const openAddModal = () => {
    setEditingAch(null);
    setFormData({ title: "", description: "", achievement_date: "", image: null });
    setModalOpen(true);
  };

  const handleEdit = (ach) => {
    setEditingAch(ach);
    setFormData({
      title: ach.title,
      description: ach.description || "",
      achievement_date: ach.achievement_date ? ach.achievement_date.split("T")[0] : "",
      image: null,
    });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteAch(deleteId).unwrap();
      setConfirmOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("achievement_date", formData.achievement_date);
    if (formData.image) data.append("images", formData.image);

    try {
      if (editingAch) {
        await updateAch({ id: editingAch.id, data }).unwrap();
      } else {
        await createAch(data).unwrap();
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (isFetching)
    return (
      <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
        <PageHeader title="School Achievements" subtitle="Showcase awards and milestones" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-300"></div>
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <PageHeader title="School Achievements" subtitle="Showcase awards and milestones">
        <AddButton onClick={openAddModal} label="Add New" />
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => (
          <div key={ach.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition group flex flex-col">
            <div className="relative h-40 bg-gray-200">
              <img src={`${imgurl}/${ach.image_urls}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase mb-1">
                <Calendar size={12} />
                {new Date(ach.achievement_date).toLocaleDateString()}
              </div>
              <h3 className="font-bold text-gray-800 line-clamp-1">{ach.title}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2 h-8">{ach.description}</p>
              <div className="mt-3 flex justify-end border-t border-gray-50 pt-3">
                <ActionButtons onEdit={() => handleEdit(ach)} onDelete={() => { setDeleteId(ach.id); setConfirmOpen(true); }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingAch ? "Edit Achievement" : "Add New Achievement"} size="md">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <FormInput
            label="Achievement Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Best School Award 2024"
            required
          />

          <FormTextarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Write a brief detail..."
            rows={3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Achievement Date"
              type="date"
              value={formData.achievement_date}
              onChange={(e) => setFormData({ ...formData, achievement_date: e.target.value })}
              required
            />

            <FormImageUpload
              label="Upload Image"
              image={formData.image}
              onImageChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              onImageRemove={() => setFormData({ ...formData, image: null })}
              existingImageUrl={editingAch?.image_urls ? `${imgurl}/${editingAch.image_urls}` : null}
              previewShape="rounded-xl"
              previewSize="w-20 h-20"
              hint="PNG, JPG up to 2MB"
            />
          </div>

          <div className="flex gap-2 sm:gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)} disabled={isCreating || isUpdating}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isCreating || isUpdating}>
              {isCreating ? "Saving..." : isUpdating ? "Updating..." : editingAch ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeleteId(null); }}
        onConfirm={handleDelete}
        title="Delete Achievement?"
        message="Are you sure you want to delete this achievement? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Achievement;