import { NextRequest, NextResponse } from 'next/server';
import { DiscountCode } from '@/lib/discounts';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = 'Aces9292';
const GITHUB_REPO = 'sociale-fragrances';
const FILE_PATH = 'data/discounts.json';

async function getGitHubFile() {
  const response = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
    {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  
  const data = await response.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return { content: JSON.parse(content), sha: data.sha };
}

async function updateGitHubFile(content: any, sha: string, message: string) {
  const response = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
        sha
      })
    }
  );
  
  if (!response.ok) {
    throw new Error(`GitHub update error: ${response.status}`);
  }
  
  return await response.json();
}

// GET - Fetch all discount codes
export async function GET() {
  try {
    const { content } = await getGitHubFile();
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch discounts',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// POST - Update discount codes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { discounts, action } = body;
    
    // Get current file
    const { content: currentData, sha } = await getGitHubFile();
    
    let newData;
    let commitMessage;
    
    if (action === 'toggle') {
      // Toggle specific code
      const { code, active } = body;
      newData = {
        ...currentData,
        discounts: currentData.discounts.map((d: DiscountCode) => 
          d.code === code ? { ...d, active } : d
        ),
        lastUpdated: new Date().toISOString()
      };
      commitMessage = `${active ? 'Activate' : 'Deactivate'} discount code: ${code}`;
    } else if (action === 'create') {
      // Add new code
      newData = {
        ...currentData,
        discounts: [...currentData.discounts, discounts],
        lastUpdated: new Date().toISOString()
      };
      commitMessage = `Create discount code: ${discounts.code}`;
    } else if (action === 'delete') {
      // Delete code
      const { code } = body;
      newData = {
        ...currentData,
        discounts: currentData.discounts.filter((d: DiscountCode) => d.code !== code),
        lastUpdated: new Date().toISOString()
      };
      commitMessage = `Delete discount code: ${code}`;
    } else if (action === 'update-all') {
      // Update all codes
      newData = {
        discounts,
        lastUpdated: new Date().toISOString()
      };
      commitMessage = 'Update all discount codes';
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    // Commit to GitHub
    await updateGitHubFile(newData, sha, commitMessage);
    
    return NextResponse.json({ 
      success: true, 
      message: commitMessage,
      data: newData 
    });
    
  } catch (error) {
    console.error('Error updating discounts:', error);
    return NextResponse.json({ 
      error: 'Failed to update discounts',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}