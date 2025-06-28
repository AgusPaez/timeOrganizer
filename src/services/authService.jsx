import axios from "../utils/api";

const login = async (email, password) => {
  const res = await axios.post("/auth/login", { email, password });
  return res.data;
};

export default { login };
