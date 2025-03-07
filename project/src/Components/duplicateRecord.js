import { DateTime } from "luxon";

const handleDuplicateRecord = (user, navigate) => {
  // Get current Toronto time using Luxon
  const now = DateTime.now().setZone("America/Toronto");
  const formattedDateTime = now.toFormat("yyyy-MM-dd'T'HH:mm"); // "2025-03-07T14:30"
  const formattedDate = now.toFormat("yyyy-MM-dd");             // "2025-03-07"
  const pickUpTime = now.toFormat("HH:mm");                     // "14:30"

  // Build the new data object
  const prefilledData = {
    ...user,
    product: "",       // Clear product field
    remarks: "",       // Clear remarks field
    dateTime: formattedDateTime,
    date: formattedDate,
    pickUpTime: pickUpTime,
  };

  // Navigate to the add record form with the prefilled data in state
  navigate("/addRecord", { state: prefilledData });
};

export default handleDuplicateRecord;
