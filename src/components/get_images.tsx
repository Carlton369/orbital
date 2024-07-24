import { storage, ref, getDownloadURL } from '../firebase';



export const getImageURL = async (imagePath: string): Promise<string> => {
  try {
    const imageRef = ref(storage, imagePath);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error('Error getting image URL:', error);
    throw error;
  }
};