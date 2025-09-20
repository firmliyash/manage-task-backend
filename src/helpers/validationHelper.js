import _ from "lodash";

export default function validateJoiData(data, schema, isRequired = true, context = {}) {
  if (!schema)
    return { isError: true, errors: [{ message: "Schema is not valid" }] };
  if (_.isEmpty(data) && isRequired == true)
    return { isError: true, errors: [{ message: "Data is required" }] };

  const options = {
    abortEarly: false, // Collect all errors, not just the first one
  };

  if (!_.isEmpty(context)) {
    options.context = context;
  }
  const { error, value } = schema.validate(data, options);

  if (error) {
    // Extract and format all validation errors
    const formattedErrors = {};
    error.details.forEach((detail) => {
      const path = detail.path.join("."); // Convert path array to string
      formattedErrors[path] = detail.message.replace(/"/g, "");
    });
    return { isError: true, errors: formattedErrors };
  }
  return { isError: false, values: value };
}