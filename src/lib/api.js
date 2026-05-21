const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getDoctors() {
  const response = await fetch(`${API_BASE_URL}/doctors`);
  if (!response.ok) {
    throw new Error("Failed to fetch doctors");
  }
  return response.json();
}

export async function getDoctorById(id) {
  const response = await fetch(`${API_BASE_URL}/doctors/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch doctor with id ${id}`);
  }
  return response.json();
}

export async function getAppointments() {
  const response = await fetch(`${API_BASE_URL}/appointments`);
  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }
  return response.json();
}

export async function createAppointment(appointmentData) {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointmentData),
  });
  if (!response.ok) {
    throw new Error("Failed to create appointment");
  }
  return response.json();
}

export async function deleteAppointment(id) {
  const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete appointment with id ${id}`);
  }
  return response.json();
}

export async function updateAppointment(id, updatedData) {
  const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error(`Failed to update appointment with id ${id}`);
  }
  return response.json();
}
