import React, { useState } from "react";
import PageHeader from "../../shared/PageHeader";
import Table from "../../shared/Table";
import Modal from "../../shared/Modal";
import Button, { AddButton, ActionButtons } from "../../shared/Button";
import TableSkeleton from "../../shared/Skeleton_table";
import ConfirmDialog from "../../shared/ConfirmDialog";
import {
  FormInput,
  FormTextarea,
  FormFileUpload,
} from "../../shared/FormInput";
import {
  useCreatequestion_bankMutation,
  useDeletequestion_bankMutation,
  useGetquestion_bankQuery,
  useUpdatequestion_bankMutation,
} from "../../redux/feature/academic";

const QuestionBankAdmin = () => {
  const { data, isLoading } = useGetquestion_bankQuery();
  const questions = data?.data || [];
  const [createQuestion, { isLoading: isCreating }] =
    useCreatequestion_bankMutation();
  const [updateQuestion, { isLoading: isUpdating }] =
    useUpdatequestion_bankMutation();
  const [deleteQuestion, { isLoading: isDeleting }] = useDeletequestion_bankMutation();
  const baseurl = import.meta.env.VITE_BASE_URL;

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    class_level: "",
    year: "",
    description: "",
    file: null,
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const openModal = (question = null) => {
    setEditing(question);
    setForm(
      question
        ? {
          title: question.title,
          subject: question.subject,
          class_level: question.class_level,
          year: question.year,
          description: question.description,
          file: null,
        }
        : {
          title: "",
          subject: "",
          class_level: "",
          year: "",
          description: "",
          file: null,
        },
    );
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("subject", form.subject);
    formData.append("class_level", form.class_level);
    formData.append("year", form.year);
    formData.append("description", form.description);
    if (form.file) formData.append("file", form.file);
    try {
      if (editing) {
        await updateQuestion({ id: editing.id, data: formData }).unwrap();
      } else {
        await createQuestion(formData).unwrap();
      }
      setModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteQuestion(deleteId).unwrap();
      setConfirmOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      header: "S.N",
      render: (_, index) => <span className="text-gray-400">{index + 1}</span>,
    },
    {
      header: "Title",
      accessor: "title",
      cellClassName: "font-medium text-gray-700",
    },
    {
      header: "Subject",
      render: (row) => (
        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs">
          {row.subject}
        </span>
      ),
    },
    {
      header: "Class",
      accessor: "class_level",
      cellClassName: "text-gray-500",
    },
    { header: "Year", accessor: "year", cellClassName: "text-gray-500" },
    {
      header: "File",
      render: (row) =>
        row.file_type === "pdf" ? (
          <a
            href={`${baseurl}/${row.file_url}`}
            target="_blank"
            className="text-blue-600 underline text-xs"
          >
            View PDF
          </a>
        ) : (
          <span className="text-gray-400 text-xs">No file</span>
        ),
    },
  ];

  if (isLoading)
    return (
      <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
        <PageHeader
          title="Question Bank"
          subtitle="Manage question papers and resources"
        />
        <TableSkeleton rows={5} columns={7} />
      </div>
    );

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <PageHeader
        title="Question Bank"
        subtitle="Manage question papers and resources"
      >
        <AddButton onClick={() => openModal()} label="Add Question" />
      </PageHeader>

      <div className="hidden lg:block">
        <Table
          columns={columns}
          data={questions}
          actions={(row) => (
            <ActionButtons
              onEdit={() => openModal(row)}
              onDelete={() => {
                setDeleteId(row.id);
                setConfirmOpen(true);
              }}
            />
          )}
        />
      </div>

      <div className="lg:hidden space-y-3">
        {questions.map((row, index) => (
          <div key={row.id} className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <span className="text-xs text-gray-400">#{index + 1}</span>
                <h3 className="font-medium text-gray-700">{row.title}</h3>
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs">{row.subject}</span>
              </div>
              <ActionButtons
                onEdit={() => openModal(row)}
                onDelete={() => { setDeleteId(row.id); setConfirmOpen(true); }}
              />
            </div>
            <div className="flex gap-3 text-xs text-gray-500 mt-2">
              <span>Class: {row.class_level}</span>
              <span>Year: {row.year}</span>
              {row.file_type === "pdf" && (
                <a href={`${baseurl}/${row.file_url}`} target="_blank" className="text-blue-600 underline">View PDF</a>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modal}
        onClose={() => setModal(false)}
        title={editing ? "Edit Question" : "Add Question"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <FormInput
            label="Question Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Enter question title"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="e.g. Math"
              required
            />

            <FormInput
              label="Class Level"
              value={form.class_level}
              onChange={(e) =>
                setForm({ ...form, class_level: e.target.value })
              }
              placeholder="e.g. 10"
              required
            />

            <FormInput
              label="Year"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              placeholder="e.g. 2024"
              required
            />
          </div>

          <FormTextarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Write description..."
            rows={3}
            required
          />

          <FormFileUpload
            label="Question File (PDF)"
            file={form.file}
            onFileChange={(e) => setForm({ ...form, file: e.target.files[0] })}
            onFileRemove={() => setForm({ ...form, file: null })}
            accept=".pdf"
            hint="PDF up to 10MB"
          />

          <div className="flex gap-2 sm:gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={isCreating || isUpdating}
            >
              {isCreating ? "Saving..." : isUpdating ? "Updating..." : editing ? "Update" : "Save"}
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
        onConfirm={handleDelete}
        title="Delete Question?"
        message="Are you sure you want to delete this question? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default QuestionBankAdmin;