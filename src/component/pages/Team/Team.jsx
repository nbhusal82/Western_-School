import React, { useState } from "react";
import { Users, Pencil, Trash2, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableSkeleton from "../../shared/Skeleton_table";
import PageHeader from "../../shared/PageHeader";
import Modal from "../../shared/Modal";
import Table from "../../shared/Table";
import Button, {
  AddButton,
  ActionButtons,
  ConfirmDialog,
} from "../../shared/Button";
import { FormInput, FormSelect, FormImageUpload } from "../../shared/FormInput";

import {
  useCreateTeamMutation,
  useDeleteTeamMutation,
  useGetTeamQuery,
  useUpdateTeamMutation,
} from "../../redux/feature/siteslice";
import { useGet_team_categoryQuery } from "../../redux/feature/category";

const Team = () => {
  const navigate = useNavigate();

  // 1. Data Fetching
  const { data: teamRes, isLoading } = useGetTeamQuery();
  const teamMembers = teamRes?.data || teamRes || [];
  const { data: catRes } = useGet_team_categoryQuery();
  const categories = catRes?.data || catRes || [];

  const [createMember, { isLoading: isCreating }] = useCreateTeamMutation();
  const [updateMember, { isLoading: isUpdating }] = useUpdateTeamMutation();
  const [deleteMember, { isLoading: isDeleting }] = useDeleteTeamMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const imgurl = import.meta.env.VITE_IMAGE_URL;

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    position: "",
    number: "",
    email: "",
    category_id: "",
    is_main: 0,
    image: null,
  });

  // 2. Filter Logic
  const filteredMembers =
    selectedCategory === "All"
      ? teamMembers
      : teamMembers.filter(
          (m) => String(m.category_id) === String(selectedCategory),
        );

  // 3. Edit / Delete Handlers
  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      position: member.position,
      number: member.number || "",
      email: member.email || "",
      category_id: member.category_id,
      is_main: member.is_main,
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
      await deleteMember(selectedId).unwrap();
      setConfirmOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append("name", formData.name);
    data.append("position", formData.position);
    data.append("role", formData.role);
    data.append("number", formData.number);
    data.append("category_id", formData.category_id);
    if (formData.email) data.append("email", formData.email);
    data.append("is_main", formData.is_main || 0);
    if (formData.image) data.append("image", formData.image);

    try {
      if (editingMember) {
        await updateMember({ id: editingMember.id, data }).unwrap();
      } else {
        await createMember(data).unwrap();
      }
      setModalOpen(false);
      setEditingMember(null);
      setFormData({
        name: "",
        role: "",
        position: "",
        number: "",
        email: "",
        category_id: "",
        is_main: 0,
        image: null,
      });
    } catch (err) {
      console.error("Error saving team member:", err);
      const errorMsg = err?.data?.message || err?.message || "Failed to save. Please try again.";
      alert(`Error: ${errorMsg}`);
    }
  };

  // 5. Table Columns Setup
  const columns = [
    {
      header: "ID",
      render: (row) => (
        <span className="text-gray-400 font-mono text-xs">#{row.id}</span>
      ),
    },
    {
      header: "Member",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={`${imgurl}/${row.image}`}
            className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
            alt={row.name}
          />
          <span className="font-bold text-gray-700">{row.name}</span>
        </div>
      ),
    },
    { header: "Position", accessor: "position" },
    {
      header: "Category",
      render: (row) => {
        const cat = categories.find(
          (c) => String(c.category_id || c.id) === String(row.category_id),
        );
        return (
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider" style={{ color: "var(--color-secondary)", backgroundColor: "color-mix(in srgb, var(--color-secondary) 10%, white)" }}>
            {cat?.category_name || cat?.name || "Uncategorized"}
          </span>
        );
      },
    },
    {
      header: "Contact",
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-gray-600">{row.number || "No Phone"}</p>
          <p className="text-gray-400 lowercase">{row.email || "No Email"}</p>
        </div>
      ),
    },
  ];

  if (isLoading)
    return (
      <div className="p-3 sm:p-6">
        <TableSkeleton rows={8} columns={6} />
      </div>
    );

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <PageHeader
        title="Team Members"
        subtitle={`Managing ${teamMembers.length} staff members`}
      >
        <button
          onClick={() => navigate("/admin/team/category")}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 mr-2"
        >
          <FolderOpen size={16} /> Categories
        </button>
        <AddButton
          onClick={() => {
            setEditingMember(null);
            setModalOpen(true);
          }}
          label="Add Member"
        />
      </PageHeader>

      {/* FILTER TABS */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2.5 rounded-2xl shadow-sm border border-gray-100">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            selectedCategory === "All"
              ? "text-white shadow-lg"
              : "bg-gray-50 text-gray-400 hover:bg-gray-100"
          }`}
          style={selectedCategory === "All" ? { backgroundColor: "var(--color-secondary)" } : {}}
        >
          All Members
        </button>
        {categories.map((cat) => {
          const catId = cat.category_id || cat.id;
          const catName = cat.category_name || cat.name;
          return (
            <button
              key={catId}
              onClick={() => setSelectedCategory(catId)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                String(selectedCategory) === String(catId)
                  ? "text-white shadow-lg"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              }`}
              style={String(selectedCategory) === String(catId) ? { backgroundColor: "var(--color-secondary)" } : {}}
            >
              {catName}
            </button>
          );
        })}
      </div>

      {/* DATA TABLE */}
      <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <Table
          columns={columns}
          data={filteredMembers}
          actions={(row) => (
            <ActionButtons
              onEdit={() => handleEdit(row)}
              onDelete={() => handleDeleteClick(row.id)}
            />
          )}
        />
      </div>

      {/* MOBILE CARDS */}
      <div className="lg:hidden space-y-3">
        {filteredMembers.map((member) => {
          const cat = categories.find((c) => String(c.category_id || c.id) === String(member.category_id));
          return (
            <div key={member.id} className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img src={`${imgurl}/${member.image}`} className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm shrink-0" alt={member.name} />
                  <div className="min-w-0">
                    <p className="font-bold text-gray-700 truncate">{member.name}</p>
                    <p className="text-xs text-gray-500 truncate">{member.position}</p>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-lg uppercase" style={{ color: "var(--color-secondary)", backgroundColor: "color-mix(in srgb, var(--color-secondary) 10%, white)" }}>
                      {cat?.category_name || cat?.name || "Uncategorized"}
                    </span>
                  </div>
                </div>
                <ActionButtons
                  onEdit={() => handleEdit(member)}
                  onDelete={() => handleDeleteClick(member.id)}
                />
              </div>
              <div className="mt-2 text-xs text-gray-500 flex gap-3">
                <span>{member.number || "No Phone"}</span>
                <span className="truncate">{member.email || "No Email"}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD/EDIT MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMember ? "Update Staff Info" : "Register New Staff"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <FormInput
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter full name"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Position"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              placeholder="e.g. Principal"
              required
            />

            <FormSelect
              label="Role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              options={[
                { value: "teacher", label: "Teacher" },
                { value: "committee", label: "Committee" }
              ]}
              placeholder="Select Role"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Phone Number"
              value={formData.number}
              onChange={(e) =>
                setFormData({ ...formData, number: e.target.value })
              }
              placeholder="e.g. 9812345678"
              required
            />

            <FormInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="email@example.com"
            />
          </div>

          <FormSelect
            label="Category"
            value={formData.category_id}
            onChange={(e) =>
              setFormData({ ...formData, category_id: e.target.value })
            }
            options={categories.map((c) => ({
              value: c.category_id || c.id,
              label: c.category_name || c.name,
            }))}
            placeholder="Choose Category"
            required
          />

          <FormImageUpload
            label="Profile Photo"
            image={formData.image}
            onImageChange={(e) =>
              setFormData({ ...formData, image: e.target.files[0] })
            }
            onImageRemove={() => setFormData({ ...formData, image: null })}
            existingImageUrl={
              editingMember?.image ? `${imgurl}/${editingMember.image}` : null
            }
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
              {editingMember ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Team;
