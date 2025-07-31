import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: 'rfih5t-ij.myshopify.com',
  apiVersion: '2024-10',
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
  query getCollections($first: Int!) {
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
          products(first: 100) {
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

export const GET_PRODUCTS = `
  query getProducts($first: Int!, $query: String) {
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
  query getProduct($handle: String!) {
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
  query getBlogArticles($handle: String!, $first: Int!, $language: LanguageCode!) {
    blog(handle: $handle) @inContext(language: $language) {
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
  query getAllBlogs($first: Int!, $language: LanguageCode!) {
    blogs(first: $first) @inContext(language: $language) {
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
    console.log(`Fetching collections (language parameter: ${language}, but using standard query)`);
    
    console.log('Fetching collections...');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await client.request(GET_COLLECTIONS, {
      variables: { first: 20 }
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
    console.log(`Fetching products (language parameter: ${language}, but using standard query)`);
    
    const response = await client.request(GET_PRODUCTS, {
      variables: { first: 50 }
    });
    return response.data?.products?.edges?.map((edge: any) => edge.node) || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchProductByHandle = async (handle: string) => {
  try {
    const response = await client.request(GET_PRODUCT_BY_HANDLE, {
      variables: { handle }
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
    
    // Convert language codes to Shopify LanguageCode format
    const shopifyLanguage = language.toUpperCase() as 'NL' | 'EN' | 'DE';
    
    const response = await client.request(GET_ALL_BLOGS, {
      variables: { 
        first: 50,
        language: shopifyLanguage
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
    
    // Convert language codes to Shopify LanguageCode format
    const shopifyLanguage = language.toUpperCase() as 'NL' | 'EN' | 'DE';
    console.log(`Using Shopify language: ${shopifyLanguage}`);
    
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
        language: shopifyLanguage
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
