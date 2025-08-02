import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { createReminder, updateReminder, Reminder } from "../api/reminder";
import { useEffect } from "react";

const reminderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  time: z.string().refine((val) => {
    if (!val) return false;
    return new Date(val).getTime() > Date.now();
  }, "Time must be in the future")
});

type ReminderFormValues = z.infer<typeof reminderSchema>;

interface ReminderFormProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly reminder?: Reminder;
}

export default function ReminderForm({
  isOpen,
  onClose,
  reminder
}: ReminderFormProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: "",
      description: "",
      time: ""
    }
  });

  // Reset form with reminder values when editing
  useEffect(() => {
    if (isOpen && reminder) {
      reset({
        title: reminder.title,
        description: reminder.description || "",
        time: reminder.time.slice(0, 16)
      });
    } else if (isOpen && !reminder) {
      reset({
        title: "",
        description: "",
        time: ""
      });
    }
  }, [isOpen, reminder, reset]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  const mutation = useMutation({
    mutationFn: (data: ReminderFormValues) =>
      reminder ? updateReminder(reminder._id, data) : createReminder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      reset();
      toast.success(
        `Reminder ${reminder ? "updated" : "created"} successfully!`
      );
      onClose();
    }
  });

  if (!isOpen) return null;

  const loadingText = reminder ? "Updating..." : "Creating...";
  const buttonText = reminder ? "Update" : "Create";

  return (
    <div className="fixed inset-0 modal-overlay-bg flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-xl font-bold mb-4">
          {reminder ? "Update Reminder" : "Create New Reminder"}
        </h2>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <div>
            <input
              {...register("title")}
              className="border rounded p-2 w-full focus:ring focus:ring-blue-200"
              placeholder="Title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("description")}
              className="border rounded p-2 w-full focus:ring focus:ring-blue-200"
              placeholder="Description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="datetime-local"
              {...register("time")}
              className="border rounded p-2 w-full focus:ring focus:ring-blue-200"
            />
            {errors.time && (
              <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? loadingText : buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
