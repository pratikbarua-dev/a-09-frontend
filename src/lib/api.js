import { authClient } from "@/lib/auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ──────────────────────────────────────────────
// JWT Helper — retrieves token from Better Auth
// ──────────────────────────────────────────────
async function getToken() {
  const { data } = await authClient.token();
  return data?.token;
}

// ──────────────────────────────────────────────
// Protected Routes (require JWT)
// ──────────────────────────────────────────────
export async function getProfile() {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }
  return response.json();
}

// ──────────────────────────────────────────────
// Public Routes
// ──────────────────────────────────────────────
export async function getDoctors() {
  const response = await fetch(`${API_BASE_URL}/doctors`);
  if (!response.ok) {
    throw new Error("Failed to fetch doctors");
  }
  return response.json();
}

export async function getDoctorById(id) {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch doctor with id ${id}`);
  }
  return response.json();
}

export async function getAppointments() {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }
  return response.json();
}

export async function createAppointment(appointmentData) {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(appointmentData),
  });
  if (!response.ok) {
    throw new Error("Failed to create appointment");
  }
  return response.json();
}

export async function deleteAppointment(id) {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to delete appointment with id ${id}`);
  }
  return response.json();
}

export async function updateAppointment(id, updatedData) {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error(`Failed to update appointment with id ${id}`);
  }
  return response.json();
}
