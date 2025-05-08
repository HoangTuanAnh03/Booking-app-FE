import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { VenueImg } from '@/types/venue';
import { getAccessTokenFormLocalStorage } from '@/lib/utils';

interface CloudinaryResponse {
    secure_url: string;
    public_id: string;
}

interface UploadResult {
    url: string;
    public_id: string;
}

const token = getAccessTokenFormLocalStorage();
const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:8000/api"

async function handleResponse(response: Response) {
    if (!response.ok) {
      // Try to get error message from the response
      try {
        const errorData = await response.json()
        throw new Error(errorData.message || `API error: ${response.status}`)
      } catch (e) {
        throw new Error(`API error: ${response.status}`)
      }
    }
    return response.json()
  }



export async function POST(request: NextRequest) {
    try {
        const { images } = await request.json() as { images: string[] };

        if (!images || !Array.isArray(images) || images.length === 0) {
            return NextResponse.json(
                { error: 'Images are required and must be a non-empty array' },
                { status: 400 }
            );
        }

        // Upload tất cả ảnh song song
        const uploadPromises = images.map(async (imageBase64: string) => {
            // Upload lên Cloudinary
            const result = await cloudinary.uploader.upload(imageBase64, {
                folder: 'my-uploads',
            }) as CloudinaryResponse;

            return {
                url: result.secure_url,
                public_id: result.public_id
            } as UploadResult;
        });

        const uploadResults = await Promise.all(uploadPromises);

        return NextResponse.json({
            success: true,
            urls: uploadResults.map(result => result.url),
            publicIds: uploadResults.map(result => result.public_id)
        });
    } catch (error) {
        console.error('Error uploading images:', error);
        return NextResponse.json(
            { error: 'Failed to upload images' },
            { status: 500 }
        );
    }
    
}

export async function addVenueImgById(id: string): Promise<VenueImg[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/venue-images/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await handleResponse(res)
    return data.data || data
  } catch (error) {
    console.error(`Error add venue image ${id}:`, error)
    throw error
  }
}

