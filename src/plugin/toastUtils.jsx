import { toast } from "react-hot-toast";

export const showToast = (message, variant) => {
  switch (variant) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    default:
      toast(message);
      break;
  }
};
