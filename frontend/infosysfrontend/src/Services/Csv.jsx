import axios from "axios";

const BASE_URL = "http://localhost:8081";


// ==========================================
// SAVE USER TO CSV
// ==========================================

const saveUserToCsv = async (user) => {

  try {

    const response = await axios.post(
      `${BASE_URL}/csv/user`,
      user
    );

    console.log(response.data);

    return response.data;

  } catch (error) {

    console.error(
      "Error saving user to CSV:",
      error
    );

    throw error;
  }
};


// ==========================================
// SAVE PAYMENT TO CSV
// ==========================================

const savePaymentToCsv = async (payment) => {

  try {

    const response = await axios.post(
      `${BASE_URL}/csv/payment`,
      payment
    );

    console.log(response.data);

    return response.data;

  } catch (error) {

    console.error(
      "Error saving payment to CSV:",
      error
    );

    throw error;
  }
};