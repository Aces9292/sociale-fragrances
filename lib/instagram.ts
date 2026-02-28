// Instagram Graph API Integration
const INSTAGRAM_API_URL = 'https://graph.facebook.com/v21.0';
const INSTAGRAM_BUSINESS_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '17841445465450536';
const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

export interface InstagramProfile {
  id: string;
  username: string;
  name?: string;
  profile_picture_url?: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
}

// Fetch recent Instagram posts
export async function getInstagramPosts(limit: number = 10): Promise<InstagramPost[]> {
  if (!PAGE_ACCESS_TOKEN) {
    throw new Error('Instagram access token not configured');
  }

  const url = `${INSTAGRAM_API_URL}/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&limit=${limit}&access_token=${PAGE_ACCESS_TOKEN}`;
  
  const response = await fetch(url, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!response.ok) {
    throw new Error(`Instagram API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data || [];
}

// Get Instagram profile info
export async function getInstagramProfile(): Promise<InstagramProfile> {
  if (!PAGE_ACCESS_TOKEN) {
    throw new Error('Instagram access token not configured');
  }

  const url = `${INSTAGRAM_API_URL}/${INSTAGRAM_BUSINESS_ACCOUNT_ID}?fields=id,username,name,profile_picture_url,followers_count,follows_count,media_count&access_token=${PAGE_ACCESS_TOKEN}`;
  
  const response = await fetch(url, {
    next: { revalidate: 600 }, // Cache for 10 minutes
  });

  if (!response.ok) {
    throw new Error(`Instagram API error: ${response.status}`);
  }

  return await response.json();
}

// Post an image to Instagram
export async function postToInstagram(imageUrl: string, caption: string): Promise<{ id: string }> {
  if (!PAGE_ACCESS_TOKEN) {
    throw new Error('Instagram access token not configured');
  }

  // Step 1: Create media container
  const createUrl = `${INSTAGRAM_API_URL}/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`;
  const createResponse = await fetch(createUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: imageUrl,
      caption: caption,
      access_token: PAGE_ACCESS_TOKEN,
    }),
  });

  if (!createResponse.ok) {
    const error = await createResponse.json();
    throw new Error(`Failed to create media: ${JSON.stringify(error)}`);
  }

  const { id: creationId } = await createResponse.json();

  // Step 2: Publish the container
  const publishUrl = `${INSTAGRAM_API_URL}/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish`;
  const publishResponse = await fetch(publishUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: PAGE_ACCESS_TOKEN,
    }),
  });

  if (!publishResponse.ok) {
    const error = await publishResponse.json();
    throw new Error(`Failed to publish media: ${JSON.stringify(error)}`);
  }

  return await publishResponse.json();
}

// Get insights for a specific post
export async function getPostInsights(postId: string): Promise<any> {
  if (!PAGE_ACCESS_TOKEN) {
    throw new Error('Instagram access token not configured');
  }

  const url = `${INSTAGRAM_API_URL}/${postId}/insights?metric=engagement,impressions,reach,saved&access_token=${PAGE_ACCESS_TOKEN}`;
  
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Instagram API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data || [];
}

// Download Instagram image to local storage
export async function downloadInstagramImage(imageUrl: string, filename: string): Promise<string> {
  // This would typically be done server-side with Node.js fs
  // For now, return the URL - implement download logic as needed
  return imageUrl;
}

// Get photos suitable for product pages
export async function getProductPhotos(limit: number = 20): Promise<InstagramPost[]> {
  const posts = await getInstagramPosts(limit);
  
  // Filter to IMAGE and CAROUSEL_ALBUM types (exclude videos)
  return posts.filter(post => 
    post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM'
  );
}
