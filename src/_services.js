import { saveAs } from "file-saver";
import API_URL from "./apiUrl";
const apiUrl = API_URL;

const supabaseUrl = "https://wlypzkizfdeoxarhajed.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndseXB6a2l6ZmRlb3hhcmhhamVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyOTkzNzEsImV4cCI6MjAyOTg3NTM3MX0.6Fei2GPq_Vd8oB7eOJMXM8eGko6Rdvc-Sn-yPvZog3Q";
const { createClient } = require("@supabase/supabase-js");
// const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const download = async (path) => {
  try {
    const { data, error } = await supabase.storage
      .from("data-dump")
      .download(path);
    if (error) {
      console.error("Error downloading file:", error.message);
      return;
    }
    // console.log(data)
    // Extract the file data and save it using FileSaver.js
    // const fileData = new Blob([data]);
    // saveAs(fileData, path);
  } catch (error) {
    console.error("Error downloading file:", error.message);
  }
};
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const matchValues = (value1, value2) => {
  return value1 === value2 ? true : false;
};

const fetcher = (endpoint, method = "get", body) => {
  const apiUrl = API_URL;
  // console.log("loading...",apiUrl);

  if (method) {
    return fetch(`${apiUrl}/${endpoint}`, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((res) => res)

  } else {
    return fetch(`${apiUrl}/${endpoint}`);
  }
};

const sendEmail = (isHtml, html, subject, text, to) => {
  const email = {
    isHtml: isHtml,
    html: html,
    subject: subject,
    text: "",
    to: to,
  };

  return fetch(`${apiUrl}/send-email`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(email),
  });
};

const renderStatus = (status) => {
  if (
    status === "not-approved" ||
    status === "banned" ||
    status === "declined"
  ) {
    return (
      <small className="bg-danger p-2 text-white rounded text-center">
        {status}
      </small>
    );
  } else if (status === "active") {
    return (
      <small className="bg-success p-2 text-white rounded text-center">
        {status}
      </small>
    );
  }
};

const arrayFilter = (data, field, value) => {
  return data.filter((dt) => dt[field] === value);
};

function generateCode(length) {
  const chars = "0123456789";
  const charsLength = chars.length;

  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsLength);
    code += chars.charAt(randomIndex);
  }

  return code;
}

function formatText(inputText) {
  // Replace ** with #
  inputText = inputText.replace(/\*\*(.*?)\*\*/g, "# $1");

  // Replace \n with new line
  inputText = inputText.replace(/\\n/g, "\\");

  // Replace \"text\" with bold or highlighted
  inputText = inputText.replace(/"([^"]+)"/g, "**$1**");

  // Replace * with underscore list
  inputText = inputText.replace(/\*/g, "-");

  return inputText;
}

export {
  validateEmail,
  matchValues,
  fetcher,
  renderStatus,
  arrayFilter,
  sendEmail,
  generateCode,
  formatText,
  download,
};
