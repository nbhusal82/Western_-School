import React, { useState } from "react";
import PageHeader from "../shared/PageHeader";
import Table from "../shared/Table";
import Modal from "../shared/Modal";
import Button, { AddButton, ActionButtons } from "../shared/Button";
import TableSkeleton from "../shared/Skeleton_table";
import ConfirmDialog from "../shared/ConfirmDialog";
import { FormInput, FormTextarea } from "../shared/FormInput";
import {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} from "../redux/feature/siteslice";

const FAQPage = () => {
  const { data: faqRes, isLoading } = useGetFaqsQuery();
  const faqs = faqRes?.data || faqRes || [];
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const openAddModal = () => {
    setEditingFaq(null);
    setFormData({ question: "", answer: "" });
    setModalOpen(true);
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({ question: faq.question, answer: faq.answer });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteFaq(deleteId).unwrap();
      setConfirmOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: "S.N", render: (_, index) => <span className="text-gray-400">{index + 1}</span> },
    { header: "Question", accessor: "question", cellClassName: "font-medium text-gray-700 max-w-xs" },
    { header: "Answer", accessor: "answer", cellClassName: "text-gray-500 max-w-sm truncate" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await updateFaq({ id: editingFaq._id || editingFaq.id, data: formData }).unwrap();
      } else {
        await createFaq(formData).unwrap();
      }
      setModalOpen(false);
    } catch (err) { console.error(err); }
  };

  if (isLoading) return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <PageHeader title="FAQ Management" subtitle="Manage frequently asked questions" />
      <TableSkeleton rows={5} columns={4} />
    </div>
  );

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <PageHeader title="FAQ Management" subtitle="Manage frequently asked questions">
        <AddButton onClick={openAddModal} label="Add FAQ" />
      </PageHeader>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block">
        <Table
          columns={columns}
          data={faqs}
          actions={(row) => (
            <ActionButtons
              onEdit={() => handleEdit(row)}
              onDelete={() => { setDeleteId(row._id || row.id); setConfirmOpen(true); }}
            />
          )}
        />
      </div>

      {/* MOBILE CARDS */}
      <div className="lg:hidden space-y-3">
        {faqs.map((faq, index) => (
          <div key={faq._id || faq.id} className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex justify-between items-start gap-2">
              <span className="text-xs text-gray-400 shrink-0">#{index + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-700 text-sm">{faq.question}</p>
                <p className="text-gray-500 text-xs mt-1 line-clamp-2">{faq.answer}</p>
              </div>
              <ActionButtons
                onEdit={() => handleEdit(faq)}
                onDelete={() => { setDeleteId(faq._id || faq.id); setConfirmOpen(true); }}
              />
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingFaq ? "Edit FAQ" : "Add FAQ"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <FormInput
            label="Question"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            placeholder="Enter your question..."
            required
          />

          <FormTextarea
            label="Answer"
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            placeholder="Write the answer..."
            rows={4}
            required
          />

          <div className="flex gap-2 sm:gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isCreating || isUpdating}>
              {editingFaq ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeleteId(null); }}
        onConfirm={handleDelete}
        title="Delete FAQ?"
        message="Are you sure you want to delete this FAQ? This action cannot be undone."
      />
    </div>
  );
};

export default FAQPage;
