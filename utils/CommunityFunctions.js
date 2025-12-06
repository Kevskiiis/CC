// Generate Random Community Code:
import { nanoid } from 'nanoid';

export async function generateCommunityCode () {
    const randomCode = nanoid(15);
    return randomCode; 
}