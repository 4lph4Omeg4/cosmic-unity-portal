import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: 'rfih5t-ij.myshopify.com',
  apiVersion: '2024-10',
  publicAccessToken: 'ed47eb085cb7daa4e53db03042cfa29d',
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

    console.log('Testing Shopify API connection...');
    const response = await client.request(testQuery);
    console.log('Connection test successful:', response);
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
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
          products(first: 10) {
            edges {
              node {
                id
                title
                handle
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
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
  query getBlogArticles($handle: String!, $first: Int!) {
    blog(handle: $handle) {
      id
      title
      articles(first: $first) {
        edges {
          node {
            id
            title
            content
            excerpt
            handle
            publishedAt
            author {
              displayName
            }
            image {
              url
              altText
            }
            tags
          }
        }
      }
    }
  }
`;

export const GET_ALL_BLOGS = `
  query getAllBlogs($first: Int!) {
    blogs(first: $first) {
      edges {
        node {
          id
          title
          handle
          articles(first: 3) {
            edges {
              node {
                id
                title
                content
                excerpt
                handle
                publishedAt
                author {
                  displayName
                }
                image {
                  url
                  altText
                }
                tags
              }
            }
          }
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
export const fetchCollections = async () => {
  try {
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

export const fetchProducts = async (query?: string) => {
  try {
    const response = await client.request(GET_PRODUCTS, {
      variables: { first: 50, query }
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

export const fetchAllBlogs = async () => {
  try {
    const response = await client.request(GET_ALL_BLOGS, {
      variables: { first: 10 }
    });
    console.log('All blogs response:', response);
    return response.data?.blogs?.edges?.map((edge: any) => edge.node) || [];
  } catch (error) {
    console.error('Error fetching all blogs:', error);
    return [];
  }
};

export const fetchBlogArticles = async (blogHandle: string = 'ego-to-eden') => {
  try {
    console.log(`Fetching blog articles for handle: ${blogHandle}`);

    // Add timeout and retry logic
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await client.request(GET_BLOG_ARTICLES, {
      variables: { handle: blogHandle, first: 20 }
    });

    clearTimeout(timeoutId);
    console.log('Blog response:', response);

    if (!response.data?.blog) {
      console.warn(`Blog with handle "${blogHandle}" not found`);
      return [];
    }

    const articles = response.data.blog.articles?.edges?.map((edge: any) => edge.node) || [];
    console.log(`Found ${articles.length} articles`);
    return articles;
  } catch (error) {
    console.error('Error fetching blog articles:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      blogHandle
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
