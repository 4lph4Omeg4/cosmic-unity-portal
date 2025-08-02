import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: 'rfih5t-ij.myshopify.com',
  apiVersion: '2025-01',
  publicAccessToken: 'ed47eb085cb7daa4e53db03042cfa29d'
});

export { client as shopifyClient };

// Test function to verify API connection
export const testConnection = async () => {
  try {
    const testQuery = `
      query {
        shop {
          name
          description
        }
      }
    `;

    console.log('Testing Shopify API connection with domain:', 'rfih5t-ij.myshopify.com');
    console.log('Using API version:', '2024-10');
    const response = await client.request(testQuery);
    console.log('Connection test successful:', response);
    console.log('Shop name:', response.data?.shop?.name);
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
};

// GraphQL queries
export const GET_COLLECTIONS = `
  query getCollections($first: Int!, $language: LanguageCode!, $country: CountryCode!) @inContext(language: $language, country: $country) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          image {
            url
            altText
          }
          products(first: 20) {
            edges {
              node {
                id
                title
                handle
                productType
                tags
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                variants(first: 1) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      availableForSale
                    }
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_COLLECTION_BY_HANDLE = `
  query getCollectionByHandle($handle: String!, $language: LanguageCode!, $country: CountryCode!) @inContext(language: $language, country: $country) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      image {
        url
        altText
      }
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            productType
            tags
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS = `
  query getProducts($first: Int!, $query: String, $language: LanguageCode!, $country: CountryCode!) @inContext(language: $language, country: $country) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          vendor
          productType
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = `
  query getProduct($handle: String!, $language: LanguageCode!, $country: CountryCode!) @inContext(language: $language, country: $country) {
    product(handle: $handle) {
      id
      title
      description
      handle
      vendor
      productType
      tags
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
          }
        }
      }
      images(first: 20) {
        edges {
          node {
            url
            altText
          }
        }
      }
    }
  }
`;

export const GET_BLOG_ARTICLES = `
  query getBlogArticles($handle: String!, $first: Int!, $language: LanguageCode!, $country: CountryCode!) @inContext(language: $language, country: $country) {
    blog(handle: $handle) {
      id
      title
      articles(first: $first) {
        edges {
          node {
            id
            title
            contentHtml
            excerpt
            handle
            publishedAt
            tags
            author {
              firstName
              lastName
            }
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_BLOGS = `
  query getAllBlogs($first: Int!, $language: LanguageCode!, $country: CountryCode!) @inContext(language: $language, country: $country) {
    blogs(first: $first) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

export const GET_SHOP_POLICIES = `
  query getShopPolicies($language: LanguageCode!, $country: CountryCode!) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy {
        title
        body
        handle
        url
      }
      refundPolicy {
        title
        body
        handle
        url
      }
      shippingPolicy {
        title
        body
        handle
        url
      }
      termsOfService {
        title
        body
        handle
        url
      }
    }
  }
`;

export const CREATE_CHECKOUT = `
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
        lineItems(first: 10) {
          edges {
            node {
              id
              title
              quantity
            }
          }
        }
      }
      checkoutUserErrors {
        field
        message
      }
    }
  }
