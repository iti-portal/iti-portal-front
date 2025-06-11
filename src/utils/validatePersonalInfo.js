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
    if (!formData.phone) {
      errs.phone = 'Phone is required';
    } else if (formData.phone.length > 20) {
      errs.phone = 'Phone must be less than 21 characters';
    }
    if (!formData.governorate) {
      errs.governorate = 'Governorate is required';
    }
    if (formData.graduation_date && isNaN(Date.parse(formData.graduation_date))) {
      errs.graduation_date = 'Graduation date must be a valid date';
    }
    if (
      formData.student_status &&
      !['current', 'graduate'].includes(formData.student_status)
    ) {
      errs.student_status = 'Student status must be current or graduate';
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
    if (!formData.phone) {
      errs.phone = 'Phone is required';
    } else if (formData.phone.length > 20) {
      errs.phone = 'Phone must be less than 21 characters';
    }
    if (!formData.governorate) {
      errs.governorate = 'Governorate is required';
    }
    if (!formData.graduation_date) {
      errs.graduation_date = 'Graduation date is required';
    } else if (isNaN(Date.parse(formData.graduation_date))) {
      errs.graduation_date = 'Graduation date must be a valid date';
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
    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      errs.website = 'Website must be a valid URL';
    }
    if (formData.established_at && isNaN(Date.parse(formData.established_at))) {
      errs.established_at = 'Established date must be a valid date';
    }
  }
  return errs;
}