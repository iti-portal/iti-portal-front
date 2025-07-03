export function validatePersonalInfo(formData) {
  const errs = {};
  if (formData.role === 'student') {
    if (!formData.firstName) {
      errs.firstName = 'First name is required';
    } else if (formData.firstName.length > 255) {
      errs.firstName = 'First name must be less than 256 characters';
    }
    if (!formData.lastName) {
      errs.lastName = 'Last name is required';
    } else if (formData.lastName.length > 255) {
      errs.lastName = 'Last name must be less than 256 characters';
    }
    if (!formData.username) {
      errs.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errs.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 50) {
      errs.username = 'Username must be less than 51 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errs.username = 'Username can only contain letters, numbers, and underscores';
    }
    if (!formData.phone) {
      errs.phone = 'Phone is required';
    } else if (formData.phone.length > 20) {
      errs.phone = 'Phone must be less than 21 characters';
    }
    if (!formData.branch) {
      errs.branch = 'ITI branch is required';
    }
    if (!formData.program) {
      errs.program = 'Program is required';
    } else if (!['ptp', 'itp'].includes(formData.program)) {
      errs.program = 'Program must be ptp or itp';
    }
  } else if (formData.role === 'alumni') {
    if (!formData.firstName) {
      errs.firstName = 'First name is required';
    } else if (formData.firstName.length > 255) {
      errs.firstName = 'First name must be less than 256 characters';
    }
    if (!formData.lastName) {
      errs.lastName = 'Last name is required';
    } else if (formData.lastName.length > 255) {
      errs.lastName = 'Last name must be less than 256 characters';
    }
    if (!formData.username) {
      errs.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errs.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 50) {
      errs.username = 'Username must be less than 51 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errs.username = 'Username can only contain letters, numbers, and underscores';
    }
    if (!formData.phone) {
      errs.phone = 'Phone is required';
    } else if (formData.phone.length > 20) {
      errs.phone = 'Phone must be less than 21 characters';
    }
    if (!formData.branch) {
      errs.branch = 'ITI branch is required';
    }
    if (!formData.program) {
      errs.program = 'Program is required';
    } else if (!['ptp', 'itp'].includes(formData.program)) {
      errs.program = 'Program must be ptp or itp';
    }
  } else if (formData.role === 'company') {
    if (!formData.company_name) {
      errs.company_name = 'Company name is required';
    } else if (formData.company_name.length > 255) {
      errs.company_name = 'Company name must be less than 256 characters';
    }
    if (!formData.description) {
      errs.description = 'Description is required';
    }
    if (!formData.location) {
      errs.location = 'Location is required';
    } else if (formData.location.length > 255) {
      errs.location = 'Location must be less than 256 characters';
    }
    if (formData.industry && formData.industry.length > 255) {
      errs.industry = 'Industry must be less than 256 characters';
    }
    if (formData.company_size && formData.company_size.length > 50) {
      errs.company_size = 'Company size must be less than 51 characters';
    }
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      errs.website = 'Website must be a valid URL';
    }
    if (formData.established_at && isNaN(Date.parse(formData.established_at))) {
      errs.established_at = 'Established date must be a valid date';
    }
  }
  return errs;
}