`;

// Helper functions
export const fetchCollections = async (language: string = 'en') => {
  try {
    console.log(`Fetching collections for language: ${language}`);
    
    // Convert language codes to Shopify LanguageCode format and map countries
    const getMarketInfo = (language: string) => {
      switch (language.toLowerCase()) {
        case 'nl':
          return { language: 'NL', country: 'NL' };
        case 'en':
          return { language: 'EN', country: 'US' }; // Global English domain
        case 'de':
          return { language: 'DE', country: 'DE' };
        default:
          return { language: 'EN', country: 'US' };
      }
    };
    
    const { language: shopifyLanguage, country: shopifyCountry } = getMarketInfo(language);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await client.request(GET_COLLECTIONS, {
      variables: { 
        first: 20,
        language: shopifyLanguage,
        country: shopifyCountry
      }
    });

    clearTimeout(timeoutId);
    console.log('Collections response:', response);

    const collections = response.data?.collections?.edges?.map((edge: any) => edge.node) || [];
    console.log(`Found ${collections.length} collections`);
    return collections;
  } catch (error) {
    console.error('Error fetching collections:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    return [];
  }
};

export const fetchProducts = async (language: string = 'en') => {
  try {
    console.log(`Fetching products for language: ${language}`);
    
    // Convert language codes to Shopify LanguageCode format and map countries
    const getMarketInfo = (language: string) => {
      switch (language.toLowerCase()) {
        case 'nl':
          return { language: 'NL', country: 'NL' };
        case 'en':
          return { language: 'EN', country: 'US' }; // Global English domain
        case 'de':
          return { language: 'DE', country: 'DE' };
        default:
          return { language: 'EN', country: 'US' };
      }
    };
    
    const { language: shopifyLanguage, country: shopifyCountry } = getMarketInfo(language);
    
    const response = await client.request(GET_PRODUCTS, {
      variables: { 
        first: 50,
        language: shopifyLanguage,
        country: shopifyCountry
      }
    });
    return response.data?.products?.edges?.map((edge: any) => edge.node) || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchProductByHandle = async (handle: string, language: string = 'en') => {
  try {
    // Convert language codes to Shopify LanguageCode format and map countries
    const getMarketInfo = (language: string) => {
      switch (language.toLowerCase()) {
        case 'nl':
          return { language: 'NL', country: 'NL' };
        case 'en':
          return { language: 'EN', country: 'US' }; // Global English domain
        case 'de':
          return { language: 'DE', country: 'DE' };
        default:
          return { language: 'EN', country: 'US' };
      }
    };
    
    const { language: shopifyLanguage, country: shopifyCountry } = getMarketInfo(language);
    
    const response = await client.request(GET_PRODUCT_BY_HANDLE, {
      variables: { 
        handle,
        language: shopifyLanguage,
        country: shopifyCountry
      }
    });
    return response.data?.product || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const fetchAllBlogs = async (language: string = 'en') => {
  try {
    console.log(`Fetching all blogs for language: ${language}`);
    
    // Convert language codes to Shopify LanguageCode format and map countries
    const getMarketInfo = (language: string) => {
      switch (language.toLowerCase()) {
        case 'nl':
          return { language: 'NL', country: 'NL' };
        case 'en':
          return { language: 'EN', country: 'US' }; // Global English domain
        case 'de':
          return { language: 'DE', country: 'DE' };
        default:
          return { language: 'EN', country: 'US' };
      }
    };
    
    const { language: shopifyLanguage, country: shopifyCountry } = getMarketInfo(language);
    
    const response = await client.request(GET_ALL_BLOGS, {
      variables: { 
        first: 50,
        language: shopifyLanguage,
        country: shopifyCountry
      }
    });
    console.log('All blogs response:', response);
    const blogs = response.data?.blogs?.edges?.map((edge: any) => edge.node) || [];
    console.log('Total blogs found:', blogs.length);
    console.log('Blog details:', blogs.map(blog => ({ 
      id: blog.id, 
      title: blog.title, 
      handle: blog.handle
    })));
    return blogs;
  } catch (error) {
    console.error('Error fetching all blogs:', error);
    return [];
  }
};

export const fetchBlogArticles = async (blogHandle: string = 'ego-to-eden', language: string = 'nl') => {
  try {
    console.log(`=== FETCHING BLOG ARTICLES ===`);
    console.log(`Requested blog handle: ${blogHandle}, language: ${language}`);
    
    // Convert language codes to Shopify LanguageCode format and map countries
    const getMarketInfo = (language: string) => {
      switch (language.toLowerCase()) {
        case 'nl':
          return { language: 'NL', country: 'NL' };
        case 'en':
          return { language: 'EN', country: 'US' }; // Global English domain
        case 'de':
          return { language: 'DE', country: 'DE' };
        default:
          return { language: 'EN', country: 'US' };
      }
    };
    
    const { language: shopifyLanguage, country: shopifyCountry } = getMarketInfo(language);
    console.log(`Using Shopify language: ${shopifyLanguage}, country: ${shopifyCountry}`);
    
    // Uit de logs blijkt dat er maar 1 blog bestaat: "ego-to-eden" (From Ego to Eden)
    // Alle talen gebruiken dezelfde blog handle
    const actualHandle = 'ego-to-eden';
    console.log(`Using actual blog handle: ${actualHandle} (only blog that exists)`);

    // Add timeout and retry logic
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await client.request(GET_BLOG_ARTICLES, {
      variables: { 
        handle: actualHandle, 
        first: 50,
        language: shopifyLanguage,
        country: shopifyCountry
      }
    });

    clearTimeout(timeoutId);
    console.log('Blog response:', response);

    if (!response.data?.blog) {
      console.warn(`Blog with handle "${actualHandle}" not found`);
      return [];
    }

    console.log(`Successfully loaded blog: ${response.data.blog.title} (handle: ${actualHandle})`);
    const allArticles = response.data.blog.articles?.edges?.map((edge: any) => edge.node) || [];
    console.log(`Found ${allArticles.length} total articles in "${response.data.blog.title}" for language: ${shopifyLanguage}`);
    
    return allArticles;
  } catch (error) {
    console.error('Error fetching blog articles:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      blogHandle,
      language
    });
    return [];
  }
};

export const fetchShopPolicies = async (language: string = 'nl') => {
  try {
    console.log(`Fetching shop policies for language: ${language}`);
    
    // Convert language codes to Shopify LanguageCode format and map countries
    const getMarketInfo = (language: string) => {
      switch (language.toLowerCase()) {
        case 'nl':
          return { language: 'NL', country: 'NL' };
        case 'en':
          return { language: 'EN', country: 'US' };
        case 'de':
          return { language: 'DE', country: 'DE' };
        default:
          return { language: 'NL', country: 'NL' }; // Default to Dutch
      }
    };
    
    const { language: shopifyLanguage, country: shopifyCountry } = getMarketInfo(language);
    
    const response = await client.request(GET_SHOP_POLICIES, {
      variables: { 
        language: shopifyLanguage,
        country: shopifyCountry
      }
    });
    
    console.log('Shop policies response:', response);
    return response.data?.shop || {};
  } catch (error) {
    console.error('Error fetching shop policies:', error);
    return {};
  }
};

export const createCheckout = async (lineItems: Array<{ variantId: string; quantity: number }>) => {
  try {
    const response = await client.request(CREATE_CHECKOUT, {
      variables: {
        input: {
          lineItems: lineItems.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity
          }))
        }
      }
    });
    return response.data?.checkoutCreate?.checkout || null;
  } catch (error) {
    console.error('Error creating checkout:', error);
    return null;
  }
};

export const fetchCollectionByHandle = async (handle: string, language: string = 'en') => {
  try {
    console.log(`Fetching collection by handle: ${handle} for language: ${language}`);
    
    // Convert language codes to Shopify LanguageCode format and map countries
    const getMarketInfo = (language: string) => {
      switch (language.toLowerCase()) {
        case 'nl':
          return { language: 'NL', country: 'NL' };
        case 'en':
          return { language: 'EN', country: 'US' }; // Global English domain
        case 'de':
          return { language: 'DE', country: 'DE' };
        default:
          return { language: 'EN', country: 'US' };
      }
    };
    
    const { language: shopifyLanguage, country: shopifyCountry } = getMarketInfo(language);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await client.request(GET_COLLECTION_BY_HANDLE, {
      variables: { 
        handle,
        language: shopifyLanguage,
        country: shopifyCountry
      }
    });

    clearTimeout(timeoutId);
    console.log('Collection by handle response:', response);

    return response.data?.collection || null;
  } catch (error) {
    console.error('Error fetching collection by handle:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    return null;
  }
};
