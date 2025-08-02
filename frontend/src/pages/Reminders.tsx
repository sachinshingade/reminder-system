import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteReminder, getReminders, Reminder } from "../api/reminder";
import toast from "react-hot-toast";
import ReminderForm from "../components/ReminderForm";

export default function Reminders() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | undefined>(
    undefined
  );

  const {
    data: reminders,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["reminders"],
    queryFn: getReminders
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      toast.success("Reminder deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete reminder");
    }
  });

  const handleCreateReminder = () => {
    setEditingReminder(undefined);
    setIsModalOpen(true);
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReminder(undefined);
  };

  const handleDeleteReminder = (id: string) => {
    if (confirm("Are you sure you want to delete this reminder?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="p-4">Loading reminders...</div>;
  if (isError)
    return <div className="p-4 text-red-600">Failed to load reminders.</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Reminders</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleCreateReminder}
        >
          Add New Reminder
        </button>
      </div>

      {/* Reminder List */}
      <ul className="space-y-3">
        {reminders?.map((reminder) => (
          <li
            key={reminder._id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{reminder.title}</h3>
              <p className="text-sm text-gray-600">{reminder.description}</p>
              <p className="text-sm text-gray-500">
                Time: {new Date(reminder.time).toLocaleString()}
              </p>
            </div>
            <div className="space-x-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                onClick={() => handleEditReminder(reminder)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={() => handleDeleteReminder(reminder._id)}
                disabled={deleteMutation.isPending}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal */}
      <ReminderForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        reminder={editingReminder}
      />
    </div>
  );
}
