const isEmail = (email) =>
  String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

const profileValidator = ({ username, email, role }) => {
  const errors = {
    username: "",
    email: "",
    role: "",
  };

  if (!username) {
    errors.username = "Username is required";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (!isEmail(email)) {
    errors.email = "Invalid Email";
  }

  if (!role) {
    errors.role = "Role is required";
  }

  return errors;
};

export default profileValidator;
