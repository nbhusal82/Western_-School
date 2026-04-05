import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TableSkeleton from "../../shared/Skeleton_table";
import Modal from "../../shared/Modal";
import Button, { ActionButtons, AddButton } from "../../shared/Button";
import Table from "../../shared/Table";
import ConfirmDialog from "../../shared/ConfirmDialog";
import { FormInput, FormSelect, FormImageUpload } from "../../shared/FormInput";
import RichTextEditor from "../../shared/Description";

import {
  useDelete_blogsMutation,
  useGetblogsQuery,
  useCreate_blogsMutation,
  useUpdate_blogsMutation,
} from "../../redux/feature/content";

import { useGetblog_categoryQuery } from "../../redux/feature/category";
import { FolderOpen } from "lucide-react";

const BlogManagement = () => {
  const navigate = useNavigate();
  const imgurl = import.meta.env.VITE_BASE_URL;

  // Fetch Data
  const { data: blogRes, isLoading } = useGetblogsQuery();
  const { data: catRes } = useGetblog_categoryQuery();

  const blogs = blogRes?.data || [];
  const categories = catRes?.data || [];

  // Mutations
  const [deleteBlog] = useDelete_blogsMutation();
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
          <h1 className="text-xl font-bold" style={{ color: "var(--color-secondary)" }}>Blog Management</h1>
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
              onDelete={() => { setDeleteId(row.id); setConfirmOpen(true); }}
            />
          )}
        />
      </div>

      {/* MOBILE CARDS */}
      <div className="lg:hidden space-y-3">
        {blogs.map((blog) => {
          const cat = categories.find((c) => String(c.category_id) === String(blog.category_id));
          return (
            <div key={blog.id} className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <img src={blog.image_url ? `${imgurl}/${blog.image_url}` : "/placeholder.png"} className="w-14 h-10 object-cover rounded shrink-0" alt="" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-700 truncate">{blog.title}</p>
                    <span className="text-xs text-gray-500">{cat?.category_name || "N/A"}</span>
                    <div className="text-gray-500 text-xs mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: blog.description }} />
                  </div>
                </div>
                <ActionButtons
                  onEdit={() => handleEdit(blog)}
                  onDelete={() => { setDeleteId(blog.id); setConfirmOpen(true); }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBlog ? "Edit Blog" : "Add Blog"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <FormInput
            label="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title..."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={categories.map(c => ({ value: c.category_id, label: c.category_name }))}
              placeholder="Select Category"
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

          <RichTextEditor
            initialContent={description}
            onChange={(val) => setDescription(val)}
            placeholder="Write blog description..."
          />

          <FormImageUpload
            label="Blog Image"
            image={imageFile}
            onImageChange={(e) => setImageFile(e.target.files[0])}
            onImageRemove={() => setImageFile(null)}
            existingImageUrl={editingBlog?.image_url ? `${imgurl}/${editingBlog.image_url}` : null}
            previewShape="rounded-xl"
            previewSize="w-24 h-24"
            hint="PNG, JPG up to 5MB"
          />

          <div className="flex gap-2 sm:gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="flex-1"
              isLoading={creating || updating}
            >
              {editingBlog ? "Update" : "Publish"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeleteId(null); }}
        onConfirm={handleDeleteClick}
        title="Delete Blog?"
        message="Are you sure you want to delete this blog? This action cannot be undone."
      />
    </div>
  );
};

export default BlogManagement;
