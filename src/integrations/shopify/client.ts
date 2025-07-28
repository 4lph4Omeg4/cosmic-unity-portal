import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: 'rfih5t-ij.myshopify.com',
  apiVersion: '2025-01',
  publicAccessToken: 'ed47eb085cb7daa4e53db03042cfa29d',
});

export { client as shopifyClient };

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
    const response = await client.request(GET_COLLECTIONS, {
      variables: { first: 20 }
    });
    return response.data?.collections?.edges?.map((edge: any) => edge.node) || [];
  } catch (error) {
    console.error('Error fetching collections:', error);
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

export const fetchBlogArticles = async (blogHandle: string = 'news') => {
  try {
    console.log(`Fetching blog articles for handle: ${blogHandle}`);
    const response = await client.request(GET_BLOG_ARTICLES, {
      variables: { handle: blogHandle, first: 20 }
    });
    console.log('Blog response:', response);
    const articles = response.data?.blog?.articles?.edges?.map((edge: any) => edge.node) || [];
    console.log(`Found ${articles.length} articles`);
    return articles;
  } catch (error) {
    console.error('Error fetching blog articles:', error);
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
