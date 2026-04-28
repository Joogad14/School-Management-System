export default function ConfirmDeleteModal({
  confirmDelete,
  setConfirmDelete,
  handleDelete,
}) {
  if (!confirmDelete) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl space-y-4 text-center">
        <p>Are you sure you want to delete this this record?</p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setConfirmDelete(null)}
            className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              handleDelete(confirmDelete);
              setConfirmDelete(null);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}