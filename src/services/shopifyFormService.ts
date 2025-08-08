interface ShopifyFormData {
  email: string;
  firstName: string;
  lastName: string;
  consent: boolean;
}

export const submitToShopifyForm = async (data: ShopifyFormData): Promise<void> => {
  const formData = new FormData();
  
  // Add form fields for Shopify form ID 542459
  formData.append('form_type', 'customer');
  formData.append('utf8', '✓');
  formData.append('contact[email]', data.email);
  formData.append('contact[first_name]', data.firstName);
  formData.append('contact[last_name]', data.lastName);
  formData.append('contact[tags]', 'newsletter');
  
  // Add consent information
  if (data.consent) {
    formData.append('contact[accepts_marketing]', '1');
  }

  try {
    // Submit to Shopify form endpoint
    const response = await fetch('/contact#ContactForm-542459', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) {
      throw new Error(`Shopify form submission failed: ${response.status}`);
    }

    // Check if response indicates success
    const responseText = await response.text();
    if (responseText.includes('error') || responseText.includes('Error')) {
      throw new Error('Shopify form submission returned an error');
    }

  } catch (error) {
    console.error('Shopify form submission error:', error);
    throw error;
  }
};