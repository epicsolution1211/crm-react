import toast from "react-hot-toast";

export const copyToClipboard = (text, alert = "Successfully copied!") => {
  navigator.clipboard.writeText(text ?? "")
  toast.success(alert);
};