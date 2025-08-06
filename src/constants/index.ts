const serverMsg = {
  INTERNAL_SERVER_ERROR:
    "Something went wrong on our end. Please try again later.",
  MONGO_ERROR:
    "A database error occurred. Please try again later or contact support.",
  BAD_REQUEST: "Invalid request. Please check your input.",
  INVALID_MONGO_ID:
    "Invalid ID format. Please check the provided ID and try again.",
  PAGE_NOT_FOUND:
    "The page you're looking for doesn't exist or may have been moved.",
};

const userMsg = {
  CREATED: "User account created successfully.",
  CONFLICT:
    "The provided email address is already in use. Please use a different email or log in to your existing account.",
  NOT_FOUND: "Unauthorized: Incorrect email or password.",
  UNAUTHORIZED: "Unauthorized: You are not allowed to access this user's data.",
  NOT_LOGGED_IN: "Unauthorized: You must be logged in to access this resource.",
  TOKEN_INVALID: "Unauthorized: Your session has expired. Please log in again.",
};

const pollMsg = {
  CREATED: "Poll successfully created.",
  CONFLICT:
    "A poll with similar parameters already exists. Please modify your poll or check for duplicates.",
  NOT_FOUND:
    "The poll you are trying to access does not exist or may have been deleted.",
  UPDATED: "Poll updated successfully.",
  DELETED: "Poll deleted successfully.",
};

const optionMsg = {
  NOT_FOUND:
    "The selected option is invalid or no longer available for this poll.",
};

const voteMsg = {
  NOT_FOUND:
    "The vote you are trying to access could not be found. It may not exist or may have been removed.",
};

export { serverMsg, userMsg, pollMsg, optionMsg, voteMsg };
