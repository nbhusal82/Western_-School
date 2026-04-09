import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TableSkeleton from "../../shared/Skeleton_table";
import Modal from "../../shared/Modal";
import Button, { ActionButtons, AddButton } from "../../shared/Button";
import Table from "../../shared/Table";
import ConfirmDialog from "../../shared/ConfirmDialog";
import { FormInput, FormSelect, FormImageUpload } from "../../shared/FormInput";

import {
  useDelete_blogsMutation,
  useGetblogsQuery,
  useCreate_blogsMutation,
  useUpdate_blogsMutation,
} from "../../redux/feature/content";

import { useGetblog_categoryQuery } from "../../redux/feature/category";
import { FolderOpen } from "lucide-react";
import RichTextEditor from "../../shared/Description";


const BlogManagement = () => {
  const navigate = useNavigate();
  const imgurl = import.meta.env.VITE_BASE_URL;

  // Fetch Data
  const { data: blogRes, isLoading } = useGetblogsQuery();
  const { data: catRes } = useGetblog_categoryQuery();

  const blogs = blogRes?.data || [];
  const categories = catRes?.data || [];

  // Mutations
  const [deleteBlog, { isLoading: isDeleting }] = useDelete_blogsMutation();
  const [createBlog, { isLoading: creating }] = useCreate_blogsMutation();
  const [updateBlog, { isLoading: updating }] = useUpdate_blogsMutation();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Open Add
  const openAdd = () => {
    setEditingBlog(null);
    setTitle("");
    setCategoryId("");
    setDescription("");
    setPublishedDate(new Date().toISOString().split("T")[0]);
    setImageFile(null);
    setIsModalOpen(true);
  };

  // Open Edit
  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setCategoryId(blog.category_id || "");
    setDescription(blog.description || "");
    setPublishedDate(blog.published_date || "");
    setImageFile(null);
    setIsModalOpen(true);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category_id", categoryId);
      formData.append("description", description);
      formData.append("published_date", publishedDate);
      if (imageFile) formData.append("image", imageFile);

      if (editingBlog) {
        await updateBlog({ id: editingBlog.id, data: formData }).unwrap();
      } else {
        await createBlog(formData).unwrap();
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete
  const handleDeleteClick = () => {
    deleteBlog(deleteId);
    setConfirmOpen(false);
    setDeleteId(null);
  };

  // Columns (Vacancy style)
  const columns = [
    {
      header: "Image",
      accessor: "image",
      render: (row) => (
        <img
          src={
            row.image_url ? `${imgurl}/${row.image_url}` : "/placeholder.png"
          }
          className="w-14 h-10 object-cover rounded"
          alt=""
        />
      ),
    },
    {
      header: "Description",
      render: (row) => (
        <div
          className="text-gray-500 text-xs max-w-xs line-clamp-2"
          dangerouslySetInnerHTML={{ __html: row.description }}
        />
      ),
    },
    {
      header: "Category",
      accessor: "category",
      render: (row) =>
        categories.find(
          (c) => String(c.category_id) === String(row.category_id),
        )?.category_name || "N/A",
    },
  ];

  if (isLoading)
    return (
      <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
        <TableSkeleton rows={5} columns={4} />
      </div>
    );

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Blog Management</h1>
          <p className="text-gray-500 text-xs">
            Manage your content and categories
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/admin/blog/category")}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
          >
            <FolderOpen size={16} /> Categories
          </button>

          <AddButton onClick={openAdd} label="Add Blog" />
        </div>
      </div>

      {/* TABLE */}
      <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <Table
          columns={columns}
          data={blogs}
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

      <div className="lg:hidden space-y-3">
        {blogs.map((row, index) => (
          <div key={row.id} className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3 flex-1">
                <img
                  src={row.image_url ? `${imgurl}/${row.image_url}` : "/placeholder.png"}
                  className="w-14 h-10 object-cover rounded shrink-0"
                  alt=""
                />
                <div className="min-w-0">
                  <p className="font-medium text-gray-700 line-clamp-1">{row.title}</p>
                  <span className="text-xs text-gray-500">{categories.find((c) => String(c.category_id) === String(row.category_id))?.category_name || "N/A"}</span>
                  <div className="text-xs text-gray-400 mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: row.description }} />
                </div>
              </div>
              <ActionButtons
                onEdit={() => handleEdit(row)}
                onDelete={() => { setDeleteId(row.id); setConfirmOpen(true); }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBlog ? "Edit Blog" : "Create New Blog"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-4">
            <FormInput
              label="Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a catchy blog title..."
              required
              className="text-gray-800 font-medium"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
              <FormSelect
                label="Category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                options={categories.map((c) => ({
                  value: c.category_id,
                  label: c.category_name,
                }))}
                required
              />
              <FormInput
                label="Published Date"
                type="date"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 pl-1">
              Blog Content
            </label>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all bg-white min-h-[200px]">
              <RichTextEditor
                initialContent={description}
                onChange={(val) => setDescription(val)}
                placeholder="Write your amazing blog description here..."
              />
            </div>
          </div>

          <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100/50">
            <FormImageUpload
              label="Cover Image"
              image={imageFile}
              onImageChange={(e) => setImageFile(e.target.files[0])}
              onImageRemove={() => setImageFile(null)}
              existingImageUrl={editingBlog?.image_url ? `${imgurl}/${editingBlog.image_url}` : null}
              previewShape="rounded-xl"
              previewSize="w-full h-40 object-cover"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
              disabled={creating || updating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 shadow-md shadow-blue-500/20"
              isLoading={creating || updating}
            >
              {creating ? "Publishing..." : updating ? "Updating..." : editingBlog ? "Update Blog" : "Publish Blog"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleDeleteClick}
        title="Delete Blog?"
        message="Are you sure you want to delete this blog? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default BlogManagement;