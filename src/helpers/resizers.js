const CLOUDINARY_URL = import.meta.env.VITE_AURAB_CLOUDINARY_URL

export const resize = ( image, size, folder ) => 
   `${CLOUDINARY_URL}/image/upload/w_${size}/Aura-B/${folder}/${image}.avif`