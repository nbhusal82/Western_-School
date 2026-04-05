import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  FolderOpen,
  Filter,
  Calendar,
  ExternalLink,
  Trash2,
} from "lucide-react";
import PageHeader from "../../shared/PageHeader";
import Modal from "../../shared/Modal";
import Button, { AddButton } from "../../shared/Button";
import ConfirmDialog from "../../shared/ConfirmDialog";
import { FormInput, FormSelect, FormFileUpload } from "../../shared/FormInput";

import {
  useDeleteNoticeMutation,
  useGetNoticeQuery,
  useCreateNoticeMutation,
} from "../../redux/feature/content";

import {
  useGetcategory_noticeQuery,
  useCreatecategory_noticeMutation,
  useDeletecategory_noticeMutation,
} from "../../redux/feature/category";

const NoticeManagement = () => {
  const navigate = useNavigate();
  const { data: noticeRes, isLoading } = useGetNoticeQuery();
  const { data: catRes } = useGetcategory_noticeQuery();
  const categories = catRes?.data || catRes || [];
  const [deleteNotice] = useDeleteNoticeMutation();
  const [createNotice, { isLoading: isCreating }] = useCreateNoticeMutation();

  const [createCategory, { isLoading: isCreatingCat }] =
    useCreatecategory_noticeMutation();
  const [deleteCategory] = useDeletecategory_noticeMutation();

  const imageurl = import.meta.env.VITE_IMAGE_URL;

  // Notice Modal States
  const [noticeModal, setNoticeModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    category_id: "",
    notice_date: "",
    attachment: null,
  });

  // Category Modal States
  const [categoryModal, setCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Notice Handlers
  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", noticeForm.title);
    formData.append("category_id", noticeForm.category_id);
    formData.append("notice_date", noticeForm.notice_date);
    if (noticeForm.attachment)
      formData.append("attachment", noticeForm.attachment);

    try {
      await createNotice(formData).unwrap();
      setNoticeForm({
        title: "",
        category_id: "",
        notice_date: "",
        attachment: null,
      });
      setNoticeModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteNotice = async () => {
    try {
      await deleteNotice(deleteId).unwrap();
      setConfirmOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Category Handlers
  const openCategoryModal = () => {
    setCategoryName("");
    setCategoryModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await createCategory({ category_name: categoryName }).unwrap();
      setCategoryModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading)
    return (
      <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
        <PageHeader title="Notices" subtitle="Loading notices..." />
        <div className="grid gap-4 max-w-5xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-4xl border border-gray-100 shadow-sm animate-pulse"
            >
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex h-12 w-12 bg-gray-300 rounded-2xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  const filteredNotices =
    filter === "All"
      ? noticeRes?.data || noticeRes || []
      : (noticeRes?.data || noticeRes || []).filter(
          (n) => String(n.category_id) === String(filter),
        );

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen font-sans">
      <PageHeader title="Notices" subtitle="School Dashboard">
        <button
          onClick={() => navigate("/admin/notice/category")}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 mr-2"
        >
          <FolderOpen size={16} /> Categories
        </button>
        <AddButton onClick={() => setNoticeModal(true)} label="New Notice" />
      </PageHeader>

      {/* FILTER BUTTONS */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setFilter("All")}
          className={`px-5 py-2 rounded-full text-sm font-bold border transition-all whitespace-nowrap ${
            filter === "All"
              ? "text-white shadow-lg shadow-blue-100"
              : "bg-gray-50 text-gray-400 hover:bg-gray-100"
          }`}
          style={filter === "All" ? { backgroundColor: "var(--color-secondary)" } : {}}
        >
          All Notices
        </button>
        {categories.map((cat) => (
          <button
            key={cat.category_id}
            onClick={() => setFilter(cat.category_id)}
            className={`px-5 py-2 rounded-full text-sm font-bold border transition-all whitespace-nowrap ${
              String(filter) === String(cat.category_id)
                ? "text-white shadow-lg shadow-blue-100"
                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
            }`}
            style={String(filter) === String(cat.category_id) ? { backgroundColor: "var(--color-secondary)" } : {}}
          >
            {cat.category_name}
          </button>
        ))}
      </div>

      {/* NOTICE LISTING */}
      <div className="grid gap-4 max-w-5xl">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => {
            const category = categories.find(
              (c) => String(c.category_id) === String(notice.category_id),
            );
            return (
              <div
                key={notice.id}
                className="group bg-white p-5 rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="hidden sm:flex h-12 w-12 rounded-2xl items-center justify-center shrink-0" style={{ backgroundColor: "color-mix(in srgb, var(--color-secondary) 10%, white)", color: "var(--color-secondary)" }}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-white px-2 py-0.5 rounded-md uppercase tracking-tighter" style={{ backgroundColor: "var(--color-secondary)" }}>
                        {category?.category_name || "Notice"}
                      </span>
                      <span className="text-[11px] text-gray-400 font-bold flex items-center gap-1">
                        <Calendar size={12} strokeWidth={3} />{" "}
                        {notice.notice_date?.split("T")[0]}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg transition-colors line-clamp-1 group-hover:text-[var(--color-secondary)]" >
                      {notice.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 p-2 sm:bg-transparent sm:p-0 rounded-2xl justify-end">
                  {notice.attachment_url && (
                    <a
                      href={`${imageurl}/${notice.attachment_url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 bg-white sm:bg-[color-mix(in_srgb,var(--color-secondary)_10%,white)] rounded-xl text-sm font-bold border sm:border-transparent hover:text-white transition-all shadow-sm"
                      style={{ color: "var(--color-secondary)", borderColor: "color-mix(in srgb, var(--color-secondary) 20%, white)" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-secondary)"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--color-secondary) 10%, white)"}
                    >
                      <ExternalLink size={16} /> View
                    </a>
                  )}
                  <button
                    onClick={() => { setDeleteId(notice.id); setConfirmOpen(true); }}
                    className="p-2.5 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold italic">
              No notices found in this category.
            </p>
          </div>
        )}
      </div>

      {/* NOTICE MODAL */}
      <Modal
        isOpen={noticeModal}
        onClose={() => setNoticeModal(false)}
        title="Add New Notice"
        size="md"
      >
        <form onSubmit={handleNoticeSubmit} className="space-y-4 sm:space-y-5">
          <FormInput
            label="Notice Title"
            value={noticeForm.title}
            onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
            placeholder="Enter notice title..."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Category"
              value={noticeForm.category_id}
              onChange={(e) => setNoticeForm({ ...noticeForm, category_id: e.target.value })}
              options={categories.map(cat => ({ value: cat.category_id, label: cat.category_name }))}
              placeholder="Select Category"
              required
            />

            <FormInput
              label="Notice Date"
              type="date"
              value={noticeForm.notice_date}
              onChange={(e) => setNoticeForm({ ...noticeForm, notice_date: e.target.value })}
            />
          </div>

          <FormFileUpload
            label="Attachment (PDF/Image)"
            file={noticeForm.attachment}
            onFileChange={(e) => setNoticeForm({ ...noticeForm, attachment: e.target.files[0] })}
            onFileRemove={() => setNoticeForm({ ...noticeForm, attachment: null })}
            accept=".pdf,.jpg,.jpeg,.png"
            hint="PDF, PNG, JPG up to 10MB"
          />

          <div className="flex gap-2 sm:gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setNoticeModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isCreating}>
              Publish
            </Button>
          </div>
        </form>
      </Modal>

      {/* CATEGORY MODAL */}
      <Modal
        isOpen={categoryModal}
        onClose={() => setCategoryModal(false)}
        title="Add Category"
        size="sm"
      >
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <FormInput
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="e.g. Academic"
            required
          />

          <div className="flex gap-2 sm:gap-3 pt-1">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setCategoryModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isCreatingCat}>
              Save
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeleteId(null); }}
        onConfirm={handleDeleteNotice}
        title="Delete Notice?"
        message="Are you sure you want to delete this notice? This action cannot be undone."
      />
    </div>
  );
};

export default NoticeManagement;
